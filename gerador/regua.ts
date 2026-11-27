// Régua de materialidade (v1, PROVISÓRIA): o que é "variação baixa e normal" e o que reprova.
// Os limites vêm do responsável pelo processo e serão recalibrados com as opiniões dos analistas
// (veja base-de-opinioes/ e gerador/calibrar.ts). Este arquivo é a fonte única dos números:
// o gerador, o gabarito, regua.json, os documentos e os testes partem daqui.

import type { Posicao, Resultado } from './modelo.ts';
import type { Achado, Gravidade } from './caso.ts';
import { r2, fmtN, fmtR } from './util.ts';

export const REGUA = {
  versao: 'v1',
  status: 'provisória',
  /** diferença de cota (em cotas equivalentes) a partir da qual reprova */
  cotasMinimas: 250,
  /** diferença máxima tolerada, em reais, em cada provisão e no total das provisões */
  provisaoMaxReais: 100,
  /** o caixa não tem tolerância: precisa bater antes de acatar */
  caixaToleranciaReais: 0,
} as const;

export interface LadoMedido { posicao: Posicao; resultado: Resultado }

export interface MedidasRegua {
  versao: string;
  /** diferença na quantidade final de cotas */
  difQtdCotas: number;
  /** diferença de PL base expressa em cotas (÷ cota média) */
  difPlEmCotas: number;
  /** maior entre as duas anteriores: a medida da régua para a dimensão "cota" */
  difCotasEquivalentes: number;
  difCaixa: number;
  maiorDifProvisao: number;
  difTotalProvisoes: number;
  cota: { acima: boolean };
  caixa: { acima: boolean };
  provisoes: { acima: boolean };
}

function par(a: LadoMedido, b: LadoMedido): Omit<MedidasRegua, 'versao' | 'cota' | 'caixa' | 'provisoes'> {
  const cotaMedia = (a.resultado.cota + b.resultado.cota) / 2;
  const difQtdCotas = Math.abs(a.resultado.qtdFinal - b.resultado.qtdFinal);
  const difPlEmCotas = Math.abs(a.resultado.plBase - b.resultado.plBase) / cotaMedia;
  const codigos = new Set([...a.posicao.provisoes, ...b.posicao.provisoes].map((p) => p.codigo));
  let maior = 0;
  for (const cod of codigos) {
    const sa = a.posicao.provisoes.find((p) => p.codigo === cod)?.saldoAtual ?? 0;
    const sb = b.posicao.provisoes.find((p) => p.codigo === cod)?.saldoAtual ?? 0;
    maior = Math.max(maior, Math.abs(sa - sb));
  }
  return {
    difQtdCotas: Number(difQtdCotas.toFixed(8)),
    difPlEmCotas: Number(difPlEmCotas.toFixed(8)),
    difCotasEquivalentes: Number(Math.max(difQtdCotas, difPlEmCotas).toFixed(8)),
    difCaixa: r2(Math.abs(a.resultado.caixa - b.resultado.caixa)),
    maiorDifProvisao: r2(maior),
    difTotalProvisoes: r2(Math.abs(a.resultado.totalProvisoes - b.resultado.totalProvisoes)),
  };
}

/**
 * Mede a divergência do caso: Alfa × Beta e cada lado contra a posição correta (para pegar o caso em que os dois estão
 * iguais e errados, ou erros que se compensam entre os lados). Cada medida é o máximo entre as três comparações.
 */
export function medirRegua(alfa: LadoMedido, beta: LadoMedido, correta: LadoMedido): MedidasRegua {
  const ps = [par(alfa, beta), par(alfa, correta), par(beta, correta)];
  const max = (k: keyof ReturnType<typeof par>): number => Math.max(...ps.map((p) => p[k]));
  const m = {
    difQtdCotas: max('difQtdCotas'), difPlEmCotas: max('difPlEmCotas'), difCotasEquivalentes: max('difCotasEquivalentes'),
    difCaixa: max('difCaixa'), maiorDifProvisao: max('maiorDifProvisao'), difTotalProvisoes: max('difTotalProvisoes'),
  };
  return {
    versao: REGUA.versao, ...m,
    cota: { acima: m.difCotasEquivalentes >= REGUA.cotasMinimas },
    caixa: { acima: m.difCaixa > REGUA.caixaToleranciaReais + 0.005 },
    provisoes: { acima: m.maiorDifProvisao > REGUA.provisaoMaxReais || m.difTotalProvisoes > REGUA.provisaoMaxReais },
  };
}

