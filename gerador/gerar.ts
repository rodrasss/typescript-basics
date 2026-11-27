// Orquestrador: planeja e constrói os casos (cada caso = um fundo-persona num dia de validação),
// confere o gabarito contra os números e grava os arquivos.
//
// Uso:  npx tsx gerador/gerar.ts [--n 200] [--seed 2026] [--out casos]

import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { criarRng, escolher, chance, embaralhar, inteiro, ehDiaUtil, somaDias, somaDiasUteis, fmtData, diasUteisDecorridosNoMes, diaDaSemana, iso } from './util.ts';
import type { Rng } from './util.ts';
import { PERFIS } from './catalogo.ts';
import type { TipoFundo } from './catalogo.ts';
import { montarContexto } from './caso.ts';
import { gravidadeEfetiva } from './caso.ts';
import type { Ctx, Fundo, Regulamento, Mercado, Comunicacao, Achado, Gravidade } from './caso.ts';
import { calcular, clonar } from './modelo.ts';
import type { Posicao, Resultado, Dimensao, LadoId } from './modelo.ts';
import { CENARIOS } from './cenarios.ts';
import { CENARIOS_CC, DATAS_COME_COTAS } from './cenarios-come-cotas.ts';
import type { Cenario } from './cenarios.ts';
import { compor } from './historia.ts';
import { renderEntrada, renderGabarito, renderCompleto } from './render.ts';

// ------------------------------------------------------------------ tipos de saída
export type Parecer = 'APROVADO' | 'REPROVADO' | 'PENDENTE';
export type Dificuldade = 'facil' | 'media' | 'dificil';
export type CertoPorDimensao = LadoId | 'ambos' | 'nenhum';

export interface LadoSaida { posicao: Posicao; resultado: Resultado; }
export interface Gabarito {
  cenarios: string[];
  parecer: Parecer;
  ressalva: boolean;
  resumo: string;
  dificuldade: Dificuldade;
  achados: Achado[];
  valoresCorretos: LadoSaida['resultado'] | null;
  corretoPorDimensao: Record<Dimensao, CertoPorDimensao>;
  diferencas: Diferencas;
  armadilhas: string[];
}
export interface Diferencas { cota: number; qtdFinal: number; plFinal: number; plBase: number; caixa: number; provisoes: number; }
export interface Caso {
  id: string;
  seed: number;
  fundo: Fundo;
  data: string;
  dAnterior: string;
  diaSemana: string;
  anterior: { pl: number; cota: number; qtdCotas: number };
  regulamento: Regulamento;
  mercado: Mercado;
  comunicacoes: Comunicacao[];
  memoriaDisponivel: boolean;
  lados: { Alfa: LadoSaida; Beta: LadoSaida };
  gabarito: Gabarito;
}

// ------------------------------------------------------------------ regras de composição
const porId = (id: string): Cenario => (CENARIOS.find((c) => c.id === id) ?? CENARIOS_CC.find((c) => c.id === id))!;

