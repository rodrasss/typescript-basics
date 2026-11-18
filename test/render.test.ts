import assert from "node:assert/strict";
import { test } from "node:test";
import { frameTimes } from "../src/analysis/frames";
import { marginsFor, videoGraph } from "../src/render/render";

test("layout split empilha câmera e jogo", () => {
  const g = videoGraph("split", 1, { x: 0.75, y: 0, w: 0.25, h: 0.3 });
  assert.ok(g.includes("crop=iw*0.2500:ih*0.3000:iw*0.7500:ih*0.0000"));
  assert.ok(g.includes("vstack=inputs=2[base]"));
  assert.ok(marginsFor("split").hookMarginV > marginsFor("blur").hookMarginV);
});

test("layout split sem facecam cai no blur", () => {
  assert.ok(videoGraph("split", 1).includes("boxblur"));
});

test("frames ficam dentro do trecho e perto do pico", () => {
  assert.deepEqual(frameTimes(100, 175, 3, 150), [130, 142, 154]);
  assert.deepEqual(frameTimes(0, 30, 3), [3, 15, 27]);
  assert.deepEqual(frameTimes(0, 30, 0), []);
  for (const t of frameTimes(100, 120, 4, 101)) assert.ok(t >= 100 && t <= 120);
});
