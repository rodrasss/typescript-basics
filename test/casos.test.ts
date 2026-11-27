import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gerarTodos, planejar, construirCaso, GERAIS } from '../gerador/gerar.ts';
import type { Caso } from '../gerador/gerar.ts';
import { renderEntrada, renderGabarito } from '../gerador/render.ts';
import { PERFIS } from '../gerador/catalogo.ts';
import { ehDiaUtil, somaDias, somaDiasUteis, proximoUtil, diasUteisEntre } from '../gerador/util.ts';
import { REGUA, REGUA_JSON } from '../gerador/regua.ts';
import { readFileSync } from 'node:fs';

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
  for (const cen of GERAIS) {
    const n = cs.filter((c) => c.gabarito.cenarios.includes(cen.id)).length;
    assert.ok(n >= 3, `cenário ${cen.id} com apenas ${n} casos`);
  }
});

test('mistura de resultados: aprova, reprova e deixa pendente; há casos limpos e difíceis', () => {
  const cs = casos();
  const cont = (f: (c: Caso) => boolean): number => cs.filter(f).length;
  const limpos = cont((c) => c.gabarito.cenarios.every((i) => i.startsWith('tudo_bate')));
  assert.ok(limpos >= 20 && limpos <= 40, `casos limpos: ${limpos}`);
  assert.ok(cont((c) => c.gabarito.parecer === 'REPROVADO') >= 50);
  assert.ok(cont((c) => c.gabarito.parecer === 'PENDENTE') >= 12);
  assert.ok(cont((c) => c.gabarito.parecer === 'APROVADO' && c.gabarito.ressalva) >= 15, 'poucas aprovações com ressalva');
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
    const proprias = (a: Caso['gabarito']['achados'][number]): string[] => a.dimensoes.filter((d) => !(a.dimensoesDerivadas ?? []).includes(d));
    const porDim = new Map<string, number>();
    for (const a of c.gabarito.achados) for (const d of proprias(a)) porDim.set(d, (porDim.get(d) ?? 0) + 1);
    for (const a of c.gabarito.achados) {
      if (a.ladoCorreto !== 'Alfa' && a.ladoCorreto !== 'Beta') continue;
      for (const d of proprias(a)) {
        if (porDim.get(d) === 1) {
          assert.equal(c.gabarito.corretoPorDimensao[d as 'cota' | 'caixa' | 'provisoes'], a.ladoCorreto, `${c.id} (${a.cenario}) dimensão ${d}`);
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

// ---------------------------------------------------------------------------------------------
// Regressões dos defeitos apontados pelos agentes na primeira rodada de avaliação
// ---------------------------------------------------------------------------------------------

function prazoDoRegulamento(c: Caso): { cot: number; corridos: boolean; liq: number } | null {
  const txt = c.regulamento.cotizacao.find((x) => x.startsWith('Resgate'));
  if (!txt) return null;
  const mc = txt.match(/cotização em D\+(\d+) (dias corridos|dia útil|dias úteis)/);
  const ml = txt.match(/liquidação financeira em D\+(\d+) /);
  return { cot: mc ? Number(mc[1]) : 0, corridos: mc ? mc[2] === 'dias corridos' : false, liq: ml ? Number(ml[1]) : 0 };
}

test('passivo: pedido, cotização e liquidação seguem o prazo do regulamento e caem em dias úteis', () => {
  for (const c of casos()) {
    const pz = prazoDoRegulamento(c);
    if (!pz) continue;
    for (const lado of [c.lados.Alfa, c.lados.Beta]) {
      for (const m of lado.posicao.movs.filter((x) => x.tipo === 'resgate')) {
        for (const d of [m.solicitadoEm, m.cotizacao, m.liquidacao]) assert.ok(ehDiaUtil(d), `${c.id} ${m.id}: ${d} não é dia útil`);
        const cotEsperada: string = pz.corridos ? proximoUtil(somaDias(m.solicitadoEm, pz.cot)) : somaDiasUteis(m.solicitadoEm, pz.cot);
        assert.equal(m.cotizacao, cotEsperada, `${c.id} ${m.id}: cotização fora do prazo do regulamento`);
        assert.equal(m.liquidacao, somaDiasUteis(m.cotizacao, pz.liq), `${c.id} ${m.id}: liquidação fora do prazo do regulamento`);
      }
    }
  }
});

test('passivo: resgate cotizado em D−1 usa exatamente a cota de D−1 do cabeçalho', () => {
  let conferidos = 0;
  for (const c of casos()) {
    for (const m of c.lados.Alfa.posicao.movs.filter((x) => x.tipo === 'resgate' && x.valor !== undefined && x.cotizacao === c.dAnterior)) {
      const esperado = Math.round(m.cotas! * c.anterior.cota * 100) / 100;
      assert.ok(Math.abs(m.valor! - esperado) <= 0.011, `${c.id} ${m.id}: valor ${m.valor} ≠ cotas × cota de D−1 (${esperado})`);
      conferidos++;
    }
  }
  assert.ok(conferidos > 20, `poucos resgates conferidos (${conferidos})`);
});

test('passivo: "resgates a pagar" é a soma dos resgates já cotizados que ainda não liquidaram', () => {
  for (const c of casos()) {
    const base = c.lados.Beta.posicao;
    const item = base.aPagar.find((i) => i.codigo === 'RESGATES A PAGAR');
    const pend = base.movs.filter((m) => m.id.startsWith('PEN-')).reduce((a, m) => a + (m.valor ?? 0), 0);
    if (item && c.gabarito.cenarios.every((i) => i !== 'resgate_liquidado_nao_baixado')) {
      assert.ok(Math.abs(item.valor - pend) <= 0.011, `${c.id}: resgates a pagar ${item.valor} ≠ pendências ${pend}`);
    }
  }
});

test('a quantidade de cotas não muda sem movimento de passivo', () => {
  for (const c of casos()) {
    for (const lado of [c.lados.Alfa, c.lados.Beta]) {
      const semMov = lado.posicao.movs.every((m) => !m.converterHoje) && !(lado.posicao.comeCotas?.aplicar);
      if (semMov) assert.equal(lado.resultado.qtdFinal, lado.posicao.qtdCotasBase, `${c.id}: quantidade mudou sem movimento`);
    }
  }
});

test('cabeçalho: a cota de D−1 é exatamente PL ÷ quantidade, truncada em 8 casas', () => {
  for (const c of casos()) {
    assert.equal(c.anterior.cota, Math.trunc((c.anterior.pl / c.anterior.qtdCotas) * 1e8) / 1e8, `${c.id}`);
  }
});

test('benchmark: o fator do CDI é compatível com o CDI do dia e o número de dias úteis', () => {
  let conferidos = 0;
  for (const c of casos()) {
    const perfs = [c.lados.Alfa.posicao.perf, c.lados.Beta.posicao.perf].filter((p) => p && p.benchmark === '100% do CDI');
    if (!perfs.length) continue;
    const algumCorreto = perfs.some((p) => {
      const esperado = Math.pow(1 + c.mercado.cdiAA, diasUteisEntre(p!.dataBase, c.data) / 252);
      return Math.abs(p!.fatorBenchmark - esperado) < 1e-6;
    });
    assert.ok(algumCorreto, `${c.id}: fator do CDI incompatível com ${(c.mercado.cdiAA * 100).toFixed(2)}% a.a.`);
    conferidos++;
  }
  assert.ok(conferidos >= 10, `poucos casos conferidos (${conferidos})`);
});

test('regulamento: a vigência nunca é posterior à data-base', () => {
  for (const c of casos()) {
    const [d, m, a] = c.regulamento.vigencia.slice(0, 10).split('/');
    assert.ok(`${a}-${m}-${d}` <= c.data, `${c.id}: vigência ${a}-${m}-${d} posterior à data-base ${c.data}`);
  }
});

test('a marca de ressalva só existe quando o parecer é APROVADO', () => {
  for (const c of casos()) {
    if (c.gabarito.ressalva) assert.equal(c.gabarito.parecer, 'APROVADO', `${c.id}: ressalva com parecer ${c.gabarito.parecer}`);
  }
});

// ---------------------------------------------------------------------------------------------
// Régua de materialidade v1 (provisória)
// ---------------------------------------------------------------------------------------------

test('régua: o parecer decorre das medidas do caso', () => {
  for (const c of casos()) {
    const m = c.gabarito.regua;
    const acima = m.cota.acima || m.caixa.acima || m.provisoes.acima;
    if (c.gabarito.parecer === 'APROVADO') assert.ok(!acima, `${c.id}: APROVADO com dimensão acima da régua`);
    if (c.gabarito.parecer === 'REPROVADO') assert.ok(acima, `${c.id}: REPROVADO sem dimensão acima da régua`);
    if (c.gabarito.parecer === 'PENDENTE') assert.ok(c.gabarito.achados.some((a) => a.gravidade === 'pendencia') && !c.gabarito.achados.some((a) => a.gravidade === 'erro'), `${c.id}: PENDENTE inconsistente`);
    for (const a of c.gabarito.achados) assert.ok(['informativo', 'ressalva', 'pendencia', 'erro'].includes(a.gravidade!), `${c.id}: achado sem gravidade final`);
  }
});

test('régua: caixa sem tolerância, cota abaixo de 250 e provisões até R$ 100 ficam dentro', () => {
  for (const c of casos()) {
    const m = c.gabarito.regua;
    assert.equal(m.caixa.acima, m.difCaixa > REGUA.caixaToleranciaReais + 0.005, `${c.id}`);
    assert.equal(m.cota.acima, m.difCotasEquivalentes >= REGUA.cotasMinimas, `${c.id}`);
    assert.equal(m.provisoes.acima, m.maiorDifProvisao > REGUA.provisaoMaxReais || m.difTotalProvisoes > REGUA.provisaoMaxReais, `${c.id}`);
  }
});

test('régua: os casos de fronteira caem do lado certo', () => {
  const por = (id: string): Caso[] => casos().filter((c) => c.gabarito.cenarios[0] === id);
  for (const c of por('reg_cota_dentro')) { assert.ok(c.gabarito.regua.difCotasEquivalentes < REGUA.cotasMinimas && !c.gabarito.regua.provisoes.acima, c.id); assert.equal(c.gabarito.parecer, 'APROVADO', c.id); assert.ok(c.gabarito.ressalva, c.id); }
  for (const c of por('reg_cota_acima')) { assert.ok(c.gabarito.regua.difCotasEquivalentes >= REGUA.cotasMinimas, c.id); assert.equal(c.gabarito.parecer, 'REPROVADO', c.id); }
  for (const c of por('reg_provisao_dentro')) { assert.ok(!c.gabarito.regua.provisoes.acima && !c.gabarito.regua.cota.acima, c.id); assert.equal(c.gabarito.parecer, 'APROVADO', c.id); assert.ok(c.gabarito.ressalva, c.id); }
  for (const c of por('reg_provisao_acima')) { assert.ok(c.gabarito.regua.provisoes.acima, c.id); assert.equal(c.gabarito.parecer, 'REPROVADO', c.id); }
  for (const c of por('reg_caixa_baixo')) { assert.ok(c.gabarito.regua.difCaixa > 0 && c.gabarito.regua.difCaixa < 10, c.id); assert.equal(c.gabarito.parecer, 'REPROVADO', `${c.id}: caixa não tem tolerância`); }
  for (const c of por('reg_caixa_sem_causa')) { assert.equal(c.gabarito.parecer, 'REPROVADO', c.id); assert.equal(c.gabarito.achados[0].ladoCorreto, 'indeterminado', c.id); }
  for (const id of ['reg_cota_dentro', 'reg_cota_acima', 'reg_provisao_dentro', 'reg_provisao_acima', 'reg_caixa_baixo', 'reg_caixa_sem_causa']) assert.ok(por(id).length >= 3, `${id} com poucos casos`);
});

test('régua: os documentos e o regua.json citam os mesmos números do código', () => {
  const doc = (f: string): string => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
  for (const f of ['prompt-agente.md', 'metodologia-analista.md', 'regua-materialidade.md']) {
    const txt = doc(f);
    assert.ok(txt.includes(String(REGUA.cotasMinimas)), `${f}: não cita ${REGUA.cotasMinimas} cotas`);
    assert.ok(new RegExp(`R\\$ ?${REGUA.provisaoMaxReais}\\b`).test(txt), `${f}: não cita R$ ${REGUA.provisaoMaxReais}`);
    assert.ok(/provisória|provisório/i.test(txt), `${f}: não deixa claro que a régua é provisória`);
  }
  const json = JSON.parse(doc('regua.json'));
  assert.deepEqual(json, JSON.parse(JSON.stringify(REGUA_JSON)));
});
