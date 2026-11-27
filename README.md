# Validação de fundos: casos simulados para treinar o agente

Este repositório tem **200 casos de uso simulados** para treinar e avaliar um agente que valida **cota, caixa e provisões** de fundos, comparando o que está no **Alfa** com o que está no **Beta**.

Cada caso é um **fundo-persona**: tem história, gestora, cotistas, regulamento, taxas, ativos, um dia de movimento e (na maioria dos casos) um ou mais problemas escondidos. O caso traz a **entrada** que o agente recebe e o **gabarito** que um analista experiente daria (parecer, causa raiz, quem está certo, raciocínio passo a passo e ação).

> **Nomes neutros.** Os dois lados da comparação se chamam **Alfa** (o controle interno da casa) e **Beta** (o administrador/custodiante). No uso real, Alfa e Beta correspondem às duas pontas que você compara; o raciocínio não muda.

> **Tudo é fictício.** Fundos, gestoras, emissores, tickers, pessoas, preços e valores foram inventados por código. Nenhum dado real foi usado. Como os casos nunca se repetem na prática, simulado e real valem o mesmo para treinar: o que se treina é o jeito de raciocinar, não o valor.

## O que tem aqui

| Caminho | Conteúdo |
|---|---|
| `casos/caso-NNN.md` | Caso legível: entrada (seções 1–5) + gabarito no final |
| `casos/caso-NNN.json` | O mesmo caso, estruturado (posições dos dois lados, resultados, achados) |
| `dataset.jsonl` | Uma linha por caso: `entrada` (markdown), `gabarito` (markdown), `parecer`, `dificuldade`, `cenarios` |
| `INDICE.md` / `COBERTURA.md` | Lista dos casos e estatísticas de cobertura |
| `metodologia-analista.md` | **O método do analista**, em forma de roteiro, para o agente |
| `prompt-agente.md` | **Rascunho do prompt do agente**, com o formato JSON da resposta |
| `gerador/` | Código que gera, confere e avalia os casos (TypeScript) |
| `test/` | Testes automáticos do dataset |
| `avaliacao/` | Resultado da avaliação às cegas com agentes |

## Como um caso é montado

A entrada tem cinco partes, no formato em que o agente a receberia "de mão beijada":

1. **O fundo:** história de vida, tipo, gestora, cotistas, PL/cota/quantidade de cotas em D−1.
2. **Regulamento (simulado):** taxas (percentual, base de cálculo, método 1/252 ou exponencial, mínimo, faixas), performance com linha d'água, despesas fixas, taxa CVM por faixa, encargos e o que **não** é encargo, horário de corte, cotização, arredondamento da cota, regras de precificação, regras específicas e alterações recentes.
3. **Mercado do dia:** referências de preço, PTAX, ajustes de futuros, eventos de ativos, benchmark.
4. **Comunicações do dia:** e-mails e avisos, uns relevantes e outros só ruído.
5. **Batimento Alfa × Beta:** resumo, carteira, caixa, valores a receber/pagar, provisões (com ou sem memória de cálculo), passivo e fechamento do dia.

O gabarito não está na entrada. Os testes garantem que a entrada não vaza a causa raiz, o título do achado nem o identificador do cenário.

### Como o gerador constrói cada caso
1. Monta a persona e o regulamento, e calcula a **posição correta** do fundo (PL, provisões por regra, cota truncada em 8 casas, passivo).
2. Copia essa posição para os dois lados e **introduz os erros** de um ou mais cenários em um dos lados (sorteado), ou nos dois.
3. Compara as posições e confere o gabarito contra os números (**oráculo**): o lado que o gabarito diz estar certo tem que ser o lado cujo valor coincide com a posição correta. Se falhar, o caso é refeito com outra semente.

Tudo é determinístico (semente 2026): rodar de novo gera os mesmos 200 casos.

## O que os casos cobrem

