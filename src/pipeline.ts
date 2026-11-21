import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { excitementCurve, intensityProfile, loudnessPerSecond, pickPeaks } from "./analysis/loudness";
import { editClip, fromSelection, type EditDecision } from "./analysis/edit";
import { frameTimes, framesFromFile, framesFromHls, type Frame } from "./analysis/frames";
import { buildKnowledge } from "./analysis/knowledge";
import { selectClips, type Candidate, type SelectedClip } from "./analysis/select";
import { extractAudio, shiftTranscript, transcribe, type Word } from "./analysis/transcribe";
import { assertPermission, creditFor, env, type Config, type Platform, type Streamer } from "./config";
import { OUTPUT_DIR, WORK_DIR, ensureDir } from "./paths";
import { publishClip } from "./publish";
import { canPostNow, postTimes } from "./publish/schedule";
import { renderClip } from "./render/render";
import { keepRanges, remapRanges, remapWords, shiftRanges, totalLength, type Range } from "./render/timeline";
import { getBroadcasterId, getGameIds, getTopClips } from "./sources/twitch";
import { isTsPlaylist, loadMediaPlaylist, segmentsFor, writeSegments } from "./sources/hls";
import {
  channelPages,
  downloadAudio,
  downloadSection,
  downloadVideo,
  getInfo,
  hlsUrl,
  listRecent,
  liveChannels,
  liveInfo,
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

const MAX_FAILURES = 3;

/** Trechos da live com os jogos desejados (pelos capítulos da Twitch). null = sem filtro. */
export function gameRanges(
  chapters: Array<{ title: string; start: number; end: number }>,
  games: string[],
): Array<{ start: number; end: number }> | null {
  if (!games.length || !chapters.length) return null;
  const wanted = games.map((g) => g.toLowerCase());
  return chapters.filter((c) => wanted.includes(c.title.toLowerCase())).map((c) => ({ start: c.start, end: c.end }));
}

/**
 * Sem capítulos por jogo (Kick, YouTube): a live entra se a categoria for um dos jogos
 * ou se o título tiver uma das palavras-chave. Lista de jogos vazia = sempre entra.
 */
export function matchesGame(
  info: { title: string; categories: string[] },
  games: string[],
  keywords: string[],
): boolean {
  if (!games.length) return true;
  const wanted = games.map((g) => g.toLowerCase());
  if (info.categories.some((c) => wanted.includes(c.toLowerCase()))) return true;
  // palavras-chave no título e também na categoria (a Kick usa "Grand Theft Auto VI (GTA)")
  const title = `${info.title} ${info.categories.join(" ")}`.toLowerCase();
  return keywords.some((k) => new RegExp(`(^|[^\\p{L}\\p{N}])${k.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\p{L}\\p{N}]|$)`, "u").test(title));
}

/** Limites por streamer (para postar menos de alguém, por exemplo). */
function limitsFor(cfg: Config, s: Streamer): { perVideo: number; minScore: number } {
  return { perVideo: s.perVideo ?? cfg.clips.perVideo, minScore: s.minScore ?? cfg.clips.minScore };
}

/** Segundos de live que serão analisados (dentro dos trechos permitidos). */
export function analyzedSeconds(allowed: Range[] | null, start: number, end: number): number {
  if (!allowed) return Math.max(0, end - start);
  return allowed.reduce((s, r) => s + Math.max(0, Math.min(r.end, end) - Math.max(r.start, start)), 0);
}

/** Lives longas rendem mais cortes: perHour por hora, entre perVideo e maxPerVideo. */
export function scaledPerVideo(cfg: Config, perVideo: number, seconds: number): number {
  if (cfg.clips.perHour <= 0) return perVideo;
  return Math.max(perVideo, Math.min(cfg.clips.maxPerVideo, Math.ceil((seconds / 3600) * cfg.clips.perHour)));
}

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
      bottomText: cfg.render.bottomText,
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
  extra: { live?: boolean } = {},
): Promise<ClipRecord> {
  const { cfg, state } = ctx;
  const id = shortId();
  const credit = creditFor(streamer, source.url);
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
    bottomText: dec.bottomText,
    credit,
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
    credit,
    source,
    vod,
    start: dec.start,
    end: dec.end,
    score: dec.score,
    reason: dec.reason,
    hookTitle: dec.hookTitle,
    bottomText: dec.bottomText,
    title: dec.title,
    caption: dec.caption,
    hashtags: dec.hashtags,
    file,
    ai: { hookTitle: dec.hookTitle, title: dec.title, caption: dec.caption },
    edit: { cuts: dec.cuts, zooms: dec.zooms, emphasis: dec.emphasis },
    createdAt: new Date().toISOString(),
    status: auto !== null && dec.score >= auto ? "approved" : "pending",
    live: extra.live || undefined,
    posts: {},
  };
  writeFileSync(`${base}.json`, JSON.stringify(rec, null, 2));
  state.addClip(rec);
  log.ok(`Corte salvo: ${file}`);
  return rec;
}

