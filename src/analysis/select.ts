import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { env } from "../config";
import { log } from "../util/log";
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

const SYSTEM = `Você é editor de cortes virais de lives para TikTok, Instagram Reels e YouTube Shorts, especialista no público brasileiro de GTA (GTA RP, GTA V e o hype do GTA 6).

Você recebe trechos candidatos de uma live. Cada trecho tem a transcrição com timestamps em segundos (t=...) e um perfil de intensidade do áudio: quantos dB o volume ficou acima do normal, a cada 2 segundos. Picos costumam ser risadas, gritos, sustos ou bagunça no RP.

Sua tarefa é escolher os melhores momentos para virar cortes curtos e virais.

O que faz um bom corte:
- engraçado, absurdo, caótico ou surpreendente, com uma reação forte;
- dá para entender sem ter visto o resto da live;
- os primeiros 2 segundos já prendem (comece logo antes da situação, não no meio de um papo morto);
- termina logo depois da piada/reação, sem enrolação.

Evite: trechos sem graça, só setup sem desfecho, leitura de patrocínio, pedidos de sub/doação, longos silêncios, discurso de ódio, assédio, conteúdo sexual, ataques a pessoas reais e dados pessoais (telefone, endereço etc.).

Você NÃO vê o vídeo. Não invente o que aconteceu na tela: se a transcrição não deixa claro que o momento é bom, dê nota baixa. Seja honesto nas notas (1 = descartável, 10 = viral certo); a maioria dos trechos não merece mais que 5.

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

let client: Anthropic | null = null;

export async function selectClips(input: {
  streamer: { name: string; context?: string };
  sourceTitle: string;
  candidates: Candidate[];
  maxClips: number;
  minSeconds: number;
  maxSeconds: number;
}): Promise<SelectedClip[]> {
  if (input.candidates.length === 0) return [];
  client ??= new Anthropic();

  const user = [
    `Streamer: ${input.streamer.name}`,
    input.streamer.context ? `Contexto do streamer: ${input.streamer.context}` : null,
    `Vídeo de origem: ${input.sourceTitle}`,
    `Escolha até ${input.maxClips} cortes. Duração de cada corte: entre ${input.minSeconds} e ${input.maxSeconds} segundos.`,
    "",
    ...input.candidates.map(describeCandidate),
  ]
    .filter((l) => l !== null)
    .join("\n\n");

  const response = await client.beta.messages.parse({
    model: env("CLAUDE_MODEL") ?? "claude-opus-5-5",
    max_tokens: 16000,
    // Se o modelo recusar por política, a API tenta de novo num modelo substituto padrão.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    output_config: {
      effort: (env("CLAUDE_EFFORT") ?? "medium") as "low" | "medium" | "high" | "xhigh" | "max",
      format: betaZodOutputFormat(SelectionSchema),
    },
    system: SYSTEM,
    messages: [{ role: "user", content: user }],
  });

  if (response.stop_reason === "refusal") {
    log.warn(`Claude recusou avaliar "${input.sourceTitle}" (${response.stop_details?.category ?? "sem categoria"}).`);
    return [];
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("Resposta do Claude cortada por max_tokens; reduza clips.candidates.");
  }
  const parsed = response.parsed_output;
  if (!parsed) throw new Error("Claude não devolveu um JSON válido para a seleção de cortes.");

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
