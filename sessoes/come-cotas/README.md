# Sessão come-cotas

Esta sessão tem **33 casos simulados** de validação em **dia de come-cotas**, o dia em que o administrador retira cotas dos cotistas para reter o IR semestral. Ela complementa os 200 casos gerais da raiz do repositório. Todos os dados são fictícios.

## A regra do calendário

O come-cotas ocorre no **penúltimo dia útil de maio e de novembro**, e não no último. Nas datas simuladas:

| Data-base | Último dia útil do mês |
|---|---|
| 29/05/2025 (quinta) | 30/05/2025 |
| 27/11/2025 (quinta) | 28/11/2025 |
| 28/05/2026 (quinta) | 29/05/2026 |
| 27/11/2026 (sexta) | 30/11/2026 |

> **Convenção de datas.** Nada é processado em D0, o dia corrente. A data-base de cada caso é o dia que está sendo validado, um fechamento já encerrado. No come-cotas, essa data-base é o penúltimo dia útil.

## O que muda em dia de come-cotas

A **cota costuma bater** e a **quantidade de cotas** é que diverge. Por isso a entrada ganha a seção **5.9 Come-cotas**, com uma linha por cotista (posição) e os valores dos dois lados:

- tratamento tributário (tributado ou isento/imune);
- cota de referência (a do último come-cotas ou a da aplicação, a mais recente) e sua data;
- quantidade de cotas existentes ao fim do dia;
- IR e cotas retiradas calculados por cada lado.

A posição **CT-HJ**, quando o dia tem aplicações, reúne as cotas emitidas hoje: referência igual à cota de D, sem ganho. Quem estava no fundo no último come-cotas tem a mesma cota de referência (a cota daquele dia); só quem aplicou depois tem referência própria.

A entrada traz também o **prazo médio da carteira** (que define a alíquota: 15% acima de 365 dias, 20% até 365) e a regra do come-cotas no regulamento. Em parte dos casos há uma "memória do come-cotas" com a alíquota e a cota de conversão usadas por cada lado; nos demais, o agente precisa recalcular.

A regra de cálculo (por cotista tributado):

```
ganho          = max(0; (cota de D − cota de referência) × quantidade de cotas)
IR             = alíquota × ganho                  (reais e centavos)
cotas retiradas = IR ÷ cota de D                   (truncadas na 8ª casa)
```

## Os 10 cenários

| Cenário | O que acontece | O que o agente deve concluir |
|---|---|---|
| `cc_correto` | Os dois lados processam certo (com posições isentas, em prejuízo ou com aplicação recente em parte dos casos) | Aprovar e dizer o que conferiu (data, alíquota, cada posição) |
| `cc_nao_aplicado` | Um lado não processa | Reprovar o lado sem come-cotas |
| `cc_calendario_ultimo_dia` | Um lado agendou para o último dia útil; há aviso nas comunicações | Reprovar; causa é o calendário |
| `cc_isento_tributado` | Um lado retira cotas de um fundo que o regulamento diz não ter come-cotas | Reprovar o lado que retirou |
| `cc_aliquota_errada` | Um lado usa 15% quando o prazo médio manda 20% (ou o inverso); às vezes o prazo médio fica perto de 365 dias | Reprovar; alíquota pelo prazo médio |
| `cc_cota_referencia_errada` | Um lado usa, numa posição com aplicação recente, a cota do último come-cotas em vez da cota da aplicação | Reprovar; referência é a cota da aplicação |
| `cc_duplicado` | Um lado processa duas vezes | Reprovar; todas as posições com o dobro |
| `cc_cota_conversao_d1` | Um lado converte o IR em cotas pela cota de D−1 | Reprovar; IR igual, cotas diferentes |
| `cc_prejuizo_devolvido` | Um lado devolve cotas numa posição abaixo da referência | Reprovar; não há retenção nem devolução |
| `cc_cotista_isento_tributado` | Um lado retém IR de um cotista isento/imune | Reprovar; isento não sofre retenção |

Cerca de 30% dos casos de erro trazem um segundo achado, sempre de caixa ou de registro (que não mexe na cota), para a conta do come-cotas continuar exata e o dia continuar parecendo um dia real. Os 6 casos corretos não têm combinação.

O parecer esperado é **reprovado** em todo erro de come-cotas e **aprovado** nos casos corretos. Os erros desta sessão foram gerados já acima da [régua de materialidade v1](../../regua-materialidade.md) (provisória): retirar cotas a mais ou a menos de cotistas passa de 250 cotas equivalentes. Diferenças de come-cotas abaixo da régua não fazem parte desta sessão.

## Validação com agentes

2 agentes resolveram 12 casos da sessão às cegas: **parecer certo em 12 de 12 e 14 de 14 achados, sem falso positivo** (detalhes e ajustes feitos em [`avaliacao/rodada-3-come-cotas.md`](../../avaliacao/rodada-3-come-cotas.md)). Os ajustes que as observações dos agentes motivaram já estão nesta versão dos casos; ela ainda não foi reavaliada às cegas.

## Arquivos

| Caminho | Conteúdo |
|---|---|
| `casos/cc-NNN.md` | Caso legível: entrada + gabarito no final |
| `casos/cc-NNN.json` | O mesmo caso, estruturado |
| `dataset.jsonl` | Uma linha por caso (`entrada`, `gabarito`, `parecer`, `dificuldade`, `cenarios`) |
| `INDICE.md` / `COBERTURA.md` | Lista e estatísticas |

O roteiro de raciocínio da sessão está na seção **"Dia de come-cotas"** de [`metodologia-analista.md`](../../metodologia-analista.md), com a tabela de padrões de diferença. Para regenerar: `npm run gerar` (geral e sessão) ou `npm run gerar -- --so come-cotas`.

## Simplificações (confirme com o seu processo)

1. **Posições por cotista:** as quantidades são derivadas de pesos aplicados às cotas existentes ao fim do dia (depois das conversões e cotizações de D); as cotas de referência são dados do cadastro, não recalculadas de uma série histórica.
2. **IR a recolher:** o IR retido não é modelado como obrigação a pagar nem como saída de caixa. A sessão valida a retirada de cotas e o IR por cotista.
3. **Prejuízo:** posição com cota abaixo da referência não gera retenção nem devolução e não compensa ganhos de outras posições.
4. **Fundos sem come-cotas:** ações, previdência, infraestrutura incentivada, investimento no exterior, FII, Fiagro, FIDC e FIP. Os fundos exclusivos têm come-cotas semestral.
5. **Alíquota:** só 15% e 20%, definidas pelo prazo médio da carteira informado pelo administrador.
6. **Penúltimo dia útil:** interpretei "penúltimo dia" como penúltimo **dia útil**. Se for outra regra (por exemplo, penúltimo dia corrido), é só ajustar `penultimoDiaUtilDoMes` em `gerador/util.ts`.
