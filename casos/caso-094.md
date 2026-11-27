# Caso caso-094 — Pau-Brasil Família FIF Multimercado

> **Data-base (D):** 26/03/2026 (quinta-feira) · **D−1:** 25/03/2026 · **Fundo:** FND-0094

## 1. O fundo

Sob a gestão da Serra do Mar Asset, gestora cambial e de juros com operação muito sistematizada (Santos/SP), o Pau-Brasil Família FIF Multimercado é um dos fundos que mais exigem atenção na rotina de validação. Criado em 12/03/2013, toma posições direcionais em juros, câmbio e bolsa, e a equipe trata o caixa como ferramenta de trabalho. Público-alvo: público geral. Hoje seus cotistas são sócios da própria gestora e clientes private. Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão. O gestor responsável é Rodrigo, e quem cuida da validação do fundo é Pedro. Sobre a rotina: o fundo está fechado para novas aplicações de varejo e só aceita aportes de cotistas existentes; a equipe da gestora trabalha com planilhas próprias e às vezes manda informação por e-mail antes da confirmação formal. A conta do fundo já teve cobrança de tarifa que não era do fundo. O gestor tem fama de mandar informação por e-mail antes da confirmação formal. No fechamento de ontem (25/03/2026) o fundo tinha PL de R$ 487.726.584,05, cota de 4,66668508 e 104.512.426,83993126 cotas. Hoje, quinta-feira, 26/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Macro |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Serra do Mar Asset (Santos/SP) |
| PL em D−1 | R$ 487.726.584,05 |
| Cota em D−1 | 4,66668508 |
| Quantidade de cotas em D−1 | 104.512.426,83993126 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/03/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,120% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,780% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 49.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 1.200,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 2.500,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 475.055.535,32. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+30 dias corridos após o pedido (se não for dia útil, no primeiro dia útil seguinte), pela cota de fechamento da data de cotização; liquidação financeira em D+1 dia útil após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
- Tributação: Come-cotas semestral, no penúltimo dia útil de maio e de novembro (15% se o prazo médio da carteira superar 365 dias; 20% caso contrário)

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Futuros (DI1, DOL, IND): ajuste diário divulgado pela B3, reconhecido em D e liquidado em D+1.
- Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 4,51885385 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.455,496846 |  |
| LFT 01/09/2031 | ANBIMA — PU pela taxa indicativa de D | 18.159,870243 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.392,517164 |  |
| ZFRT3 | B3 — preço de fechamento de D | 75,06 |  |
| QPLN3 | B3 — preço de fechamento de D | 30,11 |  |
| YKAP4 | B3 — preço de fechamento de D | 84,92 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| DI1F28 | -1.543 | -46,89 |
| DOLJ26 | 77 | 1.087,95 |
| INDJ26 | -24 | -338,87 |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 26/03/2026: 1,03092859

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 4,68101962 | 4,68101962 | 0,00000000 |
| Quantidade final de cotas | 104.247.259,18550752 | 104.247.259,18550752 | 0,00000000 |
| PL final | R$ 487.983.465,58 | R$ 487.983.465,58 | R$ 0,00 |
| Caixa | R$ 2.954.315,01 | R$ 1.714.906,69 | R$ -1.239.408,32 |
| Total de provisões | R$ 1.342.036,53 | R$ 1.342.036,53 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 12.128 | 12.128 | 18.455,496846 | 18.455,496846 | 223.828.265,75 | 223.828.265,75 | 0,00 | ANBIMA — taxa indicativa D |
| LFT 01/09/2031 — Letra Financeira do Tesouro — venc. 01/09/2031 | 5.478 | 5.478 | 18.159,870243 | 18.159,870243 | 99.479.769,19 | 99.479.769,19 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 6.794 | 6.794 | 4.392,517164 | 4.392,517164 | 29.842.761,61 | 29.842.761,61 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 91.270 | 91.270 | 817,461968 | 817,461968 | 74.609.753,82 | 74.609.753,82 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 265.066 | 265.066 | 75,06 | 75,06 | 19.895.853,96 | 19.895.853,96 | 0,00 | B3 — preço de fechamento D |
| QPLN3 — Quiplan Saúde S.A. ON | 660.773 | 660.773 | 30,11 | 30,11 | 19.895.875,03 | 19.895.875,03 | 0,00 | B3 — preço de fechamento D |
| YKAP4 — Ykapé Papel e Celulose S.A. PN | 234.290 | 234.290 | 84,92 | 84,92 | 19.895.906,80 | 19.895.906,80 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 487.448.186,16 | 487.448.186,16 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 2.695.501,15 | 2.695.501,15 |
| Pagamento de resgate [LIQ-1] — Cotista 0812 (cotizado em 25/03/2026) | -980.594,46 | -980.594,46 |
| Liquidação B3 — ajuste de futuros de 25/03/2026 | 1.239.408,32 | — |
| **Saldo final** | 2.954.315,01 | 1.714.906,69 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 164.256,30 | 164.256,30 |
| AJUSTE FUTUROS D-1 — Ajuste de futuros de 25/03/2026 a receber | — | 1.239.408,32 |

### 5.5 Valores a pagar