const TAGS: Record<string, string[]> = {
  cc_nao_aplicado: ['cc', 'passivo'], cc_calendario_ultimo_dia: ['cc', 'passivo'], cc_isento_tributado: ['cc', 'passivo'], cc_aliquota_errada: ['cc', 'passivo'],
  cc_cota_referencia_errada: ['cc', 'passivo'], cc_duplicado: ['cc', 'passivo'], cc_cota_conversao_d1: ['cc', 'passivo'], cc_prejuizo_devolvido: ['cc', 'passivo'],
  cc_cotista_isento_tributado: ['cc', 'passivo'], cc_correto: ['cc', 'passivo'],
  pagamento_taxa_nao_registrado: ['pg', 'taxa'],
  provisao_nao_baixada_apos_pagamento: ['pg', 'taxa'],
  taxa_reduzida_nao_aplicada: ['red', 'taxa'],
  ambos_com_taxa_antiga: ['red', 'taxa'],
  minimo_mensal_ignorado: ['taxa'],
  taxa_sobre_pl_do_dia: ['taxa'],
  taxa_por_dias_corridos: ['taxa'],
  taxa_gestao_sem_apropriacao: ['taxa'],
  taxa_escalonada_ignorada: ['taxa'],
  metodo_exponencial_vs_linear: ['taxa'],
  performance_sem_reversao: ['perf'],
  performance_data_base_errada: ['perf'],
  performance_sem_linha_dagua: ['perf'],
  ajuste_futuros_errado: ['fut'],
  ajuste_liquidado_nao_baixado: ['fut'],
  margem_lancada_como_despesa: ['fut'],
  resgate_liquidado_nao_baixado: ['passivo', 'resg'],
  resgate_pago_com_cota_errada: ['passivo', 'resg'],
  aplicacao_nao_convertida: ['passivo'],
  aplicacao_apos_corte_convertida: ['passivo'],
  integralizacao_nao_convertida: ['passivo'],
  resgate_cotizado_antecipadamente: ['passivo'],
  come_cotas_nao_aplicado: ['passivo', 'cc'],
  auditoria_contrato_novo: ['audit'],
  erros_que_se_compensam: ['audit'],
  dividendo_ex_nao_provisionado: ['div'],
  dividendo_recebido_nao_baixado: ['div'],
  ativo_vencido_nao_baixado: ['cdb'],
  compromissada_como_caixa: ['compr'],
  boleta_tardia_nao_processada: ['lft'],
};
const SO_PRIMARIO = new Set([
  'tudo_bate', 'tudo_bate_com_ruido', 'cc_correto', 'arredondamento_vs_truncamento', 'erros_que_se_compensam', 'ambos_com_taxa_antiga',
  'performance_sem_reversao', 'performance_data_base_errada', 'performance_sem_linha_dagua', 'ativo_iliquido_sem_referencia',
]);
const LIMPOS = new Set(['tudo_bate', 'tudo_bate_com_ruido', 'cc_correto']);
// classe de gravidade do cenário primário: 0 = só ressalva, 1 = pendência, 2 = erro (reprova)
const CLASSE_RESSALVA = new Set(['resgate_liquidado_nao_baixado', 'dividendo_recebido_nao_baixado', 'ajuste_liquidado_nao_baixado', 'compromissada_como_caixa', 'pagamento_taxa_nao_registrado', 'liquidacao_compra_antecipada']);
const CLASSE_PENDENCIA = new Set(['ativo_iliquido_sem_referencia', 'tarifa_bancaria_indevida', 'debito_em_duplicidade', 'credito_nao_identificado']);
const classe = (id: string): number => (CLASSE_RESSALVA.has(id) ? 0 : CLASSE_PENDENCIA.has(id) ? 1 : 2);
const FOLGA_VARIACAO: Record<string, number> = {
  laudo_fip_nao_atualizado: 0.1, amortizacao_nao_registrada: 0.05, rendimento_nao_provisionado: 0.03, come_cotas_nao_aplicado: 0.04,
  desdobramento_nao_refletido: 0.0, pdd_aging_desatualizado: 0.01,
};

const ARMADILHAS: Record<string, string> = {
  cc_correto: 'Dia de come-cotas não é sinônimo de erro: conferir data, alíquota e cada posição, e aprovar quando tudo confere.',
  cc_nao_aplicado: 'Cota igual, quantidade de cotas diferente: em dia de come-cotas, olhar a quantidade final e a tabela por cotista.',
  cc_calendario_ultimo_dia: 'O sintoma é o mesmo de "não processado", mas a causa é o calendário: o regulamento manda o penúltimo dia útil, não o último.',
  cc_isento_tributado: 'Hoje é dia de come-cotas para outros fundos, mas este não está sujeito a ele: ler o regulamento antes de procurar divergência de cálculo.',
  cc_aliquota_errada: 'A alíquota depende do prazo médio da carteira em D; perto de 365 dias, conferir de que lado do limite o fundo está.',
  cc_cota_referencia_errada: 'Posição com aplicação depois do último come-cotas usa a cota da aplicação como referência, não a do último come-cotas.',
  cc_duplicado: 'Todas as posições tributadas com o dobro do valor: reprocessamento, não erro de alíquota.',
  cc_cota_conversao_d1: 'IR igual e cotas retiradas diferentes: a diferença está na cota usada para converter o IR em cotas.',
  cc_prejuizo_devolvido: 'Posição com cota abaixo da referência não gera retenção nem devolução de cotas.',
  cc_cotista_isento_tributado: 'A divergência total de IR vem de uma única posição: conferir o tratamento tributário de cada cotista.',
  tudo_bate: 'Não inventar problema: quando tudo bate e as apropriações conferem com o regulamento, a resposta certa é aprovar.',
  tudo_bate_com_ruido: 'Comunicações alarmantes nem sempre afetam a data-base: separar o que tem efeito em D do que é evento futuro, ativo que o fundo não tem ou lembrete.',
  erros_que_se_compensam: 'Cota igual não prova que está certa: dois erros podem se anular hoje. Conferir componente por componente.',
  ambos_com_taxa_antiga: 'Alfa e Beta iguais não significa corretos: as provisões também são conferidas contra o regulamento.',
  curva_vs_mercado_exclusivo: 'O lado que usou o preço de mercado parece o "certo"; o regulamento deste fundo manda marcar na curva.',
  preco_credito_fonte_errada: 'Descobrir qual lado está certo comparando com a referência de D, não com o D−1 nem com a curva de emissão.',
  ativo_iliquido_sem_referencia: 'Quando não há referência confiável, não escolher um lado: escalar para o comitê de precificação.',
  despesa_nao_prevista: 'Pedido da gestora não muda o regulamento; despesa só é encargo se prevista (e, se exigido, aprovada e documentada).',
  taxa_reduzida_nao_aplicada: 'A mudança vale a partir de D (inclusive): o saldo anterior ainda bate, só a apropriação do dia diverge.',
  aplicacao_nao_convertida: 'Cota igual não basta: conferir a quantidade final de cotas e o passivo.',
  aplicacao_apos_corte_convertida: 'Horário de corte: o horário do crédito decide a data de conversão.',
  arredondamento_vs_truncamento: 'Diferença de 1 na 8ª casa: tudo o mais bate; regulamento manda truncar.',
  tarifa_bancaria_indevida: 'Nenhum lado está certo: o dinheiro saiu, mas a despesa não é do fundo.',
  debito_em_duplicidade: 'O dinheiro saiu duas vezes: registrar o fato e cobrar estorno, sem jogar a duplicidade no resultado.',
  credito_nao_identificado: 'Sem identificação do remetente não se converte em cotas nem se reconhece como receita.',
  resgate_pago_com_cota_errada: 'Recalcular o valor do resgate: cotas × cota de cotização.',
  nav_estimado_feriado_eua: 'NAV estimado/indicativo não é aceito; usar o último NAV oficial.',
  performance_sem_linha_dagua: 'A linha d’água segue a última cobrança efetiva, não o fim do período.',
  taxa_cvm_faixa_errada: 'A faixa da taxa CVM segue o PL de referência do trimestre, não o PL de hoje.',
};

