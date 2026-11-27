// Casos de fronteira da régua de materialidade (veja regua.ts): diferenças pequenas que ficam dentro da régua e
// diferenças logo acima dela. Cada cenário é primário (sem combinação), para a medida da régua ser a do próprio erro.

import type { Ctx } from './caso.ts';
import type { Cenario } from './cenarios.ts';
import { sortear, ativoLivre, usarAtivo, ativoDe, provDe } from './cenarios.ts';
import type { Ativo } from './modelo.ts';
import { reprecificar } from './modelo.ts';
import { resultadoDe } from './come-cotas.ts';
import { r2, entre, chance, escolher, fmtR, fmtN } from './util.ts';

const CLASSES_PRECIFICAVEIS = ['Título público', 'Debênture', 'CRA', 'Cota de fundo'];
const elegivel = (c: Ctx) => (a: Ativo): boolean => CLASSES_PRECIFICAVEIS.includes(a.classe) && !a.moeda && a.quantidade >= 500 && c.mercado.referencias.some((r) => r.ativo === a.codigo);

/** Diferença de preço de um ativo que equivale a uma quantidade de cotas dentro da faixa pedida. */
function cenarioCota(id: string, nome: string, faixa: [number, number]): Cenario {
  const dentro = faixa[1] < 250;
  return {
    id, nome, dim: 'cota',
    // só em fundo sem provisão de performance: ela absorveria 20% da diferença e acompanharia a cota, borrando a fronteira da régua
    aplicavel: (c) => !!ativoLivre(c, elegivel(c)) && !c.base.perf,
    aplicar: (c) => {
      const a = usarAtivo(c, elegivel(c));
      const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
      const cotaD = resultadoDe(c, certo).cota;
      const casas = a.classe === 'Cota de fundo' ? 8 : 6;
      const passo = Number(((entre(c.rng, faixa[0], faixa[1]) * cotaD) / a.quantidade).toFixed(casas));
      const novo = Number((a.preco + (chance(c.rng, 0.5) ? 1 : -1) * passo).toFixed(casas));
      reprecificar(ativoDe(errado, a.codigo), novo, c.revelarFonte ? 'ANBIMA — taxa indicativa (versão anterior do arquivo)' : undefined);
      const dValor = Math.abs(r2(a.quantidade * (novo - a.preco)));
      return [{
        cenario: id, dimensoes: ['cota'], titulo: `PU de ${a.codigo} com diferença ${dentro ? 'pequena' : 'relevante'}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
        causaRaiz: `${ladoErrado} carregou ${a.codigo} de uma versão anterior do arquivo de preços: PU ${fmtN(novo, casas)} em vez de ${fmtN(a.preco, casas)}, que é a referência de D.`,
        evidencias: [`Carteira — linha ${a.codigo}`, 'Informações de mercado — referência de preço de D', 'Regulamento — precificação'],
        raciocinio: [
          `A diferença de carteira está só em ${a.codigo}: mesma quantidade (${fmtN(a.quantidade, 0)}), PU ${fmtN(a.preco, casas)} (${ladoCerto}) contra ${fmtN(novo, casas)} (${ladoErrado}); diferença de valor de ${fmtR(dValor)}.`,
          `A referência de D é ${fmtN(a.preco, casas)}, igual à do ${ladoCerto}; o ${ladoErrado} está com um PU próximo, mas diferente.`,
          `Em cotas: ${fmtR(dValor)} ÷ cota de D (${fmtN(cotaD, 8)}) = ${fmtN(dValor / cotaD, 2)} cotas equivalentes.`,
        ],
        acao: `${ladoErrado} deve recarregar o PU de ${a.codigo} (${fmtN(a.preco, casas)}) e reprocessar.`,
      }];
    },
  };
}

/** Diferença na apropriação diária da auditoria, com o tamanho (em reais por dia) dentro da faixa pedida. */
function cenarioProvisao(id: string, nome: string, faixa: [number, number]): Cenario {
  const dentro = faixa[1] <= 100;
  return {
    id, nome, dim: 'provisoes',
    aplicavel: (c) => !c.usados.has('prov:AUDIT') && (!dentro || !c.base.perf),
    aplicar: (c) => {
      c.usados.add('prov:AUDIT');
      const { errado, ladoErrado, ladoCerto } = sortear(c);
      const regra = provDe(errado, 'AUDIT').regra as { tipo: 'fixo'; valorPeriodo: number; diasPeriodo: number };
      const antigo = regra.valorPeriodo;
      const alvoDia = r2(entre(c.rng, faixa[0], faixa[1]));
      const maior = chance(c.rng, 0.5) || antigo - alvoDia * regra.diasPeriodo < antigo * 0.2;
      const novo = Math.round(antigo + (maior ? 1 : -1) * alvoDia * regra.diasPeriodo);
      regra.valorPeriodo = novo;
      const apCerto = r2(antigo / regra.diasPeriodo);
      const apErrado = r2(novo / regra.diasPeriodo);
      return [{
        cenario: id, dimensoes: ['provisoes'], titulo: `Provisão de auditoria com diferença ${dentro ? 'pequena' : 'relevante'}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
        causaRaiz: `${ladoErrado} provisiona a auditoria por ${fmtR(novo)}/ano; o regulamento prevê ${fmtR(antigo)}/ano (diferença de ${fmtR(Math.abs(novo - antigo))} por ano).`,
        evidencias: ['Provisões — AUDIT', 'Regulamento — despesas fixas'],
        raciocinio: [
          `Só a apropriação de auditoria difere: ${fmtR(apCerto)} por dia (${ladoCerto}) contra ${fmtR(apErrado)} (${ladoErrado}), diferença de ${fmtR(Math.abs(apErrado - apCerto))}. O saldo anterior e as outras provisões batem.`,
          `O regulamento prevê ${fmtR(antigo)} por ano, apropriados por 1/${regra.diasPeriodo}: ${fmtR(apCerto)} por dia, como no ${ladoCerto}.`,
        ],
        acao: `${ladoErrado} deve voltar o valor anual da auditoria para ${fmtR(antigo)} e reprocessar.`,
      }];
    },
  };
}

