// Cenários de divergência. Cada cenário:
//  - preparar(): ajusta a posição CORRETA (base) e o contexto (mercado, comunicações, regulamento);
//  - aplicar(): introduz o erro em um (ou nos dois) lados e devolve os achados que um analista deveria fazer.
// Tudo é simulado.

import type { Ctx, Achado } from './caso.ts';
import { textoTaxa, TABELA_CVM, faixaCVM, atualizarPDD, duTrimestre } from './caso.ts';
import type { Posicao, Ativo, Dimensao, LadoId, Provisao, ParamTaxa } from './modelo.ts';
import { reprecificar, calcular, taxaDiaria } from './modelo.ts';
import type { TipoFundo } from './catalogo.ts';
import {
  r2, entre, inteiro, escolher, chance, fmtR, fmtN, fmtPct, fmtData, somaDias, somaDiasUteis, ehDiaUtil,
  diasUteisNoMes, diaUtilAnterior, proximoUtil, solicitacaoPara, diasUteisEntre, datasComeCotas,
} from './util.ts';
import { prepararComeCotas, resultadoDe } from './come-cotas.ts';

export interface Cenario {
  id: string;
  nome: string;
  dim: Dimensao;
  tipos?: TipoFundo[];
  datas?: string[];
  precisaPerf?: boolean;
  diaPagamento?: boolean; // precisa ser entre o 3º e o 5º dia útil do mês
  ordem?: number;
  aplicavel?: (c: Ctx) => boolean;
  preparar?: (c: Ctx) => void;
  aplicar: (c: Ctx) => Achado[];
}

// ------------------------------------------------------------------ helpers
const ABERTOS: TipoFundo[] = ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIA', 'FIC_FIM', 'PREV', 'CAMBIAL', 'IE', 'EXCLUSIVO', 'INFRA'];
const COM_FUTUROS: TipoFundo[] = ['FIM_MACRO', 'FIM_LS', 'CAMBIAL'];
const COM_ACOES: TipoFundo[] = ['FIA', 'FIM_LS', 'PREV', 'FIM_MACRO'];
const COM_PERF: TipoFundo[] = ['FIM_MACRO', 'FIM_LS', 'FIA', 'FIC_FIM', 'IE', 'RF_CP', 'PREV'];
const COME_COTAS: TipoFundo[] = ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIC_FIM', 'CAMBIAL', 'EXCLUSIVO'];

const outro = (l: LadoId): LadoId => (l === 'Alfa' ? 'Beta' : 'Alfa');
function sortear(c: Ctx, fixo?: LadoId): { errado: Posicao; certo: Posicao; ladoErrado: LadoId; ladoCerto: LadoId } {
  const ladoErrado: LadoId = fixo ?? (chance(c.rng, 0.5) ? 'Alfa' : 'Beta');
  return {
    errado: ladoErrado === 'Alfa' ? c.alfa : c.beta,
    certo: ladoErrado === 'Alfa' ? c.beta : c.alfa,
    ladoErrado,
    ladoCerto: outro(ladoErrado),
  };
}
const ativoLivre = (c: Ctx, f: (a: Ativo) => boolean): Ativo | undefined =>
  c.base.ativos.find((a) => f(a) && !c.usados.has(`ativo:${a.codigo}`));
function usarAtivo(c: Ctx, f: (a: Ativo) => boolean): Ativo {
  const candidatos = c.base.ativos.filter((a) => f(a) && !c.usados.has(`ativo:${a.codigo}`));
  const a = escolher(c.rng, candidatos);
  c.usados.add(`ativo:${a.codigo}`);
  return a;
}
const ativoDe = (p: Posicao, cod: string): Ativo => p.ativos.find((a) => a.codigo === cod)!;
const provDe = (p: Posicao, cod: string): Provisao => p.provisoes.find((x) => x.codigo === cod)!;
function com(c: Ctx, hora: string, de: string, assunto: string, texto: string): void {
  c.comunicacoes.push({ hora, de, assunto, texto });
}
const hora = (c: Ctx, h0: number, h1: number): string => `${String(inteiro(c.rng, h0, h1)).padStart(2, '0')}:${String(inteiro(c.rng, 0, 59)).padStart(2, '0')}`;
const pu6 = (v: number): number => Number(v.toFixed(6));
const casasPreco = (a: Ativo): number => (a.classe === 'Ação' || a.classe === 'Participação' ? 2 : a.classe === 'Cota de fundo' ? 8 : a.classe === 'Ativo no exterior' ? 4 : 6);
const fp = (a: Ativo, v: number): string => fmtN(v, casasPreco(a));
function addItem(lista: { codigo: string; descricao: string; valor: number }[], codigo: string, descricao: string, valor: number): void {
  const i = lista.find((x) => x.codigo === codigo);
  if (i) i.valor = r2(i.valor + valor);
  else lista.push({ codigo, descricao, valor: r2(valor) });
}
function tirarItem(lista: { codigo: string; valor: number }[], codigo: string, valor?: number): void {
  const i = lista.findIndex((x) => x.codigo === codigo);
  if (i < 0) return;
  if (valor === undefined || r2(lista[i].valor - valor) <= 0) lista.splice(i, 1);
  else lista[i].valor = r2(lista[i].valor - valor);
}
const nomeTaxa = (cod: string): string => (cod === 'TXADM' ? 'taxa de administração' : cod === 'TXGES' ? 'taxa de gestão' : 'taxa de custódia');
function usarTaxa(c: Ctx, preferida?: 'TXADM' | 'TXGES'): 'TXADM' | 'TXGES' {
  const ops = (['TXGES', 'TXADM'] as const).filter((t) => !c.usados.has(`prov:${t}`));
  const t = preferida && ops.includes(preferida) ? preferida : ops.length ? escolher(c.rng, ops) : 'TXGES';
  c.usados.add(`prov:${t}`);
  return t;
}
function prazoCotizacao(c: Ctx): { n: number; corridos: boolean } | null {
  const p = c.prazos;
  if (!p || p.cot === 0) return null;
  return { n: p.cot, corridos: p.corridos };
}
function novoCotista(c: Ctx): string {
  return c.tipo === 'EXCLUSIVO' || c.tipo === 'PREV' ? 'Cotista único' : `Cotista ${String(inteiro(c.rng, 1000, 9999))}`;
}
/** Leva `v` para o caixa vendendo o equivalente de um título líquido, para o PL não mudar. */
function reforcarCaixa(c: Ctx, v: number): void {
  c.base.caixa.saldoInicial = r2(c.base.caixa.saldoInicial + v);
  const lft = c.base.ativos.find((x) => x.codigo.startsWith('LFT') || x.codigo.startsWith('COMPROMISSADA'));
  if (lft) { const k = Math.min(lft.quantidade - 1, Math.round(v / lft.preco)); lft.quantidade -= k; lft.valor = r2(lft.quantidade * lft.preco); }
}
function aplicacaoNova(c: Ctx, apos: boolean): { id: string; valor: number; h: string } {
  const corte = Number(c.reg.horarioCorte!.slice(0, 2));
  const h = apos ? `${String(corte).padStart(2, '0')}:${String(inteiro(c.rng, 5, 50)).padStart(2, '0')}` : hora(c, 9, corte - 1);
  const valor = r2(c.plAnterior * entre(c.rng, 0.002, 0.012));
  const id = `APL-${c.base.movs.filter((x) => x.tipo === 'aplicacao').length + 1}`;
  const cotista = novoCotista(c);
  c.base.movs.push({
    id, tipo: 'aplicacao', cotista, valor, recebidoAs: h, solicitadoEm: c.data,
    cotizacao: apos ? proximoUtil(somaDias(c.data, 1)) : c.data, liquidacao: c.data, converterHoje: !apos,
    observacao: apos ? `recursos creditados às ${h}, após o horário de corte (${c.reg.horarioCorte})` : undefined,
  });
  c.base.caixa.lancamentos.push({ historico: `TED recebida — aplicação [${id}] ${cotista} (${h})`, valor });
  addItem(c.base.aPagar, 'APLIC A CONVERTER', 'Aplicações recebidas no dia, a converter em cotas', valor);
  return { id, valor, h };
}

// ======================================================================================
// LIMPOS
// ======================================================================================
const L00: Cenario = {
  id: 'tudo_bate', nome: 'Sem divergência', dim: 'cota',
  aplicar: () => [],
};
const L01: Cenario = {
  id: 'tudo_bate_com_ruido', nome: 'Sem divergência, com comunicações que parecem problema', dim: 'cota',
  aplicar: (c) => {
    const ruidos = [
      () => com(c, hora(c, 16, 18), 'Gestora — mesa', 'Operação para amanhã', `Pessoal, amanhã (${fmtData(somaDiasUteis(c.data, 1))}) vamos zerar parte da posição em LFT. Hoje não tem boleta.`),
      () => com(c, hora(c, 10, 12), 'Custodiante — eventos', 'Aviso de desdobramento', 'Aviso: desdobramento 1:2 de JZEL3 com data "ex" na próxima semana. (Informativo a todos os clientes de custódia.)'),
      () => com(c, hora(c, 17, 19), 'Distribuidor', 'Cota atrasada?', `Bom dia! A cota do ${c.fundo.nome} de ontem saiu mais tarde, está tudo certo? Temos clientes perguntando.`),
      () => com(c, hora(c, 9, 11), 'Área de risco', 'Lembrete', 'Lembrete: o fundo teve apontamento de auditoria em 2025 sobre conciliação de caixa. Atenção redobrada.'),
      () => com(c, hora(c, 14, 16), 'Gestora — operacional', 'Dúvida sobre taxa', 'Vocês conseguem confirmar se a taxa de gestão está sendo apropriada pelo PL do dia anterior? Só para checar.'),
    ];
    for (const f of [...ruidos].sort(() => c.rng() - 0.5).slice(0, 2)) f();
    return [{
      cenario: 'tudo_bate_com_ruido', dimensoes: [], titulo: 'Comunicações do dia não afetam a cota de D',
      ladoCorreto: 'nenhum', ajustePor: 'ninguém', causaRaiz: 'Não há divergência; as mensagens recebidas tratam de eventos futuros, de ativos fora da carteira ou são lembretes.',
      evidencias: ['Comunicações recebidas', 'Carteira dos dois lados'],
      raciocinio: [
        'Li as comunicações do dia e conferi se alguma delas exigia reflexo em D: nenhuma se refere a operação ou evento com efeito na data-base (são eventos futuros, ativos que o fundo não tem, ou dúvidas/lembretes).',
        'Como os dois lados batem linha a linha e as apropriações conferem com o regulamento, não há motivo para segurar a cota.',
      ],
      acao: 'Nenhuma ação sobre a cota. Responder ao remetente, se for o caso.', gravidade: 'informativo',
    }];
  },
};

// ======================================================================================
// COTA / CARTEIRA / PASSIVO
// ======================================================================================
const C01: Cenario = {
  id: 'preco_credito_fonte_errada', nome: 'Debênture/CRA precificado com fonte errada', dim: 'cota',
  tipos: ['RF_CP', 'INFRA', 'PREV', 'EXCLUSIVO', 'FIAGRO'],
  aplicavel: (c) => !!ativoLivre(c, (a) => (a.classe === 'Debênture' || a.classe === 'CRA') && a.fonte.startsWith('ANBIMA')),
  aplicar: (c) => {
    const a = usarAtivo(c, (x) => (x.classe === 'Debênture' || x.classe === 'CRA') && x.fonte.startsWith('ANBIMA'));
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const curva = chance(c.rng, 0.5);
    let novo = curva ? pu6(a.preco * (1 + entre(c.rng, 0.004, 0.025))) : pu6(a.preco * (1 + (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.0008, 0.004)));
    reprecificar(ativoDe(errado, a.codigo), novo, c.revelarFonte ? (curva ? 'Curva — taxa de emissão' : 'ANBIMA — taxa indicativa (arquivo de D−1)') : undefined);
    c.mercado.referencias.push(curva
      ? { ativo: a.codigo, fonte: 'PU par (curva da taxa de emissão) — informativo', valor: fmtN(novo, 6) }
      : { ativo: a.codigo, fonte: 'ANBIMA — PU pela taxa indicativa de D−1', valor: fmtN(novo, 6) });
    const d = r2(a.quantidade * (novo - a.preco));
    return [{
      cenario: 'preco_credito_fonte_errada', dimensoes: ['cota'], titulo: `PU de ${a.codigo} divergente`,
      ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: curva ? `${ladoErrado} precificou ${a.codigo} pela curva de emissão (PU par), e não pela taxa indicativa ANBIMA de D.` : `${ladoErrado} carregou o arquivo ANBIMA de D−1 para ${a.codigo}.`,
      evidencias: [`Carteira — linha ${a.codigo}`, 'Informações de mercado — referências ANBIMA', 'Regulamento — precificação'],
      raciocinio: [
        `A diferença de ativos está concentrada em ${a.codigo}: mesma quantidade (${fmtN(a.quantidade, 0)}) nos dois lados, mas PU ${fp(a, a.preco)} no ${ladoCerto} contra ${fp(a, novo)} no ${ladoErrado}, o que dá ${fmtR(d)} de diferença de valor.`,
        `A referência ANBIMA de D é ${fp(a, a.preco)}, igual ao ${ladoCerto}. O PU do ${ladoErrado} coincide com ${curva ? 'o PU par (curva de emissão)' : 'o PU ANBIMA de D−1'}.`,
        'O regulamento manda precificar pela taxa indicativa ANBIMA do próprio dia, então o lado correto é o que usou a referência de D.',
      ],
      acao: `Pedir ao ${ladoErrado} que reprecifique ${a.codigo} pela taxa indicativa ANBIMA de D (PU ${fp(a, a.preco)}) e recalcule a cota antes da divulgação.`,
    }];
  },
};

const C02: Cenario = {
  id: 'preco_acao_d1', nome: 'Ação com preço de D−1', dim: 'cota', tipos: COM_ACOES,
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Ação'),
  aplicar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Ação');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const varDia = (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.012, 0.06);
    const d1 = r2(a.preco / (1 + varDia));
    reprecificar(ativoDe(errado, a.codigo), d1, c.revelarFonte ? 'B3 — preço de fechamento (D−1)' : undefined);
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'B3 — preço de fechamento de D−1', valor: fmtN(d1, 2) });
    if (chance(c.rng, 0.5)) com(c, hora(c, 18, 19), `${ladoErrado} — sistemas`, 'Instabilidade no feed de preços', 'Tivemos instabilidade na carga de preços de ações entre 18h e 18h40. Alguns papéis podem ter ficado com o preço anterior.');
    return [{
      cenario: 'preco_acao_d1', dimensoes: ['cota'], titulo: `Preço de ${a.codigo} desatualizado`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} manteve o fechamento de D−1 de ${a.codigo} (falha na carga de preços).`,
      evidencias: [`Carteira — linha ${a.codigo}`, 'Informações de mercado — fechamento B3 de D e D−1'],
      raciocinio: [
        `Quantidade igual nos dois lados (${fmtN(a.quantidade, 0)} ações), preço diferente: ${fmtN(a.preco, 2)} (${ladoCerto}) contra ${fmtN(d1, 2)} (${ladoErrado}).`,
        `O fechamento B3 de D é ${fmtN(a.preco, 2)}, e ${fmtN(d1, 2)} é exatamente o fechamento de D−1. O ${ladoErrado} não atualizou o preço do dia.`,
        `Impacto: ${fmtR(a.quantidade * (d1 - a.preco))} no PL do ${ladoErrado}.`,
      ],
      acao: `${ladoErrado} deve recarregar o fechamento de D de ${a.codigo} e reprocessar a cota.`,
    }];
  },
};

const C03: Cenario = {
  id: 'cota_investido_d1', nome: 'Cota de fundo investido de D−1', dim: 'cota', tipos: ['FIC_FIM'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Cota de fundo'),
  aplicar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Cota de fundo');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const v = (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.0015, 0.008);
    const d1 = Number((a.preco / (1 + v)).toFixed(8));
    reprecificar(ativoDe(errado, a.codigo), d1, c.revelarFonte ? 'Última cota disponível no fechamento do processamento' : undefined);
    const ref = c.mercado.referencias.find((r) => r.ativo === a.codigo);
    const h = `19:${String(inteiro(c.rng, 10, 55)).padStart(2, '0')}`;
    if (ref) ref.obs = `divulgada às ${h}`;
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'Cota de D−1 do investido', valor: fmtN(d1, 8) });
    com(c, h, 'Administrador do fundo investido', `Cota de ${fmtData(c.data)} publicada`, `A cota de ${fmtData(c.data)} do ${a.descricao.replace('Cotas do ', '')} foi publicada às ${h}: ${fmtN(a.preco, 8)}.`);
    return [{
      cenario: 'cota_investido_d1', dimensoes: ['cota'], titulo: `Cota do investido ${a.codigo} de D−1`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} fechou o processamento antes da publicação da cota de D do investido (${h}) e usou a cota de D−1.`,
      evidencias: [`Carteira — linha ${a.codigo}`, 'Informações de mercado — cotas do investido', 'Comunicações — publicação da cota', 'Regulamento — precificação de cotas de fundos'],
      raciocinio: [
        `A divergência está em ${a.codigo}: ${fmtN(a.preco, 8)} (${ladoCerto}) contra ${fmtN(d1, 8)} (${ladoErrado}). ${fmtN(d1, 8)} é a cota de D−1 do investido.`,
        `O regulamento só aceita a última cota disponível se a de D não sair até 20h. Ela saiu às ${h}, então tem que ser usada a cota de D.`,
      ],
      acao: `${ladoErrado} deve atualizar a cota de ${a.codigo} para ${fmtN(a.preco, 8)} e reprocessar a cota do FIC.`,
    }];
  },
};