// ------------------------------------------------------------------ calendário de datas-base
const POOL_DATAS: string[] = (() => {
  const r: string[] = [];
  let d = '2026-01-05';
  while (d <= '2026-11-25') {
    if (ehDiaUtil(d)) r.push(d);
    d = somaDias(d, 1);
  }
  return r;
})();
const duDec = (d: string): number => diasUteisDecorridosNoMes(d);

function dataCompativel(cen: Cenario, d: string): boolean {
  if (cen.datas && !cen.datas.includes(d)) return false;
  if (cen.diaPagamento && !(duDec(d) >= 2 && duDec(d) <= 5)) return false;
  return true;
}
function tipoCompativel(cen: Cenario, t: TipoFundo): boolean {
  return !cen.tipos || cen.tipos.includes(t);
}
const conflita = (a: string, b: string): boolean => {
  const ta = TAGS[a] ?? [];
  const tb = TAGS[b] ?? [];
  return a === b || ta.some((x) => tb.includes(x));
};

// ------------------------------------------------------------------ plano
export interface Plano { n: number; id: string; tipo: TipoFundo; data: string; primario: string; seed: number; }

const TODOS_TIPOS = Object.keys(PERFIS) as TipoFundo[];

export function planejar(total: number, seed: number): Plano[] {
  const rng = criarRng(seed);
  const nLimpos = Math.round(total * 0.2);
  const nDiv = total - nLimpos;
  const divergentes = CENARIOS.filter((c) => !LIMPOS.has(c.id));
  const lista: string[] = [];
  for (let i = 0; i < nLimpos; i++) lista.push(i % 2 === 0 ? 'tudo_bate' : 'tudo_bate_com_ruido');
  // cenários "leves" (ressalva/pendência) aparecem mais, para o treino não ensinar a reprovar por reflexo
  const leves = divergentes.filter((c) => classe(c.id) < 2);
  const erros = divergentes.filter((c) => classe(c.id) === 2);
  for (const c of [...leves, ...erros]) for (let i = 0; i < 3; i++) lista.push(c.id);
  const extras = embaralhar(rng, leves); // as sobras reforçam os casos leves
  for (let i = 0; lista.length < nLimpos + nDiv; i++) lista.push(extras[i % extras.length].id);
  const ordem = embaralhar(rng, lista);

  const usoTipo = new Map<TipoFundo, number>(TODOS_TIPOS.map((t) => [t, 0]));
  const planos: Plano[] = [];
  ordem.forEach((cid, i) => {
    const cen = porId(cid);
    const candidatos = TODOS_TIPOS.filter((t) => tipoCompativel(cen, t));
    const minimo = Math.min(...candidatos.map((t) => usoTipo.get(t)!));
    const tipo = escolher(rng, candidatos.filter((t) => usoTipo.get(t)! === minimo));
    usoTipo.set(tipo, usoTipo.get(tipo)! + 1);
    const datas = POOL_DATAS.filter((d) => dataCompativel(cen, d));
    const datasEspeciais = cen.datas ?? [];
    const data = datasEspeciais.length ? escolher(rng, datasEspeciais) : escolher(rng, datas);
    planos.push({ n: i + 1, id: `caso-${String(i + 1).padStart(3, '0')}`, tipo, data, primario: cid, seed: seed * 1000 + i * 7919 });
  });
  return planos;
}

