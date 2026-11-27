// Modelo contábil simplificado de um fundo no dia D e cálculo da cota.
// PL (base da cota) = ativos + caixa + valores a receber − valores a pagar − provisões
// Cota = PL / quantidade de cotas antes das movimentações do dia (cota de fechamento),
// truncada (ou arredondada, se o lado estiver parametrizado assim) na 8ª casa.

import type { Rng } from './util.ts';
import {
  r2, truncar8, arredondar8, entre, inteiro, escolher, chance, amostra,
  diasCorridos, diaUtilAnterior, diasUteisNoMes, diasUteisDecorridosNoMes, fmtR, fmtPct, fmtN, fmtData,
  somaDias, somaDiasUteis,
} from './util.ts';
import type { TipoFundo, PerfilTipo } from './catalogo.ts';

export type LadoId = 'Alfa' | 'Beta';
export type Dimensao = 'cota' | 'caixa' | 'provisoes';

export interface Ativo {
  codigo: string;
  descricao: string;
  classe: string;
  quantidade: number;
  preco: number;
  valor: number;
  fonte: string;
  moeda?: 'USD';
  precoOrigem?: number;
  cambio?: number;
}

export interface Item { codigo: string; descricao: string; valor: number; }
export interface Lancamento { historico: string; valor: number; }

export type MetodoTaxa = 'linear_252' | 'exponencial_252' | 'corridos_365';
export interface ParamTaxa {
  pct: number;
  metodo: MetodoTaxa;
  minimoMensal?: number;
  faixas?: { ate: number | null; pct: number }[];
  baseD0?: boolean; // erro: usar o PL do próprio dia em vez do PL do dia útil anterior
}

export type RegraProv =
  | { tipo: 'pct'; param: ParamTaxa }
  | { tipo: 'fixo'; valorPeriodo: number; periodo: 'anual' | 'trimestral' | 'mensal'; diasPeriodo: number }
  | { tipo: 'performance' }
  | { tipo: 'manual' };

export interface Provisao {
  codigo: string;
  descricao: string;
  saldoAnterior: number;
  apropriacao: number;
  pagamento: number;
  saldoAtual: number;
  memoria: string;
  regra: RegraProv;
}

export interface ParamPerformance {
  pct: number;
  cotaBase: number; // cota de referência (última cobrança efetiva ou início)
  dataBase: string;
  fatorBenchmark: number; // fator acumulado do benchmark desde dataBase até D
  benchmark: string;
  congelada?: boolean; // erro: não recalculou (sem reversão)
}

export interface MovPassivo {
  id: string;
  tipo: 'aplicacao' | 'resgate' | 'integralizacao';
  cotista: string;
  valor?: number; // aplicações / integralizações
  cotas?: number; // resgates
  recebidoAs?: string;
  solicitadoEm: string;
  cotizacao: string;
  liquidacao: string;
  converterHoje: boolean; // esta posição converte/cotiza hoje?
  observacao?: string;
}

/** Posição de um cotista sujeita ao come-cotas. A quantidade é derivada: `peso` × cotas existentes ao fim do dia. */
export interface PosicaoCotista {
  id: string;
  cotista: string;
  tratamento: 'tributado' | 'isento';
  peso: number; // fração das cotas existentes ao fim do dia (a soma dos pesos é 1)
  cotaReferencia: number; // cota do último come-cotas ou da aplicação, a mais recente
  dataReferencia: string;
  origemReferencia: 'último come-cotas' | 'aplicação';
}
export interface ComeCotas {
  aliquota: number;
  posicoes: PosicaoCotista[];
  aplicar: boolean;
  vezes: number; // 1 = normal; 2 = processado em duplicidade
  cotaConversao: 'D' | 'D-1'; // cota usada para converter o IR em cotas
  cotaD1: number; // cota de D−1 (usada só quando cotaConversao = 'D-1')
  tributaIsentos: boolean; // erro: retém também dos cotistas isentos
  devolvePrejuizo: boolean; // erro: devolve cotas quando a cota está abaixo da referência
}
export interface DetalheComeCotas { id: string; qtdCotas: number; ganho: number; ir: number; cotasRetiradas: number; }

