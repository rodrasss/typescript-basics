import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { z } from "zod";

export const PLATFORMS = ["youtube", "tiktok", "instagram"] as const;
export type Platform = (typeof PLATFORMS)[number];

const StreamerSchema = z.object({
  /** Nome que aparece nos logs e no prompt do Claude. */
  name: z.string(),
  /** Login da Twitch (ex.: "fulano" de twitch.tv/fulano). */
  twitch: z.string().optional(),
  /** Handle do YouTube (ex.: "@fulano"). */
  youtube: z.string().optional(),
  /** Texto de crédito queimado no vídeo e colocado na legenda do post. */
  credit: z.string(),
  /**
   * Só processa o streamer se for true. Marque apenas quando o streamer
   * autorizar cortes (programa de clipadores, permissão por escrito etc.).
   */
  clipPermission: z.boolean().default(false),
  /** Contexto extra para o Claude (personagem no RP, bordões, servidor...). */
  context: z.string().optional(),
  /** Layout só deste streamer (senão usa render.layout). */
  layout: z.enum(["blur", "crop", "split"]).optional(),
  /**
   * Onde fica a câmera do streamer na tela, em frações (0 a 1) da largura/altura.
   * Ex.: { "x": 0.75, "y": 0.0, "w": 0.25, "h": 0.3 } = canto superior direito.
   * Use `npm run clipper -- frame <url>` para descobrir.
   */
  facecam: z
    .object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1), w: z.number().min(0.05).max(1), h: z.number().min(0.05).max(1) })
    .optional(),
});
export type Facecam = NonNullable<Streamer["facecam"]>;
export type Streamer = z.infer<typeof StreamerSchema>;

const ConfigSchema = z.object({
  streamers: z.array(StreamerSchema).default([]),
  clips: z
    .object({
      /** Máximo de cortes gerados por vídeo/lote. */
      perVideo: z.number().int().positive().default(5),
      /** Quantos picos de áudio viram candidatos para o Claude avaliar. */
      candidates: z.number().int().positive().default(15),
      minSeconds: z.number().positive().default(15),
      maxSeconds: z.number().positive().default(60),
      /** Nota mínima (1-10) que o Claude precisa dar para o corte ser renderizado. */
      minScore: z.number().min(1).max(10).default(6),
      language: z.string().default("pt"),
      /** Quantos frames de cada trecho mandar para o Claude "ver" a cena (0 desliga). */
      frames: z.number().int().min(0).max(6).default(3),
      /** Hashtags sempre adicionadas. */
      hashtags: z.array(z.string()).default(["#gta6", "#gtarp", "#cortes"]),
    })
    .prefault({}),
  render: z
    .object({
      /**
       * "blur": vídeo inteiro no meio com fundo desfocado.
       * "crop": corta o centro em 9:16.
       * "split": câmera do streamer em cima e jogo embaixo (precisa de streamers[].facecam).
       */
      layout: z.enum(["blur", "crop", "split"]).default("blur"),
      /** Zoom do vídeo no layout blur (1 = largura inteira; 1.3 corta as laterais e fica maior). */
      zoom: z.number().min(1).max(2).default(1.15),
      captions: z.boolean().default(true),
      hookTitle: z.boolean().default(true),
      font: z.string().default("Arial"),
      /** Cor de destaque da palavra falada, em hex RGB. */
      highlightColor: z.string().default("#FFE600"),
      preset: z.string().default("veryfast"),
    })
    .prefault({}),
  publish: z
    .object({
      platforms: z.array(z.enum(PLATFORMS)).default(["youtube", "tiktok", "instagram"]),
      youtubePrivacy: z.enum(["private", "unlisted", "public"]).default("private"),
      /**
       * "inbox": o vídeo vai para a caixa de entrada/rascunhos do app do TikTok e você publica
       * de lá (funciona sem auditoria e deixa você pôr música em alta).
       * "direct": publica direto (sem auditoria do TikTok, só como privado).
       */
      tiktokMode: z.enum(["inbox", "direct"]).default("inbox"),
      tiktokPrivacy: z
        .enum(["SELF_ONLY", "MUTUAL_FOLLOW_FRIENDS", "FOLLOWER_OF_CREATOR", "PUBLIC_TO_EVERYONE"])
        .default("SELF_ONLY"),
      /** Se definido, cortes com nota >= esse valor já nascem aprovados (sem revisão manual). */
      autoApproveMinScore: z.number().min(1).max(10).nullable().default(null),
      /** Quantos cortes o comando publish posta por execução. */
      perRun: z.number().int().positive().default(3),
    })
    .prefault({}),
  watch: z
    .object({
      /** Quantos vídeos novos por streamer processar a cada execução do watch. */
      videosPerRun: z.number().int().positive().default(1),
      /** Também buscar os clipes mais vistos da Twitch (precisa TWITCH_CLIENT_ID/SECRET). */
      twitchClips: z.boolean().default(true),
      twitchClipsDays: z.number().int().positive().default(3),
      twitchClipsPerRun: z.number().int().positive().default(3),
    })
    .prefault({}),
});
export type Config = z.infer<typeof ConfigSchema>;

export const CONFIG_PATH = resolve(process.env.CLIPPER_CONFIG ?? "clipper.config.json");

export function loadEnv(): void {
  if (existsSync(".env")) process.loadEnvFile(".env");
}

export function loadConfig(path = CONFIG_PATH): Config {
  if (!existsSync(path)) {
    throw new Error(`Arquivo de configuração não encontrado: ${path}`);
  }
  const raw = JSON.parse(readFileSync(path, "utf8"));
  const parsed = ConfigSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error(`Configuração inválida em ${path}:\n${z.prettifyError(parsed.error)}`);
  }
  const cfg = parsed.data;
  if (cfg.clips.minSeconds >= cfg.clips.maxSeconds) {
    throw new Error("clips.minSeconds precisa ser menor que clips.maxSeconds");
  }
  return cfg;
}

export function findStreamer(cfg: Config, key: string): Streamer {
  const k = key.toLowerCase().replace(/^@/, "");
  const s = cfg.streamers.find(
    (st) =>
      st.name.toLowerCase() === k ||
      st.twitch?.toLowerCase() === k ||
      st.youtube?.toLowerCase().replace(/^@/, "") === k,
  );
  if (!s) {
    const names = cfg.streamers.map((st) => st.name).join(", ") || "(nenhum)";
    throw new Error(`Streamer "${key}" não está em ${CONFIG_PATH}. Cadastrados: ${names}`);
  }
  return s;
}

export function assertPermission(s: Streamer): void {
  if (!s.clipPermission) {
    throw new Error(
      `"${s.name}" está com clipPermission=false. Marque true no config só se o streamer autoriza cortes ` +
        `(ex.: programa oficial de clipadores). Veja a seção "Direitos autorais" no README.`,
    );
  }
}

export function env(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== "" ? v.trim() : undefined;
}

export function requireEnv(name: string): string {
  const v = env(name);
  if (!v) throw new Error(`Variável de ambiente ${name} não definida (veja .env.example).`);
  return v;
}
