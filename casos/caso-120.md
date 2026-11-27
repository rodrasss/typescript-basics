# Caso caso-120 — Bem-te-vi III FIE FIF Previdenciário Multimercado

> **Data-base (D):** 26/06/2026 (sexta-feira) · **D−1:** 25/06/2026 · **Fundo:** FND-0120

## 1. O fundo

O Bem-te-vi III FIE FIF Previdenciário Multimercado é gerido pela Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte, em Curitiba/PR. Criado em 21/10/2022, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo trocou de gestor responsável em 2023 depois da saída do fundador e adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão. O gestor responsável é Caio, e quem cuida da validação do fundo é Thiago. Sobre a rotina: a gestora publica uma carta mensal aos cotistas até o 5º dia útil; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. A performance depende de data-base e de fator de benchmark, e as pontas já divergiram nisso. Nos últimos meses o fundo não teve nenhuma divergência relevante. No fechamento de ontem (25/06/2026) o fundo tinha PL de R$ 666.765.761,98, cota de 2,62933765 e 253.586.967,79741868 cotas. Hoje, sexta-feira, 26/06/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 666.765.761,98 |
| Cota em D−1 | 2,62933765 |
| Quantidade de cotas em D−1 | 253.586.967,79741868 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/03/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,130% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,800% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 26.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 600,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 3.600,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 637.264.847,72. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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

