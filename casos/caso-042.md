# Caso caso-042 — Seriguela FIF Multimercado Long Short

> **Data-base (D):** 10/02/2026 (terça-feira) · **D−1:** 09/02/2026 · **Fundo:** FND-0042

## 1. O fundo

Sob a gestão da Marola Asset, gestora jovem de ações, muito ativa em eventos societários e small caps (Florianópolis/SC), o Seriguela FIF Multimercado Long Short é um dos fundos que mais exigem atenção na rotina de validação. Criado em 12/06/2011, monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição. Público-alvo: investidores qualificados. Hoje seus cotistas são um fundo de pensão fechado com 18% das cotas. Ao longo da vida, o fundo trocou de gestor responsável em 2023 depois da saída do fundador e reduziu o prazo de cotização em 2024 para competir em plataformas. O gestor responsável é Henrique, e quem cuida da validação do fundo é Renata. Sobre a rotina: a equipe da gestora trabalha com planilhas próprias e às vezes manda informação por e-mail antes da confirmação formal; o fundo tem aplicações e resgates quase todos os dias. No fechamento de ontem (09/02/2026) o fundo tinha PL de R$ 723.133.463,62, cota de 6,18308948 e 116.953.420,44712625 cotas. Hoje, terça-feira, 10/02/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Long & Short |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Marola Asset (Florianópolis/SC) |
| PL em D−1 | R$ 723.133.463,62 |
| Cota em D−1 | 6,18308948 |
| Quantidade de cotas em D−1 | 116.953.420,44712625 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/07/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,140% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,810% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 47.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 700,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 681.374.198,73. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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

- Aplicação: conversão em D+0 (cota de fechamento do dia do crédito dos recursos), para recursos disponíveis até 16:00; recursos creditados após o horário de corte são convertidos no dia útil seguinte.
- Resgate: cotização em D+30 dias corridos após o pedido (se não for dia útil, no primeiro dia útil seguinte), pela cota de fechamento da data de cotização; liquidação financeira em D+2 dias úteis após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
- Tributação: Come-cotas semestral, no penúltimo dia útil de maio e de novembro (15% se o prazo médio da carteira superar 365 dias; 20% caso contrário)

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Eventos societários reconhecidos na data "ex".
- Futuros: ajuste diário divulgado pela B3, liquidado em D+1.
- Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 5,97040379 (cota da última cobrança efetiva, em 31/12/2025).

**Alterações recentes**

