import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { CONFIG_PATH, findStreamer, type Config } from "./config";
import { isConfigured } from "./publish";
import { deleteYouTube } from "./publish/youtube";
import type { ClipRecord, State } from "./state";
import { log } from "./util/log";
import { errMsg } from "./util/misc";

/**
 * Tira cortes do ar (quando um streamer pedir):
 * - YouTube: apaga pela API;
 * - TikTok e Instagram: as APIs oficiais não deixam apagar → mostra os links para apagar no app;
 * - apaga os arquivos locais e marca como removido (não volta a ser gerado nem postado).
 */
export async function removeClips(
  cfg: Config,
  state: State,
  opts: { ids?: string[]; streamer?: string; reason?: string; block?: boolean },
): Promise<void> {
  let clips: ClipRecord[] = [];
  if (opts.streamer) {
    const s = findStreamer(cfg, opts.streamer);
    clips = state.clips().filter((c) => c.streamer === s.name && !c.removed);
    if (opts.block) blockStreamer(s.name);
  }
  for (const id of opts.ids ?? []) clips.push(state.getClip(id));
  if (!clips.length) return log.info("Nenhum corte para remover.");

  const manual: string[] = [];
  for (const c of clips) {
    log.step(`Removendo ${c.id} — ${c.title}`);
    const yt = c.posts.youtube;
    if (yt?.id) {
      if (isConfigured("youtube")) {
        try {
          await deleteYouTube(yt.id);
          log.ok(`YouTube: apagado (${yt.url ?? yt.id})`);
        } catch (e) {
          log.error(errMsg(e));
          manual.push(`YouTube: ${yt.url ?? yt.id}`);
        }
      } else {
        manual.push(`YouTube: ${yt.url ?? yt.id}`);
      }
    }
    for (const p of ["tiktok", "instagram"] as const) {
      const post = c.posts[p];
      if (post?.id) manual.push(`${p === "tiktok" ? "TikTok" : "Instagram"}: ${post.url ?? `id ${post.id} (abra o perfil no app)`}`);
    }
    for (const f of [c.file, c.file.replace(/\.mp4$/i, ".json")]) if (existsSync(f)) rmSync(f, { force: true });
    c.status = "rejected";
    c.removed = { at: new Date().toISOString(), reason: opts.reason };
    state.update(c);
  }
  log.ok(`${clips.length} corte(s) removido(s) daqui.`);
  if (manual.length) {
    log.warn("Apague à mão (TikTok e Instagram não permitem apagar pela API; o YouTube aparece aqui só se não deu para apagar):");
    for (const m of manual) console.log(`   ${m}`);
  }
}

/** Marca clipPermission=false no config, para não gerar mais cortes desse streamer. */
function blockStreamer(name: string): void {
  const raw = JSON.parse(readFileSync(CONFIG_PATH, "utf8")) as { streamers?: Array<{ name: string; clipPermission?: boolean }> };
  const s = raw.streamers?.find((x) => x.name === name);
  if (!s) return;
  s.clipPermission = false;
  writeFileSync(CONFIG_PATH, `${JSON.stringify(raw, null, 2)}\n`);
  log.ok(`"${name}" bloqueado no config (clipPermission=false): não serão gerados novos cortes.`);
}
