import assert from "node:assert/strict";
import { test } from "node:test";
import { frameTimes } from "../src/analysis/frames";
import { marginsFor, videoGraph } from "../src/render/render";

test("layout split empilha câmera e jogo", () => {
  const g = videoGraph("split", 1, { x: 0.75, y: 0, w: 0.25, h: 0.3 });
  assert.ok(g.includes("crop=iw*0.2500:ih*0.3000:iw*0.7500:ih*0.0000"));
  assert.ok(g.includes("vstack=inputs=2[base]"));
  assert.ok(marginsFor("split").hookMarginV <= 100, "no split o gancho fica no topo");
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

import { buildAss } from "../src/render/captions";
import { punchFilter, segmentsGraph } from "../src/render/render";

test("cortes internos viram select/aselect num fluxo só (sem estourar a memória)", () => {
  const g = segmentsGraph([{ start: 0, end: 4 }, { start: 7, end: 12 }], true);
  assert.equal(g.v, "[cv]");
  assert.match(g.graph, /\[0:v\]fps=30,select='between\(t,0\.000,4\.000\)\+between\(t,7\.000,12\.000\)',setpts=N\/FRAME_RATE\/TB\[cv\]/);
  assert.match(g.graph, /aselect='.*',asetpts=N\/SR\/TB\[ca\]/);
  assert.doesNotMatch(g.graph, /concat/);
  assert.equal(segmentsGraph(undefined, true).v, "[0:v]");
});

test("zoom de reação usa zoompan com tamanho fixo", () => {
  const f = punchFilter([{ start: 5, end: 6.5 }], 1080, 608);
  assert.match(f, /zoompan=z='if\(between\(it,5\.00,6\.50\),1\.18,1\)'/);
  assert.match(f, /s=1080x608/);
  assert.equal(punchFilter([], 1080, 608), "");
  const g = videoGraph("blur", 1.15, undefined, { zooms: [{ start: 1, end: 2 }], srcW: 1920, srcH: 1080 });
  assert.match(g, /scale=1242:698,crop=1080:698,fps=30,zoompan/);
});

test("palavras-chave ganham a cor de destaque", () => {
  const ass = buildAss({
    words: [
      { text: "a", start: 0, end: 0.3 },
      { text: "Polícia!", start: 0.3, end: 0.8 },
    ],
    duration: 2,
    emphasis: ["policia"],
    emphasisColor: "#4DFF6A",
  });
  assert.match(ass, /\{\\c&H6AFF4D&\}POLÍCIA!\{\\r\}/);
  assert.match(ass, /\{\\c&H6AFF4D&\\fscx122\\fscy122\}POLÍCIA!/);
});

import { blurVideoHeight } from "../src/render/render";

test("nenhum texto no meio do vídeo (layout blur)", () => {
  const h = blurVideoHeight(1.15, 1920, 1080); // 698
  const top = (1920 - h) / 2;
  const bottom = top + h;
  const m = marginsFor("blur", h);
  assert.ok(m.hookMarginV + 110 <= top, "gancho acima do vídeo");
  assert.equal(m.captionAlign, 8);
  assert.ok(m.captionMarginV >= bottom, "legenda abaixo do vídeo");
  assert.ok(m.footerMarginV > m.captionMarginV, "rodapé abaixo da legenda");
  assert.ok(1920 - m.creditMarginV > m.footerMarginV + 50, "crédito por último");
});

import { matchesGame } from "../src/pipeline";

test("filtro de jogo pela categoria ou título (Kick/YouTube)", () => {
  const games = ["Grand Theft Auto VI", "Grand Theft Auto V"];
  const kw = ["gta", "vice city", "grand theft auto", "rp", "gtarp"];
  assert.equal(matchesGame({ title: "🥥60 FPS GTA 6🥥LIVE", categories: ["Just Chatting"] }, games, kw), true);
  assert.equal(matchesGame({ title: "VICE CITY BABYYYY", categories: [] }, games, kw), true);
  assert.equal(matchesGame({ title: "CIDADE ALTA RP - POLICIAL", categories: [] }, games, kw), true);
  assert.equal(matchesGame({ title: "jogando RPG novo", categories: [] }, games, kw), false);
  assert.equal(matchesGame({ title: "VALORANT CHAMPIONS", categories: ["VALORANT"] }, games, kw), false);
  assert.equal(matchesGame({ title: "qualquer coisa", categories: ["Grand Theft Auto V"] }, games, kw), true);
  assert.equal(matchesGame({ title: "qualquer coisa", categories: [] }, [], kw), true);
});
