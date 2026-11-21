import { randomUUID } from "node:crypto";

export function slug(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "x"
  );
}

export function shortId(): string {
  return randomUUID().replace(/-/g, "").slice(0, 8);
}

/** 3725.4 -> "1:02:05" ; 65 -> "1:05" */
export function hms(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(r).padStart(2, "0")}`;
}

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Repete fn com backoff exponencial quando shouldRetry(err) for true. */
export async function withRetry<T>(
  fn: () => Promise<T>,
  {
    tries = 4,
    baseMs = 2000,
    shouldRetry = () => true,
    delayFor,
  }: {
    tries?: number;
    baseMs?: number;
    shouldRetry?: (e: unknown) => boolean;
    /** espera sugerida pelo servidor (ms), ex.: "try again in 3s" */
    delayFor?: (e: unknown) => number | undefined;
  } = {},
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i === tries - 1 || !shouldRetry(e)) break;
      await sleep(delayFor?.(e) ?? baseMs * 2 ** i);
    }
  }
  throw last;
}

/** Executa tarefas com no máximo `limit` em paralelo, preservando a ordem do resultado. */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
