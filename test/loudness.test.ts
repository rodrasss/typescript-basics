import assert from "node:assert/strict";
import { test } from "node:test";
import { excitementCurve, intensityProfile, pickPeaks } from "../src/analysis/loudness";

function synthetic(len: number, bursts: Array<[number, number]>): number[] {
  // fala normal ~ -30 dB com ruído, picos de +15 dB nas rajadas
  return Array.from({ length: len }, (_, i) => {
    const loud = bursts.some(([a, b]) => i >= a && i < b);
    return -30 + Math.sin(i * 1.7) * 2 + (loud ? 15 : 0);
  });
}

test("acha os picos de reação e respeita a distância mínima", () => {
  const db = synthetic(1200, [
    [300, 306],
    [310, 314],
    [800, 805],
  ]);
  const peaks = pickPeaks(excitementCurve(db), { count: 5, minGap: 75, minScore: 3 });
  assert.equal(peaks.length, 2);
  assert.ok(Math.abs(peaks[0].t - 305) < 12, `primeiro pico em ${peaks[0].t}`);
  assert.ok(Math.abs(peaks[1].t - 802) < 6, `segundo pico em ${peaks[1].t}`);
});

test("silêncio não vira pico nem baixa a referência", () => {
  const db = synthetic(600, [[400, 405]]).map((v, i) => (i < 200 ? -100 : v));
  const peaks = pickPeaks(excitementCurve(db), { count: 3, minScore: 3 });
  assert.equal(peaks.length, 1);
  assert.ok(Math.abs(peaks[0].t - 402) < 6);
});

test("perfil de intensidade tem um valor a cada 2 s", () => {
  const curve = Array.from({ length: 100 }, (_, i) => (i === 51 ? 9 : 0));
  const prof = intensityProfile(curve, 40, 60);
  assert.equal(prof.length, 10);
  assert.equal(prof[5], 9);
});
