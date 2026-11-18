import { readFile } from "node:fs/promises";
import { env, requireEnv } from "../config";
import { sleep } from "../util/misc";

/**
 * Instagram Graph API (oficial) — Reels com upload resumable.
 * Precisa de conta Profissional (Criador ou Empresa) e um token de longa
 * duração com instagram_content_publish. Limite da Meta: ~50 posts por 24 h.
 */

function base(): string {
  const host = env("INSTAGRAM_GRAPH_HOST") ?? "graph.facebook.com";
  const version = env("INSTAGRAM_GRAPH_VERSION") ?? "v23.0";
  return `https://${host}/${version}`;
}

async function graph<T>(method: "GET" | "POST", path: string, params: Record<string, string>): Promise<T> {
  const token = requireEnv("INSTAGRAM_ACCESS_TOKEN");
  const qs = new URLSearchParams({ ...params, access_token: token });
  const res = await fetch(`${base()}/${path}?${qs}`, { method });
  const j = (await res.json()) as T & { error?: { message: string } };
  if (!res.ok || j.error) throw new Error(`Instagram ${path} falhou (${res.status}): ${j.error?.message ?? ""}`);
  return j;
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
  const uploadUrl = container.uri ?? `https://rupload.facebook.com/ig-api-upload/${env("INSTAGRAM_GRAPH_VERSION") ?? "v23.0"}/${container.id}`;
  const up = await fetch(uploadUrl, {
    method: "POST",
    headers: { Authorization: `OAuth ${token}`, offset: "0", file_size: String(data.length) },
    body: data,
  });
  if (!up.ok) throw new Error(`Instagram upload falhou (${up.status}): ${await up.text()}`);

  // 3) espera o processamento
  let status = "IN_PROGRESS";
  for (let i = 0; i < 60 && status !== "FINISHED"; i++) {
    await sleep(5000);
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