- Assembleia de 22/01/2026 aprovou a redução da taxa de gestão de 2,210% a.a. para 1,810% a.a., com vigência a partir de 10/02/2026 (inclusive).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.495,080945 |  |
| HZTA3 | B3 — preço de fechamento de D | 30,48 |  |
| WQLA3 | B3 — preço de fechamento de D | 83,69 |  |
| VJNR3 | B3 — preço de fechamento de D | 67,28 |  |
| QPLN3 | B3 — preço de fechamento de D | 22,04 |  |
| XVRM3 | B3 — preço de fechamento de D | 47,10 |  |
| ZMBV3 | B3 — preço de fechamento de D | 34,69 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| INDJ26 | -150 | -354,47 |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 10/02/2026: 1,01481345

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 6,17891735 | 6,17884038 | -0,00007697 |
| Quantidade final de cotas | 117.532.418,04935183 | 117.532.425,26194233 | 7,21259050 |
| PL final | R$ 726.223.097,07 | R$ 726.214.095,17 | R$ -9.001,90 |
| Caixa | R$ 6.758.267,27 | R$ 6.758.267,27 | R$ 0,00 |
| Total de provisões | R$ 3.991.510,57 | R$ 4.000.513,00 | R$ 9.002,43 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 10.966 | 10.966 | 18.495,080945 | 18.495,080945 | 202.817.057,64 | 202.817.057,64 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 85.284 | 85.284 | 792,746276 | 792,746276 | 67.608.573,40 | 67.608.573,40 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| HZTA3 — Hortaz Tecnologia S.A. ON | 2.883.568 | 2.883.568 | 30,48 | 30,48 | 87.891.152,64 | 87.891.152,64 | 0,00 | B3 — preço de fechamento D |
| WQLA3 — Waqlá Alimentos S.A. ON | 565.492 | 565.492 | 83,69 | 83,69 | 47.326.025,48 | 47.326.025,48 | 0,00 | B3 — preço de fechamento D |
| VJNR3 — Vajanra Energia S.A. ON | 1.306.349 | 1.306.349 | 67,28 | 67,28 | 87.891.160,72 | 87.891.160,72 | 0,00 | B3 — preço de fechamento D |
| QPLN3 — Quiplan Saúde S.A. ON | 3.987.802 | 3.987.802 | 22,04 | 22,04 | 87.891.156,08 | 87.891.156,08 | 0,00 | B3 — preço de fechamento D |
| XVRM3 — Xavantina Mineração S.A. ON | 1.004.799 | 1.004.799 | 47,10 | 47,10 | 47.326.032,90 | 47.326.032,90 | 0,00 | B3 — preço de fechamento D |
| ZMBV3 — Zimbro Varejo S.A. ON | 2.728.510 | 2.728.510 | 34,69 | 34,69 | 94.652.011,90 | 94.652.011,90 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 723.403.170,76 | 723.403.170,76 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 6.183.273,65 | 6.183.273,65 |
| TED recebida — aplicação [APL-1] Cotista 5089 (15:41) | 3.577.578,33 | 3.577.578,33 |
| Pagamento de resgate [LIQ-1] — Cotista 5096 (cotizado em 06/02/2026) | -920.683,15 | -920.683,15 |
| Pagamento de resgate [LIQ-2] — Cotista 5103 (cotizado em 06/02/2026) | -460.075,96 | -460.075,96 |
| Liquidação B3 — ajuste de futuros de 09/02/2026 | -1.621.825,60 | -1.621.825,60 |
| **Saldo final** | 6.758.267,27 | 6.758.267,27 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 53.170,50 | 53.170,50 |

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 3.577.578,33 | 3.577.578,33 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 24.551,42 | 24.551,42 | 4.014,61 | 4.014,61 | 0,00 | 0,00 | 28.566,03 | 28.566,03 | 0,00 |
| TXGES — Taxa de gestão a pagar | 383.850,20 | 383.850,20 | 51.476,73 | 62.729,77 | 0,00 | 0,00 | 435.326,93 | 446.579,97 | 11.253,04 |
| TXCUS — Taxa máxima de custódia a pagar | 5.245,03 | 5.245,03 | 860,74 | 860,74 | 0,00 | 0,00 | 6.105,77 | 6.105,77 | 0,00 |
| AUDIT — Auditoria independente a pagar | 5.408,73 | 5.408,73 | 186,51 | 186,51 | 0,00 | 0,00 | 5.595,24 | 5.595,24 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 233,33 | 233,33 | 38,89 | 38,89 | 0,00 | 0,00 | 272,22 | 272,22 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 4.780,33 | 4.780,33 | 177,05 | 177,05 | 0,00 | 0,00 | 4.957,38 | 4.957,38 | 0,00 |
| PERF — Taxa de performance a pagar | 3.725.683,05 | 3.725.683,05 | -214.996,05 | -217.246,66 | 0,00 | 0,00 | 3.510.687,00 | 3.508.436,39 | -2.250,61 |
| **Total** |  |  |  |  |  |  | 3.991.510,57 | 4.000.513,00 | 9.002,43 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,14% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 4.014,61 · Beta: [base: PL do dia útil anterior] 0,14% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 4.014,61
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,81% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 51.476,73 · Beta: [base: PL do dia útil anterior] 2,21% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 62.729,77
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 860,74 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 723.133.463,62 fator exponencial (1+taxa)^(1/252) − 1 = R$ 860,74
- **AUDIT** — Alfa: R$ 47.000,00 (anual) ÷ 252 d.u. = R$ 186,51 · Beta: R$ 47.000,00 (anual) ÷ 252 d.u. = R$ 186,51
- **ANBIMA** — Alfa: R$ 700,00 (mensal) ÷ 18 d.u. = R$ 38,89 · Beta: R$ 700,00 (mensal) ÷ 18 d.u. = R$ 38,89
- **CVM** — Alfa: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05 · Beta: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05
- **PERF** — Alfa: 20% × max(0; cota bruta 6,20893518 − cota de referência 5,97040379 × fator 100% do CDI 1,01481345 = 6,05884607) × 116.953.420,44712625 cotas = R$ 3.510.687,00 · Beta: 20% × max(0; cota bruta 6,20883896 − cota de referência 5,97040379 × fator 100% do CDI 1,01481345 = 6,05884607) × 116.953.420,44712625 cotas = R$ 3.508.436,39

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 5089 | R$ 3.577.578,33 | 15:41 | 10/02/2026 | 10/02/2026 | 10/02/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 5096 | 150.041,00501129 cotas (R$ 920.683,15) |  | 07/01/2026 | 06/02/2026 | 10/02/2026 | não | não | cotizado em 06/02/2026 pela cota de 6,13621022; liquidação financeira hoje |
| LIQ-2 | resgate | Cotista 5103 | 74.977,21625832 cotas (R$ 460.075,96) |  | 07/01/2026 | 06/02/2026 | 10/02/2026 | não | não | cotizado em 06/02/2026 pela cota de 6,13621022; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 723.403.170,76 | 723.403.170,76 | 0,00 |
| Caixa | 6.758.267,27 | 6.758.267,27 | 0,00 |
| Valores a receber | 53.170,50 | 53.170,50 | 0,00 |
| Valores a pagar | 3.577.578,33 | 3.577.578,33 | 0,00 |
| Provisões | 3.991.510,57 | 4.000.513,00 | 9.002,43 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 726.212.961,16 | 726.212.961,16 | 0,00 |
| PL base da cota | 722.645.519,63 | 722.636.517,20 | -9.002,43 |
| Cota (8 casas) | 6,17891735 | 6,17884038 | -0,00007697 |
| Aplicações convertidas | 3.577.578,33 | 3.577.578,33 | 0,00 |
| Cotas emitidas | 578.997,60222557 | 579.004,81481607 | 7,21259050 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 117.532.418,04935183 | 117.532.425,26194233 | 7,21259050 |
| PL final | 726.223.097,07 | 726.214.095,17 | -9.001,90 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: taxa de gestão com percentual antigo.

