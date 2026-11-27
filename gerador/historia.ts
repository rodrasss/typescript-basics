// Narrativa (a "história de vida") de cada fundo-persona.
// Mistura fatos neutros, pistas legítimas (que ajudam a desconfiar de uma categoria de problema, sem apontar o lado
// nem o valor) e distratores (frases tranquilizadoras ou alarmistas que não mudam a conta).

import type { Ctx } from './caso.ts';
import type { TipoFundo } from './catalogo.ts';
import { escolher, chance, fmtR, fmtN, fmtData, diaDaSemana } from './util.ts';

const PROPOSITO: Record<TipoFundo, string> = {
  RF_DI: 'nasceu para ser o "caixa" de quem quer rendimento diário colado no CDI, com liquidez imediata',
  RF_CP: 'busca retorno acima do CDI com crédito privado de boa qualidade, aceitando prazo de resgate mais longo',
  FIM_MACRO: 'toma posições direcionais em juros, câmbio e bolsa, e a equipe trata o caixa como ferramenta de trabalho',
  FIM_LS: 'monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição',
  FIA: 'é um fundo de ações de gestão ativa, concentrado em poucas dezenas de papéis',
  FIC_FIM: 'aloca em outros fundos multimercado e rebalanceia a carteira todo mês',
  PREV: 'atende planos de previdência de uma seguradora, com fluxo previsível de aportes',
  FIDC: 'compra recebíveis de empresas e distribui o carrego aos cotistas, com custodiante e agente de cobrança próprios',
  FII: 'é dono de galpões e lajes corporativas e distribui aluguel todo mês',
  FIP: 'investe em empresas fechadas e precisa de laudo de avaliação para marcar a carteira',
  CAMBIAL: 'dá ao cotista exposição (ou proteção) ao dólar, via futuros e caixa remunerado',
  IE: 'investe em fundos no exterior e converte tudo para reais todo dia',
  EXCLUSIVO: 'foi desenhado sob medida para um único cotista, com regras próprias de marcação e tributação',
  FIAGRO: 'compra recebíveis do agronegócio (CRA) e distribui rendimento mensal',
  INFRA: 'compra debêntures de infraestrutura e entrega rendimento isento de IR ao cotista pessoa física',
};

