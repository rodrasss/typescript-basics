import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { env, requireEnv } from "../config";
import { sleep } from "../util/misc";
import { randomState, waitForRedirect } from "./oauth";

/**
 * Instagram Reels pela API oficial da Meta ("Instagram API com login do Facebook").
 * É o único caminho da Meta que aceita enviar o arquivo do seu computador (upload
 * resumable em rupload.facebook.com); o "login do Instagram" exige o vídeo num link público.
 *
 * Requisitos: conta do Instagram Profissional ligada a uma Página do Facebook, e um app
 * na Meta com as permissões instagram_basic, instagram_content_publish, pages_show_list,
 * pages_read_engagement. Rode `npm run clipper -- auth:instagram` para pegar o token
 * da Página (não expira enquanto você não trocar a senha / remover o app).
 */

function version(): string {
  return env("INSTAGRAM_GRAPH_VERSION") ?? "v27.0";
}

function base(): string {
  return `https://${env("INSTAGRAM_GRAPH_HOST") ?? "graph.facebook.com"}/${version()}`;
}

async function getJson<T>(url: string, method: "GET" | "POST" = "GET"): Promise<T> {
  const res = await fetch(url, { method });
  const j = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok || j.error) throw new Error(`Meta API falhou (${res.status}): ${j.error?.message ?? ""}`);
  return j;
}

async function graph<T>(method: "GET" | "POST", path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams({ ...params, access_token: requireEnv("INSTAGRAM_ACCESS_TOKEN") });
  return getJson<T>(`${base()}/${path}?${qs}`, method);
}

export async function uploadInstagram(file: string, meta: { caption: string }): Promise<{ id: string; url?: string }> {
  const userId = requireEnv("INSTAGRAM_USER_ID");
  const token = requireEnv("INSTAGRAM_ACCESS_TOKEN");

  // 1) cria o container do Reel
  const container = await graph<{ id: string; uri?: string }>("POST", `${userId}/media`, {
    media_type: "REELS",
    upload_type: "resumable",
    caption: meta.caption.slice(0, 2200),
    share_to_feed: "true",
  });

  // 2) envia o arquivo para o endereço de upload devolvido
  const data = await readFile(file);
  const uploadUrl = container.uri ?? `https://rupload.facebook.com/ig-api-upload/${version()}/${container.id}`;
  const up = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `OAuth ${token}`, offset: "0", file_size: String(data.length) },
    body: data,
  });
  if (!up.ok) throw new Error(`Instagram upload falhou (${up.status}): ${await up.text()}`);

  // 3) espera o processamento (a Meta recomenda checar com calma)
  let status = "IN_PROGRESS";
  for (let i = 0; i < 40 && status !== "FINISHED"; i++) {
    await sleep(15_000);
    const st = await graph<{ status_code: string; status?: string }>("GET", container.id, { fields: "status_code,status" });
    status = st.status_code;
    if (status === "ERROR" || status === "EXPIRED") throw new Error(`Instagram não processou o vídeo: ${st.status ?? status}`);
  }
  if (status !== "FINISHED") throw new Error("Instagram demorou demais para processar o vídeo.");

  // 4) publica
  const pub = await graph<{ id: string }>("POST", `${userId}/media_publish`, { creation_id: container.id });
  const info = await graph<{ permalink?: string }>("GET", pub.id, { fields: "permalink" }).catch(() => ({ permalink: undefined }));
  return { id: pub.id, url: info.permalink };
}

const SCOPES = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,business_management";
const DEFAULT_REDIRECT = "http://localhost:53684/callback";

/**
 * Login da Meta → token longo do usuário → token da Página (não expira) + ID da conta do Instagram.
 * Com `userToken` (gerado no Graph API Explorer), pula o login no navegador.
 */
export async function instagramAuthFlow(userToken?: string): Promise<void> {
  const appId = requireEnv("META_APP_ID");
  const appSecret = requireEnv("META_APP_SECRET");
  const g = `https://graph.facebook.com/${version()}`;

  let shortToken = userToken;
  if (!shortToken) {
    const redirectUri = env("META_REDIRECT_URI") ?? DEFAULT_REDIRECT;
    const state = randomState();
    const configId = env("META_LOGIN_CONFIG_ID");
    const authUrl =
      `https://www.facebook.com/${version()}/dialog/oauth?` +
      new URLSearchParams({
        client_id: appId,
        redirect_uri: redirectUri,
        state,
        response_type: "code",
        ...(configId ? { config_id: configId } : { scope: SCOPES }),
      });
    console.log(`\nRedirect URI usado (cadastre em "URIs de redirecionamento do OAuth válidos" se pedir): ${redirectUri}`);
    const params = await waitForRedirect(redirectUri, authUrl);
    if (params.get("state") !== state) throw new Error("state não confere — tente de novo.");
    const tok = await getJson<{ access_token: string }>(
      `${g}/oauth/access_token?` +
        new URLSearchParams({ client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code: params.get("code")! }),
    );
    shortToken = tok.access_token;
  }

  // token de usuário de longa duração (~60 dias) → os tokens de Página derivados dele não expiram
  const long = await getJson<{ access_token: string }>(
    `${g}/oauth/access_token?` +
      new URLSearchParams({ grant_type: "fb_exchange_token", client_id: appId, client_secret: appSecret, fb_exchange_token: shortToken }),
  );
  const pages = await getJson<{
    data: Array<{ id: string; name: string; access_token: string; instagram_business_account?: { id: string; username?: string } }>;
  }>(`${g}/me/accounts?` + new URLSearchParams({ fields: "id,name,access_token,instagram_business_account{id,username}", access_token: long.access_token }));

  const withIg = pages.data.filter((p) => p.instagram_business_account);
  if (withIg.length === 0) {
    throw new Error(
      "Nenhuma Página com conta do Instagram ligada. Ligue a conta Profissional do Instagram a uma Página do Facebook e tente de novo.",
    );
  }
  let chosen = withIg[0];
  if (withIg.length > 1) {
    withIg.forEach((p, i) => console.log(`  [${i + 1}] ${p.name} → @${p.instagram_business_account!.username ?? p.instagram_business_account!.id}`));
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const ans = Number(await rl.question("Qual conta usar? (número): "));
    rl.close();
    chosen = withIg[Math.max(1, Math.min(withIg.length, ans || 1)) - 1];
  }
  const ig = chosen.instagram_business_account!;
  console.log(`\nConta: @${ig.username ?? "?"} (Página "${chosen.name}"). Coloque no seu .env:\n`);
  console.log(`INSTAGRAM_USER_ID=${ig.id}`);
  console.log(`INSTAGRAM_ACCESS_TOKEN=${chosen.access_token}\n`);
}
