import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import type { Config } from "../config";
import { DATA_DIR, ensureDir } from "../paths";
import { downloadAudio, flatList } from "../sources/ytdlp";
import type { ClipRecord } from "../state";
import { log } from "../util/log";
import { errMsg, slug } from "../util/misc";
import { excitementCurve, loudnessPerSecond } from "./loudness";
import { extractAudio, transcribe } from "./transcribe";

/**
 * Base de conhecimento da IA:
 *  - knowledge/playbook.md  → manual de edição (texto fixo, editável)
 *  - knowledge/seed.json    → exemplos reais que já vêm com o projeto
 *  - data/knowledge.json    → exemplos que o comando `aprender` coleta no seu PC
 *  - data/state.json        → o que você aprovou, editou e rejeitou no painel
 */

export interface KnowledgeExample {
  source: "twitch" | "youtube" | "tiktok";
  /** login do streamer ou nome do canal */
  author: string;
  title: string;
  views: number;
  duration: number;
  url: string;
  /** AAAA-MM-DD */
  date?: string;
  /** trecho da fala (até ~350 caracteres) */
  transcript?: string;
  /** segundo do maior pico de volume (a reação) */
  peakAt?: number;
}

export interface KnowledgeBase {
  updatedAt: string;
  examples: KnowledgeExample[];
}

export const PLAYBOOK_PATH = resolve("knowledge/playbook.md");
export const SEED_PATH = resolve("knowledge/seed.json");
export const LEARNED_PATH = join(DATA_DIR, "knowledge.json");

function readBase(path: string): KnowledgeExample[] {
  if (!existsSync(path)) return [];
  try {
    return (JSON.parse(readFileSync(path, "utf8")) as KnowledgeBase).examples ?? [];
  } catch {
    log.warn(`Não consegui ler ${path}; ignorando.`);
    return [];
  }
}

/** Junta a base inicial com a aprendida (a aprendida vence em caso de repetição). */
export function loadExamples(): KnowledgeExample[] {
  const byUrl = new Map<string, KnowledgeExample>();
  for (const e of [...readBase(SEED_PATH), ...readBase(LEARNED_PATH)]) byUrl.set(e.url, { ...byUrl.get(e.url), ...e });
  return [...byUrl.values()];
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function quantile(xs: number[], q: number): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.round(q * (s.length - 1))))];
}

/** Título parece português? (evita usar como referência de estilo vídeos em inglês/espanhol) */
export function looksPortuguese(title: string): boolean {
  const t = ` ${title.toLowerCase()} `;
  if (/[ãõç]|ção|ões|kkk/.test(t)) return true;
  if (/ (the|is|you|your|this|what|found|minute|with|and|in a|of the|la|el|los|las|personaje|una) /.test(t)) return false;
  return / (o|a|os|as|do|da|dos|das|no|na|nos|nas|que|com|pra|pro|um|uma|não|nao|é|de|e|ele|ela|mais) /.test(t);
}

/** Exemplo bom o bastante para virar referência: views relevantes e em português (Shorts/TikTok). */
export function isUseful(e: KnowledgeExample): boolean {
  if (!e.title || e.duration <= 0) return false;
  if (e.source === "twitch") return e.views >= 300;
  return e.views >= 1000 && looksPortuguese(e.title);
}

export interface KnowledgeStats {
  count: number;
  durMedian: number;
  durP25: number;
  durP75: number;
  peakMedian: number | null;
  titleLenMedian: number;
  capsShare: number;
  laughShare: number;
}

