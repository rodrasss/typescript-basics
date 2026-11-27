import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { melhorLimite, calibrar, lerOpinioes, relatorio } from '../gerador/calibrar.ts';
import type { Opiniao } from '../gerador/calibrar.ts';

test('melhorLimite: grupos separáveis dão o ponto médio e nenhum erro', () => {
  const r = melhorLimite([10, 50, 200], [300, 800], 250);
  assert.equal(r.erros, 0);
  assert.equal(r.limite, 250);
});

test('melhorLimite: opiniões sobrepostas deixam erros', () => {
  const r = melhorLimite([10, 400], [300, 800], 250);
  assert.equal(r.erros, 1);
});

test('melhorLimite: sem aprovadas ou sem reprovadas não sugere limite', () => {
  assert.deepEqual(melhorLimite([], [5], 100), { limite: null, erros: 0 });
  assert.deepEqual(melhorLimite([5], [], 100), { limite: null, erros: 0 });
});

test('calibrar: resume por dimensão e avisa quando a régua está apertada ou frouxa', () => {
  const ops: Opiniao[] = [
    { caso: 'a', dimensao: 'cota', diferenca: 100, parecerIA: 'APROVADO', parecerAnalista: 'APROVADO' },
    { caso: 'b', dimensao: 'cota', diferenca: 400, parecerIA: 'REPROVADO', parecerAnalista: 'APROVADO' },
    { caso: 'c', dimensao: 'cota', diferenca: 700, parecerIA: 'REPROVADO', parecerAnalista: 'REPROVADO' },
    { caso: 'd', dimensao: 'provisoes', diferenca: 60, parecerIA: 'APROVADO', parecerAnalista: 'REPROVADO' },
    { caso: 'e', dimensao: 'provisoes', diferenca: 300, parecerIA: 'REPROVADO', parecerAnalista: 'PENDENTE' },
  ];
  const [cota, caixa, prov] = calibrar(ops);
  assert.equal(cota.n, 3);
  assert.equal(cota.aprovadasAcimaDoLimite, 1);
  assert.equal(cota.maiorAprovada, 400);
  assert.equal(cota.limiteSugerido, 550);
  assert.equal(caixa.n, 0);
  assert.equal(prov.reprovadasAbaixoDoLimite, 1);
  assert.equal(prov.pendentes, 1);
  assert.ok(relatorio([cota, caixa, prov]).includes('apertada demais'));
});

test('exemplo fictício: lê, ignora comentários e sugere limites coerentes', () => {
  const ops = lerOpinioes(readFileSync(new URL('../base-de-opinioes/exemplo.jsonl', import.meta.url), 'utf8'));
  assert.equal(ops.length, 10);
  const [cota, caixa, prov] = calibrar(ops);
  assert.equal(cota.limiteSugerido, 610);
  assert.equal(prov.limiteSugerido, 113);
  assert.equal(caixa.limiteSugerido, null);
});

test('lerOpinioes rejeita dimensão inválida', () => {
  assert.throws(() => lerOpinioes('{"caso":"x","dimensao":"outra","diferenca":1,"parecerIA":"APROVADO","parecerAnalista":"APROVADO"}'));
});
