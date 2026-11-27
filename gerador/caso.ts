// Monta a persona do fundo, o regulamento simulado, o mercado do dia e a posição "correta" (base).

import type { Rng } from './util.ts';
import {
  r2, entre, inteiro, escolher, chance, amostra, truncar8, fmtR, fmtPct, fmtN, fmtData,
  somaDias, somaDiasUteis, diaUtilAnterior, diasUteisNoMes, diasUteisDecorridosNoMes, ehDiaUtil, diasUteisEntre, solicitacaoPara,
} from './util.ts';
import {
  PERFIS, NOMES_FUNDO, COMPLEMENTOS, GESTORAS, ANALISTAS, GESTORES_PF, COTISTAS, MARCOS_HISTORIA, PARTICULARIDADES_GERAIS, fatosPara,
} from './catalogo.ts';
import type { TipoFundo, PerfilTipo, Gestora, PrazoResgate } from './catalogo.ts';
import type { Posicao, ParamTaxa, Provisao, MovPassivo, Item, LadoId, Dimensao, CtxCalculo, Resultado } from './modelo.ts';
import { ativosDoTipo, materializarAtivos, calcular, ctxCalculo, taxaDiaria } from './modelo.ts';

export interface Fundo {
  codigo: string;
  nome: string;
  tipo: TipoFundo;
  rotulo: string;
  classe: string;
  condominio: 'aberto' | 'fechado';
  publico: string;
  gestora: Gestora;
  gestorResponsavel: string;
  analistaResponsavel: string;
  inicio: string;
  cotistas: string;
  marcos: string[];
  particularidades: string[];
  pistas: string[]; // fatos da história que ajudam (ou distraem) na análise do dia
  historia: string;
}

export interface TaxaReg { codigo: 'TXADM' | 'TXGES' | 'TXCUS'; nome: string; param: ParamTaxa; pagamento: string; }
export interface DespesaFixa { codigo: string; nome: string; valor: number; periodo: 'anual' | 'trimestral' | 'mensal'; observacao?: string; }

export interface Regulamento {
  vigencia: string;
  taxas: TaxaReg[];
  performance?: { pct: number; benchmark: string; periodicidade: string; linhaDagua: string; metodo: string };
  despesasFixas: DespesaFixa[];
  tabelaCVM: { ate: number | null; valor: number }[];
  plReferenciaCVM: number;
  encargos: string[];
  naoEncargos: string[];
  cotizacao: string[];
  horarioCorte?: string;
  cota: string;
  precificacao: string[];
  tributacao: string;
  especificos: string[];
  alteracoes: string[];
}

export interface Referencia { ativo: string; fonte: string; valor: string; obs?: string; }
export interface Futuro { contrato: string; quantidade: number; ajustePorContrato: number; }
export interface Mercado {
  cdiAA: number;
  ptax?: { compraD: number; vendaD: number; vendaD1: number };
  referencias: Referencia[];
  futuros: Futuro[];
  eventos: string[];
  benchmarks: string[];
}
export interface Comunicacao { hora: string; de: string; assunto: string; texto: string; }

export type Gravidade = 'informativo' | 'ressalva' | 'pendencia' | 'erro';
export interface Impacto { lado: LadoId; dPL: number; dCota: number; dCaixa: number; dQtdFinal: number; dProvisoes: number; }
export interface Achado {
  cenario: string;
  dimensoes: Dimensao[];
  titulo: string;
  ladoCorreto: LadoId | 'nenhum' | 'indeterminado';
  ajustePor: string; // quem precisa agir
  causaRaiz: string;
  evidencias: string[];
  raciocinio: string[];
  acao: string;
  gravidade?: Gravidade; // se ausente, calculada pelo impacto
  impactos?: Impacto[];
}

export interface Ctx {
  id: string;
  rng: Rng;
  tipo: TipoFundo;
  perfil: PerfilTipo;
  data: string;
  dAnterior: string;
  fundo: Fundo;
  reg: Regulamento;
  base: Posicao;
  alfa: Posicao;
  beta: Posicao;
  mercado: Mercado;
  comunicacoes: Comunicacao[];
  calc: CtxCalculo;
  plAnterior: number;
  cotaAnterior: number;
  qtdAnterior: number;
  usados: Set<string>;
  achados: Achado[];
  memoriaDisponivel: boolean;
  revelarFonte: boolean;
  prazos?: PrazoResgate;
  cotaHist: Record<string, number>;
}

export function gravidadeEfetiva(a: Achado): Gravidade {
  // qualquer diferença que mude a cota (8 casas), a quantidade de cotas ou o PL é erro; provisão diferente muda o PL
  return a.gravidade ?? (a.dimensoes.includes('cota') || a.dimensoes.includes('provisoes') ? 'erro' : 'ressalva');
}

export const TABELA_CVM = [
  { ate: 20e6, valor: 2100 }, { ate: 50e6, valor: 3600 }, { ate: 100e6, valor: 5400 },
  { ate: 300e6, valor: 7800 }, { ate: 1e9, valor: 10800 }, { ate: null, valor: 14400 },
];
export const faixaCVM = (pl: number): number => TABELA_CVM.findIndex((f) => f.ate === null || pl <= f.ate);