**Dificuldade:** media · **Cenários:** taxa_reduzida_nao_aplicada

### Achado 1: taxa de gestão com percentual antigo

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta continuou apropriando a taxa de gestão a 2,210% a.a.; desde hoje o regulamento prevê 1,810% a.a.
- **Onde olhar:** Provisões — TXGES (apropriação do dia); Regulamento — alterações recentes
- **Raciocínio do analista:**
  1. O saldo anterior da taxa de gestão bate; a diferença está só na apropriação de hoje.
  2. Recalculei pelo regulamento: PL de D−1 R$ 723.133.463,62 × 1,810% pelo método do regulamento dá o valor do Alfa. O Beta usou 2,210%, que é a taxa de antes da assembleia.
  3. A redução vale a partir de hoje, inclusive. Este é o primeiro dia sob a nova taxa, por isso o saldo anterior ainda bate.
- **Ação:** Beta deve atualizar o cadastro da taxa de gestão para 1,810% a.a. com vigência em 10/02/2026 e reprocessar.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 6,17891735 |
| Quantidade final de cotas | 117.532.418,04935183 |
| PL final | R$ 726.223.097,07 |
| Caixa | R$ 6.758.267,27 |
| Total de provisões | R$ 3.991.510,57 |

### Armadilhas deste caso

- A mudança vale a partir de D (inclusive): o saldo anterior ainda bate, só a apropriação do dia diverge.
