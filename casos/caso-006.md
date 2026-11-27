# Caso caso-006 — Embaúba Total FIE FIF Previdenciário Multimercado

> **Data-base (D):** 11/09/2026 (sexta-feira) · **D−1:** 10/09/2026 · **Fundo:** FND-0006

## 1. O fundo

Quem acompanha a Remanso Asset (Curitiba/PR) conhece o Embaúba Total FIE FIF Previdenciário Multimercado: a casa é uma gestora de previdência ligada a uma seguradora de médio porte. Criado em 18/10/2015, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge. O gestor responsável é Isadora, e quem cuida da validação do fundo é Marina. Sobre a rotina: o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota; a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras. O método de apropriação das taxas já foi questionado em auditoria. No fechamento de ontem (10/09/2026) o fundo tinha PL de R$ 1.037.801.126,67, cota de 2,60462670 e 398.445.246,17265070 cotas. Hoje, sexta-feira, 11/09/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 1.037.801.126,67 |
| Cota em D−1 | 2,60462670 |
| Quantidade de cotas em D−1 | 398.445.246,17265070 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/01/2026 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,080% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,870% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 70.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 900,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 5.400,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 1.000.920.115,91. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+1 dia útil após o pedido, pela cota de fechamento da data de cotização; liquidação financeira em D+1 dia útil após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
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
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.432,025077 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.468,201731 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.252,324099 |  |
| VCLA12 | ANBIMA — PU pela taxa indicativa de D | 963,262638 |  |
| WJMA4 | B3 — preço de fechamento de D | 36,52 |  |
| XVRM3 | B3 — preço de fechamento de D | 40,83 |  |
| ZFRT3 | B3 — preço de fechamento de D | 25,80 |  |

**Eventos de ativos**