export function duTrimestre(d: string): number {
  const ano = d.slice(0, 4);
  const mes = Number(d.slice(5, 7));
  const ini = Math.floor((mes - 1) / 3) * 3 + 1;
  let n = 0;
  for (let m = ini; m < ini + 3; m++) n += diasUteisNoMes(`${ano}-${String(m).padStart(2, '0')}-01`);
  return n;
}
export function duDecorridosTrimestre(d: string): number {
  const ano = d.slice(0, 4);
  const mes = Number(d.slice(5, 7));
  const ini = Math.floor((mes - 1) / 3) * 3 + 1;
  let n = 0;
  for (let m = ini; m < mes; m++) n += diasUteisNoMes(`${ano}-${String(m).padStart(2, '0')}-01`);
  return n + diasUteisDecorridosNoMes(d);
}

export function textoTaxa(t: TaxaReg): string {
  const p = t.param;
  let s = '';
  if (p.faixas && p.faixas.length) {
    s = p.faixas
      .map((f, i) => (f.ate === null ? `${fmtPct(f.pct, 3)} a.a. sobre o excedente` : `${fmtPct(f.pct, 3)} a.a. sobre a parcela do PL ${i === 0 ? 'até' : 'até'} ${fmtR(f.ate)}`))
      .join('; ');
  } else s = `${fmtPct(p.pct, 3)} a.a.`;
  const met = p.metodo === 'linear_252' ? 'apropriada diariamente à razão de 1/252 (dias úteis), de forma linear'
    : p.metodo === 'exponencial_252' ? 'apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis'
    : 'apropriada diariamente à razão de 1/365 por dia corrido';
  let r = `${t.nome}: ${s}, calculada sobre o PL do dia útil anterior, ${met}; paga ${t.pagamento}.`;
  if (p.faixas && p.faixas.length && p.metodo === 'exponencial_252') r += ' Com faixas, o percentual efetivo é a média ponderada das faixas sobre o PL, aplicada no fator exponencial.';
  if (p.minimoMensal) r += ` Valor mínimo mensal de ${fmtR(p.minimoMensal)} (apropriado por dia útil do mês).`;
  return r;
}

const CDI_AA = 0.1415;

function plAleatorio(rng: Rng, [a, b]: [number, number]): number {
  return Math.exp(entre(rng, Math.log(a), Math.log(b)));
}

export interface OpcoesBase { data: string; nomesUsados: Set<string>; indice: number; }

