# Rodada 3 — sessão de come-cotas, avaliação às cegas

Casos respondidos: 12

- Parecer correto: **12/12** (100%)
- Ressalva correta: 8/12
- Achados do gabarito encontrados (lado e dimensão): **14/14** (100%)
- Achados extras (falsos positivos): 0

| Caso | Cenário(s) | Gabarito | Agente | Achados | Extras |
|---|---|---|---|---|---|
| cc-001 | cc_isento_tributado+compromissada_como_caixa | REPROVADO* | REPROVADO | 2/2 | 0 |
| cc-002 | cc_prejuizo_devolvido | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-003 | cc_correto | APROVADO | APROVADO | 0/0 | 0 |
| cc-004 | cc_duplicado | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-005 | cc_isento_tributado | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-006 | cc_correto | APROVADO | APROVADO | 0/0 | 0 |
| cc-008 | cc_cotista_isento_tributado+compromissada_como_caixa | REPROVADO* | REPROVADO | 2/2 | 0 |
| cc-009 | cc_cota_referencia_errada | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-010 | cc_aliquota_errada+dividendo_recebido_nao_baixado | REPROVADO* | REPROVADO | 2/2 | 0 |
| cc-012 | cc_cota_conversao_d1 | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-014 | cc_calendario_ultimo_dia | REPROVADO | REPROVADO | 1/1 | 0 |
| cc-017 | cc_nao_aplicado+ajuste_liquidado_nao_baixado | REPROVADO* | REPROVADO | 2/2 | 0 |


## Como ler

- 12 casos da sessão de come-cotas (um por cenário, mais casos corretos e com achado combinado), resolvidos às cegas por 2 agentes. Nenhum caso foi perdido.
- A tabela vale para a versão da sessão anterior aos ajustes abaixo; os identificadores mudam quando o gerador muda. Nesta versão, o gabarito ainda marcava `ressalva` também em casos reprovados com um item leve: foi isso que gerou "ressalva correta 8/12". A regra foi simplificada (veja abaixo) e o indicador, que não era erro dos agentes, deixa de existir.

## O que a rodada mostrou

- **Parecer: 12 de 12. Achados: 14 de 14, sem falso positivo.** Os agentes reconheceram a data (penúltimo dia útil), a alíquota pelo prazo médio, o fundo isento, a duplicidade, a cota de conversão, o prejuízo devolvido, o cotista isento e a referência desatualizada, e aprovaram os casos corretos conferindo posição a posição.
- Nos casos com um segundo achado leve (compromissada em caixa, dividendo ou ajuste de futuros), registraram o item de caixa em separado e não deixaram que ele mudasse o parecer.

**Ajustes feitos a partir das observações dos agentes:**

| Observação | Ajuste |
|---|---|
| Posições com o mesmo "último come-cotas" tinham cotas de referência diferentes (um mesmo evento tem uma única cota) | Quem estava no fundo no último come-cotas passa a ter a mesma referência (a cota daquele dia) |
| No erro de referência, o valor errado era um número solto, difícil de decidir sem histórico de cotas | O lado errado usa a referência do último come-cotas (a mesma das outras posições) na posição com aplicação posterior, o que torna o erro reconhecível |
| As cotas emitidas hoje não apareciam na tabela do come-cotas | Posição própria CT-HJ: quantidade = cotas emitidas, referência = cota de D, sem ganho |
| Posições da seção de come-cotas não coincidiam com os cotistas do passivo | Nota explicando que as posições agrupam cotistas por situação e referência |
| Regulamento com vigência posterior à data-base | A vigência nunca é posterior ao dia validado |
| `ressalva: true` em caso reprovado: valia ou não? | A marca só existe quando o parecer é APROVADO; nos demais, o item entra como achado de gravidade `ressalva` |
| Como validar quando um lado não processou | A metodologia diz que o recálculo pelas regras é a validação possível |
| PL final difere de "PL base − IR" em poucos reais | Nota: PL final = quantidade final × cota truncada; a diferença é resíduo, não achado |
| Isento: o que fazer com o histórico de referências do lado que retirou? | A metodologia diz para ignorá-lo: em fundo sem come-cotas, toda retirada é indevida |

**Limitação conhecida:** a entrada não traz o histórico de cotas, então a cota de referência de uma aplicação é um dado do cadastro, não algo que o analista possa recalcular.
