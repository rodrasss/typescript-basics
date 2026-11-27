# Caso caso-052 — Tamanduá III FIE FIF Previdenciário Multimercado

> **Data-base (D):** 06/03/2026 (sexta-feira) · **D−1:** 05/03/2026 · **Fundo:** FND-0052

## 1. O fundo

Quem acompanha a Remanso Asset (Curitiba/PR) conhece o Tamanduá III FIE FIF Previdenciário Multimercado: a casa é uma gestora de previdência ligada a uma seguradora de médio porte. Criado em 06/09/2017, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos PGBL/VGBL de uma seguradora (cotista único: a seguradora, representando ~35 mil participantes). Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e adaptou o regulamento à Resolução CVM 175 em 2025, separando taxa de administração e taxa de gestão. O gestor responsável é Rodrigo, e quem cuida da validação do fundo é Diego. Sobre a rotina: a gestora costuma mandar boletas depois das 17h, especialmente às sextas-feiras; as reuniões do comitê de investimentos acontecem na primeira terça-feira de cada mês. As taxas do fundo foram alteradas recentemente em assembleia. No fechamento de ontem (05/03/2026) o fundo tinha PL de R$ 1.386.950.502,60, cota de 5,99008134 e 231.541.179,75449744 cotas. Hoje, sexta-feira, 06/03/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 1.386.950.502,60 |
| Cota em D−1 | 5,99008134 |
| Quantidade de cotas em D−1 | 231.541.179,75449744 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/09/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,180% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,720% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,010% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente por fator exponencial ((1 + taxa)^(1/252) − 1), base 252 dias úteis; paga mensalmente, até o 5º dia útil do mês subsequente.

**Taxa de performance**

- 20% sobre o que exceder 100% do CDI; semestral (apuração em junho e dezembro; pagamento até o 5º dia útil seguinte).
- Há linha d’água: a cota de referência é a cota da última cobrança efetiva de performance (ou a cota inicial), corrigida pelo benchmark.
- Provisão diária = 20% × max(0; cota bruta de performance − cota de referência corrigida pelo benchmark) × quantidade de cotas. A cota bruta de performance é o PL antes da provisão de performance (já deduzidas as demais provisões), em reais e centavos, dividido pela quantidade de cotas existentes antes das movimentações do dia. A provisão é revertida quando o excesso diminui.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 30.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 500,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 3.600,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 1.386.014.936,99. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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

- Performance: cota de referência vigente = 5,80581433 (cota da última cobrança efetiva, em 31/12/2025).

**Alterações recentes**

- Assembleia de 03/02/2026 aprovou a redução da taxa de gestão de 1,040% a.a. para 0,720% a.a., com vigência a partir de 06/03/2026 (inclusive).

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.148,847984 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.392,788009 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.150,890595 |  |
| VCLA12 | ANBIMA — PU pela taxa indicativa de D | 1.159,858965 |  |
| VJNR3 | B3 — preço de fechamento de D | 63,30 |  |
| YRBQ3 | B3 — preço de fechamento de D | 49,94 |  |
| WJMA4 | B3 — preço de fechamento de D | 44,73 |  |

**Benchmark**