const C04: Cenario = {
  id: 'desdobramento_nao_refletido', nome: 'Desdobramento não refletido na quantidade', dim: 'cota', tipos: ['FIA', 'FIM_LS'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Ação'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Ação');
    a.quantidade = Math.max(4, Math.round(a.quantidade / 4) * 4);
    a.valor = r2(a.quantidade * a.preco);
    c.usados.add(`split:${a.codigo}`);
    c.mercado.eventos.push(`${a.codigo}: desdobramento na proporção 1:4 — ações negociadas "ex-desdobramento" a partir de ${fmtData(c.data)} (cada ação vira 4).`);
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'B3 — fechamento de D−1 (antes do desdobramento)', valor: fmtN(r2(a.preco * 4 * (1 + entre(c.rng, -0.02, 0.02))), 2) });
  },
  aplicar: (c) => {
    const cod = [...c.usados].find((u) => u.startsWith('split:'))!.slice(6);
    const a = ativoDe(c.base, cod);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const e = ativoDe(errado, cod);
    e.quantidade = a.quantidade / 4;
    e.valor = r2(e.quantidade * e.preco);
    return [{
      cenario: 'desdobramento_nao_refletido', dimensoes: ['cota'], titulo: `Desdobramento de ${cod} não aplicado`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} usou o preço ex-desdobramento mas manteve a quantidade antiga de ${cod}.`,
      evidencias: [`Carteira — ${cod} (quantidade)`, 'Informações de mercado — eventos societários'],
      raciocinio: [
        `Em ${cod} o preço é o mesmo nos dois lados (${fmtN(a.preco, 2)}), mas a quantidade é ${fmtN(a.quantidade, 0)} (${ladoCerto}) contra ${fmtN(e.quantidade, 0)} (${ladoErrado}), exatamente 1/4.`,
        `Há evento de desdobramento 1:4 com data "ex" em D. O preço de D já é pós-desdobramento, então a quantidade tem que ser multiplicada por 4.`,
        `Sem o ajuste, o ${ladoErrado} subavalia o ativo em ${fmtR(a.valor - e.valor)}.`,
      ],
      acao: `${ladoErrado} deve processar o evento de desdobramento (quantidade × 4) em ${cod} e reprocessar a cota.`,
    }];
  },
};

const C05: Cenario = {
  id: 'dividendo_ex_nao_provisionado', nome: 'Dividendo com data ex em D não provisionado', dim: 'cota', tipos: ['FIA', 'FIM_LS', 'PREV'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Ação'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Ação');
    const dps = r2(Math.max(0.05, a.preco * entre(c.rng, 0.006, 0.04)));
    addItem(c.base.aReceber, `DIVIDENDOS A RECEBER ${a.codigo}`, `Dividendos a receber — ${a.codigo} (R$ ${fmtN(dps, 2)}/ação)`, r2(a.quantidade * dps));
    c.mercado.eventos.push(`${a.codigo}: dividendos de R$ ${fmtN(dps, 2)} por ação; data-com ${fmtData(c.dAnterior)}; negociação "ex" a partir de ${fmtData(c.data)}; pagamento em ${fmtData(somaDiasUteis(c.data, inteiro(c.rng, 8, 25)))}.`);
    c.usados.add(`div:${a.codigo}`);
  },
  aplicar: (c) => {
    const cod = [...c.usados].find((u) => u.startsWith('div:'))!.slice(4);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const item = c.base.aReceber.find((i) => i.codigo === `DIVIDENDOS A RECEBER ${cod}`)!;
    tirarItem(errado.aReceber, item.codigo);
    return [{
      cenario: 'dividendo_ex_nao_provisionado', dimensoes: ['cota'], titulo: `Dividendos de ${cod} não provisionados`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} precificou ${cod} "ex" mas não registrou os dividendos a receber.`,
      evidencias: ['Valores a receber', 'Informações de mercado — eventos societários', `Carteira — ${cod}`],
      raciocinio: [
        `Os ativos batem, mas o ${ladoCerto} tem ${fmtR(item.valor)} de dividendos a receber de ${cod} que o ${ladoErrado} não tem.`,
        `${cod} ficou "ex" em D: o preço de fechamento já não carrega o dividendo. Se o direito não entra como valor a receber, o fundo perde esse valor no PL.`,
        'O regulamento manda reconhecer o evento na data "ex", então o lado correto é o que provisionou.',
      ],
      acao: `${ladoErrado} deve registrar ${fmtR(item.valor)} de dividendos a receber de ${cod} e reprocessar a cota.`,
    }];
  },
};

const C06: Cenario = {
  id: 'aplicacao_nao_convertida', nome: 'Aplicação recebida antes do corte não convertida', dim: 'cota', tipos: ABERTOS,
  aplicavel: (c) => !!c.reg.horarioCorte,
  preparar: (c) => { const r = aplicacaoNova(c, false); c.usados.add(`apl:${r.id}`); },
  aplicar: (c) => {
    const id = [...c.usados].find((u) => u.startsWith('apl:'))!.slice(4);
    const m = c.base.movs.find((x) => x.id === id)!;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    if (ladoErrado === 'Alfa') {
      errado.movs = errado.movs.filter((x) => x.id !== id);
      errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !l.historico.includes(`[${m.id}]`));
      tirarItem(errado.aPagar, 'APLIC A CONVERTER', m.valor);
      return [{
        cenario: 'aplicacao_nao_convertida', dimensoes: ['cota', 'caixa'], titulo: `Aplicação de ${m.cotista} não capturada`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
        causaRaiz: `O controle do Alfa não capturou a TED de aplicação de ${m.cotista} (${fmtR(m.valor!)}, recebida às ${m.recebidoAs}), então não há crédito em caixa nem conversão de cotas.`,
        evidencias: ['Caixa — lançamentos do dia', 'Movimentações de passivo', 'Quantidade final de cotas'],
        raciocinio: [
          `A cota é igual nos dois lados, mas a quantidade final de cotas e o PL final não são. O caixa do Alfa está ${fmtR(m.valor!)} menor.`,
          `O lançamento faltante é a TED de ${m.cotista} às ${m.recebidoAs}, antes do corte (${c.reg.horarioCorte}). Pelo regulamento, ela converte em D+0.`,
          'Cota igual não basta: o cotista ficaria sem as cotas e o passivo do fundo ficaria errado.',
        ],
        acao: `Alfa deve registrar a entrada de ${fmtR(m.valor!)} e converter a aplicação pela cota de D. Validar o passivo antes de liberar o extrato do cotista.`,
      }];
    }
    errado.movs.find((x) => x.id === id)!.converterHoje = false;
    return [{
      cenario: 'aplicacao_nao_convertida', dimensoes: ['cota'], titulo: `Aplicação de ${m.cotista} não convertida`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `O passivo do Beta recebeu os recursos de ${m.cotista} (${m.recebidoAs}) mas deixou a aplicação para D+1, como se tivesse chegado após o corte.`,
      evidencias: ['Movimentações de passivo', 'Quantidade final de cotas', 'Regulamento — horário de corte'],
      raciocinio: [
        'Cota, caixa e PL-base batem, mas a quantidade final de cotas do Beta é menor e as aplicações a converter continuam abertas.',
        `A TED de ${m.cotista} entrou às ${m.recebidoAs}, antes do corte de ${c.reg.horarioCorte}: pelo regulamento converte em D+0.`,
        `O impacto é no passivo: ${fmtR(m.valor!)} que deveriam ter virado cotas hoje.`,
      ],
      acao: `Beta deve converter a aplicação de ${m.cotista} pela cota de D. Sem isso o passivo não pode ser aprovado.`,
    }];
  },
};

const K02: Cenario = {
  id: 'aplicacao_apos_corte_convertida', nome: 'Aplicação após o corte convertida em D+0', dim: 'cota', tipos: ABERTOS,
  aplicavel: (c) => !!c.reg.horarioCorte,
  preparar: (c) => { const r = aplicacaoNova(c, true); c.usados.add(`aplcorte:${r.id}`); },
  aplicar: (c) => {
    const id = [...c.usados].find((u) => u.startsWith('aplcorte:'))!.slice(9);
    const m = c.base.movs.find((x) => x.id === id)!;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.movs.find((x) => x.id === id)!.converterHoje = true;
    return [{
      cenario: 'aplicacao_apos_corte_convertida', dimensoes: ['cota'], titulo: 'Aplicação recebida após o horário de corte convertida em D', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} converteu em D a aplicação de ${m.cotista} creditada às ${m.recebidoAs}, depois do corte de ${c.reg.horarioCorte}.`,
      evidencias: ['Movimentações de passivo (horário de crédito)', 'Regulamento — horário de corte', 'Quantidade final de cotas'],
      raciocinio: [
        `Cota e PL-base iguais; a quantidade final de cotas do ${ladoErrado} tem ${fmtN(m.valor! / 1, 2)} reais a mais convertidos.`,
        `A aplicação de ${m.cotista} entrou às ${m.recebidoAs}. O corte do regulamento é ${c.reg.horarioCorte}, então ela deve ser convertida com a cota do dia útil seguinte (${fmtData(m.cotizacao)}).`,
        'Converter com a cota de hoje favorece ou prejudica os demais cotistas, conforme a variação de amanhã. É erro de passivo.',
      ],
      acao: `${ladoErrado} deve estornar a conversão e manter os recursos como "aplicação a converter" para ${fmtData(m.cotizacao)}.`,
    }];
  },
};

const C07: Cenario = {
  id: 'resgate_cotizado_antecipadamente', nome: 'Resgate cotizado antes do prazo', dim: 'cota', tipos: ABERTOS.filter((t) => t !== 'RF_DI' && t !== 'CAMBIAL'),
  aplicavel: (c) => prazoCotizacao(c) !== null,
  preparar: (c) => {
    const p = prazoCotizacao(c)!;
    const cz = p.corridos ? proximoUtil(somaDias(c.data, p.n)) : somaDiasUteis(c.data, p.n);
    const cotas = Number((c.qtdAnterior * entre(c.rng, 0.003, 0.02)).toFixed(8));
    c.base.movs.push({ id: 'RSG-NOVO', tipo: 'resgate', cotista: novoCotista(c), cotas, solicitadoEm: c.data, cotizacao: cz, liquidacao: somaDiasUteis(cz, c.prazos!.liq), converterHoje: false, observacao: 'pedido de resgate registrado hoje' });
  },
  aplicar: (c) => {
    const m = c.base.movs.find((x) => x.id === 'RSG-NOVO')!;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.movs.find((x) => x.id === 'RSG-NOVO')!.converterHoje = true;
    return [{
      cenario: 'resgate_cotizado_antecipadamente', dimensoes: ['cota'], titulo: `Resgate de ${m.cotista} cotizado antes da data`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} cotizou em D um pedido feito hoje, cuja cotização pelo regulamento é ${fmtData(m.cotizacao)}.`,
      evidencias: ['Movimentações de passivo', 'Regulamento — prazo de cotização', 'Quantidade final de cotas'],
      raciocinio: [
        `A cota bate, mas o ${ladoErrado} baixou ${fmtN(m.cotas!, 8)} cotas a mais no fechamento.`,
        `O pedido de ${m.cotista} foi feito em ${fmtData(m.solicitadoEm)}. ${c.reg.cotizacao.find((x) => x.startsWith('Resgate'))} Ou seja, a cotização é em ${fmtData(m.cotizacao)}, não hoje.`,
        'Cotizar antes do prazo muda o valor recebido pelo cotista e fere a isonomia com os demais.',
      ],
      acao: `${ladoErrado} deve desfazer a cotização e reagendar o resgate para ${fmtData(m.cotizacao)}.`,
    }];
  },
};

