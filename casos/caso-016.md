# Caso caso-016 — Paineira Plus FIE FIF Previdenciário Multimercado

> **Data-base (D):** 14/01/2026 (quarta-feira) · **D−1:** 13/01/2026 · **Fundo:** FND-0016

## 1. O fundo

O Paineira Plus FIE FIF Previdenciário Multimercado é gerido pela Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte, em Curitiba/PR. Criado em 02/10/2022, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025 e mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge. O gestor responsável é Cecília, e quem cuida da validação do fundo é Lucas. Sobre a rotina: a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. No fechamento de ontem (13/01/2026) o fundo tinha PL de R$ 294.294.744,65, cota de 4,12821866 e 71.288.555,22840133 cotas. Hoje, quarta-feira, 14/01/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 294.294.744,65 |
| Cota em D−1 | 4,12821866 |
| Quantidade de cotas em D−1 | 71.288.555,22840133 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/05/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,190% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,650% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 26.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 400,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 3.500,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 296.152.225,25. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 4,08913225 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.221,202060 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.331,246100 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.101,281666 |  |
| LINO11 | ANBIMA — PU pela taxa indicativa de D | 1.086,766866 |  |
| HZTA3 | B3 — preço de fechamento de D | 12,40 |  |
| XVRM3 | B3 — preço de fechamento de D | 32,48 |  |
| ZFRT3 | B3 — preço de fechamento de D | 75,50 |  |

**Eventos de ativos**

- ZFRT3: dividendos de R$ 0,64 por ação; data-com 13/01/2026; negociação "ex" a partir de 14/01/2026; pagamento em 26/01/2026.

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 14/01/2026: 1,00473773

## 4. Comunicações recebidas hoje

- **10:54** — *Gestora — operacional* — **Previsão de resgates**: Para a semana que vem, esperamos resgates um pouco acima da média por causa de rebalanceamento de um FoF. Só aviso.
- **13:07** — *Gestora — mesa* — **Operação para o próximo pregão**: No próximo dia útil (15/01/2026) vamos reduzir um pouco a posição mais líquida da carteira. Até agora hoje não há boleta.

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 4,12053312 | 4,11906675 | -0,00146637 |
| Quantidade final de cotas | 71.288.555,22840133 | 71.288.555,22840133 | 0,00000000 |
| PL final | R$ 293.746.852,90 | R$ 293.642.317,50 | R$ -104.535,40 |
| Caixa | R$ 1.053.312,38 | R$ 1.053.312,38 | R$ 0,00 |
| Total de provisões | R$ 321.210,55 | R$ 295.076,66 | R$ -26.133,89 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 5.922 | 5.922 | 18.221,202060 | 18.221,202060 | 107.905.958,60 | 107.905.958,60 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 10.677 | 10.677 | 4.331,246100 | 4.331,246100 | 46.244.714,61 | 46.244.714,61 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 7.517 | 7.517 | 4.101,281666 | 4.101,281666 | 30.829.334,28 | 30.829.334,28 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 30.906 | 30.906 | 798,021002 | 798,021002 | 24.663.637,09 | 24.663.637,09 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| LINO11 — Debênture Logística Integrada Norte S.A. — CDI + 2,10% | 34.042 | 34.042 | 1.086,766866 | 1.086,766866 | 36.995.717,65 | 36.995.717,65 | 0,00 | ANBIMA — taxa indicativa D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 1.243.137 | 1.243.137 | 12,40 | 12,40 | 15.414.898,80 | 15.414.898,80 | 0,00 | B3 — preço de fechamento D |
| XVRM3 — Xavantina Mineração S.A. ON | 474.597 | 474.597 | 32,48 | 32,48 | 15.414.910,56 | 15.414.910,56 | 0,00 | B3 — preço de fechamento D |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 204.171 | 204.171 | 75,50 | 75,50 | 15.414.910,50 | 15.414.910,50 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 292.884.082,09 | 292.884.082,09 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.865.870,78 | 1.865.870,78 |
| Pagamento de resgate [LIQ-1] — Cotista único (cotizado em 13/01/2026) | -812.558,40 | -812.558,40 |
| **Saldo final** | 1.053.312,38 | 1.053.312,38 |

### 5.4 Valores a receber

| Item | Alfa | Beta |
|---|---|---|
| DIVIDENDOS A RECEBER ZFRT3 — Dividendos a receber — ZFRT3 (R$ 0,64/ação) | 130.669,44 | — |

### 5.5 Valores a pagar

