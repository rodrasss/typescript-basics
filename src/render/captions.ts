import type { Word } from "../analysis/transcribe";

/**
 * Gera legendas no formato ASS (libass/ffmpeg) no estilo dos cortes virais:
 * 2-3 palavras por vez, em caixa alta, com a palavra falada destacada.
 * Tempos em segundos relativos ao início do corte.
 */

export const W = 1080;
export const H = 1920;

export interface AssOptions {
  words: Word[];
  duration: number;
  hookTitle?: string;
  credit?: string;
  font?: string;
  /** hex RGB, ex.: "#FFE600" */
  highlightColor?: string;
  maxWords?: number;
  /** palavras-chave da piada (destacadas com outra cor) */
  emphasis?: string[];
  /** hex RGB da cor de destaque */
  emphasisColor?: string;
  /** texto curto embaixo do vídeo (ex.: "ESPERA O FINAL") */
  bottomText?: string;
  /** distâncias verticais (px) e âncoras — mudam conforme o layout (2 = medido de baixo, 8 = de cima) */
  hookMarginV?: number;
  captionMarginV?: number;
  captionAlign?: 2 | 8;
  footerMarginV?: number;
  footerAlign?: 2 | 8;
  creditMarginV?: number;
}

export function assTime(sec: number): string {
  const cs = Math.max(0, Math.round(sec * 100));
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
}

/** "#RRGGBB" -> "&H00BBGGRR" (ASS usa BGR) */
export function assColor(hex: string, alpha = 0): string {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  const rgb = m ? m[1] : "FFE600";
  const [r, g, b] = [rgb.slice(0, 2), rgb.slice(2, 4), rgb.slice(4, 6)];
  return `&H${alpha.toString(16).padStart(2, "0")}${b}${g}${r}`.toUpperCase();
}

/** "#RRGGBB" -> "&HBBGGRR&" (formato da tag inline \\c) */
export function inlineColor(hex: string): string {
  return `&H${assColor(hex).slice(4)}&`;
}

/** Normaliza uma palavra para comparar ("Polícia!" → "policia"). */
export function normWord(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

/** Texto seguro para a tela: sem tags ASS e sem emoji (o libass não desenha emoji colorido → viraria um quadrado). */
function escapeText(s: string): string {
  return s
    .replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/\\/g, "/")
    .replace(/\{/g, "(")
    .replace(/\}/g, ")")
    .replace(/\r?\n/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Agrupa palavras em blocos curtos, quebrando em pausas e pontuação. */
export function chunkWords(words: Word[], maxWords = 3, maxChars = 16, maxGap = 0.6): Word[][] {
  const chunks: Word[][] = [];
  let cur: Word[] = [];
  const chars = () => cur.reduce((a, w) => a + w.text.length + 1, 0);
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const gap = prev ? w.start - prev.end : 0;
    if (cur.length && (cur.length >= maxWords || chars() + w.text.length > maxChars || gap > maxGap)) {
      chunks.push(cur);
      cur = [];
    }
    cur.push(w);
    if (/[.!?…]$/.test(w.text)) {
      chunks.push(cur);
      cur = [];
    }
  }
  if (cur.length) chunks.push(cur);
  return chunks;
}

export function buildAss(o: AssOptions): string {
  const font = o.font ?? "Arial";
  const hl = inlineColor(o.highlightColor ?? "#FFE600");
  const em = inlineColor(o.emphasisColor ?? "#4DFF6A");
  const emphasis = new Set((o.emphasis ?? []).map(normWord).filter(Boolean));
  const header = `[Script Info]
ScriptType: v4.00+
PlayResX: ${W}
PlayResY: ${H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Caption,${font},86,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,-1,0,0,0,100,100,0,0,1,7,4,${o.captionAlign ?? 2},70,70,${o.captionMarginV ?? 470},1
Style: Hook,${font},68,&H00000000,&H00000000,&H00FFFFFF,&H00000000,-1,0,0,0,100,100,0,0,3,16,0,8,90,90,${o.hookMarginV ?? 230},1
Style: Footer,${font},50,&H00FFFFFF,&H00FFFFFF,&H50000000,&H00000000,-1,0,0,0,100,100,0,0,3,12,0,${o.footerAlign ?? 2},90,90,${o.footerMarginV ?? 395},1
Style: Credit,${font},40,&H30FFFFFF,&H30FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,3,0,2,60,60,${o.creditMarginV ?? 330},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
  const events: string[] = [];
  const end = assTime(o.duration);
  if (o.hookTitle) {
    events.push(`Dialogue: 1,${assTime(0)},${end},Hook,,0,0,0,,{\\fad(150,0)}${escapeText(o.hookTitle)}`);
  }
  if (o.bottomText) {
    // o rodapé ("ESPERA O FINAL") some no último quarto, quando o final chega
    const footerEnd = assTime(Math.max(Math.min(3, o.duration), o.duration * 0.75));
    events.push(`Dialogue: 1,${assTime(0)},${footerEnd},Footer,,0,0,0,,{\\fad(150,200)}${escapeText(o.bottomText)}`);
  }
  if (o.credit) {
    events.push(`Dialogue: 1,${assTime(0)},${end},Credit,,0,0,0,,${escapeText(o.credit)}`);
  }

  const words = o.words
    .filter((w) => w.end > 0 && w.start < o.duration)
    .map((w) => ({ ...w, start: Math.max(0, w.start), end: Math.min(o.duration, w.end) }));
  const chunks = chunkWords(words, o.maxWords ?? 3);
  chunks.forEach((chunk, ci) => {
    const nextStart = chunks[ci + 1]?.[0]?.start ?? o.duration;
    const chunkEnd = Math.min(nextStart, chunk[chunk.length - 1].end + 0.35, o.duration);
    const texts = chunk.map((w) => escapeText(w.text.toUpperCase()));
    const isEm = chunk.map((w) => emphasis.has(normWord(w.text)));
    chunk.forEach((w, wi) => {
      const s = w.start;
      const e = wi < chunk.length - 1 ? chunk[wi + 1].start : chunkEnd;
      if (e - s < 0.04) return;
      const line = texts
        .map((t, ti) =>
          ti === wi
            ? `{\\c${isEm[ti] ? em : hl}\\fscx${isEm[ti] ? 122 : 112}\\fscy${isEm[ti] ? 122 : 112}}${t}{\\r}`
            : isEm[ti]
              ? `{\\c${em}}${t}{\\r}`
              : t,
        )
        .join(" ");
      events.push(`Dialogue: 0,${assTime(s)},${assTime(e)},Caption,,0,0,0,,${line}`);
    });
  });
  return header + events.join("\n") + "\n";
}