- Aplicação: conversão em D+0 (cota de fechamento do dia do crédito dos recursos), para recursos disponíveis até 15:00; recursos creditados após o horário de corte são convertidos no dia útil seguinte.
- Resgate: cotização D+1 útil (liquidação D+1 útil após a cotização).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Previdência: tributação no plano (seguradora); sem come-cotas

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Debêntures: taxa indicativa ANBIMA de D.
- Ações: preço de fechamento da B3 em D.

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 2,60414907 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.132,545172 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.479,951145 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.101,284423 |  |
| LINO11 | ANBIMA — PU pela taxa indicativa de D | 1.127,310788 |  |
| XVRM3 | B3 — preço de fechamento de D | 8,98 |  |
| ZMBV3 | B3 — preço de fechamento de D | 77,94 |  |
| WQLA3 | B3 — preço de fechamento de D | 55,48 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 26/06/2026: 1,00869854
- Fator acumulado do 100% do CDI de 31/12/2024 até 26/06/2026: 1,02491514 (data-base de um período anterior — informativo)

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 2,63507270 | 2,63714054 | 0,00206784 |
| Quantidade final de cotas | 253.586.967,79741868 | 253.586.967,79741868 | 0,00000000 |
| PL final | R$ 668.220.095,92 | R$ 668.744.473,19 | R$ 524.377,27 |
| Caixa | R$ 6.255.020,73 | R$ 6.255.020,73 | R$ 0,00 |
| Total de provisões | R$ 1.023.790,23 | R$ 499.414,02 | R$ -524.376,21 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 13.500 | 13.500 | 18.132,545172 | 18.132,545172 | 244.789.359,82 | 244.789.359,82 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 23.417 | 23.417 | 4.479,951145 | 4.479,951145 | 104.907.015,96 | 104.907.015,96 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 17.053 | 17.053 | 4.101,284423 | 4.101,284423 | 69.939.203,27 | 69.939.203,27 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 68.361 | 68.361 | 818,452101 | 818,452101 | 55.950.204,08 | 55.950.204,08 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| LINO11 — Debênture Logística Integrada Norte S.A. — CDI + 2,10% | 74.447 | 74.447 | 1.127,310788 | 1.127,310788 | 83.924.906,23 | 83.924.906,23 | 0,00 | ANBIMA — taxa indicativa D |
| XVRM3 — Xavantina Mineração S.A. ON | 3.894.085 | 3.894.085 | 8,98 | 8,98 | 34.968.883,30 | 34.968.883,30 | 0,00 | B3 — preço de fechamento D |
| ZMBV3 — Zimbro Varejo S.A. ON | 448.664 | 448.664 | 77,94 | 77,94 | 34.968.872,16 | 34.968.872,16 | 0,00 | B3 — preço de fechamento D |
| WQLA3 — Waqlá Alimentos S.A. ON | 630.297 | 630.297 | 55,48 | 55,48 | 34.968.877,56 | 34.968.877,56 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 664.417.322,38 | 664.417.322,38 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 6.706.465,29 | 6.706.465,29 |
| Pagamento de resgate — Cotista 5166 (cotizado em 25/06/2026) | -451.444,56 | -451.444,56 |
| **Saldo final** | 6.255.020,73 | 6.255.020,73 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| RESGATES A PAGAR — Resgates cotizados em dias anteriores, a liquidar | 1.428.454,91 | 1.428.454,91 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 63.054,35 | 63.054,35 | 3.437,44 | 3.437,44 | 0,00 | 0,00 | 66.491,79 | 66.491,79 | 0,00 |
| TXGES — Taxa de gestão a pagar | 369.893,66 | 369.893,66 | 21.083,28 | 21.083,28 | 0,00 | 0,00 | 390.976,94 | 390.976,94 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 9.733,76 | 9.733,76 | 529,13 | 529,13 | 0,00 | 0,00 | 10.262,89 | 10.262,89 | 0,00 |
| AUDIT — Auditoria independente a pagar | 17.333,33 | 17.333,33 | 103,17 | 103,17 | 0,00 | 0,00 | 17.436,50 | 17.436,50 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 514,29 | 514,29 | 28,57 | 28,57 | 0,00 | 0,00 | 542,86 | 542,86 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 3.085,71 | 3.085,71 | 171,43 | 171,43 | 0,00 | 0,00 | 3.257,14 | 3.257,14 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 10.268,85 | 10.268,85 | 177,05 | 177,05 | 0,00 | 0,00 | 10.445,90 | 10.445,90 | 0,00 |
| PERF — Taxa de performance a pagar | 526.378,50 | 526.378,50 | -2.002,29 | -526.378,50 | 0,00 | 0,00 | 524.376,21 | 0,00 | -524.376,21 |
| **Total** |  |  |  |  |  |  | 1.023.790,23 | 499.414,02 | -524.376,21 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| LIQ-1 | resgate | Cotista 5166 | 172.226,55353769 cotas (R$ 451.444,56) |  | 17/06/2026 | 25/06/2026 | 26/06/2026 | não | não | cotizado em 25/06/2026 pela cota de 2,62122508; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 664.417.322,38 | 664.417.322,38 | 0,00 |
| Caixa | 6.255.020,73 | 6.255.020,73 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 1.428.454,91 | 1.428.454,91 | 0,00 |
| Provisões | 1.023.790,23 | 499.414,02 | -524.376,21 |
| PL base da cota | 668.220.097,97 | 668.744.474,18 | 524.376,21 |
| Cota (8 casas) | 2,63507270 | 2,63714054 | 0,00206784 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 253.586.967,79741868 | 253.586.967,79741868 | 0,00000000 |
| PL final | 668.220.095,92 | 668.744.473,19 | 524.377,27 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO (com ressalva)

**Resumo:** Aprovar com ressalva: Fator do benchmark de outra data-base.

**Dificuldade:** media · **Cenários:** performance_data_base_errada

### Achado 1: Fator do benchmark de outra data-base

- **Gravidade:** ressalva · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta corrigiu a cota de referência com o fator acumulado desde 31/12/2024, e não desde 31/12/2025 (data da última cobrança).
- **Onde olhar:** Provisões — PERF (memória); Informações de mercado — fatores do benchmark; Regulamento — performance
- **Raciocínio do analista:**
  1. A provisão de performance diverge, enquanto as outras taxas batem.
  2. A cota de referência vale desde 31/12/2025, então o fator correto é o acumulado a partir dessa data (1,00869854). O Beta usou 1,02491514, que corresponde ao período anterior.
- **Ação:** Beta deve corrigir a data-base do benchmark e recalcular a performance.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 2,63507270 |
| Quantidade final de cotas | 253.586.967,79741868 |
| PL final | R$ 668.220.095,92 |
| Caixa | R$ 6.255.020,73 |
| Total de provisões | R$ 1.023.790,23 |