const C08: Cenario = {
  id: 'ptax_errada', nome: 'Conversão cambial com PTAX errada', dim: 'cota', tipos: ['IE'],
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const pt = c.mercado.ptax!;
    const usaD1 = chance(c.rng, 0.6);
    const tx = usaD1 ? pt.vendaD1 : pt.compraD;
    for (const a of errado.ativos.filter((x) => x.moeda === 'USD')) {
      a.cambio = tx;
      a.valor = r2(a.quantidade * a.preco * tx);
      if (c.revelarFonte) a.fonte = usaD1 ? 'NAV × PTAX venda D−1' : 'NAV × PTAX compra D';
    }
    return [{
      cenario: 'ptax_errada', dimensoes: ['cota'], titulo: 'Ativos no exterior convertidos com câmbio errado', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} converteu os ativos em USD pela ${usaD1 ? 'PTAX de venda de D−1' : 'PTAX de compra de D'} (${fmtN(tx, 4)}), e não pela PTAX de venda de D (${fmtN(pt.vendaD, 4)}).`,
      evidencias: ['Carteira — ativos no exterior (câmbio utilizado)', 'Informações de mercado — PTAX', 'Regulamento — precificação no exterior'],
      raciocinio: [
        'A quantidade e o NAV em USD das cotas offshore são iguais nos dois lados; o que muda é o valor em reais.',
        `Dividindo valor por quantidade e NAV, o câmbio implícito é ${fmtN(pt.vendaD, 4)} no ${ladoCerto} e ${fmtN(tx, 4)} no ${ladoErrado}. Esse número bate com a ${usaD1 ? 'PTAX venda de D−1' : 'PTAX compra de D'}.`,
        'O regulamento manda usar a PTAX de venda de D.',
      ],
      acao: `${ladoErrado} deve refazer a conversão com a PTAX venda de D (${fmtN(pt.vendaD, 4)}) e reprocessar a cota.`,
    }];
  },
};

const DATAS_FERIADO_EUA: Record<string, { feriado: string; ultimoNav: string; nome: string }> = {
  '2025-11-28': { feriado: '2025-11-27', ultimoNav: '2025-11-26', nome: 'Thanksgiving' },
  '2026-01-20': { feriado: '2026-01-19', ultimoNav: '2026-01-16', nome: 'Martin Luther King Jr. Day' },
  '2026-05-26': { feriado: '2026-05-25', ultimoNav: '2026-05-22', nome: 'Memorial Day' },
  '2026-06-22': { feriado: '2026-06-19', ultimoNav: '2026-06-18', nome: 'Juneteenth' },
  '2026-07-06': { feriado: '2026-07-03', ultimoNav: '2026-07-02', nome: 'Independence Day (observado)' },
};
const C09: Cenario = {
  id: 'nav_estimado_feriado_eua', nome: 'NAV estimado usado em feriado nos EUA', dim: 'cota', tipos: ['IE'], datas: Object.keys(DATAS_FERIADO_EUA),
  preparar: (c) => {
    const f = DATAS_FERIADO_EUA[c.data];
    c.mercado.referencias = c.mercado.referencias.filter((r) => !r.fonte.startsWith('NAV oficial'));
    for (const a of c.base.ativos.filter((x) => x.moeda === 'USD')) {
      c.mercado.referencias.push({ ativo: a.codigo, fonte: `NAV oficial de ${fmtData(f.ultimoNav)} (último disponível)`, valor: `USD ${fmtN(a.preco, 4)}` });
      c.mercado.referencias.push({ ativo: a.codigo, fonte: `NAV de ${fmtData(f.feriado)}`, valor: 'não divulgado', obs: `mercado americano fechado (${f.nome})` });
      a.fonte = `NAV oficial de ${fmtData(f.ultimoNav)} × PTAX venda D`;
    }
  },
  aplicar: (c) => {
    const f = DATAS_FERIADO_EUA[c.data];
    const a = c.base.ativos.find((x) => x.moeda === 'USD')!;
    const est = Number((a.preco * (1 + (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.004, 0.015))).toFixed(4));
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    reprecificar(ativoDe(errado, a.codigo), est, c.revelarFonte ? 'NAV estimado informado pela gestora' : undefined);
    com(c, '17:12', 'Gestora — operações', 'NAV estimado', `Como ontem foi feriado nos EUA (${f.nome}), segue o NAV ESTIMADO de ${fmtData(f.feriado)} do ${a.descricao.replace('Cotas do ', '')}: USD ${fmtN(est, 4)}. Valor indicativo, o oficial sai só no próximo dia útil americano.`);
    return [{
      cenario: 'nav_estimado_feriado_eua', dimensoes: ['cota'], titulo: `NAV estimado em ${a.codigo}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} usou o NAV estimado enviado pela gestora para ${fmtData(f.feriado)} (feriado nos EUA), e não o último NAV oficial (${fmtData(f.ultimoNav)}).`,
      evidencias: [`Carteira — ${a.codigo}`, 'Informações de mercado — NAV', 'Comunicações — e-mail da gestora', 'Regulamento — NAV oficial'],
      raciocinio: [
        `A diferença está em ${a.codigo}: NAV USD ${fmtN(a.preco, 4)} (${ladoCerto}) contra USD ${fmtN(est, 4)} (${ladoErrado}). Câmbio e quantidade iguais.`,
        `${fmtData(f.feriado)} foi feriado nos EUA (${f.nome}) e não houve NAV oficial. O valor do ${ladoErrado} é o estimado do e-mail da gestora, chamado por ela mesma de "indicativo".`,
        `O regulamento exige o NAV oficial mais recente e veda NAV estimado. O correto é o NAV de ${fmtData(f.ultimoNav)}.`,
      ],
      acao: `${ladoErrado} deve voltar para o NAV oficial de ${fmtData(f.ultimoNav)} e reprocessar. Responder à gestora que valor indicativo não é usado na cota.`,
    }];
  },
};

const C10: Cenario = {
  id: 'ajuste_futuros_errado', nome: 'Ajuste de futuros não registrado ou com quantidade antiga', dim: 'cota', tipos: COM_FUTUROS,
  aplicavel: (c) => c.mercado.futuros.length > 0 && !c.usados.has('futuros'),
  preparar: (c) => {
    c.usados.add('futuros');
    if (chance(c.rng, 0.5)) {
      const f = escolher(c.rng, c.mercado.futuros);
      const delta = Math.max(5, Math.round(Math.abs(f.quantidade) * entre(c.rng, 0.15, 0.5))) * Math.sign(f.quantidade || 1);
      const q0 = f.quantidade - delta;
      com(c, hora(c, 15, 17), 'Gestora — mesa', `Boleta ${f.contrato}`, `Aumentamos a posição em ${f.contrato} hoje: de ${q0} para ${f.quantidade} contratos (operação executada às ${hora(c, 10, 14)}).`);
      c.usados.add(`futq:${f.contrato}:${q0}`);
      return;
    }
    c.usados.add('futfalta');
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const itemBase = [...c.base.aReceber, ...c.base.aPagar].find((i) => i.codigo === 'AJUSTE FUTUROS D')!;
    const sinal = c.base.aReceber.includes(itemBase as never) ? 1 : -1;
    const ajBase = sinal * itemBase.valor;
    const q = [...c.usados].find((u) => u.startsWith('futq:'));
    tirarItem(errado.aReceber, 'AJUSTE FUTUROS D');
    tirarItem(errado.aPagar, 'AJUSTE FUTUROS D');
    if (!q) {
      return [{
        cenario: 'ajuste_futuros_errado', dimensoes: ['cota'], titulo: 'Ajuste diário de futuros não registrado', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
        causaRaiz: `${ladoErrado} não registrou o ajuste diário de D dos contratos futuros (${fmtR(ajBase)}).`,
        evidencias: ['Valores a receber/pagar', 'Informações de mercado — ajustes B3'],
        raciocinio: [
          `A carteira de ativos bate, mas o ${ladoCerto} tem ajuste de futuros de D de ${fmtR(ajBase)} e o ${ladoErrado} não tem nada.`,
          `Recalculei: Σ quantidade × ajuste por contrato = ${c.mercado.futuros.map((f) => `${f.quantidade} × ${fmtN(f.ajustePorContrato, 2)}`).join(' + ')} = ${fmtR(ajBase)}. Bate com o ${ladoCerto}.`,
          'O ajuste de D é reconhecido em D e liquidado em D+1. Sem ele a cota fica errada pelo valor inteiro do ajuste.',
        ],
        acao: `${ladoErrado} deve registrar o ajuste de D (${fmtR(ajBase)}) e reprocessar a cota.`,
      }];
    }
    const [, contrato, q0s] = q.split(':');
    const f = c.mercado.futuros.find((x) => x.contrato === contrato)!;
    const ajErrado = r2(ajBase - (f.quantidade - Number(q0s)) * f.ajustePorContrato);
    if (ajErrado >= 0) errado.aReceber.push({ codigo: 'AJUSTE FUTUROS D', descricao: 'Ajuste diário de futuros de D (liquidação em D+1)', valor: ajErrado });
    else errado.aPagar.push({ codigo: 'AJUSTE FUTUROS D', descricao: 'Ajuste diário de futuros de D (liquidação em D+1)', valor: -ajErrado });
    return [{
      cenario: 'ajuste_futuros_errado', dimensoes: ['cota'], titulo: `Ajuste de ${contrato} calculado com a posição antiga`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não processou a boleta do dia em ${contrato} e calculou o ajuste com ${q0s} contratos, em vez de ${f.quantidade}.`,
      evidencias: ['Valores a receber/pagar — ajuste de futuros', 'Informações de mercado — posição e ajuste por contrato', 'Comunicações — boleta da gestora'],
      raciocinio: [
        `Ajuste de futuros de D: ${fmtR(ajBase)} (${ladoCerto}) contra ${fmtR(ajErrado)} (${ladoErrado}). A diferença (${fmtR(ajBase - ajErrado)}) dividida pelo ajuste por contrato de ${contrato} (${fmtN(f.ajustePorContrato, 2)}) dá exatamente ${f.quantidade - Number(q0s)} contratos.`,
        `A gestora informou o aumento de ${q0s} para ${f.quantidade} contratos em ${contrato}, operação executada hoje. O ${ladoErrado} ficou com a posição antiga.`,
      ],
      acao: `${ladoErrado} deve incluir a operação de ${contrato}, recalcular o ajuste (${fmtR(ajBase)}) e reprocessar.`,
    }];
  },
};

const C11: Cenario = {
  id: 'ativo_vencido_nao_baixado', nome: 'Ativo vencido mantido na carteira', dim: 'caixa', tipos: ['RF_DI', 'RF_CP', 'EXCLUSIVO'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'CDB'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'CDB');
    c.base.ativos = c.base.ativos.filter((x) => x.codigo !== a.codigo);
    c.base.caixa.lancamentos.push({ historico: `Resgate no vencimento — ${a.codigo} (liquidação B3)`, valor: a.valor });
    c.mercado.eventos.push(`${a.codigo}: vencimento em ${fmtData(c.data)}; valor de resgate ${fmtN(a.preco, 6)} por título; liquidação financeira em D.`);
    c.usados.add(`venc:${JSON.stringify(a)}`);
  },
  aplicar: (c) => {
    const a = JSON.parse([...c.usados].find((u) => u.startsWith('venc:'))!.slice(5)) as Ativo;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const puD1 = pu6(a.preco / (1 + (Math.pow(1 + c.mercado.cdiAA, 1 / 252) - 1) * 1.08));
    errado.ativos.push({ ...a, preco: puD1, valor: r2(a.quantidade * puD1), fonte: c.revelarFonte ? 'Último PU calculado (D−1)' : a.fonte });
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !l.historico.includes(a.codigo));
    return [{
      cenario: 'ativo_vencido_nao_baixado', dimensoes: ['caixa', 'cota'], titulo: `${a.codigo} vencido não baixado`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} manteve ${a.codigo} na carteira pelo PU de D−1 e não registrou o crédito do vencimento.`,
      evidencias: ['Carteira', 'Caixa — lançamentos', 'Informações de mercado — eventos'],
      raciocinio: [
        `O ${ladoErrado} tem ${a.codigo} (${fmtR(a.quantidade * puD1)}) que não aparece no ${ladoCerto}, e o caixa do ${ladoCerto} tem ${fmtR(a.valor)} a mais. Parece só um problema de classificação, mas não é.`,
        `O título venceu hoje com resgate de ${fmtN(a.preco, 6)} por unidade. O ${ladoErrado} manteve o PU de D−1 (${fmtN(puD1, 6)}), deixando de reconhecer o último dia de rendimento: ${fmtR(a.valor - a.quantidade * puD1)} no PL.`,
        'Além da cota, o caixa projetado do lado errado subestima a disponibilidade, o que pode atrapalhar a liquidação de resgates.',
      ],
      acao: `${ladoErrado} deve baixar ${a.codigo}, registrar o crédito de ${fmtR(a.valor)} e reprocessar a cota.`,
    }];
  },
};

const C12: Cenario = {
  id: 'curva_vs_mercado_exclusivo', nome: 'Título mantido até o vencimento marcado a mercado', dim: 'cota', tipos: ['EXCLUSIVO'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Título público' && a.fonte.startsWith('Curva')),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Título público' && x.fonte.startsWith('Curva'));
    const mtm = pu6(a.preco * (1 + (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.008, 0.035)));
    c.mercado.referencias = c.mercado.referencias.filter((r) => r.ativo !== a.codigo);
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'ANBIMA — PU pela taxa indicativa de D (referência de mercado)', valor: fmtN(mtm, 6) });
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'PU na curva da taxa de aquisição (6,12% a.a.) — cálculo do custodiante', valor: fmtN(a.preco, 6) });
    c.reg.especificos.push(`Títulos classificados como mantidos até o vencimento (declaração escrita do cotista, anexa ao regulamento): ${a.codigo}.`);
    c.usados.add(`mtm:${a.codigo}:${mtm}`);
  },
  aplicar: (c) => {
    const [, cod, mtms] = [...c.usados].find((u) => u.startsWith('mtm:'))!.split(':');
    const mtm = Number(mtms);
    const a = ativoDe(c.base, cod);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    reprecificar(ativoDe(errado, cod), mtm, c.revelarFonte ? 'ANBIMA — taxa indicativa D' : undefined);
    return [{
      cenario: 'curva_vs_mercado_exclusivo', dimensoes: ['cota'], titulo: `${cod} marcado a mercado em vez da curva`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} aplicou a regra geral (ANBIMA) a um título que o regulamento classifica como "mantido até o vencimento".`,
      evidencias: [`Carteira — ${cod}`, 'Regulamento — classe exclusiva / títulos mantidos até o vencimento', 'Informações de mercado — PU ANBIMA e PU curva'],
      raciocinio: [
        `${cod}: PU ${fmtN(a.preco, 6)} (${ladoCerto}) contra ${fmtN(mtm, 6)} (${ladoErrado}).`,
        `O PU do ${ladoErrado} é o ANBIMA de D, o que à primeira vista parece "o certo". Mas o regulamento desta classe exclusiva classifica o título como mantido até o vencimento, com marcação na curva da taxa de aquisição.`,
        `O PU de curva informado (${fmtN(a.preco, 6)}) bate com o ${ladoCerto}. A referência ANBIMA aqui serve só como informação.`,
      ],
      acao: `${ladoErrado} deve voltar ${cod} para a curva de aquisição e reprocessar. Rever a parametrização do ativo como "mantido até o vencimento" para que o erro não se repita.`,
    }];
  },
};

const C13: Cenario = {
  id: 'come_cotas_nao_aplicado', nome: 'Come-cotas não aplicado', dim: 'cota', tipos: COME_COTAS, datas: datasComeCotas([2025, 2026]),
  preparar: (c) => prepararComeCotas(c),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, aplicar: false };
    const rc = resultadoDe(c, certo);
    const cc = certo.comeCotas!;
    return [{
      cenario: 'come_cotas_nao_aplicado', dimensoes: ['cota'], titulo: 'Come-cotas não processado', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não processou o come-cotas de ${fmtData(c.data)}.`,
      evidencias: ['Come-cotas (posição por cotista)', 'Quantidade final de cotas', 'Regulamento — come-cotas', 'Comunicações — passivo'],
      raciocinio: [
        `A cota é igual, mas a quantidade final de cotas do ${ladoErrado} é ${fmtN(rc.cotasComeCotas, 8)} cotas maior: ele não retirou cotas nem calculou IR (${fmtR(rc.irComeCotas)} no ${ladoCerto}).`,
        `Hoje é o penúltimo dia útil de ${c.data.slice(5, 7) === '05' ? 'maio' : 'novembro'}, dia de come-cotas pelo regulamento. Recalculei posição a posição (ganho = (cota de D − cota de referência) × cotas; IR = ${fmtPct(cc.aliquota, 0)} × ganho; cotas retiradas = IR ÷ cota de D): o total bate com o ${ladoCerto}.`,
        'Sem o come-cotas o IR não é retido no prazo e as posições dos cotistas ficam erradas.',
      ],
      acao: `${ladoErrado} deve processar o come-cotas (retirada de cotas e IR a recolher) antes de fechar o passivo.`,
    }];
  },
};

const C14: Cenario = {
  id: 'arredondamento_vs_truncamento', nome: 'Cota arredondada em vez de truncada', dim: 'cota',
  ordem: 99,
  preparar: (c) => {
    for (let i = 0; i < 6; i++) {
      const r = calcular(c.base, c.calc);
      const bruta = r.plBase / c.base.qtdCotasBase;
      const frac = (bruta * 1e8) % 1;
      if (frac >= 0.55 && frac <= 0.95) break;
      c.base.caixa.saldoInicial = r2(c.base.caixa.saldoInicial + (0.75 - frac) * 1e-8 * c.base.qtdCotasBase);
    }
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.arredondamento = 'arredondamento';
    return [{
      cenario: 'arredondamento_vs_truncamento', dimensoes: ['cota'], titulo: 'Diferença de 1 na 8ª casa da cota', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} arredondou a cota na 8ª casa; o regulamento manda truncar.`,
      evidencias: ['Cota dos dois lados', 'PL e quantidade de cotas', 'Regulamento — casas decimais'],
      raciocinio: [
        'PL, quantidade de cotas e todos os componentes batem; a diferença está só na 8ª casa (0,00000001).',
        'PL ÷ quantidade tem 9ª casa ≥ 5: arredondando, sobe 1 na 8ª casa; truncando, não. O regulamento diz truncamento.',
        'O impacto financeiro é irrelevante, mas a cota oficial precisa seguir o regulamento e a parametrização tem que ser corrigida para não repetir.',
      ],
      acao: `${ladoErrado} deve ajustar a parametrização para truncamento e republicar a cota de D com 8 casas truncadas.`,
    }];
  },
};

const C15: Cenario = {
  id: 'erros_que_se_compensam', nome: 'Dois erros que se compensam (cota bate por coincidência)', dim: 'provisoes',
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Título público' || a.classe === 'Debênture' || a.classe === 'CRA') && !c.usados.has('prov:AUDIT'),
  aplicar: (c) => {
    c.usados.add('prov:AUDIT');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const pa = provDe(errado, 'AUDIT');
    const regra = pa.regra as { tipo: 'fixo'; valorPeriodo: number; periodo: 'anual'; diasPeriodo: number };
    const antigo = regra.valorPeriodo;
    const novo = Math.round((antigo * entre(c.rng, 1.6, 2.6)) / 1000) * 1000;
    regra.valorPeriodo = novo;
    const dProv = r2(novo / 252) - r2(antigo / 252);
    com(c, hora(c, 9, 12), 'Auditoria independente', 'Proposta de renovação', `Segue a proposta de renovação do contrato de auditoria: R$ ${fmtN(novo, 2)}/ano, com vigência a partir de janeiro do próximo ano, se aprovada. Ainda não assinada.`);
    const a = usarAtivo(c, (x) => (x.classe === 'Título público' || x.classe === 'Debênture' || x.classe === 'CRA') && x.quantidade >= 50);
    const novoPreco = pu6(a.preco + dProv / a.quantidade);
    reprecificar(ativoDe(errado, a.codigo), novoPreco);
    const dAtivo = r2(a.quantidade * novoPreco) - a.valor;
    const base = {
      ladoCorreto: ladoCerto as LadoId, ajustePor: ladoErrado, gravidade: 'erro' as const,
    };
    return [
      {
        ...base, cenario: 'erros_que_se_compensam', dimensoes: ['provisoes'], titulo: 'Provisão de auditoria com valor de proposta não assinada',
        causaRaiz: `${ladoErrado} passou a provisionar a auditoria por R$ ${fmtN(novo, 2)}/ano (proposta ainda não assinada, para o ano que vem) em vez de R$ ${fmtN(antigo, 2)}.`,
        evidencias: ['Provisões — auditoria', 'Regulamento/contrato — despesas fixas', 'Comunicações — proposta da auditoria'],
        raciocinio: [
          `A cota bate (ou quase), então seria fácil aprovar direto. Mas comparando linha a linha, a apropriação de auditoria do ${ladoErrado} é ${fmtR(novo / 252)}/dia contra ${fmtR(antigo / 252)}/dia do ${ladoCerto}.`,
          `O contrato vigente é de R$ ${fmtN(antigo, 2)}/ano. O valor novo vem de uma proposta não assinada, válida só para o ano que vem.`,
        ],
        acao: `${ladoErrado} deve voltar a apropriação de auditoria para R$ ${fmtN(antigo, 2)}/ano.`,
      },
      {
        ...base, cenario: 'erros_que_se_compensam', dimensoes: ['cota'], titulo: `PU de ${a.codigo} diferente da referência`,
        causaRaiz: `${ladoErrado} usou PU ${fmtN(novoPreco, 6)} para ${a.codigo}; a referência de D é ${fmtN(a.preco, 6)}.`,
        evidencias: [`Carteira — ${a.codigo}`, 'Informações de mercado — referências'],
        raciocinio: [
          `Em ${a.codigo}, o ${ladoErrado} tem ${fmtR(dAtivo)} a mais de valor, praticamente o mesmo montante da provisão a maior (${fmtR(dProv)}). Por isso a cota parece bater.`,
          'São dois erros independentes que se anulam hoje. Amanhã a provisão continua acumulando e o preço pode não compensar mais. Componente errado não se aprova, mesmo com a cota igual.',
        ],
        acao: `${ladoErrado} deve reprecificar ${a.codigo} pela referência de D (${fmtN(a.preco, 6)}), corrigir a provisão e reenviar a posição antes da divulgação.`,
      },
    ];
  },
};

