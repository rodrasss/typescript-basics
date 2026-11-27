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

### 7. Decidir
| Situação | Parecer |
|---|---|
| Nada diverge e as provisões conferem com o regulamento | **APROVADO** |
| Diferença só de registro/classificação, sem efeito na cota, PL ou passivo | **APROVADO com ressalva** |
| Há erro com efeito na cota, no PL, na quantidade de cotas ou no passivo, e a correção está clara | **REPROVADO** até o lado errado reprocessar |
| A resposta depende de decisão ou informação externa (comitê, aprovação formal, identificação de remetente, estorno de terceiro) | **PENDENTE** e escalar |

Com mais de um achado, vale o mais grave (erro > pendência > ressalva > informativo).

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
