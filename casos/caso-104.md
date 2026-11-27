# Caso caso-104 — Corrupião Prime FIE FIF Previdenciário Multimercado

> **Data-base (D):** 22/04/2026 (quarta-feira) · **D−1:** 20/04/2026 · **Fundo:** FND-0104

## 1. O fundo

Sob a gestão da Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte (Curitiba/PR), o Corrupião Prime FIE FIF Previdenciário Multimercado é um dos fundos que mais exigem atenção na rotina de validação. Criado em 03/07/2023, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo mudou a política de investimento em 2025 para permitir derivativos com finalidade de hedge e trocou de gestor responsável em 2023 depois da saída do fundador. O gestor responsável é Isadora, e quem cuida da validação do fundo é Pedro. Sobre a rotina: o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota; as reuniões do comitê de investimentos acontecem na primeira terça-feira de cada mês. No fechamento de ontem (20/04/2026) o fundo tinha PL de R$ 356.591.173,56, cota de 5,05945358 e 70.480.174,96764694 cotas. Hoje, quarta-feira, 22/04/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 356.591.173,56 |
| Cota em D−1 | 5,05945358 |
| Quantidade de cotas em D−1 | 70.480.174,96764694 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/05/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,060% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,760% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,020% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 45.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 800,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 3.100,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 356.413.288,38. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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

**Regras específicas deste fundo**

- Performance: cota de referência vigente = 4,85714301 (cota da última cobrança efetiva, em 31/12/2025).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.179,414906 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.326,267103 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.206,598010 |  |
| VCLA12 | ANBIMA — PU pela taxa indicativa de D | 1.006,714544 |  |
| VJNR3 | B3 — preço de fechamento de D | 84,83 |  |
| HZTA3 | B3 — preço de fechamento de D | 88,93 |  |
| ZMBV3 | B3 — preço de fechamento de D | 12,38 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 22/04/2026: 1,01351672

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,02695076 | 5,03123362 | 0,00428286 |
| Quantidade final de cotas | 70.480.174,96764694 | 70.480.174,96764694 | 0,00000000 |
| PL final | R$ 354.300.369,12 | R$ 354.602.225,84 | R$ 301.856,72 |
| Caixa | R$ 563.004,24 | R$ 563.004,24 | R$ 0,00 |
| Total de provisões | R$ 2.426.263,56 | R$ 2.124.406,35 | R$ -301.857,21 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 7.218 | 7.218 | 18.179,414906 | 18.179,414906 | 131.219.016,79 | 131.219.016,79 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 12.999 | 12.999 | 4.326,267103 | 4.326,267103 | 56.237.146,07 | 56.237.146,07 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 8.912 | 8.912 | 4.206,598010 | 4.206,598010 | 37.489.201,47 | 37.489.201,47 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 37.131 | 37.131 | 807,749748 | 807,749748 | 29.992.555,89 | 29.992.555,89 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| VCLA12 — Debênture Varejo Casa & Lar S.A. — CDI + 2,75% | 44.689 | 44.689 | 1.006,714544 | 1.006,714544 | 44.989.066,26 | 44.989.066,26 | 0,00 | ANBIMA — taxa indicativa D |
| VJNR3 — Vajanra Energia S.A. ON | 220.978 | 220.978 | 84,83 | 84,83 | 18.745.563,74 | 18.745.563,74 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 210.790 | 210.790 | 88,93 | 88,93 | 18.745.554,70 | 18.745.554,70 | 0,00 | B3 — preço de fechamento D |
| ZMBV3 — Zimbro Varejo S.A. ON | 1.514.178 | 1.514.178 | 12,38 | 12,38 | 18.745.523,64 | 18.745.523,64 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 356.163.628,56 | 356.163.628,56 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 1.423.574,01 | 1.423.574,01 |
| Pagamento de resgate — Cotista 3843 (cotizado em 17/04/2026) | -860.569,77 | -860.569,77 |
| **Saldo final** | 563.004,24 | 563.004,24 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

