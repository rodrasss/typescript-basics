# Caso caso-020 — Jatobá FIE FIF Previdenciário Multimercado

> **Data-base (D):** 17/03/2026 (terça-feira) · **D−1:** 16/03/2026 · **Fundo:** FND-0020

## 1. O fundo

O Jatobá FIE FIF Previdenciário Multimercado é gerido pela Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte, em Curitiba/PR. Criado em 24/09/2010, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025 e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Cecília, e quem cuida da validação do fundo é Juliana. Sobre a rotina: a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras; o fundo tem aplicações e resgates quase todos os dias. No fechamento de ontem (16/03/2026) o fundo tinha PL de R$ 494.703.399,60, cota de 4,10998472 e 120.366.238,14992312 cotas. Hoje, terça-feira, 17/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 494.703.399,60 |
| Cota em D−1 | 4,10998472 |
| Quantidade de cotas em D−1 | 120.366.238,14992312 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/07/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,160% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,730% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 69.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 1.000,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 4.800,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 470.102.560,87. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.299,484642 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.371,008509 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.175,901398 |  |
| EVSA12 | ANBIMA — PU pela taxa indicativa de D | 1.063,706194 |  |
| UQPA4 | B3 — preço de fechamento de D | 6,30 |  |
| WQLA3 | B3 — preço de fechamento de D | 8,80 |  |
| WJMA4 | B3 — preço de fechamento de D | 82,10 |  |

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 4,08398311 | 4,08423733 | 0,00025422 |
| Quantidade final de cotas | 121.282.060,59030332 | 121.281.979,00577960 | -81,58452372 |
| PL final | R$ 495.313.887,00 | R$ 495.344.386,11 | R$ 30.499,11 |
| Caixa | R$ 6.448.779,08 | R$ 6.479.378,44 | R$ 30.599,36 |
| Total de provisões | R$ 242.482,68 | R$ 242.482,68 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 9.761 | 9.761 | 18.299,484642 | 18.299,484642 | 178.621.269,59 | 178.621.269,59 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 17.954 | 17.954 | 4.371,008509 | 4.371,008509 | 78.477.086,77 | 78.477.086,77 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 12.529 | 12.529 | 4.175,901398 | 4.175,901398 | 52.319.868,62 | 52.319.868,62 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 51.910 | 51.910 | 806,285794 | 806,285794 | 41.854.295,57 | 41.854.295,57 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| EVSA12 — Debênture Energética Vale do Sapucaí S.A. — CDI + 1,45% | 59.021 | 59.021 | 1.063,706194 | 1.063,706194 | 62.781.003,28 | 62.781.003,28 | 0,00 | ANBIMA — taxa indicativa D |
| UQPA4 — Uquapé Petroquímica S.A. PN | 4.152.210 | 4.152.210 | 6,30 | 6,30 | 26.158.923,00 | 26.158.923,00 | 0,00 | B3 — preço de fechamento D |
| WQLA3 — Waqlá Alimentos S.A. ON | 2.972.605 | 2.972.605 | 8,80 | 8,80 | 26.158.924,00 | 26.158.924,00 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 318.623 | 318.623 | 82,10 | 82,10 | 26.158.948,30 | 26.158.948,30 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 492.530.319,13 | 492.530.319,13 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 5.570.174,42 | 5.570.174,42 |
| TED recebida — aplicação Cotista 5803 (13:10) | 1.211.544,36 | 1.211.544,36 |
| TED recebida — aplicação Cotista 5810 (13:08) | 2.175.496,00 | 2.175.496,00 |
| TED recebida — aplicação Cotista 5817 (10:47) | 1.965.907,04 | 1.965.907,04 |
| Pagamento de resgate — Cotista 2669 (cotizado em 16/03/2026) | -4.474.342,74 | -4.443.743,38 |
| **Saldo final** | 6.448.779,08 | 6.479.378,44 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 5.352.947,40 | 5.352.947,40 |
| RESGATES A PAGAR — Resgates cotizados em dias anteriores, a liquidar | 1.809.983,44 | 1.809.983,44 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 34.249,54 | 34.249,54 | 3.138,47 | 3.138,47 | 0,00 | 0,00 | 37.388,01 | 37.388,01 | 0,00 |
| TXGES — Taxa de gestão a pagar | 157.745,24 | 157.745,24 | 14.278,85 | 14.278,85 | 0,00 | 0,00 | 172.024,09 | 172.024,09 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 6.324,31 | 6.324,31 | 588,84 | 588,84 | 0,00 | 0,00 | 6.913,15 | 6.913,15 | 0,00 |
| AUDIT — Auditoria independente a pagar | 13.690,48 | 13.690,48 | 273,81 | 273,81 | 0,00 | 0,00 | 13.964,29 | 13.964,29 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 500,00 | 500,00 | 45,45 | 45,45 | 0,00 | 0,00 | 545,45 | 545,45 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 2.400,00 | 2.400,00 | 218,18 | 218,18 | 0,00 | 0,00 | 2.618,18 | 2.618,18 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 8.852,46 | 8.852,46 | 177,05 | 177,05 | 0,00 | 0,00 | 9.029,51 | 9.029,51 | 0,00 |
| **Total** |  |  |  |  |  |  | 242.482,68 | 242.482,68 | 0,00 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 5803 | R$ 1.211.544,36 | 13:10 | 17/03/2026 | 17/03/2026 | 17/03/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista 5810 | R$ 2.175.496,00 | 13:08 | 17/03/2026 | 17/03/2026 | 17/03/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista 5817 | R$ 1.965.907,04 | 10:47 | 17/03/2026 | 17/03/2026 | 17/03/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 5824 | 320.718,20470965 cotas |  | 10/03/2026 | 17/03/2026 | 18/03/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista 5831 | 74.176,67567789 cotas |  | 02/03/2026 | 17/03/2026 | 18/03/2026 | sim | sim |  |
| LIQ-K12 | resgate | Cotista 2669 | 1.088.651,91484381 cotas (R$ 4.474.342,74) |  | 12/02/2026 | 16/03/2026 | 17/03/2026 | não | não | cotizado em 16/03/2026 pela cota de 4,10998472 (cota da data do pedido, 12/02/2026: 4,08187715); liquidação hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 492.530.319,13 | 492.530.319,13 | 0,00 |
| Caixa | 6.448.779,08 | 6.479.378,44 | 30.599,36 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 7.162.930,84 | 7.162.930,84 | 0,00 |
| Provisões | 242.482,68 | 242.482,68 | 0,00 |
| PL base da cota | 491.573.684,69 | 491.604.284,05 | 30.599,36 |
| Cota (8 casas) | 4,08398311 | 4,08423733 | 0,00025422 |
| Aplicações convertidas | 5.352.947,40 | 5.352.947,40 | 0,00 |
| Cotas emitidas | 1.310.717,32076774 | 1.310.635,73624402 | -81,58452372 |
| Cotas resgatadas | 394.894,88038754 | 394.894,88038754 | 0,00000000 |
| Valor dos resgates cotizados | 1.612.744,02 | 1.612.844,41 | 100,39 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 121.282.060,59030332 | 121.281.979,00577960 | -81,58452372 |
| PL final | 495.313.887,00 | 495.344.386,11 | 30.499,11 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Resgate de Cotista 2669 pago a menor.