- WJMA4: dividendos de R$ 0,27 por ação; data-com 10/09/2026; negociação "ex" a partir de 11/09/2026; pagamento em 01/10/2026.

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 2,61131015 | 2,61032397 | -0,00098618 |
| Quantidade final de cotas | 401.587.446,45886856 | 401.588.950,66541976 | 1.504,20655119 |
| PL final | R$ 1.048.669.375,05 | R$ 1.048.277.264,01 | R$ -392.111,04 |
| Caixa | R$ 12.500.793,32 | R$ 12.500.793,32 | R$ 0,00 |
| Total de provisões | R$ 370.381,28 | R$ 359.289,06 | R$ -11.092,22 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 20.754 | 20.754 | 18.432,025077 | 18.432,025077 | 382.538.248,45 | 382.538.248,45 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 36.692 | 36.692 | 4.468,201731 | 4.468,201731 | 163.947.257,91 | 163.947.257,91 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 25.703 | 25.703 | 4.252,324099 | 4.252,324099 | 109.297.486,32 | 109.297.486,32 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 109.722 | 109.722 | 796,909459 | 796,909459 | 87.438.499,66 | 87.438.499,66 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| VCLA12 — Debênture Varejo Casa & Lar S.A. — CDI + 2,75% | 136.160 | 136.160 | 963,262638 | 963,262638 | 131.157.840,79 | 131.157.840,79 | 0,00 | ANBIMA — taxa indicativa D |
| WJMA4 — Banco Wajumá S.A. PN | 1.496.415 | 1.496.415 | 36,52 | 36,52 | 54.649.075,80 | 54.649.075,80 | 0,00 | B3 — preço de fechamento D |
| XVRM3 — Xavantina Mineração S.A. ON | 1.338.454 | 1.338.454 | 40,83 | 40,83 | 54.649.076,82 | 54.649.076,82 | 0,00 | B3 — preço de fechamento D |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 2.118.182 | 2.118.182 | 25,80 | 25,80 | 54.649.095,60 | 54.649.095,60 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 1.038.326.581,35 | 1.038.326.581,35 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 6.166.134,94 | 6.166.134,94 |
| TED recebida — aplicação [APL-1] Cotista único (12:11) | 4.396.235,34 | 4.396.235,34 |
| TED recebida — aplicação [APL-2] Cotista único (09:02) | 1.818.277,98 | 1.818.277,98 |
| TED recebida — aplicação [APL-3] Cotista único (10:03) | 4.182.393,54 | 4.182.393,54 |
| Pagamento de resgate [LIQ-1] — Cotista único (cotizado em 10/09/2026) | -2.271.537,08 | -2.271.537,08 |
| Pagamento de resgate [LIQ-2] — Cotista único (cotizado em 10/09/2026) | -1.790.711,40 | -1.790.711,40 |
| **Saldo final** | 12.500.793,32 | 12.500.793,32 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| DIVIDENDOS A RECEBER WJMA4 — Dividendos a receber — WJMA4 (R$ 0,27/ação) | 404.032,05 | — |

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 10.396.906,86 | 10.396.906,86 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 22.522,00 | 22.522,00 | 3.294,61 | 3.294,61 | 0,00 | 0,00 | 25.816,61 | 25.816,61 | 0,00 |
| TXGES — Taxa de gestão a pagar | 252.548,69 | 252.548,69 | 35.828,85 | 24.736,63 | 0,00 | 0,00 | 288.377,54 | 277.285,32 | -11.092,22 |
| TXCUS — Taxa máxima de custódia a pagar | 5.610,14 | 5.610,14 | 823,65 | 823,65 | 0,00 | 0,00 | 6.433,79 | 6.433,79 | 0,00 |
| AUDIT — Auditoria independente a pagar | 35.555,56 | 35.555,56 | 277,78 | 277,78 | 0,00 | 0,00 | 35.833,34 | 35.833,34 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 300,00 | 300,00 | 42,86 | 42,86 | 0,00 | 0,00 | 342,86 | 342,86 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.800,00 | 1.800,00 | 257,14 | 257,14 | 0,00 | 0,00 | 2.057,14 | 2.057,14 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 11.298,46 | 11.298,46 | 221,54 | 221,54 | 0,00 | 0,00 | 11.520,00 | 11.520,00 | 0,00 |
| **Total** |  |  |  |  |  |  | 370.381,28 | 359.289,06 | -11.092,22 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,08% a.a. sobre R$ 1.037.801.126,67 ÷ 252 (linear, dias úteis) = R$ 3.294,61 · Beta: [base: PL do dia útil anterior] 0,08% a.a. sobre R$ 1.037.801.126,67 ÷ 252 (linear, dias úteis) = R$ 3.294,61
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,87% a.a. sobre R$ 1.037.801.126,67 ÷ 252 (linear, dias úteis) = R$ 35.828,85 · Beta: [base: PL do dia útil anterior] 0,87% a.a. sobre R$ 1.037.801.126,67 ÷ 365 × 1 dia(s) corrido(s) = R$ 24.736,63
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 1.037.801.126,67 ÷ 252 (linear, dias úteis) = R$ 823,65 · Beta: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 1.037.801.126,67 ÷ 252 (linear, dias úteis) = R$ 823,65
- **AUDIT** — Alfa: R$ 70.000,00 (anual) ÷ 252 d.u. = R$ 277,78 · Beta: R$ 70.000,00 (anual) ÷ 252 d.u. = R$ 277,78
- **ANBIMA** — Alfa: R$ 900,00 (mensal) ÷ 21 d.u. = R$ 42,86 · Beta: R$ 900,00 (mensal) ÷ 21 d.u. = R$ 42,86
- **SELIC** — Alfa: R$ 5.400,00 (mensal) ÷ 21 d.u. = R$ 257,14 · Beta: R$ 5.400,00 (mensal) ÷ 21 d.u. = R$ 257,14
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 65 d.u. = R$ 221,54 · Beta: R$ 14.400,00 (trimestral) ÷ 65 d.u. = R$ 221,54

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista único | R$ 4.396.235,34 | 12:11 | 11/09/2026 | 11/09/2026 | 11/09/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista único | R$ 1.818.277,98 | 09:02 | 11/09/2026 | 11/09/2026 | 11/09/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista único | R$ 4.182.393,54 | 10:03 | 11/09/2026 | 11/09/2026 | 11/09/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista único | 595.486,81610415 cotas |  | 10/09/2026 | 11/09/2026 | 14/09/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista único | 243.803,51456241 cotas |  | 10/09/2026 | 11/09/2026 | 14/09/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista único | 872.116,17775255 cotas (R$ 2.271.537,08) |  | 09/09/2026 | 10/09/2026 | 11/09/2026 | não | não | cotizado em 10/09/2026 pela cota de 2,60462670; liquidação financeira hoje |
| LIQ-2 | resgate | Cotista único | 687.511,72564374 cotas (R$ 1.790.711,40) |  | 09/09/2026 | 10/09/2026 | 11/09/2026 | não | não | cotizado em 10/09/2026 pela cota de 2,60462670; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 1.038.326.581,35 | 1.038.326.581,35 | 0,00 |
| Caixa | 12.500.793,32 | 12.500.793,32 | 0,00 |
| Valores a receber | 404.032,05 | 0,00 | -404.032,05 |
| Valores a pagar | 10.396.906,86 | 10.396.906,86 | 0,00 |
| Provisões | 370.381,28 | 359.289,06 | -11.092,22 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 1.040.504.865,01 | 1.040.100.832,96 | -404.032,05 |
| PL base da cota | 1.040.464.118,58 | 1.040.071.178,75 | -392.939,83 |
| Cota (8 casas) | 2,61131015 | 2,61032397 | -0,00098618 |
| Aplicações convertidas | 10.396.906,86 | 10.396.906,86 | 0,00 |
| Cotas emitidas | 3.981.490,61688439 | 3.982.994,82343563 | 1.504,20655124 |
| Cotas resgatadas | 839.290,33066656 | 839.290,33066656 | 0,00000000 |
| Valor dos resgates cotizados | 2.191.647,36 | 2.190.819,67 | -827,69 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 401.587.446,45886856 | 401.588.950,66541976 | 1.504,20655119 |
| PL final | 1.048.669.375,05 | 1.048.277.264,01 | -392.111,04 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Dividendos de WJMA4 não provisionados; taxa de gestão na base 365 corridos.