Nenhum item.

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 10.860,61 | 10.860,61 | 849,03 | 849,03 | 0,00 | 0,00 | 11.709,64 | 11.709,64 | 0,00 |
| TXGES — Taxa de gestão a pagar | 142.919,48 | 142.919,48 | 10.754,34 | 10.754,34 | 0,00 | 0,00 | 153.673,82 | 153.673,82 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 3.742,16 | 3.742,16 | 283,01 | 283,01 | 0,00 | 0,00 | 4.025,17 | 4.025,17 | 0,00 |
| AUDIT — Auditoria independente a pagar | 38.928,57 | 38.928,57 | 178,57 | 178,57 | 0,00 | 0,00 | 39.107,14 | 39.107,14 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 520,00 | 520,00 | 40,00 | 40,00 | 0,00 | 0,00 | 560,00 | 560,00 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 2.015,00 | 2.015,00 | 155,00 | 155,00 | 0,00 | 0,00 | 2.170,00 | 2.170,00 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 2.301,64 | 2.301,64 | 177,05 | 177,05 | 0,00 | 0,00 | 2.478,69 | 2.478,69 | 0,00 |
| PERF — Taxa de performance a pagar | 2.212.539,10 | 2.212.539,10 | 0,00 | -301.857,21 | 0,00 | 0,00 | 2.212.539,10 | 1.910.681,89 | -301.857,21 |
| **Total** |  |  |  |  |  |  | 2.426.263,56 | 2.124.406,35 | -301.857,21 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 849,03 · Beta: [base: PL do dia útil anterior] 0,06% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 849,03
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,76% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 10.754,34 · Beta: [base: PL do dia útil anterior] 0,76% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 10.754,34
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 283,01 · Beta: [base: PL do dia útil anterior] 0,02% a.a. sobre R$ 356.591.173,56 ÷ 252 (linear, dias úteis) = R$ 283,01
- **AUDIT** — Alfa: R$ 45.000,00 (anual) ÷ 252 d.u. = R$ 178,57 · Beta: R$ 45.000,00 (anual) ÷ 252 d.u. = R$ 178,57
- **ANBIMA** — Alfa: R$ 800,00 (mensal) ÷ 20 d.u. = R$ 40,00 · Beta: R$ 800,00 (mensal) ÷ 20 d.u. = R$ 40,00
- **SELIC** — Alfa: R$ 3.100,00 (mensal) ÷ 20 d.u. = R$ 155,00 · Beta: R$ 3.100,00 (mensal) ÷ 20 d.u. = R$ 155,00
- **CVM** — Alfa: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05 · Beta: R$ 10.800,00 (trimestral) ÷ 61 d.u. = R$ 177,05
- **PERF** — Alfa: Provisão mantida igual à do dia anterior (sem recálculo no dia) · Beta: 20% × max(0; cota bruta 5,05834312 − cota de referência 4,85714301 × fator 100% do CDI 1,01351672 = 4,92279565) × 70.480.174,96764694 cotas = R$ 1.910.681,89

### 5.7 Passivo (aplicações, resgates e demais movimentos)

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| LIQ-1 | resgate | Cotista 3843 | 170.576,44137092 cotas (R$ 860.569,77) |  | 18/03/2026 | 17/04/2026 | 22/04/2026 | não | não | cotizado em 17/04/2026 pela cota de 5,04506816; liquidação financeira hoje |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 356.163.628,56 | 356.163.628,56 | 0,00 |
| Caixa | 563.004,24 | 563.004,24 | 0,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 0,00 | 0,00 | 0,00 |
| Provisões | 2.426.263,56 | 2.124.406,35 | -301.857,21 |
| PL base da cota | 354.300.369,24 | 354.602.226,45 | 301.857,21 |
| Cota (8 casas) | 5,02695076 | 5,03123362 | 0,00428286 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 70.480.174,96764694 | 70.480.174,96764694 | 0,00000000 |
| PL final | 354.300.369,12 | 354.602.225,84 | 301.856,72 |

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
| Cota | 5,03123362 |
| Quantidade final de cotas | 70.480.174,96764694 |
| PL final | R$ 354.602.225,84 |
| Caixa | R$ 563.004,24 |
| Total de provisões | R$ 2.124.406,35 |