/** VOD/vídeo inteiro: áudio → picos de volume → transcrição → Claude escolhe → baixa só os trechos → renderiza. */
export async function processVod(
  url: string,
  streamer: Streamer,
  ctx: Ctx,
  /** título visto na lista do canal (a Kick às vezes devolve as informações do VOD incompletas) */
  hint: { title?: string } = {},
): Promise<ClipRecord[]> {
  assertPermission(streamer);
  const { cfg, state } = ctx;
  log.step(`Lendo ${url}`);
  const info = await getInfo(url);
  if (info.isLive) throw new Error("Esse vídeo ainda está ao vivo; processe quando a live acabar.");
  if (state.isDone(info.key) && !ctx.force) {
    log.info(`Já processado antes: ${info.title} (use --force para refazer)`);
    return [];
  }
  const ranges = gameRanges(info.chapters, cfg.clips.games);
  if (ranges && ranges.length === 0) {
    log.info(`Pulando "${info.title}": nenhum trecho de ${cfg.clips.games.join(" / ")} (jogos: ${info.chapters.map((c) => c.title).join(", ")}).`);
    state.markDone(info.key);
    return [];
  }
  const titleForGame = `${info.title} ${hint.title ?? ""}`;
  if (!ranges && !matchesGame({ title: titleForGame, categories: info.categories }, cfg.clips.games, cfg.clips.gameKeywords)) {
    log.info(`Pulando "${info.title}": categoria (${info.categories.join(", ") || "?"}) e título não indicam ${cfg.clips.games.join(" / ")}.`);
    state.markDone(info.key);
    return [];
  }
  const { perVideo, minScore } = limitsFor(cfg, streamer);
  if (perVideo === 0) return [];

  // o que o modo ao vivo já analisou não é analisado de novo
  const liveUntil = state.liveUntil(info.key);
  let allowed = ranges;
  if (liveUntil !== undefined) {
    const rest = { start: liveUntil, end: Number.POSITIVE_INFINITY };
    allowed = (ranges ?? [rest]).map((r) => ({ start: Math.max(r.start, rest.start), end: r.end })).filter((r) => r.end > r.start);
    log.info(`O modo ao vivo já analisou até ${hms(liveUntil)}; vou olhar só o resto.`);
    if (!allowed.length) {
      state.markDone(info.key);
      return [];
    }
  }

  const work = ensureDir(join(WORK_DIR, slug(info.key)));
  try {
    log.step(`Baixando o áudio de "${info.title}" (${hms(info.duration)})…`);
    const audio = await downloadAudio(info.url, work);
    const framesUrl = cfg.clips.frames > 0 ? await lowResHlsUrl(info.url) : null;
    if (cfg.clips.frames > 0 && !framesUrl) log.info("Frames indisponíveis para esta fonte (só HLS); o Claude vai usar só fala + volume.");
    const out = await clipsFromAudio(ctx, streamer, { key: info.key, url: info.url, title: info.title }, {
      file: audio,
      offset: 0,
      allowed,
      framesUrl,
      work,
      perVideo,
      minScore,
      scale: streamer.perVideo === undefined,
    });
    state.markDone(info.key);
    return out;
  } catch (e) {
    state.markFailed(info.key, errMsg(e));
    throw e;
  } finally {
    if (!ctx.keepWork) rmSync(work, { recursive: true, force: true });
  }
}