const C16: Cenario = {
  id: 'pdd_aging_desatualizado', nome: 'PDD com aging desatualizado', dim: 'cota', tipos: ['FIDC'],
  preparar: (c) => {
    const de = ativoDe(c.base, 'DC VENC 61-90');
    const para = ativoDe(c.base, 'DC VENC 91-180');
    const m = r2(de.valor * entre(c.rng, 0.3, 0.8));
    de.valor = r2(de.valor - m); de.quantidade = de.valor;
    para.valor = r2(para.valor + m); para.quantidade = para.valor;
    atualizarPDD(c.base);
    c.usados.add(`pdd:${m}`);
    com(c, '07:55', 'Custodiante — relatório de aging', `Aging de ${fmtData(c.data)}`, `Mudanças de faixa hoje: sacado Comercial Boa Safra Ltda. — R$ ${fmtN(m, 2)} passaram de 90 para 91 dias de atraso (faixa 61–90 → 91–180).`);
  },
  aplicar: (c) => {
    const m = Number([...c.usados].find((u) => u.startsWith('pdd:'))!.slice(4));
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const de = ativoDe(errado, 'DC VENC 61-90');
    const para = ativoDe(errado, 'DC VENC 91-180');
    de.valor = r2(de.valor + m); de.quantidade = de.valor;
    para.valor = r2(para.valor - m); para.quantidade = para.valor;
    atualizarPDD(errado);
    return [{
      cenario: 'pdd_aging_desatualizado', dimensoes: ['cota'], titulo: 'PDD calculada com aging de D−1', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não migrou R$ ${fmtN(m, 2)} da faixa 61–90 para 91–180 dias, como mostra o aging de D, e calculou a PDD com 30% em vez de 60% sobre esse valor.`,
      evidencias: ['Carteira — faixas de direitos creditórios e linha de PDD', 'Comunicações — relatório de aging', 'Regulamento — política de perdas'],
      raciocinio: [
        `O total de direitos creditórios é igual nos dois lados, mas a distribuição por faixa não: o ${ladoErrado} tem R$ ${fmtN(m, 2)} a mais em 61–90 e a menos em 91–180.`,
        `O aging do custodiante de D mostra que esse valor passou para 91 dias hoje. Pela política, a PDD sobe de 30% para 60% sobre ele: ${fmtR(m * 0.3)} a mais de provisão.`,
        `O ${ladoErrado} está com PL maior do que deveria. Num FIDC, PDD a menor é o erro mais sensível, porque superavalia a classe.`,
      ],
      acao: `${ladoErrado} deve reprocessar com o aging de D e recalcular a PDD antes da divulgação.`,
    }];
  },
};

const C17: Cenario = {
  id: 'amortizacao_nao_registrada', nome: 'Amortização de cotas paga e não registrada', dim: 'caixa', tipos: ['FIDC', 'FIP'],
  preparar: (c) => {
    const a = r2(c.cotaAnterior * entre(c.rng, 0.006, 0.03));
    const total = r2(a * c.base.qtdCotasBase);
    c.base.caixa.saldoInicial = r2(c.base.caixa.saldoInicial + total);
    const lft = c.base.ativos.find((x) => x.codigo.startsWith('LFT'));
    if (lft) { const n = Math.min(lft.quantidade - 1, Math.round(total / lft.preco)); lft.quantidade -= n; lft.valor = r2(lft.quantidade * lft.preco); }
    c.base.caixa.lancamentos.push({ historico: `Pagamento de amortização de cotas — R$ ${fmtN(a, 2)} por cota`, valor: -total });
    com(c, '08:10', 'Administrador — comunicado ao mercado', 'Amortização', `Comunicamos o pagamento, em ${fmtData(c.data)}, de amortização de R$ ${fmtN(a, 2)} por cota${c.tipo === 'FIDC' ? ', conforme cronograma do suplemento' : ', conforme deliberação do gestor após o desinvestimento parcial'}.`);
    c.usados.add(`amort:${a}:${total}`);
  },
  aplicar: (c) => {
    const [, as, ts] = [...c.usados].find((u) => u.startsWith('amort:'))!.split(':');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !l.historico.startsWith('Pagamento de amortização'));
    return [{
      cenario: 'amortizacao_nao_registrada', dimensoes: ['caixa', 'cota'], titulo: 'Amortização não deduzida', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não registrou o pagamento de amortização de R$ ${fmtN(Number(as), 2)}/cota (${fmtR(Number(ts))}).`,
      evidencias: ['Caixa — lançamentos', 'Comunicações — aviso de amortização', 'Regulamento — amortizações'],
      raciocinio: [
        `Caixa do ${ladoErrado} ${fmtR(Number(ts))} maior. A diferença de cota é de aproximadamente R$ ${fmtN(Number(as), 2)}, exatamente o valor amortizado por cota.`,
        'Houve amortização hoje (comunicado ao mercado). O valor sai do PL na data do pagamento, então a cota de D tem que vir "ex-amortização".',
        `A queda de cota em relação a D−1 no ${ladoCerto} não é perda: é a amortização.`,
      ],
      acao: `${ladoErrado} deve registrar a saída de caixa da amortização e reprocessar a cota.`,
    }];
  },
};

const C18: Cenario = {
  id: 'rendimento_nao_provisionado', nome: 'Rendimento anunciado não provisionado', dim: 'provisoes', tipos: ['FII', 'FIAGRO'],
  preparar: (c) => {
    const x = r2(c.cotaAnterior * entre(c.rng, 0.006, 0.011));
    const total = r2(x * c.base.qtdCotasBase);
    c.base.aPagar.push({ codigo: 'RENDIMENTOS A DISTRIBUIR', descricao: `Rendimentos anunciados (R$ ${fmtN(x, 2)}/cota)`, valor: total });
    com(c, '18:05', 'Administrador — aviso aos cotistas', 'Anúncio de rendimentos', `Rendimento de R$ ${fmtN(x, 2)} por cota; data-com ${fmtData(c.data)}; pagamento em ${fmtData(somaDiasUteis(c.data, 10))}.`);
    c.usados.add(`rend:${x}:${total}`);
  },
  aplicar: (c) => {
    const [, xs, ts] = [...c.usados].find((u) => u.startsWith('rend:'))!.split(':');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    tirarItem(errado.aPagar, 'RENDIMENTOS A DISTRIBUIR');
    return [{
      cenario: 'rendimento_nao_provisionado', dimensoes: ['provisoes', 'cota'], titulo: 'Rendimentos anunciados fora do passivo', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não reconheceu os rendimentos anunciados hoje (R$ ${fmtN(Number(xs), 2)}/cota, ${fmtR(Number(ts))}).`,
      evidencias: ['Valores a pagar', 'Comunicações — aviso de rendimentos', 'Regulamento — política de distribuição'],
      raciocinio: [
        `O ${ladoCerto} tem ${fmtR(Number(ts))} de "rendimentos a distribuir" que o ${ladoErrado} não tem. O valor corresponde ao rendimento de R$ ${fmtN(Number(xs), 2)} por cota anunciado no aviso.`,
        'O regulamento manda reconhecer o rendimento anunciado no passivo na data-com, que é hoje (aviso das 18:05). É fato de D e entra na cota de D.',
      ],
      acao: `${ladoErrado} deve registrar os rendimentos a distribuir e reprocessar a cota patrimonial.`,
    }];
  },
};

const C20: Cenario = {
  id: 'laudo_fip_nao_atualizado', nome: 'Novo laudo aprovado não refletido', dim: 'cota', tipos: ['FIP'],
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Participação');
    const p0 = a.preco;
    let v = entre(c.rng, -0.15, 0.25);
    if (Math.abs(v) < 0.03) v = 0.06;
    const p1 = r2(p0 * (1 + v));
    reprecificar(a, p1, `Valor justo — laudo aprovado em ${fmtData(c.data)}`);
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'Laudo anterior (vigente até D−1)', valor: fmtN(p0, 2) });
    c.mercado.referencias.push({ ativo: a.codigo, fonte: `Laudo novo — aprovado pelo comitê em ${fmtData(c.data)}`, valor: fmtN(p1, 2) });
    com(c, '16:30', 'Gestora — comitê de investimentos', 'Ata do comitê', `O comitê aprovou hoje o laudo de avaliação de ${a.descricao.replace('Ações da ', '')}: novo valor justo de R$ ${fmtN(p1, 2)} por ação (antes R$ ${fmtN(p0, 2)}). Ata assinada em anexo.`);
    c.usados.add(`laudo:${a.codigo}:${p0}`);
  },
  aplicar: (c) => {
    const [, cod, p0s] = [...c.usados].find((u) => u.startsWith('laudo:'))!.split(':');
    const a = ativoDe(c.base, cod);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    reprecificar(ativoDe(errado, cod), Number(p0s), c.revelarFonte ? 'Valor justo — laudo anterior' : undefined);
    return [{
      cenario: 'laudo_fip_nao_atualizado', dimensoes: ['cota'], titulo: `Valor justo de ${cod} desatualizado`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} manteve o laudo anterior (R$ ${fmtN(Number(p0s), 2)}) mesmo com o novo aprovado pelo comitê hoje (R$ ${fmtN(a.preco, 2)}).`,
      evidencias: [`Carteira — ${cod}`, 'Comunicações — ata do comitê', 'Regulamento — valor justo'],
      raciocinio: [
        `${cod}: R$ ${fmtN(a.preco, 2)} (${ladoCerto}) contra R$ ${fmtN(Number(p0s), 2)} (${ladoErrado}), mesma quantidade. Impacto: ${fmtR(a.quantidade * (a.preco - Number(p0s)))}.`,
        'O regulamento manda atualizar o valor justo na data de aprovação do laudo pelo comitê. A ata é de hoje.',
      ],
      acao: `${ladoErrado} deve aplicar o novo laudo e reprocessar. Arquivar a ata como suporte da variação da cota.`,
    }];
  },
};

const C21: Cenario = {
  id: 'integralizacao_nao_convertida', nome: 'Integralização de chamada de capital não convertida', dim: 'caixa', tipos: ['FIP'],
  preparar: (c) => {
    const v = r2(c.plAnterior * entre(c.rng, 0.02, 0.06));
    const k = inteiro(c.rng, 2, 6);
    c.base.movs.push({ id: 'INT-1', tipo: 'integralizacao', cotista: 'Investidores (chamada de capital)', valor: v, recebidoAs: '11:20', solicitadoEm: somaDiasUteis(c.data, -8), cotizacao: c.data, liquidacao: c.data, converterHoje: true, observacao: `${k}ª chamada de capital — vencimento hoje` });
    c.base.caixa.lancamentos.push({ historico: `Integralizações recebidas — ${k}ª chamada de capital`, valor: v });
    addItem(c.base.aPagar, 'APLIC A CONVERTER', 'Integralizações recebidas no dia, a converter em cotas', v);
    com(c, '08:00', 'Administrador', `${k}ª chamada de capital`, `Lembrete: vence hoje a ${k}ª chamada de capital, no total de ${fmtR(v)}.`);
  },
  aplicar: (c) => {
    const m = c.base.movs.find((x) => x.id === 'INT-1')!;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    if (ladoErrado === 'Alfa') {
      errado.movs = errado.movs.filter((x) => x.id !== 'INT-1');
      errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !l.historico.startsWith('Integralizações'));
      tirarItem(errado.aPagar, 'APLIC A CONVERTER', m.valor);
    } else {
      errado.movs.find((x) => x.id === 'INT-1')!.converterHoje = false;
    }
    return [{
      cenario: 'integralizacao_nao_convertida', dimensoes: ladoErrado === 'Alfa' ? ['caixa', 'cota'] : ['cota'], titulo: 'Integralização da chamada de capital não convertida', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: ladoErrado === 'Alfa' ? 'O controle Alfa não registrou o recebimento das integralizações nem emitiu as cotas.' : 'O Beta recebeu os recursos mas não converteu as integralizações em cotas.',
      evidencias: ['Caixa', 'Movimentações de passivo', 'Quantidade final de cotas', 'Regulamento — chamadas de capital'],
      raciocinio: [
        `A cota bate, mas a quantidade final de cotas do ${ladoErrado} é menor${ladoErrado === 'Alfa' ? ' e o caixa também' : ''}.`,
        `Venceu hoje a chamada de capital de ${fmtR(m.valor!)}. Pelo regulamento, a integralização converte pela cota de fechamento do dia do crédito.`,
      ],
      acao: `${ladoErrado} deve registrar e converter a integralização pela cota de D.`,
    }];
  },
};

const C22: Cenario = {
  id: 'ativo_iliquido_sem_referencia', nome: 'Ativo sem referência ANBIMA com preços divergentes', dim: 'cota', tipos: ['RF_CP', 'INFRA', 'FIAGRO'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Debênture' || a.classe === 'CRA'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Debênture' || x.classe === 'CRA');
    const dataComite = somaDias(c.data, -inteiro(c.rng, 38, 60));
    a.fonte = `Comitê de precificação (ata de ${fmtData(dataComite)})`;
    const pn = pu6(a.preco * (1 - entre(c.rng, 0.01, 0.04)));
    c.mercado.referencias = c.mercado.referencias.filter((r) => r.ativo !== a.codigo);
    c.mercado.referencias.push({ ativo: a.codigo, fonte: 'ANBIMA', valor: 'sem taxa indicativa divulgada para o ativo' });
    c.mercado.referencias.push({ ativo: a.codigo, fonte: `Comitê de precificação (ata de ${fmtData(dataComite)})`, valor: fmtN(a.preco, 6) });
    const dn = somaDiasUteis(c.data, -inteiro(c.rng, 1, 4));
    c.mercado.referencias.push({ ativo: a.codigo, fonte: `B3 — último negócio no secundário (${fmtData(dn)})`, valor: fmtN(pn, 6), obs: `volume de R$ ${fmtN(Math.round((a.valor * entre(c.rng, 0.06, 0.2)) / 1000) * 1000, 2)}` });
    c.usados.add(`iliq:${a.codigo}:${pn}:${dataComite}`);
  },
  aplicar: (c) => {
    const [, cod, pns, dc] = [...c.usados].find((u) => u.startsWith('iliq:'))!.split(':');
    const a = ativoDe(c.base, cod);
    reprecificar(ativoDe(c.beta, cod), Number(pns), 'Último negócio B3');
    return [{
      cenario: 'ativo_iliquido_sem_referencia', dimensoes: ['cota'], titulo: `${cod} sem referência confiável de preço`, ladoCorreto: 'indeterminado', ajustePor: 'Comitê de precificação (Alfa) com apoio do Beta',
      causaRaiz: `Sem taxa ANBIMA para ${cod}: o Alfa usa o preço do comitê de ${fmtData(dc)} (vencido, com mais de 30 dias) e o Beta usa o último negócio no secundário. Nenhum dos dois segue o manual de forma limpa.`,
      evidencias: [`Carteira — ${cod}`, 'Informações de mercado — comitê e negócio B3', 'Regulamento — precificação na ausência de ANBIMA'],
      raciocinio: [
        `${cod}: PU ${fmtN(a.preco, 6)} (Alfa, comitê) contra ${fmtN(Number(pns), 6)} (Beta, negócio B3). Impacto de ${fmtR(a.quantidade * (Number(pns) - a.preco))} no PL.`,
        `O manual manda usar o preço do comitê na falta de ANBIMA, mas exige revisão ao menos mensal e manda levar ao comitê os negócios relevantes. A ata é de ${fmtData(dc)}, ou seja, vencida, e houve negócio recente.`,
        'Não dá para afirmar qual preço está certo só com o que recebi: é decisão do comitê de precificação. Não é o caso de escolher um lado.',
      ],
      acao: `Escalar para o comitê de precificação hoje: revisão extraordinária do PU de ${cod} com base no negócio de B3. Segurar a divulgação até a definição, ou divulgar com o preço vigente do comitê e registrar formalmente o risco de reprocessamento, conforme a política da área.`,
      gravidade: 'pendencia',
    }];
  },
};

