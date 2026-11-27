# Rodada 4 — régua de materialidade v1, avaliação às cegas

Casos respondidos: 22

- Parecer correto: **22/22** (100%)
- Ressalva correta: 22/22
- Achados do gabarito encontrados (lado e dimensão): **26/27** (96%)
- Achados extras (falsos positivos): 1
- Veredito da régua (cota, caixa e provisões) correto: **22/22**

| Caso | Cenário(s) | Gabarito | Agente | Achados | Extras |
|---|---|---|---|---|---|
| caso-003 | curva_vs_mercado_exclusivo | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-007 | ambos_com_taxa_antiga | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-010 | tudo_bate_com_ruido | APROVADO | APROVADO | 0/0 | 0 |
| caso-015 | tarifa_bancaria_indevida | PENDENTE | PENDENTE | 1/1 | 0 |
| caso-020 | arredondamento_vs_truncamento | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-021 | ativo_iliquido_sem_referencia | PENDENTE | PENDENTE | 1/1 | 0 |
| caso-023 | reg_provisao_dentro | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-025 | minimo_mensal_ignorado+debito_em_duplicidade | REPROVADO | REPROVADO | 1/2 | 1 |
| caso-032 | tudo_bate | APROVADO | APROVADO | 0/0 | 0 |
| caso-041 | aplicacao_nao_convertida+taxa_escalonada_ignorada | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-046 | reg_cota_dentro | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-050 | reg_provisao_acima | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-054 | reg_caixa_sem_causa | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-058 | pagamento_taxa_nao_registrado+aplicacao_apos_corte_convertida | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-062 | pdd_aging_desatualizado | APROVADO* | APROVADO* | 1/1 | 0 |
| caso-063 | taxa_reduzida_nao_aplicada+auditoria_contrato_novo+taxa_cvm_faixa_errada | REPROVADO | REPROVADO | 3/3 | 0 |
| caso-066 | reg_caixa_baixo | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-070 | performance_sem_reversao | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-077 | credito_nao_identificado+tarifa_bancaria_indevida | PENDENTE | PENDENTE | 2/2 | 0 |
| caso-093 | resgate_liquidado_nao_baixado | REPROVADO | REPROVADO | 1/1 | 0 |
| caso-110 | auditoria_contrato_novo+provisao_duplicada | REPROVADO | REPROVADO | 2/2 | 0 |
| caso-129 | reg_cota_acima | REPROVADO | REPROVADO | 1/1 | 0 |


## Como ler

- 24 casos do dataset geral, escolhidos para exercitar a régua: os 6 cenários de fronteira (cota, provisão e caixa, dentro e acima do limite), casos de caixa, pendências, provisões, casos limpos e alguns combinados. 3 agentes resolveram às cegas, seguindo `prompt-agente.md`, `regua-materialidade.md` e `metodologia-analista.md`, e devolveram as medidas da régua.
- **22 dos 24 casos foram respondidos.** Um dos agentes bateu no limite de uso da conta depois de salvar 6 dos 8 casos; os 2 casos que ficaram sem resposta foram `caso-034` e `caso-005`.
- Os identificadores valem para a versão do dataset usada na rodada; o gerador foi regenerado depois (veja abaixo), então os números dos casos mudaram.

## O que a rodada mostrou

- **Parecer: 22 de 22. Veredito da régua (cota, caixa e provisões) em cada caso: 22 de 22.** Os agentes mediram corretamente as três dimensões, inclusive nos casos de fronteira (por exemplo, 220 cotas equivalentes com o caixa decidindo; provisão de R$ 33,95 dentro e de R$ 183,86 acima; diferença de R$ 3,44 no caixa reprovando).
- **Achados: 26 de 27.** O que faltou foi, de novo, o rótulo de um pagamento em duplicidade no caixa: o gabarito diz `nenhum` (o dinheiro pode ter saído duas vezes) e o agente atribuiu a um lado, sem extrato para provar. A conclusão prática (a diferença no caixa, a duplicidade e a ação de estorno) estava certa.
- Casos limpos aprovados sem ressalva; casos dentro da régua aprovados com ressalva; caixa sem causa localizada reprovado por recomendação; preço de comitê vencido contra negócio relevante em PENDENTE.

**Ajustes feitos a partir das observações dos agentes:**

| Observação | Ajuste |
|---|---|
| "Total de provisões" é líquido ou soma de módulos? | Líquido (saldo de um lado menos o do outro, em módulo); cada provisão também é medida sozinha, o que impede a compensação de esconder erro. `diferenca_caixa` também é líquido |
| Item pequeno que só pesa no total (R$ 33,33 dentro, mas o total passa de R$ 100) | A medida do caso é o efeito total; a gravidade de cada achado é indicativa e um item que ajuda a estourar o total entra no parecer |
| Caixa com causa localizada, mas sem extrato para dizer qual lado está certo | Escolher o lado pela evidência (valor, data, regulamento, comunicações) e pedir confirmação no extrato; sem evidência, `indeterminado` |
| Pagamento duplicado só num lado: erro de registro ou dinheiro que saiu duas vezes? | O caso passa a trazer a confirmação do banco de que houve dois débitos (então `nenhum` e PENDENTE de estorno); a metodologia explica os dois cenários |
| Caso acima da régua, mas dependente de decisão do comitê | Decisão de terceiro prevalece: PENDENTE, com a medida registrada |
| Medidas muito perto do limite (192, 220, 229 cotas) | O agente avisa na mensagem ao analista quando uma medida está a menos de 10% do limite; esses casos alimentam a calibração |
| Dias úteis do mês e do trimestre não estavam na entrada | A entrada traz o calendário (dia útil do mês, dias úteis do mês e do trimestre) |
| Mínimo mensal da taxa: piso diário ou completar o mês? | Regulamento diz: a apropriação diária é o maior entre o percentual sobre o PL e o mínimo mensal ÷ dias úteis do mês |
| Classificação "mantido até o vencimento" só aparecia na fonte do preço | O regulamento do fundo exclusivo lista os títulos classificados, com a declaração do cotista |
| "Negócio relevante no secundário" sem definição | Critério provisório: pelo menos 5% da posição no papel ou 0,5% do PL; os casos novos respeitam o critério |
| Diferença de 1e-8: aprova com ou sem ressalva? | Qualquer diferença é divergência: dentro da régua, com ressalva. Sem ressalva só quando nada diverge |
| PDD fora da tabela de provisões | Documentado: a PDD é redutora de ativo e conta na dimensão cota |

**Limitações conhecidas** (inerentes ao formato): a entrada não traz a posição detalhada de D−1, então um saldo inicial de caixa divergente não pode ser atribuído a um lado; os saldos anteriores das provisões não têm memória de cálculo em parte dos casos; preços de curva e de laudo não têm dados para recálculo independente.