/** Gravidade de um achado pela régua: só "pendência" e "informativo" são fixados pelo cenário; o resto vem dos números. */
export function gravidadeFinal(a: Achado, m: MedidasRegua): Gravidade {
  if (a.dimensoes.length === 0) return a.gravidade === 'pendencia' ? 'pendencia' : 'informativo';
  if (a.gravidade === 'pendencia') return 'pendencia';
  const acima = (a.dimensoes.includes('cota') && m.cota.acima) || (a.dimensoes.includes('caixa') && m.caixa.acima) || (a.dimensoes.includes('provisoes') && m.provisoes.acima);
  return acima ? 'erro' : 'ressalva';
}

/** Linha do raciocínio que mostra as medidas da régua que decidiram a gravidade do achado. */
export function linhaRegua(a: Achado, m: MedidasRegua): string {
  const partes: string[] = [];
  if (a.dimensoes.includes('cota')) {
    partes.push(`cota: diferença de ${fmtN(m.difCotasEquivalentes, 2)} cotas equivalentes (a maior entre ${fmtN(m.difQtdCotas, 2)} cotas de quantidade e ${fmtN(m.difPlEmCotas, 2)} cotas de PL), contra o limite de ${REGUA.cotasMinimas}: ${m.cota.acima ? 'ACIMA' : 'dentro'}`);
  }
  if (a.dimensoes.includes('caixa')) {
    partes.push(`caixa: diferença de ${fmtR(m.difCaixa)}; o caixa não tem tolerância e precisa bater antes de acatar: ${m.caixa.acima ? 'ACIMA' : 'bate'}`);
  }
  if (a.dimensoes.includes('provisoes')) {
    partes.push(`provisões: maior diferença numa provisão de ${fmtR(m.maiorDifProvisao)} e diferença total de ${fmtR(m.difTotalProvisoes)}, contra o limite de ${fmtR(REGUA.provisaoMaxReais)} por provisão e no total: ${m.provisoes.acima ? 'ACIMA' : 'dentro'}`);
  }
  return `Régua ${REGUA.versao} (provisória) — ${partes.join('; ')}.`;
}

export function sufixoAcao(g: Gravidade): string {
  if (g === 'erro') return 'Acima da régua: reprovar até o lado errado reprocessar.';
  if (g === 'ressalva') return 'Dentro da régua: aprovar com ressalva e corrigir na origem, para a diferença não se acumular.';
  return '';
}

export const REGUA_JSON = {
  versao: REGUA.versao,
  status: REGUA.status,
  aviso: 'Régua provisória: muda conforme os casos de uso e as opiniões dos analistas. Não é regra definitiva.',
  cota: { medida: 'cotas equivalentes = max(|Δ quantidade final de cotas|, |Δ PL base| ÷ cota média)', limiteCotas: REGUA.cotasMinimas, regra: 'abaixo do limite: dentro da régua (ressalva); a partir do limite: reprova' },
  caixa: { toleranciaReais: REGUA.caixaToleranciaReais, regra: 'sem tolerância: conciliar as movimentações completas dos dois lados; sem causa localizada, recomendar reprovação' },
  provisoes: { limiteReais: REGUA.provisaoMaxReais, regra: 'até o limite em cada provisão e no total: variação normal (ressalva); acima: reprova' },
  historico: [{ versao: 'v1', data: '2026-11-27', motivo: 'Primeira régua, definida pelo responsável do processo (250 cotas; caixa sem tolerância; R$ 100 em provisões), a ser calibrada com as opiniões dos analistas.' }],
};
