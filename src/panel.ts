import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { PLATFORMS, type Config, type Platform } from "./config";
import { isConfigured, publishClip } from "./publish";
import { State, type ClipRecord, type ClipStatus } from "./state";
import { log } from "./util/log";
import { errMsg } from "./util/misc";

/**
 * Painel local para revisar os cortes: assistir, editar título/legenda,
 * aprovar, rejeitar e postar. Só escuta em 127.0.0.1 (não fica exposto na rede).
 */

function json(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? (JSON.parse(text) as Record<string, unknown>) : {};
}

function serveVideo(req: IncomingMessage, res: ServerResponse, file: string): void {
  if (!existsSync(file)) return void res.writeHead(404).end();
  const size = statSync(file).size;
  const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range ?? "");
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    res.writeHead(206, {
      "Content-Type": "video/mp4",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
    });
    createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": size, "Accept-Ranges": "bytes" });
    createReadStream(file).pipe(res);
  }
}

function publicClip(c: ClipRecord) {
  return { ...c, file: undefined, fileName: c.file.split(/[\\/]/).pop(), exists: existsSync(c.file) };
}

export function startPanel(cfg: Config, port: number): Promise<void> {
  const origin = `http://127.0.0.1:${port}`;
  const busy = new Set<string>();

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", origin);
      const parts = url.pathname.split("/").filter(Boolean);

      if (req.method === "POST") {
        // proteção simples contra outra aba/site mandando comandos para o painel
        const o = req.headers.origin;
        if (o && o !== origin && o !== `http://localhost:${port}`) return json(res, 403, { error: "origem não permitida" });
      }

      if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(PAGE);
      }
      if (req.method === "GET" && url.pathname === "/api/meta") {
        return json(res, 200, {
          platforms: cfg.publish.platforms.map((p) => ({ id: p, configured: isConfigured(p) })),
          tiktokMode: cfg.publish.tiktokMode,
        });
      }
      if (req.method === "GET" && url.pathname === "/api/clips") {
        const clips = new State().clips().slice().reverse().map(publicClip);
        return json(res, 200, { clips, busy: [...busy] });
      }
      if (req.method === "GET" && parts[0] === "video" && parts[1]) {
        const c = new State().clips().find((x) => x.id === parts[1]);
        return c ? serveVideo(req, res, c.file) : void res.writeHead(404).end();
      }
      if (req.method === "POST" && parts[0] === "api" && parts[1] === "clips" && parts[2]) {
        const state = new State();
        const c = state.getClip(parts[2]);
        const body = await readBody(req);

        if (parts[3] === "publish") {
          if (busy.has(c.id)) return json(res, 409, { error: "já está postando" });
          const wanted = Array.isArray(body.platforms) ? (body.platforms as string[]) : cfg.publish.platforms;
          const platforms = wanted.filter((p): p is Platform => (PLATFORMS as readonly string[]).includes(p));
          busy.add(c.id);
          try {
            if (c.status === "pending") c.status = "approved";
            await publishClip(c, platforms, cfg, state);
          } finally {
            busy.delete(c.id);
          }
          return json(res, 200, publicClip(state.reload().getClip(c.id)));
        }

        if (typeof body.title === "string") c.title = body.title.slice(0, 100);
        if (typeof body.caption === "string") c.caption = body.caption.slice(0, 2000);
        if (Array.isArray(body.hashtags)) c.hashtags = (body.hashtags as string[]).map(String).slice(0, 10);
        if (typeof body.status === "string" && ["pending", "approved", "rejected", "published"].includes(body.status)) {
          c.status = body.status as ClipStatus;
        }
        state.update(c);
        return json(res, 200, publicClip(c));
      }
      json(res, 404, { error: "não encontrado" });
    } catch (e) {
      json(res, 500, { error: errMsg(e) });
    }
  });
  server.requestTimeout = 0; // postar no Instagram pode levar alguns minutos

  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => {
      log.ok(`Painel aberto em ${origin}  (Ctrl+C para fechar)`);
      resolve();
    });
  });
}