/** Números do que já viralizou: duração típica, onde fica o pico, estilo dos títulos. */
export function knowledgeStats(examples: KnowledgeExample[]): KnowledgeStats {
  const top = [...examples].sort((a, b) => b.views - a.views).slice(0, Math.max(10, Math.ceil(examples.length / 2)));
  const durs = top.map((e) => e.duration).filter((d) => d > 0);
  const peaks = top.map((e) => e.peakAt).filter((p): p is number => typeof p === "number");
  // títulos de clipe da Twitch são dados por quem clipou (sem cuidado); estilo de título vem dos Shorts/TikTok editados
  const edited = top.filter((e) => e.source !== "twitch");
  const titles = (edited.length >= 5 ? edited : top).map((e) => e.title);
  const isCaps = (t: string) => {
    const letters = t.replace(/[^\p{L}]/gu, "");
    return letters.length >= 4 && letters === letters.toUpperCase();
  };
  return {
    count: examples.length,
    durMedian: Math.round(median(durs)),
    durP25: Math.round(quantile(durs, 0.25)),
    durP75: Math.round(quantile(durs, 0.75)),
    peakMedian: peaks.length >= 3 ? Math.round(median(peaks)) : null,
    titleLenMedian: Math.round(median(titles.map((t) => t.length))),
    capsShare: titles.length ? titles.filter(isCaps).length / titles.length : 0,
    laughShare: titles.length ? titles.filter((t) => /k{3,}|kkk|😂|🤣|haha/i.test(t)).length / titles.length : 0,
  };
}

export function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")} mi`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(".", ",")} mil`;
  return String(n);
}

const SOURCE_NAME = { twitch: "Twitch", youtube: "YouTube", tiktok: "TikTok" } as const;

export function exampleLine(e: KnowledgeExample, withTranscript: boolean): string {
  const meta = [SOURCE_NAME[e.source], e.author, `${fmtViews(e.views)} views`, `${Math.round(e.duration)}s`];
  if (typeof e.peakAt === "number") meta.push(`pico aos ${Math.round(e.peakAt)}s`);
  let line = `• [${meta.join(" · ")}] "${e.title}"`;
  if (withTranscript && e.transcript) line += `\n  fala: "${e.transcript}"`;
  return line;
}

function matchesStreamer(e: KnowledgeExample, s: { name: string; twitch?: string; youtube?: string }): boolean {
  const a = slug(e.author);
  const keys = [s.name, s.twitch, s.youtube?.replace(/^@/, "")].filter(Boolean).map((k) => slug(k!));
  return keys.some((k) => k.length >= 3 && (a.includes(k) || slug(e.title).includes(k)));
}

/** Decisões do editor humano no painel: o que aprovou, como reescreveu e o que rejeitou. */
export function feedbackBlock(clips: ClipRecord[], limit = 10): string {
  const recent = [...clips].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const liked = recent.filter((c) => c.status === "approved" || c.status === "published").slice(0, limit);
  const edited = recent.filter((c) => c.ai && (c.ai.title !== c.title || c.ai.caption !== c.caption)).slice(0, limit);
  const rejected = recent.filter((c) => c.status === "rejected").slice(0, limit);
  if (!liked.length && !edited.length && !rejected.length) return "";

  const parts = ["## Gosto do editor humano (decisões reais no painel)"];
  if (liked.length) {
    parts.push("Aprovou / publicou:");
    for (const c of liked) parts.push(`• ${c.streamer} · ${Math.round(c.end - c.start)}s · nota ${c.score} · "${c.title}" (gancho: "${c.hookTitle}")`);
  }
  if (edited.length) {
    parts.push("Reescreveu (use o estilo dele):");
    for (const c of edited) {
      if (c.ai!.title !== c.title) parts.push(`• título: IA "${c.ai!.title}" → editor "${c.title}"`);
      if (c.ai!.caption !== c.caption) parts.push(`• legenda: IA "${c.ai!.caption}" → editor "${c.caption}"`);
    }
  }
  if (rejected.length) {
    parts.push("Rejeitou (evite parecidos):");
    for (const c of rejected) parts.push(`• ${c.streamer} · "${c.title}" — motivo que a IA deu: ${c.reason}`);
  }
  return parts.join("\n");
}

