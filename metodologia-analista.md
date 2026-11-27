# Como um analista valida um fundo (metodologia)

Este documento não é uma lista de regras por caso. Os casos nunca se repetem: o fundo, o dia, os valores e o problema mudam. O que se repete é o **jeito de pensar**. O agente deve usar este roteiro como método e decidir com base em tudo que recebeu.

> Premissa: toda informação chega pronta ("de mão beijada"): perfil do fundo, regulamento, mercado do dia, comunicações e as posições do Alfa e do Beta lado a lado. O agente não filtra, não busca e não pede nada. Ele **valida e opina**.

## Princípios

1. **Raciocinar como analista, não como regra.** Cada diferença tem uma causa; a causa é descoberta com evidência, não por padrão.
2. **O regulamento manda.** Quando Alfa e Beta divergem, o lado certo é o que segue o regulamento e o manual de precificação, não o que "parece mais razoável".
3. **Igual não é certo.** Dois lados iguais podem estar errados (os dois com a taxa antiga). Uma cota igual pode esconder erro no passivo, no caixa ou nas provisões. Dois erros podem se anular hoje.
4. **Mostrar a conta.** Toda conclusão traz um recálculo independente (valor, fórmula, fonte). Sem conta, não é achado, é palpite.
5. **Não inventar.** Usar só o que está na entrada. Se a informação não basta para decidir o lado, dizer isso e escalar, em vez de escolher um lado.
6. **Proporção.** Separar o que muda a cota/PL/passivo do que é só registro ou classificação, e do que é ruído (comunicação sem efeito em D).

## Roteiro

### 0. Ler o contexto antes dos números
- **Perfil e história do fundo:** o que ele compra, quem são os cotistas, o que costuma dar problema. As pistas orientam onde olhar, mas não provam nada. Frases como "esse fundo costuma bater de primeira" ou "já teve apontamento de auditoria" **não** substituem a conferência.
- **Regulamento:** taxas (percentual, base de cálculo, método 1/252 ou exponencial, mínimo, faixas), vigência e **alterações recentes**; horário de corte e prazo de cotização; arredondamento da cota; precificação (fonte de cada classe de ativo e regras específicas); o que é e o que não é encargo.
- **Mercado do dia:** preços de referência, PTAX, ajustes de futuros, eventos de ativos (dividendo, juros, desdobramento, vencimento, amortização), benchmark.
- **Comunicações:** separar o que **tem efeito em D** (boleta executada hoje, aviso de evento com data em D, ata assinada, aditivo vigente a partir de hoje) do que **não tem** (evento futuro, ativo que o fundo não tem, proposta não assinada, lembrete, valor "indicativo").

Anotar uma lista curta de "o que deveria aparecer nos números hoje". Ela serve de checklist no passo 5.

### 1. Bater o resumo
Comparar **cota, quantidade final de cotas, PL, caixa e total de provisões**. Cota igual não encerra a análise: conferir também quantidade de cotas (passivo), caixa e provisões.

### 2. Localizar a diferença (drill-down)
Decompor a diferença de PL: `Δ PL = Δ ativos + Δ caixa + Δ a receber − Δ a pagar − Δ provisões`. Ir ao menor nível: linha de carteira, lançamento de caixa, item a receber/pagar, provisão, movimento de passivo. **Continuar até explicar 100%** da diferença. Resíduo sem explicação significa que há outro problema (ou que dois se compensam).

### 3. Classificar a natureza de cada diferença
- **Preço:** fonte errada (curva em vez de mercado, mercado em vez de curva, D−1 em vez de D, estimado em vez de oficial, câmbio errado).
- **Quantidade:** evento societário não refletido, boleta não processada.
- **Caixa:** lançamento ausente, duplicado, não baixado, classificação errada, tarifa que não é do fundo.
- **Passivo:** conversão fora do corte, cotização antes/depois do prazo, integralização, come-cotas, resgate pago com valor errado.
- **Provisão:** taxa/percentual desatualizado, base de cálculo, método, mínimo, faixa, vigência, pagamento sem baixa, duplicidade, despesa que não é encargo.
- **Evento:** dividendo, juros, amortização, rendimento, vencimento.