export interface Posicao {
  ativos: Ativo[];
  caixa: { saldoInicial: number; lancamentos: Lancamento[]; saldoFinal: number };
  aReceber: Item[];
  aPagar: Item[];
  provisoes: Provisao[];
  qtdCotasBase: number;
  arredondamento: 'truncamento' | 'arredondamento';
  movs: MovPassivo[];
  perf?: ParamPerformance;
  comeCotas?: ComeCotas;
}

export interface Resultado {
  totalAtivos: number;
  caixa: number;
  totalReceber: number;
  totalPagar: number;
  totalProvisoes: number;
  plAntesApropriacoes: number;
  plBase: number;
  cotaBrutaPerf?: number;
  cota: number;
  aplicacoesConvertidas: number;
  cotasEmitidas: number;
  cotasResgatadas: number;
  valorResgates: number;
  irComeCotas: number;
  cotasComeCotas: number;
  detalheComeCotas: DetalheComeCotas[];
  qtdFinal: number;
  plFinal: number;
}

export interface CtxCalculo { data: string; plAnterior: number; diasCorridosDesdeAnterior: number; duMes: number; }

const soma = (xs: number[]): number => r2(xs.reduce((a, b) => a + b, 0));

export function taxaDiaria(param: ParamTaxa, plBase: number, ctx: CtxCalculo): { valor: number; memoria: string } {
  let base = 0;
  let descr = '';
  if (param.faixas && param.faixas.length) {
    let restante = plBase;
    let anterior = 0;
    const partes: string[] = [];
    for (const f of param.faixas) {
      const limite = f.ate === null ? Infinity : f.ate;
      const fatia = Math.max(0, Math.min(restante, limite - anterior));
      base += fatia * f.pct;
      if (fatia > 0) partes.push(`${fmtPct(f.pct)} sobre ${fmtR(fatia)}`);
      restante -= fatia;
      anterior = limite;
      if (restante <= 0) break;
    }
    descr = `escalonada (${partes.join(' + ')})`;
  } else {
    base = plBase * param.pct;
    descr = `${fmtPct(param.pct)} a.a. sobre ${fmtR(plBase)}`;
  }
  const pctEf = base / plBase;
  let valor: number;
  let metodo: string;
  if (param.metodo === 'linear_252') {
    valor = base / 252;
    metodo = '÷ 252 (linear, dias úteis)';
  } else if (param.metodo === 'exponencial_252') {
    valor = plBase * (Math.pow(1 + pctEf, 1 / 252) - 1);
    metodo = 'fator exponencial (1+taxa)^(1/252) − 1';
  } else {
    valor = (base / 365) * ctx.diasCorridosDesdeAnterior;
    metodo = `÷ 365 × ${ctx.diasCorridosDesdeAnterior} dia(s) corrido(s)`;
  }
  valor = r2(valor);
  let memoria = `${descr} ${metodo} = ${fmtR(valor)}`;
  if (param.minimoMensal) {
    const minDia = r2(param.minimoMensal / ctx.duMes);
    if (minDia > valor) {
      memoria += `; mínimo mensal ${fmtR(param.minimoMensal)} ÷ ${ctx.duMes} d.u. = ${fmtR(minDia)} (prevalece o mínimo)`;
      valor = minDia;
    } else {
      memoria += `; mínimo mensal ${fmtR(param.minimoMensal)} ÷ ${ctx.duMes} d.u. = ${fmtR(minDia)} (não se aplica)`;
    }
  }
  return { valor, memoria };
}

