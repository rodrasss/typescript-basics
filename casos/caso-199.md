# Caso caso-199 — Sanhaço II FIE FIF Previdenciário Multimercado

> **Data-base (D):** 20/07/2026 (segunda-feira) · **D−1:** 17/07/2026 · **Fundo:** FND-0199

## 1. O fundo

Sob a gestão da Remanso Asset, gestora de previdência ligada a uma seguradora de médio porte (Curitiba/PR), o Sanhaço II FIE FIF Previdenciário Multimercado é um dos fundos que mais exigem atenção na rotina de validação. Criado em 07/04/2014, atende planos de previdência de uma seguradora, com fluxo previsível de aportes. Público-alvo: exclusivo para planos pgbl/vgbl de seguradora. Hoje seus cotistas são planos VGBL de uma seguradora regional (cotista único). Ao longo da vida, o fundo migrou de controladoria em 2024, e os primeiros meses tiveram divergências de parametrização e teve um evento de crédito em 2023 em um dos emissores da carteira, recuperado em 2025. O gestor responsável é Sofia, e quem cuida da validação do fundo é Patrícia. Sobre a rotina: a gestora publica uma carta mensal aos cotistas até o 5º dia útil; o fundo tem histórico de divergências pequenas de arredondamento que nunca chegaram a impactar a cota. Já entrou dinheiro na conta do fundo sem identificação do remetente. As taxas do fundo foram alteradas recentemente em assembleia. A área de risco pediu atenção redobrada ao fundo depois de um apontamento de auditoria em 2025 (já regularizado). No fechamento de ontem (17/07/2026) o fundo tinha PL de R$ 1.850.731.758,08, cota de 5,22320078 e 354.329.047,65308710 cotas. Hoje, segunda-feira, 20/07/2026, é a data-base da validação.

| Campo | Valor |
|---|---|
| Tipo | Previdência (FIE — PGBL/VGBL) |
| Classe | Classe Previdenciária |
| Condomínio | aberto |
| Gestora | Remanso Asset (Curitiba/PR) |
| PL em D−1 | R$ 1.850.731.758,08 |
| Cota em D−1 | 5,22320078 |
| Quantidade de cotas em D−1 | 354.329.047,65308710 |

## 2. Regulamento (extrato simulado)

**Vigência:** 01/06/2025 (adaptado à Resolução CVM 175)

**Taxas**

- Taxa de administração: 0,190% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa de gestão: 0,700% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.
- Taxa máxima de custódia: 0,010% a.a., calculada sobre o PL do dia útil anterior, apropriada diariamente à razão de 1/252 (dias úteis), de forma linear; paga mensalmente, até o 5º dia útil do mês subsequente.

**Despesas fixas (provisionadas diariamente por 1/252 do valor anual; mensais por 1/dias úteis do mês)**

- Auditoria independente: R$ 29.000,00 (anual) — contrato anual; provisão diária por 1/252
- Taxa ANBIMA (convênio de autorregulação): R$ 1.200,00 (mensal)
- Custódia SELIC/B3 (estimativa mensal): R$ 900,00 (mensal)

**Taxa de fiscalização da CVM (trimestral; faixa pelo PL de referência = PL do último dia útil do trimestre anterior)**

- até R$ 20.000.000,00: R$ 2.100,00 por trimestre
- até R$ 50.000.000,00: R$ 3.600,00 por trimestre
- até R$ 100.000.000,00: R$ 5.400,00 por trimestre
- até R$ 300.000.000,00: R$ 7.800,00 por trimestre
- até R$ 1.000.000.000,00: R$ 10.800,00 por trimestre
- acima de R$ 1.000.000.000,00: R$ 14.400,00 por trimestre
- PL de referência deste fundo no trimestre: R$ 1.767.420.551,60. Provisão diária = valor do trimestre ÷ dias úteis do trimestre.

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
- Resgate: cotização em D+1 dia útil após o pedido, pela cota de fechamento da data de cotização; liquidação financeira em D+1 dia útil após a cotização.
- Cota de fechamento = PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa (TRUNCAMENTO).
- Tributação: Previdência: tributação no plano (seguradora); sem come-cotas

**Precificação dos ativos**

- Manual de marcação a mercado do administrador (versão simulada vigente).
- Títulos públicos federais: PU pela taxa indicativa ANBIMA de D.
- Operações compromissadas: PU de ida acrescido da remuneração pactuada.
- Debêntures: taxa indicativa ANBIMA de D.
- Ações: preço de fechamento da B3 em D.

## 3. Informações de mercado do dia

- CDI: 14,15% a.a.
- Calendário: 20/07/2026 é o 14º dia útil de julho (o mês tem 23 dias úteis) e o 14º dia útil do trimestre (o trimestre tem 65).

**Referências de preço**

