import { createWriteStream, rmSync } from "node:fs";
import { once } from "node:events";
import { join } from "node:path";
import { run } from "../util/exec";
import { mapLimit, withRetry } from "../util/misc";

/**
 * Baixa só os segmentos HLS que cobrem [start, end] de um VOD (Twitch, Kick…).
 *
 * É bem mais rápido e confiável do que pedir ao ffmpeg para "pular" dentro
 * de uma playlist de horas: só baixamos 2–8 arquivos pequenos e juntamos.
 */

export interface HlsSegment {
  uri: string;
  start: number;
  duration: number;
}

export interface MediaPlaylist {
  map?: string;
  segments: HlsSegment[];
  encrypted: boolean;
}

function attr(line: string, name: string): string | undefined {
  const m = new RegExp(`${name}=("([^"]*)"|[^,]*)`).exec(line);
  return m ? (m[2] ?? m[1]) : undefined;
}

export function parseMediaPlaylist(text: string, baseUrl: string): MediaPlaylist {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const segments: HlsSegment[] = [];
  let map: string | undefined;
  let encrypted = false;
  let pending: number | null = null;
  let t = 0;
  for (const line of lines) {
    if (line.startsWith("#EXT-X-MAP:")) {
      const uri = attr(line, "URI");
      if (uri) map = new URL(uri, baseUrl).href;
    } else if (line.startsWith("#EXT-X-KEY:")) {
      encrypted = (attr(line, "METHOD") ?? "NONE") !== "NONE";
    } else if (line.startsWith("#EXTINF:")) {
      pending = parseFloat(line.slice(8));
    } else if (line && !line.startsWith("#") && pending !== null) {
      segments.push({ uri: new URL(line, baseUrl).href, start: t, duration: pending });
      t += pending;
      pending = null;
    }
  }
  return { map, segments, encrypted };
}

/** Em uma master playlist, devolve a variante de maior bitrate. */
export function pickVariant(text: string, baseUrl: string): string | null {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  let best: { bw: number; url: string } | null = null;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].startsWith("#EXT-X-STREAM-INF:")) continue;
    const bw = Number(attr(lines[i], "BANDWIDTH") ?? 0);
    const next = lines.slice(i + 1).find((l) => l && !l.startsWith("#"));
    if (next && (!best || bw > best.bw)) best = { bw, url: new URL(next, baseUrl).href };
  }
  return best?.url ?? null;
}

export function segmentsFor(segments: HlsSegment[], start: number, end: number): HlsSegment[] {
  return segments.filter((s) => s.start + s.duration > start && s.start < end);
}

async function fetchBytes(url: string): Promise<Uint8Array> {
  return withRetry(async () => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
    return new Uint8Array(await res.arrayBuffer());
  });
}

async function fetchText(url: string): Promise<string> {
  return new TextDecoder().decode(await fetchBytes(url));
}

/** Carrega a media playlist (resolvendo master → maior bitrate). null se não der para usar. */
export async function loadMediaPlaylist(playlistUrl: string): Promise<{ url: string; pl: MediaPlaylist } | null> {
  let url = playlistUrl;
  let text = await fetchText(url);
  if (text.includes("#EXT-X-STREAM-INF")) {
    const variant = pickVariant(text, url);
    if (!variant) return null;
    url = variant;
    text = await fetchText(url);
  }
  const pl = parseMediaPlaylist(text, url);
  if (pl.encrypted || pl.segments.length === 0) return null;
  return { url, pl };
}

/** Baixa init + segmentos e grava concatenado (sem remux). */
export async function writeSegments(pl: MediaPlaylist, segs: HlsSegment[], file: string): Promise<string> {
  const parts = await mapLimit([...(pl.map ? [pl.map] : []), ...segs.map((s) => s.uri)], 4, fetchBytes);
  const out = createWriteStream(file);
  for (const p of parts) if (!out.write(p)) await once(out, "drain");
  out.end();
  await once(out, "finish");
  return file;
}

export function isTsPlaylist(pl: MediaPlaylist): boolean {
  return !pl.map && /\.ts(\?|$)/i.test(pl.segments[0]?.uri ?? "");
}

/**
 * @returns o arquivo .mp4 e o segundo do VOD em que ele começa,
 *          ou null se a fonte não for HLS sem criptografia (aí o chamador usa outro método).
 */
export async function downloadHlsSection(
  playlistUrl: string,
  start: number,
  end: number,
  dir: string,
  name: string,
): Promise<{ path: string; start: number } | null> {
  const loaded = await loadMediaPlaylist(playlistUrl);
  if (!loaded) return null;
  const { pl } = loaded;
  const segs = segmentsFor(pl.segments, start, end);
  if (segs.length === 0) throw new Error(`Trecho ${start}-${end}s fora do vídeo (duração ${pl.segments.at(-1)!.start}s).`);

  const raw = await writeSegments(pl, segs, join(dir, `${name}.raw.${isTsPlaylist(pl) ? "ts" : "mp4"}`));

  // Remuxa para um mp4 "normal" começando em t=0 (sem reencodar).
  const path = join(dir, `${name}.mp4`);
  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", raw, "-map", "0:v:0?", "-map", "0:a:0?", "-c", "copy",
    "-avoid_negative_ts", "make_zero", "-movflags", "+faststart", path,
  ]);
  rmSync(raw, { force: true });
  return { path, start: segs[0].start };
}
