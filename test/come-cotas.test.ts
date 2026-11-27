import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarSessaoComeCotas, gerarTodos } from '../gerador/gerar.ts';
import type { Caso } from '../gerador/gerar.ts';
import { renderEntrada } from '../gerador/render.ts';
import { datasComeCotas, penultimoDiaUtilDoMes, ultimoDiaUtilDoMes, ehDiaUtil } from '../gerador/util.ts';
import { CENARIOS_CC } from '../gerador/cenarios-come-cotas.ts';
import { aliquotaPorPrazo, REGRA_SEM_COME_COTAS } from '../gerador/come-cotas.ts';

let cache: Caso[] | null = null;
const sessao = (): Caso[] => (cache ??= gerarSessaoComeCotas(33, 2026));
const primario = (c: Caso): string => c.gabarito.cenarios[0];
const perto = (a: number, b: number, tol = 1e-7): boolean => Math.abs(a - b) <= tol;

test('sessão come-cotas: 33 casos com ids e nomes únicos', () => {
  const cs = sessao();
  assert.equal(cs.length, 33);
  assert.equal(new Set(cs.map((c) => c.id)).size, 33);
  assert.equal(new Set(cs.map((c) => c.fundo.nome)).size, 33);
  assert.ok(cs.every((c) => /^cc-\d{3}$/.test(c.id)));
});

test('a data-base é o penúltimo dia útil de maio ou de novembro (e não o último)', () => {
  const datas = datasComeCotas([2025, 2026]);
  for (const c of sessao()) {
    assert.ok(datas.includes(c.data), `${c.id}: ${c.data} não é data de come-cotas`);
    assert.equal(c.data, penultimoDiaUtilDoMes(c.data), `${c.id}`);
    assert.notEqual(c.data, ultimoDiaUtilDoMes(c.data), `${c.id}: é o último dia útil`);
    assert.ok(ehDiaUtil(c.data) && ehDiaUtil(ultimoDiaUtilDoMes(c.data)));
  }
  for (const d of datas) assert.ok(sessao().filter((c) => c.data === d).length >= 5, `poucos casos em ${d}`);
});

test('cobertura: os 10 cenários e vários tipos de fundo', () => {
  const cs = sessao();
  for (const cen of CENARIOS_CC) assert.ok(cs.filter((c) => primario(c) === cen.id).length >= 3, `cenário ${cen.id} com poucos casos`);
  assert.ok(new Set(cs.map((c) => c.fundo.tipo)).size >= 8, 'pouca variedade de tipos');
});

test('parecer: só o caso correto aprova; todo erro de come-cotas reprova', () => {
  for (const c of sessao()) {
    if (primario(c) === 'cc_correto') {
      assert.equal(c.gabarito.parecer, 'APROVADO', c.id);
      assert.equal(c.gabarito.cenarios.length, 1, `${c.id}: caso correto não pode ter combinação`);
    } else assert.equal(c.gabarito.parecer, 'REPROVADO', `${c.id} (${primario(c)})`);
  }
});

test('contabilidade do come-cotas: posições somam a quantidade existente e as cotas retiradas fecham', () => {
  for (const c of sessao()) {
    for (const lado of [c.lados.Alfa, c.lados.Beta]) {
      const cc = lado.posicao.comeCotas;
      if (!cc || !cc.aplicar) continue;
      const r = lado.resultado;
      const qAposMov = lado.posicao.qtdCotasBase + r.cotasEmitidas - r.cotasResgatadas;
      assert.ok(perto(r.detalheComeCotas.reduce((a, d) => a + d.qtdCotas, 0), qAposMov), `${c.id}: posições não somam a quantidade existente`);
      assert.ok(perto(r.detalheComeCotas.reduce((a, d) => a + d.cotasRetiradas, 0), r.cotasComeCotas), `${c.id}: cotas retiradas não fecham`);
      assert.ok(perto(r.qtdFinal, qAposMov - r.cotasComeCotas), `${c.id}: quantidade final não fecha`);
      assert.ok(Math.abs(r.detalheComeCotas.reduce((a, d) => a + d.ir, 0) - r.irComeCotas) <= 0.011, `${c.id}: IR não fecha`);
    }
  }
});