| Ativo | Fonte | Valor | Observação |
|---|---|---|---|
| LFT 01/03/2029 | ANBIMA — PU pela taxa indicativa de D | 18.375,483697 |  |
| NTN-B 15/08/2030 | ANBIMA — PU pela taxa indicativa de D | 4.473,448902 |  |
| NTN-B 15/05/2035 | ANBIMA — PU pela taxa indicativa de D | 4.146,553175 |  |
| TFSU13 | ANBIMA — PU pela taxa indicativa de D | 995,919496 |  |
| QPLN3 | B3 — preço de fechamento de D | 75,96 |  |
| WJMA4 | B3 — preço de fechamento de D | 52,77 |  |
| HZTA3 | B3 — preço de fechamento de D | 16,16 |  |

## 4. Comunicações recebidas hoje

Nenhuma comunicação relevante recebida.


## 5. Batimento Alfa × Beta

_Alfa = posição do controle interno da casa. Beta = posição recebida do administrador/custodiante._

### 5.1 Resumo

| Validação | Alfa | Beta | Diferença (Beta − Alfa) |
|---|---|---|---|
| Cota de fechamento | 5,21544582 | 5,21544558 | -0,00000024 |
| Quantidade final de cotas | 354.329.047,65308710 | 354.329.047,65308710 | 0,00000000 |
| PL final | R$ 1.847.983.950,49 | R$ 1.847.983.865,45 | R$ -85,04 |
| Caixa | R$ 7.603.214,81 | R$ 7.655.703,79 | R$ 52.488,98 |
| Total de provisões | R$ 964.952,00 | R$ 964.952,00 | R$ 0,00 |

### 5.2 Carteira

| Ativo | Qtd Alfa | Qtd Beta | PU Alfa | PU Beta | Valor Alfa | Valor Beta | Δ valor | Fonte do preço |
|---|---|---|---|---|---|---|---|---|
| LFT 01/03/2029 — Letra Financeira do Tesouro — venc. 01/03/2029 | 36.918 | 36.918 | 18.375,483697 | 18.375,483697 | 678.386.107,13 | 678.386.107,13 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/08/2030 — Nota do Tesouro Nacional série B — venc. 15/08/2030 | 64.992 | 64.992 | 4.473,448902 | 4.473,448902 | 290.738.391,04 | 290.738.391,04 | 0,00 | ANBIMA — taxa indicativa D |
| NTN-B 15/05/2035 — Nota do Tesouro Nacional série B — venc. 15/05/2035 | 46.744 | 46.744 | 4.146,553175 | 4.146,553175 | 193.826.481,61 | 193.826.481,61 | 0,00 | ANBIMA — taxa indicativa D |
| COMPROMISSADA OVER — Operação compromissada over — lastro LTN 01/01/2028 (volta D+1) | 189.192 | 189.192 | 819,601552 | 819,601552 | 155.062.056,83 | 155.062.056,83 | 0,00 | PU de ida + remuneração pactuada (taxa over) |
| TFSU13 — Debênture Telecom Fibra Sul S.A. — CDI + 1,60% | 233.545 | 233.545 | 995,919496 | 995,919496 | 232.592.018,69 | 232.592.018,69 | 0,00 | ANBIMA — taxa indicativa D |
| QPLN3 — Quiplan Saúde S.A. ON | 1.275.850 | 1.275.850 | 75,96 | 75,96 | 96.913.566,00 | 96.913.566,00 | 0,00 | B3 — preço de fechamento D |
| WJMA4 — Banco Wajumá S.A. PN | 1.836.527 | 1.836.527 | 52,77 | 52,77 | 96.913.529,79 | 96.913.529,79 | 0,00 | B3 — preço de fechamento D |
| HZTA3 — Hortaz Tecnologia S.A. ON | 5.997.125 | 5.997.125 | 16,16 | 16,16 | 96.913.540,00 | 96.913.540,00 | 0,00 | B3 — preço de fechamento D |
| **Total** |  |  |  |  | 1.841.345.691,09 | 1.841.345.691,09 | 0,00 |  |

### 5.3 Caixa

| Lançamento | Alfa | Beta |
|---|---|---|
| Saldo inicial (D−1) | 7.603.214,81 | 7.603.214,81 |
| TED recebida — remetente não identificado (CPF/CNPJ sem cadastro de cotista) | — | 52.575,30 |
| Débito de tarifa — pacote de serviços PJ | — | -86,32 |
| **Saldo final** | 7.603.214,81 | 7.655.703,79 |

### 5.4 Valores a receber

Nenhum item.

### 5.5 Valores a pagar

| Item | Alfa | Beta |
|---|---|---|
| RECURSOS A IDENTIFICAR — Créditos recebidos sem identificação (a identificar/devolver) | — | 52.575,30 |

### 5.6 Provisões

