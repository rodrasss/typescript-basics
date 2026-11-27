// Renderização em Markdown: a ENTRADA (o que o agente recebe, "de mão beijada") e o GABARITO (a solução esperada).

import type { Caso } from './gerar.ts';
import type { Ativo, Posicao, Resultado, MovPassivo } from './modelo.ts';
import { textoTaxa, gravidadeEfetiva } from './caso.ts';
import { fmtR, fmtN, fmtPct, fmtData } from './util.ts';

const NA = '—';

function tabela(cab: string[], linhas: string[][]): string {
  const esc = (s: string): string => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  return [`| ${cab.map(esc).join(' | ')} |`, `|${cab.map(() => '---').join('|')}|`, ...linhas.map((l) => `| ${l.map(esc).join(' | ')} |`)].join('\n');
}
const dif = (a: number, b: number, casas = 2): string => {
  const d = Number((b - a).toFixed(casas));
  return fmtN(Math.abs(d) < Math.pow(10, -casas) / 2 ? 0 : d, casas);
};
const casasPU = (a: Ativo): number => (a.classe === 'Ação' || a.classe === 'Participação' ? 2 : a.classe === 'Cota de fundo' ? 8 : a.classe === 'Ativo no exterior' ? 4 : a.classe === 'Direito creditório' || a.classe === 'Imóvel' || a.classe === 'Redutora' ? 2 : 6);
function celulaPU(a?: Ativo): string {
  if (!a) return NA;
  if (a.moeda === 'USD') return `USD ${fmtN(a.precoOrigem ?? a.preco, 4)} × ${fmtN(a.cambio ?? 0, 4)}`;
  return fmtN(a.preco, casasPU(a));
}
function celulaQtd(a?: Ativo): string {
  if (!a) return NA;
  const casas = a.classe === 'Cota de fundo' ? 8 : a.classe === 'Ativo no exterior' ? 6 : a.classe === 'Direito creditório' || a.classe === 'Imóvel' ? 2 : 0;
  return fmtN(a.quantidade, casas);
}

function unirPorChave<T>(xs: T[], ys: T[], chave: (t: T) => string): { k: string; x?: T; y?: T }[] {
  const r: { k: string; x?: T; y?: T }[] = [];
  const usados = new Set<number>();
  for (const x of xs) {
    const k = chave(x);
    const j = ys.findIndex((y, i) => !usados.has(i) && chave(y) === k);
    if (j >= 0) usados.add(j);
    r.push({ k, x, y: j >= 0 ? ys[j] : undefined });
  }
  ys.forEach((y, i) => { if (!usados.has(i)) r.push({ k: chave(y), y }); });
  return r;
}

function secaoPerfil(c: Caso): string {
  const f = c.fundo;
  const L: string[] = [];
  L.push(`# Caso ${c.id} — ${f.nome}`, '');
  L.push(`> **Data-base (D):** ${fmtData(c.data)} (${c.diaSemana}) · **D−1:** ${fmtData(c.dAnterior)} · **Fundo:** ${f.codigo}`, '');
  L.push('## 1. O fundo', '', f.historia, '');
  L.push(tabela(['Campo', 'Valor'], [
    ['Tipo', f.rotulo], ['Classe', f.classe], ['Condomínio', f.condominio], ['Gestora', `${f.gestora.nome} (${f.gestora.cidade})`],
    ['PL em D−1', fmtR(c.anterior.pl)], ['Cota em D−1', fmtN(c.anterior.cota, 8)], ['Quantidade de cotas em D−1', fmtN(c.anterior.qtdCotas, 8)],
  ]), '');
  return L.join('\n');
}

