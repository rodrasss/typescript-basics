import type { BetaContentBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { z } from "zod";
import { normWord } from "../render/captions";
import { totalLength, keepRanges, type Range } from "../render/timeline";
import { askClaude, effort } from "./claude";
import { existingFrames, frameBase64, type Frame } from "./frames";
import { fitToWindow, normalizeTag, type SelectedClip } from "./select";
import type { Word } from "./transcribe";

/**
 * 2ª etapa: o "editor". Para cada corte escolhido na triagem, olha a fala
 * palavra por palavra, a intensidade segundo a segundo e mais frames, e decide
 * o início/fim exatos, o que cortar de tempo morto, onde dar o zoom de reação,
 * quais palavras destacar e o texto final (gancho, título, legenda).
 */

export interface EditDecision extends SelectedClip {
  /** trechos (tempo absoluto) removidos de dentro do corte */
  cuts: Range[];
  /** janelas (tempo absoluto) com zoom de reação */
  zooms: Range[];
  /** palavras-chave destacadas na legenda */
  emphasis: string[];
  /** texto curto embaixo do vídeo (opcional) */
  bottomText?: string;
}

const EditSchema = z.object({
  keep: z.boolean(),
  score: z.number(),
  start: z.number(),
  end: z.number(),
  cuts: z.array(z.object({ start: z.number(), end: z.number(), why: z.string() })),
  zooms: z.array(z.object({ at: z.number(), duration: z.number() })),
  emphasis: z.array(z.string()),
  hook_title: z.string(),
  bottom_text: z.string(),
  title: z.string(),
  caption: z.string(),
  hashtags: z.array(z.string()),
  reason: z.string(),
});
type RawEdit = z.infer<typeof EditSchema>;

const INSTRUCTIONS = `Você é o editor final de um corte curto (TikTok / Reels / Shorts) de uma live brasileira de GTA. A triagem já escolheu este momento; agora você decide a edição. Siga o manual e os exemplos da base de conhecimento no fim deste prompt.

Você recebe:
- a sugestão da triagem (início, fim, textos);
- a transcrição palavra por palavra com os tempos (t = segundos no vídeo original), com as pausas marcadas;
- a intensidade do áudio segundo a segundo (dB acima do normal: picos = risada, grito, susto);
- alguns frames do trecho, com o tempo de cada um.

Decida:
- start / end: o início e o fim exatos. A duração é a do MOMENTO: comece onde a situação começa (a fala ou ação que arma a piada, sem "e aí chat", silêncio ou menu) e termine quando ela acaba (depois da reação ou da frase que fecha). Não encurte o final da história nem estique para caber num tempo. Respeite a janela disponível.
- cuts: trechos de TEMPO MORTO para remover de dentro do corte (silêncio sem ação, menu, loading, enrolação). Use as pausas marcadas. Nunca corte no meio de uma frase e nunca corte o silêncio que faz parte da piada (tensão antes de susto, pausa cômica, algo acontecendo na tela). Cada corte com pelo menos 0,5 s. No máximo 3. Lista vazia se o ritmo já está bom (é o mais comum).
- zooms: o zoom rápido de reação. "at" = o instante em que a reação mais forte começa; "duration" entre 0,8 e 2 s. Normalmente 1; no máximo 2; lista vazia se não houver uma reação forte.
- emphasis: até 6 palavras-chave da piada, escritas exatamente como aparecem na transcrição.
- hook_title: o texto do topo, até ~50 caracteres, caixa alta, sem emoji. É o que faz a pessoa parar e ficar até o fim, então PODE e DEVE chamar atenção: exagero, superlativo, curiosidade ("O SUSTO MAIS INSANO DO GTA 6", "ELE NÃO ESPERAVA ISSO…"). Só não prometa algo que não acontece no vídeo.
- bottom_text: opcional, até 30 caracteres, embaixo do vídeo, para segurar a pessoa até o fim ("ESPERA O FINAL", "OLHA A REAÇÃO DELE"), sem emoji. Deixe vazio se não ajudar ou se repetir o gancho.
- title (até 70 caracteres, também pode exagerar), caption (1 ou 2 frases, terminando com um convite a comentar, sem hashtags) e hashtags (3 a 6, começando com #).
- score: 1 a 10, honesto (8+ = eu compartilharia).
- keep: false se, olhando de perto, o momento não se sustenta.
- reason: uma frase sobre por que funciona (ou não).

A duração FINAL (end − start − cortes) é a do momento; só não pode passar dos limites técnicos informados.`;

/** Transcrição em linhas curtas com tempo, marcando as pausas (ajuda a decidir os cortes). */
export function wordLines(words: Word[], start: number, end: number): string {
  const ws = words.filter((w) => w.end > start && w.start < end);
  if (!ws.length) return "(sem fala detectada)";
  const lines: string[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) lines.push(`[t=${cur[0].start.toFixed(1)}] ${cur.map((w) => w.text).join(" ")}`);
    cur = [];
  };
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i];
    const prev = ws[i - 1];
    const gap = prev ? w.start - prev.end : 0;
    if (prev && (gap >= 0.45 || cur.length >= 10)) flush();
    if (prev && gap >= 0.7) lines.push(`   … pausa de ${gap.toFixed(1)}s (t=${prev.end.toFixed(1)} → ${w.start.toFixed(1)}) …`);
    cur.push(w);
  }
  flush();
  return lines.join("\n");
}