export function planejarSessaoComeCotas(total: number, seed: number): Plano[] {
  const rng = criarRng(seed + 7);
  const nCorretos = Math.max(2, Math.round(total * 0.18));
  const erros = CENARIOS_CC.filter((c) => c.id !== 'cc_correto');
  const lista: string[] = Array.from({ length: nCorretos }, () => 'cc_correto');
  for (let i = 0; lista.length < total; i++) lista.push(erros[i % erros.length].id);
  const ordem = embaralhar(rng, lista);
  const usoTipo = new Map<TipoFundo, number>(TODOS_TIPOS.map((t) => [t, 0]));
  const usoData = new Map<string, number>(DATAS_COME_COTAS.map((d) => [d, 0]));
  return ordem.map((cid, i) => {
    const cen = porId(cid);
    const candidatos = TODOS_TIPOS.filter((t) => tipoCompativel(cen, t));
    const minT = Math.min(...candidatos.map((t) => usoTipo.get(t)!));
    const tipo = escolher(rng, candidatos.filter((t) => usoTipo.get(t)! === minT));
    usoTipo.set(tipo, usoTipo.get(tipo)! + 1);
    const minD = Math.min(...DATAS_COME_COTAS.map((d) => usoData.get(d)!));
    const data = escolher(rng, DATAS_COME_COTAS.filter((d) => usoData.get(d)! === minD));
    usoData.set(data, usoData.get(data)! + 1);
    return { n: i + 1, id: `cc-${String(i + 1).padStart(3, '0')}`, tipo, data, primario: cid, seed: seed * 1000 + i * 7919 + 555 };
  });
}

// ------------------------------------------------------------------ ruído de comunicações (sem efeito na data-base)
function adicionarRuido(c: Ctx, rng: Rng): void {
  const hh = (a: number, b: number): string => `${String(inteiro(rng, a, b)).padStart(2, '0')}:${String(inteiro(rng, 0, 59)).padStart(2, '0')}`;
  const opcoes: Comunicacao[] = [
    { hora: hh(8, 10), de: 'Gestora — operacional', assunto: 'Previsão de resgates', texto: 'Para a semana que vem, esperamos resgates um pouco acima da média por causa de rebalanceamento de um FoF. Só aviso.' },
    { hora: hh(15, 17), de: 'Distribuidor', assunto: 'Material de divulgação', texto: 'Enviamos a nova lâmina do fundo para validação de compliance. Sem pressa.' },
    { hora: hh(9, 12), de: 'Área de risco', assunto: 'Relatório mensal', texto: 'O relatório mensal de risco do fundo já está disponível na pasta compartilhada.' },
    { hora: hh(14, 18), de: 'Custodiante — eventos', assunto: 'Agenda da semana', texto: 'Agenda de eventos corporativos da semana (nenhum dos papéis desta carteira está na lista de hoje).' },
    { hora: hh(10, 13), de: 'Gestora — mesa', assunto: 'Operação para o próximo pregão', texto: `No próximo dia útil (${fmtData(somaDiasUteis(c.data, 1))}) vamos reduzir um pouco a posição mais líquida da carteira. Até agora hoje não há boleta.` },
  ];
  const k = inteiro(rng, 1, 2);
  // fundo fechado não tem resgate: nada de aviso de resgates
  const validas = opcoes.filter((o) => c.fundo.condominio === 'aberto' || o.assunto !== 'Previsão de resgates');
  for (const o of embaralhar(rng, validas).slice(0, k)) c.comunicacoes.push(o);
}

// ------------------------------------------------------------------ construção de um caso
const GRAVIDADE_ORDEM: Record<Gravidade, number> = { informativo: 0, ressalva: 1, pendencia: 2, erro: 3 };

function resultadoSemEfeitoColateral(p: Posicao, c: Ctx): { pos: Posicao; res: Resultado } {
  const pos = clonar(p);
  const res = calcular(pos, c.calc);
  return { pos, res };
}

function iguais(a: number, b: number, tol = 0.005): boolean {
  return Math.abs(a - b) <= tol;
}