| Provisão | Saldo anterior Alfa | Saldo anterior Beta | Apropriação Alfa | Apropriação Beta | Pagamento Alfa | Pagamento Beta | Saldo atual Alfa | Saldo atual Beta | Δ saldo |
|---|---|---|---|---|---|---|---|---|---|
| TXADM — Taxa de administração a pagar | 184.378,64 | 184.378,64 | 13.953,93 | 13.953,93 | 0,00 | 0,00 | 198.332,57 | 198.332,57 | 0,00 |
| TXGES — Taxa de gestão a pagar | 680.135,47 | 680.135,47 | 51.409,22 | 51.409,22 | 0,00 | 0,00 | 731.544,69 | 731.544,69 | 0,00 |
| TXCUS — Taxa máxima de custódia a pagar | 9.591,47 | 9.591,47 | 734,42 | 734,42 | 0,00 | 0,00 | 10.325,89 | 10.325,89 | 0,00 |
| AUDIT — Auditoria independente a pagar | 20.253,97 | 20.253,97 | 115,08 | 115,08 | 0,00 | 0,00 | 20.369,05 | 20.369,05 | 0,00 |
| ANBIMA — Taxa ANBIMA (convênio de autorregulação) a pagar | 678,26 | 678,26 | 52,17 | 52,17 | 0,00 | 0,00 | 730,43 | 730,43 | 0,00 |
| SELIC — Custódia SELIC/B3 (estimativa mensal) a pagar | 508,70 | 508,70 | 39,13 | 39,13 | 0,00 | 0,00 | 547,83 | 547,83 | 0,00 |
| CVM — Taxa de fiscalização CVM a pagar | 2.880,00 | 2.880,00 | 221,54 | 221,54 | 0,00 | 0,00 | 3.101,54 | 3.101,54 | 0,00 |
| **Total** |  |  |  |  |  |  | 964.952,00 | 964.952,00 | 0,00 |

**Memória de cálculo informada por cada lado**

- **TXADM** — Alfa: [base: PL do dia útil anterior] 0,19% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 13.953,93 · Beta: [base: PL do dia útil anterior] 0,19% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 13.953,93
- **TXGES** — Alfa: [base: PL do dia útil anterior] 0,70% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 51.409,22 · Beta: [base: PL do dia útil anterior] 0,70% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 51.409,22
- **TXCUS** — Alfa: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 734,42 · Beta: [base: PL do dia útil anterior] 0,01% a.a. sobre R$ 1.850.731.758,08 ÷ 252 (linear, dias úteis) = R$ 734,42
- **AUDIT** — Alfa: R$ 29.000,00 (anual) ÷ 252 d.u. = R$ 115,08 · Beta: R$ 29.000,00 (anual) ÷ 252 d.u. = R$ 115,08
- **ANBIMA** — Alfa: R$ 1.200,00 (mensal) ÷ 23 d.u. = R$ 52,17 · Beta: R$ 1.200,00 (mensal) ÷ 23 d.u. = R$ 52,17
- **SELIC** — Alfa: R$ 900,00 (mensal) ÷ 23 d.u. = R$ 39,13 · Beta: R$ 900,00 (mensal) ÷ 23 d.u. = R$ 39,13
- **CVM** — Alfa: R$ 14.400,00 (trimestral) ÷ 65 d.u. = R$ 221,54 · Beta: R$ 14.400,00 (trimestral) ÷ 65 d.u. = R$ 221,54

### 5.7 Passivo (aplicações, resgates e demais movimentos)

Nenhum movimento de passivo no dia.

### 5.8 Fechamento do dia

| Item | Alfa | Beta | Δ |
|---|---|---|---|
| Total de ativos | 1.841.345.691,09 | 1.841.345.691,09 | 0,00 |
| Caixa | 7.603.214,81 | 7.655.703,79 | 52.488,98 |
| Valores a receber | 0,00 | 0,00 | 0,00 |
| Valores a pagar | 0,00 | 52.575,30 | 52.575,30 |
| Provisões | 964.952,00 | 964.952,00 | 0,00 |
| PL antes das apropriações do dia (deduzidos os saldos anteriores das provisões, exceto a performance) | 1.848.050.479,39 | 1.848.050.393,07 | -86,32 |
| PL base da cota | 1.847.983.953,90 | 1.847.983.867,58 | -86,32 |
| Cota (8 casas) | 5,21544582 | 5,21544558 | -0,00000024 |
| Aplicações convertidas | 0,00 | 0,00 | 0,00 |
| Cotas emitidas | 0,00000000 | 0,00000000 | 0,00000000 |
| Cotas resgatadas | 0,00000000 | 0,00000000 | 0,00000000 |
| Valor dos resgates cotizados | 0,00 | 0,00 | 0,00 |
| IR de come-cotas | 0,00 | 0,00 | 0,00 |
| Cotas retiradas (come-cotas) | 0,00000000 | 0,00000000 | 0,00000000 |
| Quantidade final de cotas | 354.329.047,65308710 | 354.329.047,65308710 | 0,00000000 |
| PL final | 1.847.983.950,49 | 1.847.983.865,45 | -85,04 |

_PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas). Diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento e não são achado._

---

## GABARITO (não faz parte da entrada)

**Parecer:** PENDENTE

**Resumo:** Deixar pendente e escalar: TED sem identificação na conta do fundo; Tarifa de pacote PJ debitada do fundo.

**Dificuldade:** dificil · **Cenários:** credito_nao_identificado, tarifa_bancaria_indevida

### Régua v1 (provisória) — medidas deste caso

| Dimensão | Medida | Limite | Veredito |
|---|---|---|---|
| Cota | 16,55 cotas equivalentes (quantidade 0,00; PL 16,55) | 250 cotas | dentro |
| Caixa | R$ 52.488,98 | sem tolerância | ACIMA |
| Provisões | maior diferença R$ 0,00; total R$ 0,00 | R$ 100,00 por provisão e no total | dentro |

### Achado 1: TED sem identificação na conta do fundo

- **Gravidade:** pendencia · **Dimensões:** caixa
- **Lado correto:** indeterminado · **Quem ajusta:** Passivo/distribuidor (identificação) e Alfa (registro)
- **Causa raiz:** Entrou uma TED de R$ 52.575,30 de remetente sem cadastro de cotista. O Beta registrou como "recursos a identificar"; o Alfa não registrou. A natureza do crédito é desconhecida.
- **Onde olhar:** Caixa — lançamentos; Valores a pagar — recursos a identificar; Movimentações de passivo (nenhuma boleta correspondente)
- **Raciocínio do analista:**
  1. Caixa do Beta R$ 52.575,30 maior que o do Alfa; PL igual, porque o Beta pôs o valor em uma conta transitória do passivo.
  2. Não há boleta de aplicação com esse valor nem cotista com esse documento. Pode ser aplicação sem boleta, devolução de algum prestador ou erro de terceiro.
  3. O tratamento do Beta (transitória, sem efeito no PL) é prudente. Converter em cotas ou reconhecer como receita sem saber a origem seria erro.
  4. Régua v1 (provisória) — caixa: diferença de R$ 52.488,98; o caixa não tem tolerância e precisa bater antes de acatar: ACIMA.
- **Ação:** Acionar passivo/distribuidor para identificar o remetente. Se ninguém reclamar no prazo, devolver ao remetente. O Alfa deve registrar a transitória. O caixa fica pendente até a identificação.

### Achado 2: Tarifa de pacote PJ debitada do fundo

- **Gravidade:** pendencia · **Dimensões:** caixa
- **Lado correto:** nenhum · **Quem ajusta:** Beta (estorno) e Alfa (registro)
- **Causa raiz:** Houve um débito de tarifa de R$ 86,32 na conta do fundo. Tarifa de manutenção/pacote não é encargo da classe. O Beta lançou como despesa do fundo e o Alfa nem registrou.
- **Onde olhar:** Caixa — lançamentos do Beta; Regulamento — encargos e o que NÃO é encargo
- **Raciocínio do analista:**
  1. Caixa: o Beta tem um débito de R$ 86,32 (tarifa de pacote PJ) que o Alfa não tem. O PL do Beta fica R$ 86,32 menor.
  2. O regulamento lista o que é encargo e diz que tarifas bancárias de manutenção e pacote são suportadas pelo administrador. Então o fundo não pode absorver essa despesa.
  3. Nenhum dos dois lados está certo. O débito aconteceu (o dinheiro saiu), então o tratamento correto é registrar a saída e um valor a ressarcir, até o estorno.
  4. O valor é imaterial para a cota, mas é despesa indevida e precisa ser contestada.
  5. Régua v1 (provisória) — caixa: diferença de R$ 52.488,98; o caixa não tem tolerância e precisa bater antes de acatar: ACIMA.
- **Ação:** Pedir ao Beta o estorno da tarifa (ou o ressarcimento pelo administrador). Enquanto isso, os dois lados registram a saída de R$ 86,32 e um valor a receber do mesmo montante. Verificar se a cobrança se repete em outros fundos.

### Quem está correto em cada dimensão (derivado dos números)

| Dimensão | Lado cujo valor coincide com a posição correta |
|---|---|
| cota | Alfa |
| caixa | Beta |
| provisoes | ambos |

### Valores corretos

Indefinidos: dependem de uma decisão externa (comitê, identificação do remetente ou aprovação formal).

### Armadilhas deste caso

- Sem identificação do remetente não se converte em cotas nem se reconhece como receita.
- Nenhum lado está certo: o dinheiro saiu, mas a despesa não é do fundo.
