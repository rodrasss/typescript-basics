# Guia passo a passo: do zero até postar sozinho

Faça na ordem. A **Fase 1** leva cerca de 30 minutos e já gera cortes de verdade. A **Fase 2** depende de aprovações das plataformas (dias ou semanas), então **comece os cadastros dela cedo**, em paralelo.

## Checklist

**Fase 0: permissão**
- [ ] Ter autorização de pelo menos 1 streamer (ou entrar num programa de clipadores)

**Fase 1: primeiro corte**
- [ ] Instalar Node, ffmpeg, yt-dlp e Git
- [ ] Baixar o projeto e rodar `npm install` + `npm run setup`
- [ ] Chave do Claude
- [ ] Chave do Groq
- [ ] Rodar `npm run clipper -- aprender` (base de conhecimento)
- [ ] Cadastrar o streamer no `clipper.config.json`
- [ ] Rodar o primeiro `vod` e revisar no `painel`

**Fase 2: redes sociais**
- [ ] Twitch API (opcional)
- [ ] YouTube: app no Google Cloud, login e **pedido de auditoria**
- [ ] TikTok: app no TikTok for Developers e login
- [ ] Instagram: conta Profissional, Página, app na Meta e login

**Fase 3: automação**
- [ ] Deixar o `watch` rodando sozinho

---

## Fase 0: Permissão dos streamers (é o que faz dar dinheiro)

Repostar live sem autorização gera strike, derruba a conta e não monetiza. Antes de tudo:

1. **Procure programas de clipadores.** Olhe o Discord, a bio da Twitch/YouTube e o Instagram do streamer, e busque por "clipador", "clipper", "cortes" ou "programa de cortes". Muitos streamers e agências grandes pagam por visualização ou liberam a monetização dos cortes.
2. **Ou peça direto** por e-mail comercial ou DM. Exemplo de mensagem:
   > Oi, [nome]! Tenho um canal de cortes de GTA e queria sua autorização para postar cortes das suas lives no TikTok, Reels e Shorts, sempre com crédito para o seu canal. Posso divulgar seu link na legenda. Tudo bem por você? Se tiver um programa de clipadores, topo participar.
3. **Guarde o print da autorização.** Se der strike, é sua prova.
4. No `clipper.config.json`, marque `"clipPermission": true` só para esses streamers.

---

## Fase 1: Primeiro corte

### 1. Instalar os programas

**Windows.** Abra o **PowerShell** e rode:
```powershell
winget install OpenJS.NodeJS.LTS
winget install Gyan.FFmpeg
winget install yt-dlp.yt-dlp
winget install Git.Git
```
Feche e abra o PowerShell de novo depois de instalar.

**macOS.** Instale o Homebrew em https://brew.sh e depois rode:
```bash
brew install node ffmpeg yt-dlp git
```

**Linux.** Instale o Node 22 por https://nodejs.org e depois rode:
```bash
sudo apt install ffmpeg git pipx && pipx install yt-dlp
```

Links, caso prefira instalar manualmente:
- Node: https://nodejs.org
- ffmpeg para Windows: https://www.gyan.dev/ffmpeg/builds/
- yt-dlp: https://github.com/yt-dlp/yt-dlp#installation
- Git: https://git-scm.com/downloads

### 2. Baixar o projeto e preparar
No terminal (PowerShell no Windows, Terminal no Mac), rode:
```bash
git clone https://github.com/rodrasss/typescript-basics.git clipper
cd clipper
npm install
npm run setup
```
O `npm run setup` faz quatro coisas:
- cria o arquivo `.env`;
- confere se ffmpeg, yt-dlp e as chaves estão ok;
- gera um corte de exemplo em `output/smoke/` (não precisa de chave);
- diz o que falta fazer.

Se ele disser que falta algum programa, instale com o comando que ele mostrar e rode `npm run setup` de novo.