export function calcular(p: Posicao, ctx: CtxCalculo): Resultado {
  const totalAtivos = soma(p.ativos.map((a) => a.valor));
  p.caixa.saldoFinal = r2(p.caixa.saldoInicial + soma(p.caixa.lancamentos.map((l) => l.valor)));
  const totalReceber = soma(p.aReceber.map((i) => i.valor));
  const totalPagar = soma(p.aPagar.map((i) => i.valor));

  // PL antes das apropriações do dia (usado quando a taxa é calculada, por erro, sobre o PL do dia)
  const plSemApropriacao = r2(
    totalAtivos + p.caixa.saldoFinal + totalReceber - totalPagar -
      soma(p.provisoes.filter((x) => x.regra.tipo !== 'performance').map((x) => x.saldoAnterior - x.pagamento)),
  );

  for (const pr of p.provisoes) {
    const r = pr.regra;
    if (r.tipo === 'pct') {
      const base = r.param.baseD0 ? plSemApropriacao : ctx.plAnterior;
      const t = taxaDiaria(r.param, base, ctx);
      pr.apropriacao = t.valor;
      pr.memoria = (r.param.baseD0 ? '[base: PL do próprio dia] ' : '[base: PL do dia útil anterior] ') + t.memoria;
    } else if (r.tipo === 'fixo') {
      pr.apropriacao = r2(r.valorPeriodo / r.diasPeriodo);
      pr.memoria = `${fmtR(r.valorPeriodo)} (${r.periodo}) ÷ ${r.diasPeriodo} d.u. = ${fmtR(pr.apropriacao)}`;
    }
    if (r.tipo !== 'performance') pr.saldoAtual = r2(pr.saldoAnterior + pr.apropriacao - pr.pagamento);
  }
  const totalProvSemPerf = soma(p.provisoes.filter((x) => x.regra.tipo !== 'performance').map((x) => x.saldoAtual));
  const plAntesPerf = r2(totalAtivos + p.caixa.saldoFinal + totalReceber - totalPagar - totalProvSemPerf);

  let cotaBrutaPerf: number | undefined;
  const perfProv = p.provisoes.find((x) => x.regra.tipo === 'performance');
  if (perfProv && p.perf) {
    cotaBrutaPerf = plAntesPerf / p.qtdCotasBase;
    const ref = p.perf.cotaBase * p.perf.fatorBenchmark;
    if (p.perf.congelada) {
      perfProv.saldoAtual = perfProv.saldoAnterior;
      perfProv.apropriacao = 0;
      perfProv.memoria = 'Provisão mantida igual à do dia anterior (sem recálculo no dia)';
    } else {
      const excesso = Math.max(0, cotaBrutaPerf - ref);
      perfProv.saldoAtual = r2(p.perf.pct * excesso * p.qtdCotasBase);
      perfProv.apropriacao = r2(perfProv.saldoAtual - perfProv.saldoAnterior);
      perfProv.memoria =
        `${fmtPct(p.perf.pct, 0)} × max(0; cota bruta ${fmtN(cotaBrutaPerf, 8)} − cota de referência ` +
        `${fmtN(p.perf.cotaBase, 8)} × fator ${p.perf.benchmark} ${fmtN(p.perf.fatorBenchmark, 8)} = ${fmtN(ref, 8)}) × ` +
        `${fmtN(p.qtdCotasBase, 8)} cotas = ${fmtR(perfProv.saldoAtual)}`;
    }
  }
  const totalProvisoes = soma(p.provisoes.map((x) => x.saldoAtual));
  const plBase = r2(totalAtivos + p.caixa.saldoFinal + totalReceber - totalPagar - totalProvisoes);
  const bruta = plBase / p.qtdCotasBase;
  const cota = p.arredondamento === 'truncamento' ? truncar8(bruta) : arredondar8(bruta);

  let aplicacoesConvertidas = 0;
  let cotasEmitidas = 0;
  let cotasResgatadas = 0;
  let valorResgates = 0;
  for (const m of p.movs) {
    if (!m.converterHoje) continue;
    if (m.tipo === 'aplicacao' || m.tipo === 'integralizacao') {
      aplicacoesConvertidas = r2(aplicacoesConvertidas + (m.valor ?? 0));
      cotasEmitidas = arredondar8(cotasEmitidas + truncar8((m.valor ?? 0) / cota));
    } else {
      cotasResgatadas = arredondar8(cotasResgatadas + (m.cotas ?? 0));
      valorResgates = r2(valorResgates + r2((m.cotas ?? 0) * cota));
    }
  }
  let irComeCotas = 0;
  let cotasComeCotas = 0;
  const detalheComeCotas: DetalheComeCotas[] = [];
  const cc = p.comeCotas;
  if (cc && cc.aplicar) {
    // incide sobre as cotas existentes ao fim do dia, depois das conversões e cotizações de D
    const qAposMov = arredondar8(p.qtdCotasBase + cotasEmitidas - cotasResgatadas);
    const cotaConv = cc.cotaConversao === 'D-1' ? cc.cotaD1 : cota;
    let distribuido = 0;
    cc.posicoes.forEach((pos, i) => {
      const qtd = i < cc.posicoes.length - 1 ? truncar8(qAposMov * pos.peso) : arredondar8(qAposMov - distribuido);
      distribuido = arredondar8(distribuido + qtd);
      const tributado = pos.tratamento === 'tributado' || cc.tributaIsentos;
      const variacao = (cota - pos.cotaReferencia) * qtd;
      const ganho = tributado ? (cc.devolvePrejuizo ? variacao : Math.max(0, variacao)) : 0;
      const ir1 = r2(ganho * cc.aliquota);
      let ir = 0;
      let cotasRet = 0;
      for (let k = 0; k < cc.vezes; k++) {
        ir = r2(ir + ir1);
        cotasRet = arredondar8(cotasRet + truncar8(ir1 / cotaConv));
      }
      detalheComeCotas.push({ id: pos.id, qtdCotas: qtd, ganho: r2(ganho), ir, cotasRetiradas: cotasRet });
      irComeCotas = r2(irComeCotas + ir);
      cotasComeCotas = arredondar8(cotasComeCotas + cotasRet);
    });
  }
  // soma de quantidades que já têm 8 casas: arredonda (não trunca) para não gerar ruído de ponto flutuante
  const qtdFinal = arredondar8(p.qtdCotasBase + cotasEmitidas - cotasResgatadas - cotasComeCotas);
  const plFinal = r2(qtdFinal * cota);
  return {
    totalAtivos, caixa: p.caixa.saldoFinal, totalReceber, totalPagar, totalProvisoes, plAntesApropriacoes: plSemApropriacao, plBase, cotaBrutaPerf, cota,
    aplicacoesConvertidas, cotasEmitidas, cotasResgatadas, valorResgates, irComeCotas, cotasComeCotas, detalheComeCotas, qtdFinal, plFinal,
  };
}

