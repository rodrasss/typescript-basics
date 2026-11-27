# Caso caso-079 — Mandacaru Estratégia FIF Multimercado

> **Data-base (D):** 12/11/2026 (quinta-feira) · **D−1:** 11/11/2026 · **Fundo:** FND-0079

## 1. O fundo

O Mandacaru Estratégia FIF Multimercado é gerido pela Coivara Partners, gestora multiestratégia criada por ex-sócios de banco de investimento, em São Paulo/SP. Criado em 08/12/2021, toma posições direcionais em juros, câmbio e bolsa, e a equipe trata o caixa como ferramenta de trabalho. Público-alvo: público geral. Hoje seus cotistas são sócios da própria gestora e clientes private. Ao longo da vida, o fundo trocou de gestor responsável em 2023 depois da saída do fundador e adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão. O gestor responsável é Caio, e quem cuida da validação do fundo é Rafael. Sobre a rotina: a gestora publica uma carta mensal aos cotistas até o 5º dia útil; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. A mesa da gestora mexe nas posições de futuros várias vezes ao dia. Em dias de feed de preços instável, já houve ações com o fechamento do dia anterior. No fechamento de ontem (11/11/2026) o fundo tinha PL de R$ 159.426.347,39, cota de 2,76785856 e 57.599.166,77845123 cotas. Hoje, quinta-feira, 12/11/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Macro |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Coivara Partners (São Paulo/SP) |
| PL em D−1 | R$ 159.426.347,39 |
| Cota em D−1 | 2,76785856 |
| Quantidade de cotas em D−1 | 57.599.166,77845123 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/11/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,090% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,420% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 34.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 400,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 3.300,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 166.948.083,04. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Longo prazo; come-cotas semestral (maio/novembro) a 15%

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Futuros (DI1, DOL, IND): ajuste diário divulgado pela B3, reconhecido em D e liquidado em D+1.
- Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 2,58141170 (cota da última cobrança efetiva, em 30/06/2026).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.248,337972 |  |
| LFT 01/09/2031 | ANBIMA — PU pela taxa indicativa de D | 18.247,709846 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.329,312939 |  |
| WQLA3 | B3 — preço de fechamento de D | 53,04 |  |
| WJMA4 | B3 — preço de fechamento de D | 41,60 |  |
| VJNR3 | B3 — preço de fechamento de D | 17,28 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| DI1F28 | 1.898 | -55,55 |
| DOLZ26 | 74 | 1.353,93 |
| INDZ26 | -120 | -331,83 |

**Benchmark**

- Fator acumulado do 100% do CDI de 30/06/2026 até 12/11/2026: 1,05060492

## 4. Comunicações recebidas hoje

