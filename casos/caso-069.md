# Caso caso-069 — Caatinga FIE FIF Previdenciário Multimercado

> **Data-base (D):** 23/06/2026 (terça-feira) · **D−1:** 22/06/2026 · **Fundo:** FND-0069

## 1. O fundo

Sob a gestão da Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte (Curitiba/PR), o Caatinga FIE FIF Previdenciário Multimercado é um dos fundos que mais exigem atenção na rotina de validação. Criado em 03/01/2017, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos VGBL de uma seguradora regional (cotista único). Ao longo da vida, o fundo teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025 e mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge. O gestor responsável é Helena, e quem cuida da validação do fundo é Gustavo. Sobre a rotina: o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota; a equipe da gestora trabalha com planilhas próprias e às vezes manda informação por e-mail antes da confirmação formal. A taxa de gestão é escalonada por faixa de patrimônio. Os papéis de crédito do fundo pagam juros em datas diferentes ao longo do ano. Em dias de feed de preços instável, já houve ações com o fechamento do dia anterior. No fechamento de ontem (22/06/2026) o fundo tinha PL de R$ 1.529.722.703,76, cota de 4,58578724 e 333.579.083,30614610 cotas. Hoje, terça-feira, 23/06/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 1.529.722.703,76 |
| Cota em D−1 | 4,58578724 |
| Quantidade de cotas em D−1 | 333.579.083,30614610 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/05/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,100% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,700% a.a. sobre a parcela do PL até R$ 700.000.000,00; 0,440% a.a. sobre o excedente, calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 59.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 600,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 1.800,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 1.503.393.178,13. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.354,196863 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.429,246007 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.221,576713 |  |
| TFSU13 | ANBIMA — PU pela taxa indicativa de D | 973,992877 |  |
| XVRM3 | B3 — preço de fechamento de D | 53,92 |  |
| UQPA4 | B3 — preço de fechamento de D | 29,80 |  |
| JZEL3 | B3 — preço de fechamento de D | 69,30 |  |

**Eventos de ativos**

- TFSU13: pagamento de juros em 23/06/2026 de R$ 44,570000 por título. O PU de referência de D já é "ex-juros".

## 4. Comunicações recebidas hoje

- **11:43** — *Área de risco* — **Relatório mensal**: O relatório mensal de risco do fundo já está disponível na pasta compartilhada.
- **14:57** — *Custodiante — eventos* — **Agenda da semana**: Agenda de eventos corporativos da semana (nenhum dos papéis desta carteira está na lista de hoje).

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 4,60413839 | 4,57783188 | -0,02630651 |
| Quantidade final de cotas | 331.757.146,68225676 | 331.757.146,68225676 | 0,00000000 |
| PL final | R$ 1.527.455.815,20 | R$ 1.518.728.442,50 | R$ -8.727.372,70 |
| Caixa | R$ 19.891.517,78 | R$ 11.124.777,06 | R$ -8.766.740,72 |
| Total de provisões | R$ 726.373,25 | R$ 734.933,88 | R$ 8.560,63 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 30.444 | 30.444 | 18.354,196863 | 18.354,196863 | 558.775.169,30 | 558.775.169,30 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 54.067 | 54.067 | 4.429,246007 | 4.429,246007 | 239.476.043,86 | 239.476.043,86 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 37.818 | 37.818 | 4.221,576713 | 4.221,576713 | 159.651.588,13 | 159.651.588,13 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 160.596 | 160.596 | 795,290360 | 795,290360 | 127.720.450,65 | 127.720.450,65 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| TFSU13 — Debênture Telecom Fibra Sul S.A. — CDI + 1,60% | 196.696 | 196.696 | 973,992877 | 973,992877 | 191.580.502,93 | 191.580.502,93 | 0,00 | ANBIMA — taxa indicativa D |
| XVRM3 — Xavantina Mineração S.A. ON | 1.480.436 | 1.480.436 | 53,92 | 53,92 | 79.825.109,12 | 79.825.109,12 | 0,00 | B3 — preço de fechamento D |
| UQPA4 — Uquapé Petroquímica S.A. PN | 2.678.695 | 2.678.695 | 29,80 | 29,80 | 79.825.111,00 | 79.825.111,00 | 0,00 | B3 — preço de fechamento D |
| JZEL3 — Jazê Elétrica S.A. ON | 1.151.878 | 1.151.878 | 69,30 | 69,30 | 79.825.145,40 | 79.825.145,40 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 1.516.679.120,39 | 1.516.679.120,39 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 15.292.136,30 | 15.292.136,30 |
| Pagamento de resgate [LIQ-1] — Cotista único (cotizado em 22/06/2026) | -4.167.359,24 | -4.167.359,24 |
| Pagamento de juros — TFSU13 | 8.766.740,72 | — |
| **Saldo final** | 19.891.517,78 | 11.124.777,06 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