export function clonar<T>(x: T): T {
  return structuredClone(x);
}

// ---------------------------------------------------------------------------------------------
// Universo de ativos (fictícios). Preços são simulados.
// ---------------------------------------------------------------------------------------------

export interface SpecAtivo {
  codigo: string;
  descricao: string;
  classe: string;
  peso: number;
  preco: number;
  fonte: string;
  casasQtd: number; // 0 = inteiro
  moeda?: 'USD';
  precoOrigem?: number;
  cambio?: number;
}

export const EMISSORES_DEB = [
  { codigo: 'EVSA12', nome: 'Energética Vale do Sapucaí S.A.', idx: 'CDI + 1,45%', incentivada: false },
  { codigo: 'RDCE13', nome: 'Rodovias do Cerrado S.A.', idx: 'IPCA + 6,90%', incentivada: true },
  { codigo: 'SLNO11', nome: 'Saneamento Litoral Norte S.A.', idx: 'IPCA + 7,10%', incentivada: true },
  { codigo: 'TSGE14', nome: 'Transmissora Serra Geral S.A.', idx: 'IPCA + 6,55%', incentivada: true },
  { codigo: 'PASU12', nome: 'Portos do Atlântico Sul S.A.', idx: 'CDI + 1,80%', incentivada: false },
  { codigo: 'ATRI21', nome: 'Agroindustrial Três Rios S.A.', idx: 'CDI + 2,30%', incentivada: false },
  { codigo: 'HBVI12', nome: 'Hospitalar Bem Viver S.A.', idx: 'CDI + 1,95%', incentivada: false },
  { codigo: 'LINO11', nome: 'Logística Integrada Norte S.A.', idx: 'CDI + 2,10%', incentivada: false },
  { codigo: 'TFSU13', nome: 'Telecom Fibra Sul S.A.', idx: 'CDI + 1,60%', incentivada: false },
  { codigo: 'VCLA12', nome: 'Varejo Casa & Lar S.A.', idx: 'CDI + 2,75%', incentivada: false },
  { codigo: 'EVSE11', nome: 'Eólica Ventos do Sertão S.A.', idx: 'IPCA + 7,35%', incentivada: true },
  { codigo: 'SOLC12', nome: 'Solar Chapada S.A.', idx: 'IPCA + 7,60%', incentivada: true },
  { codigo: 'GASM13', nome: 'Gasodutos do Médio Norte S.A.', idx: 'IPCA + 6,80%', incentivada: true },
  { codigo: 'FERR21', nome: 'Ferrovia Planalto Central S.A.', idx: 'IPCA + 7,20%', incentivada: true },
];

