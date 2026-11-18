# Clipper GTA: cortes automáticos de lives

Esta automação pega as lives dos streamers (GTA RP, GTA V e, agora, GTA 6), acha os momentos engraçados e transforma cada um num vídeo vertical legendado. Depois posta no **YouTube Shorts**, no **TikTok** e no **Instagram Reels**.

> 👉 **Começando agora? Siga o [GUIA.md](GUIA.md)**, que tem o passo a passo de instalação, chaves e contas, com todos os links.

```
VOD da live ──► baixa só o áudio ──► acha picos de reação (risada, grito, susto)
            ──► transcreve só esses trechos (Whisper) + tira alguns frames
            ──► o Claude lê, "vê" e escolhe os melhores: início/fim, título,
                legenda e hashtags
            ──► baixa só os trechos escolhidos (segmentos HLS, segundos)
            ──► renderiza em 1080x1920: fundo desfocado OU câmera em cima + jogo
                embaixo, legenda palavra por palavra, título e crédito
            ──► painel de revisão ──► posta pelas APIs oficiais
```

Também existe o modo **clipes populares da Twitch**. Nele o programa pega os clipes mais vistos do canal (a própria audiência já marcou o momento bom), e o Claude escolhe, apara e escreve o título. O programa evita postar duas vezes o mesmo momento quando ele aparece tanto num clipe quanto no VOD.

## ⚠️ Direitos autorais e monetização

- **A live pertence ao streamer.** Repostar sem permissão pode gerar strike, remoção do vídeo e até banimento. O YouTube desmonetiza "conteúdo reutilizado" e o TikTok reduz o alcance de "conteúdo não original".
- **O jeito que dá dinheiro:** programas de clipadores (o streamer paga por visualização ou libera a monetização) ou autorização direta. O programa só processa streamers com `"clipPermission": true`.
- Por padrão, nada é postado sem você aprovar no painel.

## Comandos

```bash
npm run clipper -- doctor                         # confere instalação, chaves e logins
npm run smoke                                     # teste offline (gera cortes de exemplo)

npm run clipper -- vod "<link do VOD>" --streamer "Nome"          # processa um VOD
npm run clipper -- twitch-clips --streamer "Nome" --days 3        # clipes mais vistos da Twitch
npm run clipper -- watch [--publish] [--every 3]                  # rodada automática (ou loop a cada 3 h)

npm run clipper -- painel                         # http://127.0.0.1:4310: assistir, editar, aprovar, postar
npm run clipper -- list [--status pending]        # mesma fila, no terminal
npm run clipper -- approve <id...> | reject <id...>
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
| `clips.perVideo` / `candidates` | Máximo de cortes por VOD e quantos picos o Claude avalia. |
| `clips.minSeconds` / `maxSeconds` / `minScore` | Duração dos cortes e nota mínima (1–10) para renderizar. |
| `clips.frames` | Frames de cada trecho enviados ao Claude (0 desliga). Funciona em fontes HLS (Twitch/Kick) e nos clipes. |
| `clips.hashtags` | Hashtags sempre adicionadas. |
| `render.layout` | Layout padrão: `blur` (vídeo inteiro com fundo desfocado), `crop` (corta o centro) ou `split`. |
| `render.zoom` / `font` / `highlightColor` | Aparência. Fontes `.ttf` próprias vão em `assets/fonts/`. |
| `publish.platforms` | Redes onde postar. |
| `publish.youtubePrivacy` | Privacidade no YouTube (`private` / `unlisted` / `public`). |
| `publish.tiktokMode` | `inbox`: vai para os rascunhos do app do TikTok, e funciona sem auditoria. `direct`: publica direto. |
| `publish.autoApproveMinScore` | Aprovação automática por nota (`null` = sempre revisar). |
| `publish.perRun` | Quantos cortes postar por rodada. |
| `watch.*` | Quantos VODs e clipes processar por rodada. |

## Custos

- **Claude:** cerca de US$ 0,10–0,30 por VOD.
- **Transcrição:** centavos.
- **APIs das redes:** grátis.
- O vídeo é processado no seu computador (ffmpeg).

## Limitações conhecidas

- O Claude vê só alguns frames e a fala. Momentos puramente visuais e rápidos podem passar.
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
  analysis/select.ts      Claude escolhe e escreve título/legenda
  render/captions.ts      legendas animadas (ASS)
  render/render.ts        ffmpeg 9:16 (blur / crop / split) + grade da facecam
  publish/                YouTube, TikTok (inbox/direct), Instagram + logins OAuth
scripts/smoke.ts          teste offline de ponta a ponta do vídeo
test/                     testes unitários (npm test)
```
