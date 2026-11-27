# Caso caso-071 — Corrupião Estratégia FIE FIF Previdenciário Multimercado

> **Data-base (D):** 20/04/2026 (segunda-feira) · **D−1:** 17/04/2026 · **Fundo:** FND-0071

## 1. O fundo

Sob a gestão da Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte (Curitiba/PR), o Corrupião Estratégia FIE FIF Previdenciário Multimercado é um dos fundos que mais exigem atenção na rotina de validação. Criado em 26/12/2009, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos VGBL de uma seguradora regional (cotista único). Ao longo da vida, o fundo incorporou um fundo irmão menor em 2022, o que gerou um longo período de conciliação de cotistas e teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025. O gestor responsável é Lívia, e quem cuida da validação do fundo é Beatriz. Sobre a rotina: o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota; o fundo tem aplicações e resgates quase todos os dias. O prazo de cotização do fundo mudou no passado e alguns sistemas guardam parametrizações antigas. A área de risco pediu atenção redobrada ao fundo depois de um apontamento de auditoria em 2025 (já regularizado). No fechamento de ontem (17/04/2026) o fundo tinha PL de R$ 2.542.797.835,71, cota de 5,97135085 e 425.832.931,20555000 cotas. Hoje, segunda-feira, 20/04/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 2.542.797.835,71 |
| Cota em D−1 | 5,97135085 |
| Quantidade de cotas em D−1 | 425.832.931,20555000 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/03/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,170% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,070% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 56.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 900,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 2.500,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 2.655.093.689,43. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização D+1 útil (liquidação D+1 útil após a cotização).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
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
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.404,817926 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.460,024648 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.211,606256 |  |
| TFSU13 | ANBIMA — PU pela taxa indicativa de D | 1.000,906482 |  |
| WJMA4 | B3 — preço de fechamento de D | 16,50 |  |
| JZEL3 | B3 — preço de fechamento de D | 93,69 |  |
| HZTA3 | B3 — preço de fechamento de D | 24,77 |  |

## 4. Comunicações recebidas hoje

- **12:04** — *Gestora — mesa* — **Operação para amanhã**: Amanhã (21/04) vamos reduzir um pouco a posição mais líquida da carteira. Hoje não há boleta.
- **14:30** — *Custodiante — eventos* — **Agenda da semana**: Agenda de eventos corporativos da semana (nenhum dos papéis desta carteira está na lista de hoje).

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,97131768 | 5,97131768 | 0,00000000 |
| Quantidade final de cotas | 428.796.404,00594480 | 421.041.962,65796685 | -7.754.441,34797794 |
| PL final | R$ 2.560.479.548,36 | R$ 2.514.175.315,64 | R$ -46.304.232,72 |
| Caixa | R$ 47.579.895,00 | R$ 47.579.895,00 | R$ 0,00 |
| Total de provisões | R$ 1.668.701,60 | R$ 1.668.701,60 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 50.655 | 50.655 | 18.404,817926 | 18.404,817926 | 932.296.052,04 | 932.296.052,04 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 89.587 | 89.587 | 4.460,024648 | 4.460,024648 | 399.560.228,14 | 399.560.228,14 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 63.247 | 63.247 | 4.211,606256 | 4.211,606256 | 266.371.460,87 | 266.371.460,87 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 268.454 | 268.454 | 793,797883 | 793,797883 | 213.098.216,88 | 213.098.216,88 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| TFSU13 — Debênture Telecom Fibra Sul S.A. — CDI + 1,60% | 319.357 | 319.357 | 1.000,906482 | 1.000,906482 | 319.646.491,37 | 319.646.491,37 | 0,00 | ANBIMA — taxa indicativa D |
| WJMA4 — Banco Wajumá S.A. PN | 8.071.891 | 8.071.891 | 16,50 | 16,50 | 133.186.201,50 | 133.186.201,50 | 0,00 | B3 — preço de fechamento D |
| JZEL3 — Jazê Elétrica S.A. ON | 1.421.563 | 1.421.563 | 93,69 | 93,69 | 133.186.237,47 | 133.186.237,47 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 5.376.916 | 5.376.916 | 24,77 | 24,77 | 133.186.209,32 | 133.186.209,32 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 2.530.531.097,59 | 2.530.531.097,59 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 13.921.315,78 | 13.921.315,78 |
| TED recebida — aplicação Cotista 5978 (11:35) | 12.244.363,41 | 12.244.363,41 |
| TED recebida — aplicação Cotista 5985 (12:14) | 9.879.364,31 | 9.879.364,31 |
| TED recebida — aplicação Cotista 5992 (10:27) | 11.534.851,50 | 11.534.851,50 |
| **Saldo final** | 47.579.895,00 | 47.579.895,00 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 33.658.579,22 | 33.658.579,22 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 208.359,26 | 208.359,26 | 17.153,79 | 17.153,79 | 0,00 | 0,00 | 225.513,05 | 225.513,05 | 0,00 |
| TXGES — Taxa de gestão a pagar | 1.262.249,96 | 1.262.249,96 | 107.968,00 | 107.968,00 | 0,00 | 0,00 | 1.370.217,96 | 1.370.217,96 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 23.895,86 | 23.895,86 | 2.018,09 | 2.018,09 | 0,00 | 0,00 | 25.913,95 | 25.913,95 | 0,00 |
| AUDIT — Auditoria independente a pagar | 41.555,56 | 41.555,56 | 222,22 | 222,22 | 0,00 | 0,00 | 41.777,78 | 41.777,78 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 540,00 | 540,00 | 45,00 | 45,00 | 0,00 | 0,00 | 585,00 | 585,00 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.500,00 | 1.500,00 | 125,00 | 125,00 | 0,00 | 0,00 | 1.625,00 | 1.625,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 2.832,79 | 2.832,79 | 236,07 | 236,07 | 0,00 | 0,00 | 3.068,86 | 3.068,86 | 0,00 |
| **Total** |  |  |  |  |  |  | 1.668.701,60 | 1.668.701,60 | 0,00 |

