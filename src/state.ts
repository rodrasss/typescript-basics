import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Platform } from "./config";
import { DATA_DIR, ensureDir } from "./paths";

export type ClipStatus = "pending" | "approved" | "rejected" | "published";

export interface PostResult {
  at: string;
  id?: string;
  url?: string;
  note?: string;
  error?: string;
}

export interface ClipRecord {
  id: string;
  streamer: string;
  credit: string;
  source: { kind: "vod" | "twitch-clip"; key: string; url: string; title: string };
  /** Trecho equivalente dentro do VOD (para não repetir o mesmo momento vindo de um clipe e do VOD). */
  vod?: { key: string; start: number; end: number };
  /** Segundos dentro do vídeo de origem. */
  start: number;
  end: number;
  score: number;
  reason: string;
  hookTitle: string;
  title: string;
  caption: string;
  hashtags: string[];
  file: string;
  /** O que a IA sugeriu originalmente (para aprender com as suas edições no painel). */
  ai?: { hookTitle: string; title: string; caption: string };
  /** Decisões do editor de IA aplicadas no vídeo. */
  edit?: { cuts: Array<{ start: number; end: number }>; zooms: Array<{ start: number; end: number }>; emphasis: string[] };
  createdAt: string;
  status: ClipStatus;
  posts: Partial<Record<Platform, PostResult>>;
}

interface SourceState {
  at: string;
  done: boolean;
  failures: number;
  lastError?: string;
}

interface StateData {
  sources: Record<string, SourceState>;
  clips: ClipRecord[];
}

const STATE_PATH = join(DATA_DIR, "state.json");

export class State {
  private data: StateData;

  constructor() {
    this.data = State.read();
  }

  private static read(): StateData {
    return existsSync(STATE_PATH)
      ? (JSON.parse(readFileSync(STATE_PATH, "utf8")) as StateData)
      : { sources: {}, clips: [] };
  }

  /** Relê do disco antes de gravar, para o painel e o watch não apagarem a mudança um do outro. */
  private mutate(fn: (d: StateData) => void): void {
    this.data = State.read();
    fn(this.data);
    this.save();
  }

  reload(): this {
    this.data = State.read();
    return this;
  }

  save(): void {
    ensureDir(DATA_DIR);
    const tmp = `${STATE_PATH}.tmp`;
    writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    renameSync(tmp, STATE_PATH);
  }

  isDone(key: string): boolean {
    return this.data.sources[key]?.done === true;
  }

  failures(key: string): number {
    return this.data.sources[key]?.failures ?? 0;
  }

  markDone(key: string): void {
    this.mutate((d) => {
      d.sources[key] = { at: new Date().toISOString(), done: true, failures: d.sources[key]?.failures ?? 0 };
    });
  }

  markFailed(key: string, error: string): void {
    this.mutate((d) => {
      d.sources[key] = {
        at: new Date().toISOString(),
        done: false,
        failures: (d.sources[key]?.failures ?? 0) + 1,
        lastError: error.slice(0, 500),
      };
    });
  }

  addClip(c: ClipRecord): void {
    this.mutate((d) => d.clips.push(c));
  }

  clips(): ClipRecord[] {
    return this.data.clips;
  }

  /** Já existe corte (não rejeitado) cobrindo boa parte deste trecho do VOD? */
  overlaps(vodKey: string, start: number, end: number, minShare = 0.3): ClipRecord | undefined {
    return this.data.clips.find((c) => {
      if (!c.vod || c.vod.key !== vodKey || c.status === "rejected") return false;
      const inter = Math.min(end, c.vod.end) - Math.max(start, c.vod.start);
      return inter > minShare * Math.min(end - start, c.vod.end - c.vod.start);
    });
  }

  getClip(id: string): ClipRecord {
    const c = this.data.clips.find((x) => x.id === id);
    if (!c) throw new Error(`Corte ${id} não encontrado (use o comando list).`);
    return c;
  }

  update(c: ClipRecord): void {
    this.mutate((d) => {
      const i = d.clips.findIndex((x) => x.id === c.id);
      if (i >= 0) d.clips[i] = c;
    });
  }
}
