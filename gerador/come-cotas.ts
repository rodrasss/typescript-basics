// Come-cotas: montagem da posição por cotista, da regra em texto e das informações de mercado.
// O come-cotas ocorre no penúltimo dia útil de maio e de novembro. Tudo aqui é simulado.

import type { Ctx } from './caso.ts';
import type { ComeCotas, PosicaoCotista, Posicao, Resultado } from './modelo.ts';
import { calcular, clonar } from './modelo.ts';
import { entre, inteiro, chance, truncar8, arredondar8, somaDiasUteis, comeCotasAnterior, fmtData } from './util.ts';

export interface OpcoesCC {
  /** uma posição tem como referência a cota de uma aplicação feita depois do último come-cotas */
  aplicacaoRecente?: boolean;
  /** uma posição está com a cota abaixo da referência (sem ganho) */
  prejuizo?: boolean;
  /** uma posição é de cotista isento/imune */
  isento?: boolean;
  /** prazo médio da carteira perto de 365 dias (a alíquota exige leitura cuidadosa) */
  limitrofe?: boolean;
  /** força a alíquota (0,20 = prazo médio até 365 dias; 0,15 = acima) */
  aliquota?: 0.15 | 0.2;
}

export const aliquotaPorPrazo = (prazoMedio: number): 0.15 | 0.2 => (prazoMedio <= 365 ? 0.2 : 0.15);

export const REGRA_COME_COTAS =
  'Come-cotas: ocorre no penúltimo dia útil de maio e de novembro e incide sobre as cotas existentes ao fim do dia, depois das conversões e cotizações de D. ' +
  'Para cada cotista tributado: ganho = max(0; (cota de fechamento de D − cota de referência) × quantidade de cotas); IR = alíquota × ganho, em reais e centavos; ' +
  'cotas retiradas = IR ÷ cota de fechamento de D, truncadas na 8ª casa. A cota de referência é a do último come-cotas ou a da aplicação, a mais recente; depois da incidência, a referência passa a ser a cota de D. ' +
  'Alíquota: 15% se o prazo médio da carteira em D for superior a 365 dias; 20% se for de até 365 dias (prazo médio informado pelo administrador). ' +
  'Cotistas isentos ou imunes não sofrem retenção. Posição com cota abaixo da referência não gera retenção nem devolução de cotas.';

export const REGRA_SEM_COME_COTAS = 'Este fundo não está sujeito ao come-cotas: o imposto é recolhido apenas no resgate, e o administrador não retira cotas em maio nem em novembro.';

const peso4 = (v: number): number => Math.round(v * 1e4) / 1e4;

export function montarConfigComeCotas(c: Ctx, opts: OpcoesCC = {}): { config: ComeCotas; prazoMedio: number } {
  const rng = c.rng;
  const r = calcular(clonar(c.base), c.calc);
  const cotaD = r.cota;
  const unico = c.tipo === 'EXCLUSIVO' || c.tipo === 'PREV';

  // prazo médio da carteira e alíquota
  const curto = opts.aliquota ? opts.aliquota === 0.2 : chance(rng, c.tipo === 'RF_DI' ? 0.7 : 0.4);
  let prazoMedio: number;
  if (opts.limitrofe) prazoMedio = curto ? inteiro(rng, 335, 365) : inteiro(rng, 366, 396);
  else prazoMedio = curto ? inteiro(rng, 60, 330) : inteiro(rng, 400, 1400);
  const aliquota = aliquotaPorPrazo(prazoMedio);

  // ganho típico do semestre, por tipo (sempre positivo para as posições "normais")
  const gSem = ['RF_DI', 'RF_CP', 'EXCLUSIVO', 'INFRA'].includes(c.tipo) ? entre(rng, 0.055, 0.075) : entre(rng, 0.02, 0.085);
  const n = unico ? 1 : inteiro(rng, 3, 5);
  const bruto = Array.from({ length: n }, () => entre(rng, 0.5, 2));
  const soma = bruto.reduce((a, b) => a + b, 0);
  const pesos = bruto.map((b) => peso4(b / soma));
  pesos[n - 1] = peso4(1 - pesos.slice(0, n - 1).reduce((a, b) => a + b, 0));

  const dataAnterior = comeCotasAnterior(c.data);
  // quem já estava no fundo no último come-cotas tem a MESMA cota de referência: a cota daquele dia
  const cotaRefUltimo = truncar8(cotaD / (1 + gSem));
  const idxRecente = opts.aplicacaoRecente ? (unico ? 0 : 1) : -1;
  const idxPrejuizo = opts.prejuizo && !unico ? n - 1 : -1;
  const idxIsento = opts.isento && !unico ? 0 : -1;
  const posicoes: PosicaoCotista[] = [];
  for (let i = 0; i < n; i++) {
    const id = `CT-${String(i + 1).padStart(2, '0')}`;
    const nome = unico ? 'Cotista único' : `Cotista ${String(inteiro(rng, 1000, 9999))}${i === idxIsento ? ' (entidade imune)' : ''}`;
    let origem: PosicaoCotista['origemReferencia'] = 'último come-cotas';
    let dataRef = dataAnterior;
    let cotaRef = cotaRefUltimo;
    if (i === idxRecente || i === idxPrejuizo) {
      const du = inteiro(rng, 20, 90);
      origem = 'aplicação';
      dataRef = somaDiasUteis(c.data, -du);
      const g = i === idxPrejuizo ? -entre(rng, 0.004, 0.03) : gSem * (du / 126) * entre(rng, 0.9, 1.1);
      cotaRef = truncar8(cotaD / (1 + g));
    }
    posicoes.push({
      id, cotista: nome, tratamento: i === idxIsento ? 'isento' : 'tributado', peso: pesos[i],
      cotaReferencia: cotaRef, dataReferencia: dataRef, origemReferencia: origem,
    });
  }
  if (r.cotasEmitidas > 0) {
    posicoes.push({
      id: 'CT-HJ', cotista: unico ? 'Cotista único (aplicações de hoje)' : 'Aplicações convertidas hoje', tratamento: 'tributado', peso: 0,
      cotaReferencia: 0, dataReferencia: c.data, origemReferencia: 'aplicação', aplicacoesDoDia: true,
    });
  }
  return {
    config: { aliquota, posicoes, aplicar: true, vezes: 1, cotaConversao: 'D', cotaD1: c.cotaAnterior, tributaIsentos: false, devolvePrejuizo: false },
    prazoMedio,
  };
}

/** Prepara o dia de come-cotas na posição correta (base): posições por cotista, prazo médio, regra e aviso do passivo. */
export function prepararComeCotas(c: Ctx, opts: OpcoesCC = {}): void {
  const { config, prazoMedio } = montarConfigComeCotas(c, opts);
  c.base.comeCotas = config;
  c.mercado.prazoMedioCarteira = prazoMedio;
  c.reg.especificos.push(REGRA_COME_COTAS);
  if (chance(c.rng, 0.6)) {
    c.comunicacoes.push({
      hora: '08:20', de: 'Passivo/escrituração', assunto: 'Come-cotas de hoje',
      texto: `Hoje (${fmtData(c.data)}) é dia de come-cotas deste fundo, conforme o regulamento (penúltimo dia útil de ${c.data.slice(5, 7) === '05' ? 'maio' : 'novembro'}).`,
    });
  }
}

/** Resultado do cálculo de uma posição, sem alterá-la. */
export function resultadoDe(c: Ctx, pos: Posicao): Resultado {
  return calcular(clonar(pos), c.calc);
}

export { arredondar8 };
