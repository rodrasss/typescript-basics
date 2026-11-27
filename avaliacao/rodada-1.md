# Rodada 1 — avaliação às cegas (parcial)

Casos respondidos: 36

- Parecer correto: **25/36** (69%)
- Ressalva correta: 17/36
- Achados do gabarito encontrados (lado e dimensão): **55/55** (100%)
- Achados extras (falsos positivos): 0

| Caso | Cenário(s) | Gabarito | Agente | Achados | Extras |
|---|---|---|---|---|---|
| caso-001 | boleta_tardia_nao_processada+ajuste_futuros_errado+taxa_por_dias_corridos | REPROVADO* | REPROVADO | 3/3 | 0 |
| caso-003 | aplicacao_nao_convertida | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-005 | metodo_exponencial_vs_linear+aplicacao_nao_convertida | REPROVADO* | REPROVADO | 2/2 | 0 |
| caso-006 | tudo_bate | APROVADO | APROVADO | 0/0 | 0 |
| caso-007 | taxa_por_dias_corridos | APROVADO* | REPROVADO ✗ | 1/1 | 0 |
| caso-010 | taxa_sobre_pl_do_dia | APROVADO* | REPROVADO ✗ | 1/1 | 0 |
| caso-012 | integralizacao_nao_convertida | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-014 | credito_nao_identificado | PENDENTE | PENDENTE | 1/1 | 0 |
| caso-018 | taxa_escalonada_ignorada+provisao_duplicada+tarifa_bancaria_indevida | PENDENTE* | REPROVADO ✗ | 3/3 | 0 |
| caso-019 | tudo_bate | APROVADO | APROVADO | 0/0 | 0 |
| caso-021 | provisao_nao_baixada_apos_pagamento | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-022 | preco_credito_fonte_errada+taxa_cvm_faixa_errada+taxa_sobre_pl_do_dia | REPROVADO* | REPROVADO | 3/3 | 0 |
| caso-026 | despesa_nao_prevista+resgate_liquidado_nao_baixado | APROVADO* | REPROVADO ✗ | 2/2 | 0 |
| caso-029 | boleta_tardia_nao_processada+metodo_exponencial_vs_linear+despesa_nao_prevista | REPROVADO* | REPROVADO | 3/3 | 0 |
| caso-032 | taxa_reduzida_nao_aplicada+taxa_cvm_faixa_errada | APROVADO* | REPROVADO ✗ | 2/2 | 0 |
| caso-034 | amortizacao_nao_registrada | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-035 | rendimento_nao_provisionado+provisao_nao_baixada_apos_pagamento | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-036 | ajuste_liquidado_nao_baixado | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-037 | margem_lancada_como_despesa+resgate_liquidado_nao_baixado | REPROVADO* | REPROVADO | 2/2 | 0 |
| caso-038 | curva_vs_mercado_exclusivo+ativo_vencido_nao_baixado | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-040 | ativo_vencido_nao_baixado | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-041 | taxa_cvm_faixa_errada+juros_credito_nao_registrados | REPROVADO* | REPROVADO | 2/2 | 0 |
| caso-043 | dividendo_recebido_nao_baixado | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-046 | provisao_duplicada+dividendo_ex_nao_provisionado | REPROVADO* | REPROVADO | 2/2 | 0 |
| caso-047 | aplicacao_apos_corte_convertida | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-052 | liquidacao_compra_antecipada+resgate_liquidado_nao_baixado | APROVADO* | APROVADO* | 2/2 | 0 |
| caso-055 | taxa_gestao_sem_apropriacao | APROVADO* | REPROVADO ✗ | 1/1 | 0 |
| caso-056 | dividendo_ex_nao_provisionado+ajuste_liquidado_nao_baixado | REPROVADO* | REPROVADO | 2/2 | 0 |
| caso-061 | ptax_errada | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-062 | ambos_com_taxa_antiga | APROVADO* | REPROVADO ✗ | 1/1 | 0 |
| caso-067 | compromissada_como_caixa+taxa_reduzida_nao_aplicada | APROVADO* | REPROVADO ✗ | 2/2 | 0 |
| caso-074 | tudo_bate | APROVADO | APROVADO | 0/0 | 0 |
| caso-083 | erros_que_se_compensam | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-086 | auditoria_contrato_novo | APROVADO* | REPROVADO ✗ | 1/1 | 0 |
| caso-125 | tarifa_bancaria_indevida+taxa_por_dias_corridos+taxa_cvm_faixa_errada | PENDENTE* | REPROVADO ✗ | 3/3 | 0 |
| caso-159 | minimo_mensal_ignorado | APROVADO* | REPROVADO ✗ | 1/1 | 0 |


