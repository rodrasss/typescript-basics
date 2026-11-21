# Clipper GTA: cortes automáticos de lives

Esta automação pega as lives dos streamers (GTA RP, GTA V e, agora, GTA 6), acha os momentos engraçados e transforma cada um num vídeo vertical legendado. Depois posta no **YouTube Shorts**, no **TikTok** e no **Instagram Reels**.

> 👉 **Começando agora? Siga o [GUIA.md](GUIA.md)**, que tem o passo a passo de instalação, chaves e contas, com todos os links.

```
VOD da live ──► baixa só o áudio ──► acha picos de reação (risada, grito, susto)
            ──► transcreve só esses trechos (Whisper) + tira alguns frames
            ──► IA, etapa 1 (triagem): escolhe os melhores momentos
            ──► IA, etapa 2 (editor): para cada corte, decide início/fim exatos,
                corta tempo morto, marca o zoom na reação, destaca as palavras-chave
                e escreve gancho, título e legenda
            ──► baixa só os trechos escolhidos (segmentos HLS, segundos)
            ──► renderiza em 1080x1920: fundo desfocado OU câmera em cima + jogo
                embaixo, legenda palavra por palavra, título e crédito
            ──► painel de revisão ──► posta pelas APIs oficiais
```

### Base de conhecimento da IA

As duas etapas da IA recebem uma base de conhecimento, guardada em cache entre as chamadas. Ela tem:

- **Manual de edição** (`knowledge/playbook.md`): gancho, ritmo, duração, o que é engraçado em GTA/RP/GTA 6, títulos e o que evitar. Edite à vontade.
- **Exemplos reais do que viralizou:** clipes mais vistos da Twitch e Shorts de canais de cortes, com views, duração, fala e o momento do pico. Vêm com dados estatísticos (duração típica, onde fica a reação, estilo dos títulos).
  - O projeto já vem com uma base inicial de GTA 6 (`knowledge/seed.json`).
  - O comando `aprender` atualiza a base no seu PC, inclusive com perfis do TikTok e canais de cortes que você indicar.
- **O seu gosto:** o que você aprovou, rejeitou e como reescreveu os títulos e legendas no painel. Quanto mais você revisa, mais a IA acerta o seu estilo.

Também existe o modo **clipes populares da Twitch**. Nele o programa pega os clipes mais vistos do canal (a própria audiência já marcou o momento bom), e o Claude escolhe, apara e escreve o título. O programa evita postar duas vezes o mesmo momento quando ele aparece tanto num clipe quanto no VOD.

## ⚠️ Direitos autorais e monetização

- **Se um streamer reclamar:** `npm run clipper -- remover --streamer "Nome" --bloquear` apaga os vídeos dele do YouTube, lista os links do TikTok e do Instagram para apagar no app e para de gerar cortes dele.
- **A live pertence ao streamer.** Repostar sem permissão pode gerar strike, remoção do vídeo e até banimento. O YouTube desmonetiza "conteúdo reutilizado" e o TikTok reduz o alcance de "conteúdo não original".
- **O jeito que dá dinheiro:** programas de clipadores (o streamer paga por visualização ou libera a monetização) ou autorização direta. O programa só processa streamers com `"clipPermission": true`.
- Por padrão, nada é postado sem você aprovar no painel.

## Comandos

```bash
npm run setup                                     # primeira vez: cria o .env, confere tudo e roda o teste offline
npm run clipper -- doctor                         # confere instalação, chaves e logins
npm run smoke                                     # teste offline (gera cortes de exemplo)

npm run clipper -- vod "<link do VOD>" --streamer "Nome"          # processa um VOD
npm run clipper -- twitch-clips --streamer "Nome" --days 3        # clipes mais vistos da Twitch
npm run clipper -- watch [--publish] [--every 3]                  # rodada automática (ou loop a cada 3 h)
npm run clipper -- aprender                       # atualiza a base de conhecimento da IA

npm run clipper -- painel                         # http://127.0.0.1:4310: assistir, editar, aprovar, postar
npm run clipper -- list [--status pending]        # mesma fila, no terminal
npm run clipper -- approve <id...> | reject <id...>
npm run clipper -- remover <id...>                # tira um corte do ar (YouTube pela API; TikTok/Instagram mostra o link)
npm run clipper -- remover --streamer "Nome" --bloquear   # tira TUDO de um streamer e para de gerar
npm run clipper -- publish [id...] [--platforms youtube,tiktok]

npm run clipper -- frame "<link>" --at 600 [--facecam x,y,w,h]   # acha a posição da câmera
npm run clipper -- auth:youtube | auth:tiktok | auth:instagram    # logins das redes
```

## Configuração (`clipper.config.json`)

