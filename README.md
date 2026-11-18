# Clipper GTA: cortes automáticos de lives

Esta automação pega as lives dos streamers (GTA RP, GTA V e, agora, GTA 6), acha os momentos engraçados e transforma cada um num vídeo vertical legendado. Depois posta no **YouTube Shorts**, no **TikTok** e no **Instagram Reels**.

```
VOD da live ──► baixa só o áudio ──► acha picos de reação (risada, grito, susto)
            ──► transcreve só esses trechos (Whisper)
            ──► o Claude lê tudo, escolhe os melhores e define início/fim,
                título, legenda e hashtags
            ──► baixa só os trechos escolhidos em vídeo
            ──► renderiza em 1080x1920: fundo desfocado, legenda palavra por
                palavra, título no topo e crédito do streamer
            ──► fila de revisão ──► posta pelas APIs oficiais
```

Também existe o modo **clipes populares da Twitch**. Nele o programa pega os clipes mais vistos do canal (a própria audiência já marcou o momento bom), e o Claude escolhe, apara e escreve o título. Depois o clipe passa pelo mesmo processo de vídeo vertical.

---

## ⚠️ Direitos autorais e monetização (leia antes de postar)

- **A live pertence ao streamer.** Repostar sem permissão pode gerar strike, remoção do vídeo e até banimento da conta. O Content ID do YouTube e os sistemas do TikTok e do Instagram detectam reupload.
- **Monetização:** o YouTube desmonetiza "conteúdo reutilizado" e o TikTok reduz o alcance de "conteúdo não original". Legenda, título e edição ajudam, mas **não substituem a permissão**.
- **O jeito que dá dinheiro de verdade:** muitos streamers grandes (e as agências deles) têm **programas de clipadores**, em que pagam por visualização ou deixam você monetizar os cortes. Procure esses programas ou peça autorização direto. É por isso que o config tem `clipPermission`: o programa só processa streamers marcados como autorizados.
- Por padrão os cortes ficam numa **fila de revisão**. Assista antes de postar: a IA erra, e quem responde pela conta é você.

---

## Requisitos

- **Node.js 20.12+**
- **ffmpeg** compilado com libass (é o caso dos builds comuns)
  - Windows: `winget install Gyan.FFmpeg`
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg`
- **yt-dlp**: `pip install -U yt-dlp`, `winget install yt-dlp` ou `brew install yt-dlp`. Mantenha o yt-dlp atualizado, porque os sites mudam com frequência.

## Instalação

```bash
git clone https://github.com/rodrasss/typescript-basics.git clipper
cd clipper
npm install
cp .env.example .env          # preencha as chaves (veja abaixo)
npm run clipper -- doctor     # confere se está tudo certo
npm run smoke                 # teste offline: gera um corte de exemplo em output/smoke/
```

Depois edite o `clipper.config.json` e cadastre os streamers, cada um com o login da Twitch e/ou o handle do YouTube, o texto de crédito e `"clipPermission": true` quando houver autorização.

## Chaves e contas

| Para quê | Onde pegar | Variáveis no `.env` |
|---|---|---|
| Escolher os momentos (Claude) | console.anthropic.com → API Keys | `ANTHROPIC_API_KEY` |
| Transcrição (Whisper) | console.groq.com → API Keys (ou OpenAI, ou um servidor local compatível) | `TRANSCRIBE_API_KEY` (+ `TRANSCRIBE_BASE_URL`/`TRANSCRIBE_MODEL` se não usar Groq) |
| Clipes populares da Twitch (opcional) | dev.twitch.tv/console → Register Your Application | `TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET` |
| YouTube Shorts | Google Cloud (ver abaixo) | `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN` |
| TikTok | developers.tiktok.com (ver abaixo) | `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_REFRESH_TOKEN` (ou só `TIKTOK_ACCESS_TOKEN`) |
| Instagram Reels | developers.facebook.com (ver abaixo) | `INSTAGRAM_USER_ID`, `INSTAGRAM_ACCESS_TOKEN` |

O modelo padrão do Claude é o `claude-opus-5-5`, com esforço `medium` (dá para mudar com `CLAUDE_MODEL`/`CLAUDE_EFFORT`). Se o modelo recusar um pedido por política de segurança, a API tenta de novo automaticamente num modelo substituto (`fallbacks: "default"`).

### YouTube
1. No Google Cloud Console, crie um projeto e ative a **YouTube Data API v3**.
2. Configure a **tela de consentimento OAuth** (tipo Externo) e adicione o seu e-mail como usuário de teste.
3. Em Credenciais, crie um **ID do cliente OAuth** do tipo **App para computador** e coloque o ID e o secret no `.env`.
4. Rode `npm run clipper -- auth:youtube`, abra o link, autorize com a conta do canal e copie o `YOUTUBE_REFRESH_TOKEN` para o `.env`.

> Projetos que ainda não passaram pela auditoria do Google sobem os vídeos travados como **privados**. Para postar como público é preciso pedir a auditoria ("YouTube API Services – Audit and Quota Extension"). A cota diária padrão também só permite poucos uploads por dia.

### TikTok
1. Em developers.tiktok.com, crie um app e adicione **Login Kit** e **Content Posting API** (com Direct Post), usando o escopo `video.publish`.
2. Faça o OAuth da sua conta para pegar o access token e o refresh token. O programa renova o access token sozinho e guarda em `data/tiktok-token.json`.

> Enquanto o app não for auditado pelo TikTok, ele só consegue postar como **privado** (`SELF_ONLY`) e só em contas privadas. Depois da auditoria, mude `publish.tiktokPrivacy` para `PUBLIC_TO_EVERYONE`.

### Instagram
1. A conta do Instagram precisa ser **Profissional** (Criador ou Empresa).
2. Crie um app em developers.facebook.com com a API do Instagram e a permissão `instagram_content_publish`.
3. Gere um **token de longa duração** (ele vale cerca de 60 dias, então renove antes de vencer) e pegue o ID do usuário do Instagram.
4. Se usar "Instagram API com login do Instagram" em vez do login do Facebook, coloque `INSTAGRAM_GRAPH_HOST=graph.instagram.com`.

---

## Uso

```bash
# Processar um VOD específico (Twitch, YouTube, Kick… o que o yt-dlp suportar)
npm run clipper -- vod "https://www.twitch.tv/videos/123456789" --streamer "Nome do Streamer"

