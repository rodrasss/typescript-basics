# Caso caso-067 — Umbuzeiro II FIF Multimercado Long Short

> **Data-base (D):** 20/01/2026 (terça-feira) · **D−1:** 19/01/2026 · **Fundo:** FND-0067

## 1. O fundo

Sob a gestão da Marola Asset, gestora jovem de ações, muito ativa em eventos societários e small caps (Florianópolis/SC), o Umbuzeiro II FIF Multimercado Long Short é um dos fundos que mais exigem atenção na rotina de validação. Criado em 10/12/2012, monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição. Público-alvo: investidores qualificados. Hoje seus cotistas são cerca de 2 mil investidores qualificados. Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão. O gestor responsável é Fernanda, e quem cuida da validação do fundo é Marina. Sobre a rotina: o fundo tem aplicações e resgates quase todos os dias; a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras. A carteira tem papéis de empresas que vêm anunciando desdobramentos e bonificações. Nos últimos meses o fundo não teve nenhuma divergência relevante. No fechamento de ontem (19/01/2026) o fundo tinha PL de R$ 42.610.886,34, cota de 6,26800268 e 6.798.160,19760836 cotas. Hoje, terça-feira, 20/01/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Long & Short |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Marola Asset (Florianópolis/SC) |
| PL em D−1 | R$ 42.610.886,34 |
| Cota em D−1 | 6,26800268 |
| Quantidade de cotas em D−1 | 6.798.160,19760836 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/03/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,110% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,820% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 43.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 300,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 41.118.470,52. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+15 dias corridos após o pedido (se não for dia útil, no primeiro dia útil seguinte), pela cota de fechamento da data de cotização; liquidação financeira em D+2 dias úteis após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
- Tributação: Come-cotas semestral, no penúltimo dia útil de maio e de novembro (15% se o prazo médio da carteira superar 365 dias; 20% caso contrário)

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Eventos societários reconhecidos na data "ex".
- Futuros: ajuste diário divulgado pela B3, liquidado em D+1.
- Margem depositada em dinheiro na B3 é ativo da classe (valores dados em garantia).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.457,490885 |  |
| VJNR3 | B3 — preço de fechamento de D | 76,94 |  |
| YRBQ3 | B3 — preço de fechamento de D | 80,40 |  |
| WJMA4 | B3 — preço de fechamento de D | 19,43 |  |
| QPLN3 | B3 — preço de fechamento de D | 73,20 |  |
| XVRM3 | B3 — preço de fechamento de D | 83,25 |  |
| ZFRT3 | B3 — preço de fechamento de D | 90,87 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| INDG26 | -65 | 311,33 |

## 4. Comunicações recebidas hoje