export function montarContexto(rng: Rng, id: string, tipo: TipoFundo, op: OpcoesBase): Ctx {
  const perfil = PERFIS[tipo];
  const data = op.data;
  const dAnterior = diaUtilAnterior(data);

  // ---------------- persona ----------------
  let nome = '';
  for (let i = 0; i < 50; i++) {
    nome = `${escolher(rng, NOMES_FUNDO)}${escolher(rng, COMPLEMENTOS)} ${perfil.sufixo}`;
    if (!op.nomesUsados.has(nome)) break;
  }
  op.nomesUsados.add(nome);
  const AFINIDADE: Record<TipoFundo, RegExp> = {
    RF_DI: /renda fixa líquida|tesouraria/i, RF_CP: /crédito privado/i, FIM_MACRO: /macro|derivativos|multiestrat|juros/i,
    FIM_LS: /long & short|small caps/i, FIA: /small caps/i, FIC_FIM: /fundos de fundos/i, PREV: /previd/i, FIDC: /FIDC/i,
    FII: /imobili/i, FIP: /private equity|multiestrat/i, CAMBIAL: /cambial/i, IE: /globais|offshore/i, EXCLUSIVO: /exclusivos|familiar/i,
    FIAGRO: /Fiagro|CRA/i, INFRA: /infraestrutura/i,
  };
  const gestoraPreferida = GESTORAS.filter((g) => AFINIDADE[tipo].test(g.perfil));
  const gestora = escolher(rng, gestoraPreferida.length ? gestoraPreferida : GESTORAS);
  const anoInicio = inteiro(rng, 2009, 2023);
  const inicio = `${anoInicio}-${String(inteiro(rng, 1, 12)).padStart(2, '0')}-${String(inteiro(rng, 1, 28)).padStart(2, '0')}`;
  const publico = escolher(rng, perfil.publico);
  const fundo: Fundo = {
    codigo: `FND-${String(op.indice + 1).padStart(4, '0')}`,
    nome,
    tipo,
    rotulo: perfil.rotulo,
    classe: perfil.classe,
    condominio: perfil.condominio,
    publico,
    gestora,
    gestorResponsavel: escolher(rng, GESTORES_PF),
    analistaResponsavel: escolher(rng, ANALISTAS),
    inicio,
    cotistas: escolher(rng, COTISTAS[tipo]),
    marcos: amostra(rng, fatosPara(MARCOS_HISTORIA, tipo, perfil.condominio, anoInicio, publico), 2).map((f) => f.texto),
    particularidades: amostra(rng, fatosPara(PARTICULARIDADES_GERAIS, tipo, perfil.condominio, anoInicio, publico), 2).map((f) => f.texto),
    pistas: [],
    historia: '',
  };

  // ---------------- números de D-1 ----------------
  let plAnterior = plAleatorio(rng, perfil.pl);
  const cotaSorteada = Number(entre(rng, perfil.cota[0], perfil.cota[1]).toFixed(8));
  const qtdAnterior = truncar8(plAnterior / cotaSorteada);
  plAnterior = r2(qtdAnterior * cotaSorteada);
  // a cota publicada é exatamente PL ÷ quantidade, truncada (o cabeçalho tem que ser reproduzível pelo analista)
  const cotaAnterior = truncar8(plAnterior / qtdAnterior);
  const calc = ctxCalculo(data, plAnterior);

  // ---------------- regulamento ----------------
  const metodo: ParamTaxa['metodo'] = chance(rng, 0.8) ? 'linear_252' : 'exponencial_252';
  const pctAdm = Number(entre(rng, perfil.taxaAdm[0], perfil.taxaAdm[1]).toFixed(4));
  const pctGes = Number(entre(rng, perfil.taxaGes[0], perfil.taxaGes[1]).toFixed(4));
  const pctCus = Number(entre(rng, perfil.custodia[0], perfil.custodia[1]).toFixed(4));
  const pagamento = 'mensalmente, até o 5º dia útil do mês subsequente';
  const taxas: TaxaReg[] = [
    { codigo: 'TXADM', nome: 'Taxa de administração', param: { pct: pctAdm, metodo }, pagamento },
    { codigo: 'TXGES', nome: 'Taxa de gestão', param: { pct: pctGes, metodo }, pagamento },
    { codigo: 'TXCUS', nome: 'Taxa máxima de custódia', param: { pct: pctCus, metodo }, pagamento },
  ];
  if (tipo === 'FIDC' && chance(rng, 0.6)) {
    taxas[0].param.minimoMensal = r2(inteiro(rng, 6, 18) * 1000);
  }
  const auditoria = tipo === 'FIDC' || tipo === 'FIP' || tipo === 'FII' ? inteiro(rng, 60, 140) * 1000 : inteiro(rng, 24, 80) * 1000;
  const despesasFixas: DespesaFixa[] = [
    { codigo: 'AUDIT', nome: 'Auditoria independente', valor: auditoria, periodo: 'anual', observacao: 'contrato anual; provisão diária por 1/252' },
    { codigo: 'ANBIMA', nome: 'Taxa ANBIMA (convênio de autorregulação)', valor: inteiro(rng, 3, 12) * 100, periodo: 'mensal' },
  ];
  if (['RF_DI', 'RF_CP', 'FIM_MACRO', 'EXCLUSIVO', 'PREV', 'CAMBIAL', 'INFRA'].includes(tipo)) {
    despesasFixas.push({ codigo: 'SELIC', nome: 'Custódia SELIC/B3 (estimativa mensal)', valor: inteiro(rng, 8, 60) * 100, periodo: 'mensal' });
  }
  if (tipo === 'FIDC') {
    despesasFixas.push({ codigo: 'COBRANCA', nome: 'Agente de cobrança', valor: inteiro(rng, 8, 25) * 1000, periodo: 'mensal' });
    despesasFixas.push({ codigo: 'RATING', nome: 'Agência de classificação de risco (rating)', valor: inteiro(rng, 40, 90) * 1000, periodo: 'anual' });
  }
  if (tipo === 'FII' || tipo === 'FIAGRO') {
    despesasFixas.push({ codigo: 'ESCRIT', nome: 'Escrituração de cotas', valor: inteiro(rng, 5, 15) * 1000, periodo: 'mensal' });
  }
  if (tipo === 'FIP') {
    despesasFixas.push({ codigo: 'LAUDO', nome: 'Consultoria de avaliação (laudos)', valor: inteiro(rng, 60, 150) * 1000, periodo: 'anual' });
  }
  const plReferenciaCVM = r2(plAnterior * entre(rng, 0.9, 1.05));

  let reg: Regulamento = {
    vigencia: `${fmtData(`${inteiro(rng, 2025, 2025)}-${String(inteiro(rng, 3, 12)).padStart(2, '0')}-01`)} (adaptado à Resolução CVM 175)`,
    taxas,
    despesasFixas,
    tabelaCVM: TABELA_CVM,
    plReferenciaCVM,
    encargos: [
      'taxas de administração, gestão, custódia e performance previstas neste regulamento',
      'taxa de fiscalização da CVM',
      'honorários e despesas do auditor independente',
      'custos de corretagem, emolumentos e registro de operações',
      'despesas com custódia e liquidação de ativos (SELIC/B3)',
      'contribuição anual à ANBIMA',
      'honorários advocatícios e custas em defesa dos interesses da classe, quando aprovados pelo administrador e documentados',
    ],
    naoEncargos: [
      'tarifas bancárias de manutenção de conta e pacotes de serviços (suportadas pelo administrador)',
      'despesas de marketing, eventos e relacionamento da gestora ou do distribuidor',
      'despesas não previstas expressamente como encargo',
    ],
    cotizacao: [],
    cota: 'Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.',
    precificacao: [],
    tributacao: perfil.tributacao,
    especificos: [],
    alteracoes: [],
  };
  let prazo: PrazoResgate | undefined;
  if (perfil.condominio === 'aberto') {
    reg.horarioCorte = escolher(rng, ['14:00', '15:00', '16:00']);
    prazo = escolher(rng, perfil.cotizacaoResgate);
    const unidade = (n: number, corridos: boolean): string => (corridos ? 'dias corridos' : n === 1 ? 'dia útil' : 'dias úteis');
    const txtCot = prazo.cot === 0
      ? 'cotização no próprio dia do pedido, pela cota de fechamento desse dia'
      : `cotização em D+${prazo.cot} ${unidade(prazo.cot, prazo.corridos)} após o pedido${prazo.corridos ? ' (se não for dia útil, no primeiro dia útil seguinte)' : ''}, pela cota de fechamento da data de cotização`;
    const txtLiq = prazo.liq === 0 ? 'liquidação financeira no mesmo dia da cotização' : `liquidação financeira em D+${prazo.liq} ${unidade(prazo.liq, false)} após a cotização`;
    reg.cotizacao = [
      `Aplicação: conversão em D+0 (cota de fechamento do dia do crédito dos recursos), para recursos disponíveis até ${reg.horarioCorte}; recursos creditados após o horário de corte são convertidos no dia útil seguinte.`,
      `Resgate: ${txtCot}; ${txtLiq}.`,
    ];
  } else {
    reg.cotizacao = [perfil.saidaFechado!];
  }
  reg.precificacao = precificacaoDoTipo(tipo);

  // performance
  let perfCfg: Regulamento['performance'];
  if (perfil.perf.chance > 0 && chance(rng, perfil.perf.chance)) {
    const bench = escolher(rng, perfil.perf.benchmarks);
    perfCfg = {
      pct: 0.2,
      benchmark: bench === 'CDI' ? '100% do CDI' : bench,
      periodicidade: 'semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte)',
      linhaDagua: 'Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.',
      metodo: 'Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.',
    };
    perfCfg.pct = 0.2;
    reg.performance = perfCfg;
  }

  // ---------------- mercado ----------------
  const mercado: Mercado = { cdiAA: CDI_AA, referencias: [], futuros: [], eventos: [], benchmarks: [] };
  if (tipo === 'IE' || tipo === 'CAMBIAL') {
    const vendaD = Number(entre(rng, 5.05, 5.85).toFixed(4));
    mercado.ptax = { compraD: Number((vendaD - 0.0006).toFixed(4)), vendaD, vendaD1: Number((vendaD * (1 + entre(rng, -0.012, 0.012))).toFixed(4)) };
  }

  // ---------------- passivo ----------------
  const movs: MovPassivo[] = [];
  const aPagar: Item[] = [];
  const aReceber: Item[] = [];
  const lancs: { historico: string; valor: number }[] = [];
  // série curta de cotas passadas: a de D−1 é a do cabeçalho; as anteriores seguem a variação diária típica do tipo
  const cotaHist: Record<string, number> = { [dAnterior]: cotaAnterior };
  {
    let dh = dAnterior;
    let ch = cotaAnterior;
    for (let i = 0; i < 3; i++) {
      ch = truncar8(ch / (1 + entre(rng, perfil.retornoDia[0], perfil.retornoDia[1])));
      dh = diaUtilAnterior(dh);
      cotaHist[dh] = ch;
    }
  }
  const unico = tipo === 'EXCLUSIVO' || tipo === 'PREV';
  let seqCotista = inteiro(rng, 10, 900);
  const cotista = (): string => (unico ? 'Cotista único' : `Cotista ${String(seqCotista++ * 7 % 9973).padStart(4, '0')}`);
  if (perfil.condominio === 'aberto') {
    const pz = prazo!;
    const corte = Number(reg.horarioCorte!.slice(0, 2));
    const nAplic = inteiro(rng, 0, 3);
    for (let i = 0; i < nAplic; i++) {
      const id = `APL-${i + 1}`;
      const v = r2(plAnterior * entre(rng, 0.0004, 0.005));
      const h = `${String(inteiro(rng, 9, corte - 1)).padStart(2, '0')}:${String(inteiro(rng, 0, 59)).padStart(2, '0')}`;
      const quem = cotista();
      movs.push({ id, tipo: 'aplicacao', cotista: quem, valor: v, recebidoAs: h, solicitadoEm: data, cotizacao: data, liquidacao: data, converterHoje: true });
      lancs.push({ historico: `TED recebida — aplicação [${id}] ${quem} (${h})`, valor: v });
    }
    // resgates que cotizam hoje: a data do pedido decorre do prazo do regulamento
    const solHoje = solicitacaoPara(data, pz.cot, pz.corridos);
    const nResg = solHoje ? inteiro(rng, 0, 2) : 0; // sem data de pedido possível, não há resgate cotizando hoje
    for (let i = 0; i < nResg; i++) {
      const cotas = truncar8(qtdAnterior * entre(rng, 0.0004, 0.004));
      movs.push({ id: `RSG-${i + 1}`, tipo: 'resgate', cotista: cotista(), cotas, solicitadoEm: solHoje!, cotizacao: data, liquidacao: somaDiasUteis(data, pz.liq), converterHoje: true });
    }
    // resgates cotizados antes que liquidam hoje: valor = cotas × cota da data de cotização (a cota do cabeçalho, se D−1)
    const czLiq = somaDiasUteis(data, -Math.max(pz.liq, 1));
    const solLiq = pz.liq >= 1 ? solicitacaoPara(czLiq, pz.cot, pz.corridos) : null;
    if (solLiq) {
      const nLiq = inteiro(rng, 0, 2);
      for (let i = 0; i < nLiq; i++) {
        const id = `LIQ-${i + 1}`;
        const cz = czLiq;
        const cotaC = cotaHist[cz];
        const cotas = truncar8(qtdAnterior * entre(rng, 0.0004, 0.003));
        const valor = r2(cotas * cotaC);
        const quem = cotista();
        movs.push({ id, tipo: 'resgate', cotista: quem, cotas, valor, solicitadoEm: solLiq, cotizacao: cz, liquidacao: data, converterHoje: false, observacao: `cotizado em ${fmtData(cz)} pela cota de ${fmtN(cotaC, 8)}; liquidação financeira hoje` });
        lancs.push({ historico: `Pagamento de resgate [${id}] — ${quem} (cotizado em ${fmtData(cz)})`, valor: -valor });
      }
    }
    // resgates já cotizados que só liquidam depois de hoje: compõem "resgates a pagar"
    let pendente = 0;
    if (pz.liq >= 2) {
      const nPen = inteiro(rng, 0, 2);
      for (let i = 0; i < nPen; i++) {
        const k = inteiro(rng, 1, pz.liq - 1);
        const cz = somaDiasUteis(data, -k);
        const solPen = solicitacaoPara(cz, pz.cot, pz.corridos);
        if (!solPen) continue;
        const cotaC = cotaHist[cz];
        const cotas = truncar8(qtdAnterior * entre(rng, 0.0004, 0.003));
        const valor = r2(cotas * cotaC);
        const liq = somaDiasUteis(cz, pz.liq);
        movs.push({ id: `PEN-${i + 1}`, tipo: 'resgate', cotista: cotista(), cotas, valor, solicitadoEm: solPen, cotizacao: cz, liquidacao: liq, converterHoje: false, observacao: `cotizado em ${fmtData(cz)} pela cota de ${fmtN(cotaC, 8)}; liquidação em ${fmtData(liq)} (ainda a pagar)` });
        pendente = r2(pendente + valor);
      }
    }
    const totalAplic = r2(movs.filter((m) => m.tipo === 'aplicacao').reduce((a, m) => a + (m.valor ?? 0), 0));
    if (totalAplic > 0) aPagar.push({ codigo: 'APLIC A CONVERTER', descricao: 'Aplicações recebidas no dia, a converter em cotas', valor: totalAplic });
    if (pendente > 0) aPagar.push({ codigo: 'RESGATES A PAGAR', descricao: 'Resgates já cotizados e ainda não liquidados', valor: pendente });
  }

  // ---------------- futuros ----------------
  const letra = 'FGHJKMNQUVXZ';
  const mesSeg = (Number(data.slice(5, 7)) % 12);
  const anoSeg = mesSeg === 0 ? Number(data.slice(2, 4)) + 1 : Number(data.slice(2, 4));
  const codDol = `DOL${letra[mesSeg]}${anoSeg}`;
  const pares = [1, 3, 5, 7, 9, 11];
  const mIdx = pares.find((m) => m >= Number(data.slice(5, 7)) - 1 + 1) ?? 1;
  const codInd = `IND${letra[mIdx]}${mIdx < Number(data.slice(5, 7)) - 1 ? anoSeg : data.slice(2, 4)}`;
  if (tipo === 'FIM_MACRO') {
    mercado.futuros.push({ contrato: 'DI1F28', quantidade: inteiro(rng, 200, 3000) * (chance(rng, 0.5) ? 1 : -1), ajustePorContrato: r2(entre(rng, -60, 60)) });
    mercado.futuros.push({ contrato: codDol, quantidade: inteiro(rng, 20, 300) * (chance(rng, 0.5) ? 1 : -1), ajustePorContrato: r2(entre(rng, -1500, 1500)) });
    if (chance(rng, 0.6)) mercado.futuros.push({ contrato: codInd, quantidade: inteiro(rng, 20, 200) * (chance(rng, 0.5) ? 1 : -1), ajustePorContrato: r2(entre(rng, -500, 500)) });
  } else if (tipo === 'FIM_LS') {
    mercado.futuros.push({ contrato: codInd, quantidade: -inteiro(rng, 50, 300), ajustePorContrato: r2(entre(rng, -500, 500)) });
  } else if (tipo === 'CAMBIAL') {
    mercado.futuros.push({ contrato: codDol, quantidade: Math.max(1, Math.round(plAnterior / 280000)), ajustePorContrato: r2(entre(rng, -1400, 1400)) });
  }
  if (mercado.futuros.length) {
    const aj = r2(mercado.futuros.reduce((a, f) => a + f.quantidade * f.ajustePorContrato, 0));
    if (aj >= 0) aReceber.push({ codigo: 'AJUSTE FUTUROS D', descricao: 'Ajuste diário de futuros de D (liquidação em D+1)', valor: aj });
    else aPagar.push({ codigo: 'AJUSTE FUTUROS D', descricao: 'Ajuste diário de futuros de D (liquidação em D+1)', valor: -aj });
    const ajAnt = r2(plAnterior * entre(rng, -0.003, 0.003));
    lancs.push({ historico: `Liquidação B3 — ajuste de futuros de ${fmtData(dAnterior)}`, valor: ajAnt });
  }

  // ---------------- provisões ----------------
  const provisoes: Provisao[] = [];
  const duDec = diasUteisDecorridosNoMes(data);
  const duMesAnt = diasUteisNoMes(somaDias(`${data.slice(0, 8)}01`, -1));
  for (const t of taxas) {
    const diaria = taxaDiaria(t.param, plAnterior, calc).valor;
    const dias = duDec <= 5 ? duMesAnt + duDec - 1 : duDec - 1;
    provisoes.push({
      codigo: t.codigo, descricao: `${t.nome} a pagar`, saldoAnterior: r2(diaria * dias * entre(rng, 0.97, 1.03)), apropriacao: 0, pagamento: 0, saldoAtual: 0, memoria: '',
      regra: { tipo: 'pct', param: structuredClone(t.param) },
    });
  }
  for (const d of despesasFixas) {
    const diasPeriodo = d.periodo === 'anual' ? 252 : d.periodo === 'trimestral' ? duTrimestre(data) : diasUteisNoMes(data);
    const decorridos = d.periodo === 'anual' ? inteiro(rng, 20, 230) : d.periodo === 'trimestral' ? duDecorridosTrimestre(data) - 1 : duDec - 1;
    provisoes.push({
      codigo: d.codigo, descricao: `${d.nome} a pagar`, saldoAnterior: r2((d.valor / diasPeriodo) * decorridos), apropriacao: 0, pagamento: 0, saldoAtual: 0, memoria: '',
      regra: { tipo: 'fixo', valorPeriodo: d.valor, periodo: d.periodo, diasPeriodo },
    });
  }
  const valorCVM = TABELA_CVM[faixaCVM(plReferenciaCVM)].valor;
  provisoes.push({
    codigo: 'CVM', descricao: 'Taxa de fiscalização CVM a pagar', saldoAnterior: r2((valorCVM / duTrimestre(data)) * (duDecorridosTrimestre(data) - 1)),
    apropriacao: 0, pagamento: 0, saldoAtual: 0, memoria: '',
    regra: { tipo: 'fixo', valorPeriodo: valorCVM, periodo: 'trimestral', diasPeriodo: duTrimestre(data) },
  });
  if (perfCfg) {
    provisoes.push({ codigo: 'PERF', descricao: 'Taxa de performance a pagar', saldoAnterior: 0, apropriacao: 0, pagamento: 0, saldoAtual: 0, memoria: '', regra: { tipo: 'performance' } });
  }

  // ---------------- caixa ----------------
  const fracCaixa = ['FIDC', 'FIP', 'FII', 'FIAGRO'].includes(tipo) ? entre(rng, 0.015, 0.05) : entre(rng, 0.001, 0.012);
  let saldoInicial = r2(plAnterior * fracCaixa);
  const somaLanc = lancs.reduce((a, l) => a + l.valor, 0);
  if (saldoInicial + somaLanc < plAnterior * 0.0005) saldoInicial = r2(saldoInicial - somaLanc + plAnterior * 0.001);

  const base: Posicao = {
    ativos: [],
    caixa: { saldoInicial, lancamentos: lancs, saldoFinal: 0 },
    aReceber,
    aPagar,
    provisoes,
    qtdCotasBase: qtdAnterior,
    arredondamento: 'truncamento',
    movs,
  };

  // ---------------- ativos ----------------
  const ret = entre(rng, perfil.retornoDia[0], perfil.retornoDia[1]);
  const alvo = plAnterior * (1 + ret);
  const r0 = calcular(base, calc);
  const totalAtivos = alvo + r0.totalProvisoes + r0.totalPagar - r0.totalReceber - r0.caixa;
  const specs = ativosDoTipo(rng, tipo);
  let ptax = mercado.ptax?.vendaD;
  base.ativos = materializarAtivos(specs, totalAtivos, ptax);
  if (tipo === 'FIDC') {
    // a PDD reduz o PL: calibra os ativos já somando a PDD estimada, para a cota não "pular" em relação a D−1
    base.ativos = materializarAtivos(specs, totalAtivos + calcularPDD(base), ptax);
    const pdd = calcularPDD(base);
    base.ativos.push({ codigo: '(-) PDD', descricao: '(−) Provisão para perdas esperadas (PDD) — política do regulamento', classe: 'Redutora', quantidade: 1, preco: -pdd, valor: -pdd, fonte: 'Cálculo pelo aging do custodiante' });
  }

  // referências de mercado
  for (const a of base.ativos) {
    if (a.classe === 'Título público' || a.classe === 'Debênture' || a.classe === 'CRA') {
      if (a.fonte.startsWith('ANBIMA')) mercado.referencias.push({ ativo: a.codigo, fonte: 'ANBIMA — PU pela taxa indicativa de D', valor: fmtN(a.preco, 6) });
      else if (a.fonte.startsWith('Curva')) mercado.referencias.push({ ativo: a.codigo, fonte: 'ANBIMA — PU pela taxa indicativa de D (apenas referência de mercado)', valor: fmtN(a.preco * entre(rng, 0.97, 1.03), 6) });
    } else if (a.classe === 'Ação') {
      mercado.referencias.push({ ativo: a.codigo, fonte: 'B3 — preço de fechamento de D', valor: fmtN(a.preco, 2) });
    } else if (a.classe === 'Cota de fundo') {
      mercado.referencias.push({ ativo: a.codigo, fonte: 'Cota de D divulgada pelo administrador do investido', valor: fmtN(a.preco, 8), obs: `divulgada às ${String(inteiro(rng, 17, 19))}:${String(inteiro(rng, 10, 59))}` });
    } else if (a.classe === 'Ativo no exterior') {
      mercado.referencias.push({ ativo: a.codigo, fonte: `NAV oficial de ${fmtData(dAnterior)} (último disponível)`, valor: `USD ${fmtN(a.preco, 4)}` });
    }
  }
  if (mercado.ptax) {
    mercado.referencias.push({ ativo: 'PTAX', fonte: `BCB — PTAX de ${fmtData(data)}`, valor: `compra ${fmtN(mercado.ptax.compraD, 4)} / venda ${fmtN(mercado.ptax.vendaD, 4)}` });
    mercado.referencias.push({ ativo: 'PTAX', fonte: `BCB — PTAX de ${fmtData(dAnterior)}`, valor: `venda ${fmtN(mercado.ptax.vendaD1, 4)}` });
  }

  // performance: parâmetros coerentes com a cota bruta do dia
  if (perfCfg) {
    const dataBasePerf = Number(data.slice(5, 7)) <= 6 ? `${Number(data.slice(0, 4)) - 1}-12-31` : `${data.slice(0, 4)}-06-30`;
    // configuração provisória só para obter a cota bruta (antes da performance) do dia
    base.perf = { pct: 0.2, cotaBase: 0.0001, dataBase: dataBasePerf, fatorBenchmark: 1, benchmark: perfCfg.benchmark };
    const cotaBruta = calcular(base, calc).cotaBrutaPerf!;
    const duPerf = diasUteisEntre(dataBasePerf, data);
    const fatorCdi = Math.pow(1 + CDI_AA, duPerf / 252);
    const ehCdi = perfCfg.benchmark === '100% do CDI';
    const fator = Number((ehCdi ? fatorCdi : fatorCdi * (1 + entre(rng, -0.08, 0.12))).toFixed(8));
    const excesso = entre(rng, 0.003, 0.03);
    const ref = cotaBruta * (1 - excesso);
    base.perf = { pct: 0.2, cotaBase: Number((ref / fator).toFixed(8)), dataBase: dataBasePerf, fatorBenchmark: fator, benchmark: perfCfg.benchmark };
    const rP2 = calcular(base, calc);
    const prov = base.provisoes.find((p) => p.codigo === 'PERF')!;
    // provisão de D−1 pela mesma fórmula: P = pct/(1−pct) × max(0; PL(D−1) − referência(D−1) × quantidade)
    const fatorD1 = ehCdi ? fator / Math.pow(1 + CDI_AA, 1 / 252) : fator / (1 + entre(rng, -0.012, 0.012));
    const refD1 = base.perf!.cotaBase * fatorD1;
    prov.saldoAnterior = r2((0.2 / 0.8) * Math.max(0, plAnterior - refD1 * qtdAnterior));
    void rP2;
    mercado.benchmarks.push(`Fator acumulado do ${perfCfg.benchmark} de ${fmtData(dataBasePerf)} até ${fmtData(data)}: ${fmtN(fator, 8)}`);
    reg.especificos.push(`Performance: cota de referência vigente = ${fmtN(base.perf.cotaBase, 8)} (cota da última cobrança efetiva, em ${fmtData(dataBasePerf)}).`);
  }

  // específicos do tipo
  if (tipo === 'FIDC') {
    reg.especificos.push(
      'Política de perdas esperadas (PDD) sobre o valor presente dos direitos creditórios: a vencer 0,5%; vencidos 1–30 dias 5%; 31–60 dias 15%; 61–90 dias 30%; 91–180 dias 60%; acima de 180 dias 100%. O enquadramento por faixa segue o relatório de aging do custodiante de D.',
      'Amortizações conforme cronograma do suplemento; o valor amortizado por cota é deduzido do PL na data do pagamento.',
    );
  }
  if (tipo === 'FII' || tipo === 'FIAGRO') {
    reg.especificos.push('Rendimentos: distribuição mensal de no mínimo 95% do resultado caixa semestral. O rendimento anunciado é reconhecido como "rendimentos a distribuir" (passivo) na data do anúncio (data-com), reduzindo o PL.');
  }
  if (tipo === 'FIP') {
    reg.especificos.push('Valor justo das companhias investidas: laudo independente, atualizado na data em que o comitê de investimentos aprova o novo laudo.');
    reg.especificos.push('Chamadas de capital: os recursos integralizados são convertidos em cotas pela cota de fechamento do dia do crédito.');
  }
  if (tipo === 'EXCLUSIVO') {
    reg.especificos.push('Classe exclusiva de investidor profissional que declarou, por escrito, intenção e capacidade financeira de manter os títulos classificados como "mantidos até o vencimento" — esses títulos são marcados pela curva da taxa de aquisição, e não a mercado.');
  }
  if (tipo === 'IE') {
    reg.especificos.push('Ativos no exterior: NAV oficial mais recente disponível até 18h de D (em regra, o NAV de D−1), convertido pela PTAX de VENDA de D. NAV estimado ou indicativo não é aceito.');
  }

  const ctx: Ctx = {
    id, rng, tipo, perfil, data, dAnterior, fundo, reg, base, alfa: base, beta: base, mercado, comunicacoes: [], calc,
    plAnterior, cotaAnterior, qtdAnterior, usados: new Set(), achados: [],
    memoriaDisponivel: chance(rng, 0.6), revelarFonte: chance(rng, 0.5), prazos: prazo, cotaHist,
  };
  return ctx;
}

