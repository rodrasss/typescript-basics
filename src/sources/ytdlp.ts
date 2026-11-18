import { env } from "../config";
import { run } from "../util/exec";
import { downloadHlsSection } from "./hls";

/** Argumentos extras: cookies (lives só para inscritos, YouTube pedindo login) e o que mais vier em YTDLP_ARGS. */
function baseArgs(): string[] {
  const args = ["--no-playlist", "--no-warnings", "--concurrent-fragments", "8"];
  const cookies = env("YTDLP_COOKIES");
  if (cookies) args.push("--cookies", cookies);
  const extra = env("YTDLP_ARGS");
  if (extra) args.push(...extra.split(/\s+/));
  return args;
}

/** Chave estável para o estado: "twitch:v123", "youtube:abc". */
export function sourceKey(extractor: string, id: string): string {
  return `${extractor.toLowerCase().replace(/vod$/, "")}:${id}`;
}

export interface VideoInfo {
  /** Chave única, ex.: "twitch:v2345678" ou "youtube:dQw4w9WgXcQ". */
  key: string;
  id: string;
  title: string;
  duration: number;
  url: string;
  isLive: boolean;
}

export async function getInfo(url: string): Promise<VideoInfo> {
  const out = await run("yt-dlp", [...baseArgs(), "--dump-single-json", "--skip-download", url]);
  const j = JSON.parse(out) as Record<string, unknown>;
  return {
    key: sourceKey(String(j.extractor_key ?? j.extractor ?? "video"), String(j.id)),
    id: String(j.id),
    title: String(j.title ?? j.id),
    duration: Number(j.duration ?? 0),
    url: String(j.webpage_url ?? url),
    isLive: j.is_live === true || j.live_status === "is_live",
  };
}

export interface ListedVideo {
  key: string;
  id: string;
  url: string;
  title: string;
  isLive: boolean;
}

/** Lista os vídeos mais recentes de uma página de canal (VODs da Twitch, aba "Ao vivo" do YouTube...). */
export async function listRecent(pageUrl: string, limit: number): Promise<ListedVideo[]> {
  const out = await run("yt-dlp", [
    "--flat-playlist",
    "--dump-single-json",
    "--playlist-end",
    String(limit),
    "--no-warnings",
    pageUrl,
  ]);
  const j = JSON.parse(out) as { entries?: Array<Record<string, unknown>> };
  return (j.entries ?? [])
    .filter((e) => e.id && (e.url || e.webpage_url))
    .map((e) => ({
      key: sourceKey(String(e.ie_key ?? "video"), String(e.id)),
      id: String(e.id),
      url: String(e.webpage_url ?? e.url),
      title: String(e.title ?? e.id),
      isLive: e.live_status === "is_live" || e.is_live === true,
    }));
}

async function downloadTo(url: string, outTemplate: string, extra: string[]): Promise<string> {
  const out = await run("yt-dlp", [
    ...baseArgs(),
    ...extra,
    "-o",
    outTemplate,
    "--print",
    "after_move:filepath",
    url,
  ]);
  const path = out.trim().split("\n").filter(Boolean).pop();
  if (!path) throw new Error(`yt-dlp não informou o arquivo baixado para ${url}`);
  return path;
}

/** Baixa só o áudio (bem mais leve) para analisar a live inteira. */
export function downloadAudio(url: string, dir: string): Promise<string> {
  // Twitch tem o formato "Audio_Only"; no YouTube "ba" pega o m4a/webm de áudio.
  return downloadTo(url, `${dir}/audio.%(ext)s`, ["-f", "ba/worst"]);
}

/** URL direta da mídia escolhida pelo yt-dlp (uma por stream). */
async function mediaUrls(url: string, format: string): Promise<string[]> {
  const out = await run("yt-dlp", [...baseArgs(), "-f", format, "--get-url", url]);
  return out.trim().split("\n").filter(Boolean);
}

/** URL da playlist HLS (um stream com vídeo+áudio) no formato pedido, ou null se a fonte não for HLS. */
export async function hlsUrl(url: string, format: string): Promise<string | null> {
  try {
    const urls = await mediaUrls(url, format);
    return urls.length === 1 && /\.m3u8/i.test(urls[0]) ? urls[0] : null;
  } catch {
    return null;
  }
}

/** Playlist HLS em baixa resolução (para tirar frames rápido). */
export function lowResHlsUrl(url: string): Promise<string | null> {
  return hlsUrl(url, "worst[height>=360][protocol^=m3u8]/b[protocol^=m3u8]");
}

/**
 * Baixa só um trecho do vídeo.
 * - HLS (Twitch, Kick…): baixa direto os poucos segmentos que cobrem o trecho.
 * - Outros (YouTube…): usa o --download-sections do yt-dlp.
 * @returns o arquivo e o segundo do vídeo original em que ele começa.
 */
export async function downloadSection(
  url: string,
  start: number,
  end: number,
  dir: string,
  name: string,
): Promise<{ path: string; start: number }> {
  const playlist = await hlsUrl(url, "b[height<=1080][protocol^=m3u8]");
  if (playlist) {
    const hls = await downloadHlsSection(playlist, start, end, dir, name);
    if (hls) return hls;
  }
  const path = await downloadTo(url, `${dir}/${name}.%(ext)s`, [
    "-f",
    "bv*[height<=1080]+ba/b[height<=1080]/b",
    "--merge-output-format",
    "mp4",
    "--download-sections",
    `*${start.toFixed(2)}-${end.toFixed(2)}`,
    "--force-keyframes-at-cuts",
  ]);
  return { path, start };
}

export function downloadVideo(url: string, dir: string, name: string): Promise<string> {
  return downloadTo(url, `${dir}/${name}.%(ext)s`, [
    "-f",
    "bv*[height<=1080]+ba/b[height<=1080]/b",
    "--merge-output-format",
    "mp4",
  ]);
}

export function channelPages(s: { twitch?: string; youtube?: string }): string[] {
  const pages: string[] = [];
  if (s.twitch) pages.push(`https://www.twitch.tv/${s.twitch}/videos?filter=archives&sort=time`);
  if (s.youtube) {
    const handle = s.youtube.startsWith("@") ? s.youtube : `@${s.youtube}`;
    pages.push(`https://www.youtube.com/${handle}/streams`);
  }
  return pages;
}