Nenhum item.

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 17.478,90 | 17.478,90 | 2.216,79 | 2.216,79 | 0,00 | 0,00 | 19.695,69 | 19.695,69 | 0,00 |
| TXGES — Taxa de gestão a pagar | 60.186,53 | 60.186,53 | 7.566,47 | 7.566,47 | 0,00 | 0,00 | 67.753,00 | 67.753,00 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 1.902,79 | 1.902,79 | 233,54 | 233,54 | 0,00 | 0,00 | 2.136,33 | 2.136,33 | 0,00 |
| AUDIT — Auditoria independente a pagar | 14.341,27 | 14.341,27 | 103,17 | 103,17 | 0,00 | 0,00 | 14.444,44 | 14.444,44 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 152,38 | 152,38 | 19,05 | 19,05 | 0,00 | 0,00 | 171,43 | 171,43 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.333,33 | 1.333,33 | 166,67 | 166,67 | 0,00 | 0,00 | 1.500,00 | 1.500,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 1.022,95 | 1.022,95 | 127,87 | 127,87 | 0,00 | 0,00 | 1.150,82 | 1.150,82 | 0,00 |
| PERF — Taxa de performance a pagar | 389.775,85 | 389.775,85 | -175.417,01 | -201.550,90 | 0,00 | 0,00 | 214.358,84 | 188.224,95 | -26.133,89 |
| **Total** |  |  |  |  |  |  | 321.210,55 | 295.076,66 | -26.133,89 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,19% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 2.216,79 · Beta: [base: PL do dia útil anterior] 0,19% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 2.216,79
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,65% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 7.566,47 · Beta: [base: PL do dia útil anterior] 0,65% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 7.566,47
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 233,54 · Beta: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 294.294.744,65 fator exponencial (1+taxa)^(1/252) − 1 = R$ 233,54
- **AUDIT** — Alfa: R$ 26.000,00 (anual) ÷ 252 d.u. = R$ 103,17 · Beta: R$ 26.000,00 (anual) ÷ 252 d.u. = R$ 103,17
- **ANBIMA** — Alfa: R$ 400,00 (mensal) ÷ 21 d.u. = R$ 19,05 · Beta: R$ 400,00 (mensal) ÷ 21 d.u. = R$ 19,05
- **SELIC** — Alfa: R$ 3.500,00 (mensal) ÷ 21 d.u. = R$ 166,67 · Beta: R$ 3.500,00 (mensal) ÷ 21 d.u. = R$ 166,67
- **CVM** — Alfa: R$ 7.800,00 (trimestral) ÷ 61 d.u. = R$ 127,87 · Beta: R$ 7.800,00 (trimestral) ÷ 61 d.u. = R$ 127,87
- **PERF** — Alfa: 20% × max(0; cota bruta 4,12354004 − cota de referência 4,08913225 × fator 100% do CDI 1,00473773 = 4,10850545) × 71.288.555,22840133 cotas = R$ 214.358,84 · Beta: 20% × max(0; cota bruta 4,12170708 − cota de referência 4,08913225 × fator 100% do CDI 1,00473773 = 4,10850545) × 71.288.555,22840133 cotas = R$ 188.224,95

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| LIQ-1 | resgate | Cotista único | 196.830,27174757 cotas (R$ 812.558,40) |  | 12/01/2026 | 13/01/2026 | 14/01/2026 | não | não | cotizado em 13/01/2026 pela cota de 4,12821866; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 292.884.082,09 | 292.884.082,09 | 0,00 |
| Caixa | 1.053.312,38 | 1.053.312,38 | 0,00 |
| Valores a receber | 130.669,44 | 0,00 | -130.669,44 |
| Valores a pagar | 0,00 | 0,00 | 0,00 |
| Provisões | 321.210,55 | 295.076,66 | -26.133,89 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 293.971.645,76 | 293.840.976,32 | -130.669,44 |
| PL base da cota | 293.746.853,36 | 293.642.317,81 | -104.535,55 |
| Cota (8 casas) | 4,12053312 | 4,11906675 | -0,00146637 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 71.288.555,22840133 | 71.288.555,22840133 | 0,00000000 |
| PL final | 293.746.852,90 | 293.642.317,50 | -104.535,40 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Dividendos de ZFRT3 não provisionados.

**Dificuldade:** facil · **Cenários:** dividendo_ex_nao_provisionado

### Régua v1 (provisória) — medidas deste caso

| Dimensão | Medida | Limite | Veredito |
|---|---|---|---|
| Cota | 25.373,94 cotas equivalentes (quantidade 0,00; PL 25.373,94) | 250 cotas | ACIMA |
| Caixa | R$ 0,00 | sem tolerância | bate |
| Provisões | maior diferença R$ 26.133,89; total R$ 26.133,89 | R$ 100,00 por provisão e no total | ACIMA |

### Achado 1: Dividendos de ZFRT3 não provisionados

- **Gravidade:** erro · **Dimensões:** cota, provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta precificou ZFRT3 "ex" mas não registrou os dividendos a receber.
- **Onde olhar:** Valores a receber; Informações de mercado — eventos societários; Carteira — ZFRT3
- **Raciocínio do analista:**
  1. Os ativos batem, mas o Alfa tem R$ 130.669,44 de dividendos a receber de ZFRT3 que o Beta não tem.
  2. ZFRT3 ficou "ex" em D: o preço de fechamento já não carrega o dividendo. Se o direito não entra como valor a receber, o fundo perde esse valor no PL.
  3. O regulamento manda reconhecer o evento na data "ex", então o lado correto é o que provisionou.
  4. Efeito derivado do mesmo erro: a diferença também aparece em provisoes.
  5. Régua v1 (provisória) — cota: diferença de 25.373,94 cotas equivalentes (a maior entre 0,00 cotas de quantidade e 25.373,94 cotas de PL), contra o limite de 250: ACIMA; provisões: maior diferença numa provisão de R$ 26.133,89 e diferença total de R$ 26.133,89, contra o limite de R$ 100,00 por provisão e no total: ACIMA.
- **Ação:** Beta deve registrar R$ 130.669,44 de dividendos a receber de ZFRT3 e reprocessar a cota. Acima da régua: reprovar até o lado errado reprocessar.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 4,12053312 |
| Quantidade final de cotas | 71.288.555,22840133 |
| PL final | R$ 293.746.852,90 |
| Caixa | R$ 1.053.312,38 |
| Total de provisões | R$ 321.210,55 |
