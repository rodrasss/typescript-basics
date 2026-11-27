# Caso caso-184 — Seriguela II FIF Multimercado Long Short

> **Data-base (D):** 05/05/2026 (terça-feira) · **D−1:** 04/05/2026 · **Fundo:** FND-0184

## 1. O fundo

Sob a gestão da Marola Asset, gestora jovem de ações, muito ativa em eventos societários e small caps (Florianópolis/SC), o Seriguela II FIF Multimercado Long Short é um dos fundos que mais exigem atenção na rotina de validação. Criado em 25/09/2013, monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição. Público-alvo: investidores qualificados. Hoje seus cotistas são um fundo de pensão fechado com 18% das cotas. Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e foi destaque em rankings de 2023, o que trouxe uma onda de aplicações de varejo. O gestor responsável é Otávio, e quem cuida da validação do fundo é Marina. Sobre a rotina: a gestora publica uma carta mensal aos cotistas até o 5º dia útil; o administrador revisa o manual de precificação uma vez por ano. No fechamento de ontem (04/05/2026) o fundo tinha PL de R$ 535.569.405,86, cota de 7,22999354 e 74.076.055,93207026 cotas. Hoje, terça-feira, 05/05/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Long & Short |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Marola Asset (Florianópolis/SC) |
| PL em D−1 | R$ 535.569.405,86 |
| Cota em D−1 | 7,22999354 |
| Quantidade de cotas em D−1 | 74.076.055,93207026 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/12/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,060% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,810% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 76.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 300,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 485.459.830,22. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

**Encargos do fundo**

- taxas de administração, gestão, custódia e performance previstas neste regulamento
- taxa de fiscalização da CVM
- honorários e despesas do auditor independente
- custos de corretagem, emolumentos e registro de operações
- despesas com custódia e liquidação de ativos (SELIC/B3)
- contribuição anual à ANBIMA
- honorários advocatícios e custas em defesa dos interesses da classe, quando aprovados pelo administrador e documentados

**Não são encargos do fundo**

- tarifas bancárias de manutenção de conta e pacotes de serviços (suportadas pelo administrador)
- despesas de marketing, eventos e relacionamento da gestora ou do distribuidor
- despesas não previstas expressamente como encargo

**Aplicação, resgate e cota**