53 tipos de situação, em 15 tipos de fundo (renda fixa DI e crédito privado, multimercado macro e long & short, ações, FIC, previdência, FIDC, FII, FIP, cambial, investimento no exterior, exclusivo, Fiagro e infraestrutura). Cerca de 20% dos casos estão limpos (para o agente aprender a **não inventar problema**), e cerca de 45% têm mais de um achado.

- **Cota, carteira e passivo:** preço de crédito com fonte errada, ação com fechamento de D−1, cota de fundo investido de D−1, desdobramento não refletido, dividendo com data "ex" não provisionado, aplicação não convertida ou convertida após o corte, resgate cotizado antes do prazo, PTAX errada, NAV estimado em feriado nos EUA, ajuste de futuros errado, título vencido não baixado, título mantido até o vencimento marcado a mercado, come-cotas não aplicado, arredondamento × truncamento, PDD com aging desatualizado, amortização, rendimento anunciado, laudo de FIP, integralização, ativo ilíquido sem referência, boleta tardia.
- **Caixa:** resgate liquidado e não baixado, tarifa bancária indevida, débito em duplicidade, dividendo/juros recebidos, ajuste liquidado, compromissada como caixa, pagamento de taxa, crédito não identificado, liquidação antecipada de compra, resgate pago com cota errada, margem tratada como despesa.
- **Provisões:** redução de taxa em assembleia não aplicada (e o caso em que **os dois** lados estão errados), mínimo mensal, base de cálculo, dias corridos × úteis, gestão sem apropriação, performance (reversão, data-base, linha d'água), aditivo de auditoria, faixa da taxa CVM, taxa escalonada, despesa que não é encargo, duplicidade, método linear × exponencial.
- **Armadilhas de raciocínio:** dois erros que se compensam, "cota igual mas passivo diferente", comunicação alarmante sem efeito em D, "o lado óbvio está errado", casos em que **nenhum** lado está certo e casos em que o certo é **escalar** (não escolher lado).

Veja `COBERTURA.md` para a contagem exata.

## Como usar

```bash
npm ci                # uma vez
npm run gerar         # regenera casos/, dataset.jsonl, INDICE.md e COBERTURA.md
npm test              # testes do dataset
npm run typecheck     # tipos
```

Para o agente:
1. Use `prompt-agente.md` como *system prompt* e anexe `metodologia-analista.md`.
2. Envie a **entrada** de um caso e peça a resposta em JSON.
3. Compare com o gabarito. Para avaliar em lote: `gerador/amostra.ts` monta uma amostra só com entradas e `gerador/avaliar.ts` pontua as respostas (parecer, lado correto e dimensão de cada achado).
4. Use `dataset.jsonl` como exemplos (few-shot ou recuperação por similaridade) e, se fizer sentido, como base para ajuste fino.

## Premissas que você precisa conferir

Os casos usam regras **plausíveis**, mas simuladas. Alinhe com o processo real antes de treinar de verdade:

1. **Parecer:** `APROVADO` / `REPROVADO` / `PENDENTE`, mais uma marca de `ressalva`. Se o seu processo tem outros estados ou critérios, ajuste `metodologia-analista.md` e `prompt-agente.md`.
2. **Dimensão "cota"** inclui cota, quantidade final de cotas e PL (o passivo). Caixa e provisões são validados à parte.
3. **Regulamento:** taxas calculadas sobre o PL do dia útil anterior; base 252; cota truncada em 8 casas; come-cotas simplificado (cota de referência única). Taxa CVM, tributação e calendário de feriados são simplificações.
4. **Hierarquia de evidência** (regulamento > manual de precificação > referência oficial de D > comunicação formal > informal) é uma proposta.
5. O agente que você descreveu **não faz filtro nem busca**: só valida e opina com tudo que recebe. Os casos seguem esse formato.

## Resultado da avaliação com agentes

_(preenchido após a avaliação: ver `avaliacao/`)_