### 4. Descobrir quem está certo
Hierarquia de evidência: **regulamento > manual de precificação > referência oficial de D > comunicação formal assinada > comunicação informal**. Recalcular de forma independente e comparar com cada lado:
- Um lado bate com o recálculo: o outro ajusta (`lado_correto` = o lado que bate).
- Nenhum bate: os dois ajustam (`nenhum`).
- Não dá para decidir com o que há (comitê de precificação, identificação de remetente, aprovação formal pendente): `indeterminado`. **Não escolher lado.**

### 5. Validar o que "bate"
Mesmo sem diferença entre os lados, conferir contra o regulamento: taxa vigente hoje? mudou em assembleia (vale a partir de que data)? mínimo mensal? faixa de PL? método? valor de contrato assinado ou só proposta? despesa é encargo? Passar pela lista do passo 0 e confirmar que cada evento relevante de D aparece nos números.

### 6. Dimensionar
Impacto em R$ no PL, em fração de cota e para o cotista (quem entra/sai pela cota errada). Dizer se **persiste** (provisão acumula, parametrização errada repete amanhã) ou é pontual.

### 7. Decidir pela régua (v1, provisória)

A régua de materialidade (veja `regua-materialidade.md`) diz o que é pequeno demais para reprovar. **Ela é provisória e muda com os casos de uso e as opiniões dos analistas**; os limites abaixo são os da v1.

| Dimensão | Limite (v1) | Regra |
|---|---|---|
| Cota | 250 cotas equivalentes | Abaixo: dentro (ressalva). 250 ou mais: reprova. |
| Caixa | sem tolerância | O caixa precisa estar batido antes de acatar. |
| Provisões | R$ 100 por provisão e no total | Até R$ 100: dentro (ressalva). Acima: reprova. |

- **Cota equivalente** = o maior entre |Δ quantidade final de cotas| e |Δ PL base| ÷ cota. Traduz diferença de preço, de PL ou de passivo em número de cotas.
- **Caixa:** analise as **movimentações completas** do Alfa e compare linha a linha com as **movimentações completas** do Beta (saldo inicial, lançamentos do dia, saldo final), para achar a provável diferença no caixa de um dos lados. Achou: diga quem ajusta; REPROVADO até bater (PENDENTE se depende de terceiro). **Não achou: recomende a reprovação** e diga o que investigar (fechamento de D−1, extrato).
- **Provisões:** recalcule cada uma com as regras do fundo (percentual, base, método, mínimo, faixas, vigência, performance, despesas fixas, taxa CVM, encargos). Meça cada provisão separadamente: diferenças que se compensam não escondem o erro.

| Situação | Parecer |
|---|---|
| Nada diverge | **APROVADO** |
| Divergências todas dentro da régua | **APROVADO com ressalva** |
| Alguma dimensão acima da régua, ou caixa divergente sem causa localizada | **REPROVADO** até o lado errado reprocessar |
| A resposta depende de decisão ou informação externa (comitê, aprovação formal, identificação de remetente, estorno de terceiro) | **PENDENTE** e escalar |

Com mais de um achado vale o mais grave (reprovado > pendente > aprovado com ressalva). Um efeito derivado do mesmo erro (por exemplo, a provisão de performance acompanhando a cota bruta) conta: se ele estoura a régua, reprova. Devolva as **medidas** no campo `regua` da resposta: elas alimentam a calibração.

