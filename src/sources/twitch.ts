import { requireEnv } from "../config";

/** API oficial da Twitch (Helix) com token de app (client credentials). */

let cached: { token: string; expiresAt: number } | null = null;

async function appToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.token;
  const params = new URLSearchParams({
    client_id: requireEnv("TWITCH_CLIENT_ID"),
    client_secret: requireEnv("TWITCH_CLIENT_SECRET"),
    grant_type: "client_credentials",
  });
  const res = await fetch(`https://id.twitch.tv/oauth2/token?${params}`, { method: "POST" });
  if (!res.ok) throw new Error(`Twitch token falhou (${res.status}): ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: j.access_token, expiresAt: Date.now() + j.expires_in * 1000 };
  return j.access_token;
}

async function helix<T>(path: string, params: Record<string, string>): Promise<T> {
  const res = await fetch(`https://api.twitch.tv/helix/${path}?${new URLSearchParams(params)}`, {
    headers: { "Client-Id": requireEnv("TWITCH_CLIENT_ID"), Authorization: `Bearer ${await appToken()}` },
  });
  if (!res.ok) throw new Error(`Twitch ${path} falhou (${res.status}): ${await res.text()}`);
  return (await res.json()) as T;
}

export async function getBroadcasterId(login: string): Promise<string> {
  const j = await helix<{ data: Array<{ id: string }> }>("users", { login });
  const id = j.data[0]?.id;
  if (!id) throw new Error(`Canal da Twitch "${login}" não encontrado.`);
  return id;
}

export interface TwitchClip {
  id: string;
  url: string;
  title: string;
  view_count: number;
  created_at: string;
  duration: number;
  creator_name: string;
  game_id: string;
}

/** Clipes mais vistos do canal nos últimos `days` dias (a Twitch já devolve ordenado por views). */
export async function getTopClips(broadcasterId: string, days: number, first = 20): Promise<TwitchClip[]> {
  const startedAt = new Date(Date.now() - days * 86_400_000).toISOString();
  const j = await helix<{ data: TwitchClip[] }>("clips", {
    broadcaster_id: broadcasterId,
    started_at: startedAt,
    ended_at: new Date().toISOString(),
    first: String(Math.min(100, first)),
  });
  return j.data;
}
