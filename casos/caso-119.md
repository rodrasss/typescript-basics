# Caso caso-119 — Cumaru FIE FIF Previdenciário Multimercado

> **Data-base (D):** 02/01/2026 (sexta-feira) · **D−1:** 31/12/2025 · **Fundo:** FND-0119

## 1. O fundo

O Cumaru FIE FIF Previdenciário Multimercado é gerido pela Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte, em Curitiba/PR. Criado em 12/11/2023, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos VGBL de uma seguradora regional (cotista único). Ao longo da vida, o fundo adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Fernanda, e quem cuida da validação do fundo é Larissa. Sobre a rotina: o fundo tem aplicações e resgates quase todos os dias; a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras. No fechamento de ontem (31/12/2025) o fundo tinha PL de R$ 255.979.023,94, cota de 3,04500203 e 84.065.304,58181798 cotas. Hoje, sexta-feira, 02/01/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 255.979.023,94 |
| Cota em D−1 | 3,04500203 |
| Quantidade de cotas em D−1 | 84.065.304,58181798 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/05/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,090% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,330% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 30.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 300,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 2.300,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 231.113.190,38. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+1 dia útil após o pedido, pela cota de fechamento da data de cotização; liquidação financeira em D+1 dia útil após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
- Tributação: Previdência: tributação no plano (seguradora); sem come-cotas

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Debêntures: taxa indicativa ANBIMA de D.
- Ações: preço de fechamento da B3 em D.

**Regras específicas deste fundo**

- Performance: última cobrança efetiva em 31/12/2024 (cota de referência 2,80192189). Em 31/12/2025 não houve cobrança (fundo abaixo da cota de referência corrigida); a cota de fechamento nesse dia foi 3,02139766.

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.214,696770 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.437,450534 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.274,436700 |  |
| VCLA12 | ANBIMA — PU pela taxa indicativa de D | 1.159,078221 |  |
| YRBQ3 | B3 — preço de fechamento de D | 16,47 |  |
| KQSA3 | B3 — preço de fechamento de D | 47,67 |  |
| KXOB3 | B3 — preço de fechamento de D | 51,97 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2024 até 02/01/2026: 1,14209964
- Fator acumulado do 100% do CDI de 31/12/2025 até 02/01/2026: 1,00052531

## 4. Comunicações recebidas hoje