- Aplicação: conversão em D+0 (cota de fechamento do dia do crédito dos recursos), para recursos disponíveis até 14:00; recursos creditados após o horário de corte são convertidos no dia útil seguinte.
- Resgate: cotização D+30 corridos (liquidação D+2 úteis).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Longo prazo; come-cotas semestral (maio/novembro) a 15%

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Eventos societários reconhecidos na data "ex".
- Futuros: ajuste diário divulgado pela B3, liquidado em D+1.

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 6,89813043 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.418,106339 |  |
| HZTA3 | B3 — preço de fechamento de D | 82,25 |  |
| YRBQ3 | B3 — preço de fechamento de D | 43,63 |  |
| ZMBV3 | B3 — preço de fechamento de D | 55,94 |  |
| VJNR3 | B3 — preço de fechamento de D | 35,08 |  |
| JZEL3 | B3 — preço de fechamento de D | 44,52 |  |
| WJMA4 | B3 — preço de fechamento de D | 31,21 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| INDM26 | -77 | -44,24 |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 05/05/2026: 1,04264032

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 7,23701894 | 7,23701894 | 0,00000000 |
| Quantidade final de cotas | 74.121.267,98474991 | 74.121.267,98474991 | 0,00000000 |
| PL final | R$ 536.417.020,26 | R$ 536.417.020,26 | R$ 0,00 |
| Caixa | R$ 7.732.478,70 | R$ 7.732.478,70 | R$ 0,00 |
| Total de provisões | R$ 1.713.774,37 | R$ 1.713.774,37 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 8.204 | 8.204 | 18.418,106339 | 18.418,106339 | 151.102.144,41 | 151.102.144,41 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 61.677 | 61.677 | 816,672135 | 816,672135 | 50.369.887,27 | 50.369.887,27 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| HZTA3 — Hortaz Tecnologia S.A. ON | 551.160 | 551.160 | 82,25 | 82,25 | 45.332.910,00 | 45.332.910,00 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 1.616.271 | 1.616.271 | 43,63 | 43,63 | 70.517.903,73 | 70.517.903,73 | 0,00 | B3 — preço de fechamento D |
| ZMBV3 — Zimbro Varejo S.A. ON | 810.385 | 810.385 | 55,94 | 55,94 | 45.332.936,90 | 45.332.936,90 | 0,00 | B3 — preço de fechamento D |
| VJNR3 — Vajanra Energia S.A. ON | 2.010.202 | 2.010.202 | 35,08 | 35,08 | 70.517.886,16 | 70.517.886,16 | 0,00 | B3 — preço de fechamento D |
| JZEL3 — Jazê Elétrica S.A. ON | 1.131.400 | 1.131.400 | 44,52 | 44,52 | 50.369.928,00 | 50.369.928,00 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 1.613.903 | 1.613.903 | 31,21 | 31,21 | 50.369.912,63 | 50.369.912,63 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 533.913.509,10 | 533.913.509,10 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 3.949.029,92 | 3.949.029,92 |
| TED recebida — aplicação Cotista 1519 (11:55) | 1.687.438,25 | 1.687.438,25 |
| TED recebida — aplicação Cotista 1526 (13:49) | 1.219.426,98 | 1.219.426,98 |
| TED recebida — aplicação Cotista 1533 (12:08) | 938.934,62 | 938.934,62 |
| Pagamento de resgate — Cotista 1554 (cotizado em 04/05/2026) | -846.421,72 | -846.421,72 |
| Pagamento de resgate — Cotista 1561 (cotizado em 30/04/2026) | -479.104,18 | -479.104,18 |
| Liquidação B3 — ajuste de futuros de 04/05/2026 | 1.263.174,83 | 1.263.174,83 |
| **Saldo final** | 7.732.478,70 | 7.732.478,70 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 3.406,48 | 3.406,48 |

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 3.845.799,85 | 3.845.799,85 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 27.434,82 | 27.434,82 | 1.275,17 | 1.275,17 | 0,00 | 0,00 | 28.709,99 | 28.709,99 | 0,00 |
| TXGES — Taxa de gestão a pagar | 792.454,24 | 792.454,24 | 38.467,49 | 38.467,49 | 0,00 | 0,00 | 830.921,73 | 830.921,73 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 9.002,68 | 9.002,68 | 425,06 | 425,06 | 0,00 | 0,00 | 9.427,74 | 9.427,74 | 0,00 |
| AUDIT — Auditoria independente a pagar | 11.761,90 | 11.761,90 | 301,59 | 301,59 | 0,00 | 0,00 | 12.063,49 | 12.063,49 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 15,00 | 15,00 | 15,00 | 15,00 | 0,00 | 0,00 | 30,00 | 30,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 3.718,03 | 3.718,03 | 177,05 | 177,05 | 0,00 | 0,00 | 3.895,08 | 3.895,08 | 0,00 |
| PERF — Taxa de performance a pagar | 826.773,85 | 826.773,85 | 1.952,49 | 1.952,49 | 0,00 | 0,00 | 828.726,34 | 828.726,34 | 0,00 |
| **Total** |  |  |  |  |  |  | 1.713.774,37 | 1.713.774,37 | 0,00 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 1519 | R$ 1.687.438,25 | 11:55 | 05/05/2026 | 05/05/2026 | 05/05/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista 1526 | R$ 1.219.426,98 | 13:49 | 05/05/2026 | 05/05/2026 | 05/05/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista 1533 | R$ 938.934,62 | 12:08 | 05/05/2026 | 05/05/2026 | 05/05/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 1540 | 245.745,66163879 cotas |  | 20/04/2026 | 05/05/2026 | 07/05/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista 1547 | 240.448,91621329 cotas |  | 27/04/2026 | 05/05/2026 | 06/05/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 1554 | 117.247,99282432 cotas (R$ 846.421,72) |  | 19/04/2026 | 04/05/2026 | 05/05/2026 | não | não | cotizado em 04/05/2026 pela cota de 7,21907216; liquidação financeira hoje |
| LIQ-2 | resgate | Cotista 1561 | 66.455,47003925 cotas (R$ 479.104,18) |  | 27/04/2026 | 30/04/2026 | 05/05/2026 | não | não | cotizado em 30/04/2026 pela cota de 7,20940170; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 533.913.509,10 | 533.913.509,10 | 0,00 |
| Caixa | 7.732.478,70 | 7.732.478,70 | 0,00 |
| Valores a receber | 3.406,48 | 3.406,48 | 0,00 |
| Valores a pagar | 3.845.799,85 | 3.845.799,85 | 0,00 |
| Provisões | 1.713.774,37 | 1.713.774,37 | 0,00 |
| PL base da cota | 536.089.820,06 | 536.089.820,06 | 0,00 |
| Cota (8 casas) | 7,23701894 | 7,23701894 | 0,00000000 |
| Aplicações convertidas | 3.845.799,85 | 3.845.799,85 | 0,00 |
| Cotas emitidas | 531.406,63053174 | 531.406,63053174 | 0,00000000 |
| Cotas resgatadas | 486.194,57785207 | 486.194,57785207 | 0,00000000 |
| Valor dos resgates cotizados | 3.518.599,37 | 3.518.599,37 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 74.121.267,98474991 | 74.121.267,98474991 | 0,00000000 |
| PL final | 536.417.020,26 | 536.417.020,26 | 0,00 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO

**Resumo:** Aprovar: Alfa e Beta batem e as provisões conferem com o regulamento.

**Dificuldade:** facil · **Cenários:** tudo_bate

Sem achados.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | ambos |
| caixa | ambos |
| provisoes | ambos |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 7,23701894 |
| Quantidade final de cotas | 74.121.267,98474991 |
| PL final | R$ 536.417.020,26 |
| Caixa | R$ 7.732.478,70 |
| Total de provisões | R$ 1.713.774,37 |

### Armadilhas deste caso

- Não inventar problema: quando tudo bate e as apropriações conferem com o regulamento, a resposta certa é aprovar.