export const ACOES = [
  { t: 'QXTR3', n: 'Quixadá Transportes S.A. ON' }, { t: 'ZMBV3', n: 'Zimbro Varejo S.A. ON' },
  { t: 'YKAP4', n: 'Ykapé Papel e Celulose S.A. PN' }, { t: 'WQLA3', n: 'Waqlá Alimentos S.A. ON' },
  { t: 'VJNR3', n: 'Vajanra Energia S.A. ON' }, { t: 'KXOB3', n: 'Kaxoeira Obras S.A. ON' },
  { t: 'JZEL3', n: 'Jazê Elétrica S.A. ON' }, { t: 'UQPA4', n: 'Uquapé Petroquímica S.A. PN' },
  { t: 'XVRM3', n: 'Xavantina Mineração S.A. ON' }, { t: 'HZTA3', n: 'Hortaz Tecnologia S.A. ON' },
  { t: 'QPLN3', n: 'Quiplan Saúde S.A. ON' }, { t: 'ZFRT3', n: 'Zafira Frigoríficos S.A. ON' },
  { t: 'WJMA4', n: 'Banco Wajumá S.A. PN' }, { t: 'YRBQ3', n: 'Yrubá Químicos S.A. ON' },
  { t: 'KQSA3', n: 'Kaquissá Saneamento S.A. ON' },
];

const BANCOS = ['Banco Arandu S.A.', 'Banco Ybytu S.A.', 'Banco Piracema S.A.', 'Banco Tarumã S.A.', 'Banco Itaperuna Fictício S.A.'];
const FUNDOS_INVESTIDOS = [
  'Sabiá Macro FIF Multimercado', 'Tiê Crédito FIF RF CP', 'Caravela Long Short FIF Multimercado', 'Pororoca Ações FIF',
  'Cardeal Global FIC FIF IE', 'Juriti Inflação FIF RF', 'Gaivota Juros FIF Multimercado', 'Coruja Quant FIF Multimercado',
];
const OFFSHORE = [
  'Boreal Global Equity Fund — Class I', 'Austral World Quality Fund — Class A', 'Meridian Tech Leaders Fund — Inst.',
  'Polaris Emerging Markets Fund — Class I',
];

const pu = (rng: Rng, a: number, b: number): number => Number(entre(rng, a, b).toFixed(6));
const preco2 = (rng: Rng, a: number, b: number): number => Number(entre(rng, a, b).toFixed(2));
const cota8 = (rng: Rng, a: number, b: number): number => Number(entre(rng, a, b).toFixed(8));