const PAGE = /* html */ `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Painel de cortes</title>
<style>
  :root { --bg:#0f1115; --card:#181b22; --text:#e9ecf1; --muted:#9aa3b2; --line:#2a2f3a; --accent:#ffd400; --ok:#33c27f; --bad:#ff5d5d; --info:#5aa9ff; }
  @media (prefers-color-scheme: light) { :root { --bg:#f4f5f8; --card:#fff; --text:#161a22; --muted:#5b6474; --line:#dde1e8; --accent:#b38f00; } }
  * { box-sizing: border-box; }
  body { margin:0; font: 15px/1.45 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background:var(--bg); color:var(--text); }
  header { position:sticky; top:0; z-index:2; background:var(--bg); border-bottom:1px solid var(--line); padding:12px 16px; display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  h1 { font-size:17px; margin:0 12px 0 0; }
  .tabs button { background:none; border:1px solid var(--line); color:var(--muted); padding:6px 12px; border-radius:999px; cursor:pointer; }
  .tabs button.on { color:var(--text); border-color:var(--accent); }
  .plat { color:var(--muted); font-size:13px; margin-left:auto; }
  main { padding:16px; display:grid; gap:16px; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
  video { width:100%; aspect-ratio:9/16; max-height:62vh; background:#000; display:block; }
  .body { padding:12px; display:flex; flex-direction:column; gap:8px; }
  .row { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
  .badge { font-size:12px; padding:2px 8px; border-radius:999px; border:1px solid var(--line); }
  .pending { color:var(--accent); } .approved { color:var(--info); } .published { color:var(--ok); } .rejected { color:var(--bad); }
  .meta { color:var(--muted); font-size:13px; }
  label { font-size:12px; color:var(--muted); }
  input, textarea { width:100%; background:transparent; color:var(--text); border:1px solid var(--line); border-radius:8px; padding:7px 9px; font:inherit; }
  textarea { min-height:64px; resize:vertical; }
  .btns button { border:0; border-radius:8px; padding:8px 12px; cursor:pointer; font-weight:600; }
  .b-ok { background:var(--ok); color:#06210f; } .b-bad { background:transparent; color:var(--bad); border:1px solid var(--bad) !important; }
  .b-pub { background:var(--accent); color:#1a1500; } .b-save { background:var(--line); color:var(--text); }
  button:disabled { opacity:.5; cursor:wait; }
  .posts a { color:var(--info); } .err { color:var(--bad); font-size:13px; }
  .empty { color:var(--muted); padding:40px; text-align:center; grid-column:1/-1; }
</style>
</head>
<body>
<header>
  <h1>✂️ Painel de cortes</h1>
  <div class="tabs" id="tabs"></div>
  <div class="plat" id="plat"></div>
</header>
<main id="list"></main>
<script>
const LABEL = { pending: "para revisar", approved: "aprovado", published: "publicado", rejected: "rejeitado" };
const TABS = [["pending","Para revisar"],["approved","Aprovados"],["published","Publicados"],["rejected","Rejeitados"],["all","Todos"]];
let tab = "pending", meta = { platforms: [] }, clips = [], busy = [];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = (s) => { s = Math.round(s); return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0"); };

async function api(path, body) {
  const r = await fetch(path, body ? { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) } : {});
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || r.status);
  return j;
}
let lastJson = "";
async function load(force) {
  const j = await api("/api/clips");
  const text = JSON.stringify(j);
  const playing = [...document.querySelectorAll("video")].some((v) => !v.paused);
  if (!force && (text === lastJson || playing)) return;
  lastJson = text; clips = j.clips; busy = j.busy; render();
}
function renderTabs() {
  document.getElementById("tabs").innerHTML = TABS.map(([id, name]) => {
    const n = id === "all" ? clips.length : clips.filter((c) => c.status === id).length;
    return '<button class="' + (tab===id?"on":"") + '" data-tab="' + id + '">' + name + " (" + n + ")</button>";
  }).join(" ");
}
function postsHtml(c) {
  return Object.entries(c.posts || {}).map(([p, r]) =>
    r.error ? '<div class="err">' + p + ": " + esc(r.error) + "</div>"
    : "<div>" + p + ": " + (r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">abrir</a>' : esc(r.note || r.id)) + "</div>").join("");
}
function render() {
  renderTabs();
  const list = tab === "all" ? clips : clips.filter((c) => c.status === tab);
  const el = document.getElementById("list");
  if (!list.length) { el.innerHTML = '<div class="empty">Nada aqui. Rode <code>npm run clipper -- watch</code> ou <code>vod</code> para gerar cortes.</div>'; return; }
  const plats = meta.platforms.map((p) => '<label><input type="checkbox" data-plat="' + p.id + '" ' + (p.configured ? "checked" : "disabled") + ' style="width:auto"> ' + p.id + (p.configured ? "" : " (sem login)") + "</label>").join(" ");
  el.innerHTML = list.map((c) => {
    const isBusy = busy.includes(c.id);
    return '<div class="card" data-id="' + c.id + '">' +
      (c.exists ? '<video controls preload="metadata" src="/video/' + c.id + '"></video>' : '<div class="empty">arquivo não encontrado</div>') +
      '<div class="body">' +
        '<div class="row"><span class="badge ' + c.status + '">' + (LABEL[c.status] || c.status) + '</span><span class="meta">nota ' + c.score + " · " + fmt(c.end - c.start) + " · " + esc(c.streamer) + "</span></div>" +
        '<div class="meta">' + esc(c.reason) + "</div>" +
        (c.edit ? '<div class="meta">Edição da IA: ' + [
          c.edit.cuts.length ? c.edit.cuts.length + " corte(s) de tempo morto" : "sem cortes internos",
          c.edit.zooms.length ? c.edit.zooms.length + " zoom(s) de reação" : null,
          c.edit.emphasis.length ? "destaques: " + esc(c.edit.emphasis.join(", ")) : null,
        ].filter(Boolean).join(" · ") + "</div>" : "") +
        '<label>Título</label><input data-f="title" value="' + esc(c.title) + '">' +
        '<label>Legenda</label><textarea data-f="caption">' + esc(c.caption) + "</textarea>" +
        '<label>Hashtags</label><input data-f="hashtags" value="' + esc((c.hashtags || []).join(" ")) + '">' +
        '<div class="meta">Texto no vídeo: “' + esc(c.hookTitle) + '” · origem: ' + esc(c.source.title) + "</div>" +
        '<div class="row btns">' +
          '<button class="b-save" data-act="save">Salvar</button>' +
          (c.status !== "approved" && c.status !== "published" ? '<button class="b-ok" data-act="approve">Aprovar</button>' : "") +
          (c.status !== "rejected" ? '<button class="b-bad" data-act="reject">Rejeitar</button>' : "") +
        "</div>" +
        (c.status !== "rejected" ? '<div class="row">' + plats + '</div><div class="row btns"><button class="b-pub" data-act="publish" ' + (isBusy ? "disabled" : "") + ">" + (isBusy ? "Postando…" : "Postar agora") + "</button></div>" : "") +
        '<div class="posts">' + postsHtml(c) + "</div>" +
      "</div></div>";
  }).join("");
}
function fields(card) {
  const v = (f) => card.querySelector('[data-f="' + f + '"]').value;
  return { title: v("title"), caption: v("caption"), hashtags: v("hashtags").split(/\\s+/).filter(Boolean).map((t) => t.startsWith("#") ? t : "#" + t) };
}
document.addEventListener("click", async (e) => {
  const t = e.target;
  if (t.dataset.tab) { tab = t.dataset.tab; render(); return; }
  const act = t.dataset.act; if (!act) return;
  const card = t.closest(".card"); const id = card.dataset.id;
  t.disabled = true;
  try {
    if (act === "save") await api("/api/clips/" + id, fields(card));
    if (act === "approve") await api("/api/clips/" + id, { ...fields(card), status: "approved" });
    if (act === "reject") await api("/api/clips/" + id, { status: "rejected" });
    if (act === "publish") {
      const platforms = [...card.querySelectorAll("[data-plat]:checked")].map((x) => x.dataset.plat);
      if (!platforms.length) { alert("Escolha pelo menos uma rede."); return; }
      await api("/api/clips/" + id, fields(card));
      busy.push(id); render();
      await api("/api/clips/" + id + "/publish", { platforms });
    }
  } catch (err) { alert("Erro: " + err.message); }
  finally { t.disabled = false; await load(true); }
});
(async () => {
  meta = await api("/api/meta");
  document.getElementById("plat").textContent = "Redes: " + meta.platforms.map((p) => p.id + (p.configured ? " ✓" : " ✗")).join("  ") + (meta.tiktokMode === "inbox" ? " · TikTok vai para a caixa de entrada" : "");
  await load(true);
  setInterval(() => { if (!document.querySelector("input:focus, textarea:focus")) load(); }, 15000);
})();
</script>
</body>
</html>`;