**Dificuldade:** media · **Cenários:** dividendo_ex_nao_provisionado, taxa_por_dias_corridos

### Régua v1 (provisória) — medidas deste caso

| Dimensão | Medida | Limite | Veredito |
|---|---|---|---|
| Cota | 150.504,54 cotas equivalentes (quantidade 1.504,21; PL 150.504,54) | 250 cotas | ACIMA |
| Caixa | R$ 0,00 | sem tolerância | bate |
| Provisões | maior diferença R$ 11.092,22; total R$ 11.092,22 | R$ 100,00 por provisão e no total | ACIMA |

### Achado 1: Dividendos de WJMA4 não provisionados

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta precificou WJMA4 "ex" mas não registrou os dividendos a receber.
- **Onde olhar:** Valores a receber; Informações de mercado — eventos societários; Carteira — WJMA4
- **Raciocínio do analista:**
  1. Os ativos batem, mas o Alfa tem R$ 404.032,05 de dividendos a receber de WJMA4 que o Beta não tem.
  2. WJMA4 ficou "ex" em D: o preço de fechamento já não carrega o dividendo. Se o direito não entra como valor a receber, o fundo perde esse valor no PL.
  3. O regulamento manda reconhecer o evento na data "ex", então o lado correto é o que provisionou.
  4. Régua v1 (provisória) — cota: diferença de 150.504,54 cotas equivalentes (a maior entre 1.504,21 cotas de quantidade e 150.504,54 cotas de PL), contra o limite de 250: ACIMA.
- **Ação:** Beta deve registrar R$ 404.032,05 de dividendos a receber de WJMA4 e reprocessar a cota. Acima da régua: reprovar até o lado errado reprocessar.

### Achado 2: taxa de gestão na base 365 corridos

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta apropriou a taxa de gestão por 1/365 × 1 dia(s) corrido(s); o regulamento manda 1/252 por dia útil.
- **Onde olhar:** Provisões — TXGES; Regulamento — método de apropriação; Data-base (dia da semana)
- **Raciocínio do analista:**
  1. A apropriação de taxa de gestão do Beta é menor que a do Alfa.
  2. O valor do Beta é compatível com 1/365 do percentual anual por dia corrido.
  3. O regulamento é explícito: 1/252 por dia útil.
  4. Régua v1 (provisória) — provisões: maior diferença numa provisão de R$ 11.092,22 e diferença total de R$ 11.092,22, contra o limite de R$ 100,00 por provisão e no total: ACIMA.
- **Ação:** Beta deve corrigir o método de apropriação para a base 252 e reprocessar. Acima da régua: reprovar até o lado errado reprocessar.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 2,61131015 |
| Quantidade final de cotas | 401.587.446,45886856 |
| PL final | R$ 1.048.669.375,05 |
| Caixa | R$ 12.500.793,32 |
| Total de provisões | R$ 370.381,28 |