- Fator acumulado do 100% do CDI de 31/12/2025 até 06/03/2026: 1,02337659

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,98784191 | 5,98778158 | -0,00006033 |
| Quantidade final de cotas | 232.170.982,06507820 | 232.170.995,54595098 | 13,48087278 |
| PL final | R$ 1.390.203.136,70 | R$ 1.390.189.210,54 | R$ -13.926,16 |
| Caixa | R$ 22.097.334,58 | R$ 22.238.334,58 | R$ 141.000,00 |
| Total de provisões | R$ 4.260.769,99 | R$ 4.274.737,24 | R$ 13.967,25 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 27.945 | 27.945 | 18.148,847984 | 18.148,847984 | 507.169.556,91 | 507.169.556,91 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 49.481 | 49.481 | 4.392,788009 | 4.392,788009 | 217.359.543,47 | 217.359.543,47 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 34.910 | 34.910 | 4.150,890595 | 4.150,890595 | 144.907.590,67 | 144.907.590,67 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 143.120 | 143.120 | 809,980561 | 809,980561 | 115.924.417,89 | 115.924.417,89 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| VCLA12 — Debênture Varejo Casa & Lar S.A. — CDI + 2,75% | 149.921 | 149.921 | 1.159,858965 | 1.159,858965 | 173.887.215,89 | 173.887.215,89 | 0,00 | ANBIMA — taxa indicativa D |
| VJNR3 — Vajanra Energia S.A. ON | 1.144.596 | 1.144.596 | 63,30 | 63,30 | 72.452.926,80 | 72.452.926,80 | 0,00 | B3 — preço de fechamento D |
| YRBQ3 — Yrubá Químicos S.A. ON | 1.450.799 | 1.450.799 | 49,94 | 49,94 | 72.452.902,06 | 72.452.902,06 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 1.619.783 | 1.619.783 | 44,73 | 44,73 | 72.452.893,59 | 72.452.893,59 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 1.376.607.047,28 | 1.376.607.047,28 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 14.085.703,18 | 14.085.703,18 |
| TED recebida — aplicação [APL-1] Cotista único (10:14) | 1.465.978,64 | 1.465.978,64 |
| TED recebida — aplicação [APL-2] Cotista único (12:28) | 2.911.096,93 | 2.911.096,93 |
| TED recebida — aplicação [APL-3] Cotista único (10:18) | 3.634.555,83 | 3.634.555,83 |
| TED recebida — remetente não identificado (CPF/CNPJ sem cadastro de cotista) | — | 141.000,00 |
| **Saldo final** | 22.097.334,58 | 22.238.334,58 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| APLIC A CONVERTER — Aplicações recebidas no dia, a converter em cotas | 8.011.631,40 | 8.011.631,40 |
| RECURSOS A IDENTIFICAR — Créditos recebidos sem identificação (a identificar/devolver) | — | 141.000,00 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 220.386,64 | 220.386,64 | 9.897,92 | 9.897,92 | 0,00 | 0,00 | 230.284,56 | 230.284,56 | 0,00 |
| TXGES — Taxa de gestão a pagar | 1.261.963,51 | 1.261.963,51 | 39.485,74 | 56.944,80 | 0,00 | 0,00 | 1.301.449,25 | 1.318.908,31 | 17.459,06 |
| TXCUS — Taxa máxima de custódia a pagar | 12.004,39 | 12.004,39 | 550,35 | 550,35 | 0,00 | 0,00 | 12.554,74 | 12.554,74 | 0,00 |
| AUDIT — Auditoria independente a pagar | 24.523,81 | 24.523,81 | 119,05 | 119,05 | 0,00 | 0,00 | 24.642,86 | 24.642,86 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 90,91 | 90,91 | 22,73 | 22,73 | 0,00 | 0,00 | 113,64 | 113,64 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 654,55 | 654,55 | 163,64 | 163,64 | 0,00 | 0,00 | 818,19 | 818,19 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 10.150,82 | 10.150,82 | 236,07 | 236,07 | 0,00 | 0,00 | 10.386,89 | 10.386,89 | 0,00 |
| PERF — Taxa de performance a pagar | 2.990.723,84 | 2.990.723,84 | -310.203,98 | -313.695,79 | 0,00 | 0,00 | 2.680.519,86 | 2.677.028,05 | -3.491,81 |
| **Total** |  |  |  |  |  |  | 4.260.769,99 | 4.274.737,24 | 13.967,25 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,18% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 9.897,92 · Beta: [base: PL do dia útil anterior] 0,18% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 9.897,92
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,72% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 39.485,74 · Beta: [base: PL do dia útil anterior] 1,04% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 56.944,80
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 550,35 · Beta: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 1.386.950.502,60 fator exponencial (1+taxa)^(1/252) − 1 = R$ 550,35
- **AUDIT** — Alfa: R$ 30.000,00 (anual) ÷ 252 d.u. = R$ 119,05 · Beta: R$ 30.000,00 (anual) ÷ 252 d.u. = R$ 119,05
- **ANBIMA** — Alfa: R$ 500,00 (mensal) ÷ 22 d.u. = R$ 22,73 · Beta: R$ 500,00 (mensal) ÷ 22 d.u. = R$ 22,73
- **SELIC** — Alfa: R$ 3.600,00 (mensal) ÷ 22 d.u. = R$ 163,64 · Beta: R$ 3.600,00 (mensal) ÷ 22 d.u. = R$ 163,64
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07 · Beta: R$ 14.400,00 (trimestral) ÷ 61 d.u. = R$ 236,07
- **PERF** — Alfa: 20% × max(0; cota bruta 5,99941877 − cota de referência 5,80581433 × fator 100% do CDI 1,02337659 = 5,94153447) × 231.541.179,75449744 cotas = R$ 2.680.519,86 · Beta: 20% × max(0; cota bruta 5,99934337 − cota de referência 5,80581433 × fator 100% do CDI 1,02337659 = 5,94153447) × 231.541.179,75449744 cotas = R$ 2.677.028,05

### 5.7 Passivo (aplicações, resgates e demais movimentos)

_Aplicações e resgates que cotizam hoje alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; seus efeitos em caixa e em "a pagar" aparecem depois do fechamento (resgate com liquidação no mesmo dia da cotização: a saída de caixa ocorre depois do fechamento da cota)._