- **17:01** — *Gestora — mesa* — **Boleta DOLZ26**: Aumentamos a posição em DOLZ26 hoje: de 53 para 74 contratos (operação executada às 13:09).

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 2,74410938 | 2,74450428 | 0,00039490 |
| Quantidade final de cotas | 57.701.841,77823567 | 57.701.827,00458138 | -14,77365429 |
| PL final | R$ 158.340.165,27 | R$ 158.362.911,18 | R$ 22.745,91 |
| Caixa | R$ 878.502,27 | R$ 878.502,27 | R$ 0,00 |
| Total de provisões | R$ 553.999,45 | R$ 559.685,95 | R$ 5.686,50 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 3.976 | 3.976 | 18.248,337972 | 18.248,337972 | 72.555.391,78 | 72.555.391,78 | 0,00 | ANBIMA — taxa indicativa D |
| LFT 01/09/2031 — Letra Financeira do Tesouro — venc. 01/09/2031 | 1.767 | 1.767 | 18.247,709846 | 18.247,709846 | 32.243.703,30 | 32.243.703,30 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 2.235 | 2.235 | 4.329,312939 | 4.329,312939 | 9.676.014,42 | 9.676.014,42 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 29.859 | 29.859 | 810,003888 | 810,003888 | 24.185.906,09 | 24.185.906,09 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| WQLA3 — Waqlá Alimentos S.A. ON | 121.597 | 121.597 | 53,04 | 53,04 | 6.449.504,88 | 6.449.504,88 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 155.036 | 155.036 | 41,60 | 41,60 | 6.449.497,60 | 6.449.497,60 | 0,00 | B3 — preço de fechamento D |
| VJNR3 — Vajanra Energia S.A. ON | 373.235 | 373.235 | 17,28 | 17,28 | 6.449.500,80 | 6.449.500,80 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 158.009.518,87 | 158.009.518,87 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.002.851,49 | 1.002.851,49 |
| TED recebida — aplicação [APL-1] Cotista 4620 (12:53) | 281.751,43 | 281.751,43 |
| Liquidação B3 — ajuste de futuros de 11/11/2026 | -406.100,65 | -406.100,65 |
| **Saldo final** | 878.502,27 | 878.502,27 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 6.143,99 | 34.576,52 |

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 281.751,43 | 281.751,43 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 4.073,39 | 4.073,39 | 569,12 | 569,12 | 0,00 | 0,00 | 4.642,51 | 4.642,51 | 0,00 |
| TXGES — Taxa de gestão a pagar | 64.297,68 | 64.297,68 | 8.920,61 | 8.920,61 | 0,00 | 0,00 | 73.218,29 | 73.218,29 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 1.314,82 | 1.314,82 | 189,76 | 189,76 | 0,00 | 0,00 | 1.504,58 | 1.504,58 | 0,00 |
| AUDIT — Auditoria independente a pagar | 7.555,56 | 7.555,56 | 134,92 | 134,92 | 0,00 | 0,00 | 7.690,48 | 7.690,48 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 147,37 | 147,37 | 21,05 | 21,05 | 0,00 | 0,00 | 168,42 | 168,42 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.215,79 | 1.215,79 | 173,68 | 173,68 | 0,00 | 0,00 | 1.389,47 | 1.389,47 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 3.522,58 | 3.522,58 | 125,81 | 125,81 | 0,00 | 0,00 | 3.648,39 | 3.648,39 | 0,00 |
| PERF — Taxa de performance a pagar | 824.224,65 | 824.224,65 | -362.487,34 | -356.800,84 | 0,00 | 0,00 | 461.737,31 | 467.423,81 | 5.686,50 |
| **Total** |  |  |  |  |  |  | 553.999,45 | 559.685,95 | 5.686,50 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,09% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 569,12 · Beta: [base: PL do dia útil anterior] 0,09% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 569,12
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,42% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 8.920,61 · Beta: [base: PL do dia útil anterior] 1,42% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 8.920,61
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 189,76 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 159.426.347,39 fator exponencial (1+taxa)^(1/252) − 1 = R$ 189,76
- **AUDIT** — Alfa: R$ 34.000,00 (anual) ÷ 252 d.u. = R$ 134,92 · Beta: R$ 34.000,00 (anual) ÷ 252 d.u. = R$ 134,92
- **ANBIMA** — Alfa: R$ 400,00 (mensal) ÷ 19 d.u. = R$ 21,05 · Beta: R$ 400,00 (mensal) ÷ 19 d.u. = R$ 21,05
- **SELIC** — Alfa: R$ 3.300,00 (mensal) ÷ 19 d.u. = R$ 173,68 · Beta: R$ 3.300,00 (mensal) ÷ 19 d.u. = R$ 173,68
- **CVM** — Alfa: R$ 7.800,00 (trimestral) ÷ 62 d.u. = R$ 125,81 · Beta: R$ 7.800,00 (trimestral) ÷ 62 d.u. = R$ 125,81
- **PERF** — Alfa: 20% × max(0; cota bruta 2,75212578 − cota de referência 2,58141170 × fator 100% do CDI 1,05060492 = 2,71204383) × 57.599.166,77845123 cotas = R$ 461.737,31 · Beta: 20% × max(0; cota bruta 2,75261940 − cota de referência 2,58141170 × fator 100% do CDI 1,05060492 = 2,71204383) × 57.599.166,77845123 cotas = R$ 467.423,81

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 4620 | R$ 281.751,43 | 12:53 | 12/11/2026 | 12/11/2026 | 12/11/2026 | sim | sim |  |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 158.009.518,87 | 158.009.518,87 | 0,00 |
| Caixa | 878.502,27 | 878.502,27 | 0,00 |
| Valores a receber | 6.143,99 | 34.576,52 | 28.432,53 |
| Valores a pagar | 281.751,43 | 281.751,43 | 0,00 |
| Provisões | 553.999,45 | 559.685,95 | 5.686,50 |
| PL antes das apropriações do dia (saldos anteriores das provisões) | 158.530.286,51 | 158.558.719,04 | 28.432,53 |
| PL base da cota | 158.058.414,25 | 158.081.160,28 | 22.746,03 |
| Cota (8 casas) | 2,74410938 | 2,74450428 | 0,00039490 |
| Aplicações convertidas | 281.751,43 | 281.751,43 | 0,00 |
| Cotas emitidas | 102.674,99978444 | 102.660,22613016 | -14,77365428 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 57.701.841,77823567 | 57.701.827,00458138 | -14,77365429 |
| PL final | 158.340.165,27 | 158.362.911,18 | 22.745,91 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Ajuste de DOLZ26 calculado com a posição antiga.

**Dificuldade:** media · **Cenários:** ajuste_futuros_errado

### Achado 1: Ajuste de DOLZ26 calculado com a posição antiga

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa não processou a boleta do dia em DOLZ26 e calculou o ajuste com 53 contratos, em vez de 74.
- **Onde olhar:** Valores a receber/pagar — ajuste de futuros; Informações de mercado — posição e ajuste por contrato; Comunicações — boleta da gestora
- **Raciocínio do analista:**
  1. Ajuste de futuros de D: R$ 34.576,52 (Beta) contra R$ 6.143,99 (Alfa). A diferença (R$ 28.432,53) dividida pelo ajuste por contrato de DOLZ26 (1.353,93) dá exatamente 21 contratos.
  2. A gestora informou o aumento de 53 para 74 contratos em DOLZ26, operação executada hoje. O Alfa ficou com a posição antiga.
- **Ação:** Alfa deve incluir a operação de DOLZ26, recalcular o ajuste (R$ 34.576,52) e reprocessar.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Beta |
| caixa | ambos |
| provisoes | Beta |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 2,74450428 |
| Quantidade final de cotas | 57.701.827,00458138 |
| PL final | R$ 158.362.911,18 |
| Caixa | R$ 878.502,27 |
| Total de provisões | R$ 559.685,95 |
