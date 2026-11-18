import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { Word } from "../analysis/transcribe";
import type { Facecam } from "../config";
import { FONTS_DIR, ensureDir } from "../paths";
import { run } from "../util/exec";
import { log } from "../util/log";
import { H, W, buildAss } from "./captions";

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

async function hasAudio(file: string): Promise<boolean> {
  const out = await run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]);
  return out.trim() !== "";
}

const f = (n: number) => n.toFixed(4);

/** Monta o filtergraph de vídeo que termina em [base] (1080x1920). */
export function videoGraph(layout: Layout, zoom: number, facecam?: Facecam): string {
  if (layout === "crop") return `[0:v]scale=-2:${H},crop=${W}:${H},setsar=1[base]`;
  if (layout === "split" && facecam) {
    const gameH = H - CAM_H;
    return [
      `[0:v]split=2[camsrc][gamesrc]`,
      `[camsrc]crop=iw*${f(facecam.w)}:ih*${f(facecam.h)}:iw*${f(facecam.x)}:ih*${f(facecam.y)},` +
        `scale=${W}:${CAM_H}:force_original_aspect_ratio=increase,crop=${W}:${CAM_H},setsar=1[cam]`,
      `[gamesrc]scale=-2:${gameH},crop=${W}:${gameH},setsar=1[game]`,
      `[cam][game]vstack=inputs=2[base]`,
    ].join(";");
  }
  const fgW = Math.round((W * zoom) / 2) * 2;
  return [
    `[0:v]split=2[bgsrc][fgsrc]`,
    `[bgsrc]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=luma_radius=40:luma_power=2,eq=brightness=-0.12[bg]`,
    `[fgsrc]scale=${fgW}:-2,crop=${W}:ih[fg]`,
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
        duration: o.duration,
        hookTitle: o.hookTitle,
        credit: o.credit,
        font: o.font,
        highlightColor: o.highlightColor,
        ...marginsFor(layout),
      }),
    );
    // Caminhos relativos (rodando o ffmpeg dentro do workDir) evitam problemas de escape no filtergraph.
    const fonts = existsSync(FONTS_DIR) ? `:fontsdir=${relative(o.workDir, FONTS_DIR).replace(/\\/g, "/") || "."}` : "";
    subsFilter = `ass=captions.ass${fonts}`;
  }

  const audio = await hasAudio(o.input);
  let graph = `${videoGraph(layout, o.zoom, o.facecam)};[base]${subsFilter}[v]`;
  if (audio) graph += `;[0:a]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=44100[a]`;

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
