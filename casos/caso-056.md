# Caso caso-056 — Jabuticaba FIC FIF Multimercado

> **Data-base (D):** 27/03/2026 (sexta-feira) · **D−1:** 26/03/2026 · **Fundo:** FND-0056

## 1. O fundo

O Jabuticaba FIC FIF Multimercado é gerido pela Garoa Investimentos, gestora de fundos de fundos (alocação) com comitê mensal de seleção, em São Paulo/SP. Criado em 21/06/2016, aloca em outros fundos multimercado e rebalanceia a carteira todo mês. Público-alvo: investidores qualificados. Hoje seus cotistas são clientes de um escritório de assessoria do interior paulista. Ao longo da vida, o fundo reduziu o prazo de cotização em 2024 para competir em plataformas e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Cecília, e quem cuida da validação do fundo é Diego. Sobre a rotina: o fundo está fechado para novas aplicações de varejo e só aceita aportes de cotistas existentes; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. O analista anterior deixou anotado que "esse fundo costuma bater de primeira, é só passar o olho". No fechamento de ontem (26/03/2026) o fundo tinha PL de R$ 100.718.363,54, cota de 6,03077702 e 16.700.727,45861497 cotas. Hoje, sexta-feira, 27/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | FIC Multimercado (fundo de fundos) |
| Classe | Classe Multimercado — Investimento em Cotas |
| Condomínio | aberto |
| Gestora | Garoa Investimentos (São Paulo/SP) |
| PL em D−1 | R$ 100.718.363,54 |
| Cota em D−1 | 6,03077702 |
| Quantidade de cotas em D−1 | 16.700.727,45861497 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/11/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,060% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,710% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 43.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 1.100,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 97.287.883,24. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+45 dias corridos após o pedido (se não for dia útil, no primeiro dia útil seguinte), pela cota de fechamento da data de cotização; liquidação financeira em D+1 dia útil após a cotização.
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Longo prazo; come-cotas semestral (maio/novembro) a 15%

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Cotas de fundos investidos: cota de D divulgada pelo administrador do investido. Se não divulgada até 20h de D, usa-se a última cota disponível e a cota é reprocessada quando a de D for publicada.

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 5,66584187 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| COTA CARAVELA | Cota de D divulgada pelo administrador do investido | 8,62122363 | divulgada às 17:45 |
| COTA CARDEAL | Cota de D divulgada pelo administrador do investido | 1,68675791 | divulgada às 19:33 |
| COTA POROROCA | Cota de D divulgada pelo administrador do investido | 3,42857647 | divulgada às 19:41 |
| COTA CORUJA | Cota de D divulgada pelo administrador do investido | 3,15147064 | divulgada às 18:39 |
| COTA JURITI | Cota de D divulgada pelo administrador do investido | 6,10228317 | divulgada às 19:40 |
| COTA CARDEAL | Cota de D−1 do investido | 1,67868390 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 27/03/2026: 1,03147015

## 4. Comunicações recebidas hoje