- **14:14** — *Custodiante — eventos* — **Agenda da semana**: Agenda de eventos corporativos da semana (nenhum dos papéis desta carteira está na lista de hoje).

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 3,04616681 | 3,05196230 | 0,00579549 |
| Quantidade final de cotas | 85.163.884,61000757 | 85.161.798,47363308 | -2.086,13637449 |
| PL final | R$ 259.423.398,71 | R$ 259.910.598,34 | R$ 487.199,63 |
| Caixa | R$ 4.186.593,43 | R$ 4.186.593,43 | R$ 0,00 |
| Total de provisões | R$ 847.893,86 | R$ 360.693,75 | R$ -487.200,11 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 5.180 | 5.180 | 18.214,696770 | 18.214,696770 | 94.352.129,27 | 94.352.129,27 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 9.112 | 9.112 | 4.437,450534 | 4.437,450534 | 40.434.049,27 | 40.434.049,27 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 6.306 | 6.306 | 4.274,436700 | 4.274,436700 | 26.954.597,83 | 26.954.597,83 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 27.255 | 27.255 | 791,205788 | 791,205788 | 21.564.313,75 | 21.564.313,75 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| VCLA12 — Debênture Varejo Casa & Lar S.A. — CDI + 2,75% | 27.907 | 27.907 | 1.159,078221 | 1.159,078221 | 32.346.395,91 | 32.346.395,91 | 0,00 | ANBIMA — taxa indicativa D |
| YRBQ3 — Yrubá Químicos S.A. ON | 818.320 | 818.320 | 16,47 | 16,47 | 13.477.730,40 | 13.477.730,40 | 0,00 | B3 — preço de fechamento D |
| KQSA3 — Kaquissá Saneamento S.A. ON | 282.730 | 282.730 | 47,67 | 47,67 | 13.477.739,10 | 13.477.739,10 | 0,00 | B3 — preço de fechamento D |
| KXOB3 — Kaxoeira Obras S.A. ON | 259.337 | 259.337 | 51,97 | 51,97 | 13.477.743,89 | 13.477.743,89 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 256.084.699,42 | 256.084.699,42 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.847.327,98 | 1.847.327,98 |
| TED recebida — aplicação [APL-1] Cotista único (12:53) | 1.083.679,62 | 1.083.679,62 |
| TED recebida — aplicação [APL-2] Cotista único (10:10) | 1.044.538,57 | 1.044.538,57 |
| TED recebida — aplicação [APL-3] Cotista único (11:42) | 1.218.239,83 | 1.218.239,83 |
| Pagamento de resgate [LIQ-1] — Cotista único (cotizado em 31/12/2025) | -299.259,41 | -299.259,41 |
| Pagamento de resgate [LIQ-2] — Cotista único (cotizado em 31/12/2025) | -707.933,16 | -707.933,16 |
| **Saldo final** | 4.186.593,43 | 4.186.593,43 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 3.346.458,02 | 3.346.458,02 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 20.170,87 | 20.170,87 | 914,21 | 914,21 | 0,00 | 0,00 | 21.085,08 | 21.085,08 | 0,00 |
| TXGES — Taxa de gestão a pagar | 300.362,01 | 300.362,01 | 13.510,00 | 13.510,00 | 0,00 | 0,00 | 313.872,01 | 313.872,01 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 6.846,90 | 6.846,90 | 304,74 | 304,74 | 0,00 | 0,00 | 7.151,64 | 7.151,64 | 0,00 |
| AUDIT — Auditoria independente a pagar | 18.214,29 | 18.214,29 | 119,05 | 119,05 | 0,00 | 0,00 | 18.333,34 | 18.333,34 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 0,00 | 0,00 | 14,29 | 14,29 | 0,00 | 0,00 | 14,29 | 14,29 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 0,00 | 0,00 | 109,52 | 109,52 | 0,00 | 0,00 | 109,52 | 109,52 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 0,00 | 0,00 | 127,87 | 127,87 | 0,00 | 0,00 | 127,87 | 127,87 | 0,00 |
| PERF — Taxa de performance a pagar | 0,00 | 0,00 | 487.200,11 | 0,00 | 0,00 | 0,00 | 487.200,11 | 0,00 | -487.200,11 |
| **Total** |  |  |  |  |  |  | 847.893,86 | 360.693,75 | -487.200,11 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista único | R$ 1.083.679,62 | 12:53 | 02/01/2026 | 02/01/2026 | 02/01/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista único | R$ 1.044.538,57 | 10:10 | 02/01/2026 | 02/01/2026 | 02/01/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista único | R$ 1.218.239,83 | 11:42 | 02/01/2026 | 02/01/2026 | 02/01/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista único | 98.278,88647906 cotas (R$ 299.259,41) |  | 30/12/2025 | 31/12/2025 | 02/01/2026 | não | não | cotizado em 31/12/2025 pela cota de 3,04500203; liquidação financeira hoje |
| LIQ-2 | resgate | Cotista único | 232.490,20798497 cotas (R$ 707.933,16) |  | 30/12/2025 | 31/12/2025 | 02/01/2026 | não | não | cotizado em 31/12/2025 pela cota de 3,04500203; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 256.084.699,42 | 256.084.699,42 | 0,00 |
| Caixa | 4.186.593,43 | 4.186.593,43 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 3.346.458,02 | 3.346.458,02 | 0,00 |
| Provisões | 847.893,86 | 360.693,75 | -487.200,11 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 256.579.240,76 | 256.579.240,76 | 0,00 |
| PL base da cota | 256.076.940,97 | 256.564.141,08 | 487.200,11 |
| Cota (8 casas) | 3,04616681 | 3,05196230 | 0,00579549 |
| Aplicações convertidas | 3.346.458,02 | 3.346.458,02 | 0,00 |
| Cotas emitidas | 1.098.580,02818958 | 1.096.493,89181509 | -2.086,13637449 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 85.163.884,61000757 | 85.161.798,47363308 | -2.086,13637449 |
| PL final | 259.423.398,71 | 259.910.598,34 | 487.199,63 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Performance provisionada sem respeitar a linha d’água.

**Dificuldade:** media · **Cenários:** performance_sem_linha_dagua

### Achado 1: Performance provisionada sem respeitar a linha d’água

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Na virada do semestre, o Alfa "zerou" a cota de referência para a cota de 31/12/2025, como se tivesse havido cobrança. Não houve: a referência continua sendo a cota da última cobrança efetiva, corrigida pelo benchmark.
- **Onde olhar:** Provisões — PERF; Regulamento — linha d’água e histórico de cobranças; Informações de mercado — fatores do benchmark
- **Raciocínio do analista:**
  1. O Alfa provisiona performance logo no primeiro dia do novo período; o Beta não provisiona nada.
  2. Pelo regulamento há linha d’água: a referência é a cota da última cobrança efetiva, corrigida pelo benchmark. Corrigida, ela está acima da cota bruta de hoje, então a performance é zero.
  3. O Alfa usou a cota de 31/12/2025 como referência. Isso só seria certo se tivesse havido cobrança nessa data, o que não aconteceu.
- **Ação:** Alfa deve restaurar a cota de referência da última cobrança efetiva, zerar a provisão e reprocessar. Rever a rotina de virada de período.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Beta |
| caixa | ambos |
| provisoes | Beta |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 3,05196230 |
| Quantidade final de cotas | 85.161.798,47363308 |
| PL final | R$ 259.910.598,34 |
| Caixa | R$ 4.186.593,43 |
| Total de provisões | R$ 360.693,75 |

### Armadilhas deste caso

- A linha d’água segue a última cobrança efetiva, não o fim do período.