/**
 * Do áudio aos cortes: picos de reação → transcrição + frames → triagem → editor → render.
 * `audio.offset` = segundo do vídeo de origem em que o arquivo de áudio começa (o modo ao vivo
 * analisa só um pedaço); `allowed` = trechos (tempo absoluto) onde pode haver pico.
 */
async function clipsFromAudio(
  ctx: Ctx,
  streamer: Streamer,
  src: { key: string; url: string; title: string },
  audio: {
    file: string;
    offset: number;
    allowed: Range[] | null;
    framesUrl: string | null;
    work: string;
    perVideo: number;
    minScore: number;
    live?: boolean;
    /** aumenta o limite de cortes conforme a duração analisada */
    scale?: boolean;
  },
): Promise<ClipRecord[]> {
  const { cfg, state } = ctx;
  const { file, offset, allowed, framesUrl, work, perVideo, minScore } = audio;

  log.step("Procurando picos de reação no áudio…");
  const db = await loudnessPerSecond(file);
  // curva indexada pelo segundo ABSOLUTO do vídeo (antes do offset fica vazio)
  const rel = excitementCurve(db);
  const curve = [...new Array<number>(Math.floor(offset)).fill(0), ...rel];
  const audioEnd = offset + db.length;
  const inAllowed = curve.map((v, t) =>
    t < offset ? -Infinity : !allowed || allowed.some((r) => t >= r.start && t < r.end) ? v : -Infinity,
  );
  if (allowed) log.info(`Analisando: ${allowed.map((r) => `${hms(r.start)}–${Number.isFinite(r.end) ? hms(r.end) : "fim"}`).join(", ")}`);
  const maxClips = audio.scale ? scaledPerVideo(cfg, perVideo, analyzedSeconds(allowed, offset, audioEnd)) : perVideo;
  const nCand = Math.min(45, Math.max(cfg.clips.candidates, maxClips * 3));
  if (maxClips > perVideo) log.info(`Live longa: até ${maxClips} cortes (${nCand} candidatos).`);
  let peaks = pickPeaks(inAllowed, { count: nCand, minScore: 2 });
  if (peaks.length < 3) peaks = pickPeaks(inAllowed, { count: nCand, minScore: -1e9 });
  log.info(`${peaks.length} trechos candidatos encontrados.`);
  if (!peaks.length) return [];

  log.step(framesUrl ? "Transcrevendo os candidatos e tirando frames…" : "Transcrevendo os candidatos…");
  const transcribed = await mapLimit(peaks, 3, async (p, i) => {
    const start = Math.max(offset, p.t - cfg.clips.windowBefore);
    const end = Math.min(audioEnd, p.t + cfg.clips.windowAfter);
    const mp3 = await extractAudio(file, start - offset, end - start, join(work, `cand-${i + 1}.mp3`));
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
      sourceTitle: src.title,
      candidates: transcribed.map((t) => t.cand),
      maxClips,
      minSeconds: cfg.clips.minSeconds,
      maxSeconds: cfg.clips.maxSeconds,
    })
  ).filter((s) => s.score >= minScore);
  log.info(`${selected.length} corte(s) com nota >= ${minScore}.`);

  const out: ClipRecord[] = [];
  for (const sel of selected) {
    const dup = state.overlaps(src.key, sel.start, sel.end);
    if (dup) {
      log.info(`Pulando ${hms(sel.start)}: já existe o corte ${dup.id} desse momento.`);
      continue;
    }
    const cand = candById.get(sel.candidateId)!;
    const words = wordsById.get(sel.candidateId) ?? [];
    const dec = await refine(ctx, streamer, knowledge, src.title, sel, {
      window: { start: cand.start, end: cand.end },
      words,
      curve,
      frames: async () =>
        framesUrl ? framesFromHls(framesUrl, frameTimes(sel.start, sel.end, cfg.clips.editFrames), work, `e-${cand.id}`) : [],
    });
    if (!dec || dec.score < minScore) continue;

    const pad = 1;
    log.step(`Baixando trecho ${hms(dec.start)}–${hms(dec.end)}…`);
    const section = await downloadSection(src.url, Math.max(0, dec.start - pad), dec.end + pad, work, `trecho-${cand.id}`);
    out.push(
      await finalizeClip(
        ctx,
        streamer,
        { kind: "vod", key: src.key, url: src.url, title: src.title },
        dec,
        { input: section.path, inputStart: section.start, words, workDir: work },
        { key: src.key, start: dec.start, end: dec.end },
        { live: audio.live },
      ),
    );
  }
  return out;
}