| Campo | O que faz |
|---|---|
| `streamers[].clipPermission` | Só processa o streamer quando for `true`. |
| `streamers[].credit` | Crédito queimado no vídeo e colocado na legenda. |
| `streamers[].context` | Contexto para o Claude: personagem no RP, servidor, bordões. Melhora bastante os títulos. |
| `streamers[].layout` / `facecam` | `"split"` + posição da câmera (frações 0–1) para usar câmera em cima e jogo embaixo. |
| `streamers[].perVideo` / `minScore` | Limites só desse streamer (ex.: `perVideo: 1, minScore: 8` para postar pouco e só o melhor). |
| `clips.perVideo` / `candidates` | Máximo de cortes por VOD e quantos picos o Claude avalia. |
| `clips.minSeconds` / `maxSeconds` | Só limites técnicos (5 s e 180 s, o máximo dos Shorts/Reels). A duração de cada corte é a do momento, do começo ao fim da situação. |
| `clips.windowBefore` / `windowAfter` | Quanto da live antes/depois de cada pico a IA enxerga (para pegar a situação inteira). |
| `clips.games` | Só analisa os trechos da live com estes jogos (categoria da Twitch). Padrão: GTA VI e GTA V. Lives de outros jogos são puladas. |
| `clips.minScore` | Nota mínima (1–10) para renderizar. |
| `clips.frames` | Frames de cada trecho enviados ao Claude (0 desliga). Funciona em fontes HLS (Twitch/Kick) e nos clipes. |
| `clips.hashtags` | Hashtags sempre adicionadas. |
| `clips.editPass` / `editFrames` | Etapa do editor de IA (liga/desliga) e quantos frames ele vê de cada corte. |
| `render.allowCuts` / `punchZoom` / `emphasisColor` / `bottomText` | O que o editor de IA pode usar: cortar tempo morto, zoom de reação, cor das palavras-chave e um rodapé curto embaixo do vídeo ("ESPERA O FINAL"). |
| `knowledge.*` | Fontes do `aprender`: canais da Twitch, buscas e canais do YouTube, perfis do TikTok, quantos transcrever e quantos exemplos entram no contexto. |
| `render.layout` | Layout padrão: `blur` (vídeo inteiro com fundo desfocado), `crop` (corta o centro) ou `split`. |
| `render.zoom` / `font` / `highlightColor` | Aparência. Fontes `.ttf` próprias vão em `assets/fonts/`. |
| `publish.platforms` | Redes onde postar. |
| `publish.youtubePrivacy` | Privacidade no YouTube (`private` / `unlisted` / `public`). |
| `publish.tiktokMode` | `inbox`: vai para os rascunhos do app do TikTok, e funciona sem auditoria. `direct`: publica direto. |
| `publish.autoApproveMinScore` | Aprovação automática por nota (`null` = sempre revisar). |
| `publish.perRun` | Quantos cortes postar por rodada. |
| `watch.*` | Quantos VODs e clipes processar por rodada. |

## Custos

- **Claude:** cerca de US$ 0,30–0,80 por VOD, contando a triagem e o editor para cada corte. Para gastar menos, use `clips.editPass: false` ou `CLAUDE_EFFORT=medium`.
- **Transcrição:** centavos.
- **APIs das redes:** grátis.
- O vídeo é processado no seu computador (ffmpeg).

## Limitações conhecidas

- A IA vê alguns frames e a fala, não o vídeo inteiro. Momentos puramente visuais e muito rápidos podem passar.
- **Chat da Twitch:** os picos de mensagens seriam um bom sinal, mas a Twitch não tem API oficial para o chat de VODs antigos.
- **YouTube:** ele às vezes bloqueia downloads e aí é preciso usar cookies (`YTDLP_COOKIES`). Sem a auditoria do Google, os uploads pela API ficam privados.
- **Download de trechos:** em fontes não HLS (YouTube), o download de trechos usa o yt-dlp e é mais lento.

## Estrutura

```
src/
  cli.ts                  comandos
  pipeline.ts             fluxo VOD / clipes da Twitch / watch / publish
  panel.ts                painel web local de revisão
  config.ts               config + validação
  state.ts                fila de cortes e o que já foi processado (data/state.json)
  sources/ytdlp.ts        listar, baixar áudio, escolher HLS ou yt-dlp
  sources/hls.ts          baixa só os segmentos HLS do trecho (Twitch/Kick)
  sources/twitch.ts       API Helix (clipes populares)
  analysis/loudness.ts    detecção de picos de reação pelo volume
  analysis/transcribe.ts  Whisper com timestamps por palavra
  analysis/frames.ts      frames dos trechos para o Claude
  analysis/knowledge.ts   base de conhecimento + comando aprender
  analysis/claude.ts      chamada ao Claude (JSON validado, cache, fallback)
  analysis/select.ts      etapa 1: triagem dos momentos
  analysis/edit.ts        etapa 2: editor (cortes, zoom, destaques, textos)
  render/captions.ts      legendas animadas (ASS)
  render/render.ts        ffmpeg 9:16 (blur / crop / split), cortes internos, zoom + grade da facecam
  render/timeline.ts      linha do tempo com cortes (remapeia legendas e zooms)
knowledge/
  playbook.md             manual de edição que a IA segue (editável)
  seed.json               base inicial de exemplos reais (GTA 6 / RP)
  publish/                YouTube, TikTok (inbox/direct), Instagram + logins OAuth
scripts/smoke.ts          teste offline de ponta a ponta do vídeo
test/                     testes unitários (npm test)
```
