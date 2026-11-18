import { Command } from "commander";
import { existsSync } from "node:fs";
import { CONFIG_PATH, PLATFORMS, env, findStreamer, loadConfig, loadEnv, type Platform } from "./config";
import { join } from "node:path";
import { startPanel } from "./panel";
import { OUTPUT_DIR, WORK_DIR, ensureDir } from "./paths";
import { processTwitchClips, processVod, publishApproved, watchAll, type Ctx } from "./pipeline";
import { isConfigured } from "./publish";
import { instagramAuthFlow } from "./publish/instagram";
import { tiktokAuthFlow, tiktokRefreshDaysLeft } from "./publish/tiktok";
import { youtubeAuthFlow } from "./publish/youtube";
import { gridFrame } from "./render/render";
import { downloadSection, getInfo } from "./sources/ytdlp";
import { State, type ClipStatus } from "./state";
import { hasCommand, run } from "./util/exec";
import { log } from "./util/log";
import { errMsg, hms, sleep, slug } from "./util/misc";

loadEnv();

function ctx(opts: { keep?: boolean; force?: boolean } = {}): Ctx {
  return { cfg: loadConfig(), state: new State(), keepWork: opts.keep, force: opts.force };
}

function action<A extends unknown[]>(fn: (...args: A) => Promise<void>) {
  return async (...args: A) => {
    try {
      await fn(...args);
    } catch (e) {
      log.error(errMsg(e));
      process.exitCode = 1;
    }
  };
}

function parsePlatforms(s: string | undefined, fallback: Platform[]): Platform[] {
  if (!s) return fallback;
  const list = s.split(",").map((p) => p.trim().toLowerCase());
  const bad = list.filter((p) => !(PLATFORMS as readonly string[]).includes(p));
  if (bad.length) throw new Error(`Plataforma inválida: ${bad.join(", ")} (use ${PLATFORMS.join(", ")})`);
  return list as Platform[];
}

const program = new Command()
  .name("clipper")
  .description("Cortes automáticos de lives: acha os momentos engraçados, gera vídeo vertical e posta.");

program
  .command("vod")
  .description("Processa um VOD/vídeo (Twitch, YouTube, Kick…) e gera os cortes")
  .argument("<url>", "link do VOD")
  .requiredOption("-s, --streamer <nome>", "streamer cadastrado no config")
  .option("--force", "reprocessa mesmo se já foi feito")
  .option("--keep", "mantém os arquivos temporários em data/work")
  .action(
    action(async (url: string, o: { streamer: string; force?: boolean; keep?: boolean }) => {
      const c = ctx(o);
      const clips = await processVod(url, findStreamer(c.cfg, o.streamer), c);
      log.ok(`${clips.length} corte(s) gerado(s). Veja com: npm run clipper -- list`);
    }),
  );

program
  .command("twitch-clips")
  .description("Pega os clipes mais vistos da Twitch do streamer e transforma em cortes verticais")
  .requiredOption("-s, --streamer <nome>", "streamer cadastrado no config")
  .option("-d, --days <n>", "janela de dias", "3")
  .option("-n, --limit <n>", "máximo de cortes", "3")
  .option("--keep", "mantém os arquivos temporários")
  .action(
    action(async (o: { streamer: string; days: string; limit: string; keep?: boolean }) => {
      const c = ctx(o);
      const clips = await processTwitchClips(findStreamer(c.cfg, o.streamer), c, {
        days: Number(o.days),
        limit: Number(o.limit),
      });
      log.ok(`${clips.length} corte(s) gerado(s).`);
    }),
  );

