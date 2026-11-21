import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { Word } from "../analysis/transcribe";
import type { Facecam } from "../config";
import { FONTS_DIR, ensureDir } from "../paths";
import { run } from "../util/exec";
import { log } from "../util/log";
import { H, W, buildAss } from "./captions";
import { totalLength, type Range } from "./timeline";

export type Layout = "blur" | "crop" | "split";

export interface RenderOptions {
  input: string;
  /** segundo dentro de `input` onde o corte começa */
  offset: number;
  duration: number;
  /** palavras com tempo relativo ao início do corte */
  words: Word[];
  hookTitle?: string;
  credit?: string;
  layout: Layout;
  /** obrigatório no layout "split" */
  facecam?: Facecam;
  zoom: number;
  captions: boolean;
  font: string;
  highlightColor: string;
  /** palavras-chave destacadas e a cor delas */
  emphasis?: string[];
  emphasisColor?: string;
  /**
   * Trechos que ficam, em segundos relativos ao início do corte (0 = `offset`).
   * Sem isso, usa o corte inteiro. Com vários, o tempo morto entre eles é removido.
   */
  segments?: Range[];
  /** zoom rápido de reação, no tempo do vídeo final */
  zooms?: Range[];
  preset: string;
  output: string;
  /** pasta temporária para o arquivo .ass */
  workDir: string;
}

/** Altura da faixa da câmera no layout split (o resto é o jogo). */
export const CAM_H = 640;

/** Posições do título, legenda e crédito para cada layout (px a partir do topo/fundo). */
export function marginsFor(layout: Layout): { hookMarginV: number; captionMarginV: number; creditMarginV: number } {
  return layout === "split"
    ? { hookMarginV: CAM_H - 50, captionMarginV: 560, creditMarginV: 420 }
    : { hookMarginV: 230, captionMarginV: 560, creditMarginV: 420 };
}

async function probe(file: string): Promise<{ audio: boolean; width: number; height: number }> {
  const out = await run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height", "-of", "json", file]);
  const streams = (JSON.parse(out) as { streams: Array<{ codec_type: string; width?: number; height?: number }> }).streams;
  const v = streams.find((x) => x.codec_type === "video");
  return { audio: streams.some((x) => x.codec_type === "audio"), width: v?.width ?? 0, height: v?.height ?? 0 };
}

/** Fator do zoom de reação: perceptível sem ser exagerado. */
export const PUNCH = 1.18;

/** Filtro de zoom rápido nas janelas dadas (tempo do vídeo final). Saída w×h fixa, 30 fps. */
export function punchFilter(zooms: Range[], w: number, h: number): string {
  if (!zooms.length) return "";
  const cond = zooms.map((z) => `between(it,${z.start.toFixed(2)},${z.end.toFixed(2)})`).join("+");
  return `,fps=30,zoompan=z='if(${cond},${PUNCH},1)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${w}x${h}:fps=30,setsar=1`;
}

/** Junta os trechos mantidos (trim + concat) e devolve os rótulos de vídeo/áudio resultantes. */
export function segmentsGraph(segments: Range[] | undefined, audio: boolean): { graph: string; v: string; a: string } {
  if (!segments || segments.length <= 1) return { graph: "", v: "[0:v]", a: "[0:a]" };
  const parts: string[] = [];
  const inputs: string[] = [];
  segments.forEach((r, i) => {
    const a = r.start.toFixed(3);
    const b = r.end.toFixed(3);
    parts.push(`[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS[sv${i}]`);
    if (audio) parts.push(`[0:a]atrim=start=${a}:end=${b},asetpts=PTS-STARTPTS[sa${i}]`);
    inputs.push(audio ? `[sv${i}][sa${i}]` : `[sv${i}]`);
  });
  parts.push(`${inputs.join("")}concat=n=${segments.length}:v=1:a=${audio ? 1 : 0}[cv]${audio ? "[ca]" : ""}`);
  return { graph: parts.join(";"), v: "[cv]", a: "[ca]" };
}

const f = (n: number) => n.toFixed(4);

/** Monta o filtergraph de vídeo que termina em [base] (1080x1920). */
export function videoGraph(
  layout: Layout,
  zoom: number,
  facecam?: Facecam,
  extra: { input?: string; zooms?: Range[]; srcW?: number; srcH?: number } = {},
): string {
  const input = extra.input ?? "[0:v]";
  const zooms = extra.zooms ?? [];
  if (layout === "crop") return `${input}scale=-2:${H},crop=${W}:${H},setsar=1${punchFilter(zooms, W, H)}[base]`;
  if (layout === "split" && facecam) {
    const gameH = H - CAM_H;
    return [
      `${input}split=2[camsrc][gamesrc]`,
      `[camsrc]crop=iw*${f(facecam.w)}:ih*${f(facecam.h)}:iw*${f(facecam.x)}:ih*${f(facecam.y)},` +
        `scale=${W}:${CAM_H}:force_original_aspect_ratio=increase,crop=${W}:${CAM_H},setsar=1[cam]`,
      `[gamesrc]scale=-2:${gameH},crop=${W}:${gameH},setsar=1${punchFilter(zooms, W, gameH)}[game]`,
      `[cam][game]vstack=inputs=2[base]`,
    ].join(";");
  }
  const fgW = Math.round((W * zoom) / 2) * 2;
  // altura do vídeo do meio: precisa ser conhecida para o zoom de reação ter tamanho fixo
  const fgH = extra.srcW && extra.srcH ? Math.round((extra.srcH * fgW) / extra.srcW / 2) * 2 : 0;
  const fg = fgH
    ? `[fgsrc]scale=${fgW}:${fgH},crop=${W}:${fgH}${punchFilter(zooms, W, fgH)}[fg]`
    : `[fgsrc]scale=${fgW}:-2,crop=${W}:ih[fg]`;
  return [
    `${input}split=2[bgsrc][fgsrc]`,
    `[bgsrc]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=luma_radius=40:luma_power=2,eq=brightness=-0.12[bg]`,
    fg,
    `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[base]`,
  ].join(";");
}

