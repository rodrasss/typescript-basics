# Caso caso-056 — Jabuticaba FIF Multimercado Long Short

> **Data-base (D):** 25/05/2026 (segunda-feira) · **D−1:** 22/05/2026 · **Fundo:** FND-0056

## 1. O fundo

Sob a gestão da Marola Asset, gestora jovem de ações, muito ativa em eventos societários e small caps (Florianópolis/SC), o Jabuticaba FIF Multimercado Long Short é um dos fundos que mais exigem atenção na rotina de validação. Criado em 21/06/2016, monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição. Público-alvo: investidores qualificados. Hoje seus cotistas são clientes private de dois bancos de varejo. Ao longo da vida, o fundo reduziu o prazo de cotização em 2024 para competir em plataformas e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Cecília, e quem cuida da validação do fundo é Diego. Sobre a rotina: o fundo está fechado para novas aplicações de varejo e só aceita aportes de cotistas existentes; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. A carteira de ações tem pagadoras de dividendos relevantes. A liquidação dos ajustes de futuros exige conciliação diária. No fechamento de ontem (22/05/2026) o fundo tinha PL de R$ 97.719.559,78, cota de 6,77014458 e 14.433.895,55804843 cotas. Hoje, segunda-feira, 25/05/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Long & Short |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Marola Asset (Florianópolis/SC) |
| PL em D−1 | R$ 97.719.559,78 |
| Cota em D−1 | 6,77014458 |
| Quantidade de cotas em D−1 | 14.433.895,55804843 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/11/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,060% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,470% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 43.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 1.100,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 94.391.219,12. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização D+15 corridos (liquidação D+2 úteis).
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

- Performance: cota de referência vigente = 6,27609392 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.243,626080 |  |
| HZTA3 | B3 — preço de fechamento de D | 93,57 |  |
| UQPA4 | B3 — preço de fechamento de D | 32,58 |  |
| WJMA4 | B3 — preço de fechamento de D | 61,64 |  |
| YKAP4 | B3 — preço de fechamento de D | 83,12 |  |
| YRBQ3 | B3 — preço de fechamento de D | 65,16 |  |
| ZFRT3 | B3 — preço de fechamento de D | 26,50 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| INDM26 | -114 | 54,73 |

**Eventos de ativos**