# Clipes mais vistos da Twitch dos últimos 3 dias
npm run clipper -- twitch-clips --streamer "Nome do Streamer" --days 3 --limit 3

# Ver a fila
npm run clipper -- list
npm run clipper -- list --status pending

# Revisar (os vídeos ficam em output/<streamer>/)
npm run clipper -- approve a1b2c3d4 e5f6a7b8
npm run clipper -- reject 9c8d7e6f

# Postar os aprovados (ou ids específicos, ou só algumas redes)
npm run clipper -- publish
npm run clipper -- publish a1b2c3d4 --platforms youtube,tiktok
```

### Automação (rodar sozinho)

O comando `watch` faz uma rodada completa. Para cada streamer autorizado, ele procura VODs novos (Twitch e aba "Ao vivo" do YouTube), processa e, se a Twitch API estiver configurada, pega também os clipes populares. Com `--publish`, ele já posta os aprovados no final.

Linux/macOS (cron, a cada 3 horas):
```cron
0 */3 * * * cd /caminho/do/clipper && npm run clipper -- watch --publish >> data/watch.log 2>&1
```
No Windows, use o **Agendador de Tarefas** com o mesmo comando.

Para rodar **100% sem revisão**, defina `"autoApproveMinScore": 8` no config. Cortes com nota 8 ou mais já saem aprovados e são postados no próximo `watch --publish`. O recomendado é começar revisando e só ligar isso quando confiar nas notas.

O programa lembra o que já processou (`data/state.json`). Ele não repete VODs nem clipes, e desiste de um vídeo depois de 3 falhas.

---

## Configuração (`clipper.config.json`)

| Campo | O que faz |
|---|---|
| `streamers[].context` | Contexto para o Claude: personagem no RP, servidor, bordões. Melhora bastante os títulos. |
| `clips.perVideo` | Máximo de cortes por VOD. |
| `clips.candidates` | Quantos picos de áudio viram candidatos. Mais candidatos custam um pouco mais e aumentam as chances de achar momento bom. |
| `clips.minSeconds` / `maxSeconds` | Duração dos cortes. |
| `clips.minScore` | Nota mínima (1–10) para renderizar. |
| `clips.hashtags` | Hashtags sempre adicionadas. |
| `render.layout` | `blur`: o vídeo inteiro no meio, com fundo desfocado. `crop`: corta o centro em tela cheia. |
| `render.zoom` | No `blur`, amplia o vídeo cortando as laterais (1.0 a 2.0). |
| `render.font` | Fonte das legendas. Coloque arquivos `.ttf` em `assets/fonts/` para usar fontes próprias. |
| `publish.platforms` | Redes onde postar. |
| `publish.youtubePrivacy` / `tiktokPrivacy` | Privacidade dos posts. O padrão é privado, para testar com segurança. |
| `publish.autoApproveMinScore` | Aprovação automática por nota (`null` desliga). |
| `publish.perRun` | Quantos cortes postar por execução, para não fazer spam. |
| `watch.*` | Quantos VODs e clipes processar por rodada. |

## Custos aproximados

- **Transcrição:** só cerca de 15 trechos de 75 s por VOD são transcritos, não a live inteira. No Groq isso sai por centavos.
- **Claude:** uma chamada por VOD com as transcrições dos candidatos. Na ordem de **US$ 0,10–0,30 por VOD** com o Opus 5.5 em esforço `medium`.
- O processamento de vídeo roda no seu computador (ffmpeg).

## Limitações e ideias para evoluir

- O Claude **não vê o vídeo**: ele decide pela fala e pelo volume. Um momento só visual (um bug bizarro do jogo sem ninguém falar) pode passar batido. Dá para evoluir mandando alguns frames de cada candidato (visão).
- Os picos de mensagens no chat da Twitch seriam um ótimo sinal extra, mas ainda não estão implementados.
- Layout com a facecam em cima e a gameplay embaixo exige a posição da câmera de cada streamer. Fica como próximo passo.
- O YouTube às vezes pede login para o yt-dlp (principalmente em servidores). Nesse caso, exporte os cookies do navegador e aponte `YTDLP_COOKIES`.

## Estrutura

```
src/
  cli.ts                  comandos
  pipeline.ts             fluxo VOD / clipes da Twitch / watch / publish
  config.ts               config + validação
  state.ts                fila de cortes e o que já foi processado (data/state.json)
  sources/ytdlp.ts        listar, baixar áudio e baixar só trechos
  sources/hls.ts          baixa só os segmentos HLS do trecho (Twitch/Kick), em segundos
  sources/twitch.ts       API Helix (clipes populares)
  analysis/loudness.ts    detecção de picos de reação pelo volume
  analysis/transcribe.ts  Whisper com timestamps por palavra
  analysis/select.ts      Claude escolhe e escreve título/legenda
  render/captions.ts      legendas animadas (ASS)
  render/render.ts        ffmpeg 9:16
  publish/                YouTube, TikTok, Instagram (APIs oficiais)
scripts/smoke.ts          teste offline de ponta a ponta do vídeo
test/                     testes unitários (npm test)
```