const REGUA_CAIXA_BAIXO: Cenario = {
  id: 'reg_caixa_baixo', nome: 'Diferença de poucos reais no caixa (lançamento só de um lado)', dim: 'caixa',
  preparar: (c) => {
    const v = r2(entre(c.rng, 0.4, 9.9));
    const hist = escolher(c.rng, ['Crédito de remuneração do saldo em conta corrente', 'Rendimento de conta remunerada (crédito do banco)']);
    c.base.caixa.lancamentos.push({ historico: hist, valor: v });
    c.usados.add(`cxb:${hist}|${v}`);
  },
  aplicar: (c) => {
    const [hist, vs] = [...c.usados].find((u) => u.startsWith('cxb:'))!.slice(4).split('|');
    const v = Number(vs);
    const { errado, ladoErrado, ladoCerto } = sortear(c);
    errado.caixa.lancamentos = errado.caixa.lancamentos.filter((l) => l.historico !== hist);
    return [{
      cenario: 'reg_caixa_baixo', dimensoes: ['caixa'], titulo: `Crédito bancário de ${fmtR(v)} só num dos lados`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não registrou o crédito de ${fmtR(v)} ("${hist}") que o ${ladoCerto} registrou.`,
      evidencias: ['Caixa — lançamentos dos dois lados, comparados linha a linha'],
      raciocinio: [
        `O caixa do ${ladoErrado} está ${fmtR(v)} abaixo do ${ladoCerto}. Comparei as movimentações completas dos dois lados: todos os lançamentos são iguais, exceto "${hist}" (${fmtR(v)}), que só o ${ladoCerto} tem.`,
        'O histórico é de crédito do próprio banco, o que explica a diferença por inteiro. O valor é pequeno, mas o caixa não tem tolerância: precisa bater antes de acatar.',
      ],
      acao: `${ladoErrado} deve registrar o crédito de ${fmtR(v)} ("${hist}").`,
    }];
  },
};

const REGUA_CAIXA_SEM_CAUSA: Cenario = {
  id: 'reg_caixa_sem_causa', nome: 'Caixa divergente sem causa localizada nas movimentações', dim: 'caixa',
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    const delta = r2(entre(c.rng, 85, 4800));
    errado.caixa.saldoInicial = r2(errado.caixa.saldoInicial + (chance(c.rng, 0.5) ? 1 : -1) * delta);
    const n = c.base.caixa.lancamentos.length;
    return [{
      cenario: 'reg_caixa_sem_causa', dimensoes: ['caixa'], titulo: 'Caixa diverge e a causa não está nas movimentações de D', ladoCorreto: 'indeterminado', ajustePor: 'Alfa e Beta (investigar o saldo inicial e o extrato bancário)',
      causaRaiz: 'A diferença de caixa já existe no saldo inicial (D−1) e nenhum lançamento de D a explica; com as informações recebidas não é possível localizar a causa nem dizer qual lado está certo.',
      evidencias: ['Caixa — saldo inicial e lançamentos dos dois lados, comparados linha a linha'],
      raciocinio: [
        `O caixa diverge em ${fmtR(Math.abs(certo.caixa.saldoInicial - errado.caixa.saldoInicial))}. Comparei as movimentações completas: ${n === 0 ? 'não há lançamentos em D' : `os ${n} lançamentos de D são idênticos nos dois lados, nos mesmos valores`}.`,
        `A diferença está no saldo inicial: ${fmtR(c.alfa.caixa.saldoInicial)} no Alfa e ${fmtR(c.beta.caixa.saldoInicial)} no Beta. Ela vem do fechamento de D−1, que não está nesta entrada, e não há como dizer se o erro é nosso ou do ${ladoCerto === 'Alfa' ? 'Beta' : 'Alfa'}.`,
        'Pelo critério do processo, se a causa não é localizada nas movimentações, recomenda-se a reprovação.',
      ],
      acao: 'Recomendar a reprovação: o caixa não bate e a causa não foi localizada nas movimentações de D. Investigar o fechamento de D−1 e o extrato bancário dos dois lados.',
    }];
  },
};

export const CENARIOS_REGUA: Cenario[] = [
  cenarioCota('reg_cota_dentro', 'Diferença de preço abaixo da régua de cotas', [60, 235]),
  cenarioCota('reg_cota_acima', 'Diferença de preço acima da régua de cotas', [265, 600]),
  cenarioProvisao('reg_provisao_dentro', 'Diferença de provisão dentro da régua (até R$ 100)', [15, 95]),
  cenarioProvisao('reg_provisao_acima', 'Diferença de provisão acima da régua (acima de R$ 100)', [115, 400]),
  REGUA_CAIXA_BAIXO,
  REGUA_CAIXA_SEM_CAUSA,
];