Nenhum item.

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 92.141,73 | 92.141,73 | 6.070,33 | 6.070,33 | 0,00 | 0,00 | 98.212,06 | 98.212,06 | 0,00 |
| TXGES — Taxa de gestão a pagar | 505.433,45 | 505.433,45 | 33.931,67 | 42.492,30 | 0,00 | 0,00 | 539.365,12 | 547.925,75 | 8.560,63 |
| TXCUS — Taxa máxima de custódia a pagar | 27.910,85 | 27.910,85 | 1.821,10 | 1.821,10 | 0,00 | 0,00 | 29.731,95 | 29.731,95 | 0,00 |
| AUDIT — Auditoria independente a pagar | 43.781,75 | 43.781,75 | 234,13 | 234,13 | 0,00 | 0,00 | 44.015,88 | 44.015,88 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 428,57 | 428,57 | 28,57 | 28,57 | 0,00 | 0,00 | 457,14 | 457,14 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.285,71 | 1.285,71 | 85,71 | 85,71 | 0,00 | 0,00 | 1.371,42 | 1.371,42 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 12.983,61 | 12.983,61 | 236,07 | 236,07 | 0,00 | 0,00 | 13.219,68 | 13.219,68 | 0,00 |
| **Total** |  |  |  |  |  |  | 726.373,25 | 734.933,88 | 8.560,63 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,10% a.a. sobre R$ 1.529.722.703,76 ÷ 252 (linear, dias úteis) = R$ 6.070,33 · Beta: [base: PL do dia útil anterior] 0,10% a.a. sobre R$ 1.529.722.703,76 ÷ 252 (linear, dias úteis) = R$ 6.070,33
- **TXGES** — Alfa: [base: PL do dia útil anterior] escalonada (0,70% sobre R$ 700.000.000,00 + 0,44% sobre R$ 829.722.703,76) ÷ 252 (linear, dias úteis) = R$ 33.931,67 · Beta: [base: PL do dia útil anterior] 0,70% a.a. sobre R$ 1.529.722.703,76 ÷ 252 (linear, dias úteis) = R$ 42.492,30
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 1.529.722.703,76 ÷ 252 (linear, dias úteis) = R$ 1.821,10 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 1.529.722.703,76 ÷ 252 (linear, dias úteis) = R$ 1.821,10
- **AUDIT** — Alfa: R$ 59.000,00 (anual) ÷ 252 d.u. = R$ 234,13 · Beta: R$ 59.000,00 (anual) ÷ 252 d.u. = R$ 234,13
- **ANBIMA** — Alfa: R$ 600,00 (mensal) ÷ 21 d.u. = R$ 28,57 · Beta: R$ 600,00 (mensal) ÷ 21 d.u. = R$ 28,57
- **SELIC** — Alfa: R$ 1.800,00 (mensal) ÷ 21 d.u. = R$ 85,71 · Beta: R$ 1.800,00 (mensal) ÷ 21 d.u. = R$ 85,71
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07 · Beta: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| RSG-1 | resgate | Cotista único | 523.692,77685931 cotas |  | 22/06/2026 | 23/06/2026 | 24/06/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista único | 1.298.243,84703002 cotas |  | 22/06/2026 | 23/06/2026 | 24/06/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista único | 908.755,47111699 cotas (R$ 4.167.359,24) |  | 19/06/2026 | 22/06/2026 | 23/06/2026 | não | não | cotizado em 22/06/2026 pela cota de 4,58578724; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 1.516.679.120,39 | 1.516.679.120,39 | 0,00 |
| Caixa | 19.891.517,78 | 11.124.777,06 | -8.766.740,72 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 0,00 | 0,00 | 0,00 |
| Provisões | 726.373,25 | 734.933,88 | 8.560,63 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 1.535.886.672,50 | 1.527.119.931,78 | -8.766.740,72 |
| PL base da cota | 1.535.844.264,92 | 1.527.068.963,57 | -8.775.301,35 |
| Cota (8 casas) | 4,60413839 | 4,57783188 | -0,02630651 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 1.821.936,62388933 | 1.821.936,62388933 | 0,00000000 |
| Valor dos resgates cotizados | 8.388.448,36 | 8.340.519,56 | -47.928,80 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 331.757.146,68225676 | 331.757.146,68225676 | 0,00000000 |
| PL final | 1.527.455.815,20 | 1.518.728.442,50 | -8.727.372,70 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Taxa de gestão escalonada aplicada como taxa cheia; Juros de TFSU13 não registrados.