function secaoRegulamento(c: Caso): string {
  const r = c.regulamento;
  const L: string[] = ['## 2. Regulamento (extrato simulado)', ''];
  L.push(`**Vigência:** ${r.vigencia}`, '');
  L.push('**Taxas**', '', ...r.taxas.map((t) => `- ${textoTaxa(t)}`), '');
  if (r.performance) {
    L.push('**Taxa de performance**', '',
      `- ${fmtPct(r.performance.pct, 0)} sobre o que exceder ${r.performance.benchmark}; ${r.performance.periodicidade}.`,
      `- ${r.performance.linhaDagua}`, `- ${r.performance.metodo}`, '');
  }
  L.push('**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**', '',
    ...r.despesasFixas.map((d) => `- ${d.nome}: ${fmtR(d.valor)} (${d.periodo})${d.observacao ? ` — ${d.observacao}` : ''}`), '');
  L.push('**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**', '',
    ...r.tabelaCVM.map((f, i) => `- ${f.ate === null ? `acima de ${fmtR(r.tabelaCVM[i - 1].ate!)}` : `até ${fmtR(f.ate)}`}: ${fmtR(f.valor)} por trimestre`),
    `- PL de referência deste fundo no trimestre: ${fmtR(r.plReferenciaCVM)}. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.`, '');
  L.push('**Encargos do fundo**', '', ...r.encargos.map((e) => `- ${e}`), '', '**Não são encargos do fundo**', '', ...r.naoEncargos.map((e) => `- ${e}`), '');
  L.push('**Aplicação, resgate e cota**', '', ...r.cotizacao.map((x) => `- ${x}`), `- ${r.cota}`, `- Tributação: ${r.tributacao}`, '');
  L.push('**Precificação dos ativos**', '', ...r.precificacao.map((x) => `- ${x}`), '');
  if (r.especificos.length) L.push('**Regras específicas deste fundo**', '', ...r.especificos.map((x) => `- ${x}`), '');
  if (r.alteracoes.length) L.push('**Alterações recentes**', '', ...r.alteracoes.map((x) => `- ${x}`), '');
  return L.join('\n');
}

function secaoMercado(c: Caso): string {
  const m = c.mercado;
  const L: string[] = ['## 3. Informações de mercado do dia', ''];
  L.push(`- CDI: ${fmtPct(m.cdiAA, 2)} a.a.`);
  if (m.ptax) L.push(`- PTAX de ${fmtData(c.data)}: compra ${fmtN(m.ptax.compraD, 4)} / venda ${fmtN(m.ptax.vendaD, 4)}; PTAX de venda de ${fmtData(c.dAnterior)}: ${fmtN(m.ptax.vendaD1, 4)}`);
  L.push('');
  if (m.referencias.length) L.push('**Referências de preço**', '', tabela(['Ativo', 'Fonte', 'Valor', 'Observação'], m.referencias.map((r) => [r.ativo, r.fonte, r.valor, r.obs ?? ''])), '');
  if (m.futuros.length) L.push('**Futuros (posição de D e ajuste do dia por contrato)**', '', tabela(['Contrato', 'Quantidade (+comprado / −vendido)', 'Ajuste de D por contrato (R$)'], m.futuros.map((f) => [f.contrato, fmtN(f.quantidade, 0), fmtN(f.ajustePorContrato, 2)])), '');
  if (m.eventos.length) L.push('**Eventos de ativos**', '', ...m.eventos.map((e) => `- ${e}`), '');
  if (m.benchmarks.length) L.push('**Benchmark**', '', ...m.benchmarks.map((e) => `- ${e}`), '');
  return L.join('\n');
}

function secaoComunicacoes(c: Caso): string {
  const L: string[] = ['## 4. Comunicações recebidas hoje', ''];
  if (!c.comunicacoes.length) L.push('Nenhuma comunicação relevante recebida.', '');
  for (const m of c.comunicacoes) L.push(`- **${m.hora}** — *${m.de}* — **${m.assunto}**: ${m.texto}`);
  L.push('');
  return L.join('\n');
}

