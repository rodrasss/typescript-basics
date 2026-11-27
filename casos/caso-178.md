# Caso caso-178 — Cumaru Estratégia FIF Multimercado Long Short

> **Data-base (D):** 23/03/2026 (segunda-feira) · **D−1:** 20/03/2026 · **Fundo:** FND-0178

## 1. O fundo

Quem acompanha a Varanda Capital (Belo Horizonte/MG) conhece o Cumaru Estratégia FIF Multimercado Long Short: a casa é uma gestora de private equity com participações em empresas familiares do interior. Criado em 16/02/2018, monta posições compradas e vendidas em ações e usa o índice futuro para ajustar a exposição. Público-alvo: investidores qualificados. Hoje seus cotistas são um fundo de pensão fechado com 18% das cotas. Ao longo da vida, o fundo trocou de gestor responsável em 2023 depois da saída do fundador e migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização. O gestor responsável é Rodrigo, e quem cuida da validação do fundo é Felipe. Sobre a rotina: as reuniões do comitê de investimentos acontecem na primeira terça-feira de cada mês; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. Já houve um dia em que dois erros se anularam e só foram descobertos dias depois. No fechamento de ontem (20/03/2026) o fundo tinha PL de R$ 117.908.320,67, cota de 2,49175047 e 47.319.473,63473205 cotas. Hoje, segunda-feira, 23/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Multimercado Long & Short |
| Classe | Classe Multimercado |
| Condomínio | aberto |
| Gestora | Varanda Capital (Belo Horizonte/MG) |
| PL em D−1 | R$ 117.908.320,67 |
| Cota em D−1 | 2,49175047 |
| Quantidade de cotas em D−1 | 47.319.473,63473205 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/11/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,110% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,500% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,010% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 69.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 900,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 121.616.555,74. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização D+30 corridos (liquidação D+2 úteis).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Longo prazo; come-cotas semestral (maio/novembro) a 15%

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Ações: preço de fechamento da B3 em D.
- Eventos societários reconhecidos na data "ex".
- Futuros: ajuste diário divulgado pela B3, liquidado em D+1.

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 2,27152193 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.287,964303 |  |
| XVRM3 | B3 — preço de fechamento de D | 64,38 |  |
| KXOB3 | B3 — preço de fechamento de D | 53,08 |  |
| VJNR3 | B3 — preço de fechamento de D | 83,27 |  |
| HZTA3 | B3 — preço de fechamento de D | 56,59 |  |
| YRBQ3 | B3 — preço de fechamento de D | 7,79 |  |
| WQLA3 | B3 — preço de fechamento de D | 9,91 |  |

**Futuros (posição de D e ajuste do dia por contrato)**

| Contrato | Quantidade (+comprado / −vendido) | Ajuste de D por contrato (R$) |
|---|---|---|
| INDJ26 | -178 | 338,33 |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 23/03/2026: 1,06792974

## 4. Comunicações recebidas hoje

