import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { excitementCurve, intensityProfile, loudnessPerSecond, pickPeaks } from "./analysis/loudness";
import { selectClips, type Candidate, type SelectedClip } from "./analysis/select";
import { extractAudio, shiftTranscript, transcribe, type Word } from "./analysis/transcribe";
import { assertPermission, env, type Config, type Platform, type Streamer } from "./config";
import { OUTPUT_DIR, WORK_DIR, ensureDir } from "./paths";
import { publishClip } from "./publish";
import { renderClip } from "./render/render";
import { getBroadcasterId, getTopClips } from "./sources/twitch";
import { channelPages, downloadAudio, downloadSection, downloadVideo, getInfo, listRecent } from "./sources/ytdlp";
import type { ClipRecord, State } from "./state";
import { log } from "./util/log";
import { errMsg, hms, mapLimit, shortId, slug } from "./util/misc";

export interface Ctx {
  cfg: Config;
  state: State;
  /** não apaga os arquivos temporários (debug) */
  keepWork?: boolean;
  /** reprocessa mesmo se já foi feito */
  force?: boolean;
}

/** Quanto antes/depois do pico de volume entra na janela candidata (o setup vem antes da reação). */
const PRE_PEAK = 50;
const POST_PEAK = 25;
const MAX_FAILURES = 3;

function relativeWords(words: Word[], start: number, end: number): Word[] {
  return words
    .filter((w) => w.end > start && w.start < end)
    .map((w) => ({ text: w.text, start: w.start - start, end: w.end - start }));
}

async function finalizeClip(
  ctx: Ctx,
  streamer: Streamer,
  source: ClipRecord["source"],
  sel: SelectedClip,
  render: { input: string; offset: number; words: Word[]; workDir: string },
): Promise<ClipRecord> {
  const { cfg, state } = ctx;
  const id = shortId();
  const day = new Date().toISOString().slice(0, 10);
  const base = join(OUTPUT_DIR, slug(streamer.name), `${day}_${id}_${slug(sel.title).slice(0, 40)}`);
  const file = `${base}.mp4`;
  const duration = sel.end - sel.start;

  log.step(`Renderizando ${id} (${duration.toFixed(0)}s, nota ${sel.score}): ${sel.title}`);
  await renderClip({
    input: render.input,
    offset: render.offset,
    duration,
    words: render.words,
    hookTitle: cfg.render.hookTitle ? sel.hookTitle : undefined,
    credit: streamer.credit,
    layout: cfg.render.layout,
    zoom: cfg.render.zoom,
    captions: cfg.render.captions,
    font: cfg.render.font,
    highlightColor: cfg.render.highlightColor,
    preset: cfg.render.preset,
    output: file,
    workDir: join(render.workDir, `render-${id}`),
  });

  const auto = cfg.publish.autoApproveMinScore;
  const rec: ClipRecord = {
    id,
    streamer: streamer.name,
    credit: streamer.credit,
    source,
    start: sel.start,
    end: sel.end,
    score: sel.score,
    reason: sel.reason,
    hookTitle: sel.hookTitle,
    title: sel.title,
    caption: sel.caption,
    hashtags: sel.hashtags,
    file,
    createdAt: new Date().toISOString(),
    status: auto !== null && sel.score >= auto ? "approved" : "pending",
    posts: {},
  };
  writeFileSync(`${base}.json`, JSON.stringify(rec, null, 2));
  state.addClip(rec);
  log.ok(`Corte salvo: ${file}`);
  return rec;
}