function secaoBatimento(c: Caso): string {
  const x = c.lados.Alfa;
  const s = c.lados.Beta;
  const L: string[] = ['## 5. Batimento Alfa × Beta', '', '_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._', ''];

  // 5.1 resumo
  L.push('### 5.1 Resumo', '', tabela(['Validação', 'Alfa', 'Beta', 'Diferença (Beta − Alfa)'], [
    ['Cota de fechamento', fmtN(x.resultado.cota, 8), fmtN(s.resultado.cota, 8), fmtN(Number((s.resultado.cota - x.resultado.cota).toFixed(8)), 8)],
    ['Quantidade final de cotas', fmtN(x.resultado.qtdFinal, 8), fmtN(s.resultado.qtdFinal, 8), dif(x.resultado.qtdFinal, s.resultado.qtdFinal, 8)],
    ['PL final', fmtR(x.resultado.plFinal), fmtR(s.resultado.plFinal), fmtR(Number((s.resultado.plFinal - x.resultado.plFinal).toFixed(2)))],
    ['Caixa', fmtR(x.resultado.caixa), fmtR(s.resultado.caixa), fmtR(Number((s.resultado.caixa - x.resultado.caixa).toFixed(2)))],
    ['Total de provisões', fmtR(x.resultado.totalProvisoes), fmtR(s.resultado.totalProvisoes), fmtR(Number((s.resultado.totalProvisoes - x.resultado.totalProvisoes).toFixed(2)))],
  ]), '');

  // 5.2 carteira
  const linhas = unirPorChave(x.posicao.ativos, s.posicao.ativos, (a) => a.codigo);
  const totX = x.resultado.totalAtivos;
  const totS = s.resultado.totalAtivos;
  L.push('### 5.2 Carteira', '', tabela(
    ['Ativo', 'Qtd Alfa', 'Qtd Beta', 'PU Alfa', 'PU Beta', 'Valor Alfa', 'Valor Beta', 'Δ valor', 'Fonte do preço'],
    [
      ...linhas.map(({ k, x: a, y: b }) => [
        `${k} — ${(a ?? b)!.descricao}`, celulaQtd(a), celulaQtd(b), celulaPU(a), celulaPU(b), a ? fmtN(a.valor, 2) : NA, b ? fmtN(b.valor, 2) : NA,
        dif(a?.valor ?? 0, b?.valor ?? 0),
        a && b && a.fonte !== b.fonte ? `Alfa: ${a.fonte} / Beta: ${b.fonte}` : (a ?? b)!.fonte,
      ]),
      ['**Total**', '', '', '', '', fmtN(totX, 2), fmtN(totS, 2), dif(totX, totS), ''],
    ]), '');

  // 5.3 caixa
  const lx = x.posicao.caixa.lancamentos;
  const ls = s.posicao.caixa.lancamentos;
  const lc = unirPorChave(lx, ls, (l) => l.historico);
  L.push('### 5.3 Caixa', '', tabela(['Lançamento', 'Alfa', 'Beta'], [
    ['Saldo inicial (D−1)', fmtN(x.posicao.caixa.saldoInicial, 2), fmtN(s.posicao.caixa.saldoInicial, 2)],
    ...lc.map(({ k, x: a, y: b }) => [k, a ? fmtN(a.valor, 2) : NA, b ? fmtN(b.valor, 2) : NA]),
    ['**Saldo final**', fmtN(x.resultado.caixa, 2), fmtN(s.resultado.caixa, 2)],
  ]), '');

  // 5.4 a receber / a pagar
  const itens = (titulo: string, lx2: { codigo: string; descricao: string; valor: number }[], ls2: { codigo: string; descricao: string; valor: number }[]): void => {
    L.push(`### ${titulo}`, '');
    const u = unirPorChave(lx2, ls2, (i) => i.codigo);
    if (!u.length) { L.push('Nenhum item.', ''); return; }
    L.push(tabela(['Item', 'Alfa', 'Beta'], u.map(({ x: a, y: b }) => [`${(a ?? b)!.codigo} — ${(a ?? b)!.descricao}`, a ? fmtN(a.valor, 2) : NA, b ? fmtN(b.valor, 2) : NA])), '');
  };
  itens('5.4 Valores a receber', x.posicao.aReceber, s.posicao.aReceber);
  itens('5.5 Valores a pagar', x.posicao.aPagar, s.posicao.aPagar);

  // 5.6 provisões
  const un = unirPorChave(x.posicao.provisoes, s.posicao.provisoes, (p) => p.codigo);
  L.push('### 5.6 Provisões', '', tabela(
    ['Provisão', 'Saldo anterior Alfa', 'Saldo anterior Beta', 'Apropriação Alfa', 'Apropriação Beta', 'Pagamento Alfa', 'Pagamento Beta', 'Saldo atual Alfa', 'Saldo atual Beta', 'Δ saldo'],
    [
      ...un.map(({ k, x: a, y: b }) => [
        `${k} — ${(a ?? b)!.descricao}`, a ? fmtN(a.saldoAnterior, 2) : NA, b ? fmtN(b.saldoAnterior, 2) : NA, a ? fmtN(a.apropriacao, 2) : NA, b ? fmtN(b.apropriacao, 2) : NA,
        a ? fmtN(a.pagamento, 2) : NA, b ? fmtN(b.pagamento, 2) : NA, a ? fmtN(a.saldoAtual, 2) : NA, b ? fmtN(b.saldoAtual, 2) : NA, dif(a?.saldoAtual ?? 0, b?.saldoAtual ?? 0),
      ]),
      ['**Total**', '', '', '', '', '', '', fmtN(x.resultado.totalProvisoes, 2), fmtN(s.resultado.totalProvisoes, 2), dif(x.resultado.totalProvisoes, s.resultado.totalProvisoes)],
    ]), '');
  if (c.memoriaDisponivel) {
    L.push('**Memória de cálculo informada por cada lado**', '');
    for (const { k, x: a, y: b } of un) {
      L.push(`- **${k}** — Alfa: ${a?.memoria || NA}${b ? ` · Beta: ${b.memoria || NA}` : ''}`);
    }
    L.push('');
  } else {
    L.push('_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._', '');
  }

  // 5.7 passivo
  const mx = x.posicao.movs;
  const ms = s.posicao.movs;
  const mu = unirPorChave(mx, ms, (m) => m.id);
  const valor = (m: MovPassivo): string => (m.valor !== undefined && m.cotas === undefined ? fmtR(m.valor) : m.cotas !== undefined ? `${fmtN(m.cotas, 8)} cotas${m.valor !== undefined ? ` (${fmtR(m.valor)})` : ''}` : NA);
  L.push('### 5.7 Passivo (aplicações, resgates e demais movimentos)', '');
  if (!mu.length) L.push('Nenhum movimento de passivo no dia.', '');
  else {
    L.push(tabela(['ID', 'Tipo', 'Cotista', 'Valor / cotas', 'Crédito às', 'Solicitado em', 'Cotização', 'Liquidação', 'Converte/cotiza hoje? Alfa', 'Converte/cotiza hoje? Beta', 'Observação'],
      mu.map(({ x: a, y: b }) => {
        const m = (a ?? b)!;
        return [m.id, m.tipo, m.cotista, valor(m), m.recebidoAs ?? '', fmtData(m.solicitadoEm), fmtData(m.cotizacao), fmtData(m.liquidacao), a ? (a.converterHoje ? 'sim' : 'não') : 'não registrado', b ? (b.converterHoje ? 'sim' : 'não') : 'não registrado', m.observacao ?? ''];
      })), '');
  }

  // 5.8 fechamento
  const f = (k: keyof Resultado, casas = 2): string[] => {
    const a = x.resultado[k] as number | undefined;
    const b = s.resultado[k] as number | undefined;
    return [a === undefined ? NA : fmtN(a, casas), b === undefined ? NA : fmtN(b, casas), a === undefined || b === undefined ? NA : dif(a, b, casas)];
  };
  const linhasF: [string, string[]][] = [
    ['Total de ativos', f('totalAtivos')], ['Caixa', f('caixa')], ['Valores a receber', f('totalReceber')], ['Valores a pagar', f('totalPagar')], ['Provisões', f('totalProvisoes')],
    ['PL antes das apropriações do dia (saldos anteriores das provisões)', f('plAntesApropriacoes')], ['PL base da cota', f('plBase')], ['Cota (8 casas)', f('cota', 8)], ['Aplicações convertidas', f('aplicacoesConvertidas')], ['Cotas emitidas', f('cotasEmitidas', 8)],
    ['Cotas resgatadas', f('cotasResgatadas', 8)], ['Valor dos resgates cotizados', f('valorResgates')], ['IR de come-cotas', f('irComeCotas')],
    ['Cotas retiradas (come-cotas)', f('cotasComeCotas', 8)], ['Quantidade final de cotas', f('qtdFinal', 8)], ['PL final', f('plFinal')],
  ];
  L.push('### 5.8 Fechamento do dia', '', tabela(['Item', 'Alfa', 'Beta', 'Δ'], linhasF.map(([k, v]) => [k, ...v])), '');
  return L.join('\n');
}