// Pista legítima por cenário: indica uma categoria de risco do fundo, nunca o lado nem o valor.
const PISTAS: Record<string, string[]> = {
  preco_credito_fonte_errada: ['Os papéis de crédito do fundo têm taxa indicativa ANBIMA todo dia, mas o histórico mostra que, de vez em quando, alguém usa o preço de curva em vez do de mercado.'],
  preco_acao_d1: ['Em dias de feed de preços instável, já houve ações com o fechamento do dia anterior.'],
  cota_investido_d1: ['As cotas dos fundos investidos costumam ser publicadas à noite, e o processamento às vezes fecha antes.'],
  desdobramento_nao_refletido: ['A carteira tem papéis de empresas que vêm anunciando desdobramentos e bonificações.'],
  dividendo_ex_nao_provisionado: ['A carteira de ações tem pagadoras de dividendos relevantes.'],
  aplicacao_nao_convertida: ['O fundo recebe aplicações perto do horário de corte quase todo dia.'],
  aplicacao_apos_corte_convertida: ['O fundo recebe aplicações perto do horário de corte quase todo dia.'],
  resgate_cotizado_antecipadamente: ['O prazo de cotização do fundo mudou no passado e alguns sistemas guardam parametrizações antigas.'],
  ptax_errada: ['O fundo converte ativos em dólar todo dia e já teve divergência de câmbio antes.'],
  nav_estimado_feriado_eua: ['A gestora costuma mandar NAV "estimado" quando o mercado americano está fechado.'],
  ajuste_futuros_errado: ['A mesa da gestora mexe nas posições de futuros várias vezes ao dia.'],
  ativo_vencido_nao_baixado: ['Vencimentos de títulos bancários dependem de baixa manual em alguns sistemas.'],
  curva_vs_mercado_exclusivo: ['A família escolheu manter parte dos títulos até o vencimento, e isso já gerou dúvidas de marcação.'],
  come_cotas_nao_aplicado: ['Dia de come-cotas é sempre sensível para a operação.'],
  arredondamento_vs_truncamento: ['O fundo mudou de sistema e a parametrização de casas decimais foi revisada.'],
  erros_que_se_compensam: ['Já houve um dia em que dois erros se anularam e só foram descobertos dias depois.'],
  pdd_aging_desatualizado: ['Sacados em atraso mudam de faixa praticamente todo dia.'],
  amortizacao_nao_registrada: ['O cronograma de amortização do fundo é conhecido e comunicado com antecedência.'],
  rendimento_nao_provisionado: ['O anúncio de rendimentos costuma sair no fim do dia, depois do fechamento de um dos lados.'],
  laudo_fip_nao_atualizado: ['O comitê de investimentos aprova laudos fora de ciclo, às vezes no meio do mês.'],
  integralizacao_nao_convertida: ['As chamadas de capital vencem em datas diferentes para cada cotista.'],
  ativo_iliquido_sem_referencia: ['Parte dos papéis de crédito do fundo não tem taxa indicativa ANBIMA divulgada.'],
  boleta_tardia_nao_processada: ['A gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras.'],
  resgate_liquidado_nao_baixado: ['Os resgates liquidados no dia exigem baixa manual em uma das pontas.'],
  tarifa_bancaria_indevida: ['A conta do fundo já teve cobrança de tarifa que não era do fundo.'],
  debito_em_duplicidade: ['O fundo paga despesas pequenas e variadas, e já houve pagamento em duplicidade.'],
  dividendo_recebido_nao_baixado: ['A carteira de ações paga dividendos relevantes ao longo do ano.'],
  juros_credito_nao_registrados: ['Os papéis de crédito do fundo pagam juros em datas diferentes ao longo do ano.'],
  ajuste_liquidado_nao_baixado: ['A liquidação dos ajustes de futuros exige conciliação diária.'],
  compromissada_como_caixa: ['A classificação do saldo em compromissada já gerou ressalva de auditoria.'],
  pagamento_taxa_nao_registrado: ['As taxas são pagas até o 5º dia útil e a conciliação depende de baixa manual.'],
  provisao_nao_baixada_apos_pagamento: ['As taxas são pagas até o 5º dia útil e a conciliação depende de baixa manual.'],
  credito_nao_identificado: ['Já entrou dinheiro na conta do fundo sem identificação do remetente.'],
  liquidacao_compra_antecipada: ['O prazo de liquidação de ações (D+2) confunde alguns sistemas.'],
  resgate_pago_com_cota_errada: ['Os resgates são pagos alguns dias depois da cotização, e o valor depende da cota certa.'],
  margem_lancada_como_despesa: ['O fundo deposita margem na B3 com frequência.'],
  taxa_reduzida_nao_aplicada: ['As taxas do fundo foram alteradas recentemente em assembleia.'],
  ambos_com_taxa_antiga: ['As taxas do fundo foram alteradas recentemente em assembleia.'],
  minimo_mensal_ignorado: ['O contrato de administração prevê remuneração mínima.'],
  taxa_sobre_pl_do_dia: ['A base de cálculo das taxas é um ponto sensível da parametrização.'],
  taxa_por_dias_corridos: ['Segundas-feiras e vésperas de feriado costumam expor erros de contagem de dias.'],
  taxa_gestao_sem_apropriacao: ['Rotinas de apropriação já deixaram de rodar em alguns fundos.'],
  performance_sem_reversao: ['A performance oscila bastante e o fundo vive perto da linha d’água.'],
  performance_data_base_errada: ['A performance depende de data-base e de fator de benchmark, e as pontas já divergiram nisso.'],
  performance_sem_linha_dagua: ['A virada de semestre costuma ser delicada para a performance.'],
  auditoria_contrato_novo: ['O contrato com a auditoria foi renegociado recentemente.'],
  taxa_cvm_faixa_errada: ['O PL do fundo está perto do limite entre duas faixas da taxa de fiscalização.'],
  taxa_escalonada_ignorada: ['A taxa de gestão é escalonada por faixa de patrimônio.'],
  despesa_nao_prevista: ['A gestora costuma pedir que despesas dela sejam lançadas no fundo.'],
  provisao_duplicada: ['Cadastros de despesas já foram duplicados em outros fundos da mesma carteira.'],
  metodo_exponencial_vs_linear: ['A forma de apropriar as taxas muda de fundo para fundo.'],
};