O `.env` guarda as suas senhas de API. Abra com um editor (Bloco de Notas, ou o VS Code: https://code.visualstudio.com) e **nunca envie esse arquivo para ninguém**.

### 3. Chave do Claude (escolhe os momentos e escreve título/legenda)
1. Crie a conta em https://platform.claude.com.
2. Em **Billing**, adicione créditos. US$ 10 dá para umas 15 a 30 lives; cada VOD custa por volta de US$ 0,30 a 0,80.
3. Em https://platform.claude.com/settings/keys, clique em **Create Key**, copie a chave e cole no `.env`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

### 4. Chave do Groq (transcrição da fala)
1. Entre em https://console.groq.com.
2. Em https://console.groq.com/keys, clique em **Create API Key** e cole no `.env`:
   ```
   TRANSCRIBE_API_KEY=gsk_...
   ```

> **Quer que o Claude rode o teste na nuvem, sem usar o seu PC?** Em vez do `.env`, cadastre as duas chaves no ambiente de nuvem do Claude Code:
> 1. No menu do ambiente (no título da sessão), clique em **Editar**.
> 2. Em **Variáveis de ambiente**, adicione `ANTHROPIC_API_KEY=...` e `TRANSCRIBE_API_KEY=...`.
> 3. Abra uma sessão nova e peça: "roda o primeiro teste do clipper com a Alanzoka".
>
> O ambiente é pessoal, mas qualquer sessão sua nele consegue ler essas variáveis.

### 5. Base de conhecimento da IA (recomendado)
O projeto já vem com exemplos reais de clipes e Shorts de GTA 6. Para atualizar com os mais vistos desta semana, rode:
```bash
npm run clipper -- aprender
```
Com a chave do Groq configurada, ele também transcreve os mais vistos. Assim a IA aprende como soa um corte que viralizou.

Para deixar a IA com o estilo dos canais que você admira, coloque em `clipper.config.json → knowledge`:
- `youtubeChannels`: canais de cortes do YouTube, por exemplo `["@canaldecortes"]`.
- `tiktokProfiles`: perfis de cortes do TikTok, por exemplo `["@perfil"]`. Funciona quando o yt-dlp consegue ler o perfil; às vezes o TikTok pede cookies (veja "Problemas comuns").
- `twitch`: mais streamers de referência.

Depois rode `aprender` de novo. O `watch` já roda o `aprender` sozinho uma vez por semana (`knowledge.autoRefreshDays`).

Também dá para mexer no **manual de edição** em `knowledge/playbook.md`. É texto simples, e a IA segue o que estiver lá.

E a parte mais importante: **revise no painel**. Tudo o que você aprova, rejeita ou reescreve (título e legenda) vira referência do seu gosto para os próximos cortes.

### 6. Streamers
Já vêm cadastrados: **Alanzoka, TCK, Coringa e Cellbit**. O Cellbit está com `"perVideo": 1, "minScore": 8`, ou seja, no máximo 1 corte por live e só os muito bons.

O programa só analisa os trechos das lives em que o streamer está jogando GTA (`clips.games`). Se a live for de outro jogo, como Valorant, ela é pulada sozinha e não gasta nada.

Para adicionar outro streamer, copie um bloco e ajuste. Exemplo:
```json
{
  "name": "Nome do Streamer",
  "twitch": "login_dele_na_twitch",
  "youtube": "@handle_dele",
  "credit": "twitch.tv/login_dele_na_twitch",
  "clipPermission": true,
  "context": "Faz GTA RP no servidor X como o policial Y. Bordões: ..."
}
```
Quanto mais `context`, melhores os títulos.

**Câmera do streamer em cima e jogo embaixo (layout "split"):** a Alanzoka já tem a posição da câmera configurada. Para usar, troque `"layout": "blur"` por `"layout": "split"` no bloco dela. Para outro streamer:
1. Gere um frame com uma grade de 10% por cima, usando o link de um VOD dele:
   ```bash
   npm run clipper -- frame "https://www.twitch.tv/videos/123456789" --at 600
   ```
2. Abra o PNG em `output/frames/` e veja onde fica a câmera. Por exemplo: começa em 75% da largura e 0% da altura, ocupa 25% da largura e 30% da altura.
3. Teste a prévia passando esses números:
   ```bash
   npm run clipper -- frame "https://www.twitch.tv/videos/123456789" --at 600 --facecam 0.75,0,0.25,0.3
   ```
4. Se o `...-split.png` ficou bom, coloque no streamer:
   ```json
   "layout": "split", "facecam": { "x": 0.75, "y": 0, "w": 0.25, "h": 0.3 }
   ```

### 7. Primeiro teste de verdade
```bash
npm run clipper -- vod "https://www.twitch.tv/videos/123456789" --streamer "Nome do Streamer"
npm run clipper -- painel
```
Abra **http://127.0.0.1:4310** no navegador. Lá você assiste aos cortes, ajusta título e legenda, aprova ou rejeita.

> Se a IA escolher mal, melhore o `context` do streamer, rode o `aprender`, rejeite os cortes ruins no painel (ela aprende com isso) ou suba `clips.candidates` (por exemplo, para 25).

---

## Fase 2: Redes sociais (comece cedo, as aprovações demoram)

### 8. Twitch API (opcional: pega os clipes mais vistos)
1. Ative a verificação em duas etapas na sua conta da Twitch. A Twitch exige isso para criar apps.
2. Em https://dev.twitch.tv/console/apps/create, preencha:
   - **Nome:** qualquer um
   - **OAuth Redirect URL:** `http://localhost`
   - **Categoria:** Application Integration
   - **Client Type:** Confidential
3. Clique em **Gerenciar**, copie o **Client ID**, clique em **Novo segredo** e coloque no `.env`:
   ```
   TWITCH_CLIENT_ID=...
   TWITCH_CLIENT_SECRET=...
   ```
4. Teste com:
   ```bash
   npm run clipper -- twitch-clips --streamer "Nome do Streamer"
   ```

### 9. YouTube Shorts
1. **Crie o projeto** em https://console.cloud.google.com/projectcreate.
2. **Ative a API** em https://console.cloud.google.com/apis/library/youtube.googleapis.com, botão **Ativar**.
3. **Configure a tela de consentimento** em https://console.cloud.google.com/auth/overview:
   - Clique em **Começar** e preencha nome do app e seu e-mail.
   - Em público, escolha **Externo**.
   - Em **Público-alvo → Usuários de teste**, adicione o Gmail dono do canal.
   - ⚠️ No mesmo lugar, clique em **Publicar app** (colocar "em produção"). Sem isso, o login do Google vence a cada 7 dias. O Google vai avisar que o app não foi verificado; para uso próprio, pode ignorar.
4. **Crie a credencial** em https://console.cloud.google.com/auth/clients: **Criar cliente**, tipo **App para computador**. Copie para o `.env`:
   ```
   YOUTUBE_CLIENT_ID=...apps.googleusercontent.com
   YOUTUBE_CLIENT_SECRET=...
   ```
5. **Faça o login:**
   ```bash
   npm run clipper -- auth:youtube
   ```
   - Abra o link e entre com a conta do canal.
   - Na tela "o Google não verificou este app", clique em **Avançado** e depois em **Acessar (não seguro)**. É o seu próprio app.
   - Copie o `YOUTUBE_REFRESH_TOKEN` que aparecer para o `.env`.
6. **Peça a auditoria** em https://support.google.com/youtube/contact/yt_api_form, no formulário "Audit and Quota Extension".
   - Sem ela, os vídeos enviados pela API ficam **travados como privados** e não dá para torná-los públicos depois.
   - A aprovação demora semanas. Enquanto isso, suba os `.mp4` de `output/` manualmente pelo YouTube Studio.
   - A cota padrão permite cerca de 6 uploads por dia.

### 10. TikTok
1. Entre em https://developers.tiktok.com e abra **Manage apps** (https://developers.tiktok.com/apps). Crie um app.
2. Preencha nome, ícone, descrição e categoria. O TikTok **exige** links de **Termos de Uso** e **Política de Privacidade**: pode ser uma página simples sua (Google Sites, Notion, GitHub Pages).
3. Em **Platforms**, marque **Desktop**.
4. Adicione os produtos:
   - **Login Kit**, com redirect URI exatamente `http://localhost:53683/callback/`
   - **Content Posting API**
5. Peça os escopos `user.info.basic`, `video.upload` e `video.publish`. Para publicar direto, ative também **Direct Post** na Content Posting API.
6. Use o **Sandbox** para testar com a sua conta, adicionando-a como usuário de teste. Para uso normal, envie o app para revisão (**Submit for review**).
7. Copie o **Client key** e o **Client secret** para o `.env`:
   ```
   TIKTOK_CLIENT_KEY=...
   TIKTOK_CLIENT_SECRET=...
   ```
8. **Faça o login:**
   ```bash
   npm run clipper -- auth:tiktok
   ```
   O login fica salvo em `data/tiktok-token.json` e se renova sozinho. **Não apague esse arquivo.**
9. **Como os posts saem:** por padrão (`"tiktokMode": "inbox"`), o vídeo vai para a **caixa de entrada do app do TikTok**. Você recebe uma notificação, abre o app, coloca uma **música em alta** (ajuda muito no alcance) e publica.
   - Para publicar direto, use `"tiktokMode": "direct"`. Mas sem a auditoria da Content Posting API (https://developers.tiktok.com/application/content-posting-api), os posts diretos só saem como **privados**.

### 11. Instagram Reels
1. **Conta Profissional.** No app do Instagram: **Configurações → Tipo de conta e ferramentas → Mudar para conta profissional** (Criador serve).
2. **Ligue a uma Página do Facebook.**
   - Crie a Página em https://www.facebook.com/pages/create, se ainda não tiver.
   - Na Página, vá em **Configurações → Contas vinculadas → Instagram → Conectar**.
3. **Crie o app na Meta** em https://developers.facebook.com/apps:
   - Clique em **Criar app** e escolha o caso de uso **"Gerenciar mensagens e conteúdo no Instagram"**.
   - Escolha a opção **"Configuração da API com login do Facebook"**. É ela que permite enviar o vídeo do seu PC.
   - Nas permissões, adicione `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement` e `business_management`.
4. **Copie as chaves.** Em **Configurações do app → Básico**, copie para o `.env`:
   ```
   META_APP_ID=...
   META_APP_SECRET=...
   ```
5. **Cadastre o redirect, se pedirem.** Em **Login do Facebook → Configurações → URIs de redirecionamento do OAuth válidos**, coloque `http://localhost:53684/callback`.
6. **Faça o login:**
   ```bash
   npm run clipper -- auth:instagram
   ```
   Ele mostra o `INSTAGRAM_USER_ID` e o `INSTAGRAM_ACCESS_TOKEN`. Cole os dois no `.env`. O token é de Página e **não expira**.
   - **Se o login pelo navegador der erro:** abra o Graph API Explorer (https://developers.facebook.com/tools/explorer/), escolha o seu app, marque as mesmas permissões, clique em **Generate Access Token** e rode:
     ```bash
     npm run clipper -- auth:instagram --token COLE_O_TOKEN_AQUI
     ```
   - Se a Meta pedir uma **configuração de login** (Facebook Login for Business), crie a configuração e coloque o ID dela em `META_LOGIN_CONFIG_ID`.
7. O app pode ficar em **modo de desenvolvimento**. Para postar na sua própria conta (você é admin do app), não precisa de revisão da Meta.

Depois de cada rede, rode `npm run clipper -- doctor`. Ele mostra ✔ nas redes configuradas.

---

## Fase 3: Deixar rodando sozinho

O fluxo do dia a dia:
1. O `watch` gera os cortes.
2. Você revisa no `painel` (5 minutos por dia).
3. O `watch --publish` (ou o botão **Postar agora** no painel) posta os aprovados.

**Jeito mais simples (qualquer sistema):** deixe um terminal aberto rodando
```bash
npm run clipper -- watch --publish --every 3
```
Isso faz uma rodada a cada 3 horas. O computador precisa ficar ligado e não pode entrar em suspensão.

**Windows: Agendador de Tarefas**
1. Abra o Agendador de Tarefas e clique em **Criar Tarefa Básica**.
2. Escolha **Diariamente** e, nas propriedades, marque **repetir a cada 3 horas**.
3. Em ação, escolha **Iniciar um programa**:
   - **Programa:** `cmd.exe`
   - **Argumentos:** `/c cd /d C:\caminho\clipper && npm run clipper -- watch --publish >> data\watch.log 2>&1`

**macOS/Linux: cron.** Rode `crontab -e` e adicione:
```
0 */3 * * * cd /caminho/clipper && npm run clipper -- watch --publish >> data/watch.log 2>&1
```

**Sem revisão (100% automático):** só quando confiar nas notas do Claude, coloque `"autoApproveMinScore": 8` no config.

---

## Se um streamer reclamar
```bash
npm run clipper -- remover --streamer "Nome" --bloquear
```
O comando faz quatro coisas:
- apaga os vídeos dele do **YouTube** pela API;
- mostra os links do **TikTok** e do **Instagram** para você apagar no app, porque essas APIs não permitem apagar;
- apaga os arquivos locais;
- para de gerar cortes dele.

Para tirar um corte só, use `npm run clipper -- remover ID` (veja o ID no painel ou com `list`).

## Custos por mês (estimativa)

| Item | Custo |
|---|---|
| Claude | ~US$ 0,30–0,80 por VOD (triagem + editor de cada corte) |
| Groq (transcrição) | centavos (tem plano grátis) |
| Twitch, YouTube, TikTok, Meta API | grátis |
| Seu PC ligado | luz 🙂 |

## Problemas comuns

- **"Sign in to confirm you're not a bot" (YouTube).** Exporte os cookies do navegador logado (veja https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp) e coloque `YTDLP_COOKIES=./cookies.txt` no `.env`.
- **yt-dlp dando erro do nada.** Atualize: `winget upgrade yt-dlp.yt-dlp`, `brew upgrade yt-dlp` ou `pipx upgrade yt-dlp`.
- **YouTube pede login de novo toda semana.** Falta **Publicar app** na tela de consentimento (passo 9.3).
- **TikTok: `unaudited_client_can_only_post_to_private_accounts`.** Use `"tiktokMode": "inbox"` (o padrão).
- **Instagram: "Nenhuma Página com conta do Instagram ligada".** Refaça o passo 11.2.
- **Fonte da legenda.** Baixe uma fonte grossa (ex.: Montserrat em https://fonts.google.com/specimen/Montserrat), coloque o `.ttf` em `assets/fonts/` e use `"font": "Montserrat ExtraBold"` em `render`.