/** Renderiza o corte em 1080x1920 (9:16), 30 fps, H.264 + AAC, áudio normalizado para -14 LUFS. */
export async function renderClip(o: RenderOptions): Promise<string> {
  ensureDir(o.workDir);
  ensureDir(dirname(o.output));
  let layout = o.layout;
  if (layout === "split" && !o.facecam) {
    log.warn('Layout "split" sem facecam configurada para o streamer; usando "blur".');
    layout = "blur";
  }

  let subsFilter = "null";
  if (o.captions || o.hookTitle || o.credit) {
    writeFileSync(
      join(o.workDir, "captions.ass"),
      buildAss({
        words: o.captions ? o.words : [],
        duration: o.segments && o.segments.length > 1 ? totalLength(o.segments) : o.duration,
        hookTitle: o.hookTitle,
        credit: o.credit,
        font: o.font,
        highlightColor: o.highlightColor,
        emphasis: o.emphasis,
        emphasisColor: o.emphasisColor,
        ...marginsFor(layout),
      }),
    );
    // Caminhos relativos (rodando o ffmpeg dentro do workDir) evitam problemas de escape no filtergraph.
    const fonts = existsSync(FONTS_DIR) ? `:fontsdir=${relative(o.workDir, FONTS_DIR).replace(/\\/g, "/") || "."}` : "";
    subsFilter = `ass=captions.ass${fonts}`;
  }

  const src = await probe(o.input);
  const audio = src.audio;
  const seg = segmentsGraph(o.segments, audio);
  const vg = videoGraph(layout, o.zoom, o.facecam, { input: seg.v, zooms: o.zooms, srcW: src.width, srcH: src.height });
  let graph = `${seg.graph ? `${seg.graph};` : ""}${vg};[base]${subsFilter}[v]`;
  if (audio) graph += `;${seg.a}loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[a]`;

  await run(
    "ffmpeg",
    [
      "-hide_banner", "-loglevel", "error", "-y",
      "-ss", o.offset.toFixed(3), "-t", o.duration.toFixed(3), "-i", o.input,
      "-filter_complex", graph,
      "-map", "[v]",
      ...(audio ? ["-map", "[a]", "-c:a", "aac", "-b:a", "160k"] : []),
      "-c:v", "libx264", "-preset", o.preset, "-crf", "21", "-pix_fmt", "yuv420p", "-r", "30",
      "-movflags", "+faststart",
      o.output,
    ],
    { cwd: o.workDir },
  );
  return o.output;
}

/**
 * Gera um PNG com grade de 10% sobre um frame (para descobrir onde está a câmera)
 * e, se `facecam` for passado, uma prévia do layout split ao lado.
 */
export async function gridFrame(input: string, at: number, out: string, workDir: string, facecam?: Facecam): Promise<string[]> {
  ensureDir(workDir);
  ensureDir(dirname(out));
  // rótulos 10%..90% nas bordas, via ASS (usa o mesmo libass das legendas)
  const labels: string[] = [];
  for (let i = 1; i < 10; i++) {
    labels.push(`Dialogue: 0,0:00:00.00,0:00:10.00,L,,0,0,0,,{\\an7\\pos(${i * 192 + 6},6)}${i * 10}%`);
    labels.push(`Dialogue: 0,0:00:00.00,0:00:10.00,L,,0,0,0,,{\\an7\\pos(6,${i * 108 + 4})}${i * 10}%`);
  }
  writeFileSync(
    join(workDir, "grid.ass"),
    `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\n` +
      `Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n` +
      `Style: L,Arial,30,&H0000FFFF,&H0000FFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,3,0,7,0,0,0,1\n\n[Events]\n` +
      `Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${labels.join("\n")}\n`,
  );
  await run(
    "ffmpeg",
    [
      "-hide_banner", "-loglevel", "error", "-y", "-ss", at.toFixed(2), "-i", input, "-frames:v", "1",
      "-vf", "scale=1920:1080,drawgrid=w=192:h=108:t=2:c=yellow@0.6,ass=grid.ass",
      out,
    ],
    { cwd: workDir },
  );
  const outs = [out];
  if (facecam) {
    const preview = out.replace(/\.png$/i, "-split.png");
    await run(
      "ffmpeg",
      [
        "-hide_banner", "-loglevel", "error", "-y", "-ss", at.toFixed(2), "-i", input, "-frames:v", "1",
        "-filter_complex", `${videoGraph("split", 1, facecam)};[base]scale=540:960[v]`, "-map", "[v]",
        preview,
      ],
      { cwd: workDir },
    );
    outs.push(preview);
  }
  return outs;
}
