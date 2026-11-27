# Caso caso-103 — Uirapuru II FIF Ações

> **Data-base (D):** 24/08/2026 (segunda-feira) · **D−1:** 21/08/2026 · **Fundo:** FND-0103

## 1. O fundo

Sob a gestão da Marola Asset, gestora jovem de ações, muito ativa em eventos societários e small caps (Florianópolis/SC), o Uirapuru II FIF Ações é um dos fundos que mais exigem atenção na rotina de validação. Criado em 07/03/2019, é um fundo de ações de gestão ativa, concentrado em poucas dezenas de papéis. Público-alvo: investidores qualificados. Hoje seus cotistas são clientes de varejo que entraram na alta de 2024. Ao longo da vida, o fundo mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Otávio, e quem cuida da validação do fundo é Patrícia. Sobre a rotina: a gestora publica uma carta mensal aos cotistas até o 5º dia útil; o fundo está fechado para novas aplicações de varejo e só aceita aportes de cotistas existentes. Em dias de feed de preços instável, já houve ações com o fechamento do dia anterior. A equipe da gestora é considerada muito organizada. No fechamento de ontem (21/08/2026) o fundo tinha PL de R$ 91.566.408,50, cota de 23,26001463 e 3.936.644,49291854 cotas. Hoje, segunda-feira, 24/08/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Ações |
| Classe | Classe de Ações |
| Condomínio | aberto |
| Gestora | Marola Asset (Florianópolis/SC) |
| PL em D−1 | R$ 91.566.408,50 |
| Cota em D−1 | 23,26001463 |
| Quantidade de cotas em D−1 | 3.936.644,49291854 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/01/2026 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,110% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,150% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,010% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder Ibovespa; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 79.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 900,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 88.488.651,24. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Tributação: Classe de ações: sem come-cotas; IR de 15% no resgate

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Eventos societários (dividendos, JCP, desdobramentos, grupamentos) reconhecidos na data "ex".

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 20,90978975 (cota da última cobrança efetiva, em 30/06/2026).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| WJMA4 | B3 — preço de fechamento de D | 25,53 |  |
| WQLA3 | B3 — preço de fechamento de D | 24,86 |  |
| YRBQ3 | B3 — preço de fechamento de D | 31,64 |  |
| XVRM3 | B3 — preço de fechamento de D | 18,82 |  |
| HZTA3 | B3 — preço de fechamento de D | 66,73 |  |
| QXTR3 | B3 — preço de fechamento de D | 51,81 |  |
| VJNR3 | B3 — preço de fechamento de D | 90,47 |  |
| QPLN3 | B3 — preço de fechamento de D | 36,55 |  |
| HZTA3 | B3 — preço de fechamento de D−1 | 67,82 |  |

**Benchmark**

- Fator acumulado do Ibovespa de 30/06/2026 até 24/08/2026: 1,10519892

## 4. Comunicações recebidas hoje