program
  .command("watch")
  .description("Rodada automática para todos os streamers autorizados")
  .option("--publish", "posta os aprovados no final de cada rodada")
  .option("--every <horas>", "fica rodando e repete a cada N horas (alternativa ao cron/Agendador)")
  .option("--keep", "mantém os arquivos temporários")
  .action(
    action(async (o: { publish?: boolean; keep?: boolean; every?: string }) => {
      const hours = o.every ? Number(o.every) : 0;
      if (o.every && !(hours > 0)) throw new Error("--every precisa de um número de horas, ex.: --every 3");
      for (;;) {
        try {
          const c = ctx(o);
          const clips = await watchAll(c);
          log.ok(`Rodada concluída: ${clips.length} corte(s) novo(s).`);
          if (o.publish) await publishApproved(c, { platforms: c.cfg.publish.platforms, limit: c.cfg.publish.perRun });
        } catch (e) {
          if (!hours) throw e;
          log.error(`Rodada falhou: ${errMsg(e)}`);
        }
        if (!hours) break;
        log.info(`Próxima rodada em ${hours} h (${new Date(Date.now() + hours * 3_600_000).toLocaleString("pt-BR")}).`);
        await sleep(hours * 3_600_000);
      }
    }),
  );

program
  .command("painel")
  .description("Abre o painel no navegador para assistir, editar, aprovar e postar os cortes")
  .option("--port <porta>", "porta local", "4310")
  .action(
    action(async (o: { port: string }) => {
      await startPanel(loadConfig(), Number(o.port));
      await new Promise(() => {}); // fica aberto até Ctrl+C
    }),
  );

program
  .command("frame")
  .description("Salva um frame com grade de 10% (para achar a facecam) e, com --facecam, a prévia do layout split")
  .argument("<url>", "link do VOD")
  .option("--at <segundos>", "momento do VOD", "600")
  .option("--facecam <x,y,w,h>", "frações 0-1 da câmera, ex.: 0.75,0,0.25,0.3")
  .action(
    action(async (url: string, o: { at: string; facecam?: string }) => {
      const at = Number(o.at);
      let facecam;
      if (o.facecam) {
        const [x, y, w, h] = o.facecam.split(",").map(Number);
        if ([x, y, w, h].some((n) => !(n >= 0 && n <= 1))) throw new Error("--facecam precisa de 4 números entre 0 e 1: x,y,w,h");
        facecam = { x, y, w, h };
      }
      const info = await getInfo(url);
      const work = ensureDir(join(WORK_DIR, `frame-${slug(info.key)}`));
      const sec = await downloadSection(info.url, Math.max(0, at - 1), at + 2, work, "frame");
      const out = join(OUTPUT_DIR, "frames", `${slug(info.key)}-${Math.round(at)}s.png`);
      const files = await gridFrame(sec.path, at - sec.start, out, work, facecam);
      for (const f of files) log.ok(f);
      if (!facecam) log.info('Veja em que % fica a câmera e teste com: --facecam x,y,w,h  (ex.: --facecam 0.75,0,0.25,0.3)');
      else log.info(`Se ficou bom, coloque no config do streamer: "facecam": { "x": ${facecam.x}, "y": ${facecam.y}, "w": ${facecam.w}, "h": ${facecam.h} }, "layout": "split"`);
    }),
  );

program
  .command("list")
  .description("Lista os cortes gerados")
  .option("--status <status>", "pending | approved | rejected | published")
  .action(
    action(async (o: { status?: ClipStatus }) => {
      const clips = new State().clips().filter((c) => !o.status || c.status === o.status);
      if (clips.length === 0) return log.info("Nenhum corte ainda.");
      for (const c of clips) {
        const posts = Object.entries(c.posts)
          .map(([p, r]) => `${p}:${r?.id ? "ok" : "erro"}`)
          .join(" ");
        console.log(
          `${c.id}  ${c.status.padEnd(9)}  nota ${String(c.score).padStart(2)}  ${hms(c.end - c.start).padStart(5)}  ` +
            `${c.streamer} — ${c.title}${posts ? `  [${posts}]` : ""}\n          ${c.file}`,
        );
      }
    }),
  );

for (const [cmd, status] of [
  ["approve", "approved"],
  ["reject", "rejected"],
] as const) {
  program
    .command(cmd)
    .description(cmd === "approve" ? "Aprova cortes para publicação" : "Descarta cortes")
    .argument("<ids...>")
    .action(
      action(async (ids: string[]) => {
        const state = new State();
        for (const id of ids) {
          const c = state.getClip(id);
          c.status = status;
          state.update(c);
          log.ok(`${id} → ${status}`);
        }
      }),
    );
}

