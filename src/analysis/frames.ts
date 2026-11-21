import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { isTsPlaylist, loadMediaPlaylist, segmentsFor, writeSegments } from "../sources/hls";
import { run } from "../util/exec";
import { clamp } from "../util/misc";

/** Um frame do vídeo de origem, para o Claude "ver" a cena. */
export interface Frame {
  /** segundo no vídeo de origem */
  t: number;
  path: string;
}

/** Espalha `n` frames pelo trecho, concentrados antes do pico (setup) e logo depois (reação). */
export function frameTimes(start: number, end: number, n: number, peak?: number): number[] {
  if (n <= 0) return [];
  const lo = peak !== undefined ? clamp(peak - 20, start, end) : start + (end - start) * 0.1;
  const hi = peak !== undefined ? clamp(peak + 4, start, end) : start + (end - start) * 0.9;
  if (n === 1) return [Math.round(peak ?? (start + end) / 2)];
  return Array.from({ length: n }, (_, i) => Math.round((lo + ((hi - lo) * i) / (n - 1)) * 10) / 10);
}

const hasFile = (p: string) => existsSync(p) && statSync(p).size > 0;

async function grab(file: string, at: number, out: string): Promise<string> {
  // perto do fim do arquivo o ffmpeg às vezes não acha frame e sai "com sucesso" sem gravar nada:
  // tenta um pouco antes e, se ainda assim não sair, o frame fica de fora
  for (const back of [0, 1.5, 4]) {
    await run("ffmpeg", [
      "-hide_banner", "-loglevel", "error", "-y",
      "-ss", Math.max(0, at - back).toFixed(2), "-i", file, "-frames:v", "1", "-vf", "scale=512:-2", "-q:v", "6", out,
    ]);
    if (hasFile(out)) return out;
  }
  throw new Error(`sem frame em ${at.toFixed(1)}s`);
}

/** Só os frames que realmente existem no disco. */
export function existingFrames(frames: Frame[]): Frame[] {
  return frames.filter((f) => hasFile(f.path));
}

/** Frames de um arquivo local; `offset` = segundo do vídeo de origem onde o arquivo começa. */
export async function framesFromFile(file: string, times: number[], dir: string, prefix: string, offset = 0): Promise<Frame[]> {
  const out: Frame[] = [];
  for (const [i, t] of times.entries()) {
    try {
      out.push({ t, path: await grab(file, t - offset, join(dir, `${prefix}-f${i + 1}.jpg`)) });
    } catch {
      // frame que falhar só fica de fora
    }
  }
  return out;
}

/** Frames de um VOD HLS remoto baixando só o segmento (em baixa resolução) de cada instante. */
export async function framesFromHls(playlistUrl: string, times: number[], dir: string, prefix: string): Promise<Frame[]> {
  const loaded = await loadMediaPlaylist(playlistUrl);
  if (!loaded) return [];
  const { pl } = loaded;
  const ext = isTsPlaylist(pl) ? "ts" : "mp4";
  const cache = new Map<number, string>();
  const out: Frame[] = [];
  for (const [i, t] of times.entries()) {
    const seg = segmentsFor(pl.segments, t, t + 0.01)[0];
    if (!seg) continue;
    try {
      let file = cache.get(seg.start);
      if (!file) {
        file = await writeSegments(pl, [seg], join(dir, `${prefix}-seg${cache.size + 1}.${ext}`));
        cache.set(seg.start, file);
      }
      out.push({ t, path: await grab(file, t - seg.start, join(dir, `${prefix}-f${i + 1}.jpg`)) });
    } catch {
      // segue sem esse frame
    }
  }
  return out;
}

export function frameBase64(f: Frame): string {
  return readFileSync(f.path).toString("base64");
}