- **19:16** — *Beta — sistemas* — **Instabilidade no feed de preços**: Tivemos instabilidade na carga de preços de ações entre 18h e 18h40. Alguns papéis podem ter ficado com o preço anterior.

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 23,24972988 | 23,27635010 | 0,02662022 |
| Quantidade final de cotas | 3.934.005,46473339 | 3.934.005,46473339 | 0,00000000 |
| PL final | R$ 91.464.564,40 | R$ 91.569.288,49 | R$ 104.724,09 |
| Caixa | R$ 778.707,66 | R$ 778.707,66 | R$ 0,00 |
| Total de provisões | R$ 229.581,35 | R$ 255.779,94 | R$ 26.198,59 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 6.166 | 6.166 | 812,806902 | 812,806902 | 5.011.767,36 | 5.011.767,36 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| WJMA4 — Banco Wajumá S.A. PN | 510.439 | 510.439 | 25,53 | 25,53 | 13.031.507,67 | 13.031.507,67 | 0,00 | B3 — preço de fechamento D |
| WQLA3 — Waqlá Alimentos S.A. ON | 241.937 | 241.937 | 24,86 | 24,86 | 6.014.553,82 | 6.014.553,82 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 221.775 | 221.775 | 31,64 | 31,64 | 7.016.961,00 | 7.016.961,00 | 0,00 | B3 — preço de fechamento D |
| XVRM3 — Xavantina Mineração S.A. ON | 798.957 | 798.957 | 18,82 | 18,82 | 15.036.370,74 | 15.036.370,74 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 120.177 | 120.177 | 66,73 | 67,82 | 8.019.411,21 | 8.150.404,14 | 130.992,93 | B3 — preço de fechamento D |
| QXTR3 — Quixadá Transportes S.A. ON | 270.873 | 270.873 | 51,81 | 51,81 | 14.033.930,13 | 14.033.930,13 | 0,00 | B3 — preço de fechamento D |
| VJNR3 — Vajanra Energia S.A. ON | 88.641 | 88.641 | 90,47 | 90,47 | 8.019.351,27 | 8.019.351,27 | 0,00 | B3 — preço de fechamento D |
| QPLN3 — Quiplan Saúde S.A. ON | 411.392 | 411.392 | 36,55 | 36,55 | 15.036.377,60 | 15.036.377,60 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 91.220.230,80 | 91.351.223,73 | 130.992,93 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.047.347,97 | 1.047.347,97 |
| Pagamento de resgate [LIQ-1] — Cotista 2303 (cotizado em 20/08/2026) | -105.232,23 | -105.232,23 |
| Pagamento de resgate [LIQ-2] — Cotista 2310 (cotizado em 20/08/2026) | -163.408,08 | -163.408,08 |
| **Saldo final** | 778.707,66 | 778.707,66 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| RESGATES A PAGAR — Resgates já cotizados e ainda não liquidados | 243.435,98 | 243.435,98 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 5.843,83 | 5.843,83 | 399,48 | 399,48 | 0,00 | 0,00 | 6.243,31 | 6.243,31 | 0,00 |
| TXGES — Taxa de gestão a pagar | 64.114,97 | 64.114,97 | 4.154,88 | 4.154,88 | 0,00 | 0,00 | 68.269,85 | 68.269,85 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 535,07 | 535,07 | 36,33 | 36,33 | 0,00 | 0,00 | 571,40 | 571,40 | 0,00 |
| AUDIT — Auditoria independente a pagar | 12.226,19 | 12.226,19 | 313,49 | 313,49 | 0,00 | 0,00 | 12.539,68 | 12.539,68 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 642,86 | 642,86 | 42,86 | 42,86 | 0,00 | 0,00 | 685,72 | 685,72 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 3.156,92 | 3.156,92 | 83,08 | 83,08 | 0,00 | 0,00 | 3.240,00 | 3.240,00 | 0,00 |
| PERF — Taxa de performance a pagar | 0,00 | 0,00 | 138.031,39 | 164.229,98 | 0,00 | 0,00 | 138.031,39 | 164.229,98 | 26.198,59 |
| **Total** |  |  |  |  |  |  | 229.581,35 | 255.779,94 | 26.198,59 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,11% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 399,48 · Beta: [base: PL do dia útil anterior] 0,11% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 399,48
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,15% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 4.154,88 · Beta: [base: PL do dia útil anterior] 1,15% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 4.154,88
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 36,33 · Beta: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 91.566.408,50 fator exponencial (1+taxa)^(1/252) − 1 = R$ 36,33
- **AUDIT** — Alfa: R$ 79.000,00 (anual) ÷ 252 d.u. = R$ 313,49 · Beta: R$ 79.000,00 (anual) ÷ 252 d.u. = R$ 313,49
- **ANBIMA** — Alfa: R$ 900,00 (mensal) ÷ 21 d.u. = R$ 42,86 · Beta: R$ 900,00 (mensal) ÷ 21 d.u. = R$ 42,86
- **CVM** — Alfa: R$ 5.400,00 (trimestral) ÷ 65 d.u. = R$ 83,08 · Beta: R$ 5.400,00 (trimestral) ÷ 65 d.u. = R$ 83,08
- **PERF** — Alfa: 20% × max(0; cota bruta 23,28479310 − cota de referência 20,90978975 × fator Ibovespa 1,10519892 = 23,10947705) × 3.936.644,49291854 cotas = R$ 138.031,39 · Beta: 20% × max(0; cota bruta 23,31806837 − cota de referência 20,90978975 × fator Ibovespa 1,10519892 = 23,10947705) × 3.936.644,49291854 cotas = R$ 164.229,98

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| RSG-1 | resgate | Cotista 2296 | 2.639,02818515 cotas |  | 24/07/2026 | 24/08/2026 | 26/08/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 2303 | 4.479,26746570 cotas (R$ 105.232,23) |  | 21/07/2026 | 20/08/2026 | 24/08/2026 | não | não | cotizado em 20/08/2026 pela cota de 23,49317822; liquidação financeira hoje |
| LIQ-2 | resgate | Cotista 2310 | 6.955,55434977 cotas (R$ 163.408,08) |  | 21/07/2026 | 20/08/2026 | 24/08/2026 | não | não | cotizado em 20/08/2026 pela cota de 23,49317822; liquidação financeira hoje |
| PEN-1 | resgate | Cotista 2317 | 8.689,81403822 cotas (R$ 202.125,20) |  | 22/07/2026 | 21/08/2026 | 25/08/2026 | não | não | cotizado em 21/08/2026 pela cota de 23,26001463; liquidação em 25/08/2026 (ainda a pagar) |
| PEN-2 | resgate | Cotista 2324 | 1.776,04285027 cotas (R$ 41.310,78) |  | 22/07/2026 | 21/08/2026 | 25/08/2026 | não | não | cotizado em 21/08/2026 pela cota de 23,26001463; liquidação em 25/08/2026 (ainda a pagar) |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 91.220.230,80 | 91.351.223,73 | 130.992,93 |
| Caixa | 778.707,66 | 778.707,66 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 243.435,98 | 243.435,98 | 0,00 |
| Provisões | 229.581,35 | 255.779,94 | 26.198,59 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 91.668.982,64 | 91.799.975,57 | 130.992,93 |
| PL base da cota | 91.525.921,13 | 91.630.715,47 | 104.794,34 |
| Cota (8 casas) | 23,24972988 | 23,27635010 | 0,02662022 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 2.639,02818515 | 2.639,02818515 | 0,00000000 |
| Valor dos resgates cotizados | 61.356,69 | 61.426,94 | 70,25 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 3.934.005,46473339 | 3.934.005,46473339 | 0,00000000 |
| PL final | 91.464.564,40 | 91.569.288,49 | 104.724,09 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Preço de HZTA3 desatualizado.

**Dificuldade:** media · **Cenários:** preco_acao_d1

### Achado 1: Preço de HZTA3 desatualizado

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta manteve o fechamento de D−1 de HZTA3 (falha na carga de preços).
- **Onde olhar:** Carteira — linha HZTA3; Informações de mercado — fechamento B3 de D e D−1
- **Raciocínio do analista:**
  1. Quantidade igual nos dois lados (120.177 ações), preço diferente: 66,73 (Alfa) contra 67,82 (Beta).
  2. O fechamento B3 de D é 66,73, e 67,82 é exatamente o fechamento de D−1. O Beta não atualizou o preço do dia.
  3. Impacto: R$ 130.992,93 no PL do Beta.
- **Ação:** Beta deve recarregar o fechamento de D de HZTA3 e reprocessar a cota.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 23,24972988 |
| Quantidade final de cotas | 3.934.005,46473339 |
| PL final | R$ 91.464.564,40 |
| Caixa | R$ 778.707,66 |
| Total de provisões | R$ 229.581,35 |