export const POLITICA_PDD: Record<string, number> = {
  'DC A VENCER': 0.005, 'DC VENC 1-30': 0.05, 'DC VENC 31-60': 0.15, 'DC VENC 61-90': 0.3, 'DC VENC 91-180': 0.6, 'DC VENC >180': 1,
};
export function calcularPDD(p: Posicao): number {
  return r2(p.ativos.filter((a) => a.codigo in POLITICA_PDD).reduce((s, a) => s + a.valor * POLITICA_PDD[a.codigo], 0));
}
export function atualizarPDD(p: Posicao): void {
  const l = p.ativos.find((a) => a.codigo === '(-) PDD');
  if (!l) return;
  const v = calcularPDD(p);
  l.valor = -v;
  l.preco = -v;
}

function precificacaoDoTipo(tipo: TipoFundo): string[] {
  const comum = [
    'Manual de marcação a mercado do administrador (versão simulada vigente).',
    'Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.',
    'Operações compromissadas: PU de ida acrescido da remuneração pactuada.',
  ];
  const extra: Partial<Record<TipoFundo, string[]>> = {
    RF_CP: ['Debêntures: PU pela taxa indicativa ANBIMA de D; na ausência de taxa ANBIMA, preço do comitê de precificação do administrador, revisado no mínimo mensalmente (negócios relevantes no secundário devem ser levados ao comitê).', 'CDB: curva do papel ajustada por spread de crédito do emissor, conforme manual.'],
    INFRA: ['Debêntures incentivadas: PU pela taxa indicativa ANBIMA de D; na ausência, comitê de precificação (revisão mínima mensal; negócios relevantes no secundário devem ser levados ao comitê).'],
    PREV: ['Debêntures: taxa indicativa ANBIMA de D.', 'Ações: preço de fechamento da B3 em D.'],
    FIA: ['Ações: preço de fechamento da B3 em D.', 'Eventos societários (dividendos, JCP, desdobramentos, grupamentos) reconhecidos na data "ex".'],
    FIM_LS: ['Ações: preço de fechamento da B3 em D.', 'Eventos societários reconhecidos na data "ex".', 'Futuros: ajuste diário divulgado pela B3, liquidado em D+1.'],
    FIM_MACRO: ['Ações: preço de fechamento da B3 em D.', 'Futuros (DI1, DOL, IND): ajuste diário divulgado pela B3, reconhecido em D e liquidado em D+1.', 'Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).'],
    CAMBIAL: ['Futuros de dólar: ajuste diário divulgado pela B3, reconhecido em D e liquidado em D+1.', 'Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).'],
    FIC_FIM: ['Cotas de fundos investidos: cota de D divulgada pelo administrador do investido. Se não divulgada até 20h de D, usa-se a última cota disponível e a cota é reprocessada quando a de D for publicada.'],
    FIDC: ['Direitos creditórios: valor presente pela taxa de cessão, conforme relatório do custodiante de D, deduzida a PDD calculada pela política do regulamento.'],
    FII: ['Imóveis: valor justo do laudo de avaliação vigente.', 'LCI: curva do papel.'],
    FIP: ['Participações em companhias fechadas: valor justo do laudo vigente aprovado pelo comitê de investimentos.'],
    IE: ['Cotas de fundos no exterior: NAV oficial mais recente disponível até 18h de D, convertido pela PTAX de venda de D.'],
    EXCLUSIVO: ['Títulos classificados como "mantidos até o vencimento": curva da taxa de aquisição.', 'Demais títulos e debêntures: taxa indicativa ANBIMA de D.'],
    FIAGRO: ['CRA: PU pela taxa indicativa ANBIMA de D; na ausência, comitê de precificação do administrador (revisão mínima mensal; negócios relevantes no secundário devem ser levados ao comitê).', 'LCA: curva do papel.'],
    RF_DI: ['CDB: curva do papel ajustada por spread de crédito do emissor.'],
  };
  return [...comum, ...(extra[tipo] ?? [])];
}

export function resultado(ctx: Ctx, p: Posicao): Resultado {
  return calcular(p, ctx.calc);
}
export { ehDiaUtil };