**Dificuldade:** media · **Cenários:** taxa_escalonada_ignorada, juros_credito_nao_registrados

### Régua v1 (provisória) — medidas deste caso

| Dimensão | Medida | Limite | Veredito |
|---|---|---|---|
| Cota | 1.911.420,12 cotas equivalentes (quantidade 0,00; PL 1.911.420,12) | 250 cotas | ACIMA |
| Caixa | R$ 8.766.740,72 | sem tolerância | ACIMA |
| Provisões | maior diferença R$ 8.560,63; total R$ 8.560,63 | R$ 100,00 por provisão e no total | ACIMA |

### Achado 1: Taxa de gestão escalonada aplicada como taxa cheia

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta aplicou 0,700% sobre todo o PL, ignorando a taxa menor (0,440%) sobre a parcela acima de R$ 700.000.000,00.
- **Onde olhar:** Provisões — TXGES; Regulamento — taxa de gestão escalonada
- **Raciocínio do analista:**
  1. A apropriação de taxa de gestão do Beta é maior.
  2. O regulamento escalona a taxa: Taxa de gestão: 0,700% a.a. sobre a parcela do PL até R$ 700.000.000,00; 0,440% a.a. sobre o excedente, calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente. Com PL de D−1 de R$ 1.529.722.703,76, parte do PL está na segunda faixa.
  3. O Alfa fez a conta por faixas; o Beta aplicou a taxa cheia em tudo.
  4. Régua v1 (provisória) — provisões: maior diferença numa provisão de R$ 8.560,63 e diferença total de R$ 8.560,63, contra o limite de R$ 100,00 por provisão e no total: ACIMA.
- **Ação:** Beta deve parametrizar as faixas da taxa de gestão e reprocessar. Acima da régua: reprovar até o lado errado reprocessar.

### Achado 2: Juros de TFSU13 não registrados

- **Gravidade:** erro · **Dimensões:** caixa, cota
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta usou o PU "ex-juros" de TFSU13 mas não registrou a entrada dos juros (R$ 44,570000 × quantidade = R$ 8.766.740,72).
- **Onde olhar:** Caixa — lançamentos; Carteira — TFSU13; Informações de mercado — agenda de eventos
- **Raciocínio do analista:**
  1. Ativos iguais (inclusive o PU de TFSU13), mas o caixa do Beta tem R$ 8.766.740,72 a menos, e isso vai direto para o PL.
  2. Hoje é dia de pagamento de juros de TFSU13. O PU de D já caiu pelo evento; quem não registrou a entrada perde os juros duas vezes: no preço e no caixa.
  3. Régua v1 (provisória) — cota: diferença de 1.911.420,12 cotas equivalentes (a maior entre 0,00 cotas de quantidade e 1.911.420,12 cotas de PL), contra o limite de 250: ACIMA; caixa: diferença de R$ 8.766.740,72; o caixa não tem tolerância e precisa bater antes de acatar: ACIMA.
- **Ação:** Beta deve registrar o recebimento dos juros e reprocessar a cota. Acima da régua: reprovar até o lado errado reprocessar.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | Alfa |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 4,60413839 |
| Quantidade final de cotas | 331.757.146,68225676 |
| PL final | R$ 1.527.455.815,20 |
| Caixa | R$ 19.891.517,78 |
| Total de provisões | R$ 726.373,25 |
