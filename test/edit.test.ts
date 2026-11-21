import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeEdit, wordLines } from "../src/analysis/edit";
import { keepRanges, mapToOutput, remapRanges, remapWords, shiftRanges, totalLength } from "../src/render/timeline";

const raw = (over: Partial<Parameters<typeof sanitizeEdit>[0]> = {}) => ({
  keep: true,
  score: 8,
  start: 110,
  end: 140,
  cuts: [] as Array<{ start: number; end: number; why: string }>,
  zooms: [] as Array<{ at: number; duration: number }>,
  emphasis: [] as string[],
  hook_title: "ELE FUGIU DE BICICLETA",
  bottom_text: "",
  title: "Fuga de bicicleta",
  caption: "Você teria fugido?",
  hashtags: ["gta6", "#gtarp"],
  reason: "reação forte",
  ...over,
});
const opts = { allowCuts: true, punchZoom: true };

test("linha do tempo com cortes", () => {
  const keeps = keepRanges(100, 130, [{ start: 110, end: 113 }, { start: 120, end: 121 }]);
  assert.deepEqual(keeps, [{ start: 100, end: 110 }, { start: 113, end: 120 }, { start: 121, end: 130 }]);
  assert.equal(totalLength(keeps), 26);
  assert.equal(mapToOutput(114, keeps), 11);
  assert.equal(mapToOutput(111, keeps), null);
  assert.deepEqual(shiftRanges(keeps, 100)[1], { start: 13, end: 20 });
  const words = remapWords(
    [
      { text: "antes", start: 108, end: 108.5 },
      { text: "cortada", start: 111, end: 111.5 },
      { text: "depois", start: 114, end: 114.5 },
    ],
    keeps,
  );
  assert.deepEqual(words.map((w) => [w.text, w.start]), [["antes", 8], ["depois", 11]]);
  assert.deepEqual(remapRanges([{ start: 112, end: 115 }], keeps), [{ start: 10, end: 12 }]);
});

test("editor: aceita uma edição válida e normaliza", () => {
  const d = sanitizeEdit(
    raw({ cuts: [{ start: 120, end: 122, why: "silêncio" }], zooms: [{ at: 130, duration: 1.2 }], emphasis: ["bicicleta", "bicicleta", "!!"] }),
    { start: 100, end: 175 },
    15,
    60,
    opts,
  )!;
  assert.deepEqual([d.start, d.end], [110, 140]);
  assert.deepEqual(d.cuts, [{ start: 120, end: 122 }]);
  assert.deepEqual(d.zooms, [{ start: 130, end: 131.2 }]);
  assert.deepEqual(d.emphasis, ["bicicleta"]);
  assert.deepEqual(d.hashtags, ["#gta6", "#gtarp"]);
});

test("editor: respeita janela, duração final e descarta", () => {
  assert.equal(sanitizeEdit(raw({ keep: false }), { start: 100, end: 175 }, 15, 60, opts), null);
  // longo demais (90 s) → encurta para 60 s finais
  const long = sanitizeEdit(raw({ start: 100, end: 190 }), { start: 100, end: 200 }, 15, 60, opts)!;
  assert.equal(totalLength(keepRanges(long.start, long.end, long.cuts)), 60);
  // fora da janela → puxa para dentro
  const out = sanitizeEdit(raw({ start: 50, end: 70 }), { start: 100, end: 175 }, 15, 60, opts)!;
  assert.ok(out.start >= 100 && out.end - out.start >= 15);
  // cortes que deixariam o corte curto demais são ignorados
  const short = sanitizeEdit(raw({ start: 110, end: 127, cuts: [{ start: 112, end: 120, why: "" }] }), { start: 100, end: 175 }, 15, 60, opts)!;
  assert.deepEqual(short.cuts, []);
});

test("editor: zoom dentro de corte, colado ou com recurso desligado é descartado", () => {
  const d = sanitizeEdit(
    raw({ cuts: [{ start: 120, end: 122, why: "" }], zooms: [{ at: 121, duration: 1 }, { at: 125, duration: 1 }, { at: 125.5, duration: 1 }, { at: 135, duration: 9 }] }),
    { start: 100, end: 175 },
    15,
    60,
    opts,
  )!;
  assert.deepEqual(d.zooms, [{ start: 125, end: 126 }, { start: 135, end: 137.5 }]);
  const off = sanitizeEdit(raw({ cuts: [{ start: 120, end: 122, why: "" }], zooms: [{ at: 125, duration: 1 }] }), { start: 100, end: 175 }, 15, 60, {
    allowCuts: false,
    punchZoom: false,
  })!;
  assert.deepEqual([off.cuts, off.zooms], [[], []]);
});

test("transcrição para o editor marca as pausas", () => {
  const txt = wordLines(
    [
      { text: "olha", start: 10, end: 10.3 },
      { text: "isso", start: 10.3, end: 10.6 },
      { text: "MANO", start: 12, end: 12.4 },
    ],
    0,
    20,
  );
  assert.match(txt, /\[t=10\.0\] olha isso/);
  assert.match(txt, /pausa de 1\.4s/);
  assert.match(txt, /\[t=12\.0\] MANO/);
});
