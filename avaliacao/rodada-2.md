# Rodada 2 — avaliação às cegas

Casos respondidos: 24

- Parecer correto: **23/24** (96%)
- Ressalva correta: 21/24
- Achados do gabarito encontrados (lado e dimensão): **33/35** (94%)
- Achados extras (falsos positivos): 6

| Caso | Cenário(s) | Gabarito | Agente | Achados | Extras |
|---|---|---|---|---|---|
| caso-001 | resgate_liquidado_nao_baixado | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-003 | ativo_iliquido_sem_referencia | PENDENTE | PENDENTE | 1/1 | 0 |
| caso-004 | tudo_bate_com_ruido | APROVADO | APROVADO | 0/0 | 0 |
| caso-011 | margem_lancada_como_despesa+compromissada_como_caixa+boleta_tardia_nao_processada | REPROVADO* | REPROVADO | 3/3 | 0 |
| caso-013 | margem_lancada_como_despesa+compromissada_como_caixa+resgate_cotizado_antecipadamente | REPROVADO* | REPROVADO | 3/3 | 0 |
| caso-014 | pagamento_taxa_nao_registrado+compromissada_como_caixa | APROVADO* | REPROVADO ✗ | 2/2 | 0 |
| caso-018 | performance_sem_linha_dagua | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-020 | despesa_nao_prevista+taxa_gestao_sem_apropriacao | REPROVADO | REPROVADO | 2/2 | 1 |
| caso-025 | aplicacao_apos_corte_convertida | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-026 | erros_que_se_compensam | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-030 | tudo_bate | APROVADO | APROVADO | 0/0 | 0 |
| caso-042 | taxa_reduzida_nao_aplicada | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-045 | come_cotas_nao_aplicado | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-065 | aplicacao_nao_convertida+metodo_exponencial_vs_linear | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-072 | taxa_cvm_faixa_errada+taxa_sobre_pl_do_dia | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-073 | curva_vs_mercado_exclusivo | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-087 | performance_data_base_errada | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-089 | resgate_pago_com_cota_errada+cota_investido_d1+taxa_cvm_faixa_errada | REPROVADO | REPROVADO | 2/3 | 2 |
| caso-091 | performance_sem_reversao | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-097 | ambos_com_taxa_antiga | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-099 | resgate_cotizado_antecipadamente | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-124 | arredondamento_vs_truncamento | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-127 | minimo_mensal_ignorado+taxa_cvm_faixa_errada | REPROVADO | REPROVADO | 2/2 | 1 |
| caso-150 | provisao_nao_baixada_apos_pagamento+debito_em_duplicidade | REPROVADO | REPROVADO | 1/2 | 2 |


## Como ler

- 24 casos do dataset já corrigido na rodada 1 (mecanismos mais sensíveis: passivo, vigência de regras, performance, ambiguidade), resolvidos às cegas por 3 agentes. Nenhum caso foi perdido.
- Esta rodada usou a versão do dataset anterior à sessão de come-cotas. Os identificadores acima valem para essa versão; o dataset foi regenerado depois (veja abaixo), então os números dos casos mudaram.

## O que a rodada mostrou

- **Parecer:** 23 de 24. O único erro (caso 014) foi uma ambiguidade do prompt: caixa e provisão divergindo pelo mesmo valor, sem mudar o PL. O gabarito dizia "aprovado com ressalva"; o agente reprovou pela letra da regra "provisão diferente reprova".
- **Achados:** 33 de 35. Os 2 que faltaram são rótulos de lado em eventos de dinheiro real (pagamento em duplicidade e resgate pago a menor): o gabarito diz `nenhum` (o dinheiro saiu), e o agente atribuiu a um lado.
- **Extras:** 6 achados a mais, quase todos "consequência" do efeito de uma causa em cota e quantidade, que o agente criou à parte por falta de orientação. Nenhum é um problema inventado.

**Ajustes feitos a partir desta rodada** (prompt, metodologia e gerador):

| Observação dos agentes | Ajuste |
|---|---|
| Provisão diferente com PL igual (pagamento registrado em um só lado) é erro ou ressalva? | Regra explícita: reprova se muda o PL; se tem contrapartida igual no caixa, é ressalva |
| Achado separado para a "consequência" na cota | Um achado por causa raiz; o efeito entra nas dimensões do mesmo achado |
| `quem_ajusta` e cota correta quando os dois lados estão errados | `nenhum`, os dois ajustam, e a ação traz a cota e a quantidade corretas |
| `lado_correto` em pagamento duplicado ou resgate pago a menor | `nenhum` (evento real de dinheiro); PENDENTE se depende de estorno |
| Preço de comitê vencido contra negócio relevante | Referência não confiável: PENDENTE, `indeterminado` |
| Qual PL e qual quantidade usar na cota e na cota bruta de performance | Definição explícita no regulamento simulado, no prompt e na metodologia |
| Resgates que cotizam hoje não aparecem em caixa nem em "a pagar" | Nota na seção de passivo explicando o momento do efeito |
| Rótulo "PL antes das apropriações" ambíguo | Rótulo diz que exclui a performance |
| Margem em dinheiro como ativo ausente no regulamento do FIM Long & Short | Regra incluída |
| História contradizendo a alteração de taxa; "carteira de ações" num FIDC | Removido o marco de 2024; iscas de dicas só plausíveis para o tipo do fundo |
| Base do come-cotas não estava na entrada | Regra do come-cotas explícita no regulamento (incide depois das conversões e cotizações de D) |

**Limitações conhecidas** (não corrigidas, por serem inerentes ao formato): a entrada não traz a carteira de D−1, então a variação diária da cota não é validável; os saldos anteriores das provisões não têm memória de cálculo.
