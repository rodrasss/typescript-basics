// Sessão "come-cotas": cenários de validação em dia de come-cotas (penúltimo dia útil de maio e de novembro).
// Cada cenário parte de uma posição correta por cotista e introduz um erro em um dos lados. Tudo é simulado.

import type { Ctx, Achado } from './caso.ts';
import type { Cenario } from './cenarios.ts';
import { sortear, com, hora, COME_COTAS } from './cenarios.ts';
import type { TipoFundo } from './catalogo.ts';
import type { Posicao, Resultado } from './modelo.ts';
import { prepararComeCotas, montarConfigComeCotas, resultadoDe, aliquotaPorPrazo, REGRA_SEM_COME_COTAS } from './come-cotas.ts';
import { datasComeCotas, ultimoDiaUtilDoMes, fmtR, fmtN, fmtPct, fmtData, entre, chance, truncar8, r2 } from './util.ts';

export const DATAS_COME_COTAS = datasComeCotas([2025, 2026]);
const VARIOS_COTISTAS: TipoFundo[] = ['RF_DI', 'RF_CP', 'FIM_MACRO', 'FIM_LS', 'FIC_FIM', 'CAMBIAL'];
const COM_PREJUIZO: TipoFundo[] = ['FIM_MACRO', 'FIM_LS', 'FIC_FIM', 'CAMBIAL'];
const SEM_COME_COTAS: TipoFundo[] = ['FIA', 'PREV', 'INFRA', 'IE'];

const mes = (c: Ctx): string => (c.data.slice(5, 7) === '05' ? 'maio' : 'novembro');
const det = (r: Resultado, id: string) => r.detalheComeCotas.find((d) => d.id === id)!;
const prazo = (c: Ctx): number => c.mercado.prazoMedioCarteira!;
const fraseRecalculo = (c: Ctx): string =>
  `ganho = (cota de D − cota de referência) × cotas; IR = alíquota × ganho; cotas retiradas = IR ÷ cota de D (cota de D = ${fmtN(resultadoDe(c, c.base).cota, 8)})`;

function avaliar(c: Ctx, certo: Posicao, errado: Posicao): { rc: Resultado; re: Resultado } {
  return { rc: resultadoDe(c, certo), re: resultadoDe(c, errado) };
}

const base = (id: string, nome: string, tipos: TipoFundo[]): Pick<Cenario, 'id' | 'nome' | 'dim' | 'tipos' | 'datas'> => ({ id, nome, dim: 'cota', tipos, datas: DATAS_COME_COTAS });

// ----------------------------------------------------------------------------- correto
const CC00: Cenario = {
  ...base('cc_correto', 'Come-cotas processado corretamente pelos dois lados', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, {
    aplicacaoRecente: chance(c.rng, 0.5),
    prejuizo: COM_PREJUIZO.includes(c.tipo) && chance(c.rng, 0.35),
    isento: VARIOS_COTISTAS.includes(c.tipo) && chance(c.rng, 0.35),
    limitrofe: chance(c.rng, 0.3),
  }),
  aplicar: (c) => {
    const r = resultadoDe(c, c.base);
    const cc = c.base.comeCotas!;
    const linhas = cc.posicoes.map((p) => {
      const d = det(r, p.id);
      const nota = p.tratamento === 'isento' ? 'isento, sem retenção' : d.ganho <= 0 ? 'cota abaixo da referência, sem retenção' : `ganho ${fmtR(d.ganho)}, IR ${fmtR(d.ir)}, ${fmtN(d.cotasRetiradas, 8)} cotas retiradas`;
      return `${p.id} (${p.cotista}): ${nota}.`;
    });
    return [{
      cenario: 'cc_correto', dimensoes: [], titulo: 'Come-cotas conferido: os dois lados estão corretos', ladoCorreto: 'nenhum', ajustePor: 'ninguém',
      causaRaiz: 'Os dois lados processaram o come-cotas da mesma forma e conforme o regulamento.',
      evidencias: ['Come-cotas (posição por cotista)', 'Regulamento — come-cotas', 'Informações de mercado — prazo médio da carteira'],
      raciocinio: [
        `Data: ${fmtData(c.data)} é o penúltimo dia útil de ${mes(c)} (o último é ${fmtData(ultimoDiaUtilDoMes(c.data))}), então hoje é dia de come-cotas.`,
        `Alíquota: o prazo médio da carteira é de ${fmtN(prazo(c), 0)} dias, ${prazo(c) <= 365 ? 'até 365' : 'acima de 365'}, então ${fmtPct(cc.aliquota, 0)}. Os dois lados usaram essa alíquota.`,
        `Recalculei posição a posição (${fraseRecalculo(c)}): ${linhas.join(' ')}`,
        `Totais: IR ${fmtR(r.irComeCotas)} e ${fmtN(r.cotasComeCotas, 8)} cotas retiradas, iguais nos dois lados. A quantidade final de cotas bate.`,
      ],
      acao: 'Nenhuma ação sobre o come-cotas. Cota e quantidade de cotas podem ser aprovadas (se o restante do dia também confere).', gravidade: 'informativo',
    }];
  },
};

