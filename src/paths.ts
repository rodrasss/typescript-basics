import { mkdirSync } from "node:fs";
import { resolve, join } from "node:path";

export const DATA_DIR = resolve(process.env.CLIPPER_DATA_DIR ?? "data");
export const WORK_DIR = join(DATA_DIR, "work");
export const OUTPUT_DIR = resolve(process.env.CLIPPER_OUTPUT_DIR ?? "output");
export const FONTS_DIR = resolve("assets/fonts");

export function ensureDir(dir: string): string {
  mkdirSync(dir, { recursive: true });
  return dir;
}
