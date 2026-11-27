# Caso caso-117 — Paineira Plus FIE FIF Previdenciário Multimercado

> **Data-base (D):** 05/03/2026 (quinta-feira) · **D−1:** 04/03/2026 · **Fundo:** FND-0117

## 1. O fundo

Quem acompanha a Remanso Asset (Curitiba/PR) conhece o Paineira Plus FIE FIF Previdenciário Multimercado: a casa é uma gestora de previdência ligada a uma seguradora de médio porte. Criado em 18/07/2017, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo aprovou em assembleia, em 2024, a redução das taxas, já em vigor desde aquele ano e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Otávio, e quem cuida da validação do fundo é Camila. Sobre a rotina: o administrador revisa o manual de precificação uma vez por ano; a equipe da gestora trabalha com planilhas próprias e às vezes manda informação por e-mail antes da confirmação formal. No fechamento de ontem (04/03/2026) o fundo tinha PL de R$ 2.507.921.074,29, cota de 5,37476342 e 466.610.505,11765575 cotas. Hoje, quinta-feira, 05/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 2.507.921.074,29 |
| Cota em D−1 | 5,37476342 |
| Quantidade de cotas em D−1 | 466.610.505,11765575 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/05/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,080% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,610% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 51.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 900,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 4.900,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 2.471.747.917,98. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização D+1 útil (liquidação D+1 útil após a cotização).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Previdência: tributação no plano (seguradora); sem come-cotas

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Debêntures: taxa indicativa ANBIMA de D.
- Ações: preço de fechamento da B3 em D.

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.334,016950 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.450,665515 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.221,171561 |  |
| HBVI12 | ANBIMA — PU pela taxa indicativa de D | 1.014,214365 |  |
| WQLA3 | B3 — preço de fechamento de D | 27,68 |  |
| WJMA4 | B3 — preço de fechamento de D | 77,84 |  |
| QPLN3 | B3 — preço de fechamento de D | 39,89 |  |

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,31930913 | 5,31930913 | 0,00000000 |
| Quantidade final de cotas | 468.417.663,44312050 | 468.417.663,44312050 | 0,00000000 |
| PL final | R$ 2.491.658.353,81 | R$ 2.491.658.353,81 | R$ 0,00 |
| Caixa | R$ 19.597.097,36 | R$ 39.156.646,93 | R$ 19.559.549,57 |
| Total de provisões | R$ 1.607.695,79 | R$ 1.607.695,79 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 49.775 | 49.775 | 18.334,016950 | 18.334,016950 | 912.575.693,69 | 912.575.693,69 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 87.875 | 87.875 | 4.450,665515 | 4.450,665515 | 391.102.232,13 | 391.102.232,13 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 61.768 | 61.768 | 4.221,171561 | 4.221,171561 | 260.733.324,98 | 260.733.324,98 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 258.585 | 258.585 | 806,650911 | 806,650911 | 208.587.825,82 | 208.587.825,82 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| HBVI12 — Debênture Hospitalar Bem Viver S.A. — CDI + 1,95% | 308.497 | 308.497 | 1.014,214365 | 1.014,214365 | 312.882.088,96 | 312.882.088,96 | 0,00 | ANBIMA — taxa indicativa D |
| WQLA3 — Waqlá Alimentos S.A. ON | 4.709.809 | 4.709.809 | 27,68 | 27,68 | 130.367.513,12 | 130.367.513,12 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 1.674.814 | 1.674.814 | 77,84 | 77,84 | 130.367.521,76 | 130.367.521,76 | 0,00 | B3 — preço de fechamento D |
| QPLN3 — Quiplan Saúde S.A. ON | 3.268.175 | 3.268.175 | 39,89 | 39,89 | 130.367.500,75 | 130.367.500,75 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 2.476.983.701,21 | 2.476.983.701,21 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 29.543.813,15 | 29.543.813,15 |
| TED recebida — aplicação Cotista 4823 (11:37) | 9.612.833,78 | 9.612.833,78 |
| Liquidação de compra — 490200 QPLN3 | -19.559.549,57 | — |
| **Saldo final** | 19.597.097,36 | 39.156.646,93 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 9.612.833,78 | 9.612.833,78 |
| RESGATES A PAGAR — Resgates cotizados em dias anteriores, a liquidar | 3.314.748,15 | 3.314.748,15 |
| COMPRAS A LIQUIDAR — Compras de ações a liquidar (D+2) — 490200 QPLN3 em 04/03/2026 | — | 19.559.549,57 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 169.824,74 | 169.824,74 | 7.958,48 | 7.958,48 | 0,00 | 0,00 | 177.783,22 | 177.783,22 | 0,00 |
| TXGES — Taxa de gestão a pagar | 1.301.489,59 | 1.301.489,59 | 60.523,93 | 60.523,93 | 0,00 | 0,00 | 1.362.013,52 | 1.362.013,52 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 42.965,37 | 42.965,37 | 1.990,22 | 1.990,22 | 0,00 | 0,00 | 44.955,59 | 44.955,59 | 0,00 |
| AUDIT — Auditoria independente a pagar | 11.535,71 | 11.535,71 | 202,38 | 202,38 | 0,00 | 0,00 | 11.738,09 | 11.738,09 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 122,73 | 122,73 | 40,91 | 40,91 | 0,00 | 0,00 | 163,64 | 163,64 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 668,18 | 668,18 | 222,73 | 222,73 | 0,00 | 0,00 | 890,91 | 890,91 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 9.914,75 | 9.914,75 | 236,07 | 236,07 | 0,00 | 0,00 | 10.150,82 | 10.150,82 | 0,00 |
| **Total** |  |  |  |  |  |  | 1.607.695,79 | 1.607.695,79 | 0,00 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,08% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 7.958,48 · Beta: [base: PL do dia útil anterior] 0,08% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 7.958,48
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,61% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 60.523,93 · Beta: [base: PL do dia útil anterior] 0,61% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 60.523,93
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 1.990,22 · Beta: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 2.507.921.074,29 fator exponencial (1+taxa)^(1/252) − 1 = R$ 1.990,22
- **AUDIT** — Alfa: R$ 51.000,00 (anual) ÷ 252 d.u. = R$ 202,38 · Beta: R$ 51.000,00 (anual) ÷ 252 d.u. = R$ 202,38
- **ANBIMA** — Alfa: R$ 900,00 (mensal) ÷ 22 d.u. = R$ 40,91 · Beta: R$ 900,00 (mensal) ÷ 22 d.u. = R$ 40,91
- **SELIC** — Alfa: R$ 4.900,00 (mensal) ÷ 22 d.u. = R$ 222,73 · Beta: R$ 4.900,00 (mensal) ÷ 22 d.u. = R$ 222,73
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07 · Beta: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 4823 | R$ 9.612.833,78 | 11:37 | 05/03/2026 | 05/03/2026 | 05/03/2026 | sim | sim |  |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 2.476.983.701,21 | 2.476.983.701,21 | 0,00 |
| Caixa | 19.597.097,36 | 39.156.646,93 | 19.559.549,57 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 12.927.581,93 | 32.487.131,50 | 19.559.549,57 |
| Provisões | 1.607.695,79 | 1.607.695,79 | 0,00 |
| PL base da cota | 2.482.045.520,85 | 2.482.045.520,85 | 0,00 |
| Cota (8 casas) | 5,31930913 | 5,31930913 | 0,00000000 |
| Aplicações convertidas | 9.612.833,78 | 9.612.833,78 | 0,00 |
| Cotas emitidas | 1.807.158,32546471 | 1.807.158,32546471 | 0,00000000 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 468.417.663,44312050 | 468.417.663,44312050 | 0,00000000 |
| PL final | 2.491.658.353,81 | 2.491.658.353,81 | 0,00 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO (com ressalva)

