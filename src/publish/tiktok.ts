import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { env, requireEnv } from "../config";
import { DATA_DIR, ensureDir } from "../paths";
import { log } from "../util/log";
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

const PENDING = join(DATA_DIR, "tiktok-login-pendente.json");

function redirectUri(): string {
  return env("TIKTOK_REDIRECT_URI") ?? DEFAULT_REDIRECT;
}

/** Passo 1 do login: gera o link de autorização (e guarda o PKCE para o passo 2). */
export function tiktokAuthLink(): string {
  const clientKey = requireEnv("TIKTOK_CLIENT_KEY");
  const { verifier, challenge } = tiktokPkce();
  const state = randomState();
  ensureDir(DATA_DIR);
  writeFileSync(PENDING, JSON.stringify({ verifier, state, redirectUri: redirectUri(), at: Date.now() }));
  return (
    "https://www.tiktok.com/v2/auth/authorize/?" +
    new URLSearchParams({
      client_key: clientKey,
      response_type: "code",
      scope: env("TIKTOK_SCOPES") ?? SCOPES,
      redirect_uri: redirectUri(),
      state,
      code_challenge: challenge,
      code_challenge_method: "S256",
    })
  );
}

/** Passo 2 do login: recebe a URL para onde o TikTok redirecionou e troca o código pelos tokens. */
export async function tiktokAuthFinish(callback: string | URLSearchParams): Promise<void> {
  if (!existsSync(PENDING)) throw new Error("Nenhum login pendente. Gere o link de novo: npm run clipper -- auth:tiktok --link");
  const pending = JSON.parse(readFileSync(PENDING, "utf8")) as { verifier: string; state: string; redirectUri: string };
  const params = typeof callback === "string" ? new URL(callback.trim().replace(/#.*$/, "")).searchParams : callback;
  if (params.get("error")) throw new Error(`O TikTok recusou: ${params.get("error_description") ?? params.get("error")}`);
  const code = params.get("code");
  if (!code) throw new Error("Essa URL não tem o parâmetro code.");
  if (params.get("state") !== pending.state) throw new Error("state não confere (link antigo?). Gere o link de novo com --link.");
  const j = await tokenRequest({
    client_key: requireEnv("TIKTOK_CLIENT_KEY"),
    client_secret: requireEnv("TIKTOK_CLIENT_SECRET"),
    code,
    grant_type: "authorization_code",
    redirect_uri: pending.redirectUri,
    code_verifier: pending.verifier,
  });
  saveCache(j);
  rmSync(PENDING, { force: true });
  console.log(`\nLogin do TikTok salvo em ${TOKEN_CACHE} (escopos: ${j.scope}).`);
  console.log("O programa renova o acesso sozinho. Não apague esse arquivo (o refresh token muda a cada renovação).\n");
}

/** Login completo no mesmo terminal (abre o link e espera o retorno). */
export async function tiktokAuthFlow(): Promise<void> {
  const url = tiktokAuthLink();
  console.log(`\nRedirect URI usado (precisa estar cadastrado no app do TikTok, igualzinho): ${redirectUri()}`);
  const params = await waitForRedirect(redirectUri(), url);
  await tiktokAuthFinish(params);
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
): Promise<{ id: string; url?: string; note?: string; inbox?: boolean }> {
  const token = await accessToken();
  const data = await readFile(file);
  const size = data.length;
  const { chunkSize, count } = chunkPlan(size);
  const source_info = { source: "FILE_UPLOAD", video_size: size, chunk_size: chunkSize, total_chunk_count: count };

  let init: { publish_id: string; upload_url: string } | null = null;
  let mode = meta.mode;
  if (mode === "direct") {
    try {
      const creator = await call<{ privacy_level_options: string[] }>(token, "/v2/post/publish/creator_info/query/", {});
      const options = creator.privacy_level_options ?? [];
      if (!options.includes(meta.privacy)) {
        throw new Error(`unaudited: privacidade ${meta.privacy} indisponível (opções: ${options.join(", ") || "nenhuma"})`);
      }
      init = await call(token, "/v2/post/publish/video/init/", {
        post_info: {
          title: meta.caption.slice(0, 2200),
          privacy_level: meta.privacy,
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
          video_cover_timestamp_ms: 1000,
        },
        source_info,
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // sem a aprovação do TikTok, post direto só sai privado → manda para a caixa de entrada (público ao tocar em publicar)
      if (!/unaudited|privacy|private|scope_not_authorized|spam_risk/i.test(msg)) throw e;
      log.warn(`TikTok: post direto público ainda não liberado (${msg.slice(0, 120)}); mandando para a caixa de entrada.`);
      mode = "inbox";
    }
  }
  if (mode === "inbox") init = await call(token, "/v2/post/publish/inbox/video/init/", { source_info });
  if (!init) throw new Error("TikTok não iniciou o envio.");

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
      return { id: init.publish_id, inbox: true, note: "Na caixa de entrada do app do TikTok: abra o app, cole a legenda e publique." };
    }
    if (st.status === "PUBLISH_COMPLETE") {
      const postId = st.publicaly_available_post_id?.[0];
      return { id: String(postId ?? init.publish_id), url: postId ? `https://www.tiktok.com/video/${postId}` : undefined };
    }
    if (st.status === "FAILED") throw new Error(`TikTok recusou o vídeo: ${st.fail_reason ?? "sem motivo"}`);
  }
  return { id: init.publish_id, note: "TikTok ainda processando." };
}