## Como ler

- 60 casos foram sorteados (um por tipo de situação, mais casos com 3 achados e casos limpos) e entregues a 8 agentes **só com a entrada**, sem o gabarito. Os agentes seguiram `prompt-agente.md` e `metodologia-analista.md`.
- Uma interrupção por limite de uso da conta derrubou 13 dos 14 agentes antes de terminarem: **36 dos 60 casos foram respondidos**. A tabela acima cobre só esses.
- Esta rodada foi feita sobre a primeira versão do dataset. Os casos mudaram depois (veja abaixo); os identificadores não correspondem mais aos mesmos cenários.

## O que a rodada mostrou

**O agente raciocina bem.** Nos 36 casos respondidos encontrou **55 de 55** achados do gabarito (lado correto e dimensão), com **zero falsos positivos**, e aprovou corretamente os 3 casos limpos.

**O defeito estava no gabarito, não no agente.** O parecer divergiu em 11 casos, sempre no mesmo sentido: o gabarito dizia "aprovado com ressalva" para erro de provisão que muda a cota, e o agente reprovava, como manda a regra do próprio prompt. Recalculando o gabarito com a regra corrigida, o parecer concorda em **36 de 36**.

**Defeitos de entrada apontados pelos agentes (de forma independente, em vários casos) e já corrigidos no gerador:**

| Defeito | Correção |
|---|---|
| Datas de pedido, cotização e liquidação de resgate ignoravam o prazo do regulamento (inclusive pedido em sábado) | Prazos estruturados; datas derivadas do regulamento; resgate não é criado quando a data de pedido seria um fim de semana |
| Resgate "cotizado em D−1" com cota diferente da cota de D−1 do cabeçalho; dois resgates no mesmo dia com cotas diferentes | Série de cotas passadas; a cota de cotização vem dela |
| "Resgates a pagar" sem nenhum movimento que o explicasse | Passa a ser a soma dos resgates já cotizados e ainda não liquidados |
| Fator acumulado do CDI incompatível com o CDI de 14,15% a.a. (às vezes invertendo o lado correto) | Fator calculado pelo CDI e pelos dias úteis; provisão de performance de D−1 pela mesma fórmula |
| Quantidade de cotas variando 1e-8 sem movimento; cota de D−1 diferente de PL ÷ quantidade na 8ª casa | Aritmética de quantidades sem ruído de ponto flutuante; cota do cabeçalho = PL ÷ quantidade truncada |
| Parecer "aprovado com ressalva" para erro que muda a cota | Regra única: diferença de cota, PL ou provisão reprova; só registro/classificação é ressalva |
| Saldos anteriores já "corretos" para os dois lados no dia em que a regra muda (taxa reduzida, mínimo mensal) | Saldo anterior calculado pela regra antiga |
| Fundo "de cotista único" com vários cotistas; gestora de FIDC gerindo fundo DI; marcos de história anteriores à criação do fundo; avisos de "resgate" em fundo fechado | Persona coerente por tipo e público |
| Dicas na história que entregavam a causa | Dicas mais genéricas e iscas de outras categorias |
| Comunicação com data errada ("amanhã" caindo em fim de semana) | Próximo dia útil, formatado |

Cada item acima virou um teste automático em `test/casos.test.ts`.