function derivarCorreto(base: LadoSaida, alfa: LadoSaida, beta: LadoSaida): Record<Dimensao, CertoPorDimensao> {
  const cmp = {
    cota: (l: LadoSaida) => l.resultado.cota === base.resultado.cota && l.resultado.qtdFinal === base.resultado.qtdFinal && iguais(l.resultado.plFinal, base.resultado.plFinal, 0.01),
    caixa: (l: LadoSaida) => iguais(l.resultado.caixa, base.resultado.caixa),
    provisoes: (l: LadoSaida) => {
      if (!iguais(l.resultado.totalProvisoes, base.resultado.totalProvisoes)) return false;
      if (l.posicao.provisoes.length !== base.posicao.provisoes.length) return false;
      return base.posicao.provisoes.every((p) => {
        const q = l.posicao.provisoes.find((x) => x.codigo === p.codigo);
        return !!q && iguais(q.saldoAtual, p.saldoAtual);
      });
    },
  };
  const r = {} as Record<Dimensao, CertoPorDimensao>;
  for (const d of ['cota', 'caixa', 'provisoes'] as Dimensao[]) {
    const x = cmp[d](alfa);
    const s = cmp[d](beta);
    r[d] = x && s ? 'ambos' : x ? 'Alfa' : s ? 'Beta' : 'nenhum';
  }
  return r;
}

export class CasoInvalido extends Error {}

function construirTentativa(plano: Plano, tentativa: number, nomesUsados: Set<string>): Caso {
  const seed = plano.seed + tentativa * 104729;
  const rng = criarRng(seed);
  const nomesTemp = new Set(nomesUsados);
  const c = montarContexto(rng, plano.id, plano.tipo, { data: plano.data, nomesUsados: nomesTemp, indice: plano.n - 1 });
  const primario = porId(plano.primario);
  if (primario.precisaPerf && !c.base.perf) throw new CasoInvalido('sem performance configurada');
  if (primario.aplicavel && !primario.aplicavel(c)) throw new CasoInvalido(`cenário ${primario.id} não aplicável`);

  // escolhe os cenários (primário + secundários)
  const escolhidos: Cenario[] = [primario];
  const sessao = plano.id.startsWith('cc-');
  const sec = SO_PRIMARIO.has(primario.id) ? 0 : sessao ? (chance(rng, 0.25) ? 1 : 0) : chance(rng, 0.7) ? (chance(rng, 0.3) ? 2 : 1) : 0;
  const pool = embaralhar(rng, CENARIOS.filter((x) => !SO_PRIMARIO.has(x.id)));
  const preparaveis = [...escolhidos];
  primario.preparar?.(c);
  for (const cand of pool) {
    if (escolhidos.length - 1 >= sec) break;
    if (!tipoCompativel(cand, plano.tipo) || !dataCompativel(cand, plano.data)) continue;
    if (escolhidos.some((e) => conflita(e.id, cand.id))) continue;
    if (classe(primario.id) < 2 && classe(cand.id) > classe(primario.id)) continue; // mantém o caso leve leve
    if (sessao && classe(cand.id) !== 0) continue; // na sessão, só achados que não mexem na cota: a conta do come-cotas fica exata
    if (cand.aplicavel && !cand.aplicavel(c)) continue;
    escolhidos.push(cand);
    preparaveis.push(cand);
    cand.preparar?.(c);
  }
  void preparaveis;

  // cada lado parte da posição correta; os cenários introduzem os erros
  c.alfa = clonar(c.base);
  c.beta = clonar(c.base);
  const achados: Achado[] = [];
  for (const cen of escolhidos) achados.push(...cen.aplicar(c));
  if (escolhidos.length === 1 && chance(rng, 0.35) && !LIMPOS.has(primario.id)) adicionarRuido(c, rng);
  else if (escolhidos.length > 1 && chance(rng, 0.5)) adicionarRuido(c, rng);
  c.comunicacoes.sort((a, b) => a.hora.localeCompare(b.hora));

  // resultados
  const b = resultadoSemEfeitoColateral(c.base, c);
  const x = resultadoSemEfeitoColateral(c.alfa, c);
  const s = resultadoSemEfeitoColateral(c.beta, c);
  const lados = {
    Alfa: { posicao: x.pos, resultado: x.res },
    Beta: { posicao: s.pos, resultado: s.res },
  };
  const baseSaida: LadoSaida = { posicao: b.pos, resultado: b.res };

  // invariantes de plausibilidade
  if (b.res.caixa < 0 || x.res.caixa < 0 || s.res.caixa < 0) throw new CasoInvalido('caixa negativo');
  if (!(b.res.cota > 0) || !(b.res.plBase > 0)) throw new CasoInvalido('PL/cota não positivos');
  const ret = b.res.cota / c.cotaAnterior - 1;
  // cenários que legitimamente movem a cota (novo laudo, amortização, rendimento anunciado, come-cotas) ganham folga
  const folga = Math.max(0, ...escolhidos.map((e) => FOLGA_VARIACAO[e.id] ?? 0));
  const lim = Math.max(Math.abs(c.perfil.retornoDia[0]), Math.abs(c.perfil.retornoDia[1])) * 3 + 0.01 + folga;
  if (Math.abs(ret) > lim) throw new CasoInvalido(`variação diária implausível (${(ret * 100).toFixed(3)}%)`);

  // a cota não pode estar colada numa fronteira de truncamento: um arredondamento de exibição mudaria a 8ª casa
  for (const [pos, res] of [[b.pos, b.res], [x.pos, x.res], [s.pos, s.res]] as const) {
    const f = ((res.plBase / pos.qtdCotasBase) * 1e8) % 1;
    if (f < 0.02 || f > 0.98) throw new CasoInvalido('cota na fronteira do truncamento');
  }

  const corretoPorDimensao = derivarCorreto(baseSaida, lados.Alfa, lados.Beta);
  validarGabarito(achados, corretoPorDimensao, lados, escolhidos.map((e) => e.id));

  // história (depois dos cenários, para as pistas)
  const ids = escolhidos.map((e) => e.id);
  const h = compor(c, ids);
  c.fundo.historia = h.historia;
  c.fundo.pistas = h.pistas;

  const gravidades = achados.map(gravidadeEfetiva);
  const pior = gravidades.length ? gravidades.reduce((a, g) => (GRAVIDADE_ORDEM[g] > GRAVIDADE_ORDEM[a] ? g : a), 'informativo' as Gravidade) : 'informativo';
  const parecer: Parecer = pior === 'erro' ? 'REPROVADO' : pior === 'pendencia' ? 'PENDENTE' : 'APROVADO';
  const ressalva = pior === 'ressalva' || (parecer !== 'APROVADO' && gravidades.some((g) => g === 'ressalva'));
  const indeterminado = achados.some((a) => a.ladoCorreto === 'indeterminado');

  const caso: Caso = {
    id: plano.id,
    seed,
    fundo: c.fundo,
    data: c.data,
    dAnterior: c.dAnterior,
    diaSemana: diaDaSemana(c.data),
    anterior: { pl: c.plAnterior, cota: c.cotaAnterior, qtdCotas: c.qtdAnterior },
    regulamento: c.reg,
    mercado: c.mercado,
    comunicacoes: c.comunicacoes,
    memoriaDisponivel: c.memoriaDisponivel,
    lados,
    gabarito: {
      cenarios: ids,
      parecer,
      ressalva,
      resumo: resumir(parecer, ressalva, achados),
      dificuldade: dificuldade(ids, achados, c),
      achados,
      valoresCorretos: indeterminado ? null : baseSaida.resultado,
      corretoPorDimensao,
      diferencas: diferencas(lados.Alfa.resultado, lados.Beta.resultado),
      armadilhas: ids.map((i) => ARMADILHAS[i]).filter((x): x is string => !!x),
    },
  };
  nomesUsados.add(c.fundo.nome);
  return caso;
}