// ----------------------------------------------------------------------------- não aplicado
const CC01: Cenario = {
  ...base('cc_nao_aplicado', 'Come-cotas não processado', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { aplicacaoRecente: chance(c.rng, 0.5), isento: VARIOS_COTISTAS.includes(c.tipo) && chance(c.rng, 0.3), limitrofe: chance(c.rng, 0.2) }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, aplicar: false };
    const { rc } = avaliar(c, certo, errado);
    if (chance(c.rng, 0.5)) com(c, hora(c, 7, 9), `${ladoErrado} — operações`, 'Falha de rotina na madrugada', 'A rotina de come-cotas deste fundo não concluiu na madrugada e ainda não foi reprocessada.');
    return [{
      cenario: 'cc_nao_aplicado', dimensoes: ['cota'], titulo: 'Come-cotas não processado', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} não processou o come-cotas de ${fmtData(c.data)}: não retirou cotas nem calculou IR.`,
      evidencias: ['Come-cotas (posição por cotista)', 'Quantidade final de cotas', 'Regulamento — come-cotas'],
      raciocinio: [
        `A cota é igual nos dois lados, mas a quantidade final de cotas do ${ladoErrado} é ${fmtN(rc.cotasComeCotas, 8)} cotas maior, e a tabela de come-cotas dele está sem IR nem cotas retiradas.`,
        `Hoje é o penúltimo dia útil de ${mes(c)}, dia de come-cotas pelo regulamento. Recalculei (${fraseRecalculo(c)}): ${fmtR(rc.irComeCotas)} de IR e ${fmtN(rc.cotasComeCotas, 8)} cotas retiradas, que é o que o ${ladoCerto} fez.`,
        'Sem o come-cotas, o IR não é retido no prazo e as posições dos cotistas ficam erradas.',
      ],
      acao: `${ladoErrado} deve processar o come-cotas (${fmtN(rc.cotasComeCotas, 8)} cotas e ${fmtR(rc.irComeCotas)} de IR) antes de fechar o passivo.`,
    }];
  },
};

// ----------------------------------------------------------------------------- calendário
const CC02: Cenario = {
  ...base('cc_calendario_ultimo_dia', 'Come-cotas agendado para o último dia útil, e não o penúltimo', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { aplicacaoRecente: chance(c.rng, 0.4), limitrofe: chance(c.rng, 0.2) }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, aplicar: false };
    const { rc } = avaliar(c, certo, errado);
    const ultimo = ultimoDiaUtilDoMes(c.data);
    com(c, hora(c, 8, 10), `${ladoErrado} — operações`, 'Come-cotas agendado', `Informamos que o come-cotas deste fundo está agendado para o último dia útil de ${mes(c)} (${fmtData(ultimo)}).`);
    return [{
      cenario: 'cc_calendario_ultimo_dia', dimensoes: ['cota'], titulo: 'Come-cotas parametrizado para o último dia útil', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} parametrizou o come-cotas deste fundo para o último dia útil (${fmtData(ultimo)}); o regulamento manda o penúltimo (${fmtData(c.data)}).`,
      evidencias: ['Regulamento — data do come-cotas', 'Comunicações — aviso de agendamento', 'Come-cotas (posição por cotista)', 'Quantidade final de cotas'],
      raciocinio: [
        `O ${ladoErrado} não processou o come-cotas hoje (quantidade de cotas ${fmtN(rc.cotasComeCotas, 8)} maior que a do ${ladoCerto}), e o aviso das operações dele diz que está agendado para ${fmtData(ultimo)}.`,
        `O regulamento fixa o penúltimo dia útil de ${mes(c)}, que é hoje (${fmtData(c.data)}); o último dia útil é ${fmtData(ultimo)}. O agendamento está um dia depois do devido.`,
        `Recalculei o come-cotas (${fraseRecalculo(c)}): ${fmtR(rc.irComeCotas)} de IR e ${fmtN(rc.cotasComeCotas, 8)} cotas retiradas, como no ${ladoCerto}.`,
      ],
      acao: `${ladoErrado} deve corrigir o calendário do fundo (penúltimo dia útil de maio e de novembro) e processar o come-cotas de hoje antes de fechar o passivo. Verificar os outros fundos com a mesma parametrização.`,
    }];
  },
};

