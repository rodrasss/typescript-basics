import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { env, requireEnv } from "../config";
import { DATA_DIR, ensureDir } from "../paths";
import { sleep } from "../util/misc";

/**
 * TikTok Content Posting API (Direct Post, oficial).
 * Precisa de um app em developers.tiktok.com com o escopo video.publish.
 * Apps não auditados só conseguem postar como privado (SELF_ONLY) — depois
 * da auditoria do TikTok dá para postar público.
 */

const API = "https://open.tiktokapis.com";
const TOKEN_CACHE = join(DATA_DIR, "tiktok-token.json");
const MB = 1024 * 1024;

interface TokenCache {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

async function accessToken(): Promise<string> {
  const clientKey = env("TIKTOK_CLIENT_KEY");
  const clientSecret = env("TIKTOK_CLIENT_SECRET");
  const cache: TokenCache | null = existsSync(TOKEN_CACHE) ? JSON.parse(readFileSync(TOKEN_CACHE, "utf8")) : null;
  if (cache && cache.expires_at > Date.now() + 5 * 60_000) return cache.access_token;

  const refresh = cache?.refresh_token ?? env("TIKTOK_REFRESH_TOKEN");
  if (clientKey && clientSecret && refresh) {
    const res = await fetch(`${API}/v2/oauth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: "refresh_token",
        refresh_token: refresh,
      }),
    });
    const j = (await res.json()) as { access_token?: string; refresh_token?: string; expires_in?: number; error_description?: string };
    if (!res.ok || !j.access_token) throw new Error(`TikTok refresh falhou: ${j.error_description ?? res.status}`);
    ensureDir(DATA_DIR);
    writeFileSync(
      TOKEN_CACHE,
      JSON.stringify({ access_token: j.access_token, refresh_token: j.refresh_token ?? refresh, expires_at: Date.now() + (j.expires_in ?? 3600) * 1000 }),
    );
    return j.access_token;
  }
  return requireEnv("TIKTOK_ACCESS_TOKEN");
}

async function call<T>(token: string, path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body),
  });
  const j = (await res.json()) as { data: T; error?: { code: string; message: string } };
  if (!res.ok || (j.error && j.error.code !== "ok")) {
    throw new Error(`TikTok ${path} falhou (${res.status}): ${j.error?.code} ${j.error?.message ?? ""}`);
  }
  return j.data;
}

export async function uploadTikTok(
  file: string,
  meta: { caption: string; privacy: string },
): Promise<{ id: string; url?: string }> {
  const token = await accessToken();

  const creator = await call<{ privacy_level_options: string[]; max_video_post_duration_sec?: number }>(
    token,
    "/v2/post/publish/creator_info/query/",
    {},
  );
  const options = creator.privacy_level_options ?? [];
  const privacy = options.includes(meta.privacy) ? meta.privacy : options.includes("SELF_ONLY") ? "SELF_ONLY" : options[0];

  const data = await readFile(file);
  const size = data.length;
  // Até 64 MB vai num pedaço só; acima disso, pedaços de 10 MB (o último absorve o resto).
  const chunkSize = size <= 64 * MB ? size : 10 * MB;
  const chunks = size <= 64 * MB ? 1 : Math.floor(size / chunkSize);

  const init = await call<{ publish_id: string; upload_url: string }>(token, "/v2/post/publish/video/init/", {
    post_info: {
      title: meta.caption.slice(0, 2200),
      privacy_level: privacy,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
      video_cover_timestamp_ms: 1000,
    },
    source_info: { source: "FILE_UPLOAD", video_size: size, chunk_size: chunkSize, total_chunk_count: chunks },
  });

  for (let i = 0; i < chunks; i++) {
    const from = i * chunkSize;
    const to = i === chunks - 1 ? size - 1 : from + chunkSize - 1;
    const res = await fetch(init.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(to - from + 1),
        "Content-Range": `bytes ${from}-${to}/${size}`,
      },
      body: data.subarray(from, to + 1),
    });
    if (!res.ok) throw new Error(`TikTok upload (pedaço ${i + 1}/${chunks}) falhou (${res.status}): ${await res.text()}`);
  }

  // Espera o TikTok processar (até ~3 min).
  for (let i = 0; i < 36; i++) {
    await sleep(5000);
    const st = await call<{ status: string; fail_reason?: string; publicaly_available_post_id?: Array<string | number> }>(
      token,
      "/v2/post/publish/status/fetch/",
      { publish_id: init.publish_id },
    );
    if (st.status === "PUBLISH_COMPLETE") {
      const postId = st.publicaly_available_post_id?.[0];
      return { id: String(postId ?? init.publish_id), url: postId ? `https://www.tiktok.com/video/${postId}` : undefined };
    }
    if (st.status === "FAILED") throw new Error(`TikTok recusou o vídeo: ${st.fail_reason ?? "sem motivo"}`);
  }
  return { id: init.publish_id };
}
