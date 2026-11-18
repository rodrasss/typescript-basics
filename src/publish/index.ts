import { existsSync } from "node:fs";
import { env, type Config, type Platform } from "../config";
import type { ClipRecord, State } from "../state";
import { log } from "../util/log";
import { errMsg } from "../util/misc";
import { uploadInstagram } from "./instagram";
import { uploadTikTok } from "./tiktok";
import { uploadYouTube } from "./youtube";

const REQUIRED: Record<Platform, string[][]> = {
  youtube: [["YOUTUBE_CLIENT_ID", "YOUTUBE_CLIENT_SECRET", "YOUTUBE_REFRESH_TOKEN"]],
  tiktok: [["TIKTOK_ACCESS_TOKEN"], ["TIKTOK_CLIENT_KEY", "TIKTOK_CLIENT_SECRET", "TIKTOK_REFRESH_TOKEN"]],
  instagram: [["INSTAGRAM_USER_ID", "INSTAGRAM_ACCESS_TOKEN"]],
};

/** A plataforma está configurada se algum dos conjuntos de variáveis estiver completo. */
export function isConfigured(p: Platform): boolean {
  return REQUIRED[p].some((set) => set.every((k) => env(k)));
}

export function postText(c: ClipRecord, cfg: Config): { caption: string; description: string; tags: string[] } {
  const tags = [...new Set([...c.hashtags, ...cfg.clips.hashtags].map((t) => t.toLowerCase()))].slice(0, 8);
  const caption = `${c.caption}\n\n🎥 ${c.credit}\n${tags.join(" ")}`;
  const description = `${c.caption}\n\nCrédito: ${c.credit}\nCorte da live: ${c.source.title}\n\n${tags.join(" ")}`;
  return { caption, description, tags };
}

export async function publishClip(c: ClipRecord, platforms: Platform[], cfg: Config, state: State): Promise<void> {
  if (!existsSync(c.file)) throw new Error(`Arquivo do corte não existe mais: ${c.file}`);
  const { caption, description, tags } = postText(c, cfg);

  for (const p of platforms) {
    if (c.posts[p]?.id) continue; // já postado
    if (!isConfigured(p)) {
      log.warn(`${p}: credenciais não configuradas, pulando.`);
      continue;
    }
    log.step(`Postando ${c.id} no ${p}…`);
    try {
      const r =
        p === "youtube"
          ? await uploadYouTube(c.file, {
              title: c.title.includes("#") ? c.title : `${c.title} #shorts`,
              description,
              tags,
              privacy: cfg.publish.youtubePrivacy,
            })
          : p === "tiktok"
            ? await uploadTikTok(c.file, { caption: `${c.title}\n\n${caption}`, privacy: cfg.publish.tiktokPrivacy })
            : await uploadInstagram(c.file, { caption: `${c.title}\n\n${caption}` });
      c.posts[p] = { at: new Date().toISOString(), id: r.id, url: r.url };
      log.ok(`${p}: ${r.url ?? r.id}`);
    } catch (e) {
      c.posts[p] = { at: new Date().toISOString(), error: errMsg(e) };
      log.error(`${p}: ${errMsg(e)}`);
    }
    state.update(c);
  }

  const configured = platforms.filter(isConfigured);
  if (configured.length > 0 && configured.every((p) => c.posts[p]?.id)) {
    c.status = "published";
    state.update(c);
  }
}