**Dificuldade:** media · **Cenários:** resgate_pago_com_cota_errada

### Achado 1: Resgate de Cotista 2669 pago a menor

- **Gravidade:** erro · **Dimensões:** caixa, cota
- **Lado correto:** nenhum · **Quem ajusta:** Beta (complemento ao cotista) e Alfa (caixa real)
- **Causa raiz:** O resgate de Cotista 2669 (1.088.651,91484381 cotas) foi pago pela cota da data do pedido (4.08187715) e não pela cota de cotização (4,10998472). O cotista recebeu R$ 30.599,36 a menos.
- **Onde olhar:** Caixa — pagamento de resgate; Movimentações de passivo (cota de cotização); Regulamento — cotização de resgates
- **Raciocínio do analista:**
  1. O Alfa projetou o pagamento de R$ 4.474.342,74 e o Beta mostra R$ 4.443.743,38 pagos. Diferença: R$ 30.599,36.
  2. Recalculei: 1.088.651,91484381 cotas × cota de cotização 4,10998472 = R$ 4.474.342,74. O valor pago corresponde à cota da data do pedido, que o regulamento não usa.
  3. O dinheiro a menos ficou no fundo e o Beta zerou a obrigação, então o PL dele fica inflado. O cotista tem direito ao complemento.
- **Ação:** Pagar o complemento de R$ 30.599,36 ao cotista. Até lá, os dois lados registram "complemento de resgate a pagar". O Alfa ajusta o caixa ao valor efetivamente pago. Apurar se outros resgates do dia tiveram o mesmo problema.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | Beta |
| provisoes | ambos |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 4,08398311 |
| Quantidade final de cotas | 121.282.060,59030332 |
| PL final | R$ 495.313.887,00 |
| Caixa | R$ 6.479.378,44 |
| Total de provisões | R$ 242.482,68 |

### Armadilhas deste caso

- Recalcular o valor do resgate: cotas × cota de cotização.
