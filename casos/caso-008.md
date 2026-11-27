# Caso caso-008 — Biguá FIE FIF Previdenciário Multimercado

> **Data-base (D):** 09/10/2026 (sexta-feira) · **D−1:** 08/10/2026 · **Fundo:** FND-0008

## 1. O fundo

Quem acompanha a Remanso Asset (Curitiba/PR) conhece o Biguá FIE FIF Previdenciário Multimercado: a casa é uma gestora de previdência ligada a uma seguradora de médio porte. Criado em 01/12/2023, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge e teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025. O gestor responsável é Caio, e quem cuida da validação do fundo é Renata. Sobre a rotina: as reuniões do comitê de investimentos acontecem na primeira terça-feira de cada mês; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. A performance oscila bastante e o fundo vive perto da linha d’água. O analista anterior deixou anotado que "esse fundo costuma bater de primeira, é só passar o olho". No fechamento de ontem (08/10/2026) o fundo tinha PL de R$ 1.537.657.979,61, cota de 6,63323702 e 231.811.101,42397407 cotas. Hoje, sexta-feira, 09/10/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 1.537.657.979,61 |
| Cota em D−1 | 6,63323702 |
| Quantidade de cotas em D−1 | 231.811.101,42397407 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/03/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,100% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 1,280% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,030% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 71.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 500,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 5.400,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 1.416.845.741,24. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização D+1 útil (liquidação D+1 útil após a cotização).
- Cota de fechamento, calculada com 8 casas decimais, por TRUNCAMENTO.
- Tributação: Previdência: tributação no plano (seguradora); sem come-cotas

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Debêntures: taxa indicativa ANBIMA de D.
- Ações: preço de fechamento da B3 em D.

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 6,01388028 (cota da última cobrança efetiva, em 30/06/2026).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.340,301609 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.306,618120 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.232,682341 |  |
| TFSU13 | ANBIMA — PU pela taxa indicativa de D | 976,053473 |  |
| ZFRT3 | B3 — preço de fechamento de D | 71,74 |  |
| YRBQ3 | B3 — preço de fechamento de D | 45,78 |  |
| HZTA3 | B3 — preço de fechamento de D | 72,05 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 30/06/2026 até 09/10/2026: 1,07393761

## 4. Comunicações recebidas hoje

- **15:00** — *Distribuidor* — **Material de divulgação**: Enviamos a nova lâmina do fundo para validação de compliance. Sem pressa.
- **17:22** — *Custodiante — eventos* — **Agenda da semana**: Agenda de eventos corporativos da semana (nenhum dos papéis desta carteira está na lista de hoje).

## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 6,57624521 | 6,58593023 | 0,00968502 |
| Quantidade final de cotas | 232.268.149,27518493 | 232.266.843,70803475 | -1.305,56715018 |
| PL final | R$ 1.527.452.304,11 | R$ 1.529.693.227,40 | R$ 2.240.923,29 |
| Caixa | R$ 15.702.280,74 | R$ 15.702.280,74 | R$ 0,00 |
| Total de provisões | R$ 10.246.338,90 | R$ 8.001.243,27 | R$ -2.245.095,63 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 30.631 | 30.631 | 18.340,301609 | 18.340,301609 | 561.781.778,59 | 561.781.778,59 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 55.905 | 55.905 | 4.306,618120 | 4.306,618120 | 240.761.486,00 | 240.761.486,00 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 37.921 | 37.921 | 4.232,682341 | 4.232,682341 | 160.507.547,05 | 160.507.547,05 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 158.996 | 158.996 | 807,608239 | 807,608239 | 128.406.479,57 | 128.406.479,57 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| TFSU13 — Debênture Telecom Fibra Sul S.A. — CDI + 1,60% | 197.335 | 197.335 | 976,053473 | 976,053473 | 192.609.512,09 | 192.609.512,09 | 0,00 | ANBIMA — taxa indicativa D |
| ZFRT3 — Zafira Frigoríficos S.A. ON | 1.118.680 | 1.118.680 | 71,74 | 71,74 | 80.254.103,20 | 80.254.103,20 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 1.753.038 | 1.753.038 | 45,78 | 45,78 | 80.254.079,64 | 80.254.079,64 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 1.113.867 | 1.113.867 | 72,05 | 72,05 | 80.254.117,35 | 80.254.117,35 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 1.524.829.103,49 | 1.524.829.103,49 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 9.863.881,14 | 9.863.881,14 |
| TED recebida — aplicação Cotista 6090 (09:31) | 5.838.399,60 | 5.838.399,60 |
| **Saldo final** | 15.702.280,74 | 15.702.280,74 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 5.838.399,60 | 5.838.399,60 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 37.049,02 | 37.049,02 | 6.101,82 | 6.101,82 | 0,00 | 0,00 | 43.150,84 | 43.150,84 | 0,00 |
| TXGES — Taxa de gestão a pagar | 466.716,73 | 466.716,73 | 78.103,26 | 78.103,26 | 0,00 | 0,00 | 544.819,99 | 544.819,99 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 11.256,83 | 11.256,83 | 1.830,55 | 1.830,55 | 0,00 | 0,00 | 13.087,38 | 13.087,38 | 0,00 |
| AUDIT — Auditoria independente a pagar | 13.242,06 | 13.242,06 | 281,75 | 281,75 | 0,00 | 0,00 | 13.523,81 | 13.523,81 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 142,86 | 142,86 | 23,81 | 23,81 | 0,00 | 0,00 | 166,67 | 166,67 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 1.542,86 | 1.542,86 | 257,14 | 257,14 | 0,00 | 0,00 | 1.800,00 | 1.800,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 1.393,55 | 1.393,55 | 232,26 | 232,26 | 0,00 | 0,00 | 1.625,81 | 1.625,81 | 0,00 |
| PERF — Taxa de performance a pagar | 9.628.164,40 | 9.628.164,40 | 0,00 | -2.245.095,63 | 0,00 | 0,00 | 9.628.164,40 | 7.383.068,77 | -2.245.095,63 |
| **Total** |  |  |  |  |  |  | 10.246.338,90 | 8.001.243,27 | -2.245.095,63 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,10% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 6.101,82 · Beta: [base: PL do dia útil anterior] 0,10% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 6.101,82
- **TXGES** — Alfa: [base: PL do dia útil anterior] 1,28% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 78.103,26 · Beta: [base: PL do dia útil anterior] 1,28% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 78.103,26
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 1.830,55 · Beta: [base: PL do dia útil anterior] 0,03% a.a. sobre R$ 1.537.657.979,61 ÷ 252 (linear, dias úteis) = R$ 1.830,55
- **AUDIT** — Alfa: R$ 71.000,00 (anual) ÷ 252 d.u. = R$ 281,75 · Beta: R$ 71.000,00 (anual) ÷ 252 d.u. = R$ 281,75
- **ANBIMA** — Alfa: R$ 500,00 (mensal) ÷ 21 d.u. = R$ 23,81 · Beta: R$ 500,00 (mensal) ÷ 21 d.u. = R$ 23,81
- **SELIC** — Alfa: R$ 5.400,00 (mensal) ÷ 21 d.u. = R$ 257,14 · Beta: R$ 5.400,00 (mensal) ÷ 21 d.u. = R$ 257,14
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 62 d.u. = R$ 232,26 · Beta: R$ 14.400,00 (trimestral) ÷ 62 d.u. = R$ 232,26
- **PERF** — Alfa: Provisão mantida igual à do dia anterior (sem recálculo no dia) · Beta: 20% × max(0; cota bruta 6,61777974 − cota de referência 6,01388028 × fator 100% do CDI 1,07393761 = 6,45853221) × 231.811.101,42397407 cotas = R$ 7.383.068,77

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista 6090 | R$ 5.838.399,60 | 09:31 | 09/10/2026 | 09/10/2026 | 09/10/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista 6097 | 430.753,53294706 cotas |  | 14/09/2026 | 09/10/2026 | 14/10/2026 | sim | sim |  |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 1.524.829.103,49 | 1.524.829.103,49 | 0,00 |
| Caixa | 15.702.280,74 | 15.702.280,74 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 5.838.399,60 | 5.838.399,60 | 0,00 |
| Provisões | 10.246.338,90 | 8.001.243,27 | -2.245.095,63 |
| PL base da cota | 1.524.446.645,73 | 1.526.691.741,36 | 2.245.095,63 |
| Cota (8 casas) | 6,57624521 | 6,58593023 | 0,00968502 |
| Aplicações convertidas | 5.838.399,60 | 5.838.399,60 | 0,00 |
| Cotas emitidas | 887.801,38415793 | 886.495,81700776 | -1.305,56715017 |
| Cotas resgatadas | 430.753,53294706 | 430.753,53294706 | 0,00000000 |
| Valor dos resgates cotizados | 2.832.740,86 | 2.836.912,71 | 4.171,85 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 232.268.149,27518493 | 232.266.843,70803475 | -1.305,56715018 |
| PL final | 1.527.452.304,11 | 1.529.693.227,40 | 2.240.923,29 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** APROVADO (com ressalva)

**Resumo:** Aprovar com ressalva: Performance não revertida.

**Dificuldade:** media · **Cenários:** performance_sem_reversao

### Achado 1: Performance não revertida

- **Gravidade:** ressalva · **Dimensões:** provisoes
- **Lado correto:** Beta · **Quem ajusta:** Alfa
- **Causa raiz:** Alfa não recalculou a performance hoje e manteve o saldo de D−1. O excesso sobre o benchmark caiu, então parte da provisão deveria ter sido revertida.
- **Onde olhar:** Provisões — PERF; Regulamento — performance (reversão); Informações de mercado — fator do benchmark
- **Raciocínio do analista:**
  1. A provisão de performance do Alfa está igual à de ontem; a do Beta caiu (apropriação negativa).
  2. Recalculei: 20% × (cota bruta − cota de referência × fator do benchmark) × cotas bate com o lado que reverteu.
  3. O regulamento prevê a reversão quando o excesso diminui. Manter a provisão subestima a cota de quem resgata hoje.
- **Ação:** Alfa deve recalcular a performance de D (com reversão) e reprocessar a cota.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Beta |
| caixa | ambos |
| provisoes | Beta |

### Valores corretos após os ajustes

| Item | Valor |
|---|---|
| Cota | 6,58593023 |
| Quantidade final de cotas | 232.266.843,70803475 |
| PL final | R$ 1.529.693.227,40 |
| Caixa | R$ 15.702.280,74 |
| Total de provisões | R$ 8.001.243,27 |
