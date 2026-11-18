import { readFile, stat } from "node:fs/promises";
import { requireEnv } from "../config";
import { waitForRedirect } from "./oauth";

/**
 * YouTube Data API v3 (oficial). Precisa de um projeto no Google Cloud com a
 * "YouTube Data API v3" ativada e um OAuth Client do tipo "Desktop app".
 * Rode `npm run clipper -- auth:youtube` uma vez para pegar o refresh token.
 *
 * Atenção: projetos ainda não auditados pelo Google sobem vídeos travados como
 * privados. Para publicar como público é preciso pedir a auditoria da API.
 */

const SCOPE = "https://www.googleapis.com/auth/youtube.upload";
const REDIRECT_PORT = 53682;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}/callback`;

async function tokenRequest(params: Record<string, string>): Promise<Record<string, string>> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });
  if (!res.ok) throw new Error(`Google OAuth falhou (${res.status}): ${await res.text()}`);
  return (await res.json()) as Record<string, string>;
}

async function accessToken(): Promise<string> {
  const j = await tokenRequest({
    client_id: requireEnv("YOUTUBE_CLIENT_ID"),
    client_secret: requireEnv("YOUTUBE_CLIENT_SECRET"),
    refresh_token: requireEnv("YOUTUBE_REFRESH_TOKEN"),
    grant_type: "refresh_token",
  });
  return j.access_token;
}

export async function uploadYouTube(
  file: string,
  meta: { title: string; description: string; tags: string[]; privacy: "private" | "unlisted" | "public" },
): Promise<{ id: string; url: string }> {
  const token = await accessToken();
  const size = (await stat(file)).size;
  const body = {
    snippet: {
      title: meta.title.slice(0, 100),
      description: meta.description.slice(0, 5000),
      tags: meta.tags.map((t) => t.replace(/^#/, "")).slice(0, 15),
      categoryId: "20", // Gaming
      defaultLanguage: "pt-BR",
      defaultAudioLanguage: "pt-BR",
    },
    status: { privacyStatus: meta.privacy, selfDeclaredMadeForKids: false },
  };

  const init = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Length": String(size),
        "X-Upload-Content-Type": "video/mp4",
      },
      body: JSON.stringify(body),
    },
  );
  const location = init.headers.get("location");
  if (!init.ok || !location) throw new Error(`YouTube init falhou (${init.status}): ${await init.text()}`);

  const put = await fetch(location, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": String(size) },
    body: await readFile(file),
  });
  if (!put.ok) throw new Error(`YouTube upload falhou (${put.status}): ${await put.text()}`);
  const j = (await put.json()) as { id: string };
  return { id: j.id, url: `https://www.youtube.com/shorts/${j.id}` };
}

/** Fluxo OAuth local: abre um servidorzinho em 127.0.0.1 e imprime o refresh token. */
export async function youtubeAuthFlow(): Promise<void> {
  const clientId = requireEnv("YOUTUBE_CLIENT_ID");
  const clientSecret = requireEnv("YOUTUBE_CLIENT_SECRET");
  const authUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
    });

  const params = await waitForRedirect(REDIRECT_URI, authUrl);
  const code = params.get("code")!;

  const j = await tokenRequest({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  });
  if (!j.refresh_token) throw new Error("O Google não devolveu refresh_token. Revogue o acesso do app na sua conta e tente de novo.");
  console.log(`\nColoque no seu .env:\n\nYOUTUBE_REFRESH_TOKEN=${j.refresh_token}\n`);
}