function diferencas(x: Resultado, s: Resultado): Diferencas {
  const r = (v: number): number => Math.round(v * 100) / 100;
  return {
    cota: Number((s.cota - x.cota).toFixed(8)),
    qtdFinal: Number((s.qtdFinal - x.qtdFinal).toFixed(8)),
    plFinal: r(s.plFinal - x.plFinal),
    plBase: r(s.plBase - x.plBase),
    caixa: r(s.caixa - x.caixa),
    provisoes: r(s.totalProvisoes - x.totalProvisoes),
  };
}

function dificuldade(ids: string[], achados: Achado[], c: Ctx): Dificuldade {
  let pontos = achados.filter((a) => gravidadeEfetiva(a) !== 'informativo').length;
  if (!c.memoriaDisponivel) pontos += 1;
  if (!c.revelarFonte) pontos += 1;
  if (ids.includes('erros_que_se_compensam') || ids.includes('ambos_com_taxa_antiga')) pontos += 2;
  if (achados.some((a) => a.ladoCorreto === 'indeterminado' || a.ladoCorreto === 'nenhum')) pontos += 1;
  if (ids.includes('tudo_bate')) pontos = 0;
  if (ids.includes('tudo_bate_com_ruido')) pontos = 3;
  return pontos <= 1 ? 'facil' : pontos <= 3 ? 'media' : 'dificil';
}