- **19:33** — *Administrador do fundo investido* — **Cota de 27/03/2026 publicada**: A cota de 27/03/2026 do Cardeal Global FIC FIF IE foi publicada às 19:33: 1,68675791.

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,98150327 | 5,98664073 | 0,00513746 |
| Quantidade final de cotas | 16.644.893,68627760 | 16.644.868,49385963 | -25,19241797 |
| PL final | R$ 99.561.486,01 | R$ 99.646.847,67 | R$ 85.361,66 |
| Caixa | R$ 1.247.260,23 | R$ 1.247.260,23 | R$ 0,00 |
| Total de provisões | R$ 649.909,61 | R$ 671.359,43 | R$ 21.449,82 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 6.207 | 6.207 | 802,218485 | 802,218485 | 4.979.370,14 | 4.979.370,14 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| COTA CARAVELA — Cotas do Caravela Long Short FIF Multimercado | 2.598.892,96822610 | 2.598.892,96822610 | 8,62122363 | 8,62122363 | 22.405.637,47 | 22.405.637,47 | 0,00 | Cota divulgada pelo administrador do fundo investido (D) |
| COTA CARDEAL — Cotas do Cardeal Global FIC FIF IE | 13.283.256,20213731 | 13.283.256,20213731 | 1,67868390 | 1,68675791 | 22.298.388,33 | 22.405.637,47 | 107.249,14 | Alfa: Última cota disponível no fechamento do processamento / Beta: Cota divulgada pelo administrador do fundo investido (D) |
| COTA POROROCA — Cotas do Pororoca Ações FIF | 5.082.752,87811542 | 5.082.752,87811542 | 3,42857647 | 3,42857647 | 17.426.606,92 | 17.426.606,92 | 0,00 | Cota divulgada pelo administrador do fundo investido (D) |
| COTA CORUJA — Cotas do Coruja Quant FIF Multimercado | 6.714.604,78283770 | 6.714.604,78283770 | 3,15147064 | 3,15147064 | 21.160.879,83 | 21.160.879,83 | 0,00 | Cota divulgada pelo administrador do fundo investido (D) |
| COTA JURITI — Cotas do Juriti Inflação FIF RF | 1.835.840,52438455 | 1.835.840,52438455 | 6,10228317 | 6,10228317 | 11.202.818,73 | 11.202.818,73 | 0,00 | Cota divulgada pelo administrador do fundo investido (D) |
| **Total** |  |  |  |  | 99.473.701,42 | 99.580.950,56 | 107.249,14 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.165.609,72 | 1.165.609,72 |
| TED recebida — aplicação [APL-1] Cotista 3864 (11:31) | 175.596,13 | 175.596,13 |
| Pagamento de resgate [LIQ-1] — Cotista 3885 (cotizado em 26/03/2026) | -93.945,62 | -93.945,62 |
| **Saldo final** | 1.247.260,23 | 1.247.260,23 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 175.596,13 | 175.596,13 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 4.420,42 | 4.420,42 | 239,81 | 239,81 | 0,00 | 0,00 | 4.660,23 | 4.660,23 | 0,00 |
| TXGES — Taxa de gestão a pagar | 55.164,75 | 55.164,75 | 2.837,70 | 2.837,70 | 0,00 | 0,00 | 58.002,45 | 58.002,45 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 2.296,64 | 2.296,64 | 119,90 | 119,90 | 0,00 | 0,00 | 2.416,54 | 2.416,54 | 0,00 |
| AUDIT — Auditoria independente a pagar | 4.948,41 | 4.948,41 | 170,63 | 170,63 | 0,00 | 0,00 | 5.119,04 | 5.119,04 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 950,00 | 950,00 | 50,00 | 50,00 | 0,00 | 0,00 | 1.000,00 | 1.000,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 5.134,43 | 5.134,43 | 88,52 | 88,52 | 0,00 | 0,00 | 5.222,95 | 5.222,95 | 0,00 |
| PERF — Taxa de performance a pagar | 792.026,32 | 792.026,32 | -218.537,92 | -197.088,10 | 0,00 | 0,00 | 573.488,40 | 594.938,22 | 21.449,82 |
| **Total** |  |  |  |  |  |  | 649.909,61 | 671.359,43 | 21.449,82 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 239,81 · Beta: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 239,81
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,71% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 2.837,70 · Beta: [base: PL do dia útil anterior] 0,71% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 2.837,70
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 119,90 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 100.718.363,54 ÷ 252 (linear, dias úteis) = R$ 119,90
- **AUDIT** — Alfa: R$ 43.000,00 (anual) ÷ 252 d.u. = R$ 170,63 · Beta: R$ 43.000,00 (anual) ÷ 252 d.u. = R$ 170,63
- **ANBIMA** — Alfa: R$ 1.100,00 (mensal) ÷ 22 d.u. = R$ 50,00 · Beta: R$ 1.100,00 (mensal) ÷ 22 d.u. = R$ 50,00
- **CVM** — Alfa: R$ 5.400,00 (trimestral) ÷ 61 d.u. = R$ 88,52 · Beta: R$ 5.400,00 (trimestral) ÷ 61 d.u. = R$ 88,52
- **PERF** — Alfa: 20% × max(0; cota bruta 6,01584240 − cota de referência 5,66584187 × fator 100% do CDI 1,03147015 = 5,84414676) × 16.700.727,45861497 cotas = R$ 573.488,40 · Beta: 20% × max(0; cota bruta 6,02226422 − cota de referência 5,66584187 × fator 100% do CDI 1,03147015 = 5,84414676) × 16.700.727,45861497 cotas = R$ 594.938,22

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 3864 | R$ 175.596,13 | 11:31 | 27/03/2026 | 27/03/2026 | 27/03/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 3871 | 18.669,66927795 cotas |  | 10/02/2026 | 27/03/2026 | 30/03/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista 3878 | 66.520,62466841 cotas |  | 10/02/2026 | 27/03/2026 | 30/03/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 3885 | 15.577,69792292 cotas (R$ 93.945,62) |  | 09/02/2026 | 26/03/2026 | 27/03/2026 | não | não | cotizado em 26/03/2026 pela cota de 6,03077702; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 99.473.701,42 | 99.580.950,56 | 107.249,14 |
| Caixa | 1.247.260,23 | 1.247.260,23 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 175.596,13 | 175.596,13 | 0,00 |
| Provisões | 649.909,61 | 671.359,43 | 21.449,82 |
| PL antes das apropriações do dia (saldos anteriores das provisões) | 100.472.450,87 | 100.579.700,01 | 107.249,14 |
| PL base da cota | 99.895.455,91 | 99.981.255,23 | 85.799,32 |
| Cota (8 casas) | 5,98150327 | 5,98664073 | 0,00513746 |
| Aplicações convertidas | 175.596,13 | 175.596,13 | 0,00 |
| Cotas emitidas | 29.356,52160899 | 29.331,32919102 | -25,19241797 |
| Cotas resgatadas | 85.190,29394636 | 85.190,29394636 | 0,00000000 |
| Valor dos resgates cotizados | 509.566,02 | 510.003,68 | 437,66 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 16.644.893,68627760 | 16.644.868,49385963 | -25,19241797 |
| PL final | 99.561.486,01 | 99.646.847,67 | 85.361,66 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Cota do investido COTA CARDEAL de D−1.

**Dificuldade:** facil · **Cenários:** cota_investido_d1

### Achado 1: Cota do investido COTA CARDEAL de D−1

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa fechou o processamento antes da publicação da cota de D do investido (19:33) e usou a cota de D−1.
- **Onde olhar:** Carteira — linha COTA CARDEAL; Informações de mercado — cotas do investido; Comunicações — publicação da cota; Regulamento — precificação de cotas de fundos
- **Raciocínio do analista:**
  1. A divergência está em COTA CARDEAL: 1,68675791 (Beta) contra 1,67868390 (Alfa). 1,67868390 é a cota de D−1 do investido.
  2. O regulamento só aceita a última cota disponível se a de D não sair até 20h. Ela saiu às 19:33, então tem que ser usada a cota de D.
- **Ação:** Alfa deve atualizar a cota de COTA CARDEAL para 1,68675791 e reprocessar a cota do FIC.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Beta |
| caixa | ambos |
| provisoes | Beta |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 5,98664073 |
| Quantidade final de cotas | 16.644.868,49385963 |
| PL final | R$ 99.646.847,67 |
| Caixa | R$ 1.247.260,23 |
| Total de provisões | R$ 671.359,43 |