Nenhum item.

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 41.441,50 | 41.441,50 | 2.322,51 | 2.322,51 | 0,00 | 0,00 | 43.764,01 | 43.764,01 | 0,00 |
| TXGES — Taxa de gestão a pagar | 618.686,58 | 618.686,58 | 34.450,53 | 34.450,53 | 0,00 | 0,00 | 653.137,11 | 653.137,11 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 6.826,71 | 6.826,71 | 387,08 | 387,08 | 0,00 | 0,00 | 7.213,79 | 7.213,79 | 0,00 |
| AUDIT — Auditoria independente a pagar | 38.888,89 | 38.888,89 | 194,44 | 194,44 | 0,00 | 0,00 | 39.083,33 | 39.083,33 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 981,82 | 981,82 | 54,55 | 54,55 | 0,00 | 0,00 | 1.036,37 | 1.036,37 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 2.045,45 | 2.045,45 | 113,64 | 113,64 | 0,00 | 0,00 | 2.159,09 | 2.159,09 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 10.091,80 | 10.091,80 | 177,05 | 177,05 | 0,00 | 0,00 | 10.268,85 | 10.268,85 | 0,00 |
| PERF — Taxa de performance a pagar | 274.747,26 | 274.747,26 | 310.626,72 | 310.626,72 | 0,00 | 0,00 | 585.373,98 | 585.373,98 | 0,00 |
| **Total** |  |  |  |  |  |  | 1.342.036,53 | 1.342.036,53 | 0,00 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,12% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 2.322,51 · Beta: [base: PL do dia útil anterior] 0,12% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 2.322,51
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,78% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 34.450,53 · Beta: [base: PL do dia útil anterior] 1,78% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 34.450,53
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 387,08 · Beta: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 487.726.584,05 ÷ 252 (linear, dias úteis) = R$ 387,08
- **AUDIT** — Alfa: R$ 49.000,00 (anual) ÷ 252 d.u. = R$ 194,44 · Beta: R$ 49.000,00 (anual) ÷ 252 d.u. = R$ 194,44
- **ANBIMA** — Alfa: R$ 1.200,00 (mensal) ÷ 22 d.u. = R$ 54,55 · Beta: R$ 1.200,00 (mensal) ÷ 22 d.u. = R$ 54,55
- **SELIC** — Alfa: R$ 2.500,00 (mensal) ÷ 22 d.u. = R$ 113,64 · Beta: R$ 2.500,00 (mensal) ÷ 22 d.u. = R$ 113,64
- **CVM** — Alfa: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05 · Beta: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05
- **PERF** — Alfa: 20% × max(0; cota bruta 4,68662062 − cota de referência 4,51885385 × fator 100% do CDI 1,03092859 = 4,65861563) × 104.512.426,83993126 cotas = R$ 585.373,98 · Beta: 20% × max(0; cota bruta 4,68662062 − cota de referência 4,51885385 × fator 100% do CDI 1,03092859 = 4,65861563) × 104.512.426,83993126 cotas = R$ 585.373,98

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| RSG-1 | resgate | Cotista 0805 | 265.167,65442375 cotas |  | 24/02/2026 | 26/03/2026 | 27/03/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 0812 | 210.126,55548028 cotas (R$ 980.594,46) |  | 23/02/2026 | 25/03/2026 | 26/03/2026 | não | não | cotizado em 25/03/2026 pela cota de 4,66668508; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 487.448.186,16 | 487.448.186,16 | 0,00 |
| Caixa | 2.954.315,01 | 1.714.906,69 | -1.239.408,32 |
| Valores a receber | 164.256,30 | 1.403.664,62 | 1.239.408,32 |
| Valores a pagar | 0,00 | 0,00 | 0,00 |
| Provisões | 1.342.036,53 | 1.342.036,53 | 0,00 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 489.847.794,72 | 489.847.794,72 | 0,00 |
| PL base da cota | 489.224.720,94 | 489.224.720,94 | 0,00 |
| Cota (8 casas) | 4,68101962 | 4,68101962 | 0,00000000 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 265.167,65442375 | 265.167,65442375 | 0,00000000 |
| Valor dos resgates cotizados | 1.241.254,99 | 1.241.254,99 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 104.247.259,18550752 | 104.247.259,18550752 | 0,00000000 |
| PL final | 487.983.465,58 | 487.983.465,58 | 0,00 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO (com ressalva)

**Resumo:** Aprovar com ressalva: Ajuste de D−1 liquidado e não baixado.

**Dificuldade:** facil · **Cenários:** ajuste_liquidado_nao_baixado

### Achado 1: Ajuste de D−1 liquidado e não baixado

- **Gravidade:** ressalva · **Dimensões:** caixa
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta não registrou a liquidação financeira do ajuste de 25/03/2026 (R$ 1.239.408,32) e manteve o valor pendente.
- **Onde olhar:** Caixa; Valores a receber/pagar — ajuste D−1
- **Raciocínio do analista:**
  1. O caixa difere em R$ 1.239.408,32, e o Beta tem um "ajuste de D−1" pendente no mesmo valor. PL e cota iguais.
  2. O ajuste de D−1 liquida em D. É questão de baixa, sem efeito no PL.
- **Ação:** Beta deve baixar o ajuste de D−1 contra o caixa. Sem impacto na cota.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | ambos |
| caixa | Alfa |
| provisoes | ambos |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 4,68101962 |
| Quantidade final de cotas | 104.247.259,18550752 |
| PL final | R$ 487.983.465,58 |
| Caixa | R$ 2.954.315,01 |
| Total de provisões | R$ 1.342.036,53 |
