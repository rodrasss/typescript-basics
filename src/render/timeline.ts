import type { Word } from "../analysis/transcribe";

/**
 * Linha do tempo de um corte com "buracos" (tempo morto removido).
 * Tempos absolutos = segundos no vídeo de origem; tempos de saída = segundos no vídeo final.
 */

export interface Range {
  start: number;
  end: number;
}

/** Trechos que ficam: [start, end] menos os cortes (ordenados e sem sobreposição). */
export function keepRanges(start: number, end: number, cuts: Range[]): Range[] {
  const sorted = cuts
    .map((c) => ({ start: Math.max(start, c.start), end: Math.min(end, c.end) }))
    .filter((c) => c.end > c.start)
    .sort((a, b) => a.start - b.start);
  const out: Range[] = [];
  let cursor = start;
  for (const c of sorted) {
    if (c.start > cursor) out.push({ start: cursor, end: c.start });
    cursor = Math.max(cursor, c.end);
  }
  if (end > cursor) out.push({ start: cursor, end });
  return out;
}

export function totalLength(ranges: Range[]): number {
  return ranges.reduce((a, r) => a + (r.end - r.start), 0);
}

/** Converte um tempo absoluto para o tempo no vídeo final (null se cair num corte). */
export function mapToOutput(t: number, keeps: Range[]): number | null {
  let acc = 0;
  for (const k of keeps) {
    if (t >= k.start && t <= k.end) return acc + (t - k.start);
    acc += k.end - k.start;
  }
  return null;
}

/** Palavras com tempo absoluto → tempo no vídeo final (descarta as que caíram nos cortes). */
export function remapWords(words: Word[], keeps: Range[]): Word[] {
  const out: Word[] = [];
  for (const w of words) {
    const mid = (w.start + w.end) / 2;
    const k = keeps.find((r) => mid >= r.start && mid <= r.end);
    if (!k) continue;
    const s = mapToOutput(Math.max(w.start, k.start), keeps)!;
    const e = mapToOutput(Math.min(w.end, k.end), keeps)!;
    out.push({ text: w.text, start: s, end: Math.max(e, s + 0.05) });
  }
  return out;
}

/** Janelas de zoom (absolutas) → tempo de saída, recortando o que cair em cortes. */
export function remapRanges(ranges: Range[], keeps: Range[]): Range[] {
  const out: Range[] = [];
  for (const r of ranges) {
    for (const k of keeps) {
      const s = Math.max(r.start, k.start);
      const e = Math.min(r.end, k.end);
      if (e - s >= 0.2) out.push({ start: mapToOutput(s, keeps)!, end: mapToOutput(e, keeps)! });
    }
  }
  return out;
}

/** Trechos relativos a um ponto de origem (ex.: início do arquivo baixado). */
export function shiftRanges(ranges: Range[], origin: number): Range[] {
  return ranges.map((r) => ({ start: r.start - origin, end: r.end - origin }));
}