test('o lado correto segue a regra: alíquota pelo prazo médio, isento e prejuízo sem retenção', () => {
  for (const c of sessao()) {
    const p = primario(c);
    const prazoMedio = c.mercado.prazoMedioCarteira;
    for (const [nome, lado] of [['Alfa', c.lados.Alfa], ['Beta', c.lados.Beta]] as const) {
      const cc = lado.posicao.comeCotas;
      if (!cc || !cc.aplicar) continue;
      const ladoErrado = c.gabarito.achados.some((a) => a.ladoCorreto !== nome && a.ladoCorreto !== 'nenhum' && a.cenario === p);
      if (ladoErrado) continue;
      assert.equal(cc.aliquota, aliquotaPorPrazo(prazoMedio!), `${c.id} ${nome}: alíquota ≠ regra do prazo médio (${prazoMedio} dias)`);
      for (const d of lado.resultado.detalheComeCotas) {
        const pos = cc.posicoes.find((x) => x.id === d.id)!;
        if (pos.tratamento === 'isento') assert.equal(d.ir, 0, `${c.id}: cotista isento com IR`);
        if (d.ganho === 0) assert.equal(d.cotasRetiradas, 0, `${c.id}: posição sem ganho com cotas retiradas`);
        assert.ok(d.ir >= 0 && d.cotasRetiradas >= 0, `${c.id}: IR ou cotas negativos no lado correto`);
      }
    }
  }
});

test('cenários de erro deixam a marca esperada nos números', () => {
  for (const c of sessao()) {
    const a = c.lados.Alfa.resultado;
    const b = c.lados.Beta.resultado;
    switch (primario(c)) {
      case 'cc_nao_aplicado':
      case 'cc_calendario_ultimo_dia':
        assert.ok(a.cotasComeCotas === 0 || b.cotasComeCotas === 0, c.id);
        assert.notEqual(a.cotasComeCotas, b.cotasComeCotas, c.id);
        break;
      case 'cc_duplicado': {
        const [maior, menor] = a.cotasComeCotas > b.cotasComeCotas ? [a, b] : [b, a];
        assert.ok(Math.abs(maior.cotasComeCotas - 2 * menor.cotasComeCotas) <= 2e-8 * menor.detalheComeCotas.length, `${c.id}: não é o dobro`);
        break;
      }
      case 'cc_cota_conversao_d1':
        assert.equal(a.irComeCotas, b.irComeCotas, `${c.id}: o IR deveria ser igual`);
        assert.notEqual(a.cotasComeCotas, b.cotasComeCotas, c.id);
        break;
      case 'cc_isento_tributado':
        assert.ok(!!c.lados.Alfa.posicao.comeCotas !== !!c.lados.Beta.posicao.comeCotas, `${c.id}: só um lado deveria ter come-cotas`);
        assert.ok(c.regulamento.especificos.includes(REGRA_SEM_COME_COTAS), c.id);
        break;
      case 'cc_prejuizo_devolvido':
        assert.ok(a.cotasComeCotas < 0 || b.cotasComeCotas < 0 || [a, b].some((r) => r.detalheComeCotas.some((d) => d.cotasRetiradas < 0)), `${c.id}: sem devolução de cotas`);
        break;
      default:
        break;
    }
  }
});

test('a entrada mostra a seção de come-cotas, o prazo médio e a regra, sem vazar o gabarito', () => {
  for (const c of sessao()) {
    const e = renderEntrada(c);
    assert.ok(e.includes('### 5.9 Come-cotas'), `${c.id}: sem a seção de come-cotas`);
    assert.ok(e.includes('Prazo médio da carteira'), `${c.id}: sem o prazo médio`);
    if (primario(c) === 'cc_isento_tributado') assert.ok(e.includes('não está sujeito ao come-cotas'), `${c.id}: sem a regra de fundo isento`);
    else assert.ok(/penúltimo dia útil/.test(e), `${c.id}: sem a regra do penúltimo dia útil`);
    for (const id of c.gabarito.cenarios) assert.ok(!e.includes(id), `${c.id}: entrada contém o id ${id}`);
    for (const a of c.gabarito.achados) assert.ok(!e.includes(a.causaRaiz), `${c.id}: entrada contém a causa raiz`);
  }
});

test('o calendário do come-cotas também vale no dataset geral', () => {
  const datas = datasComeCotas([2025, 2026]);
  const gerais = gerarTodos(200, 2026).filter((c) => c.gabarito.cenarios.includes('come_cotas_nao_aplicado'));
  assert.ok(gerais.length >= 3);
  for (const c of gerais) assert.ok(datas.includes(c.data), `${c.id}: ${c.data} não é penúltimo dia útil de maio/novembro`);
});
