import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { env, requireEnv } from "../config";
import { DATA_DIR, ensureDir } from "../paths";
import { sleep } from "../util/misc";
import { randomState, tiktokPkce, waitForRedirect } from "./oauth";

/**
 * TikTok Content Posting API (oficial).
 * - modo "inbox" (padrão, escopo video.upload): o vídeo vai para a caixa de entrada do
 *   app do TikTok e você finaliza/publica de lá. Funciona sem auditoria.
 * - modo "direct" (escopo video.publish): publica direto. Sem auditoria do TikTok,
 *   só sai como privado (SELF_ONLY).
 *
 * Login: `npm run clipper -- auth:tiktok` (Login Kit for Desktop, com PKCE).
 */

const API = "https://open.tiktokapis.com";
const TOKEN_CACHE = join(DATA_DIR, "tiktok-token.json");
const DEFAULT_REDIRECT = "http://localhost:53683/callback/";
const SCOPES = "user.info.basic,video.upload,video.publish";

interface TokenCache {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  refresh_expires_at?: number;
  open_id?: string;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
  open_id?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

function readCache(): TokenCache | null {
  return existsSync(TOKEN_CACHE) ? (JSON.parse(readFileSync(TOKEN_CACHE, "utf8")) as TokenCache) : null;
}

function saveCache(j: TokenResponse, fallbackRefresh?: string): TokenCache {
  const now = Date.now();
  const cache: TokenCache = {
    access_token: j.access_token!,
    refresh_token: j.refresh_token ?? fallbackRefresh ?? "",
    expires_at: now + (j.expires_in ?? 3600) * 1000,
    refresh_expires_at: j.refresh_expires_in ? now + j.refresh_expires_in * 1000 : undefined,
    open_id: j.open_id,
  };
  ensureDir(DATA_DIR);
  writeFileSync(TOKEN_CACHE, JSON.stringify(cache, null, 2));
  return cache;
}

async function tokenRequest(params: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${API}/v2/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  const j = (await res.json()) as TokenResponse;
  if (!res.ok || !j.access_token) throw new Error(`TikTok OAuth falhou: ${j.error_description ?? j.error ?? res.status}`);
  return j;
}

/** Dias até o refresh token vencer (null se desconhecido). Usado pelo doctor. */
export function tiktokRefreshDaysLeft(): number | null {
  const c = readCache();
  return c?.refresh_expires_at ? Math.floor((c.refresh_expires_at - Date.now()) / 86_400_000) : null;
}

async function accessToken(): Promise<string> {
  const cache = readCache();
  if (cache && cache.expires_at > Date.now() + 5 * 60_000) return cache.access_token;

  // O refresh token "gira": cada renovação devolve um novo e o anterior para de valer.
  const refresh = cache?.refresh_token || env("TIKTOK_REFRESH_TOKEN");
  const clientKey = env("TIKTOK_CLIENT_KEY");
  const clientSecret = env("TIKTOK_CLIENT_SECRET");
  if (clientKey && clientSecret && refresh) {
    const j = await tokenRequest({
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: refresh,
    });
    return saveCache(j, refresh).access_token;
  }
  const direct = env("TIKTOK_ACCESS_TOKEN");
  if (direct) return direct;
  throw new Error("TikTok sem login. Rode: npm run clipper -- auth:tiktok");
}

export async function tiktokAuthFlow(): Promise<void> {
  const clientKey = requireEnv("TIKTOK_CLIENT_KEY");
  const clientSecret = requireEnv("TIKTOK_CLIENT_SECRET");
  const redirectUri = env("TIKTOK_REDIRECT_URI") ?? DEFAULT_REDIRECT;
  const { verifier, challenge } = tiktokPkce();
  const state = randomState();
  const authUrl =
    "https://www.tiktok.com/v2/auth/authorize/?" +
    new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: env("TIKTOK_SCOPES") ?? SCOPES,
      redirect_uri: redirectUri,
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

  console.log(`\nRedirect URI usado (precisa estar cadastrado no app do TikTok, igualzinho): ${redirectUri}`);
  const params = await waitForRedirect(redirectUri, authUrl);
  if (params.get("state") !== state) throw new Error("state não confere — tente de novo.");
  const j = await tokenRequest({
    client_key: clientKey,
    client_secret: clientSecret,
    code: decodeURIComponent(params.get("code")!),
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code_verifier: verifier,
  });
  saveCache(j);
  console.log(`\nLogin do TikTok salvo em ${TOKEN_CACHE} (escopos: ${j.scope}).`);
  console.log("O programa renova o acesso sozinho. Não apague esse arquivo (o refresh token muda a cada renovação).\n");
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

/**
 * Regras do TikTok: pedaços de 5 a 64 MB, o último pode ser maior (até 128 MB) e
 * total_chunk_count = floor(tamanho / chunk_size). Até 10 MB vai num pedaço só.
 */
export function chunkPlan(size: number, chunk = 10_000_000): { chunkSize: number; count: number } {
  if (size <= chunk) return { chunkSize: size, count: 1 };
  return { chunkSize: chunk, count: Math.floor(size / chunk) };
}

export async function uploadTikTok(
  file: string,
  meta: { caption: string; privacy: string; mode: "inbox" | "direct" },
): Promise<{ id: string; url?: string; note?: string }> {
  const token = await accessToken();
  const data = await readFile(file);
  const size = data.length;
  const { chunkSize, count } = chunkPlan(size);
  const source_info = { source: "FILE_UPLOAD", video_size: size, chunk_size: chunkSize, total_chunk_count: count };

  let init: { publish_id: string; upload_url: string };
  if (meta.mode === "inbox") {
    init = await call(token, "/v2/post/publish/inbox/video/init/", { source_info });
  } else {
    const creator = await call<{ privacy_level_options: string[] }>(token, "/v2/post/publish/creator_info/query/", {});
    const options = creator.privacy_level_options ?? [];
    const privacy = options.includes(meta.privacy) ? meta.privacy : options.includes("SELF_ONLY") ? "SELF_ONLY" : options[0];
    init = await call(token, "/v2/post/publish/video/init/", {
      post_info: {
        title: meta.caption.slice(0, 2200),
        privacy_level: privacy,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000,
      },
      source_info,
    });
  }

  for (let i = 0; i < count; i++) {
    const from = i * chunkSize;
    const to = i === count - 1 ? size - 1 : from + chunkSize - 1;
    const res = await fetch(init.upload_url, {
      method: "PUT",
      headers: {
        "Content-Type": "video/mp4",
        "Content-Length": String(to - from + 1),
        "Content-Range": `bytes ${from}-${to}/${size}`,
      },
      body: data.subarray(from, to + 1),
    });
    if (!res.ok) throw new Error(`TikTok upload (pedaço ${i + 1}/${count}) falhou (${res.status}): ${await res.text()}`);
  }

  for (let i = 0; i < 36; i++) {
    await sleep(5000);
    const st = await call<{ status: string; fail_reason?: string; publicaly_available_post_id?: Array<string | number> }>(
      token,
      "/v2/post/publish/status/fetch/",
      { publish_id: init.publish_id },
    );
    if (st.status === "SEND_TO_USER_INBOX") {
      return { id: init.publish_id, note: "Na caixa de entrada do app do TikTok: abra o app, finalize e publique." };
    }
    if (st.status === "PUBLISH_COMPLETE") {
      const postId = st.publicaly_available_post_id?.[0];
      return { id: String(postId ?? init.publish_id), url: postId ? `https://www.tiktok.com/video/${postId}` : undefined };
    }
    if (st.status === "FAILED") throw new Error(`TikTok recusou o vídeo: ${st.fail_reason ?? "sem motivo"}`);
  }
  return { id: init.publish_id, note: "TikTok ainda processando." };
}
