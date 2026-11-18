import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Platform } from "./config";
import { DATA_DIR, ensureDir } from "./paths";

export type ClipStatus = "pending" | "approved" | "rejected" | "published";

export interface PostResult {
  at: string;
  id?: string;
  url?: string;
  error?: string;
}

export interface ClipRecord {
  id: string;
  streamer: string;
  credit: string;
  source: { kind: "vod" | "twitch-clip"; key: string; url: string; title: string };
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
    this.data = existsSync(STATE_PATH)
      ? (JSON.parse(readFileSync(STATE_PATH, "utf8")) as StateData)
      : { sources: {}, clips: [] };
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
    this.data.sources[key] = { at: new Date().toISOString(), done: true, failures: this.failures(key) };
    this.save();
  }

  markFailed(key: string, error: string): void {
    this.data.sources[key] = {
      at: new Date().toISOString(),
      done: false,
      failures: this.failures(key) + 1,
      lastError: error.slice(0, 500),
    };
    this.save();
  }

  addClip(c: ClipRecord): void {
    this.data.clips.push(c);
    this.save();
  }

  clips(): ClipRecord[] {
    return this.data.clips;
  }

  getClip(id: string): ClipRecord {
    const c = this.data.clips.find((x) => x.id === id);
    if (!c) throw new Error(`Corte ${id} não encontrado (use o comando list).`);
    return c;
  }

  update(c: ClipRecord): void {
    const i = this.data.clips.findIndex((x) => x.id === c.id);
    if (i >= 0) this.data.clips[i] = c;
    this.save();
  }
}