const C23: Cenario = {
  id: 'boleta_tardia_nao_processada', nome: 'Venda de título informada após o corte não processada', dim: 'caixa',
  tipos: ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'EXCLUSIVO', 'PREV', 'CAMBIAL'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.codigo.startsWith('LFT') && a.quantidade >= 20),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.codigo.startsWith('LFT') && x.quantidade >= 20);
    const n = Math.max(5, Math.round(a.quantidade * entre(c.rng, 0.08, 0.3)));
    let pt = pu6(a.preco * (1 + (chance(c.rng, 0.5) ? 1 : -1) * entre(c.rng, 0.00005, 0.0004)));
    if (pt === a.preco) pt = pu6(a.preco + 0.35);
    a.quantidade -= n; a.valor = r2(a.quantidade * a.preco);
    const v = r2(n * pt);
    c.base.caixa.lancamentos.push({ historico: `Venda definitiva de ${n} ${a.codigo} @ ${fmtN(pt, 6)} (liquidação SELIC D+0)`, valor: v });
    const h = hora(c, 18, 19);
    com(c, h, 'Gestora — mesa', 'Boleta (atrasada, desculpem)', `Segue boleta de hoje: VENDA de ${n} ${a.codigo} @ ${fmtN(pt, 6)}, executada às ${hora(c, 14, 15)}, contraparte confirmada no SELIC.`);
    c.usados.add(`boleta:${a.codigo}:${n}:${pt}:${h}`);
  },
  aplicar: (c) => {
    const [, cod, ns, pts, ...hs] = [...c.usados].find((u) => u.startsWith('boleta:'))!.split(':');
    const h = hs.join(':');
    const n = Number(ns); const pt = Number(pts);
    const { errado, ladoErrado, ladoCerto } = sortear(c, chance(c.rng, 0.75) ? 'Beta' : 'Alfa');
    const e = ativoDe(errado, cod);
    e.quantidade += n; e.valor = r2(e.quantidade * e.preco);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !l.historico.startsWith(`Venda definitiva de ${n} ${cod}`));
    const a = ativoDe(c.base, cod);
    return [{
      cenario: 'boleta_tardia_nao_processada', dimensoes: ['caixa', 'cota'], titulo: `Venda de ${cod} não processada`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não processou a venda de ${n} ${cod}, informada pela gestora às ${h} (depois do corte operacional), embora executada e liquidada em D.`,
      evidencias: [`Carteira — ${cod} (quantidade)`, 'Caixa — lançamentos', 'Comunicações — boleta da gestora'],
      raciocinio: [
        `O ${ladoErrado} tem ${n} ${cod} a mais e ${fmtR(n * pt)} a menos de caixa. As duas diferenças quase se anulam, sobra ${fmtR(n * (a.preco - pt))} no PL (preço de fechamento menos preço da operação).`,
        `A boleta chegou tarde, mas a operação foi executada e liquidada em D, com confirmação no SELIC. Fato econômico de D entra na cota de D.`,
        'O PL quase bate, mas a carteira e o caixa ficam errados, e o enquadramento e a liquidez de amanhã partiriam da posição errada.',
      ],
      acao: `${ladoErrado} deve incluir a venda (baixa de ${n} ${cod} e crédito de ${fmtR(n * pt)}) e reprocessar. Reforçar com a gestora o horário limite de boletas.`,
    }];
  },
};

// ======================================================================================
// CAIXA
// ======================================================================================
const K01: Cenario = {
  id: 'resgate_liquidado_nao_baixado', nome: 'Resgate liquidado e não baixado no controle', dim: 'caixa', tipos: ABERTOS,
  aplicavel: (c) => !!c.prazos && c.prazos.liq >= 1 && (c.base.movs.some((m) => m.id.startsWith('LIQ-')) || solicitacaoPara(somaDiasUteis(c.data, -c.prazos.liq), c.prazos.cot, c.prazos.corridos) !== null),
  preparar: (c) => {
    if (!c.base.movs.some((m) => m.id.startsWith('LIQ-'))) {
      const pz = c.prazos!;
      const cz = somaDiasUteis(c.data, -pz.liq);
      const cotaC = c.cotaHist[cz];
      const cotas = Number((c.qtdAnterior * entre(c.rng, 0.002, 0.01)).toFixed(8));
      const valor = r2(cotas * cotaC);
      const quem = novoCotista(c);
      c.base.movs.push({ id: 'LIQ-9', tipo: 'resgate', cotista: quem, cotas, valor, solicitadoEm: solicitacaoPara(cz, pz.cot, pz.corridos)!, cotizacao: cz, liquidacao: c.data, converterHoje: false, observacao: `cotizado em ${fmtData(cz)} pela cota de ${fmtN(cotaC, 8)}; liquidação financeira hoje` });
      c.base.caixa.lancamentos.push({ historico: `Pagamento de resgate [LIQ-9] — ${quem} (cotizado em ${fmtData(cz)})`, valor: -valor });
      reforcarCaixa(c, valor);
    }
  },
  aplicar: (c) => {
    const m = c.base.movs.find((x) => x.id.startsWith('LIQ-'))!;
    const errado = c.alfa;
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => !(l.historico.startsWith('Pagamento de resgate') && l.historico.includes(`[${m.id}]`)));
    addItem(errado.aPagar, 'RESGATES A PAGAR', 'Resgates já cotizados e ainda não liquidados', m.valor!);
    return [{
      cenario: 'resgate_liquidado_nao_baixado', dimensoes: ['caixa'], titulo: 'Pagamento de resgate não baixado no controle Alfa', ladoCorreto: 'Beta', ajustePor: 'Alfa',
      causaRaiz: `O controle Alfa não registrou o pagamento do resgate ${m.id} (${m.cotista}, ${fmtR(m.valor!)}) e manteve o valor em "resgates a pagar".`,
      evidencias: ['Caixa — lançamentos', 'Valores a pagar — resgates', 'Movimentações de passivo (liquidações do dia)'],
      raciocinio: [
        `O caixa do Alfa está ${fmtR(m.valor!)} acima do Beta, e "resgates a pagar" do Alfa está ${fmtR(m.valor!)} acima também. PL e cota batem.`,
        `O resgate ${m.id}, cotizado em ${fmtData(m.cotizacao)}, liquida hoje (${c.reg.cotizacao.find((x) => x.startsWith('Resgate'))}) e saiu da conta. O Alfa não deu baixa.`,
        'É descasamento de registro, sem efeito na cota de hoje. Se não for corrigido, o Alfa vai tentar pagar de novo ou projetar um caixa que não existe.',
      ],
      acao: `Alfa deve baixar o pagamento do resgate ${m.id} (caixa e passivo). O caixa precisa bater antes de acatar.`,
    }];
  },
};

const K03: Cenario = {
  id: 'tarifa_bancaria_indevida', nome: 'Tarifa bancária debitada da conta do fundo', dim: 'caixa',
  preparar: (c) => {
    const t = r2(entre(c.rng, 18, 190));
    c.base.caixa.lancamentos.push({ historico: 'Débito de tarifa — pacote de serviços PJ', valor: -t });
    c.base.aReceber.push({ codigo: 'TARIFA A RESSARCIR', descricao: 'Tarifa bancária indevida a ressarcir pelo administrador', valor: t });
    c.usados.add(`tarifa:${t}`);
  },
  aplicar: (c) => {
    const t = Number([...c.usados].find((u) => u.startsWith('tarifa:'))!.slice(7));
    c.alfa.caixa.lancamentos = c.alfa.caixa.lancamentos.filter((l) => !l.historico.startsWith('Débito de tarifa'));
    tirarItem(c.alfa.aReceber, 'TARIFA A RESSARCIR');
    tirarItem(c.beta.aReceber, 'TARIFA A RESSARCIR');
    return [{
      cenario: 'tarifa_bancaria_indevida', dimensoes: ['caixa'], titulo: 'Tarifa de pacote PJ debitada do fundo', ladoCorreto: 'nenhum', ajustePor: 'Beta (estorno) e Alfa (registro)',
      causaRaiz: `Houve um débito de tarifa de ${fmtR(t)} na conta do fundo. Tarifa de manutenção/pacote não é encargo da classe. O Beta lançou como despesa do fundo e o Alfa nem registrou.`,
      evidencias: ['Caixa — lançamentos do Beta', 'Regulamento — encargos e o que NÃO é encargo'],
      raciocinio: [
        `Caixa: o Beta tem um débito de ${fmtR(t)} (tarifa de pacote PJ) que o Alfa não tem. O PL do Beta fica ${fmtR(t)} menor.`,
        'O regulamento lista o que é encargo e diz que tarifas bancárias de manutenção e pacote são suportadas pelo administrador. Então o fundo não pode absorver essa despesa.',
        'Nenhum dos dois lados está certo. O débito aconteceu (o dinheiro saiu), então o tratamento correto é registrar a saída e um valor a ressarcir, até o estorno.',
        'O valor é imaterial para a cota, mas é despesa indevida e precisa ser contestada.',
      ],
      acao: `Pedir ao Beta o estorno da tarifa (ou o ressarcimento pelo administrador). Enquanto isso, os dois lados registram a saída de ${fmtR(t)} e um valor a receber do mesmo montante. Verificar se a cobrança se repete em outros fundos.`,
      gravidade: 'pendencia',
    }];
  },
};

const K04: Cenario = {
  id: 'debito_em_duplicidade', nome: 'Débito em duplicidade na conta do fundo', dim: 'caixa',
  preparar: (c) => {
    const x = r2(entre(c.rng, 800, 15000));
    const nf = inteiro(c.rng, 1000, 9999);
    const h = `Pagamento — despesa de registro/cartório (NF ${nf})`;
    c.base.caixa.lancamentos.push({ historico: h, valor: -x }, { historico: h, valor: -x });
    c.base.aReceber.push({ codigo: 'ESTORNO A RECEBER', descricao: 'Débito em duplicidade a estornar', valor: x });
    com(c, hora(c, 10, 15), 'Banco — tesouraria', 'Débito em duplicidade na conta do fundo', `O banco confirmou dois débitos de ${fmtR(x)} referentes à NF ${nf}; o estorno do segundo foi solicitado.`);
    c.usados.add(`dup:${x}:${nf}`);
  },
  aplicar: (c) => {
    const [, xs, nf] = [...c.usados].find((u) => u.startsWith('dup:'))!.split(':');
    const x = Number(xs);
    const i = c.alfa.caixa.lancamentos.findIndex((l) => l.historico.includes(`NF ${nf}`));
    c.alfa.caixa.lancamentos.splice(i, 1);
    tirarItem(c.alfa.aReceber, 'ESTORNO A RECEBER');
    tirarItem(c.beta.aReceber, 'ESTORNO A RECEBER');
    return [{
      cenario: 'debito_em_duplicidade', dimensoes: ['caixa'], titulo: `Pagamento da NF ${nf} debitado duas vezes`, ladoCorreto: 'nenhum', ajustePor: 'Beta (estorno) e Alfa (registro)',
      causaRaiz: `A despesa da NF ${nf} (${fmtR(x)}) foi debitada duas vezes na conta do fundo. O Beta registrou os dois débitos como despesa; o Alfa registrou um só.`,
      evidencias: ['Caixa — lançamentos (dois débitos idênticos)', 'Comparação com o controle Alfa'],
      raciocinio: [
        `O caixa do Beta está ${fmtR(x)} abaixo do do Alfa. A diferença é um segundo lançamento com histórico idêntico (mesma NF, mesmo valor).`,
        'A mesma nota fiscal não se paga duas vezes. O segundo débito é erro operacional, mas o dinheiro saiu de fato.',
        'O Alfa está economicamente certa (uma despesa), mas o caixa dela não reflete o que aconteceu na conta. O Beta reflete a conta, mas jogou a duplicidade no resultado e reduziu o PL.',
      ],
      acao: `Solicitar ao Beta o estorno imediato do débito duplicado. Até lá, registrar ${fmtR(x)} como "estorno a receber" (sem efeito no PL) e alinhar o caixa do Alfa ao real.`,
      gravidade: 'pendencia',
    }];
  },
};

const K05: Cenario = {
  id: 'dividendo_recebido_nao_baixado', nome: 'Dividendo recebido mantido como "a receber"', dim: 'caixa', tipos: COM_ACOES,
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Ação'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Ação');
    const dps = r2(Math.max(0.05, a.preco * entre(c.rng, 0.006, 0.035)));
    const v = r2(a.quantidade * dps);
    c.base.caixa.lancamentos.push({ historico: `Crédito de dividendos — ${a.codigo}`, valor: v });
    c.mercado.eventos.push(`${a.codigo}: pagamento em ${fmtData(c.data)} de dividendos de R$ ${fmtN(dps, 2)} por ação (data-com ${fmtData(somaDiasUteis(c.data, -inteiro(c.rng, 10, 25)))}).`);
    c.usados.add(`divpg:${a.codigo}:${v}`);
  },
  aplicar: (c) => {
    const [, cod, vs] = [...c.usados].find((u) => u.startsWith('divpg:'))!.split(':');
    const v = Number(vs);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => l.historico !== `Crédito de dividendos — ${cod}`);
    addItem(errado.aReceber, `DIVIDENDOS A RECEBER ${cod}`, `Dividendos a receber — ${cod}`, v);
    return [{
      cenario: 'dividendo_recebido_nao_baixado', dimensoes: ['caixa'], titulo: `Dividendos de ${cod} pagos e não baixados`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não registrou o crédito dos dividendos de ${cod} pagos hoje e manteve o valor como "a receber".`,
      evidencias: ['Caixa', 'Valores a receber', 'Informações de mercado — eventos'],
      raciocinio: [
        `Caixa do ${ladoErrado} ${fmtR(v)} menor e valores a receber ${fmtR(v)} maiores. PL e cota iguais.`,
        `Os dividendos de ${cod} foram pagos hoje. O recebível tem que virar caixa.`,
      ],
      acao: `${ladoErrado} deve baixar o recebível e registrar o crédito. Sem impacto na cota; acompanhar em D+1.`,
    }];
  },
};

const K06: Cenario = {
  id: 'juros_credito_nao_registrados', nome: 'Pagamento de juros de debênture/CRA não registrado', dim: 'caixa', tipos: ['RF_CP', 'INFRA', 'EXCLUSIVO', 'PREV', 'FIAGRO'],
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Debênture' || a.classe === 'CRA'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Debênture' || x.classe === 'CRA');
    const j = r2(a.preco * entre(c.rng, 0.03, 0.065));
    const v = r2(a.quantidade * j);
    c.base.caixa.lancamentos.push({ historico: `Pagamento de juros — ${a.codigo}`, valor: v });
    c.mercado.eventos.push(`${a.codigo}: pagamento de juros em ${fmtData(c.data)} de R$ ${fmtN(j, 6)} por título. O PU de referência de D já é "ex-juros".`);
    c.usados.add(`juros:${a.codigo}:${v}:${j}`);
  },
  aplicar: (c) => {
    const [, cod, vs, js] = [...c.usados].find((u) => u.startsWith('juros:'))!.split(':');
    const v = Number(vs);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => l.historico !== `Pagamento de juros — ${cod}`);
    return [{
      cenario: 'juros_credito_nao_registrados', dimensoes: ['caixa', 'cota'], titulo: `Juros de ${cod} não registrados`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} usou o PU "ex-juros" de ${cod} mas não registrou a entrada dos juros (R$ ${fmtN(Number(js), 6)} × quantidade = ${fmtR(v)}).`,
      evidencias: ['Caixa — lançamentos', `Carteira — ${cod}`, 'Informações de mercado — agenda de eventos'],
      raciocinio: [
        `Ativos iguais (inclusive o PU de ${cod}), mas o caixa do ${ladoErrado} tem ${fmtR(v)} a menos, e isso vai direto para o PL.`,
        `Hoje é dia de pagamento de juros de ${cod}. O PU de D já caiu pelo evento; quem não registrou a entrada perde os juros duas vezes: no preço e no caixa.`,
      ],
      acao: `${ladoErrado} deve registrar o recebimento dos juros e reprocessar a cota.`,
    }];
  },
};

const K07: Cenario = {
  id: 'ajuste_liquidado_nao_baixado', nome: 'Ajuste de D−1 liquidado e mantido como pendente', dim: 'caixa', tipos: COM_FUTUROS,
  aplicavel: (c) => c.base.caixa.lancamentos.some((l) => l.historico.startsWith('Liquidação B3 — ajuste')),
  aplicar: (c) => {
    const l = c.base.caixa.lancamentos.find((x) => x.historico.startsWith('Liquidação B3 — ajuste'))!;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((x) => x.historico !== l.historico);
    if (l.valor >= 0) addItem(errado.aReceber, 'AJUSTE FUTUROS D-1', `Ajuste de futuros de ${fmtData(c.dAnterior)} a receber`, l.valor);
    else addItem(errado.aPagar, 'AJUSTE FUTUROS D-1', `Ajuste de futuros de ${fmtData(c.dAnterior)} a pagar`, -l.valor);
    return [{
      cenario: 'ajuste_liquidado_nao_baixado', dimensoes: ['caixa'], titulo: 'Ajuste de D−1 liquidado e não baixado', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não registrou a liquidação financeira do ajuste de ${fmtData(c.dAnterior)} (${fmtR(l.valor)}) e manteve o valor pendente.`,
      evidencias: ['Caixa', 'Valores a receber/pagar — ajuste D−1'],
      raciocinio: [
        `O caixa difere em ${fmtR(Math.abs(l.valor))}, e o ${ladoErrado} tem um "ajuste de D−1" pendente no mesmo valor. PL e cota iguais.`,
        'O ajuste de D−1 liquida em D. É questão de baixa, sem efeito no PL.',
      ],
      acao: `${ladoErrado} deve baixar o ajuste de D−1 contra o caixa. Sem impacto na cota.`,
    }];
  },
};