function resumir(parecer: Parecer, ressalva: boolean, achados: Achado[]): string {
  if (!achados.length || achados.every((a) => a.ladoCorreto === 'nenhum' && a.gravidade === 'informativo')) return 'Aprovar: Alfa e Beta batem e as provisões conferem com o regulamento.';
  const t = achados.filter((a) => a.gravidade !== 'informativo').map((a) => a.titulo).join('; ');
  const acao = parecer === 'REPROVADO' ? 'Reprovar até o ajuste' : parecer === 'PENDENTE' ? 'Deixar pendente e escalar' : ressalva ? 'Aprovar com ressalva' : 'Aprovar';
  return `${acao}: ${t}.`;
}

// Confere o gabarito contra os números (oráculo). Lança CasoInvalido se o "lado correto" não bater com a posição correta.
function validarGabarito(achados: Achado[], certo: Record<Dimensao, CertoPorDimensao>, lados: Caso['lados'], ids: string[]): void {
  const clean = ids.every((i) => LIMPOS.has(i));
  if (clean) {
    if (certo.cota !== 'ambos' || certo.caixa !== 'ambos' || certo.provisoes !== 'ambos') throw new CasoInvalido('caso limpo com divergência');
    if (lados.Alfa.resultado.cota !== lados.Beta.resultado.cota) throw new CasoInvalido('caso limpo com cotas diferentes');
    return;
  }
  const porDim = new Map<Dimensao, Achado[]>();
  for (const a of achados) for (const d of a.dimensoes) porDim.set(d, [...(porDim.get(d) ?? []), a]);
  for (const a of achados) {
    if (a.ladoCorreto !== 'Alfa' && a.ladoCorreto !== 'Beta') continue;
    for (const d of a.dimensoes) {
      const outros = (porDim.get(d) ?? []).filter((o) => o !== a);
      const sozinho = outros.length === 0;
      if (sozinho && certo[d] !== a.ladoCorreto) {
        throw new CasoInvalido(`gabarito inconsistente (${a.cenario}): ${a.ladoCorreto} deveria estar correto em ${d}, mas derivado = ${certo[d]}`);
      }
    }
  }
  // todo caso divergente precisa ter alguma diferença observável (exceto os que "ambos errados")
  const algumaDif = certo.cota !== 'ambos' || certo.caixa !== 'ambos' || certo.provisoes !== 'ambos';
  const visivel = lados.Alfa.resultado.cota !== lados.Beta.resultado.cota || lados.Alfa.resultado.caixa !== lados.Beta.resultado.caixa
    || lados.Alfa.resultado.totalProvisoes !== lados.Beta.resultado.totalProvisoes || lados.Alfa.resultado.qtdFinal !== lados.Beta.resultado.qtdFinal
    || JSON.stringify(lados.Alfa.posicao.provisoes.map((p) => p.saldoAtual)) !== JSON.stringify(lados.Beta.posicao.provisoes.map((p) => p.saldoAtual));
  const semDiferencaEsperada = ids.includes('ambos_com_taxa_antiga');
  if (!semDiferencaEsperada && !visivel) throw new CasoInvalido('cenário divergente sem diferença observável entre Alfa e Beta');
  if (semDiferencaEsperada && visivel) throw new CasoInvalido('cenário "ambos errados" mostra diferença entre os lados');
  void algumaDif;
}

export function construirCaso(plano: Plano, nomesUsados: Set<string>, tentativasPorTipo = 25): Caso {
  // tenta o tipo planejado; se o cenário não for viável nele, rotaciona para outros tipos compatíveis
  const cen = porId(plano.primario);
  const tipos = [plano.tipo, ...TODOS_TIPOS.filter((t) => t !== plano.tipo && tipoCompativel(cen, t))];
  let ultimo = '';
  for (const tipo of tipos) {
    const p = { ...plano, tipo };
    for (let t = 0; t < tentativasPorTipo; t++) {
      try {
        return construirTentativa(p, t, nomesUsados);
      } catch (e) {
        if (e instanceof CasoInvalido) { ultimo = e.message; continue; }
        throw new Error(`${plano.id} (${plano.primario}, ${tipo}, ${plano.data}) tentativa ${t}: ${(e as Error).stack}`);
      }
    }
  }
  throw new Error(`${plano.id} (${plano.primario}, ${plano.data}): sem solução em nenhum tipo. Último motivo: ${ultimo}`);
}

export function gerarTodos(total = 200, seed = 2026): Caso[] {
  const planos = planejar(total, seed);
  const nomes = new Set<string>();
  return planos.map((p) => construirCaso(p, nomes));
}

export function gerarSessaoComeCotas(total = 33, seed = 2026): Caso[] {
  const planos = planejarSessaoComeCotas(total, seed);
  const nomes = new Set<string>();
  return planos.map((p) => construirCaso(p, nomes));
}