/** Garante que a edição é aplicável: dentro da janela, duração certa, cortes/zooms válidos. */
export function sanitizeEdit(
  raw: RawEdit,
  win: Range,
  minLen: number,
  maxLen: number,
  opts: { allowCuts: boolean; punchZoom: boolean; bottomText?: boolean; maxZooms?: number },
): EditDecision | null {
  if (!raw.keep) return null;
  let s = Math.max(win.start, Math.min(raw.start, win.end));
  let e = Math.min(win.end, Math.max(raw.end, win.start));
  if (e - s < minLen) {
    const f = fitToWindow(s, e, win.start, win.end, minLen, Number.POSITIVE_INFINITY);
    if (!f) return null;
    ({ start: s, end: e } = f);
  }

  const cleanCuts = (a: number, b: number): Range[] => {
    if (!opts.allowCuts) return [];
    const cs = raw.cuts
      .map((c) => ({ start: Math.max(a + 0.3, Math.min(c.start, c.end)), end: Math.min(b - 0.3, Math.max(c.start, c.end)) }))
      .filter((c) => c.end - c.start >= 0.5)
      .sort((x, y) => x.start - y.start);
    const merged: Range[] = [];
    for (const c of cs) {
      const last = merged[merged.length - 1];
      if (last && c.start <= last.end) last.end = Math.max(last.end, c.end);
      else merged.push({ ...c });
    }
    return merged.slice(0, 3);
  };

  let cuts = cleanCuts(s, e);
  // duração final grande demais: puxa o fim para trás
  for (let i = 0; i < 3; i++) {
    const final = totalLength(keepRanges(s, e, cuts));
    if (final <= maxLen) break;
    e -= final - maxLen;
    cuts = cleanCuts(s, e);
  }
  if (totalLength(keepRanges(s, e, cuts)) < minLen) cuts = [];
  if (e - s < minLen) return null;

  const inCut = (t: number) => cuts.some((c) => t >= c.start && t <= c.end);
  const zooms: Range[] = [];
  if (opts.punchZoom) {
    for (const z of [...raw.zooms].sort((a, b) => a.at - b.at)) {
      const start = z.at;
      const end = Math.min(e, z.at + Math.min(2.5, Math.max(0.6, z.duration)));
      if (start < s || start >= e || inCut(start) || end - start < 0.4) continue;
      if (zooms.some((p) => Math.abs(p.start - start) < 1.5)) continue;
      zooms.push({ start, end });
      if (zooms.length >= (opts.maxZooms ?? 2)) break;
    }
  }

  const emphasis = [...new Set(raw.emphasis.map((w) => w.trim()).filter((w) => normWord(w)))].slice(0, 6);
  const bottom = (raw.bottom_text ?? "").trim().slice(0, 40);
  const r1 = (n: number) => Math.round(n * 100) / 100;
  return {
    candidateId: "",
    start: r1(s),
    end: r1(e),
    cuts: cuts.map((c) => ({ start: r1(c.start), end: r1(c.end) })),
    zooms: zooms.map((z) => ({ start: r1(z.start), end: r1(z.end) })),
    emphasis,
    bottomText: opts.bottomText !== false && bottom ? bottom : undefined,
    score: raw.score,
    hookTitle: raw.hook_title.trim(),
    title: raw.title.trim(),
    caption: raw.caption.trim(),
    hashtags: raw.hashtags.map(normalizeTag).filter(Boolean),
    reason: raw.reason.trim(),
  };
}