const K08: Cenario = {
  id: 'compromissada_como_caixa', nome: 'Compromissada over classificada como disponibilidade', dim: 'caixa',
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Compromissada'),
  aplicar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Compromissada');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.ativos = errado.ativos.filter((x) => x.codigo !== a.codigo);
    errado.caixa.lancamentos.push({ historico: 'Saldo aplicado em compromissada over (classificado em disponibilidades)', valor: a.valor });
    return [{
      cenario: 'compromissada_como_caixa', dimensoes: ['caixa'], titulo: 'Compromissada over dentro do caixa', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} classificou a compromissada over (${fmtR(a.valor)}) como disponibilidade em vez de ativo.`,
      evidencias: ['Caixa', 'Carteira — compromissada'],
      raciocinio: [
        `O caixa do ${ladoErrado} está ${fmtR(a.valor)} maior e falta a linha de compromissada na carteira dele. O valor é idêntico; PL e cota batem.`,
        'Compromissada é aplicação financeira (ativo), não disponibilidade. A classificação errada distorce os relatórios de caixa e liquidez e o batimento diário.',
      ],
      acao: `${ladoErrado} deve reclassificar a compromissada para a carteira.`,
    }];
  },
};

const K09: Cenario = {
  id: 'pagamento_taxa_nao_registrado', nome: 'Pagamento mensal de taxa não registrado no controle', dim: 'caixa', diaPagamento: true,
  preparar: (c) => {
    const cod = usarTaxa(c);
    const duAnt = diasUteisNoMes(somaDias(`${c.data.slice(0, 8)}01`, -1));
    const duDec = duAntDec(c);
    // as três taxas vencem no 5º dia útil e são pagas juntas; o erro do cenário recai sobre uma delas
    let total = 0;
    for (const t of ['TXADM', 'TXGES', 'TXCUS']) {
      const p = provDe(c.base, t);
      p.pagamento = r2((p.saldoAnterior * duAnt) / (duAnt + duDec - 1));
      total = r2(total + p.pagamento);
      c.base.caixa.lancamentos.push({ historico: `Pagamento da ${nomeTaxa(t)} do mês anterior`, valor: -p.pagamento });
    }
    reforcarCaixa(c, total);
    c.usados.add(`pg:${cod}`);
  },
  aplicar: (c) => {
    const cod = [...c.usados].find((u) => u.startsWith('pg:'))!.slice(3);
    const p = provDe(c.base, cod);
    provDe(c.alfa, cod).pagamento = 0;
    c.alfa.caixa.lancamentos = c.alfa.caixa.lancamentos.filter((l) => !l.historico.startsWith(`Pagamento da ${nomeTaxa(cod)}`));
    return [{
      cenario: 'pagamento_taxa_nao_registrado', dimensoes: ['caixa', 'provisoes'], titulo: `Pagamento da ${nomeTaxa(cod)} sem baixa no controle Alfa`, ladoCorreto: 'Beta', ajustePor: 'Alfa',
      causaRaiz: `A ${nomeTaxa(cod)} do mês anterior (${fmtR(p.pagamento)}) foi paga hoje; o Alfa não registrou nem a saída de caixa nem a baixa da provisão.`,
      evidencias: ['Caixa', `Provisões — ${cod} (coluna pagamento)`, 'Regulamento — forma de pagamento das taxas'],
      raciocinio: [
        `Caixa do Alfa ${fmtR(p.pagamento)} maior; provisão de ${nomeTaxa(cod)} do Alfa ${fmtR(p.pagamento)} maior. As duas diferenças se anulam no PL.`,
        `Hoje está dentro do prazo de pagamento do regulamento (até o 5º dia útil) e o Beta mostra a saída. A apropriação do dia confere nos dois lados.`,
      ],
      acao: `Alfa deve registrar o pagamento (caixa) e baixar a provisão.`,
      gravidade: 'ressalva',
    }];
  },
};
function duAntDec(c: Ctx): number {
  let n = 0;
  for (let d = 1; d <= Number(c.data.slice(8)); d++) {
    const x = `${c.data.slice(0, 8)}${String(d).padStart(2, '0')}`;
    if (ehDiaUtil(x)) n++;
  }
  return n;
}

const P11: Cenario = {
  id: 'provisao_nao_baixada_apos_pagamento', nome: 'Taxa paga sem baixa da provisão (despesa em dobro)', dim: 'provisoes', diaPagamento: true,
  preparar: K09.preparar,
  aplicar: (c) => {
    const cod = [...c.usados].find((u) => u.startsWith('pg:'))!.slice(3);
    const p = provDe(c.base, cod);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    provDe(errado, cod).pagamento = 0;
    return [{
      cenario: 'provisao_nao_baixada_apos_pagamento', dimensoes: ['provisoes', 'cota'], titulo: `Provisão de ${nomeTaxa(cod)} não baixada após o pagamento`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} registrou a saída de caixa do pagamento (${fmtR(p.pagamento)}) mas não baixou a provisão. A despesa ficou contada duas vezes.`,
      evidencias: ['Caixa (os dois lados têm o pagamento)', `Provisões — ${cod}`],
      raciocinio: [
        `Os caixas batem (os dois registraram o pagamento de ${fmtR(p.pagamento)}), mas a provisão de ${nomeTaxa(cod)} do ${ladoErrado} está ${fmtR(p.pagamento)} maior.`,
        `Saldo anterior + apropriação − pagamento: o ${ladoErrado} não subtraiu o pagamento. Com isso o PL dele cai ${fmtR(p.pagamento)}, uma despesa em dobro.`,
      ],
      acao: `${ladoErrado} deve baixar a provisão pelo valor pago e reprocessar a cota.`,
    }];
  },
};

const K10: Cenario = {
  id: 'credito_nao_identificado', nome: 'Crédito na conta sem identificação', dim: 'caixa',
  preparar: (c) => {
    const v = r2(chance(c.rng, 0.5) ? inteiro(c.rng, 5, 200) * 1000 : entre(c.rng, 1000, 90000));
    c.base.caixa.lancamentos.push({ historico: 'TED recebida — remetente não identificado (CPF/CNPJ sem cadastro de cotista)', valor: v });
    c.base.aPagar.push({ codigo: 'RECURSOS A IDENTIFICAR', descricao: 'Créditos recebidos sem identificação (a identificar/devolver)', valor: v });
    c.usados.add(`ni:${v}`);
  },
  aplicar: (c) => {
    const v = Number([...c.usados].find((u) => u.startsWith('ni:'))!.slice(3));
    c.alfa.caixa.lancamentos = c.alfa.caixa.lancamentos.filter((l) => !l.historico.startsWith('TED recebida — remetente não identificado'));
    tirarItem(c.alfa.aPagar, 'RECURSOS A IDENTIFICAR');
    return [{
      cenario: 'credito_nao_identificado', dimensoes: ['caixa'], titulo: 'TED sem identificação na conta do fundo', ladoCorreto: 'indeterminado', ajustePor: 'Passivo/distribuidor (identificação) e Alfa (registro)',
      causaRaiz: `Entrou uma TED de ${fmtR(v)} de remetente sem cadastro de cotista. O Beta registrou como "recursos a identificar"; o Alfa não registrou. A natureza do crédito é desconhecida.`,
      evidencias: ['Caixa — lançamentos', 'Valores a pagar — recursos a identificar', 'Movimentações de passivo (nenhuma boleta correspondente)'],
      raciocinio: [
        `Caixa do Beta ${fmtR(v)} maior que o do Alfa; PL igual, porque o Beta pôs o valor em uma conta transitória do passivo.`,
        'Não há boleta de aplicação com esse valor nem cotista com esse documento. Pode ser aplicação sem boleta, devolução de algum prestador ou erro de terceiro.',
        'O tratamento do Beta (transitória, sem efeito no PL) é prudente. Converter em cotas ou reconhecer como receita sem saber a origem seria erro.',
      ],
      acao: `Acionar passivo/distribuidor para identificar o remetente. Se ninguém reclamar no prazo, devolver ao remetente. O Alfa deve registrar a transitória. O caixa fica pendente até a identificação.`,
      gravidade: 'pendencia',
    }];
  },
};

const K11: Cenario = {
  id: 'liquidacao_compra_antecipada', nome: 'Compra de ações liquidada antes de D+2 no controle', dim: 'caixa', tipos: COM_ACOES,
  aplicavel: (c) => !!ativoLivre(c, (a) => a.classe === 'Ação'),
  preparar: (c) => {
    const a = usarAtivo(c, (x) => x.classe === 'Ação');
    const n = Math.max(100, Math.round((a.quantidade * entre(c.rng, 0.05, 0.2)) / 100) * 100);
    const v = r2(n * a.preco * (1 + entre(c.rng, -0.01, 0.01)));
    addItem(c.base.aPagar, 'COMPRAS A LIQUIDAR', `Compras de ações a liquidar (D+2) — ${n} ${a.codigo} em ${fmtData(c.dAnterior)}`, v);
    c.usados.add(`cmp:${a.codigo}:${n}:${v}`);
  },
  aplicar: (c) => {
    const [, cod, ns, vs] = [...c.usados].find((u) => u.startsWith('cmp:'))!.split(':');
    const v = Number(vs);
    const liq = somaDiasUteis(c.dAnterior, 2);
    c.alfa.caixa.lancamentos.push({ historico: `Liquidação de compra — ${ns} ${cod}`, valor: -v });
    tirarItem(c.alfa.aPagar, 'COMPRAS A LIQUIDAR', v);
    return [{
      cenario: 'liquidacao_compra_antecipada', dimensoes: ['caixa'], titulo: `Liquidação de compra de ${cod} antecipada no controle Alfa`, ladoCorreto: 'Beta', ajustePor: 'Alfa',
      causaRaiz: `O Alfa debitou hoje a compra de ${ns} ${cod} feita em ${fmtData(c.dAnterior)}, cuja liquidação na B3 é em D+2 (${fmtData(liq)}).`,
      evidencias: ['Caixa', 'Valores a pagar — compras a liquidar'],
      raciocinio: [
        `Caixa do Alfa ${fmtR(v)} menor e "compras a liquidar" ${fmtR(v)} menor. PL igual.`,
        `A compra foi em ${fmtData(c.dAnterior)}. Ações liquidam em D+2, ou seja, ${fmtData(liq)}. Hoje o dinheiro ainda está na conta e a obrigação ainda existe.`,
        'Sem efeito na cota, mas o caixa projetado do Alfa subestima a liquidez de hoje e pode atrapalhar decisões de zeragem.',
      ],
      acao: 'Alfa deve estornar a liquidação antecipada e manter a obrigação até D+2.',
    }];
  },
};

const K12: Cenario = {
  id: 'resgate_pago_com_cota_errada', nome: 'Resgate pago com valor diferente da cota de cotização', dim: 'caixa', tipos: ABERTOS,
  aplicavel: (c) => !!c.prazos && c.prazos.liq >= 1 && c.prazos.cot >= 1 && solicitacaoPara(somaDiasUteis(c.data, -c.prazos.liq), c.prazos.cot, c.prazos.corridos) !== null,
  preparar: (c) => {
    const pz = c.prazos!;
    const cz = somaDiasUteis(c.data, -pz.liq);
    const cotaC = c.cotaHist[cz];
    const sol = solicitacaoPara(cz, pz.cot, pz.corridos)!;
    const cotaSol = Number((cotaC * (1 - entre(c.rng, 0.002, 0.012))).toFixed(8));
    const cotas = Number((c.qtdAnterior * entre(c.rng, 0.003, 0.015)).toFixed(8));
    const certo = r2(cotas * cotaC);
    const pago = r2(cotas * cotaSol);
    const quem = novoCotista(c);
    c.base.movs.push({ id: 'LIQ-K12', tipo: 'resgate', cotista: quem, cotas, valor: certo, solicitadoEm: sol, cotizacao: cz, liquidacao: c.data, converterHoje: false, observacao: `cotizado em ${fmtData(cz)} pela cota de ${fmtN(cotaC, 8)}; liquidação hoje` });
    reforcarCaixa(c, certo);
    c.base.caixa.lancamentos.push({ historico: `Pagamento de resgate [LIQ-K12] — ${quem} (cotizado em ${fmtData(cz)})`, valor: -pago });
    c.base.aPagar.push({ codigo: 'COMPLEMENTO RESGATE', descricao: `Complemento de resgate a pagar — ${quem}`, valor: r2(certo - pago) });
    c.usados.add(`k12:${quem}:${certo}:${pago}:${cotaSol}:${cotaC}:${fmtData(sol)}`);
  },
  aplicar: (c) => {
    const [, quem, cs, ps, cotaSol, cotaCs, solTxt] = [...c.usados].find((u) => u.startsWith('k12:'))!.split(':');
    const certo = Number(cs); const pago = Number(ps); const cotaC = Number(cotaCs);
    tirarItem(c.beta.aPagar, 'COMPLEMENTO RESGATE');
    tirarItem(c.alfa.aPagar, 'COMPLEMENTO RESGATE');
    const l = c.alfa.caixa.lancamentos.find((x) => x.historico.startsWith('Pagamento de resgate [LIQ-K12]'))!;
    l.valor = -certo;
    const m = c.base.movs.find((x) => x.id === 'LIQ-K12')!;
    return [{
      cenario: 'resgate_pago_com_cota_errada', dimensoes: ['caixa', 'cota'], titulo: `Resgate de ${quem} pago a menor`, ladoCorreto: 'nenhum', ajustePor: 'Beta (complemento ao cotista) e Alfa (caixa real)',
      causaRaiz: `O resgate ${m.id} (${fmtN(m.cotas!, 8)} cotas) foi pago pela cota da data do pedido, ${solTxt} (${fmtN(Number(cotaSol), 8)}), e não pela cota da data de cotização, ${fmtData(m.cotizacao)} (${fmtN(cotaC, 8)}). O cotista recebeu ${fmtR(certo - pago)} a menos.`,
      evidencias: ['Caixa — pagamento de resgate', 'Movimentações de passivo (cota de cotização)', 'Regulamento — cotização de resgates'],
      raciocinio: [
        `O Alfa projetou o pagamento de ${fmtR(certo)} e o Beta mostra ${fmtR(pago)} pagos. Diferença: ${fmtR(certo - pago)}.`,
        `Recalculei: ${fmtN(m.cotas!, 8)} cotas × cota da data de cotização (${fmtData(m.cotizacao)}) ${fmtN(cotaC, 8)} = ${fmtR(certo)}. O valor pago corresponde a uma cota menor, a da data do pedido, que o regulamento não usa.`,
        'O dinheiro a menos ficou no fundo e o Beta zerou a obrigação, então o PL dele fica inflado. O cotista tem direito ao complemento.',
      ],
      acao: `Pagar o complemento de ${fmtR(certo - pago)} ao cotista. Até lá, os dois lados registram "complemento de resgate a pagar". O Alfa ajusta o caixa ao valor efetivamente pago. Apurar se outros resgates do dia tiveram o mesmo problema.`,
      gravidade: 'erro',
    }];
  },
};