**Resumo:** Aprovar com ressalva: Liquidação de compra de QPLN3 antecipada no controle Alfa.

**Dificuldade:** media · **Cenários:** liquidacao_compra_antecipada

### Achado 1: Liquidação de compra de QPLN3 antecipada no controle Alfa

- **Gravidade:** ressalva · **Dimensões:** caixa
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** O Alfa debitou hoje a compra de 490200 QPLN3 feita em 04/03/2026, cuja liquidação na B3 é em D+2 (06/03/2026).
- **Onde olhar:** Caixa; Valores a pagar — compras a liquidar
- **Raciocínio do analista:**
  1. Caixa do Alfa R$ 19.559.549,57 menor e "compras a liquidar" R$ 19.559.549,57 menor. PL igual.
  2. A compra foi em 04/03/2026. Ações liquidam em D+2, ou seja, 06/03/2026. Hoje o dinheiro ainda está na conta e a obrigação ainda existe.
  3. Sem efeito na cota, mas o caixa projetado do Alfa subestima a liquidez de hoje e pode atrapalhar decisões de zeragem.
- **Ação:** Alfa deve estornar a liquidação antecipada e manter a obrigação até D+2. Aprovação com ressalva.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | ambos |
| caixa | Beta |
| provisoes | ambos |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 5,31930913 |
| Quantidade final de cotas | 468.417.663,44312050 |
| PL final | R$ 2.491.658.353,81 |
| Caixa | R$ 39.156.646,93 |
| Total de provisões | R$ 1.607.695,79 |