- YKAP4: dividendos de R$ 2,70 por ação; data-com 22/05/2026; negociação "ex" a partir de 25/05/2026; pagamento em 15/06/2026.

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 25/05/2026: 1,06295528

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 6,76103154 | 6,74008475 | -0,02094679 |
| Quantidade final de cotas | 14.568.863,16781516 | 14.569.333,65197455 | 470,48415939 |
| PL final | R$ 98.500.543,38 | R$ 98.198.543,57 | R$ -301.999,81 |
| Caixa | R$ 1.107.870,47 | R$ 1.382.900,24 | R$ 275.029,77 |
| Total de provisões | R$ 434.151,56 | R$ 358.565,60 | R$ -75.585,96 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 1.472 | 1.472 | 18.243,626080 | 18.243,626080 | 26.854.617,59 | 26.854.617,59 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 11.022 | 11.022 | 811,999129 | 811,999129 | 8.949.854,40 | 8.949.854,40 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| HZTA3 — Hortaz Tecnologia S.A. ON | 105.212 | 105.212 | 93,57 | 93,57 | 9.844.686,84 | 9.844.686,84 | 0,00 | B3 — preço de fechamento D |
| UQPA4 — Uquapé Petroquímica S.A. PN | 274.700 | 274.700 | 32,58 | 32,58 | 8.949.726,00 | 8.949.726,00 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 174.232 | 174.232 | 61,64 | 61,64 | 10.739.660,48 | 10.739.660,48 | 0,00 | B3 — preço de fechamento D |
| YKAP4 — Ykapé Papel e Celulose S.A. PN | 139.974 | 139.974 | 83,12 | 83,12 | 11.634.638,88 | 11.634.638,88 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 192.290 | 192.290 | 65,16 | 65,16 | 12.529.616,40 | 12.529.616,40 | 0,00 | B3 — preço de fechamento D |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 303.952 | 303.952 | 26,50 | 26,50 | 8.054.728,00 | 8.054.728,00 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 97.557.528,59 | 97.557.528,59 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 368.116,91 | 368.116,91 |
| TED recebida — aplicação Cotista 4249 (12:22) | 433.364,11 | 433.364,11 |
| TED recebida — aplicação Cotista 4256 (11:31) | 170.367,90 | 170.367,90 |
| TED recebida — aplicação Cotista 4263 (09:59) | 419.810,41 | 419.810,41 |
| Pagamento de resgate — Cotista 4277 (cotizado em 22/05/2026) | -283.788,86 | -283.788,86 |
| Liquidação B3 — ajuste de futuros de 22/05/2026 | — | 275.029,77 |
| **Saldo final** | 1.107.870,47 | 1.382.900,24 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| DIVIDENDOS A RECEBER YKAP4 — Dividendos a receber — YKAP4 (R$ 2,70/ação) | 377.929,80 | — |
| AJUSTE FUTUROS D-1 — Ajuste de futuros de 22/05/2026 a receber | 275.029,77 | — |

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 1.023.542,42 | 1.023.542,42 |
| RESGATES A PAGAR — Resgates cotizados em dias anteriores, a liquidar | 266.402,19 | 266.402,19 |
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 6.239,22 | 6.239,22 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 3.549,27 | 3.549,27 | 232,67 | 232,67 | 0,00 | 0,00 | 3.781,94 | 3.781,94 | 0,00 |
| TXGES — Taxa de gestão a pagar | 84.251,03 | 84.251,03 | 5.700,31 | 5.700,31 | 0,00 | 0,00 | 89.951,34 | 89.951,34 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 1.697,41 | 1.697,41 | 116,33 | 116,33 | 0,00 | 0,00 | 1.813,74 | 1.813,74 | 0,00 |
| AUDIT — Auditoria independente a pagar | 10.238,10 | 10.238,10 | 170,63 | 170,63 | 0,00 | 0,00 | 10.408,73 | 10.408,73 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 825,00 | 825,00 | 55,00 | 55,00 | 0,00 | 0,00 | 880,00 | 880,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 3.098,36 | 3.098,36 | 88,52 | 88,52 | 0,00 | 0,00 | 3.186,88 | 3.186,88 | 0,00 |
| PERF — Taxa de performance a pagar | 257.943,92 | 257.943,92 | 66.185,01 | -9.400,95 | 0,00 | 0,00 | 324.128,93 | 248.542,97 | -75.585,96 |
| **Total** |  |  |  |  |  |  | 434.151,56 | 358.565,60 | -75.585,96 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 232,67 · Beta: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 232,67
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,47% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 5.700,31 · Beta: [base: PL do dia útil anterior] 1,47% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 5.700,31
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 116,33 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 97.719.559,78 ÷ 252 (linear, dias úteis) = R$ 116,33
- **AUDIT** — Alfa: R$ 43.000,00 (anual) ÷ 252 d.u. = R$ 170,63 · Beta: R$ 43.000,00 (anual) ÷ 252 d.u. = R$ 170,63
- **ANBIMA** — Alfa: R$ 1.100,00 (mensal) ÷ 20 d.u. = R$ 55,00 · Beta: R$ 1.100,00 (mensal) ÷ 20 d.u. = R$ 55,00
- **CVM** — Alfa: R$ 5.400,00 (trimestral) ÷ 61 d.u. = R$ 88,52 · Beta: R$ 5.400,00 (trimestral) ÷ 61 d.u. = R$ 88,52
- **PERF** — Alfa: 20% × max(0; cota bruta 6,78348764 − cota de referência 6,27609392 × fator 100% do CDI 1,06295528 = 6,67120717) × 14.433.895,55804843 cotas = R$ 324.128,93 · Beta: 20% × max(0; cota bruta 6,75730415 − cota de referência 6,27609392 × fator 100% do CDI 1,06295528 = 6,67120717) × 14.433.895,55804843 cotas = R$ 248.542,97

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 4249 | R$ 433.364,11 | 12:22 | 25/05/2026 | 25/05/2026 | 25/05/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista 4256 | R$ 170.367,90 | 11:31 | 25/05/2026 | 25/05/2026 | 25/05/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista 4263 | R$ 419.810,41 | 09:59 | 25/05/2026 | 25/05/2026 | 25/05/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 4270 | 16.420,88974613 cotas |  | 24/05/2026 | 25/05/2026 | 27/05/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 4277 | 41.844,78067537 cotas (R$ 283.788,86) |  | 19/05/2026 | 22/05/2026 | 25/05/2026 | não | não | cotizado em 22/05/2026 pela cota de 6,78194167; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 97.557.528,59 | 97.557.528,59 | 0,00 |
| Caixa | 1.107.870,47 | 1.382.900,24 | 275.029,77 |
| Valores a receber | 652.959,57 | 0,00 | -652.959,57 |
| Valores a pagar | 1.296.183,83 | 1.296.183,83 | 0,00 |
| Provisões | 434.151,56 | 358.565,60 | -75.585,96 |
| PL base da cota | 97.588.023,24 | 97.285.679,40 | -302.343,84 |
| Cota (8 casas) | 6,76103154 | 6,74008475 | -0,02094679 |
| Aplicações convertidas | 1.023.542,42 | 1.023.542,42 | 0,00 |
| Cotas emitidas | 151.388,49951286 | 151.858,98367225 | 470,48415939 |
| Cotas resgatadas | 16.420,88974613 | 16.420,88974613 | 0,00000000 |
| Valor dos resgates cotizados | 111.022,15 | 110.678,19 | -343,96 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 14.568.863,16781516 | 14.569.333,65197455 | 470,48415939 |
| PL final | 98.500.543,38 | 98.198.543,57 | -301.999,81 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO (com ressalva)