- **Líquido:** `diferenca_caixa` e o total de provisões são líquidos (saldo de um lado menos o do outro, em módulo); cada provisão também é medida sozinha. A PDD é redutora de ativo e conta na dimensão cota.
- **Fronteira:** a menos de 10% do limite (225 a 275 cotas equivalentes; R$ 90 a R$ 110), avise o analista de que o caso está na fronteira.
- **Decisão de terceiro prevalece** sobre a régua (comitê, remetente não identificado, estorno): PENDENTE, com a medida registrada.
- **Caixa com lançamento só de um lado e sem extrato:** escolha o lado pela evidência (valor, data, regulamento, comunicações) e peça confirmação no extrato; sem evidência que decida, `indeterminado`. Dinheiro que o banco confirma ter saído duas vezes: `nenhum`, PENDENTE de estorno.
- **Negócio relevante no secundário** (provisório): pelo menos 5% da posição do fundo no papel ou 0,5% do PL.
- **Qualquer diferença é divergência**, mesmo de 1e-8: dentro da régua = APROVADO com ressalva.

### 8. Formular a ação
Quem ajusta, o que ajustar, com qual valor/fonte, e o que o analista do fundo deve saber (inclusive o que **não** precisa fazer). Se for um problema recorrente, sugerir a correção na origem (parametrização, cadastro, rotina).

## Armadilhas frequentes

- **Cota igual, passivo diferente:** aplicação convertida fora do corte, resgate cotizado antes do prazo, come-cotas não processado. A cota bate; a quantidade de cotas não.
- **O lado "óbvio" pode estar errado:** preço de mercado em fundo com títulos mantidos até o vencimento; valor "estimado" enviado pela gestora; preço ANBIMA de D−1.
- **Mudança de taxa vale a partir da data da vigência:** no primeiro dia, o saldo anterior ainda bate e só a apropriação diverge.
- **Dois erros que se anulam:** quando a diferença de PL é ~0 mas há linhas diferentes, não aprovar sem explicar cada linha.
- **Pedido da gestora não é regulamento:** despesa que não é encargo não entra no fundo; honorário só entra com a aprovação exigida e documentada.
- **Proposta ≠ contrato:** valor novo de auditoria só vale com aditivo assinado e vigente.
- **O dinheiro saiu, mas a despesa não é do fundo:** registrar o fato, contestar a despesa, não escolher um lado.
- **Fatos de D entram na cota de D**, mesmo que a boleta tenha chegado depois do corte operacional, desde que executados e liquidados em D.
- **Ruído:** comunicações alarmantes sem efeito em D não são achado; dizer por que foram descartadas.
- **Não inventar problema** quando tudo bate: aprovar e dizer o que foi conferido.
- **Um achado por causa raiz:** o efeito dela em cota, quantidade de cotas ou PL entra no mesmo achado, em `dimensoes`. Não abra um achado separado para a "consequência".
- **Os dois lados errados:** `nenhum`, `quem_ajusta` = os dois, e entregue a cota e a quantidade de cotas corretas recalculadas.
- **Evento real de dinheiro:** pagamento em duplicidade que de fato saiu da conta, ou resgate pago a menor. O dinheiro saiu, então nenhum lado está certo (`nenhum`); o ajuste é de registro e de cobrança. Se depende de estorno de terceiro, PENDENTE.
- **Preço de comitê vencido contra negócio relevante no secundário:** sem taxa ANBIMA, uma ata com mais de 30 dias e um negócio recente relevante significam que a referência não é confiável. Não escolha lado: `indeterminado`, PENDENTE, escalar ao comitê de precificação.
- **Definição da cota:** PL do dia (em reais e centavos) ÷ quantidade de cotas existentes antes das movimentações do dia, truncada na 8ª casa. A cota bruta de performance usa o PL antes da provisão de performance, já deduzidas as demais provisões.
- **Movimentos que cotizam hoje** alteram a quantidade de cotas ao fim do dia, mas não o PL base da cota de hoje; o caixa e o "a pagar" deles aparecem depois do fechamento.

## Dia de come-cotas (penúltimo dia útil de maio e de novembro)

