import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { excitementCurve, intensityProfile, loudnessPerSecond, pickPeaks } from "./analysis/loudness";
import { editClip, fromSelection, type EditDecision } from "./analysis/edit";
import { frameTimes, framesFromFile, framesFromHls, type Frame } from "./analysis/frames";
import { buildKnowledge } from "./analysis/knowledge";
import { selectClips, type Candidate, type SelectedClip } from "./analysis/select";
import { extractAudio, shiftTranscript, transcribe, type Word } from "./analysis/transcribe";
import { assertPermission, env, type Config, type Platform, type Streamer } from "./config";
import { OUTPUT_DIR, WORK_DIR, ensureDir } from "./paths";
import { publishClip } from "./publish";
import { renderClip } from "./render/render";
import { keepRanges, remapRanges, remapWords, shiftRanges, totalLength, type Range } from "./render/timeline";
import { getBroadcasterId, getTopClips } from "./sources/twitch";
import {
  channelPages,
  downloadAudio,
  downloadSection,
  downloadVideo,
  getInfo,
  listRecent,
  lowResHlsUrl,
  sourceKey,
} from "./sources/ytdlp";
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

/** Base de conhecimento para este streamer (manual + exemplos reais + suas decisões no painel). */
function knowledgeFor(ctx: Ctx, streamer: Streamer): string {
  return buildKnowledge({ streamer, clips: ctx.state.clips(), maxExamples: ctx.cfg.knowledge.maxExamples });
}

/** 2ª etapa (editor de IA). Se falhar, segue com a sugestão da triagem; se o editor descartar, devolve null. */
async function refine(
  ctx: Ctx,
  streamer: Streamer,
  knowledge: string,
  sourceTitle: string,
  sel: SelectedClip,
  data: { window: Range; words: Word[]; curve: number[]; frames: () => Promise<Frame[]>; minSeconds?: number },
): Promise<EditDecision | null> {
  const { cfg } = ctx;
  if (!cfg.clips.editPass) return fromSelection(sel);
  try {
    const frames = cfg.clips.editFrames > 0 ? await data.frames().catch(() => []) : [];
    const a = Math.max(0, Math.floor(data.window.start));
    const intensity = data.curve.slice(a, Math.ceil(data.window.end)).map((v) => Math.round(v));
    log.step(`Editor de IA refinando "${sel.title}"…`);
    const dec = await editClip({
      streamer,
      sourceTitle,
      knowledge,
      suggestion: sel,
      window: data.window,
      words: data.words,
      intensity,
      frames,
      minSeconds: data.minSeconds ?? cfg.clips.minSeconds,
      maxSeconds: cfg.clips.maxSeconds,
      allowCuts: cfg.render.allowCuts,
      punchZoom: cfg.render.punchZoom,
    });
    if (!dec) log.info(`O editor descartou "${sel.title}".`);
    return dec;
  } catch (e) {
    log.warn(`Editor de IA falhou (${errMsg(e).split("\n")[0]}); usando a sugestão da triagem.`);
    return fromSelection(sel);
  }
}