**Resumo:** Reprovar até o ajuste: Dividendos de YKAP4 não provisionados; Ajuste de D−1 liquidado e não baixado.

**Dificuldade:** media · **Cenários:** dividendo_ex_nao_provisionado, ajuste_liquidado_nao_baixado

### Achado 1: Dividendos de YKAP4 não provisionados

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta precificou YKAP4 "ex" mas não registrou os dividendos a receber.
- **Onde olhar:** Valores a receber; Informações de mercado — eventos societários; Carteira — YKAP4
- **Raciocínio do analista:**
  1. Os ativos batem, mas o Alfa tem R$ 377.929,80 de dividendos a receber de YKAP4 que o Beta não tem.
  2. YKAP4 ficou "ex" em D: o preço de fechamento já não carrega o dividendo. Se o direito não entra como valor a receber, o fundo perde esse valor no PL.
  3. O regulamento manda reconhecer o evento na data "ex", então o lado correto é o que provisionou.
- **Ação:** Beta deve registrar R$ 377.929,80 de dividendos a receber de YKAP4 e reprocessar a cota.

### Achado 2: Ajuste de D−1 liquidado e não baixado

- **Gravidade:** ressalva · **Dimensões:** caixa
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa não registrou a liquidação financeira do ajuste de 22/05/2026 (R$ 275.029,77) e manteve o valor pendente.
- **Onde olhar:** Caixa; Valores a receber/pagar — ajuste D−1
- **Raciocínio do analista:**
  1. O caixa difere em R$ 275.029,77, e o Alfa tem um "ajuste de D−1" pendente no mesmo valor. PL e cota iguais.
  2. O ajuste de D−1 liquida em D. É questão de baixa, sem efeito no PL.
- **Ação:** Alfa deve baixar o ajuste de D−1 contra o caixa. Sem impacto na cota.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | Beta |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 6,76103154 |
| Quantidade final de cotas | 14.568.863,16781516 |
| PL final | R$ 98.500.543,38 |
| Caixa | R$ 1.382.900,24 |
| Total de provisões | R$ 434.151,56 |