export function titulosPublicos(rng: Rng): SpecAtivo[] {
  return [
    { codigo: 'LFT 01/03/2029', descricao: 'Letra Financeira do Tesouro — venc. 01/03/2029', classe: 'Título público', peso: 1, preco: pu(rng, 18100, 18500), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
    { codigo: 'LFT 01/09/2031', descricao: 'Letra Financeira do Tesouro — venc. 01/09/2031', classe: 'Título público', peso: 1, preco: pu(rng, 18050, 18450), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
    { codigo: 'LTN 01/01/2028', descricao: 'Letra do Tesouro Nacional — venc. 01/01/2028', classe: 'Título público', peso: 1, preco: pu(rng, 780, 830), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
    { codigo: 'NTN-B 15/08/2030', descricao: 'Nota do Tesouro Nacional série B — venc. 15/08/2030', classe: 'Título público', peso: 1, preco: pu(rng, 4300, 4500), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
    { codigo: 'NTN-B 15/05/2035', descricao: 'Nota do Tesouro Nacional série B — venc. 15/05/2035', classe: 'Título público', peso: 1, preco: pu(rng, 4100, 4300), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
    { codigo: 'NTN-F 01/01/2031', descricao: 'Nota do Tesouro Nacional série F — venc. 01/01/2031', classe: 'Título público', peso: 1, preco: pu(rng, 900, 980), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
  ];
}

export function compromissada(rng: Rng, peso: number): SpecAtivo {
  return {
    codigo: 'COMPROMISSADA OVER', descricao: 'Operação compromissada over — lastro LTN 01/01/2028 (volta D+1)', classe: 'Compromissada',
    peso, preco: pu(rng, 790, 820), fonte: 'PU de ida + remuneração pactuada (taxa over)', casasQtd: 0,
  };
}

export function debenture(rng: Rng, e: (typeof EMISSORES_DEB)[number], peso: number): SpecAtivo {
  return {
    codigo: e.codigo, descricao: `Debênture ${e.nome} — ${e.idx}${e.incentivada ? ' (incentivada Lei 12.431)' : ''}`,
    classe: 'Debênture', peso, preco: pu(rng, 960, 1160), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0,
  };
}

export function acao(rng: Rng, a: (typeof ACOES)[number], peso: number): SpecAtivo {
  return { codigo: a.t, descricao: a.n, classe: 'Ação', peso, preco: preco2(rng, 4, 95), fonte: 'B3 — preço de fechamento D', casasQtd: 0 };
}

export function cdb(rng: Rng, peso: number): SpecAtivo {
  const b = escolher(rng, BANCOS);
  const ano = inteiro(rng, 2027, 2030);
  const pct = inteiro(rng, 100, 118);
  return {
    codigo: `CDB ${b.split(' ')[1].toUpperCase().slice(0, 6)} ${ano}`, descricao: `CDB ${b} — ${pct}% do CDI — venc. ${ano}`,
    classe: 'CDB', peso, preco: pu(rng, 1050, 1400), fonte: 'Curva do papel (MaM por spread de crédito — manual do administrador)', casasQtd: 0,
  };
}

export function ativosDoTipo(rng: Rng, tipo: TipoFundo): SpecAtivo[] {
  const tp = titulosPublicos(rng);
  const lft = tp.filter((t) => t.codigo.startsWith('LFT'));
  switch (tipo) {
    case 'RF_DI':
      return [{ ...lft[0], peso: 45 }, { ...lft[1], peso: 20 }, { ...tp[2], peso: 5 }, compromissada(rng, 25), cdb(rng, 5)];
    case 'RF_CP': {
      const debs = amostra(rng, EMISSORES_DEB.filter((e) => !e.incentivada), 4);
      return [{ ...lft[0], peso: 25 }, compromissada(rng, 8), cdb(rng, 10), ...debs.map((e) => debenture(rng, e, inteiro(rng, 8, 18)))];
    }
    case 'FIM_MACRO': {
      const ac = amostra(rng, ACOES, 3);
      return [{ ...lft[0], peso: 45 }, { ...lft[1], peso: 20 }, { ...tp[3], peso: 6 }, compromissada(rng, 15), ...ac.map((a) => acao(rng, a, 4))];
    }
    case 'FIM_LS': {
      const ac = amostra(rng, ACOES, 6);
      return [{ ...lft[0], peso: 30 }, compromissada(rng, 10), ...ac.map((a) => acao(rng, a, inteiro(rng, 6, 14)))];
    }
    case 'FIA': {
      const ac = amostra(rng, ACOES, 8);
      return [compromissada(rng, 5), ...ac.map((a) => acao(rng, a, inteiro(rng, 6, 16)))];
    }
    case 'FIC_FIM': {
      const fs = amostra(rng, FUNDOS_INVESTIDOS, 5);
      return [
        compromissada(rng, 4),
        ...fs.map((f, i) => ({
          codigo: `COTA ${f.split(' ')[0].toUpperCase()}`, descricao: `Cotas do ${f}`, classe: 'Cota de fundo',
          peso: inteiro(rng, 12, 25) - i, preco: cota8(rng, 1.2, 9), fonte: 'Cota divulgada pelo administrador do fundo investido (D)', casasQtd: 8,
        })),
      ];
    }
    case 'PREV': {
      const ac = amostra(rng, ACOES, 3);
      const deb = escolher(rng, EMISSORES_DEB.filter((e) => !e.incentivada));
      return [{ ...lft[0], peso: 35 }, { ...tp[3], peso: 15 }, { ...tp[4], peso: 10 }, compromissada(rng, 8), debenture(rng, deb, 12), ...ac.map((a) => acao(rng, a, 5))];
    }
    case 'FIDC':
      return [
        { codigo: 'DC A VENCER', descricao: 'Direitos creditórios a vencer — duplicatas mercantis', classe: 'Direito creditório', peso: 70, preco: 1, fonte: 'Valor presente pela taxa de cessão (custodiante)', casasQtd: 2 },
        { codigo: 'DC VENC 1-30', descricao: 'Direitos creditórios vencidos de 1 a 30 dias', classe: 'Direito creditório', peso: 5, preco: 1, fonte: 'Valor presente (custodiante)', casasQtd: 2 },
        { codigo: 'DC VENC 31-60', descricao: 'Direitos creditórios vencidos de 31 a 60 dias', classe: 'Direito creditório', peso: 2, preco: 1, fonte: 'Valor presente (custodiante)', casasQtd: 2 },
        { codigo: 'DC VENC 61-90', descricao: 'Direitos creditórios vencidos de 61 a 90 dias', classe: 'Direito creditório', peso: 1.2, preco: 1, fonte: 'Valor presente (custodiante)', casasQtd: 2 },
        { codigo: 'DC VENC 91-180', descricao: 'Direitos creditórios vencidos de 91 a 180 dias', classe: 'Direito creditório', peso: 0.8, preco: 1, fonte: 'Valor presente (custodiante)', casasQtd: 2 },
        { ...lft[0], peso: 15 }, compromissada(rng, 6),
      ];
    case 'FII':
      return [
        { codigo: 'IMOVEL GLP-CAJAMAR', descricao: 'Galpão logístico em Cajamar (SP) — módulos A a D', classe: 'Imóvel', peso: 40, preco: 1, fonte: 'Laudo de avaliação anual (valor justo)', casasQtd: 2 },
        { codigo: 'IMOVEL LAJES-JQB', descricao: 'Lajes corporativas Ed. Jequitibá (andares 5 a 9) — São Paulo (SP)', classe: 'Imóvel', peso: 30, preco: 1, fonte: 'Laudo de avaliação anual (valor justo)', casasQtd: 2 },
        { codigo: 'IMOVEL GLP-EXTREMA', descricao: 'Galpão logístico em Extrema (MG)', classe: 'Imóvel', peso: 18, preco: 1, fonte: 'Laudo de avaliação anual (valor justo)', casasQtd: 2 },
        { codigo: 'LCI TARUMA 2027', descricao: 'LCI Banco Tarumã S.A. — 94% do CDI — venc. 2027', classe: 'LCI', peso: 6, preco: pu(rng, 1020, 1200), fonte: 'Curva do papel', casasQtd: 0 },
        { ...lft[0], peso: 6 },
      ];
    case 'FIP':
      return [
        { codigo: 'AGROFLORA PART', descricao: 'Ações da Agroflora Participações S.A. (companhia fechada)', classe: 'Participação', peso: 55, preco: preco2(rng, 8, 40), fonte: 'Valor justo — laudo de avaliação vigente', casasQtd: 0 },
        { codigo: 'VIDRARIA SUL', descricao: 'Ações da Vidraria Sul Indústria S.A. (companhia fechada)', classe: 'Participação', peso: 30, preco: preco2(rng, 2, 15), fonte: 'Valor justo — laudo de avaliação vigente', casasQtd: 0 },
        { ...lft[0], peso: 12 }, compromissada(rng, 3),
      ];
    case 'CAMBIAL':
      return [{ ...lft[0], peso: 60 }, { ...lft[1], peso: 25 }, compromissada(rng, 15)];
    case 'IE': {
      const fs = amostra(rng, OFFSHORE, 2);
      return [
        ...fs.map((f, i) => {
          const nav = Number(entre(rng, 90, 260).toFixed(4));
          return {
            codigo: `OFFSHORE ${f.split(' ')[0].toUpperCase()}`, descricao: `Cotas do ${f} (USD)`, classe: 'Ativo no exterior',
            peso: i === 0 ? 55 : 35, preco: nav, fonte: 'NAV oficial mais recente × PTAX venda D', casasQtd: 6, moeda: 'USD' as const, precoOrigem: nav,
          };
        }),
        { ...lft[0], peso: 7 }, compromissada(rng, 3),
      ];
    }
    case 'EXCLUSIVO': {
      const deb = escolher(rng, EMISSORES_DEB.filter((e) => !e.incentivada));
      return [
        { ...tp[3], peso: 30, fonte: 'Curva — taxa de aquisição (título classificado como mantido até o vencimento)' },
        { ...lft[0], peso: 30 }, cdb(rng, 15), debenture(rng, deb, 15), compromissada(rng, 10),
      ];
    }
    case 'FIAGRO':
      return [
        { codigo: 'CRA0260A1B2', descricao: 'CRA Securitizadora Piracema — série 45 (lastro: CPR de soja) — CDI + 3,10%', classe: 'CRA', peso: 30, preco: pu(rng, 950, 1080), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
        { codigo: 'CRA0260C3D4', descricao: 'CRA Securitizadora Piracema — série 51 (lastro: cédulas de cooperativa) — IPCA + 8,20%', classe: 'CRA', peso: 25, preco: pu(rng, 950, 1080), fonte: 'ANBIMA — taxa indicativa D', casasQtd: 0 },
        { codigo: 'CRA0260E5F6', descricao: 'CRA Securitizadora Araçá — série 12 (lastro: duplicatas de insumos) — CDI + 4,00%', classe: 'CRA', peso: 25, preco: pu(rng, 950, 1080), fonte: 'Preço do comitê de precificação do administrador', casasQtd: 0 },
        { codigo: 'LCA ARANDU 2027', descricao: 'LCA Banco Arandu S.A. — 93% do CDI', classe: 'LCA', peso: 10, preco: pu(rng, 1020, 1200), fonte: 'Curva do papel', casasQtd: 0 },
        { ...lft[0], peso: 10 },
      ];
    case 'INFRA': {
      const debs = amostra(rng, EMISSORES_DEB.filter((e) => e.incentivada), 5);
      return [...debs.map((e) => debenture(rng, e, inteiro(rng, 12, 20))), { ...lft[0], peso: 8 }, compromissada(rng, 4)];
    }
  }
}

export function materializarAtivos(specs: SpecAtivo[], totalAlvo: number, ptax?: number): Ativo[] {
  const pesoTotal = specs.reduce((a, s) => a + s.peso, 0);
  return specs.map((s) => {
    const valorAlvo = (totalAlvo * s.peso) / pesoTotal;
    const precoBRL = s.moeda === 'USD' && ptax ? s.preco * ptax : s.preco;
    const fator = Math.pow(10, s.casasQtd);
    const quantidade = Math.max(1, Math.round((valorAlvo / precoBRL) * fator) / fator);
    const a: Ativo = {
      codigo: s.codigo, descricao: s.descricao, classe: s.classe, quantidade, preco: s.preco,
      valor: r2(quantidade * precoBRL), fonte: s.fonte,
    };
    if (s.moeda === 'USD' && ptax) {
      a.moeda = 'USD';
      a.precoOrigem = s.preco;
      a.cambio = ptax;
      a.valor = r2(quantidade * s.preco * ptax);
    }
    return a;
  });
}

export function reprecificar(a: Ativo, novoPreco: number, fonte?: string): void {
  a.preco = novoPreco;
  if (a.moeda === 'USD') {
    a.precoOrigem = novoPreco;
    a.valor = r2(a.quantidade * novoPreco * (a.cambio ?? 1));
  } else {
    a.valor = r2(a.quantidade * novoPreco);
  }
  if (fonte) a.fonte = fonte;
}

export function ctxCalculo(dataD: string, plAnterior: number): CtxCalculo {
  return {
    data: dataD, plAnterior,
    diasCorridosDesdeAnterior: diasCorridos(diaUtilAnterior(dataD), dataD),
    duMes: diasUteisNoMes(dataD),
  };
}

export { r2, soma, fmtR, fmtData, somaDias, somaDiasUteis, diasUteisDecorridosNoMes, chance, inteiro, entre, escolher };