export async function editClip(input: {
  streamer: { name: string; context?: string };
  sourceTitle: string;
  knowledge?: string;
  suggestion: SelectedClip;
  /** limites onde o corte pode estar (tempo absoluto) */
  window: Range;
  words: Word[];
  /** intensidade (dB acima do normal) a cada segundo, começando em window.start */
  intensity: number[];
  frames: Frame[];
  minSeconds: number;
  maxSeconds: number;
  allowCuts: boolean;
  punchZoom: boolean;
  bottomText: boolean;
}): Promise<EditDecision | null> {
  const s = input.suggestion;
  const text = [
    `Streamer: ${input.streamer.name}`,
    input.streamer.context ? `Contexto do streamer: ${input.streamer.context}` : null,
    `Vídeo de origem: ${input.sourceTitle}`,
    `Sugestão da triagem: t=${s.start.toFixed(1)} até t=${s.end.toFixed(1)} · nota ${s.score} · gancho "${s.hookTitle}" · título "${s.title}" · motivo: ${s.reason}`,
    `Janela disponível: t=${input.window.start.toFixed(1)} até t=${input.window.end.toFixed(1)}. Limites técnicos da duração final: ${input.minSeconds} a ${input.maxSeconds} s (dentro disso, a duração é a do momento).`,
    input.allowCuts ? null : "Cortes internos estão desligados: devolva cuts vazio.",
    input.punchZoom ? null : "Zoom de reação está desligado: devolva zooms vazio.",
    input.bottomText ? null : "Rodapé desligado: devolva bottom_text vazio.",
    "",
    "Transcrição palavra por palavra:",
    wordLines(input.words, input.window.start, input.window.end),
    "",
    `Intensidade do áudio (1 valor por segundo a partir de t=${input.window.start.toFixed(0)}): ${input.intensity.join(" ")}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const content: BetaContentBlockParam[] = [{ type: "text", text }];
  for (const f of existingFrames(input.frames)) {
    content.push({ type: "text", text: `frame em t=${f.t.toFixed(1)}:` });
    content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: frameBase64(f) } });
  }

  const raw = await askClaude({
    schema: EditSchema,
    instructions: INSTRUCTIONS,
    knowledge: input.knowledge,
    content,
    effort: effort("CLAUDE_EDIT_EFFORT", "medium"),
    label: `edição de "${s.title.slice(0, 40)}"`,
  });
  if (!raw) return null;
  const dec = sanitizeEdit(raw, input.window, input.minSeconds, input.maxSeconds, {
    allowCuts: input.allowCuts,
    punchZoom: input.punchZoom,
    bottomText: input.bottomText,
  });
  return dec ? { ...dec, candidateId: s.candidateId } : null;
}

/** Sem a etapa do editor: usa a sugestão da triagem como está. */
export function fromSelection(s: SelectedClip): EditDecision {
  return { ...s, cuts: [], zooms: [], emphasis: [] };
}