// ----------------------------------------------------------------------------- fundo isento
const CC03: Cenario = {
  ...base('cc_isento_tributado', 'Come-cotas aplicado em fundo que não está sujeito a ele', SEM_COME_COTAS),
  preparar: (c) => {
    c.reg.especificos.push(REGRA_SEM_COME_COTAS);
    c.mercado.prazoMedioCarteira = Math.round(entre(c.rng, 380, 1400));
  },
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    const { config } = montarConfigComeCotas(c, {});
    config.aliquota = aliquotaPorPrazo(prazo(c));
    errado.comeCotas = config;
    const { re } = avaliar(c, certo, errado);
    return [{
      cenario: 'cc_isento_tributado', dimensoes: ['cota'], titulo: 'Come-cotas em fundo isento', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} retirou cotas por come-cotas num fundo que o regulamento diz não estar sujeito a ele (${c.fundo.rotulo}).`,
      evidencias: ['Regulamento — tributação e regras específicas', 'Come-cotas (posição por cotista)', 'Quantidade final de cotas'],
      raciocinio: [
        `A cota é igual, mas a quantidade final de cotas do ${ladoErrado} é ${fmtN(re.cotasComeCotas, 8)} cotas menor, com ${fmtR(re.irComeCotas)} de IR retido. O ${ladoCerto} não tem come-cotas.`,
        `Hoje é dia de come-cotas para os fundos sujeitos a ele, mas o regulamento deste fundo diz: "${c.reg.tributacao}" e "${REGRA_SEM_COME_COTAS}" O prazo médio da carteira (${fmtN(prazo(c), 0)} dias) só importa para fundos sujeitos ao come-cotas.`,
        'Reter IR e retirar cotas de um fundo isento tira cotas dos cotistas sem base legal.',
      ],
      acao: `${ladoErrado} deve estornar o come-cotas deste fundo (devolver ${fmtN(re.cotasComeCotas, 8)} cotas) e tirar o fundo da rotina semestral.`,
    }];
  },
};

// ----------------------------------------------------------------------------- alíquota
const CC04: Cenario = {
  ...base('cc_aliquota_errada', 'Alíquota do come-cotas errada para o prazo médio da carteira', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { limitrofe: chance(c.rng, 0.5) }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    const certaAliq = certo.comeCotas!.aliquota;
    const errada = certaAliq === 0.2 ? 0.15 : 0.2;
    errado.comeCotas = { ...errado.comeCotas!, aliquota: errada };
    const { rc, re } = avaliar(c, certo, errado);
    return [{
      cenario: 'cc_aliquota_errada', dimensoes: ['cota'], titulo: `Alíquota de ${fmtPct(errada, 0)} em vez de ${fmtPct(certaAliq, 0)}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} aplicou ${fmtPct(errada, 0)}; com prazo médio de ${fmtN(prazo(c), 0)} dias a alíquota é ${fmtPct(certaAliq, 0)}.`,
      evidencias: ['Informações de mercado — prazo médio da carteira', 'Regulamento — alíquota do come-cotas', 'Come-cotas (IR por posição)'],
      raciocinio: [
        `O IR do ${ladoErrado} é ${fmtR(re.irComeCotas)} contra ${fmtR(rc.irComeCotas)} do ${ladoCerto}, e a razão entre os dois é ${fmtN(re.irComeCotas / rc.irComeCotas, 4)}, igual a ${fmtPct(errada, 0)} ÷ ${fmtPct(certaAliq, 0)}. A diferença é só de alíquota.`,
        `Pelo regulamento, a alíquota é 15% se o prazo médio da carteira em D passar de 365 dias e 20% se for de até 365. O prazo médio informado é ${fmtN(prazo(c), 0)} dias: ${prazo(c) <= 365 ? 'até 365' : 'acima de 365'}, então ${fmtPct(certaAliq, 0)}.`,
        `Recalculei posição a posição (${fraseRecalculo(c)}) com ${fmtPct(certaAliq, 0)}: bate com o ${ladoCerto}.`,
      ],
      acao: `${ladoErrado} deve refazer o come-cotas com ${fmtPct(certaAliq, 0)} (IR de ${fmtR(rc.irComeCotas)} e ${fmtN(rc.cotasComeCotas, 8)} cotas retiradas).`,
    }];
  },
};

// ----------------------------------------------------------------------------- cota de referência
const CC05: Cenario = {
  ...base('cc_cota_referencia_errada', 'Cota de referência desatualizada numa posição com aplicação recente', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { aplicacaoRecente: true }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    const alvo = errado.comeCotas!.posicoes.find((p) => p.origemReferencia === 'aplicação' && !p.aplicacoesDoDia)!;
    const certaRef = alvo.cotaReferencia;
    const ultimo = errado.comeCotas!.posicoes.find((p) => p.origemReferencia === 'último come-cotas');
    // o erro típico: usar a referência do último come-cotas (a mesma das demais posições) numa posição com aplicação posterior
    alvo.cotaReferencia = ultimo ? ultimo.cotaReferencia : truncar8(certaRef * (1 - entre(c.rng, 0.02, 0.06)));
    const { rc, re } = avaliar(c, certo, errado);
    const dc = det(rc, alvo.id);
    const de = det(re, alvo.id);
    return [{
      cenario: 'cc_cota_referencia_errada', dimensoes: ['cota'], titulo: `Cota de referência de ${alvo.id} desatualizada`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} manteve para ${alvo.id} (${alvo.cotista}) uma cota de referência anterior à aplicação de ${fmtData(alvo.dataReferencia)}; a referência correta é a cota da aplicação.`,
      evidencias: ['Come-cotas (cota de referência por posição)', 'Regulamento — cota de referência', 'Quantidade final de cotas'],
      raciocinio: [
        `Só a posição ${alvo.id} diverge: IR de ${fmtR(de.ir)} no ${ladoErrado} contra ${fmtR(dc.ir)} no ${ladoCerto}; as demais posições batem.`,
        `A referência de ${alvo.id} é uma aplicação de ${fmtData(alvo.dataReferencia)}, feita depois do último come-cotas. Pelo regulamento, vale a cota da aplicação (${fmtN(certaRef, 8)}, como no ${ladoCerto}); o ${ladoErrado} usou ${fmtN(alvo.cotaReferencia, 8)}, que é a referência do último come-cotas${ultimo ? ' (a mesma das posições sem aplicação recente)' : ''} e é menor, o que aumenta o ganho tributado.`,
        `Recalculei ${alvo.id} (${fraseRecalculo(c)}): ${fmtR(dc.ir)} de IR e ${fmtN(dc.cotasRetiradas, 8)} cotas retiradas. O ${ladoErrado} retirou ${fmtN(de.cotasRetiradas - dc.cotasRetiradas, 8)} cotas a mais do cotista.`,
      ],
      acao: `${ladoErrado} deve corrigir a cota de referência de ${alvo.id} para ${fmtN(certaRef, 8)} e devolver ${fmtN(de.cotasRetiradas - dc.cotasRetiradas, 8)} cotas ao cotista.`,
    }];
  },
};