export function renderEntrada(c: Caso): string {
  return [secaoPerfil(c), secaoRegulamento(c), secaoMercado(c), secaoComunicacoes(c), secaoBatimento(c)].join('\n');
}

const PARECER_TXT = { APROVADO: 'APROVADO', REPROVADO: 'REPROVADO', PENDENTE: 'PENDENTE' } as const;

export function renderGabarito(c: Caso): string {
  const g = c.gabarito;
  const L: string[] = ['## GABARITO (não faz parte da entrada)', ''];
  L.push(`**Parecer:** ${PARECER_TXT[g.parecer]}${g.ressalva ? ' (com ressalva)' : ''}`, '', `**Resumo:** ${g.resumo}`, '', `**Dificuldade:** ${g.dificuldade} · **Cenários:** ${g.cenarios.join(', ')}`, '');
  if (!g.achados.length) L.push('Sem achados.', '');
  g.achados.forEach((a, i) => {
    L.push(`### Achado ${i + 1}: ${a.titulo}`, '');
    L.push(`- **Gravidade:** ${gravidadeEfetiva(a)} · **Dimensões:** ${a.dimensoes.length ? a.dimensoes.join(', ') : 'nenhuma'}`);
    L.push(`- **Lado correto:** ${a.ladoCorreto} · **Quem ajusta:** ${a.ajustePor}`);
    L.push(`- **Causa raiz:** ${a.causaRaiz}`);
    L.push(`- **Onde olhar:** ${a.evidencias.join('; ')}`);
    L.push('- **Raciocínio do analista:**', ...a.raciocinio.map((r, j) => `  ${j + 1}. ${r}`));
    L.push(`- **Ação:** ${a.acao}`, '');
  });
  L.push('### Quem está correto em cada dimensão (derivado dos números)', '', tabela(['Dimensão', 'Lado cujo valor coincide com a posição correta'], (['cota', 'caixa', 'provisoes'] as const).map((d) => [d, g.corretoPorDimensao[d]])), '');
  if (g.valoresCorretos) {
    const v = g.valoresCorretos;
    L.push('### Valores corretos após os ajustes', '', tabela(['Item', 'Valor'], [
      ['Cota', fmtN(v.cota, 8)], ['Quantidade final de cotas', fmtN(v.qtdFinal, 8)], ['PL final', fmtR(v.plFinal)], ['Caixa', fmtR(v.caixa)], ['Total de provisões', fmtR(v.totalProvisoes)],
    ]), '');
  } else L.push('### Valores corretos', '', 'Indefinidos: dependem de uma decisão externa (comitê, identificação do remetente ou aprovação formal).', '');
  if (g.armadilhas.length) L.push('### Armadilhas deste caso', '', ...g.armadilhas.map((a) => `- ${a}`), '');
  return L.join('\n');
}

export function renderCompleto(c: Caso): string {
  return `${renderEntrada(c)}\n---\n\n${renderGabarito(c)}`;
}
export type { Posicao };