/** VOD/vídeo inteiro: áudio → picos de volume → transcrição → Claude escolhe → baixa só os trechos → renderiza. */
export async function processVod(url: string, streamer: Streamer, ctx: Ctx): Promise<ClipRecord[]> {
  assertPermission(streamer);
  const { cfg, state } = ctx;
  log.step(`Lendo ${url}`);
  const info = await getInfo(url);
  if (info.isLive) throw new Error("Esse vídeo ainda está ao vivo; processe quando a live acabar.");
  if (state.isDone(info.key) && !ctx.force) {
    log.info(`Já processado antes: ${info.title} (use --force para refazer)`);
    return [];
  }

  const work = ensureDir(join(WORK_DIR, slug(info.key)));
  try {
    log.step(`Baixando o áudio de "${info.title}" (${hms(info.duration)})…`);
    const audio = await downloadAudio(info.url, work);

    log.step("Procurando picos de reação no áudio…");
    const db = await loudnessPerSecond(audio);
    const curve = excitementCurve(db);
    let peaks = pickPeaks(curve, { count: cfg.clips.candidates, minScore: 2 });
    if (peaks.length < 3) peaks = pickPeaks(curve, { count: cfg.clips.candidates, minScore: -Infinity });
    log.info(`${peaks.length} trechos candidatos encontrados.`);

    log.step("Transcrevendo os candidatos…");
    const transcribed = await mapLimit(peaks, 3, async (p, i) => {
      const start = Math.max(0, p.t - PRE_PEAK);
      const end = Math.min(db.length, p.t + POST_PEAK);
      const mp3 = await extractAudio(audio, start, end - start, join(work, `cand-${i + 1}.mp3`));
      const tr = shiftTranscript(await transcribe(mp3, cfg.clips.language), start);
      const cand: Candidate = {
        id: `c${i + 1}`,
        start,
        end,
        peakScore: p.score,
        intensity: intensityProfile(curve, start, end),
        segments: tr.segments,
      };
      return { cand, words: tr.words };
    });
    const wordsById = new Map(transcribed.map((t) => [t.cand.id, t.words]));

    log.step("Claude escolhendo os melhores momentos…");
    const selected = (
      await selectClips({
        streamer,
        sourceTitle: info.title,
        candidates: transcribed.map((t) => t.cand),
        maxClips: cfg.clips.perVideo,
        minSeconds: cfg.clips.minSeconds,
        maxSeconds: cfg.clips.maxSeconds,
      })
    ).filter((s) => s.score >= cfg.clips.minScore);
    log.info(`${selected.length} corte(s) com nota >= ${cfg.clips.minScore}.`);

    const out: ClipRecord[] = [];
    for (const sel of selected) {
      const pad = 1;
      const dlStart = Math.max(0, sel.start - pad);
      log.step(`Baixando trecho ${hms(sel.start)}–${hms(sel.end)}…`);
      const video = await downloadSection(info.url, dlStart, sel.end + pad, work, `trecho-${sel.candidateId}`);
      out.push(
        await finalizeClip(
          ctx,
          streamer,
          { kind: "vod", key: info.key, url: info.url, title: info.title },
          sel,
          {
            input: video,
            offset: sel.start - dlStart,
            words: relativeWords(wordsById.get(sel.candidateId) ?? [], sel.start, sel.end),
            workDir: work,
          },
        ),
      );
    }
    state.markDone(info.key);
    return out;
  } catch (e) {
    state.markFailed(info.key, errMsg(e));
    throw e;
  } finally {
    if (!ctx.keepWork) rmSync(work, { recursive: true, force: true });
  }
}