// ----------------------------------------------------------------------------- duplicidade
const CC06: Cenario = {
  ...base('cc_duplicado', 'Come-cotas processado em duplicidade', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { isento: VARIOS_COTISTAS.includes(c.tipo) && chance(c.rng, 0.3) }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, vezes: 2 };
    const { rc, re } = avaliar(c, certo, errado);
    return [{
      cenario: 'cc_duplicado', dimensoes: ['cota'], titulo: 'Come-cotas retirado duas vezes', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} rodou a rotina de come-cotas duas vezes e retirou o dobro das cotas.`,
      evidencias: ['Come-cotas (IR e cotas retiradas por posição)', 'Quantidade final de cotas'],
      raciocinio: [
        `O IR e as cotas retiradas do ${ladoErrado} são, em todas as posições tributadas, exatamente o dobro dos do ${ladoCerto}: ${fmtR(re.irComeCotas)} contra ${fmtR(rc.irComeCotas)}, e ${fmtN(re.cotasComeCotas, 8)} contra ${fmtN(rc.cotasComeCotas, 8)} cotas.`,
        `Recalculei (${fraseRecalculo(c)}): o valor de uma única incidência é o do ${ladoCerto}. A cota de referência passa a ser a cota de D depois da primeira incidência, então uma segunda não teria base; o dobro só pode ser reprocessamento.`,
      ],
      acao: `${ladoErrado} deve estornar a segunda incidência (devolver ${fmtN(re.cotasComeCotas - rc.cotasComeCotas, 8)} cotas aos cotistas) e conferir se o IR a recolher também foi duplicado.`,
    }];
  },
};

// ----------------------------------------------------------------------------- cota de conversão
const CC07: Cenario = {
  ...base('cc_cota_conversao_d1', 'IR convertido em cotas pela cota de D−1', COME_COTAS),
  preparar: (c) => prepararComeCotas(c, { limitrofe: chance(c.rng, 0.2) }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, cotaConversao: 'D-1' };
    const { rc, re } = avaliar(c, certo, errado);
    return [{
      cenario: 'cc_cota_conversao_d1', dimensoes: ['cota'], titulo: 'IR convertido pela cota de D−1', ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} converteu o IR em cotas pela cota de D−1 (${fmtN(c.cotaAnterior, 8)}), e não pela cota de fechamento de D (${fmtN(rc.cota, 8)}).`,
      evidencias: ['Come-cotas (IR e cotas retiradas por posição)', 'Regulamento — conversão do IR em cotas', 'Quantidade final de cotas'],
      raciocinio: [
        `O IR é o mesmo nos dois lados (${fmtR(rc.irComeCotas)}), mas as cotas retiradas diferem: ${fmtN(re.cotasComeCotas, 8)} no ${ladoErrado} e ${fmtN(rc.cotasComeCotas, 8)} no ${ladoCerto}.`,
        `Pelo regulamento, cotas retiradas = IR ÷ cota de fechamento de D. Com a cota de D (${fmtN(rc.cota, 8)}) o resultado é o do ${ladoCerto}; dividir pela cota de D−1 (${fmtN(c.cotaAnterior, 8)}), que é menor, retira cotas a mais.`,
      ],
      acao: `${ladoErrado} deve refazer a conversão pela cota de D e devolver ${fmtN(re.cotasComeCotas - rc.cotasComeCotas, 8)} cotas aos cotistas.`,
    }];
  },
};