const K14: Cenario = {
  id: 'margem_lancada_como_despesa', nome: 'Depósito de margem tratado como despesa', dim: 'caixa', tipos: COM_FUTUROS,
  preparar: (c) => {
    const m = r2(c.plAnterior * entre(c.rng, 0.003, 0.015));
    c.base.caixa.saldoInicial = r2(c.base.caixa.saldoInicial + m);
    const lft = c.base.ativos.find((x) => x.codigo.startsWith('LFT'));
    if (lft) { const k = Math.min(lft.quantidade - 1, Math.round(m / lft.preco)); lft.quantidade -= k; lft.valor = r2(lft.quantidade * lft.preco); }
    c.base.caixa.lancamentos.push({ historico: 'B3 — chamada de margem (depósito em dinheiro)', valor: -m });
    c.base.aReceber.push({ codigo: 'MARGEM DEPOSITADA B3', descricao: 'Margem depositada em dinheiro na B3 (valores dados em garantia)', valor: m });
    c.usados.add(`margem:${m}`);
  },
  aplicar: (c) => {
    const m = Number([...c.usados].find((u) => u.startsWith('margem:'))!.slice(7));
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    tirarItem(errado.aReceber, 'MARGEM DEPOSITADA B3');
    return [{
      cenario: 'margem_lancada_como_despesa', dimensoes: ['caixa', 'cota'], titulo: 'Margem depositada reconhecida como despesa', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} lançou o depósito de margem (${fmtR(m)}) só como saída de caixa, sem o ativo "margem depositada".`,
      evidencias: ['Caixa — chamada de margem', 'Valores a receber/garantias', 'Regulamento — margem'],
      raciocinio: [
        `Os dois lados têm a saída de ${fmtR(m)} no caixa, mas só o ${ladoCerto} tem o ativo correspondente. O PL do ${ladoErrado} cai ${fmtR(m)}.`,
        'Margem em dinheiro continua sendo do fundo: é garantia, não despesa. O regulamento diz isso explicitamente.',
      ],
      acao: `${ladoErrado} deve registrar a margem como ativo dado em garantia e reprocessar a cota.`,
    }];
  },
};

// ======================================================================================
// PROVISÕES
// ======================================================================================
function ajustarSaldoAnterior(c: Ctx, cod: string, override: Partial<ParamTaxa> = {}): void {
  const p = provDe(c.base, cod);
  if (p.regra.tipo !== 'pct') return;
  const t = taxaDiaria({ ...p.regra.param, ...override }, c.plAnterior, c.calc).valor;
  const duDec = duAntDec(c);
  const duAnt = diasUteisNoMes(somaDias(`${c.data.slice(0, 8)}01`, -1));
  const dias = duDec <= 5 ? duAnt + duDec - 1 : duDec - 1;
  p.saldoAnterior = r2(t * dias * entre(c.rng, 0.98, 1.02));
}

const P01: Cenario = {
  id: 'taxa_reduzida_nao_aplicada', nome: 'Redução de taxa aprovada em assembleia não aplicada', dim: 'provisoes',
  preparar: (c) => {
    const cod = usarTaxa(c);
    const tr = c.reg.taxas.find((t) => t.codigo === cod)!;
    const novo = tr.param.pct;
    const antigo = Number((novo * entre(c.rng, 1.2, 1.6)).toFixed(4));
    const assembleia = somaDiasUteis(c.data, -inteiro(c.rng, 8, 25));
    c.reg.alteracoes.push(`Assembleia de ${fmtData(assembleia)} aprovou a redução da ${tr.nome.toLowerCase()} de ${fmtPct(antigo, 3)} a.a. para ${fmtPct(novo, 3)} a.a., com vigência a partir de ${fmtData(c.data)} (inclusive).`);
    ajustarSaldoAnterior(c, cod, { pct: antigo }); // até D−1 a taxa vigente era a antiga
    c.usados.add(`red:${cod}:${antigo}`);
  },
  aplicar: (c) => {
    const [, cod, as] = [...c.usados].find((u) => u.startsWith('red:'))!.split(':');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const p = provDe(errado, cod);
    (p.regra as { tipo: 'pct'; param: { pct: number } }).param.pct = Number(as);
    const novo = c.reg.taxas.find((t) => t.codigo === cod)!.param.pct;
    return [{
      cenario: 'taxa_reduzida_nao_aplicada', dimensoes: ['provisoes'], titulo: `${nomeTaxa(cod)} com percentual antigo`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} continuou apropriando a ${nomeTaxa(cod)} a ${fmtPct(Number(as), 3)} a.a.; desde hoje o regulamento prevê ${fmtPct(novo, 3)} a.a.`,
      evidencias: [`Provisões — ${cod} (apropriação do dia)`, 'Regulamento — alterações recentes'],
      raciocinio: [
        `O saldo anterior da ${nomeTaxa(cod)} bate; a diferença está só na apropriação de hoje.`,
        `Recalculei pelo regulamento: PL de D−1 ${fmtR(c.plAnterior)} × ${fmtPct(novo, 3)} pelo método do regulamento dá o valor do ${ladoCerto}. O ${ladoErrado} usou ${fmtPct(Number(as), 3)}, que é a taxa de antes da assembleia.`,
        'A redução vale a partir de hoje, inclusive. Este é o primeiro dia sob a nova taxa, por isso o saldo anterior ainda bate.',
      ],
      acao: `${ladoErrado} deve atualizar o cadastro da ${nomeTaxa(cod)} para ${fmtPct(novo, 3)} a.a. com vigência em ${fmtData(c.data)} e reprocessar.`,
    }];
  },
};

const P20: Cenario = {
  id: 'ambos_com_taxa_antiga', nome: 'Os dois lados com a taxa antiga (cota bate, mas está errada)', dim: 'provisoes',
  preparar: P01.preparar,
  aplicar: (c) => {
    const [, cod, as] = [...c.usados].find((u) => u.startsWith('red:'))!.split(':');
    for (const lado of [c.alfa, c.beta]) (provDe(lado, cod).regra as { tipo: 'pct'; param: { pct: number } }).param.pct = Number(as);
    const novo = c.reg.taxas.find((t) => t.codigo === cod)!.param.pct;
    return [{
      cenario: 'ambos_com_taxa_antiga', dimensoes: ['provisoes'], titulo: `Alfa e Beta com a ${nomeTaxa(cod)} antiga`, ladoCorreto: 'nenhum', ajustePor: 'Alfa e Beta',
      causaRaiz: `Nenhum dos dois lados aplicou a redução da ${nomeTaxa(cod)} (${fmtPct(Number(as), 3)} → ${fmtPct(novo, 3)} a.a.) que vale a partir de hoje.`,
      evidencias: [`Provisões — ${cod}`, 'Regulamento — alterações recentes'],
      raciocinio: [
        'Alfa e Beta batem em tudo, inclusive na cota. Mesmo assim, recalculei as apropriações pelo regulamento.',
        `A ${nomeTaxa(cod)} foi reduzida em assembleia para ${fmtPct(novo, 3)} a.a. a partir de hoje, e os dois lados ainda apropriam ${fmtPct(Number(as), 3)}.`,
        'Dois lados iguais não garantem que estejam certos. Por isso as provisões sempre são conferidas contra o regulamento, e não só entre si.',
      ],
      acao: 'Alfa e Beta devem atualizar a taxa e reprocessar. A cota correta é diferente da que os dois calcularam.',
    }];
  },
};

const P02: Cenario = {
  id: 'minimo_mensal_ignorado', nome: 'Valor mínimo mensal da taxa ignorado', dim: 'provisoes',
  aplicavel: (c) => !c.usados.has('prov:TXADM') && !c.reg.taxas.find((t) => t.codigo === 'TXADM')!.param.minimoMensal,
  preparar: (c) => {
    c.usados.add('prov:TXADM');
    const tr = c.reg.taxas.find((t) => t.codigo === 'TXADM')!;
    const diaria = taxaDiaria({ ...tr.param, minimoMensal: undefined }, c.plAnterior, c.calc).valor;
    const min = Math.ceil((diaria * c.calc.duMes * entre(c.rng, 1.3, 2.4)) / 100) * 100;
    tr.param.minimoMensal = min;
    (provDe(c.base, 'TXADM').regra as { tipo: 'pct'; param: { minimoMensal?: number } }).param.minimoMensal = min;
    c.reg.alteracoes.push(`Aditivo ao contrato de administração, assinado em ${fmtData(somaDiasUteis(c.data, -inteiro(c.rng, 5, 20)))}: a partir de ${fmtData(c.data)} (inclusive) vale o mínimo mensal de ${fmtR(min)} para a taxa de administração.`);
    ajustarSaldoAnterior(c, 'TXADM', { minimoMensal: undefined }); // até D−1 não havia mínimo
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const min = c.reg.taxas.find((t) => t.codigo === 'TXADM')!.param.minimoMensal!;
    delete (provDe(errado, 'TXADM').regra as { tipo: 'pct'; param: { minimoMensal?: number } }).param.minimoMensal;
    return [{
      cenario: 'minimo_mensal_ignorado', dimensoes: ['provisoes'], titulo: 'Taxa de administração sem o mínimo mensal', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} apropriou só o percentual sobre o PL e ignorou o mínimo mensal de ${fmtR(min)}, que passou a valer hoje e prevalece porque o percentual rende menos que o mínimo diário.`,
      evidencias: ['Provisões — TXADM', 'Regulamento — taxa de administração (mínimo mensal) e alterações recentes'],
      raciocinio: [
        'A apropriação de taxa de administração difere entre os lados; o saldo anterior bate (até D−1 não havia mínimo).',
        `Pelo percentual, a taxa diária fica abaixo de ${fmtR(min)} ÷ ${c.calc.duMes} dias úteis do mês = ${fmtR(min / c.calc.duMes)}. O regulamento manda cobrar o maior dos dois, então vale o mínimo.`,
        `O aditivo vale a partir de hoje (inclusive). O ${ladoCerto} aplicou o mínimo; o ${ladoErrado} não.`,
      ],
      acao: `${ladoErrado} deve parametrizar o mínimo mensal na taxa de administração a partir de hoje e reprocessar.`,
    }];
  },
};

const P03: Cenario = {
  id: 'taxa_sobre_pl_do_dia', nome: 'Taxa calculada sobre o PL do dia em vez do PL de D−1', dim: 'provisoes',
  aplicar: (c) => {
    const cod = usarTaxa(c, 'TXGES');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    (provDe(errado, cod).regra as { tipo: 'pct'; param: { baseD0?: boolean } }).param.baseD0 = true;
    return [{
      cenario: 'taxa_sobre_pl_do_dia', dimensoes: ['provisoes'], titulo: `Base de cálculo da ${nomeTaxa(cod)} errada`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} calculou a ${nomeTaxa(cod)} sobre o PL de D, e não sobre o PL do dia útil anterior, como manda o regulamento.`,
      evidencias: [`Provisões — ${cod}`, 'Dia anterior (PL de D−1)', 'Regulamento'],
      raciocinio: [
        `A diferença na apropriação de ${nomeTaxa(cod)} é pequena e proporcional à variação do PL entre D−1 e D.`,
        `PL de D−1 (${fmtR(c.plAnterior)}) × taxa pelo método do regulamento dá exatamente o valor do ${ladoCerto}. O do ${ladoErrado} só fecha usando o PL de hoje.`,
        'O valor é pequeno, mas é erro de parametrização: acumula todo dia e piora em dias de grande movimentação.',
      ],
      acao: `${ladoErrado} deve corrigir a base de cálculo para o PL de D−1.`,
    }];
  },
};

const P04: Cenario = {
  id: 'taxa_por_dias_corridos', nome: 'Taxa apropriada por dias corridos (base 365)', dim: 'provisoes',
  aplicar: (c) => {
    const cod = usarTaxa(c, 'TXGES');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    (provDe(errado, cod).regra as { tipo: 'pct'; param: { metodo: string } }).param.metodo = 'corridos_365';
    const dc = c.calc.diasCorridosDesdeAnterior;
    return [{
      cenario: 'taxa_por_dias_corridos', dimensoes: ['provisoes'], titulo: `${nomeTaxa(cod)} na base 365 corridos`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} apropriou a ${nomeTaxa(cod)} por 1/365 × ${dc} dia(s) corrido(s); o regulamento manda 1/252 por dia útil.`,
      evidencias: [`Provisões — ${cod}`, 'Regulamento — método de apropriação', 'Data-base (dia da semana)'],
      raciocinio: [
        `A apropriação de ${nomeTaxa(cod)} do ${ladoErrado} é ${dc > 1 ? 'maior' : 'menor'} que a do ${ladoCerto}.`,
        dc > 1 ? `Hoje é ${c.data && ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'][new Date(c.data + 'T12:00:00Z').getUTCDay()]} e desde o último dia útil passaram ${dc} dias corridos. A conta por corridos apropria ${dc}/365, enquanto a base 252 apropria 1/252.` : `O valor do ${ladoErrado} é compatível com 1/365 do percentual anual por dia corrido.`,
        'O regulamento é explícito: 1/252 por dia útil.',
      ],
      acao: `${ladoErrado} deve corrigir o método de apropriação para a base 252 e reprocessar.`,
    }];
  },
};

const P05: Cenario = {
  id: 'taxa_gestao_sem_apropriacao', nome: 'Taxa de gestão sem apropriação no dia', dim: 'provisoes',
  aplicavel: (c) => !c.usados.has('prov:TXGES'),
  aplicar: (c) => {
    c.usados.add('prov:TXGES');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const p = provDe(errado, 'TXGES');
    p.regra = { tipo: 'manual' };
    p.apropriacao = 0;
    p.memoria = 'Sem apropriação no dia';
    return [{
      cenario: 'taxa_gestao_sem_apropriacao', dimensoes: ['provisoes'], titulo: 'Taxa de gestão não apropriada hoje', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não apropriou a taxa de gestão de hoje (parâmetro desativado/rotina não executada).`,
      evidencias: ['Provisões — TXGES (apropriação zero)', 'Regulamento — taxa de gestão'],
      raciocinio: [
        `A provisão de taxa de gestão do ${ladoErrado} ficou com o mesmo saldo de ontem: apropriação zero.`,
        `Pelo regulamento, a taxa de gestão é apropriada todo dia útil. O valor do ${ladoCerto} confere com o recálculo.`,
      ],
      acao: `${ladoErrado} deve rodar a apropriação de taxa de gestão do dia e reprocessar. Verificar se outros fundos da mesma rotina foram afetados.`,
    }];
  },
};

const P06: Cenario = {
  id: 'performance_sem_reversao', nome: 'Provisão de performance não revertida', dim: 'provisoes', precisaPerf: true, tipos: COM_PERF, ordem: 90,
  aplicavel: (c) => !!c.base.perf && !c.usados.has('perf'),
  preparar: (c) => {
    c.usados.add('perf');
    const r = calcular(c.base, c.calc);
    void r;
    const p = provDe(c.base, 'PERF');
    p.saldoAnterior = r2(p.saldoAtual * entre(c.rng, 1.08, 1.4) + c.plAnterior * 0.00003);
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.perf = { ...errado.perf!, congelada: true };
    return [{
      cenario: 'performance_sem_reversao', dimensoes: ['provisoes'], titulo: 'Performance não revertida', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não recalculou a performance hoje e manteve o saldo de D−1. O excesso sobre o benchmark caiu, então parte da provisão deveria ter sido revertida.`,
      evidencias: ['Provisões — PERF', 'Regulamento — performance (reversão)', 'Informações de mercado — fator do benchmark'],
      raciocinio: [
        `A provisão de performance do ${ladoErrado} está igual à de ontem; a do ${ladoCerto} caiu (apropriação negativa).`,
        'Recalculei: 20% × (cota bruta − cota de referência × fator do benchmark) × cotas bate com o lado que reverteu.',
        'O regulamento prevê a reversão quando o excesso diminui. Manter a provisão subestima a cota de quem resgata hoje.',
      ],
      acao: `${ladoErrado} deve recalcular a performance de D (com reversão) e reprocessar a cota.`,
    }];
  },
};