/**
 * Modo ao vivo: se o streamer está jogando GTA agora, analisa o trecho novo da live
 * (desde a última olhada) e gera os cortes na hora. Usa o vídeo em andamento da
 * Twitch/Kick, que já pode ser lido desde o começo da live.
 */
export async function processLive(streamer: Streamer, ctx: Ctx): Promise<ClipRecord[]> {
  assertPermission(streamer);
  const { cfg, state } = ctx;
  const lim = limitsFor(cfg, streamer);
  const perVideo = Math.min(lim.perVideo, cfg.live.perChunk);
  if (perVideo === 0) return [];
  const out: ClipRecord[] = [];

  for (const ch of liveChannels(streamer)) {
    const live = await liveInfo(ch.live);
    if (!live) continue;
    if (!matchesGame(live, cfg.clips.games, cfg.clips.gameKeywords)) {
      log.info(`${streamer.name} está ao vivo na ${ch.platform}, mas não em GTA (${live.categories.join(", ") || live.title}).`);
      continue;
    }
    // vídeo em andamento: a Kick marca com duração 0; na Twitch é o arquivo mais recente (de hoje)
    const vids = await listRecent(ch.videos, 3);
    const recent = (v: { timestamp?: number }) => !v.timestamp || Date.now() / 1000 - v.timestamp < 2 * 86_400;
    const vod = vids.find((v) => v.isLive) ?? (ch.platform === "twitch" && vids[0] && recent(vids[0]) ? vids[0] : undefined);
    if (!vod) {
      log.warn(`${streamer.name} está ao vivo na ${ch.platform}, mas não achei o vídeo da live em andamento (VODs desativados?).`);
      continue;
    }
    const audioUrl = await hlsUrl(vod.url, "worst[protocol^=m3u8]/b[protocol^=m3u8]");
    const loaded = audioUrl ? await loadMediaPlaylist(audioUrl) : null;
    if (!loaded) {
      log.warn(`${streamer.name}: não consegui ler a live em andamento.`);
      continue;
    }
    const last = loaded.pl.segments.at(-1)!;
    const total = last.start + last.duration;
    const from = state.liveUntil(vod.key) ?? Math.max(0, total - cfg.live.lookbackMinutes * 60);
    const to = total - 30;
    if (to - from < cfg.live.minChunkMinutes * 60) {
      log.info(`${streamer.name}: ${Math.max(0, (to - from) / 60).toFixed(0)} min novos de live; espero juntar ${cfg.live.minChunkMinutes}.`);
      continue;
    }

    log.step(`AO VIVO — ${streamer.name} (${ch.platform}): analisando ${hms(from)}–${hms(to)} de "${live.title}"`);
    const work = ensureDir(join(WORK_DIR, `live-${slug(vod.key)}`));
    try {
      const segs = segmentsFor(loaded.pl.segments, Math.max(0, from - cfg.clips.windowBefore), to);
      const file = await writeSegments(loaded.pl, segs, join(work, `audio.${isTsPlaylist(loaded.pl) ? "ts" : "mp4"}`));
      const framesUrl = cfg.clips.frames > 0 ? await lowResHlsUrl(vod.url) : null;
      out.push(
        ...(await clipsFromAudio(ctx, streamer, { key: vod.key, url: vod.url, title: live.title }, {
          file,
          offset: segs[0].start,
          allowed: [{ start: from, end: to }],
          framesUrl,
          work,
          perVideo,
          minScore: lim.minScore,
          live: true,
        })),
      );
      state.setLiveUntil(vod.key, to);
    } catch (e) {
      log.error(`Ao vivo ${streamer.name}: ${errMsg(e)}`);
    } finally {
      if (!ctx.keepWork) rmSync(work, { recursive: true, force: true });
    }
  }
  return out;
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
  const lim = limitsFor(cfg, streamer);
  limit = Math.min(limit, lim.perVideo);
  if (limit <= 0) return [];

  log.step(`Buscando clipes mais vistos de ${streamer.twitch} (últimos ${days} dias)…`);
  const broadcaster = await getBroadcasterId(streamer.twitch);
  const vodRef = (c: { video_id: string; vod_offset: number | null; duration: number }, a = 0, b = c.duration) =>
    c.video_id && c.vod_offset !== null
      ? { key: sourceKey("TwitchVod", `v${c.video_id}`), start: c.vod_offset + a, end: c.vod_offset + b }
      : undefined;
  const gameIds = cfg.clips.games.length ? await getGameIds(cfg.clips.games) : [];
  const clips = (await getTopClips(broadcaster, days, 50))
    .filter((c) => !gameIds.length || gameIds.includes(c.game_id))
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
    ).filter((s) => s.score >= lim.minScore);

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
      if (!dec || dec.score < lim.minScore) continue;
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
export async function watchAll(ctx: Ctx, opts: { live?: boolean; onlyLive?: boolean } = {}): Promise<ClipRecord[]> {
  const { cfg, state } = ctx;
  const all: ClipRecord[] = [];
  const allowed = cfg.streamers.filter((s) => s.clipPermission);
  if (allowed.length === 0) log.warn("Nenhum streamer com clipPermission=true no config.");

  for (const s of allowed) {
    log.info(`=== ${s.name} ===`);
    if (opts.live || opts.onlyLive) {
      try {
        all.push(...(await processLive(s, ctx)));
      } catch (e) {
        log.error(`Ao vivo ${s.name}: ${errMsg(e)}`);
      }
      if (opts.onlyLive) continue;
    }
    for (const page of channelPages(s)) {
      try {
        const fresh = (await listRecent(page, 6)).filter(
          (v) => !v.isLive && !state.isDone(v.key) && state.failures(v.key) < MAX_FAILURES,
        );
        for (const v of fresh.slice(0, cfg.watch.videosPerRun)) {
          try {
            all.push(...(await processVod(v.url, s, ctx, { title: v.title })));
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
  // ids informados à mão: posta já, sem esperar horário
  if (ids?.length) {
    for (const c of ids.map((id) => state.getClip(id))) {
      if (c.status === "rejected" || c.removed) {
        log.warn(`${c.id} está rejeitado/removido, pulando.`);
        continue;
      }
      await publishClip(c, platforms, cfg, state);
    }
    return;
  }
  // fila: cortes do ao vivo primeiro (mais novos primeiro), depois os de maior nota
  const queue = state
    .clips()
    .filter((c) => c.status === "approved" && !c.removed)
    .sort((a, b) =>
      a.live !== b.live ? (a.live ? -1 : 1) : a.live ? b.createdAt.localeCompare(a.createdAt) : b.score - a.score || a.createdAt.localeCompare(b.createdAt),
    );
  if (queue.length === 0) {
    log.info("Nada aprovado para postar. Use `approve <id>` ou configure publish.autoApproveMinScore.");
    return;
  }
  const history = postTimes(state.clips());
  let posted = 0;
  for (const c of queue) {
    if (posted >= limit) break;
    const check = canPostNow(new Date(), cfg.publish, history, !!c.live);
    if (!check.ok) {
      log.info(`Segurando ${c.id}: ${check.reason}.`);
      if (check.stop) break;
      continue;
    }
    await publishClip(c, platforms, cfg, state);
    history.push(Date.now());
    posted++;
  }
}