/** Texto da base de conhecimento que vai no começo do prompt (fica em cache entre as chamadas). */
export function buildKnowledge(opts: {
  streamer: { name: string; twitch?: string; youtube?: string };
  clips: ClipRecord[];
  maxExamples: number;
  examples?: KnowledgeExample[];
  playbook?: string;
}): string {
  const playbook = opts.playbook ?? (existsSync(PLAYBOOK_PATH) ? readFileSync(PLAYBOOK_PATH, "utf8") : "");
  const examples = (opts.examples ?? loadExamples()).filter(isUseful);
  const parts: string[] = ["# Base de conhecimento do editor", playbook.trim()];

  if (examples.length) {
    const st = knowledgeStats(examples);
    const pct = (x: number) => `${Math.round(x * 100)}%`;
    parts.push(
      "## O que já viralizou (dados reais de clipes e Shorts)",
      [
        `- ${st.count} exemplos. Duração dos mais vistos: mediana ${st.durMedian}s (metade entre ${st.durP25}s e ${st.durP75}s).`,
        st.peakMedian !== null ? `- A reação mais alta acontece, em mediana, aos ${st.peakMedian}s do início.` : null,
        `- Títulos dos Shorts/TikToks editados: mediana de ${st.titleLenMedian} caracteres; ${pct(st.capsShare)} em caixa alta; ${pct(st.laughShare)} com risada/emoji de risada.`,
        "- Nos clipes da Twitch o título é dado por quem clipou (às vezes sem sentido): aproveite a fala, a duração e o pico; o estilo de título vem dos Shorts/TikToks.",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    const byViews = [...examples].sort((a, b) => b.views - a.views);
    const own = byViews.filter((e) => matchesStreamer(e, opts.streamer)).slice(0, 12);
    const others = byViews.filter((e) => !own.includes(e)).slice(0, Math.max(0, opts.maxExamples - own.length));
    if (own.length) {
      parts.push(`### Mais vistos de ${opts.streamer.name}`);
      parts.push(own.map((e, i) => exampleLine(e, i < 8)).join("\n"));
    }
    if (others.length) {
      parts.push("### Mais vistos de GTA / RP / canais de cortes");
      parts.push(others.map((e, i) => exampleLine(e, i < 8)).join("\n"));
    }
  }

  const fb = feedbackBlock(opts.clips);
  if (fb) parts.push(fb);
  return parts.join("\n\n");
}

/* ------------------------------------------------------------------ */
/* Comando `aprender`: coleta exemplos reais e salva em data/knowledge.json */

function toExample(e: Record<string, unknown>, source: KnowledgeExample["source"], fallbackAuthor: string): KnowledgeExample | null {
  const url = String(e.webpage_url ?? e.url ?? "");
  const title = String(e.title ?? "").trim();
  if (!url || !title) return null;
  const ts = typeof e.timestamp === "number" ? new Date(e.timestamp * 1000) : null;
  const ud = typeof e.upload_date === "string" ? `${e.upload_date.slice(0, 4)}-${e.upload_date.slice(4, 6)}-${e.upload_date.slice(6, 8)}` : undefined;
  return {
    source,
    author: String(e.channel ?? e.uploader ?? e.creator ?? fallbackAuthor),
    title,
    views: Number(e.view_count ?? 0),
    duration: Number(e.duration ?? 0),
    url: source === "youtube" && e.id && Number(e.duration ?? 0) <= 60 ? `https://www.youtube.com/shorts/${e.id}` : url,
    date: ts ? ts.toISOString().slice(0, 10) : ud,
  };
}

export type Transcriber = (mp3: string) => Promise<string>;

/** Transcrição padrão: a mesma API configurada no .env (Groq/OpenAI/local). */
export function defaultTranscriber(language: string): Transcriber {
  return async (mp3) => (await transcribe(mp3, language)).text;
}

export async function learn(
  cfg: Config,
  opts: {
    workDir: string;
    out?: string;
    transcriber?: Transcriber | null;
    /** filtra quais exemplos tentar transcrever (ex.: só Twitch) */
    canTranscribe?: (e: KnowledgeExample) => boolean;
  },
): Promise<KnowledgeBase> {
  const k = cfg.knowledge;
  const found: KnowledgeExample[] = [];
  const collect = async (label: string, target: string, limit: number, source: KnowledgeExample["source"], author: string) => {
    try {
      let entries = await flatList(target, limit);
      if (entries.length === 0) {
        // a Twitch às vezes devolve a lista vazia; uma segunda tentativa costuma resolver
        await new Promise((r) => setTimeout(r, 2000));
        entries = await flatList(target, limit);
      }
      const ex = entries
        .map((e) => toExample(e, source, author))
        .filter((e): e is KnowledgeExample => !!e && e.duration > 0 && e.duration <= k.maxSeconds);
      found.push(...ex);
      log.info(`${label}: ${ex.length} exemplo(s)`);
    } catch (e) {
      log.warn(`${label}: ${errMsg(e).split("\n").pop()}`);
    }
  };

  const logins = [...new Set([...cfg.streamers.map((s) => s.twitch).filter(Boolean), ...k.twitch].map((l) => l!.toLowerCase()))];
  for (const login of logins) {
    await collect(`Twitch ${login}`, `https://www.twitch.tv/${login}/clips?filter=clips&range=${k.clipsRange}`, k.clipsPerChannel, "twitch", login);
  }
  for (const q of k.youtubeSearches) await collect(`YouTube "${q}"`, `ytsearch${k.perSource * 2}:${q}`, k.perSource * 2, "youtube", "YouTube");
  for (const h of k.youtubeChannels) {
    const handle = h.startsWith("@") ? h : `@${h}`;
    await collect(`YouTube ${handle}`, `https://www.youtube.com/${handle}/shorts`, k.perSource, "youtube", handle);
  }
  for (const h of k.tiktokProfiles) {
    const handle = h.startsWith("@") ? h : `@${h}`;
    await collect(`TikTok ${handle}`, `https://www.tiktok.com/${handle}`, k.perSource, "tiktok", handle);
  }

  // junta com o que já existia (mantém transcrições já feitas)
  const out = opts.out ?? LEARNED_PATH;
  const previous = new Map(readBase(out).map((e) => [e.url, e]));
  const merged = new Map<string, KnowledgeExample>();
  for (const e of found) merged.set(e.url, { ...previous.get(e.url), ...e, transcript: previous.get(e.url)?.transcript, peakAt: previous.get(e.url)?.peakAt });
  for (const [url, e] of previous) if (!merged.has(url)) merged.set(url, e);
  const examples = [...merged.values()].sort((a, b) => b.views - a.views);

  const transcriber = opts.transcriber === undefined ? defaultTranscriber(cfg.clips.language) : opts.transcriber;
  if (transcriber && k.transcribeTop > 0) {
    const todo = examples.filter((e) => !e.transcript && (opts.canTranscribe?.(e) ?? true)).slice(0, k.transcribeTop);
    log.step(`Transcrevendo ${todo.length} exemplo(s) mais vistos…`);
    ensureDir(opts.workDir);
    for (const [i, e] of todo.entries()) {
      try {
        const dir = ensureDir(join(opts.workDir, `ex-${i + 1}`));
        const media = await downloadAudio(e.url, dir);
        const mp3 = await extractAudio(media, 0, Math.min(e.duration || 90, k.maxSeconds), join(dir, "a.mp3"));
        const text = (await transcriber(mp3)).replace(/\s+/g, " ").trim();
        e.transcript = text.length > 350 ? `${text.slice(0, 347)}…` : text;
        const curve = excitementCurve(await loudnessPerSecond(media), 60, 1);
        if (curve.length) e.peakAt = curve.indexOf(Math.max(...curve));
        log.info(`  ✔ ${e.title.slice(0, 60)}`);
      } catch (err) {
        const msg = errMsg(err).trim().split("\n").filter(Boolean).pop() ?? "erro";
        log.warn(`  ✖ ${e.title.slice(0, 60)}: ${msg.slice(0, 160)}`);
      }
    }
  } else if (!transcriber) {
    log.info("Sem transcrição (defina TRANSCRIBE_API_KEY para a IA ver também as falas dos exemplos).");
  }

  const base: KnowledgeBase = { updatedAt: new Date().toISOString(), examples };
  ensureDir(dirname(out));
  writeFileSync(out, JSON.stringify(base, null, 2));
  log.ok(`${examples.length} exemplo(s) salvos em ${out}`);
  return base;
}