- **15:34** — *Distribuidor* — **Material de divulgação**: Enviamos a nova lâmina do fundo para validação de compliance. Sem pressa.

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 6,31169712 | 6,31168764 | -0,00000948 |
| Quantidade final de cotas | 6.816.586,54598801 | 6.816.586,57366393 | 0,02767592 |
| PL final | R$ 43.024.229,67 | R$ 43.024.165,22 | R$ -64,45 |
| Caixa | R$ 381.539,39 | R$ 381.539,39 | R$ 0,00 |
| Total de provisões | R$ 58.235,50 | R$ 58.299,95 | R$ 64,45 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 681 | 681 | 18.457,490885 | 18.457,490885 | 12.569.551,29 | 12.569.551,29 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 5.116 | 5.116 | 818,565978 | 818,565978 | 4.187.783,54 | 4.187.783,54 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| VJNR3 — Vajanra Energia S.A. ON | 70.757 | 70.757 | 76,94 | 76,94 | 5.444.043,58 | 5.444.043,58 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 41.669 | 41.669 | 80,40 | 80,40 | 3.350.187,60 | 3.350.187,60 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 258.635 | 258.635 | 19,43 | 19,43 | 5.025.278,05 | 5.025.278,05 | 0,00 | B3 — preço de fechamento D |
| QPLN3 — Quiplan Saúde S.A. ON | 57.209 | 57.209 | 73,20 | 73,20 | 4.187.698,80 | 4.187.698,80 | 0,00 | B3 — preço de fechamento D |
| XVRM3 — Xavantina Mineração S.A. ON | 40.242 | 40.242 | 83,25 | 83,25 | 3.350.146,50 | 3.350.146,50 | 0,00 | B3 — preço de fechamento D |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 50.693 | 50.693 | 90,87 | 90,87 | 4.606.472,91 | 4.606.472,91 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 42.721.162,27 | 42.721.162,27 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 141.364,83 | 141.364,83 |
| TED recebida — aplicação [APL-1] Cotista 2450 (10:43) | 57.739,37 | 57.739,37 |
| TED recebida — aplicação [APL-2] Cotista 2457 (12:48) | 58.562,16 | 58.562,16 |
| Liquidação B3 — ajuste de futuros de 19/01/2026 | 123.873,03 | 123.873,03 |
| **Saldo final** | 381.539,39 | 381.539,39 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 116.301,53 | 116.301,53 |
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 20.236,45 | 20.236,45 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 2.260,88 | 2.260,88 | 185,90 | 185,90 | 0,00 | 0,00 | 2.446,78 | 2.446,78 | 0,00 |
| TXGES — Taxa de gestão a pagar | 35.597,59 | 35.597,59 | 3.049,89 | 3.049,89 | 0,00 | 0,00 | 38.647,48 | 38.647,48 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 609,81 | 609,81 | 50,72 | 50,72 | 0,00 | 0,00 | 660,53 | 660,53 | 0,00 |
| AUDIT — Auditoria independente a pagar | 15.357,14 | 15.357,14 | 170,63 | 235,08 | 0,00 | 0,00 | 15.527,77 | 15.592,22 | 64,45 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 171,43 | 171,43 | 14,29 | 14,29 | 0,00 | 0,00 | 185,72 | 185,72 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 708,20 | 708,20 | 59,02 | 59,02 | 0,00 | 0,00 | 767,22 | 767,22 | 0,00 |
| **Total** |  |  |  |  |  |  | 58.235,50 | 58.299,95 | 64,45 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,11% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 185,90 · Beta: [base: PL do dia útil anterior] 0,11% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 185,90
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,82% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 3.049,89 · Beta: [base: PL do dia útil anterior] 1,82% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 3.049,89
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 50,72 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 42.610.886,34 fator exponencial (1+taxa)^(1/252) − 1 = R$ 50,72
- **AUDIT** — Alfa: R$ 43.000,00 (anual) ÷ 252 d.u. = R$ 170,63 · Beta: R$ 59.239,00 (anual) ÷ 252 d.u. = R$ 235,08
- **ANBIMA** — Alfa: R$ 300,00 (mensal) ÷ 21 d.u. = R$ 14,29 · Beta: R$ 300,00 (mensal) ÷ 21 d.u. = R$ 14,29
- **CVM** — Alfa: R$ 3.600,00 (trimestral) ÷ 61 d.u. = R$ 59,02 · Beta: R$ 3.600,00 (trimestral) ÷ 61 d.u. = R$ 59,02

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 2450 | R$ 57.739,37 | 10:43 | 20/01/2026 | 20/01/2026 | 20/01/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista 2457 | R$ 58.562,16 | 12:48 | 20/01/2026 | 20/01/2026 | 20/01/2026 | sim | sim |  |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 42.721.162,27 | 42.721.162,27 | 0,00 |
| Caixa | 381.539,39 | 381.539,39 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 136.537,98 | 136.537,98 | 0,00 |
| Provisões | 58.235,50 | 58.299,95 | 64,45 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 42.911.458,63 | 42.911.458,63 | 0,00 |
| PL base da cota | 42.907.928,18 | 42.907.863,73 | -64,45 |
| Cota (8 casas) | 6,31169712 | 6,31168764 | -0,00000948 |
| Aplicações convertidas | 116.301,53 | 116.301,53 | 0,00 |
| Cotas emitidas | 18.426,34837965 | 18.426,37605557 | 0,02767592 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 6.816.586,54598801 | 6.816.586,57366393 | 0,02767592 |
| PL final | 43.024.229,67 | 43.024.165,22 | -64,45 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO (com ressalva)

**Resumo:** Aprovar com ressalva (dentro da régua): Provisão de auditoria com diferença pequena.

**Dificuldade:** media · **Cenários:** reg_provisao_dentro

### Régua v1 (provisória) — medidas deste caso

| Dimensão | Medida | Limite | Veredito |
|---|---|---|---|
| Cota | 10,21 cotas equivalentes (quantidade 0,03; PL 10,21) | 250 cotas | dentro |
| Caixa | R$ 0,00 | sem tolerância | bate |
| Provisões | maior diferença R$ 64,45; total R$ 64,45 | R$ 100,00 por provisão e no total | dentro |

### Achado 1: Provisão de auditoria com diferença pequena

- **Gravidade:** ressalva · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta provisiona a auditoria por R$ 59.239,00/ano; o regulamento prevê R$ 43.000,00/ano (diferença de R$ 16.239,00 por ano).
- **Onde olhar:** Provisões — AUDIT; Regulamento — despesas fixas
- **Raciocínio do analista:**
  1. Só a apropriação de auditoria difere: R$ 170,63 por dia (Alfa) contra R$ 235,08 (Beta), diferença de R$ 64,45. O saldo anterior e as outras provisões batem.
  2. O regulamento prevê R$ 43.000,00 por ano, apropriados por 1/252: R$ 170,63 por dia, como no Alfa.
  3. Régua v1 (provisória) — provisões: maior diferença numa provisão de R$ 64,45 e diferença total de R$ 64,45, contra o limite de R$ 100,00 por provisão e no total: dentro.
- **Ação:** Beta deve voltar o valor anual da auditoria para R$ 43.000,00 e reprocessar. Dentro da régua: aprovar com ressalva e corrigir na origem, para a diferença não se acumular.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | Alfa |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 6,31169712 |
| Quantidade final de cotas | 6.816.586,54598801 |
| PL final | R$ 43.024.229,67 |
| Caixa | R$ 381.539,39 |
| Total de provisões | R$ 58.235,50 |

### Armadilhas deste caso

- Até R$ 100 por provisão e no total é variação normal: aprovar com ressalva, sem reprovar por reflexo.