// ----------------------------------------------------------------------------- prejuízo
const CC08: Cenario = {
  ...base('cc_prejuizo_devolvido', 'Posição abaixo da referência tratada como crédito de cotas', COM_PREJUIZO),
  preparar: (c) => prepararComeCotas(c, { prejuizo: true }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, devolvePrejuizo: true };
    const { rc, re } = avaliar(c, certo, errado);
    const alvo = certo.comeCotas!.posicoes.find((p) => p.cotaReferencia > rc.cota)!;
    const de = det(re, alvo.id);
    return [{
      cenario: 'cc_prejuizo_devolvido', dimensoes: ['cota'], titulo: `Posição ${alvo.id} abaixo da referência gerou cotas de volta`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} calculou ganho negativo para ${alvo.id} (cota de D abaixo da referência) e devolveu cotas, em vez de não reter nada.`,
      evidencias: ['Come-cotas (IR e cotas retiradas da posição abaixo da referência)', 'Regulamento — posição com cota abaixo da referência', 'Quantidade final de cotas'],
      raciocinio: [
        `Em ${alvo.id} (${alvo.cotista}) a cota de referência (${fmtN(alvo.cotaReferencia, 8)}) é maior que a cota de D (${fmtN(rc.cota, 8)}): não há ganho. O ${ladoErrado} mostra IR de ${fmtR(de.ir)} e ${fmtN(de.cotasRetiradas, 8)} cotas (negativas, ou seja, devolvidas), e o ${ladoCerto} mostra zero.`,
        'O regulamento diz que posição com cota abaixo da referência não gera retenção nem devolução de cotas. As demais posições batem nos dois lados.',
        `Por isso a quantidade final do ${ladoErrado} é ${fmtN(re.qtdFinal - rc.qtdFinal, 8)} cotas maior que a do ${ladoCerto}.`,
      ],
      acao: `${ladoErrado} deve zerar o IR e as cotas de ${alvo.id} e reprocessar (retirar ${fmtN(re.qtdFinal - rc.qtdFinal, 8)} cotas indevidamente devolvidas).`,
    }];
  },
};

// ----------------------------------------------------------------------------- cotista isento
const CC09: Cenario = {
  ...base('cc_cotista_isento_tributado', 'Cotista isento sofreu retenção de come-cotas', VARIOS_COTISTAS),
  preparar: (c) => prepararComeCotas(c, { isento: true }),
  aplicar: (c) => {
    const { errado, certo, ladoErrado, ladoCerto } = sortear(c);
    errado.comeCotas = { ...errado.comeCotas!, tributaIsentos: true };
    const { rc, re } = avaliar(c, certo, errado);
    const alvo = certo.comeCotas!.posicoes.find((p) => p.tratamento === 'isento')!;
    const de = det(re, alvo.id);
    return [{
      cenario: 'cc_cotista_isento_tributado', dimensoes: ['cota'], titulo: `Retenção indevida no cotista isento ${alvo.id}`, ladoCorreto: ladoCerto, ajustePor: ladoErrado,
      causaRaiz: `${ladoErrado} reteve IR de ${alvo.id} (${alvo.cotista}), cotista isento/imune.`,
      evidencias: ['Come-cotas (tratamento tributário por posição)', 'Regulamento — cotistas isentos', 'Quantidade final de cotas'],
      raciocinio: [
        `A posição ${alvo.id} está marcada como "isento" e o ${ladoCerto} não reteve nada dela; o ${ladoErrado} reteve ${fmtR(de.ir)} (${fmtN(de.cotasRetiradas, 8)} cotas). As outras posições batem.`,
        'O regulamento diz que cotistas isentos ou imunes não sofrem retenção.',
        `Total de IR: ${fmtR(re.irComeCotas)} no ${ladoErrado} contra ${fmtR(rc.irComeCotas)} no ${ladoCerto}; a diferença é exatamente o IR de ${alvo.id}.`,
      ],
      acao: `${ladoErrado} deve estornar a retenção de ${alvo.id} (devolver ${fmtN(de.cotasRetiradas, 8)} cotas) e corrigir o cadastro tributário do cotista.`,
    }];
  },
};

export const CENARIOS_CC: Cenario[] = [CC00, CC01, CC02, CC03, CC04, CC05, CC06, CC07, CC08, CC09];
export type { Achado };
void r2;
