import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import type { Word } from "../analysis/transcribe";
import { FONTS_DIR, ensureDir } from "../paths";
import { run } from "../util/exec";
import { H, W, buildAss } from "./captions";

export interface RenderOptions {
  input: string;
  /** segundo dentro de `input` onde o corte começa */
  offset: number;
  duration: number;
  /** palavras com tempo relativo ao início do corte */
  words: Word[];
  hookTitle?: string;
  credit?: string;
  layout: "blur" | "crop";
  zoom: number;
  captions: boolean;
  font: string;
  highlightColor: string;
  preset: string;
  output: string;
  /** pasta temporária para o arquivo .ass */
  workDir: string;
}

async function hasAudio(file: string): Promise<boolean> {
  const out = await run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]);
  return out.trim() !== "";
}

function videoGraph(layout: "blur" | "crop", zoom: number, subs: string | null): string {
  const fgW = Math.round((W * zoom) / 2) * 2;
  const parts =
    layout === "crop"
      ? [`[0:v]scale=-2:${H},crop=${W}:${H},setsar=1[base]`]
      : [
          `[0:v]split=2[bgsrc][fgsrc]`,
          `[bgsrc]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=luma_radius=40:luma_power=2,eq=brightness=-0.12[bg]`,
          `[fgsrc]scale=${fgW}:-2,crop=${W}:ih[fg]`,
          `[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[base]`,
        ];
  parts.push(subs ? `[base]${subs}[v]` : `[base]null[v]`);
  return parts.join(";");
}

/** Renderiza o corte em 1080x1920 (9:16), 30 fps, H.264 + AAC, áudio normalizado para -14 LUFS. */
export async function renderClip(o: RenderOptions): Promise<string> {
  ensureDir(o.workDir);
  ensureDir(dirname(o.output));

  let subsFilter: string | null = null;
  if (o.captions || o.hookTitle || o.credit) {
    const assPath = join(o.workDir, "captions.ass");
    writeFileSync(
      assPath,
      buildAss({
        words: o.captions ? o.words : [],
        duration: o.duration,
        hookTitle: o.hookTitle,
        credit: o.credit,
        font: o.font,
        highlightColor: o.highlightColor,
      }),
    );
    // Caminhos relativos (rodando o ffmpeg dentro do workDir) evitam problemas de escape no filtergraph.
    const fonts = existsSync(FONTS_DIR) ? `:fontsdir=${relative(o.workDir, FONTS_DIR).replace(/\\/g, "/") || "."}` : "";
    subsFilter = `ass=captions.ass${fonts}`;
  }

  const audio = await hasAudio(o.input);
  let graph = videoGraph(o.layout, o.zoom, subsFilter);
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
