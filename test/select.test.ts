import assert from "node:assert/strict";
import { test } from "node:test";
import { fitToWindow, normalizeTag } from "../src/analysis/select";

test("mantém o corte dentro da janela e da duração pedida", () => {
  assert.deepEqual(fitToWindow(100, 130, 90, 165, 15, 60), { start: 100, end: 130 });
  // longo demais: corta o fim
  assert.deepEqual(fitToWindow(95, 200, 90, 165, 15, 60), { start: 95, end: 155 });
  // curto demais: expande para os dois lados
  assert.deepEqual(fitToWindow(120, 125, 90, 165, 15, 60), { start: 115, end: 130 });
  // fora da janela: puxa para dentro
  assert.deepEqual(fitToWindow(50, 80, 90, 165, 15, 60), { start: 90, end: 105 });
  // janela menor que o mínimo
  assert.equal(fitToWindow(0, 10, 0, 10, 15, 60), null);
});

test("normaliza hashtags", () => {
  assert.equal(normalizeTag("gta 6"), "#gta6");
  assert.equal(normalizeTag("##GTARP"), "#GTARP");
  assert.equal(normalizeTag("#ação"), "#ação");
  assert.equal(normalizeTag("#"), "");
});
