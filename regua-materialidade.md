# Régua de materialidade — v1 (provisória)

> **Esta régua é provisória e vai mudar.** Ela nasceu de uma definição inicial do responsável pelo processo e será ajustada conforme os casos de uso: a IA analisa os dados, os analistas dão a opinião deles, as opiniões são armazenadas e a régua melhora aos poucos. Quanto mais casos e opiniões, melhor. Nenhum número aqui é regra definitiva.

Fonte única dos números: [`regua.json`](regua.json) (gerado de `gerador/regua.ts`). Este documento, o prompt do agente e a metodologia devem sempre citar os mesmos valores; um teste automático confere isso.

## Os limites da v1

| Dimensão | Limite | O que acontece |
|---|---|---|
| **Cota** | **250 cotas equivalentes** | Abaixo de 250: dentro da régua, aprova com ressalva. 250 ou mais: reprova. |
| **Caixa** | **sem tolerância** | O caixa sempre precisa estar batido antes de acatar. |
| **Provisões** | **R$ 100** em cada provisão **e** no total | Até R$ 100: variação normal, aprova com ressalva. Acima: reprova. |

Por que três régulas diferentes: o caixa e as provisões são mais delicados. O caixa é dinheiro real e não admite diferença sem explicação. As provisões têm regras objetivas no regulamento (taxas, mínimos, faixas), mas variações baixas são normais.

## Como medir

**Cota (cotas equivalentes).** O maior entre:
- a diferença na **quantidade final de cotas** entre Alfa e Beta; e
- a diferença de **PL base** entre Alfa e Beta, dividida pela cota (a média das duas).

Assim, uma diferença de preço, de PL ou de passivo vira um número de cotas, comparável com o limite de 250.

**Caixa.** Qualquer diferença de saldo final de caixa. Não há valor abaixo do qual o caixa "bata o suficiente".

**Provisões.** A maior diferença de saldo em **uma** provisão e a diferença do **total** das provisões. As duas precisam estar em até R$ 100 para ficar dentro da régua. Diferenças que se compensam entre provisões não escondem o erro: cada provisão é medida separadamente.

**Medida do caso.** Para pegar o caso em que Alfa e Beta estão iguais e errados, cada medida é o máximo entre Alfa × Beta e cada lado contra o valor que o analista recalculou pelo regulamento.

## O caixa: conciliar as movimentações completas

1. Liste as movimentações completas do **Alfa**: saldo inicial, todos os lançamentos do dia, saldo final.
2. Liste as movimentações completas do **Beta**.
3. Compare linha a linha (histórico e valor) e confira também o saldo inicial.
4. Procure a **provável diferença**, no caixa do Alfa ou no do Beta: lançamento só de um lado, valor diferente, duplicidade, item classificado como caixa que é ativo (ou o inverso), saldo inicial já divergente.
5. **Achou a causa:** diga qual lado ajusta. O parecer é REPROVADO até o caixa bater; se o ajuste depende de terceiro (estorno, identificação de remetente), PENDENTE.
6. **Não achou: recomende a reprovação** e indique o que investigar (fechamento de D−1, extrato bancário).

## As provisões: as regras do fundo

Recalcule cada provisão com o que o regulamento do fundo diz: percentual, base de cálculo (PL do dia útil anterior), método (1/252 linear ou exponencial), mínimo mensal, faixas de PL, vigência e alterações recentes, performance (linha d'água, benchmark, data-base), despesas fixas, taxa de fiscalização por faixa, e o que é ou não encargo. Depois meça a diferença contra a régua.

## Decisão

| Situação | Parecer |
|---|---|
| Nada diverge | **APROVADO** |
| Há divergências, todas **dentro** da régua (cota < 250 cotas equivalentes, provisões até R$ 100, caixa batendo) | **APROVADO com ressalva** |
| Alguma dimensão **acima** da régua: cota a partir de 250 cotas equivalentes; qualquer diferença de caixa; provisão acima de R$ 100 | **REPROVADO** |
| Caixa divergente e causa não localizada | **REPROVADO** (recomendação) |
| Depende de decisão ou informação externa | **PENDENTE** |

Com mais de um achado vale o mais grave (reprovado > pendente > aprovado com ressalva).

## Exemplos

| Situação | Medida | Resultado |
|---|---|---|
| Preço de uma debênture difere e o PL base muda R$ 700, com cota 5,00 | 140 cotas equivalentes | Dentro: aprova com ressalva |
| Mesmo erro, com PL base mudando R$ 1.500 | 300 cotas equivalentes | Acima: reprova |
| Auditoria apropriada R$ 80 a maior por dia | R$ 80 numa provisão | Dentro: aprova com ressalva |
| Auditoria R$ 130 a maior por dia | R$ 130 numa provisão | Acima: reprova |
| Crédito bancário de R$ 2,37 registrado só no Alfa | R$ 2,37 no caixa | Acima (sem tolerância): reprova até o caixa bater |
| Caixa difere R$ 1.845,20 desde o saldo inicial, lançamentos idênticos | R$ 1.845,20 no caixa, sem causa | Reprova (recomendação), investigar D−1 |
| Provisão de performance acompanha um erro de preço e passa de R$ 100 | R$ 264 numa provisão | Acima: reprova, mesmo com a cota dentro da régua |

## Como a régua evolui

1. O agente devolve, em cada validação, as **medidas** da régua (campo `regua` da resposta) e o parecer.
2. Os analistas veem a opinião da IA e dão a deles.
3. As opiniões são **armazenadas** (veja [`base-de-opinioes/`](base-de-opinioes/README.md)), junto com as medidas.
4. O script `npm run calibrar -- base-de-opinioes/opinioes.jsonl` mostra, por dimensão, a maior diferença que os analistas aceitaram, a menor que reprovaram, e sugere um novo limite quando eles se separam.
5. O responsável pelo processo decide se muda a régua. Mudou: altera `gerador/regua.ts`, roda `npm run gerar`, e registra a nova versão (`v2`...) no histórico de `regua.json` com data e motivo.

## Hipóteses desta versão (confirme)

- "Limite mínimo de 250 cotas de diferença" foi lido como: diferença **abaixo** de 250 cotas equivalentes é tolerada; de 250 em diante reprova.
- "Régua de até 100 para provisões" foi lido como R$ 100 **em cada provisão e no total**. Se a intenção era só no total (ou só por provisão), é só ajustar `medirRegua` em `gerador/regua.ts`.
- O caixa não tem valor mínimo: qualquer diferença exige conciliação.
- Os limites valem para qualquer fundo, sem ajuste por tamanho ou por tipo. Uma régua por tipo de fundo pode vir depois, com base nas opiniões.