// Distratores: não mudam a conta.
const TRANQUILIZADORES = [
  'O analista anterior deixou anotado que "esse fundo costuma bater de primeira, é só passar o olho".',
  'Nos últimos meses o fundo não teve nenhuma divergência relevante.',
  'A equipe da gestora é considerada muito organizada.',
];
const ALARMISTAS = [
  'A área de risco pediu atenção redobrada ao fundo depois de um apontamento de auditoria em 2025 (já regularizado).',
  'Uma vez, em 2024, o fundo ficou três dias com a cota segurada por causa de uma divergência de caixa que acabou sendo só de classificação.',
  'O gestor tem fama de mandar informação por e-mail antes da confirmação formal.',
];

const ABERTURAS = [
  (n: string, g: string, p: string, c: string) => `O ${n} é gerido pela ${g}, ${p}, em ${c}.`,
  (n: string, g: string, p: string, c: string) => `Quem acompanha a ${g} (${c}) conhece o ${n}: a casa é uma ${p}.`,
  (n: string, g: string, p: string, c: string) => `Sob a gestão da ${g}, ${p} (${c}), o ${n} é um dos fundos que mais exigem atenção na rotina de validação.`,
];

export function compor(c: Ctx, cenarioIds: string[]): { historia: string; pistas: string[] } {
  const f = c.fundo;
  const rng = c.rng;
  const partes: string[] = [];
  partes.push(escolher(rng, ABERTURAS)(f.nome, f.gestora.nome, f.gestora.perfil, f.gestora.cidade));
  partes.push(`Criado em ${fmtData(f.inicio)}, ${PROPOSITO[f.tipo]}. Público-alvo: ${f.publico.toLowerCase()}. Hoje seus cotistas são ${f.cotistas}.`);
  partes.push(`Ao longo da vida, o fundo ${f.marcos[0]} e ${f.marcos[1]}.`);
  partes.push(`O gestor responsável é ${f.gestorResponsavel}, e quem cuida da validação do fundo é ${f.analistaResponsavel}. Sobre a rotina: ${f.particularidades[0]}; ${f.particularidades[1]}.`);

  const pistas: string[] = [];
  for (const id of cenarioIds) {
    const opcoes = PISTAS[id];
    if (opcoes && chance(rng, 0.55)) pistas.push(escolher(rng, opcoes));
  }
  if (pistas.length) partes.push(pistas.join(' '));
  const clean = cenarioIds.every((id) => id === 'tudo_bate' || id === 'tudo_bate_com_ruido');
  if (chance(rng, 0.3)) partes.push(escolher(rng, clean ? ALARMISTAS : TRANQUILIZADORES));
  else if (chance(rng, 0.2)) partes.push(escolher(rng, clean ? TRANQUILIZADORES : ALARMISTAS));

  partes.push(
    `No fechamento de ontem (${fmtData(c.dAnterior)}) o fundo tinha PL de ${fmtR(c.plAnterior)}, cota de ${fmtN(c.cotaAnterior, 8)} e ${fmtN(c.qtdAnterior, 8)} cotas. ` +
      `Hoje, ${diaDaSemana(c.data)}, ${fmtData(c.data)}, é a data-base da validação.`,
  );
  return { historia: partes.join(' '), pistas };
}