/** Clipes mais vistos da Twitch: a própria audiência já marcou o momento; o Claude refina, titula e legenda. */
export async function processTwitchClips(
  streamer: Streamer,
  ctx: Ctx,
  { days, limit }: { days: number; limit: number },
): Promise<ClipRecord[]> {
  assertPermission(streamer);
  if (!streamer.twitch) throw new Error(`"${streamer.name}" não tem login da Twitch no config.`);
  const { cfg, state } = ctx;

  log.step(`Buscando clipes mais vistos de ${streamer.twitch} (últimos ${days} dias)…`);
  const broadcaster = await getBroadcasterId(streamer.twitch);
  const clips = (await getTopClips(broadcaster, days, 50))
    .filter((c) => c.duration >= 8 && !state.isDone(`twitch-clip:${c.id}`))
    .slice(0, limit * 3);
  if (clips.length === 0) {
    log.info("Nenhum clipe novo.");
    return [];
  }

  const work = ensureDir(join(WORK_DIR, `twitch-clips-${slug(streamer.twitch)}-${Date.now()}`));
  try {
    const prepared = await mapLimit(clips, 3, async (c, i) => {
      const video = await downloadVideo(c.url, work, `clip-${i + 1}`);
      const mp3 = await extractAudio(video, 0, c.duration, join(work, `clip-${i + 1}.mp3`));
      const tr = await transcribe(mp3, cfg.clips.language);
      const curve = excitementCurve(await loudnessPerSecond(video));
      const cand: Candidate = {
        id: `k${i + 1}`,
        start: 0,
        end: c.duration,
        intensity: intensityProfile(curve, 0, c.duration),
        segments: tr.segments,
        note: `clipe da Twitch "${c.title}" — ${c.view_count} visualizações`,
      };
      return { clip: c, video, cand, words: tr.words };
    });
    const byId = new Map(prepared.map((p) => [p.cand.id, p]));

    log.step("Claude avaliando os clipes…");
    const selected = (
      await selectClips({
        streamer,
        sourceTitle: `clipes mais vistos da Twitch de ${streamer.name}`,
        candidates: prepared.map((p) => p.cand),
        maxClips: limit,
        minSeconds: Math.min(cfg.clips.minSeconds, 8),
        maxSeconds: cfg.clips.maxSeconds,
      })
    ).filter((s) => s.score >= cfg.clips.minScore);

    const out: ClipRecord[] = [];
    for (const sel of selected) {
      const p = byId.get(sel.candidateId)!;
      out.push(
        await finalizeClip(
          ctx,
          streamer,
          { kind: "twitch-clip", key: `twitch-clip:${p.clip.id}`, url: p.clip.url, title: p.clip.title },
          sel,
          { input: p.video, offset: sel.start, words: relativeWords(p.words, sel.start, sel.end), workDir: work },
        ),
      );
    }
    // Marca todos os avaliados para não gastar de novo com os que o Claude descartou.
    for (const c of clips) state.markDone(`twitch-clip:${c.id}`);
    return out;
  } finally {
    if (!ctx.keepWork) rmSync(work, { recursive: true, force: true });
  }
}

/** Uma rodada de automação: para cada streamer autorizado, processa VODs novos e clipes populares. */
export async function watchAll(ctx: Ctx): Promise<ClipRecord[]> {
  const { cfg, state } = ctx;
  const all: ClipRecord[] = [];
  const allowed = cfg.streamers.filter((s) => s.clipPermission);
  if (allowed.length === 0) log.warn("Nenhum streamer com clipPermission=true no config.");

  for (const s of allowed) {
    log.info(`=== ${s.name} ===`);
    for (const page of channelPages(s)) {
      try {
        const fresh = (await listRecent(page, 6)).filter(
          (v) => !v.isLive && !state.isDone(v.key) && state.failures(v.key) < MAX_FAILURES,
        );
        for (const v of fresh.slice(0, cfg.watch.videosPerRun)) {
          try {
            all.push(...(await processVod(v.url, s, ctx)));
          } catch (e) {
            log.error(`Falha em ${v.url}: ${errMsg(e)}`);
          }
        }
      } catch (e) {
        log.error(`Não consegui listar ${page}: ${errMsg(e)}`);
      }
    }
    if (s.twitch && cfg.watch.twitchClips && env("TWITCH_CLIENT_ID")) {
      try {
        all.push(
          ...(await processTwitchClips(s, ctx, { days: cfg.watch.twitchClipsDays, limit: cfg.watch.twitchClipsPerRun })),
        );
      } catch (e) {
        log.error(`Clipes da Twitch de ${s.name}: ${errMsg(e)}`);
      }
    }
  }
  return all;
}

/** Posta os cortes aprovados (mais antigos primeiro), até `limit` por execução. */
export async function publishApproved(
  ctx: Ctx,
  { platforms, limit, ids }: { platforms: Platform[]; limit: number; ids?: string[] },
): Promise<void> {
  const { cfg, state } = ctx;
  const queue = ids?.length
    ? ids.map((id) => state.getClip(id))
    : state
        .clips()
        .filter((c) => c.status === "approved")
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(0, limit);
  if (queue.length === 0) {
    log.info("Nada aprovado para postar. Use `approve <id>` ou configure publish.autoApproveMinScore.");
    return;
  }
  for (const c of queue) {
    if (c.status === "rejected") {
      log.warn(`${c.id} está rejeitado, pulando.`);
      continue;
    }
    await publishClip(c, platforms, cfg, state);
  }
}