const P07: Cenario = {
  id: 'performance_data_base_errada', nome: 'Performance com fator de benchmark de data-base errada', dim: 'provisoes', precisaPerf: true, tipos: COM_PERF, ordem: 91,
  aplicavel: (c) => !!c.base.perf && !c.usados.has('perf'),
  aplicar: (c) => {
    c.usados.add('perf');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const pb = c.base.perf!;
    const k = inteiro(c.rng, 1, 3);
    const dataErrada = somaDiasUteis(pb.dataBase, k);
    const fatorErrado = Number((pb.fatorBenchmark / Math.pow(1 + c.mercado.cdiAA, k / 252)).toFixed(8));
    errado.perf = { ...errado.perf!, fatorBenchmark: fatorErrado };
    c.mercado.benchmarks.push(`Fator acumulado do ${pb.benchmark} de ${fmtData(dataErrada)} até ${fmtData(c.data)}: ${fmtN(fatorErrado, 8)}`);
    return [{
      cenario: 'performance_data_base_errada', dimensoes: ['provisoes'], titulo: 'Fator do benchmark de outra data-base', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} corrigiu a cota de referência com o fator acumulado desde ${fmtData(dataErrada)}, e não desde ${fmtData(pb.dataBase)} (data da última cobrança).`,
      evidencias: ['Provisões — PERF (memória)', 'Informações de mercado — fatores do benchmark', 'Regulamento — performance'],
      raciocinio: [
        'A provisão de performance diverge, enquanto as outras taxas batem.',
        `A cota de referência vale desde ${fmtData(pb.dataBase)}, então o fator correto é o acumulado a partir dessa data (${fmtN(pb.fatorBenchmark, 8)}). O ${ladoErrado} usou ${fmtN(fatorErrado, 8)}, que é o fator acumulado desde ${fmtData(dataErrada)}.`,
      ],
      acao: `${ladoErrado} deve corrigir a data-base do benchmark e recalcular a performance.`,
    }];
  },
};

const P08: Cenario = {
  id: 'performance_sem_linha_dagua', nome: 'Performance provisionada abaixo da linha d’água', dim: 'provisoes', precisaPerf: true, tipos: COM_PERF,
  datas: ['2026-07-01', '2026-01-02'], ordem: 92,
  aplicavel: (c) => !!c.base.perf && !c.usados.has('perf'),
  preparar: (c) => {
    c.usados.add('perf');
    const r = calcular(c.base, c.calc);
    const bruta = r.cotaBrutaPerf!;
    const fimPeriodo = c.data === '2026-07-01' ? '2026-06-30' : '2025-12-31';
    const ultimaCobranca = c.data === '2026-07-01' ? '2025-06-30' : '2024-12-31';
    const fator = Number(Math.pow(1 + c.mercado.cdiAA, diasUteisEntre(ultimaCobranca, c.data) / 252).toFixed(8));
    const cotaBase = Number(((bruta * (1 + entre(c.rng, 0.02, 0.06))) / fator).toFixed(8));
    c.base.perf = { ...c.base.perf!, cotaBase, dataBase: ultimaCobranca, fatorBenchmark: fator };
    const p = provDe(c.base, 'PERF');
    p.saldoAnterior = 0;
    const cotaFim = Number((c.cotaAnterior * (1 - entre(c.rng, 0.002, 0.008))).toFixed(8));
    const fatorDia = Number(Math.pow(1 + c.mercado.cdiAA, 1 / 252).toFixed(8));
    c.reg.especificos = c.reg.especificos.filter((e) => !e.startsWith('Performance:'));
    c.reg.especificos.push(`Performance: última cobrança efetiva em ${fmtData(ultimaCobranca)} (cota de referência ${fmtN(cotaBase, 8)}). Em ${fmtData(fimPeriodo)} não houve cobrança (fundo abaixo da cota de referência corrigida); a cota de fechamento nesse dia foi ${fmtN(cotaFim, 8)}.`);
    c.mercado.benchmarks = [
      `Fator acumulado do ${c.base.perf.benchmark} de ${fmtData(ultimaCobranca)} até ${fmtData(c.data)}: ${fmtN(fator, 8)}`,
      `Fator acumulado do ${c.base.perf.benchmark} de ${fmtData(fimPeriodo)} até ${fmtData(c.data)}: ${fmtN(fatorDia, 8)}`,
    ];
    c.usados.add(`lda:${cotaFim}:${fatorDia}:${fimPeriodo}`);
  },
  aplicar: (c) => {
    const [, cf, fd, fim] = [...c.usados].find((u) => u.startsWith('lda:'))!.split(':');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.perf = { ...errado.perf!, cotaBase: Number(cf), fatorBenchmark: Number(fd), dataBase: fim };
    return [{
      cenario: 'performance_sem_linha_dagua', dimensoes: ['provisoes'], titulo: 'Performance provisionada sem respeitar a linha d’água', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `Na virada do semestre, o ${ladoErrado} "zerou" a cota de referência para a cota de ${fmtData(fim)}, como se tivesse havido cobrança. Não houve: a referência continua sendo a cota da última cobrança efetiva, corrigida pelo benchmark.`,
      evidencias: ['Provisões — PERF', 'Regulamento — linha d’água e histórico de cobranças', 'Informações de mercado — fatores do benchmark'],
      raciocinio: [
        `O ${ladoErrado} provisiona performance logo no primeiro dia do novo período; o ${ladoCerto} não provisiona nada.`,
        'Pelo regulamento há linha d’água: a referência é a cota da última cobrança efetiva, corrigida pelo benchmark. Corrigida, ela está acima da cota bruta de hoje, então a performance é zero.',
        `O ${ladoErrado} usou a cota de ${fmtData(fim)} como referência. Isso só seria certo se tivesse havido cobrança nessa data, o que não aconteceu.`,
      ],
      acao: `${ladoErrado} deve restaurar a cota de referência da última cobrança efetiva, zerar a provisão e reprocessar. Rever a rotina de virada de período.`,
    }];
  },
};

const P09: Cenario = {
  id: 'auditoria_contrato_novo', nome: 'Novo valor de auditoria (aditivo assinado) não aplicado', dim: 'provisoes',
  aplicavel: (c) => !c.usados.has('prov:AUDIT'),
  preparar: (c) => {
    c.usados.add('prov:AUDIT');
    const d = c.reg.despesasFixas.find((x) => x.codigo === 'AUDIT')!;
    const antigo = d.valor;
    const novo = Math.round((antigo * entre(c.rng, 1.1, 1.5)) / 1000) * 1000;
    d.valor = novo;
    d.observacao = `aditivo assinado em ${fmtData(somaDiasUteis(c.data, -inteiro(c.rng, 2, 10)))}, novo valor vigente a partir de ${fmtData(c.data)}; provisão diária por 1/252`;
    (provDe(c.base, 'AUDIT').regra as { valorPeriodo: number }).valorPeriodo = novo;
    com(c, hora(c, 9, 11), 'Jurídico/contratos', 'Aditivo — auditoria', `Aditivo ao contrato de auditoria assinado: novo honorário anual de R$ ${fmtN(novo, 2)} a partir de ${fmtData(c.data)} (antes R$ ${fmtN(antigo, 2)}).`);
    c.usados.add(`aud:${antigo}`);
  },
  aplicar: (c) => {
    const antigo = Number([...c.usados].find((u) => u.startsWith('aud:'))!.slice(4));
    const novo = c.reg.despesasFixas.find((x) => x.codigo === 'AUDIT')!.valor;
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    (provDe(errado, 'AUDIT').regra as { valorPeriodo: number }).valorPeriodo = antigo;
    return [{
      cenario: 'auditoria_contrato_novo', dimensoes: ['provisoes'], titulo: 'Auditoria provisionada com o valor antigo', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} continua provisionando R$ ${fmtN(antigo, 2)}/ano. O aditivo assinado fixa R$ ${fmtN(novo, 2)}/ano a partir de hoje.`,
      evidencias: ['Provisões — AUDIT', 'Regulamento/contratos — despesas fixas', 'Comunicações — aditivo'],
      raciocinio: [
        `A apropriação de auditoria difere: ${fmtR(novo / 252)} (${ladoCerto}) contra ${fmtR(antigo / 252)} (${ladoErrado}).`,
        'Existe aditivo assinado com vigência a partir de hoje. Diferente de uma proposta, aditivo assinado vale.',
      ],
      acao: `${ladoErrado} deve atualizar o valor anual de auditoria e reprocessar.`,
    }];
  },
};

const P10: Cenario = {
  id: 'taxa_cvm_faixa_errada', nome: 'Taxa de fiscalização CVM na faixa errada', dim: 'provisoes',
  preparar: (c) => {
    const fAtual = faixaCVM(c.plAnterior);
    const outra = fAtual > 0 && (fAtual === TABELA_CVM.length - 1 || chance(c.rng, 0.5)) ? fAtual - 1 : fAtual + 1;
    const lim = outra < fAtual ? TABELA_CVM[outra].ate! : TABELA_CVM[fAtual].ate!;
    c.reg.plReferenciaCVM = r2(outra < fAtual ? lim * entre(c.rng, 0.86, 0.97) : lim * entre(c.rng, 1.03, 1.15));
    const v = TABELA_CVM[faixaCVM(c.reg.plReferenciaCVM)].valor;
    const p = provDe(c.base, 'CVM');
    (p.regra as { valorPeriodo: number }).valorPeriodo = v;
    p.saldoAnterior = r2((v / duTrimestre(c.data)) * Math.max(0, Math.round(p.saldoAnterior / (TABELA_CVM[faixaCVM(c.plAnterior)].valor / duTrimestre(c.data)))));
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const vErr = TABELA_CVM[faixaCVM(c.plAnterior)].valor;
    const vCerto = TABELA_CVM[faixaCVM(c.reg.plReferenciaCVM)].valor;
    (provDe(errado, 'CVM').regra as { valorPeriodo: number }).valorPeriodo = vErr;
    return [{
      cenario: 'taxa_cvm_faixa_errada', dimensoes: ['provisoes'], titulo: 'Taxa CVM pela faixa do PL atual', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} enquadrou a taxa de fiscalização pelo PL atual (${fmtR(c.plAnterior)}), na faixa de R$ ${fmtN(vErr, 2)}/trimestre. A regra usa o PL do último dia útil do trimestre anterior (${fmtR(c.reg.plReferenciaCVM)}), faixa de R$ ${fmtN(vCerto, 2)}.`,
      evidencias: ['Provisões — CVM', 'Regulamento — tabela da taxa de fiscalização e PL de referência'],
      raciocinio: [
        'A apropriação da taxa CVM difere entre os lados.',
        `O PL de referência do trimestre é ${fmtR(c.reg.plReferenciaCVM)} → R$ ${fmtN(vCerto, 2)}/trimestre. O PL atual cruzou o limite da faixa, mas isso só conta para o próximo trimestre.`,
      ],
      acao: `${ladoErrado} deve usar a faixa do PL de referência (R$ ${fmtN(vCerto, 2)}/trimestre).`,
    }];
  },
};

const P12: Cenario = {
  id: 'taxa_escalonada_ignorada', nome: 'Taxa escalonada por faixa de PL aplicada como taxa única', dim: 'provisoes',
  aplicavel: (c) => !c.usados.has('prov:TXGES') && c.plAnterior > 60e6,
  preparar: (c) => {
    c.usados.add('prov:TXGES');
    const tr = c.reg.taxas.find((t) => t.codigo === 'TXGES')!;
    const passo = c.plAnterior > 500e6 ? 50e6 : 10e6;
    const lim = Math.max(passo, Math.floor((c.plAnterior * entre(c.rng, 0.4, 0.7)) / passo) * passo);
    const p2 = Number((tr.param.pct * entre(c.rng, 0.6, 0.8)).toFixed(4));
    tr.param.faixas = [{ ate: lim, pct: tr.param.pct }, { ate: null, pct: p2 }];
    (provDe(c.base, 'TXGES').regra as { param: { faixas?: unknown } }).param.faixas = structuredClone(tr.param.faixas);
    ajustarSaldoAnterior(c, 'TXGES');
  },
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    delete (provDe(errado, 'TXGES').regra as { param: { faixas?: unknown } }).param.faixas;
    const tr = c.reg.taxas.find((t) => t.codigo === 'TXGES')!;
    return [{
      cenario: 'taxa_escalonada_ignorada', dimensoes: ['provisoes'], titulo: 'Taxa de gestão escalonada aplicada como taxa cheia', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} aplicou ${fmtPct(tr.param.faixas![0].pct, 3)} sobre todo o PL, ignorando a taxa menor (${fmtPct(tr.param.faixas![1].pct, 3)}) sobre a parcela acima de ${fmtR(tr.param.faixas![0].ate!)}.`,
      evidencias: ['Provisões — TXGES', 'Regulamento — taxa de gestão escalonada'],
      raciocinio: [
        `A apropriação de taxa de gestão do ${ladoErrado} é maior.`,
        `O regulamento escalona a taxa: ${textoTaxa(tr)} Com PL de D−1 de ${fmtR(c.plAnterior)}, parte do PL está na segunda faixa.`,
        `O ${ladoCerto} fez a conta por faixas; o ${ladoErrado} aplicou a taxa cheia em tudo.`,
      ],
      acao: `${ladoErrado} deve parametrizar as faixas da taxa de gestão e reprocessar.`,
    }];
  },
};

const P13: Cenario = {
  id: 'despesa_nao_prevista', nome: 'Despesa provisionada que não é encargo (ou sem suporte)', dim: 'provisoes',
  aplicar: (c) => {
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const marketing = chance(c.rng, 0.5);
    const v = r2(inteiro(c.rng, 3, 25) * 1000 + entre(c.rng, 0, 999));
    if (marketing) {
      errado.provisoes.push({ codigo: 'DESP EVENTO', descricao: 'Despesa — evento de relacionamento com cotistas (gestora)', saldoAnterior: 0, apropriacao: v, pagamento: 0, saldoAtual: 0, memoria: 'Lançamento manual a pedido da gestora', regra: { tipo: 'manual' } });
      com(c, hora(c, 11, 15), 'Gestora — relações com investidores', 'Evento com cotistas', `Favor provisionar no fundo a despesa do evento anual com cotistas, R$ ${fmtN(v, 2)} (NF do buffet em anexo).`);
      return [{
        cenario: 'despesa_nao_prevista', dimensoes: ['provisoes'], titulo: 'Despesa de evento da gestora lançada no fundo', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
        causaRaiz: `${ladoErrado} provisionou ${fmtR(v)} de despesa de evento de relacionamento a pedido da gestora. O regulamento diz que esse tipo de gasto não é encargo da classe.`,
        evidencias: ['Provisões — linha nova', 'Regulamento — encargos / não encargos', 'Comunicações — pedido da gestora'],
        raciocinio: [
          `O ${ladoErrado} tem uma provisão que o ${ladoCerto} não tem: "evento de relacionamento" de ${fmtR(v)}.`,
          'O regulamento classifica despesas de marketing, eventos e relacionamento da gestora como NÃO encargo. O pedido da gestora não muda o regulamento.',
        ],
        acao: `${ladoErrado} deve estornar a provisão e reprocessar. Responder à gestora que a despesa é dela.`,
      }];
    }
    const deb = c.base.ativos.find((a) => a.classe === 'Debênture' || a.classe === 'CRA')?.codigo ?? 'um emissor da carteira';
    errado.provisoes.push({ codigo: 'HONORARIOS', descricao: `Honorários advocatícios — cobrança contra ${deb}`, saldoAnterior: 0, apropriacao: v, pagamento: 0, saldoAtual: 0, memoria: 'Lançamento manual com base em e-mail da gestora', regra: { tipo: 'manual' } });
    com(c, hora(c, 11, 15), 'Gestora — jurídico', 'Honorários', `Precisamos provisionar honorários do escritório que está cuidando da cobrança de ${deb}: R$ ${fmtN(v, 2)} (proposta anexa; a aprovação do administrador está em andamento).`);
    return [{
      cenario: 'despesa_nao_prevista', dimensoes: ['provisoes'], titulo: 'Honorários provisionados sem aprovação documentada', ladoCorreto: 'indeterminado', ajustePor: 'Administrador (aprovação) e depois o lado divergente',
      causaRaiz: `${ladoErrado} provisionou ${fmtR(v)} de honorários com base em e-mail da gestora. É um encargo possível pelo regulamento, mas só quando aprovado pelo administrador e documentado, e a aprovação ainda está "em andamento".`,
      evidencias: ['Provisões — linha nova', 'Regulamento — encargos (honorários advocatícios com aprovação)', 'Comunicações — e-mail da gestora'],
      raciocinio: [
        `Só o ${ladoErrado} tem a provisão de honorários de ${fmtR(v)}.`,
        'O regulamento permite honorários em defesa da classe, mas exige aprovação do administrador e documentação. Hoje só existe uma proposta e um e-mail dizendo que a aprovação está em andamento.',
        'A despesa provavelmente é legítima, mas ainda não cumpre o requisito. Não dá para dizer qual lado está certo sem a aprovação.',
      ],
      acao: `Pedir a aprovação formal do administrador. Sem ela, a provisão sai (lado ${ladoErrado}); com ela, os dois lados provisionam.`,
      gravidade: 'pendencia',
    }];
  },
};

const P14: Cenario = {
  id: 'provisao_duplicada', nome: 'Despesa fixa provisionada em duplicidade', dim: 'provisoes',
  aplicar: (c) => {
    const cod = escolher(c.rng, c.base.provisoes.filter((p) => p.regra.tipo === 'fixo' && !c.usados.has(`prov:${p.codigo}`)).map((p) => p.codigo));
    c.usados.add(`prov:${cod}`);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const orig = provDe(errado, cod);
    errado.provisoes.push({ ...structuredClone(orig), codigo: `${cod} (2)`, saldoAnterior: 0 });
    return [{
      cenario: 'provisao_duplicada', dimensoes: ['provisoes'], titulo: `Provisão de ${orig.descricao.replace(' a pagar', '')} duplicada`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} criou hoje uma segunda linha de provisão para ${orig.descricao.replace(' a pagar', '')}, com a mesma apropriação diária. A despesa está contada duas vezes.`,
      evidencias: ['Provisões — linhas com mesmo código/descrição'],
      raciocinio: [
        `O ${ladoErrado} tem uma linha a mais, "${cod} (2)", com saldo anterior zero e a mesma apropriação da linha original.`,
        'O regulamento/contrato prevê uma única despesa. A segunda linha parece um cadastro duplicado.',
      ],
      acao: `${ladoErrado} deve excluir a linha duplicada e reprocessar.`,
    }];
  },
};

const P15: Cenario = {
  id: 'metodo_exponencial_vs_linear', nome: 'Método de apropriação diferente do regulamento', dim: 'provisoes',
  aplicar: (c) => {
    const cod = usarTaxa(c, 'TXGES');
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    const prm = (provDe(errado, cod).regra as { param: { metodo: string } }).param;
    const metReg = c.reg.taxas.find((t) => t.codigo === cod)!.param.metodo;
    prm.metodo = metReg === 'linear_252' ? 'exponencial_252' : 'linear_252';
    return [{
      cenario: 'metodo_exponencial_vs_linear', dimensoes: ['provisoes'], titulo: `${nomeTaxa(cod)} com método ${prm.metodo === 'linear_252' ? 'linear' : 'exponencial'}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} apropria a ${nomeTaxa(cod)} pelo método ${prm.metodo === 'linear_252' ? 'linear (taxa/252)' : 'exponencial ((1+taxa)^(1/252)−1)'}; o regulamento prevê o ${metReg === 'linear_252' ? 'linear' : 'exponencial'}.`,
      evidencias: [`Provisões — ${cod}`, 'Regulamento — método de apropriação'],
      raciocinio: [
        `Diferença pequena e constante na apropriação de ${nomeTaxa(cod)}, sempre na mesma direção.`,
        'Testei os dois métodos sobre o PL de D−1: o linear e o exponencial geram exatamente os dois valores encontrados. O regulamento define qual vale.',
        'Mesmo pequena, é diferença de parametrização: acumula e pode gerar questionamento de cobrança acima do regulamento.',
      ],
      acao: `${ladoErrado} deve alinhar o método ao regulamento.`,
    }];
  },
};

export const CENARIOS: Cenario[] = [
  L00, L01,
  C01, C02, C03, C04, C05, C06, K02, C07, C08, C09, C10, C11, C12, C13, C14, C15, C16, C17, C18, C20, C21, C22, C23,
  K01, K03, K04, K05, K06, K07, K08, K09, K10, K11, K12, K14,
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15, P20,
];
export const porId = (id: string): Cenario => CENARIOS.find((c) => c.id === id)!;
export { diaUtilAnterior, sortear, com, hora, outro, COME_COTAS, ativoLivre, usarAtivo, ativoDe, provDe };