program
  .command("publish")
  .description("Posta os cortes aprovados (ou os ids informados)")
  .argument("[ids...]")
  .option("-p, --platforms <lista>", "ex.: youtube,tiktok")
  .option("-n, --limit <n>", "máximo de cortes nesta execução")
  .action(
    action(async (ids: string[], o: { platforms?: string; limit?: string }) => {
      const c = ctx();
      await publishApproved(c, {
        platforms: parsePlatforms(o.platforms, c.cfg.publish.platforms),
        limit: o.limit ? Number(o.limit) : c.cfg.publish.perRun,
        ids,
      });
    }),
  );

program
  .command("auth:youtube")
  .description("Faz o login OAuth do YouTube e mostra o refresh token para o .env")
  .action(action(youtubeAuthFlow));

program
  .command("auth:tiktok")
  .description("Faz o login do TikTok (Login Kit) e salva os tokens em data/tiktok-token.json")
  .action(action(tiktokAuthFlow));

program
  .command("auth:instagram")
  .description("Faz o login da Meta e mostra INSTAGRAM_USER_ID e INSTAGRAM_ACCESS_TOKEN (token de Página, não expira)")
  .option("--token <token>", "usa um token de usuário gerado no Graph API Explorer em vez do login pelo navegador")
  .action(action(async (o: { token?: string }) => instagramAuthFlow(o.token)));

program
  .command("doctor")
  .description("Confere dependências, chaves e configuração")
  .action(
    action(async () => {
      const check = (ok: boolean, label: string, hint = "") =>
        ok ? log.ok(label) : log.warn(`${label}${hint ? ` — ${hint}` : ""}`);

      const [major] = process.versions.node.split(".").map(Number);
      check(major >= 20, `Node ${process.versions.node}`, "use Node 20.12 ou mais novo");
      const ff = await hasCommand("ffmpeg");
      check(!!ff, ff ?? "ffmpeg", "instale o ffmpeg");
      if (ff) {
        const filters = await run("ffmpeg", ["-hide_banner", "-filters"]).catch(() => "");
        check(/\bass\b/.test(filters), "ffmpeg com libass (legendas)", "instale um ffmpeg compilado com libass");
      }
      check(!!(await hasCommand("ffprobe")), "ffprobe");
      const ytdlp = await hasCommand("yt-dlp", "--version");
      check(!!ytdlp, `yt-dlp ${ytdlp ?? ""}`, "pip install -U yt-dlp");
      check(!!(env("ANTHROPIC_API_KEY") || env("ANTHROPIC_AUTH_TOKEN")), "Chave do Claude (ANTHROPIC_API_KEY)", "ou faça `ant auth login`");
      check(!!env("TRANSCRIBE_API_KEY"), "Chave de transcrição (TRANSCRIBE_API_KEY)");
      check(!!(env("TWITCH_CLIENT_ID") && env("TWITCH_CLIENT_SECRET")), "Twitch API (opcional, para clipes populares)");
      for (const p of PLATFORMS) check(isConfigured(p), `Credenciais ${p}`, "sem isso não posta nessa rede");
      const ttDays = tiktokRefreshDaysLeft();
      if (ttDays !== null) {
        check(ttDays > 14, `Login do TikTok vale por mais ${ttDays} dia(s)`, "rode npm run clipper -- auth:tiktok de novo");
      }
      check(existsSync(CONFIG_PATH), `Config ${CONFIG_PATH}`);
      if (existsSync(CONFIG_PATH)) {
        const cfg = loadConfig();
        const ok = cfg.streamers.filter((s) => s.clipPermission);
        check(ok.length > 0, `${ok.length}/${cfg.streamers.length} streamer(s) com clipPermission=true`);
      }
    }),
  );

await program.parseAsync();
