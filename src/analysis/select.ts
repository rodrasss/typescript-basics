import type { BetaContentBlockParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { z } from "zod";
import { askClaude, effort } from "./claude";
import { frameBase64, type Frame } from "./frames";
import type { Segment } from "./transcribe";

/**
 * O Claude lê as transcrições dos trechos candidatos (+ o perfil de volume)
 * e escolhe quais viram corte, onde começa/termina, e escreve título,
 * legenda e hashtags.
 */

export interface Candidate {
  id: string;
  /** janela em segundos dentro do vídeo de origem */
  start: number;
  end: number;
  /** dB acima do normal no pico (quando veio da análise de áudio) */
  peakScore?: number;
  /** intensidade a cada 2 s, começando em `start` */
  intensity: number[];
  /** segmentos com tempos absolutos (mesma base de start/end) */
  segments: Segment[];
  /** informação extra (ex.: título e views do clipe da Twitch) */
  note?: string;
  /** alguns frames do trecho (tempo na mesma base de start/end) */
  frames?: Frame[];
}

export interface SelectedClip {
  candidateId: string;
  start: number;
  end: number;
  score: number;
  hookTitle: string;
  title: string;
  caption: string;
  hashtags: string[];
  reason: string;
}

const SelectionSchema = z.object({
  clips: z.array(
    z.object({
      candidate_id: z.string(),
      start: z.number(),
      end: z.number(),
      score: z.number(),
      hook_title: z.string(),
      title: z.string(),
      caption: z.string(),
      hashtags: z.array(z.string()),
      reason: z.string(),
    }),
  ),
});

const SYSTEM = `Você é editor de cortes virais de lives para TikTok, Instagram Reels e YouTube Shorts, especialista no público brasileiro de GTA (GTA RP, GTA V e o hype do GTA 6). Esta é a 1ª etapa (triagem): escolher QUAIS momentos viram corte. Depois, um editor refina cada corte escolhido.

No fim deste prompt está a sua base de conhecimento: o manual de edição, dados e exemplos reais do que já viralizou (do próprio streamer e de canais de cortes) e as decisões do editor humano (o que ele aprovou, reescreveu e rejeitou). Use tudo isso como referência de gosto, de duração e de estilo de título.

Você recebe trechos candidatos de uma live. Cada trecho tem a transcrição com timestamps em segundos (t=...) e um perfil de intensidade do áudio: quantos dB o volume ficou acima do normal, a cada 2 segundos. Picos costumam ser risadas, gritos, sustos ou bagunça no RP.

Sua tarefa é escolher os melhores momentos para virar cortes curtos e virais.

O que faz um bom corte:
- engraçado, absurdo, caótico ou surpreendente, com uma reação forte;
- dá para entender sem ter visto o resto da live;
- os primeiros 2 segundos já prendem (comece logo antes da situação, não no meio de um papo morto);
- termina logo depois da piada/reação, sem enrolação.

Evite: trechos sem graça, só setup sem desfecho, leitura de patrocínio, pedidos de sub/doação, longos silêncios, discurso de ódio, assédio, conteúdo sexual, ataques a pessoas reais e dados pessoais (telefone, endereço etc.).

Quando houver, você também recebe alguns frames de cada trecho (com o tempo t de cada um). Use-os para entender a cena, o que está na tela e se é GTA mesmo, mas lembre que são poucos quadros: não invente ação que não dá para ver nem ouvir. Se a transcrição e os frames não deixam claro que o momento é bom, dê nota baixa. Seja honesto nas notas (1 = descartável, 10 = viral certo); a maioria dos trechos não merece mais que 5.

Regras de saída:
- start e end em segundos, dentro da janela do candidato, usando a mesma base de tempo dos timestamps (t=...).
- A duração (end - start) deve respeitar o mínimo e o máximo pedidos.
- No máximo um corte por candidato.
- hook_title: texto curto (até 50 caracteres) que aparece no topo do vídeo. Português do Brasil, linguagem de internet, pode usar caixa alta com moderação. Sem mentir sobre o conteúdo.
- title: título do post (até 80 caracteres), chamativo e fiel ao que acontece.
- caption: legenda do post em 1 ou 2 frases curtas, com uma chamada para comentar. Sem hashtags aqui.
- hashtags: de 3 a 6 hashtags relevantes, cada uma começando com #.
- reason: uma frase explicando por que o momento funciona.
- Retorne só os cortes que valem a pena; a lista pode ficar vazia.`;

function describeCandidate(c: Candidate): string {
  const lines = c.segments
    .filter((s) => s.end > c.start && s.start < c.end)
    .map((s) => `[t=${s.start.toFixed(1)}] ${s.text}`);
  const header = [
    `### Candidato ${c.id}`,
    `janela: t=${c.start.toFixed(1)} até t=${c.end.toFixed(1)}`,
    c.peakScore !== undefined ? `pico de volume: +${c.peakScore.toFixed(1)} dB acima do normal` : null,
    c.note ?? null,
    `intensidade (dB acima do normal, a cada 2 s a partir de t=${c.start.toFixed(0)}): ${c.intensity.join(" ")}`,
    "transcrição:",
  ].filter(Boolean);
  return [...header, ...(lines.length ? lines : ["(sem fala detectada)"])].join("\n");
}

export async function selectClips(input: {
  streamer: { name: string; context?: string };
  /** base de conhecimento (manual + exemplos + gosto do editor) */
  knowledge?: string;
  sourceTitle: string;
  candidates: Candidate[];
  maxClips: number;
  minSeconds: number;
  maxSeconds: number;
}): Promise<SelectedClip[]> {
  if (input.candidates.length === 0) return [];

  const intro = [
    `Streamer: ${input.streamer.name}`,
    input.streamer.context ? `Contexto do streamer: ${input.streamer.context}` : null,
    `Vídeo de origem: ${input.sourceTitle}`,
    `Escolha até ${input.maxClips} cortes. Duração de cada corte: entre ${input.minSeconds} e ${input.maxSeconds} segundos.`,
  ]
    .filter((l) => l !== null)
    .join("\n");
  const content: BetaContentBlockParam[] = [{ type: "text", text: intro }];
  for (const c of input.candidates) {
    content.push({ type: "text", text: describeCandidate(c) });
    for (const f of c.frames ?? []) {
      content.push({ type: "text", text: `frame do candidato ${c.id} em t=${f.t.toFixed(1)}:` });
      content.push({ type: "image", source: { type: "base64", media_type: "image/jpeg", data: frameBase64(f) } });
    }
  }

  const parsed = await askClaude({
    schema: SelectionSchema,
    instructions: SYSTEM,
    knowledge: input.knowledge,
    content,
    effort: effort("CLAUDE_EFFORT", "high"),
    label: `triagem de "${input.sourceTitle.slice(0, 40)}"`,
  });
  if (!parsed) return [];

  const byId = new Map(input.candidates.map((c) => [c.id, c]));
  const used = new Set<string>();
  const result: SelectedClip[] = [];
  for (const c of parsed.clips) {
    const cand = byId.get(c.candidate_id);
    if (!cand || used.has(cand.id)) continue;
    const fitted = fitToWindow(c.start, c.end, cand.start, cand.end, input.minSeconds, input.maxSeconds);
    if (!fitted) continue;
    used.add(cand.id);
    result.push({
      candidateId: cand.id,
      start: fitted.start,
      end: fitted.end,
      score: c.score,
      hookTitle: c.hook_title.trim(),
      title: c.title.trim(),
      caption: c.caption.trim(),
      hashtags: c.hashtags.map(normalizeTag).filter(Boolean),
      reason: c.reason.trim(),
    });
  }
  return result.sort((a, b) => b.score - a.score).slice(0, input.maxClips);
}

export function normalizeTag(t: string): string {
  const clean = t.trim().replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "");
  return clean ? `#${clean}` : "";
}

/**
 * Garante que [start, end] fica dentro da janela e com duração entre min e max.
 * Retorna null se a janela inteira for menor que o mínimo.
 */
export function fitToWindow(
  start: number,
  end: number,
  winStart: number,
  winEnd: number,
  minLen: number,
  maxLen: number,
): { start: number; end: number } | null {
  if (winEnd - winStart < minLen) return null;
  let s = Math.max(winStart, Math.min(start, winEnd));
  let e = Math.min(winEnd, Math.max(end, winStart));
  if (e < s) [s, e] = [e, s];
  if (e - s > maxLen) e = s + maxLen;
  if (e - s < minLen) {
    const missing = minLen - (e - s);
    s = Math.max(winStart, s - missing / 2);
    e = Math.min(winEnd, s + minLen);
    s = Math.max(winStart, e - minLen);
  }
  return { start: Math.round(s * 10) / 10, end: Math.round(e * 10) / 10 };
}