O come-cotas é a retenção semestral de IR feita por redução da quantidade de cotas. Em dia de come-cotas a cota costuma bater e a **quantidade de cotas** é que diverge. Siga este roteiro, além do geral.

1. **Data.** O come-cotas ocorre no **penúltimo** dia útil de maio e de novembro, não no último. Se um lado não processou, procure nas comunicações um aviso de agendamento (por exemplo, "agendado para o último dia útil"): é erro de calendário.
2. **O fundo está sujeito?** Confira a tributação no regulamento. Fundos de ações, previdência, infraestrutura incentivada, investimento no exterior, FII, Fiagro, FIDC e FIP não têm come-cotas. Se um lado retirou cotas de um fundo assim, ele errou, mesmo com o cálculo "certo".
3. **Alíquota.** 15% se o prazo médio da carteira em D for superior a 365 dias; 20% se for de até 365. O prazo médio está nas informações de mercado. Perto de 365 dias, confira de que lado do limite o fundo está.
4. **Posição por cotista.** Para cada cotista tributado: ganho = (cota de D − cota de referência) × quantidade de cotas, se positivo; IR = alíquota × ganho, em reais e centavos; cotas retiradas = IR ÷ cota de D, truncadas na 8ª casa. A cota de referência é a do último come-cotas **ou a da aplicação, a mais recente**.
5. **Isentos e prejuízo.** Cotista isento ou imune não sofre retenção. Posição com cota abaixo da referência não gera retenção nem devolução de cotas.
6. **Totais.** Some IR e cotas retiradas; confira com a quantidade final de cotas de cada lado.

Observações de leitura da seção 5.9:

- As posições agrupam todos os cotistas do fundo por situação tributária e referência, e somam a quantidade de cotas existente ao fim do dia; os identificadores não são os da seção de passivo.
- Quem estava no fundo no último come-cotas tem a **mesma** cota de referência (a cota daquele dia); só quem aplicou depois tem referência própria (a cota da aplicação).
- A posição **CT-HJ**, quando existe, reúne as cotas emitidas hoje: a referência é a cota de D, então não há ganho nem retenção.
- Se um lado **não processou**, a seção só mostra os números do outro lado: a validação possível é recalcular pelas regras e comparar com o lado que processou.
- O prazo médio da carteira é informado pelo administrador e não se recalcula: use o valor informado.
- Em fundo que não tem come-cotas, qualquer retirada é indevida; ignore as cotas de referência e o histórico do lado que retirou.

Como reconhecer o erro pelo padrão da diferença:

| Padrão | Causa provável |
|---|---|
| Um lado sem IR e sem cotas retiradas | não processou (rotina ou calendário) |
| IR e cotas retiradas em todas as posições com exatamente o dobro | processado em duplicidade |
| Razão entre os IR igual a 15% ÷ 20% (ou o inverso), em todas as posições | alíquota errada |
| IR igual, cotas retiradas diferentes | IR convertido por uma cota que não é a de D (por exemplo, a de D−1) |
| Diferença em uma só posição com aplicação recente; um dos lados usou, nela, a mesma referência das posições do último come-cotas | cota de referência desatualizada (a referência correta é a cota da aplicação) |
| Diferença só na posição de um cotista isento | retenção indevida |
| Cotas devolvidas (valor negativo) numa posição abaixo da referência | prejuízo tratado como crédito |
| Um lado retirou cotas e o regulamento diz que o fundo não tem come-cotas | aplicado em fundo isento |

PL final = quantidade final de cotas × cota de fechamento (truncada em 8 casas); diferenças de poucos reais em relação a "PL base − IR" são resíduo de truncamento, não achado.

Em qualquer desses casos, se a diferença em cotas equivalentes chega a 250 (o que é comum, porque a retirada indevida mexe na quantidade de cotas), o parecer é **REPROVADO** e o lado errado reprocessa. Se tudo confere, aprove e diga o que conferiu (data, alíquota e cada posição).
