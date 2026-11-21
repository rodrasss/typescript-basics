import assert from "node:assert/strict";
import { test } from "node:test";
import { loadConfig } from "../src/config";
import { postText } from "../src/publish";
import { canPostNow, inWindow } from "../src/publish/schedule";
import type { ClipRecord } from "../src/state";

const cfg = loadConfig();
const pub = { ...cfg.publish, maxPerDay: 3, minGapMinutes: 45 };
const at = (d: string) => new Date(d); // hora local

test("janelas de horário (dia de semana e fim de semana)", () => {
  assert.equal(inWindow(at("2026-11-18T19:30:00"), pub.windows), true); // quarta 19h30
  assert.equal(inWindow(at("2026-11-18T16:00:00"), pub.windows), false); // quarta 16h
  assert.equal(inWindow(at("2026-11-22T10:00:00"), pub.windows), true); // domingo 10h
});

test("limite por dia, intervalo mínimo e corte ao vivo fora da janela", () => {
  const now = at("2026-11-18T16:00:00");
  assert.equal(canPostNow(now, pub, [], false).ok, false); // fora da janela
  assert.equal(canPostNow(now, pub, [], true).ok, true); // ao vivo posta na hora
  const recent = [now.getTime() - 20 * 60_000];
  const gap = canPostNow(now, pub, recent, true);
  assert.equal(gap.ok, false);
  assert.match(gap.reason!, /próximo post em 25 min/);
  const full = [1, 2, 3].map((h) => at(`2026-11-18T0${h}:00:00`).getTime());
  assert.match(canPostNow(now, pub, full, true).reason!, /limite de 3 posts/);
});

test("créditos do streamer sempre na legenda do post", () => {
  const c = { caption: "Ele não esperava isso.", credit: "twitch.tv/alanzoka", hashtags: ["#gta6"], source: { title: "live" } } as unknown as ClipRecord;
  const t = postText(c, cfg);
  assert.match(t.caption, /🎥 Créditos: twitch\.tv\/alanzoka/);
  assert.match(t.description, /🎥 Créditos: twitch\.tv\/alanzoka/);
});

test("lives longas rendem mais cortes, com limite", async () => {
  const { analyzedSeconds, scaledPerVideo } = await import("../src/pipeline");
  const cfg = loadConfig();
  assert.equal(scaledPerVideo(cfg, 5, 2 * 3600), 5); // 2 h → fica no mínimo
  assert.equal(scaledPerVideo(cfg, 5, 6.5 * 3600), 10); // 6,5 h × 1,5
  assert.equal(scaledPerVideo(cfg, 5, 20 * 3600), 12); // teto
  assert.equal(scaledPerVideo({ ...cfg, clips: { ...cfg.clips, perHour: 0 } }, 5, 8 * 3600), 5);
  assert.equal(analyzedSeconds([{ start: 100, end: 200 }, { start: 500, end: Infinity }], 0, 1000), 600);
  assert.equal(analyzedSeconds(null, 50, 1000), 950);
});