async function finalizeClip(
  ctx: Ctx,
  streamer: Streamer,
  source: ClipRecord["source"],
  dec: EditDecision,
  /** `inputStart` = segundo do vídeo de origem em que o arquivo `input` começa; `words` em tempo absoluto */
  render: { input: string; inputStart: number; words: Word[]; workDir: string },
  vod?: ClipRecord["vod"],
): Promise<ClipRecord> {
  const { cfg, state } = ctx;
  const id = shortId();
  const day = new Date().toISOString().slice(0, 10);
  const base = join(OUTPUT_DIR, slug(streamer.name), `${day}_${id}_${slug(dec.title).slice(0, 40)}`);
  const file = `${base}.mp4`;
  const keeps = keepRanges(dec.start, dec.end, dec.cuts);
  const finalLen = totalLength(keeps);

  const extras = [
    dec.cuts.length ? `${dec.cuts.length} corte(s) de tempo morto` : null,
    dec.zooms.length ? `${dec.zooms.length} zoom(s)` : null,
  ].filter(Boolean);
  log.step(`Renderizando ${id} (${finalLen.toFixed(0)}s, nota ${dec.score}${extras.length ? `, ${extras.join(", ")}` : ""}): ${dec.title}`);
  await renderClip({
    input: render.input,
    offset: dec.start - render.inputStart,
    duration: dec.end - dec.start,
    segments: dec.cuts.length ? shiftRanges(keeps, dec.start) : undefined,
    zooms: remapRanges(dec.zooms, keeps),
    words: remapWords(render.words, keeps),
    emphasis: dec.emphasis,
    emphasisColor: cfg.render.emphasisColor,
    hookTitle: cfg.render.hookTitle ? dec.hookTitle : undefined,
    credit: streamer.credit,
    layout: streamer.layout ?? cfg.render.layout,
    facecam: streamer.facecam,
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
    vod,
    start: dec.start,
    end: dec.end,
    score: dec.score,
    reason: dec.reason,
    hookTitle: dec.hookTitle,
    title: dec.title,
    caption: dec.caption,
    hashtags: dec.hashtags,
    file,
    ai: { hookTitle: dec.hookTitle, title: dec.title, caption: dec.caption },
    edit: { cuts: dec.cuts, zooms: dec.zooms, emphasis: dec.emphasis },
    createdAt: new Date().toISOString(),
    status: auto !== null && dec.score >= auto ? "approved" : "pending",
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

    const framesUrl = cfg.clips.frames > 0 ? await lowResHlsUrl(info.url) : null;
    if (cfg.clips.frames > 0 && !framesUrl) log.info("Frames indisponíveis para esta fonte (só HLS); o Claude vai usar só fala + volume.");

    log.step(framesUrl ? "Transcrevendo os candidatos e tirando frames…" : "Transcrevendo os candidatos…");
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
        frames: framesUrl
          ? await framesFromHls(framesUrl, frameTimes(start, end, cfg.clips.frames, p.t), work, `c${i + 1}`).catch(() => [])
          : undefined,
      };
      return { cand, words: tr.words };
    });
    const wordsById = new Map(transcribed.map((t) => [t.cand.id, t.words]));
    const candById = new Map(transcribed.map((t) => [t.cand.id, t.cand]));
    const knowledge = knowledgeFor(ctx, streamer);

    log.step("Claude escolhendo os melhores momentos…");
    const selected = (
      await selectClips({
        streamer,
        knowledge,
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
      const dup = state.overlaps(info.key, sel.start, sel.end);
      if (dup) {
        log.info(`Pulando ${hms(sel.start)}: já existe o corte ${dup.id} desse momento.`);
        continue;
      }
      const cand = candById.get(sel.candidateId)!;
      const words = wordsById.get(sel.candidateId) ?? [];
      const dec = await refine(ctx, streamer, knowledge, info.title, sel, {
        window: { start: cand.start, end: cand.end },
        words,
        curve,
        frames: async () =>
          framesUrl ? framesFromHls(framesUrl, frameTimes(sel.start, sel.end, cfg.clips.editFrames), work, `e-${cand.id}`) : [],
      });
      if (!dec || dec.score < cfg.clips.minScore) continue;

      const pad = 1;
      log.step(`Baixando trecho ${hms(dec.start)}–${hms(dec.end)}…`);
      const section = await downloadSection(info.url, Math.max(0, dec.start - pad), dec.end + pad, work, `trecho-${cand.id}`);
      out.push(
        await finalizeClip(
          ctx,
          streamer,
          { kind: "vod", key: info.key, url: info.url, title: info.title },
          dec,
          { input: section.path, inputStart: section.start, words, workDir: work },
          { key: info.key, start: dec.start, end: dec.end },
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
  const vodRef = (c: { video_id: string; vod_offset: number | null; duration: number }, a = 0, b = c.duration) =>
    c.video_id && c.vod_offset !== null
      ? { key: sourceKey("TwitchVod", `v${c.video_id}`), start: c.vod_offset + a, end: c.vod_offset + b }
      : undefined;
  const clips = (await getTopClips(broadcaster, days, 50))
    .filter((c) => c.duration >= 8 && !state.isDone(`twitch-clip:${c.id}`))
    .filter((c) => {
      const ref = vodRef(c);
      return !ref || !state.overlaps(ref.key, ref.start, ref.end);
    })
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
        frames:
          cfg.clips.frames > 0
            ? await framesFromFile(video, frameTimes(0, c.duration, cfg.clips.frames), work, `k${i + 1}`)
            : undefined,
      };
      return { clip: c, video, cand, words: tr.words, curve };
    });
    const byId = new Map(prepared.map((p) => [p.cand.id, p]));
    const knowledge = knowledgeFor(ctx, streamer);

    log.step("Claude avaliando os clipes…");
    const selected = (
      await selectClips({
        streamer,
        knowledge,
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
      const dec = await refine(ctx, streamer, knowledge, `clipe da Twitch "${p.clip.title}"`, sel, {
        window: { start: 0, end: p.clip.duration },
        words: p.words,
        curve: p.curve,
        frames: async () => framesFromFile(p.video, frameTimes(sel.start, sel.end, cfg.clips.editFrames), work, `e-${p.cand.id}`),
        minSeconds: Math.min(cfg.clips.minSeconds, 8),
      });
      if (!dec || dec.score < cfg.clips.minScore) continue;
      out.push(
        await finalizeClip(
          ctx,
          streamer,
          { kind: "twitch-clip", key: `twitch-clip:${p.clip.id}`, url: p.clip.url, title: p.clip.title },
          dec,
          { input: p.video, inputStart: 0, words: p.words, workDir: work },
          vodRef(p.clip, dec.start, dec.end),
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
