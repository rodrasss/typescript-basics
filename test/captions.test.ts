import assert from "node:assert/strict";
import { test } from "node:test";
import { assColor, assTime, buildAss, chunkWords, inlineColor } from "../src/render/captions";

test("formata tempo e cor no padrão ASS", () => {
  assert.equal(assTime(0), "0:00:00.00");
  assert.equal(assTime(3725.456), "1:02:05.46");
  assert.equal(assColor("#FFE600"), "&H0000E6FF");
  assert.equal(inlineColor("#FFE600"), "&H00E6FF&");
});

test("agrupa palavras em blocos curtos e quebra em pausa/pontuação", () => {
  const w = (text: string, start: number) => ({ text, start, end: start + 0.3 });
  const chunks = chunkWords([w("olha", 0), w("isso", 0.3), w("mano!", 0.6), w("que", 2), w("isso", 2.3)]);
  assert.deepEqual(
    chunks.map((c) => c.map((x) => x.text).join(" ")),
    ["olha isso mano!", "que isso"],
  );
});

test("gera um evento por palavra com destaque, mais título e crédito", () => {
  const ass = buildAss({
    words: [
      { text: "corre", start: 0.5, end: 0.9 },
      { text: "{polícia}", start: 0.9, end: 1.4 },
    ],
    duration: 5,
    hookTitle: "ELE FUGIU DA POLÍCIA",
    credit: "twitch.tv/exemplo",
  });
  const dialogues = ass.split("\n").filter((l) => l.startsWith("Dialogue:"));
  assert.equal(dialogues.length, 4);
  assert.ok(dialogues.some((l) => l.includes(",Hook,") && l.includes("ELE FUGIU DA POLÍCIA")));
  assert.ok(dialogues.some((l) => l.includes(",Credit,")));
  // chaves do texto não podem virar tags ASS
  assert.ok(!ass.includes("{POLÍCIA}") && ass.includes("(POLÍCIA)"));
  assert.ok(dialogues.some((l) => l.includes("{\\c&H00E6FF&\\fscx112\\fscy112}CORRE{\\r}")));
});