| ID | Tipo | Cotista | Valor / cotas | Crédito às | Solicitado em | Cotização | Liquidação | Converte/cotiza hoje? Alfa | Converte/cotiza hoje? Beta | Observação |
|---|---|---|---|---|---|---|---|---|---|---|
| APL-1 | aplicacao | Cotista único | R$ 1.465.978,64 | 10:14 | 06/03/2026 | 06/03/2026 | 06/03/2026 | sim | sim |  |
| APL-2 | aplicacao | Cotista único | R$ 2.911.096,93 | 12:28 | 06/03/2026 | 06/03/2026 | 06/03/2026 | sim | sim |  |
| APL-3 | aplicacao | Cotista único | R$ 3.634.555,83 | 10:18 | 06/03/2026 | 06/03/2026 | 06/03/2026 | sim | sim |  |
| RSG-1 | resgate | Cotista único | 708.180,80928418 cotas |  | 05/03/2026 | 06/03/2026 | 09/03/2026 | sim | sim |  |

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 1.376.607.047,28 | 1.376.607.047,28 | 0,00 |
| Caixa | 22.097.334,58 | 22.238.334,58 | 141.000,00 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 8.011.631,40 | 8.152.631,40 | 141.000,00 |
| Provisões | 4.260.769,99 | 4.274.737,24 | 13.967,25 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 1.389.162.975,83 | 1.389.162.975,83 | 0,00 |
| PL base da cota | 1.386.431.980,47 | 1.386.418.013,22 | -13.967,25 |
| Cota (8 casas) | 5,98784191 | 5,98778158 | -0,00006033 |
| Aplicações convertidas | 8.011.631,40 | 8.011.631,40 | 0,00 |
| Cotas emitidas | 1.337.983,11986495 | 1.337.996,60073772 | 13,48087277 |
| Cotas resgatadas | 708.180,80928418 | 708.180,80928418 | 0,00000000 |
| Valor dos resgates cotizados | 4.240.474,73 | 4.240.432,01 | -42,72 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 232.170.982,06507820 | 232.170.995,54595098 | 13,48087278 |
| PL final | 1.390.203.136,70 | 1.390.189.210,54 | -13.926,16 |

---

## GABARITO (não faz parte da entrada)

**Parecer:** REPROVADO

**Resumo:** Reprovar até o ajuste: taxa de gestão com percentual antigo; TED sem identificação na conta do fundo.

**Dificuldade:** dificil · **Cenários:** taxa_reduzida_nao_aplicada, credito_nao_identificado

### Achado 1: taxa de gestão com percentual antigo

- **Gravidade:** erro · **Dimensões:** provisoes
- **Lado correto:** Alfa · **Quem ajusta:** Beta
- **Causa raiz:** Beta continuou apropriando a taxa de gestão a 1,040% a.a.; desde hoje o regulamento prevê 0,720% a.a.
- **Onde olhar:** Provisões — TXGES (apropriação do dia); Regulamento — alterações recentes
- **Raciocínio do analista:**
  1. O saldo anterior da taxa de gestão bate; a diferença está só na apropriação de hoje.
  2. Recalculei pelo regulamento: PL de D−1 R$ 1.386.950.502,60 × 0,720% pelo método do regulamento dá o valor do Alfa. O Beta usou 1,040%, que é a taxa de antes da assembleia.
  3. A redução vale a partir de hoje, inclusive. Este é o primeiro dia sob a nova taxa, por isso o saldo anterior ainda bate.
- **Ação:** Beta deve atualizar o cadastro da taxa de gestão para 0,720% a.a. com vigência em 06/03/2026 e reprocessar.

### Achado 2: TED sem identificação na conta do fundo

- **Gravidade:** pendencia · **Dimensões:** caixa
- **Lado correto:** indeterminado · **Quem ajusta:** Passivo/distribuidor (identificação) e Alfa (registro)
- **Causa raiz:** Entrou uma TED de R$ 141.000,00 de remetente sem cadastro de cotista. O Beta registrou como "recursos a identificar"; o Alfa não registrou. A natureza do crédito é desconhecida.
- **Onde olhar:** Caixa — lançamentos; Valores a pagar — recursos a identificar; Movimentações de passivo (nenhuma boleta correspondente)
- **Raciocínio do analista:**
  1. Caixa do Beta R$ 141.000,00 maior que o do Alfa; PL igual, porque o Beta pôs o valor em uma conta transitória do passivo.
  2. Não há boleta de aplicação com esse valor nem cotista com esse documento. Pode ser aplicação sem boleta, devolução de algum prestador ou erro de terceiro.
  3. O tratamento do Beta (transitória, sem efeito no PL) é prudente. Converter em cotas ou reconhecer como receita sem saber a origem seria erro.
- **Ação:** Acionar passivo/distribuidor para identificar o remetente. Se ninguém reclamar no prazo, devolver ao remetente. O Alfa deve registrar a transitória. Cota pode sair; o caixa fica pendente até a identificação.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | Beta |
| provisoes | Alfa |

### Valores corretos

Indefinidos: dependem de uma decisão externa (comitê, identificação do remetente ou aprovação formal).

### Armadilhas deste caso

- A mudança vale a partir de D (inclusive): o saldo anterior ainda bate, só a apropriação do dia diverge.
- Sem identificação do remetente não se converte em cotas nem se reconhece como receita.