// ------------------------------------------------------------------ saída em disco
function slug(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function gravar(casos: Caso[], out: string): void {
  if (existsSync(out)) rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  const linhas: string[] = [];
  for (const c of casos) {
    writeFileSync(join(out, `${c.id}.json`), JSON.stringify(c, null, 2) + '\n');
    writeFileSync(join(out, `${c.id}.md`), renderCompleto(c));
    linhas.push(JSON.stringify({
      id: c.id, tipo: c.fundo.tipo, dificuldade: c.gabarito.dificuldade, cenarios: c.gabarito.cenarios,
      entrada: renderEntrada(c), gabarito: renderGabarito(c), parecer: c.gabarito.parecer,
    }));
  }
  writeFileSync(join(out, '..', 'dataset.jsonl'), linhas.join('\n') + '\n');
}

export function indiceMarkdown(casos: Caso[]): string {
  const L: string[] = [];
  L.push('# Índice dos casos', '', `Total: ${casos.length} casos. Todos os dados são fictícios.`, '');
  L.push('| Caso | Fundo | Tipo | Data-base | Cenário(s) | Parecer | Dificuldade |', '|---|---|---|---|---|---|---|');
  for (const c of casos) {
    L.push(`| [${c.id}](casos/${c.id}.md) | ${c.fundo.nome} | ${c.fundo.tipo} | ${c.data} | ${c.gabarito.cenarios.join(', ')} | ${c.gabarito.parecer}${c.gabarito.ressalva ? ' (c/ ressalva)' : ''} | ${c.gabarito.dificuldade} |`);
  }
  return L.join('\n') + '\n';
}

export function cobertura(casos: Caso[]): string {
  const cont = <K extends string>(f: (c: Caso) => K[]): Map<K, number> => {
    const m = new Map<K, number>();
    for (const c of casos) for (const k of f(c)) m.set(k, (m.get(k) ?? 0) + 1);
    return m;
  };
  const tabela = (titulo: string, m: Map<string, number>): string[] => [
    `## ${titulo}`, '', '| Item | Casos |', '|---|---|',
    ...[...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([k, v]) => `| ${k} | ${v} |`), '',
  ];
  const L: string[] = ['# Cobertura dos casos', ''];
  L.push(...tabela('Parecer', cont((c) => [c.gabarito.parecer])));
  L.push(...tabela('Dificuldade', cont((c) => [c.gabarito.dificuldade])));
  L.push(...tabela('Tipo de fundo', cont((c) => [c.fundo.tipo])));
  L.push(...tabela('Cenários (incluindo os secundários)', cont((c) => c.gabarito.cenarios)));
  L.push(...tabela('Dimensão com divergência', cont((c) => (['cota', 'caixa', 'provisoes'] as const).filter((d) => c.gabarito.corretoPorDimensao[d] !== 'ambos').map((d) => `${d}: correto = ${c.gabarito.corretoPorDimensao[d]}`))));
  L.push(...tabela('Número de achados por caso', cont((c) => [String(c.gabarito.achados.length)])));
  return L.join('\n') + '\n';
}

function arg(nome: string, padrao: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : padrao;
}

function resumo(casos: Caso[], titulo: string, out: string): void {
  console.log(`${titulo}: ${casos.length} casos gravados em ${out}`);
  const ap = casos.filter((c) => c.gabarito.parecer === 'APROVADO').length;
  console.log(`  APROVADO ${ap} · REPROVADO ${casos.filter((c) => c.gabarito.parecer === 'REPROVADO').length} · PENDENTE ${casos.filter((c) => c.gabarito.parecer === 'PENDENTE').length}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const seed = Number(arg('seed', '2026'));
  const so = arg('so', 'tudo'); // tudo | geral | come-cotas
  if (so === 'tudo' || so === 'geral') {
    const out = resolve(arg('out', 'casos'));
    const casos = gerarTodos(Number(arg('n', '200')), seed);
    gravar(casos, out);
    writeFileSync(join(out, '..', 'INDICE.md'), indiceMarkdown(casos));
    writeFileSync(join(out, '..', 'COBERTURA.md'), cobertura(casos));
    resumo(casos, 'Geral', out);
  }
  if (so === 'tudo' || so === 'come-cotas') {
    const outCC = resolve(arg('out-cc', 'sessoes/come-cotas/casos'));
    const cc = gerarSessaoComeCotas(Number(arg('n-cc', '33')), seed);
    gravar(cc, outCC);
    writeFileSync(join(outCC, '..', 'INDICE.md'), indiceMarkdown(cc));
    writeFileSync(join(outCC, '..', 'COBERTURA.md'), cobertura(cc));
    resumo(cc, 'Sessão come-cotas', outCC);
  }
}
void iso;
