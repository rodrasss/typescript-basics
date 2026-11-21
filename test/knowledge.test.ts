import assert from "node:assert/strict";
import { test } from "node:test";
import { buildKnowledge, exampleLine, feedbackBlock, fmtViews, knowledgeStats, type KnowledgeExample } from "../src/analysis/knowledge";
import type { ClipRecord } from "../src/state";

const ex = (over: Partial<KnowledgeExample>): KnowledgeExample => ({
  source: "twitch",
  author: "alanzoka",
  title: "que isso mandy?",
  views: 51838,
  duration: 47,
  url: `https://x/${Math.random()}`,
  ...over,
});

test("formata exemplos e estatísticas", () => {
  assert.equal(fmtViews(51838), "51,8 mil");
  assert.equal(fmtViews(1_250_000), "1,3 mi");
  const line = exampleLine(ex({ transcript: "olha isso", peakAt: 12 }), true);
  assert.match(line, /Twitch · alanzoka · 51,8 mil views · 47s · pico aos 12s/);
  assert.match(line, /fala: "olha isso"/);
  const st = knowledgeStats([ex({ duration: 20, peakAt: 8 }), ex({ duration: 30, peakAt: 10 }), ex({ duration: 40, peakAt: 12, title: "KKKKKK" })]);
  assert.equal(st.durMedian, 30);
  assert.equal(st.peakMedian, 10);
});

test("filtra exemplos fracos ou em outro idioma", async () => {
  const { isUseful, looksPortuguese } = await import("../src/analysis/knowledge");
  assert.equal(looksPortuguese("ALANZOKA TOMOU UM SUSTO ABSURDO NO GTA 6! 😂"), true);
  assert.equal(looksPortuguese("You’re not allowed to play GTA 6"), false);
  assert.equal(looksPortuguese("Trailer de Personaje | LOS CORTÉS"), false);
  assert.equal(isUseful(ex({ source: "youtube", views: 50, title: "ALANZOKA NO GTA 6" })), false);
  assert.equal(isUseful(ex({ source: "youtube", views: 5000, title: "ALANZOKA NO GTA 6" })), true);
  assert.equal(isUseful(ex({ source: "twitch", views: 800, title: "aa" })), true);
});

test("monta a base com exemplos do streamer primeiro e o gosto do editor", () => {
  const clips = [
    { id: "a", streamer: "Alan", status: "published", score: 9, start: 0, end: 25, title: "Final do editor", hookTitle: "H", caption: "c", reason: "r", createdAt: "2026-11-20", ai: { title: "Título da IA", hookTitle: "H", caption: "c" } },
    { id: "b", streamer: "Alan", status: "rejected", score: 6, start: 0, end: 20, title: "Ruim", hookTitle: "H", caption: "c", reason: "sem graça", createdAt: "2026-11-19" },
  ] as unknown as ClipRecord[];
  const txt = buildKnowledge({
    streamer: { name: "Alan", twitch: "alanzoka" },
    clips,
    maxExamples: 10,
    playbook: "# Manual",
    examples: [ex({ author: "cellbit", title: "PÉ GRANDE", views: 90000 }), ex({})],
  });
  assert.ok(txt.indexOf("Mais vistos de Alan") < txt.indexOf("PÉ GRANDE"));
  assert.match(txt, /IA "Título da IA" → editor "Final do editor"/);
  assert.match(txt, /Rejeitou/);
  assert.equal(feedbackBlock([]), "");
});
