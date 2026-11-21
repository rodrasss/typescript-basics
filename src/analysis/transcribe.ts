import { openAsBlob } from "node:fs";
import { basename } from "node:path";
import { env, requireEnv } from "../config";
import { run } from "../util/exec";
import { sleep, withRetry } from "../util/misc";

/**
 * Transcrição com timestamps por palavra usando qualquer API compatível com
 * o endpoint /audio/transcriptions (formato Whisper):
 *  - Groq (padrão, barato e rápido): https://api.groq.com/openai/v1  modelo whisper-large-v3-turbo
 *  - OpenAI: https://api.openai.com/v1  modelo whisper-1
 *  - Local (ex.: servidor "speaches"/faster-whisper): http://localhost:8000/v1
 */

export interface Word {
  text: string;
  start: number;
  end: number;
}

export interface Segment {
  text: string;
  start: number;
  end: number;
}

export interface Transcript {
  text: string;
  segments: Segment[];
  words: Word[];
}

/** Recorta um trecho do áudio em mp3 mono 16 kHz (pequeno, aceito por todas as APIs). */
export async function extractAudio(src: string, start: number, duration: number, out: string): Promise<string> {
  await run("ffmpeg", [
    "-hide_banner", "-loglevel", "error", "-y",
    "-ss", start.toFixed(2), "-t", duration.toFixed(2), "-i", src,
    "-vn", "-ac", "1", "-ar", "16000", "-c:a", "libmp3lame", "-b:a", "48k",
    out,
  ]);
  return out;
}

class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    /** espera pedida pelo servidor, em ms */
    public retryAfterMs?: number,
  ) {
    super(message);
  }
}

/** Quanto esperar num 429: header retry-after ou "try again in 3.5s" / "in 1m2s" na mensagem. */
export function retryAfterMs(header: string | null, body: string): number | undefined {
  if (header && Number.isFinite(Number(header))) return Number(header) * 1000;
  const m = /try again in (?:(\d+)m)?([\d.]+)s/i.exec(body);
  if (m) return (Number(m[1] ?? 0) * 60 + Number(m[2])) * 1000;
  return undefined;
}

// O plano grátis do Groq aceita 20 transcrições por minuto: segura o ritmo aqui
// em vez de tomar erro 429 (lives longas têm 30+ candidatos).
const recent: number[] = [];
async function rateGate(): Promise<void> {
  const rpm = Number(env("TRANSCRIBE_RPM") ?? 18);
  for (;;) {
    const now = Date.now();
    while (recent.length && now - recent[0]! > 60_000) recent.shift();
    if (recent.length < rpm) break;
    await sleep(60_000 - (now - recent[0]!) + 200);
  }
  recent.push(Date.now());
}

export async function transcribe(file: string, language: string): Promise<Transcript> {
  const baseUrl = (env("TRANSCRIBE_BASE_URL") ?? "https://api.groq.com/openai/v1").replace(/\/$/, "");
  const model = env("TRANSCRIBE_MODEL") ?? "whisper-large-v3-turbo";
  const key = requireEnv("TRANSCRIBE_API_KEY");

  const json = await withRetry(
    async () => {
      const form = new FormData();
      form.append("file", await openAsBlob(file, { type: "audio/mpeg" }), basename(file));
      form.append("model", model);
      form.append("language", language);
      form.append("response_format", "verbose_json");
      form.append("timestamp_granularities[]", "word");
      form.append("timestamp_granularities[]", "segment");
      await rateGate();
      const res = await fetch(`${baseUrl}/audio/transcriptions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}` },
        body: form,
      });
      if (!res.ok) {
        const body = await res.text();
        throw new HttpError(res.status, `Transcrição falhou (${res.status}): ${body}`, retryAfterMs(res.headers.get("retry-after"), body));
      }
      return (await res.json()) as {
        text?: string;
        segments?: Array<{ start: number; end: number; text: string }>;
        words?: Array<{ word: string; start: number; end: number }>;
      };
    },
    {
      tries: 6,
      shouldRetry: (e) => !(e instanceof HttpError) || e.status === 429 || e.status >= 500,
      delayFor: (e) => (e instanceof HttpError && e.retryAfterMs !== undefined ? Math.min(e.retryAfterMs + 500, 90_000) : undefined),
    },
  );

  const segments = (json.segments ?? []).map((s) => ({ start: s.start, end: s.end, text: s.text.trim() }));
  let words = (json.words ?? [])
    .map((w) => ({ text: w.word.trim(), start: w.start, end: w.end }))
    .filter((w) => w.text !== "");
  if (words.length === 0) words = wordsFromSegments(segments);
  return { text: (json.text ?? "").trim(), segments, words };
}

/** Plano B quando a API não devolve palavras: distribui o tempo do segmento entre as palavras. */
export function wordsFromSegments(segments: Segment[]): Word[] {
  const out: Word[] = [];
  for (const s of segments) {
    const parts = s.text.split(/\s+/).filter(Boolean);
    const total = parts.reduce((a, p) => a + p.length, 0) || 1;
    let t = s.start;
    for (const p of parts) {
      const d = ((s.end - s.start) * p.length) / total;
      out.push({ text: p, start: t, end: t + d });
      t += d;
    }
  }
  return out;
}

/** Desloca todos os tempos (para converter de "dentro do trecho" para "dentro da live"). */
export function shiftTranscript(t: Transcript, offset: number): Transcript {
  return {
    text: t.text,
    segments: t.segments.map((s) => ({ ...s, start: s.start + offset, end: s.end + offset })),
    words: t.words.map((w) => ({ ...w, start: w.start + offset, end: w.end + offset })),
  };
}
