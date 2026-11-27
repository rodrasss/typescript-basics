# Base de opiniões dos analistas

Aqui vive o ciclo que melhora a régua de materialidade aos poucos:

1. A IA analisa o caso e devolve o parecer e as **medidas** da régua (campo `regua` da resposta do agente).
2. Você mostra a opinião da IA aos analistas.
3. Cada analista diz o que acha: aprova, reprova ou deixa pendente, e por quê.
4. Você **armazena** essa opinião, junto com as medidas. Quanto mais casos, melhor.
5. `npm run calibrar` compara as opiniões com os limites atuais e sugere ajustes.
6. Você decide se muda a régua (veja `regua-materialidade.md`, seção "Como a régua evolui").

> A régua é **provisória** e muda com os casos de uso. Esta base é o que a faz melhorar.

## Formato: um arquivo JSONL, uma opinião por linha

Uma opinião é sobre **uma dimensão** de um caso. Se o caso tem divergência em cota e em provisões, são duas linhas (uma por dimensão), com a mesma `caso`.

| Campo | Obrigatório | O que é |
|---|---|---|
| `caso` | sim | identificador do fundo e do dia (por exemplo, `FND-0042-2026-05-12`) |
| `dimensao` | sim | `cota`, `caixa` ou `provisoes` |
| `diferenca` | sim | a medida da dimensão: **cotas equivalentes** (cota) ou **reais** (caixa e provisões). Vem do campo `regua` da resposta do agente |
| `parecerIA` | sim | `APROVADO`, `REPROVADO` ou `PENDENTE`, o que a IA recomendou |
| `parecerAnalista` | sim | o que o analista decidiu |
| `data` | não | data-base |
| `reguaVersao` | não | versão da régua que a IA usou (`v1`) |
| `comentario` | não | o motivo do analista, nas palavras dele; é a parte mais valiosa para ajustar a régua |

De onde vem cada medida da resposta do agente:

| Dimensão | Campo do agente | Unidade |
|---|---|---|
| `cota` | `regua.diferenca_cotas_equivalentes` | cotas equivalentes |
| `caixa` | `regua.diferenca_caixa` | reais |
| `provisoes` | `regua.maior_diferenca_provisao` (a que decide; o total fica no comentário se for diferente) | reais |

O esquema está em [`esquema.json`](esquema.json) e há um [exemplo fictício](exemplo.jsonl) (linhas que começam com `//` são ignoradas).

## Como usar

```bash
npm run calibrar                                     # usa base-de-opinioes/opinioes.jsonl (ou o exemplo, se não existir)
npm run calibrar -- caminho/das/suas/opinioes.jsonl  # ou um arquivo à sua escolha
```

Para cada dimensão o relatório mostra:
- quantas opiniões, aprovadas, reprovadas, pendentes, e a **concordância entre a IA e os analistas**;
- a **maior diferença que os analistas aprovaram** e a **menor que reprovaram**;
- avisos quando os analistas aprovam o que a régua reprova (régua apertada demais) ou reprovam o que a régua aprova (frouxa demais);
- o **limite sugerido**: o valor que melhor separa o que foi aprovado do que foi reprovado. Se as opiniões se sobrepõem, o relatório diz quantas ficam fora; aí vale ler os comentários e, talvez, ter uma régua por tipo de fundo.

O script **sugere**, não decide: quem muda a régua é o responsável pelo processo.

## Cuidados

- O arquivo `base-de-opinioes/opinioes.jsonl` (com as opiniões reais) está no `.gitignore` e não vai para o repositório. Guarde-o onde o seu processo manda.
- Guarde também os casos reais que originaram as opiniões, para poder reanalisar quando a régua mudar.
- Pendências não entram no cálculo do limite (só aprovadas e reprovadas); elas contam na concordância com a IA.
- Com poucas opiniões, o limite sugerido oscila muito. Use como indício, não como sentença.
