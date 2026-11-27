import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarTodos, planejar, construirCaso } from '../gerador/gerar.ts';
import type { Caso } from '../gerador/gerar.ts';
import { renderEntrada, renderGabarito } from '../gerador/render.ts';
import { CENARIOS } from '../gerador/cenarios.ts';
import { PERFIS } from '../gerador/catalogo.ts';

let cache: Caso[] | null = null;
const casos = (): Caso[] => (cache ??= gerarTodos(200, 2026));

test('gera 200 casos com ids e nomes únicos', () => {
  const cs = casos();
  assert.equal(cs.length, 200);
  assert.equal(new Set(cs.map((c) => c.id)).size, 200);
  assert.equal(new Set(cs.map((c) => c.fundo.nome)).size, 200);
});

test('é determinístico: mesma semente, mesmos casos', () => {
  const planos = planejar(200, 2026).slice(0, 12);
  const a = planos.map((p) => construirCaso(p, new Set()));
  const b = planos.map((p) => construirCaso(p, new Set()));
  assert.deepEqual(a, b);
});

test('cobertura: todos os tipos de fundo e todos os cenários aparecem', () => {
  const cs = casos();
  for (const t of Object.keys(PERFIS)) {
    const n = cs.filter((c) => c.fundo.tipo === t).length;
    assert.ok(n >= 8, `tipo ${t} com apenas ${n} casos`);
  }
  for (const cen of CENARIOS) {
    const n = cs.filter((c) => c.gabarito.cenarios.includes(cen.id)).length;
    assert.ok(n >= 3, `cenário ${cen.id} com apenas ${n} casos`);
  }
});

test('mistura de resultados: aprova, reprova e deixa pendente; há casos limpos e difíceis', () => {
  const cs = casos();
  const cont = (f: (c: Caso) => boolean): number => cs.filter(f).length;
  const limpos = cont((c) => c.gabarito.cenarios.every((i) => i.startsWith('tudo_bate')));
  assert.ok(limpos >= 30 && limpos <= 50, `casos limpos: ${limpos}`);
  assert.ok(cont((c) => c.gabarito.parecer === 'REPROVADO') >= 50);
  assert.ok(cont((c) => c.gabarito.parecer === 'PENDENTE') >= 8);
  assert.ok(cont((c) => c.gabarito.dificuldade === 'dificil') >= 20, 'poucos casos difíceis');
  assert.ok(cont((c) => c.gabarito.achados.length >= 2) >= 40, 'poucos casos com mais de um achado');
});

test('o lado errado é sorteado de forma equilibrada', () => {
  const lados = casos().flatMap((c) => c.gabarito.achados.map((a) => a.ladoCorreto)).filter((l) => l === 'Alfa' || l === 'Beta');
  const alfa = lados.filter((l) => l === 'Alfa').length;
  const p = alfa / lados.length;
  assert.ok(p > 0.35 && p < 0.65, `Alfa correto em ${(p * 100).toFixed(0)}% dos achados`);
});

test('invariantes numéricos: caixa não negativo, sem NaN, cota positiva', () => {
  for (const c of casos()) {
    for (const lado of [c.lados.Alfa, c.lados.Beta]) {
      assert.ok(lado.resultado.caixa >= 0, `${c.id}: caixa negativo`);
      assert.ok(lado.resultado.cota > 0, `${c.id}: cota não positiva`);
      assert.ok(lado.resultado.qtdFinal > 0, `${c.id}: quantidade de cotas não positiva`);
    }
    const txt = renderEntrada(c) + renderGabarito(c);
    assert.ok(!/NaN|undefined|Infinity|\[object/.test(txt), `${c.id}: texto com valor inválido`);
  }
});

test('a contabilidade de cada lado fecha: PL base e PL final', () => {
  for (const c of casos()) {
    for (const lado of [c.lados.Alfa, c.lados.Beta]) {
      const r = lado.resultado;
      const pl = Math.round((r.totalAtivos + r.caixa + r.totalReceber - r.totalPagar - r.totalProvisoes) * 100) / 100;
      assert.equal(pl, r.plBase, `${c.id}: PL base não fecha`);
      assert.equal(Math.round(r.qtdFinal * r.cota * 100) / 100, r.plFinal, `${c.id}: PL final não fecha`);
    }
  }
});

test('casos limpos: Alfa e Beta idênticos nas três validações', () => {
  for (const c of casos().filter((x) => x.gabarito.cenarios.every((i) => i.startsWith('tudo_bate')))) {
    assert.equal(c.gabarito.parecer, 'APROVADO');
    assert.equal(c.lados.Alfa.resultado.cota, c.lados.Beta.resultado.cota, c.id);
    assert.equal(c.lados.Alfa.resultado.caixa, c.lados.Beta.resultado.caixa, c.id);
    assert.equal(c.lados.Alfa.resultado.totalProvisoes, c.lados.Beta.resultado.totalProvisoes, c.id);
    assert.equal(c.lados.Alfa.resultado.qtdFinal, c.lados.Beta.resultado.qtdFinal, c.id);
  }
});

test('o gabarito é consistente com os números: o lado "correto" coincide com a posição correta', () => {
  for (const c of casos()) {
    const porDim = new Map<string, number>();
    for (const a of c.gabarito.achados) for (const d of a.dimensoes) porDim.set(d, (porDim.get(d) ?? 0) + 1);
    for (const a of c.gabarito.achados) {
      if (a.ladoCorreto !== 'Alfa' && a.ladoCorreto !== 'Beta') continue;
      for (const d of a.dimensoes) {
        if (porDim.get(d) === 1) {
          assert.equal(c.gabarito.corretoPorDimensao[d], a.ladoCorreto, `${c.id} (${a.cenario}) dimensão ${d}`);
        }
      }
    }
  }
});

test('a entrada não vaza o gabarito', () => {
  for (const c of casos()) {
    const e = renderEntrada(c);
    assert.ok(!/GABARITO|Causa raiz|Raciocínio do analista/.test(e), `${c.id}: entrada com marcador de gabarito`);
    for (const a of c.gabarito.achados) {
      assert.ok(!e.includes(a.causaRaiz), `${c.id}: entrada contém a causa raiz`);
      assert.ok(!e.includes(a.titulo) || a.titulo.length < 25, `${c.id}: entrada contém o título do achado`);
    }
    for (const id of c.gabarito.cenarios) assert.ok(!e.includes(id), `${c.id}: entrada contém o id do cenário ${id}`);
  }
});

test('persona coerente: marcos da história não são anteriores à criação do fundo', () => {
  for (const c of casos()) {
    const ano = Number(c.fundo.inicio.slice(0, 4));
    for (const m of c.fundo.marcos) {
      const y = m.match(/\b(20\d\d)\b/);
      if (y) assert.ok(Number(y[1]) >= ano, `${c.id}: "${m}" é anterior a ${ano}`);
    }
    if (c.fundo.condominio === 'fechado') {
      const txt = c.fundo.historia;
      assert.ok(!/resgates quase todos os dias|forte resgate/.test(txt), `${c.id}: fundo fechado com resgates`);
    }
  }
});

test('datas-base são dias úteis', () => {
  for (const c of casos()) assert.ok(!['sábado', 'domingo'].includes(c.diaSemana), `${c.id}: ${c.diaSemana}`);
});