_Memória de cálculo das provisões: não disponível neste caso. Recalcular a partir do regulamento._

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 5978 | R$ 12.244.363,41 | 11:35 | 20/04/2026 | 20/04/2026 | 20/04/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista 5985 | R$ 9.879.364,31 | 12:14 | 20/04/2026 | 20/04/2026 | 20/04/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista 5992 | R$ 11.534.851,50 | 10:27 | 20/04/2026 | 20/04/2026 | 20/04/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 5999 | 984.895,18143081 cotas |  | 18/04/2026 | 20/04/2026 | 23/04/2026 | sim | sim |  |
| RSG-2 | resgate | Cotista 6006 | 1.688.340,86934376 cotas |  | 03/04/2026 | 20/04/2026 | 22/04/2026 | sim | sim |  |
| RSG-NOVO | resgate | Cotista 7997 | 7.754.441,34797794 cotas |  | 20/04/2026 | 22/04/2026 | 23/04/2026 | não | sim | pedido de resgate registrado hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 2.530.531.097,59 | 2.530.531.097,59 | 0,00 |
| Caixa | 47.579.895,00 | 47.579.895,00 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 33.658.579,22 | 33.658.579,22 | 0,00 |
| Provisões | 1.668.701,60 | 1.668.701,60 | 0,00 |
| PL base da cota | 2.542.783.711,77 | 2.542.783.711,77 | 0,00 |
| Cota (8 casas) | 5,97131768 | 5,97131768 | 0,00000000 |
| Aplicações convertidas | 33.658.579,22 | 33.658.579,22 | 0,00 |
| Cotas emitidas | 5.636.708,85116933 | 5.636.708,85116933 | 0,00000000 |
| Cotas resgatadas | 2.673.236,05077457 | 10.427.677,39875251 | 7.754.441,34797794 |
| Valor dos resgates cotizados | 15.962.741,69 | 62.266.974,41 | 46.304.232,72 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 428.796.404,00594480 | 421.041.962,65796685 | -7.754.441,34797794 |
| PL final | 2.560.479.548,36 | 2.514.175.315,64 | -46.304.232,72 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: Resgate de Cotista 7997 cotizado antes da data.

**Dificuldade:** media · **Cenários:** resgate_cotizado_antecipadamente

### Achado 1: Resgate de Cotista 7997 cotizado antes da data

- **Gravidade:** erro · **Dimensões:** cota
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta cotizou em D um pedido feito hoje, cuja cotização pelo regulamento é 22/04/2026.
- **Onde olhar:** Movimentações de passivo; Regulamento — prazo de cotização; Quantidade final de cotas
- **Raciocínio do analista:**
  1. A cota bate, mas o Beta baixou 7.754.441,34797794 cotas a mais no fechamento.
  2. O pedido de Cotista 7997 foi feito em 20/04/2026. Resgate: cotização D+1 útil (liquidação D+1 útil após a cotização). Ou seja, a cotização é em 22/04/2026, não hoje.
  3. Cotizar antes do prazo muda o valor recebido pelo cotista e fere a isonomia com os demais.
- **Ação:** Beta deve desfazer a cotização e reagendar o resgate para 22/04/2026.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | ambos |
| provisoes | ambos |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 5,97131768 |
| Quantidade final de cotas | 428.796.404,00594480 |
| PL final | R$ 2.560.479.548,36 |
| Caixa | R$ 47.579.895,00 |
| Total de provisões | R$ 1.668.701,60 |