- **11:48** — *Auditoria independente* — **Proposta de renovação**: Segue a proposta de renovação do contrato de auditoria: R$ 153.000,00/ano, com vigência a partir de janeiro do próximo ano, se aprovada. Ainda não assinada.
- **17:43** — *Distribuidor* — **Material de divulgação**: Enviamos a nova lâmina do fundo para validação de compliance. Sem pressa.

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 2,47475794 | 2,47475793 | -0,00000001 |
| Quantidade final de cotas | 47.334.253,28999201 | 47.334.253,29019932 | 0,00020730 |
| PL final | R$ 117.140.819,16 | R$ 117.140.818,69 | R$ -0,47 |
| Caixa | R$ 384.363,75 | R$ 384.363,75 | R$ 0,00 |
| Total de provisões | R$ 743.891,74 | R$ 743.558,41 | R$ -333,33 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 1.995 | 1.995 | 18.288,131386 | 18.287,964303 | 36.484.822,12 | 36.484.488,78 | -333,34 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 14.833 | 14.833 | 819,743824 | 819,743824 | 12.159.260,14 | 12.159.260,14 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| XVRM3 — Xavantina Mineração S.A. ON | 207.748 | 207.748 | 64,38 | 64,38 | 13.374.816,24 | 13.374.816,24 | 0,00 | B3 — preço de fechamento D |
| KXOB3 — Kaxoeira Obras S.A. ON | 206.161 | 206.161 | 53,08 | 53,08 | 10.943.025,88 | 10.943.025,88 | 0,00 | B3 — preço de fechamento D |
| VJNR3 — Vajanra Energia S.A. ON | 116.814 | 116.814 | 83,27 | 83,27 | 9.727.101,78 | 9.727.101,78 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 128.916 | 128.916 | 56,59 | 56,59 | 7.295.356,44 | 7.295.356,44 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 2.185.172 | 2.185.172 | 7,79 | 7,79 | 17.022.489,88 | 17.022.489,88 | 0,00 | B3 — preço de fechamento D |
| WQLA3 — Waqlá Alimentos S.A. ON | 1.104.241 | 1.104.241 | 9,91 | 9,91 | 10.943.028,31 | 10.943.028,31 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 117.949.900,79 | 117.949.567,45 | -333,34 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 394.971,28 | 394.971,28 |
| TED recebida — aplicação Cotista 2933 (12:39) | 126.974,06 | 126.974,06 |
| Pagamento de resgate — Cotista 2947 (cotizado em 19/03/2026) | -65.096,48 | -65.096,48 |
| Liquidação B3 — ajuste de futuros de 20/03/2026 | -72.485,11 | -72.485,11 |
| **Saldo final** | 384.363,75 | 384.363,75 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 126.974,06 | 126.974,06 |
| RESGATES A PAGAR — Resgates cotizados em dias anteriores, a liquidar | 298.932,90 | 298.932,90 |
| AJUSTE FUTUROS D — Ajuste diário de futuros de D (liquidação em D+1) | 60.222,74 | 60.222,74 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 7.498,22 | 7.498,22 | 514,40 | 514,40 | 0,00 | 0,00 | 8.012,62 | 8.012,62 | 0,00 |
| TXGES — Taxa de gestão a pagar | 104.609,29 | 104.609,29 | 6.966,44 | 6.966,44 | 0,00 | 0,00 | 111.575,73 | 111.575,73 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 684,96 | 684,96 | 46,79 | 46,79 | 0,00 | 0,00 | 731,75 | 731,75 | 0,00 |
| AUDIT — Auditoria independente a pagar | 36.416,67 | 36.416,67 | 607,14 | 273,81 | 0,00 | 0,00 | 37.023,81 | 36.690,48 | -333,33 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 613,64 | 613,64 | 40,91 | 40,91 | 0,00 | 0,00 | 654,55 | 654,55 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 6.904,92 | 6.904,92 | 127,87 | 127,87 | 0,00 | 0,00 | 7.032,79 | 7.032,79 | 0,00 |
| PERF — Taxa de performance a pagar | 598.162,58 | 598.162,58 | -19.302,09 | -19.302,09 | 0,00 | 0,00 | 578.860,49 | 578.860,49 | 0,00 |
| **Total** |  |  |  |  |  |  | 743.891,74 | 743.558,41 | -333,33 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 2933 | R$ 126.974,06 | 12:39 | 23/03/2026 | 23/03/2026 | 23/03/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 2940 | 36.528,01323873 cotas |  | 04/03/2026 | 23/03/2026 | 24/03/2026 | sim | sim |  |
| LIQ-1 | resgate | Cotista 2947 | 26.131,20453263 cotas (R$ 65.096,48) |  | 23/02/2026 | 19/03/2026 | 23/03/2026 | não | não | cotizado em 19/03/2026 pela cota de 2,49113984; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 117.949.900,79 | 117.949.567,45 | -333,34 |
| Caixa | 384.363,75 | 384.363,75 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 486.129,70 | 486.129,70 | 0,00 |
| Provisões | 743.891,74 | 743.558,41 | -333,33 |
| PL base da cota | 117.104.243,10 | 117.104.243,09 | -0,01 |
| Cota (8 casas) | 2,47475794 | 2,47475793 | -0,00000001 |
| Aplicações convertidas | 126.974,06 | 126.974,06 | 0,00 |
| Cotas emitidas | 51.307,66849868 | 51.307,66870599 | 0,00020731 |
| Cotas resgatadas | 36.528,01323872 | 36.528,01323872 | 0,00000000 |
| Valor dos resgates cotizados | 90.397,99 | 90.397,99 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 47.334.253,28999201 | 47.334.253,29019932 | 0,00020730 |
| PL final | 117.140.819,16 | 117.140.818,69 | -0,47 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Provisão de auditoria com valor de proposta não assinada; PU de LFT 01/03/2029 diferente da referência.

**Dificuldade:** dificil · **Cenários:** erros_que_se_compensam

### Achado 1: Provisão de auditoria com valor de proposta não assinada

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa passou a provisionar a auditoria por R$ 153.000,00/ano (proposta ainda não assinada, para o ano que vem) em vez de R$ 69.000,00.
- **Onde olhar:** Provisões — auditoria; Regulamento/contrato — despesas fixas; Comunicações — proposta da auditoria
- **Raciocínio do analista:**
  1. A cota bate (ou quase), então seria fácil aprovar direto. Mas comparando linha a linha, a apropriação de auditoria do Alfa é R$ 607,14/dia contra R$ 273,81/dia do Beta.
  2. O contrato vigente é de R$ 69.000,00/ano. O valor novo vem de uma proposta não assinada, válida só para o ano que vem.
- **Ação:** Alfa deve voltar a apropriação de auditoria para R$ 69.000,00/ano.

### Achado 2: PU de LFT 01/03/2029 diferente da referência

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa usou PU 18.288,131386 para LFT 01/03/2029; a referência de D é 18.287,964303.
- **Onde olhar:** Carteira — LFT 01/03/2029; Informações de mercado — referências
- **Raciocínio do analista:**
  1. Em LFT 01/03/2029, o Alfa tem R$ 333,34 a mais de valor, praticamente o mesmo montante da provisão a maior (R$ 333,33). Por isso a cota parece bater.
  2. São dois erros independentes que se anulam hoje. Amanhã a provisão continua acumulando e o preço pode não compensar mais. Componente errado não se aprova, mesmo com a cota igual.
- **Ação:** Alfa deve reprecificar LFT 01/03/2029 pela referência de D (18.287,964303), corrigir a provisão e reenviar a posição antes da divulgação.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Beta |
| caixa | ambos |
| provisoes | Beta |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 2,47475793 |
| Quantidade final de cotas | 47.334.253,29019932 |
| PL final | R$ 117.140.818,69 |
| Caixa | R$ 384.363,75 |
| Total de provisões | R$ 743.558,41 |

### Armadilhas deste caso

- Cota igual não prova que está certa: dois erros podem se anular hoje. Conferir componente por componente.
