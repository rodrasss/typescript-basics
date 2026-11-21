/**
 * Preparação inicial (passo 2 do GUIA.md):
 * cria o .env, confere programas e chaves, roda o teste offline e diz o que falta.
 *
 *   npm run setup
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";

const node = process.execPath;
const tsx = (script: string, ...args: string[]) =>
  spawnSync(node, ["--import", "tsx", script, ...args], { stdio: "inherit" }).status === 0;
const has = (cmd: string, arg: string) => {
  const r = spawnSync(cmd, [arg], { stdio: "ignore", shell: process.platform === "win32" });
  return r.status === 0;
};
const title = (t: string) => console.log(`\n━━━ ${t} ━━━`);

title("1/3 Arquivos");
if (!existsSync(".env")) {
  copyFileSync(".env.example", ".env");
  console.log("Criei o .env (copiado do .env.example). É nele que vão as suas chaves.");
} else {
  console.log(".env já existe — não mexi nele.");
}
mkdirSync("data", { recursive: true });
mkdirSync("output", { recursive: true });

title("2/3 Programas e chaves");
tsx("src/cli.ts", "doctor");

const missing = [
  !has("ffmpeg", "-version") && "ffmpeg",
  !has("ffprobe", "-version") && "ffprobe",
  !has("yt-dlp", "--version") && "yt-dlp",
].filter(Boolean) as string[];

title("3/3 Teste offline (gera um corte de exemplo)");
let smokeOk = false;
if (missing.length) {
  console.log(`Pulei o teste: falta instalar ${missing.join(", ")}.`);
} else {
  smokeOk = tsx("scripts/smoke.ts");
}

title("Resumo");
if (missing.length) {
  const how =
    process.platform === "win32"
      ? "winget install Gyan.FFmpeg yt-dlp.yt-dlp   (depois feche e abra o terminal)"
      : process.platform === "darwin"
        ? "brew install ffmpeg yt-dlp"
        : "sudo apt install ffmpeg pipx && pipx install yt-dlp";
  console.log(`✖ Instale o que falta e rode "npm run setup" de novo:\n    ${how}`);
} else if (smokeOk) {
  console.log("✔ Instalação OK! Veja os cortes de exemplo em output/smoke/");
} else {
  console.log("✖ O teste offline falhou — veja a mensagem acima.");
}
console.log(`
Próximos passos (GUIA.md, passos 3 a 7):
  1. Chave do Claude:  https://platform.claude.com/settings/keys   → ANTHROPIC_API_KEY no .env
  2. Chave do Groq:    https://console.groq.com/keys               → TRANSCRIBE_API_KEY no .env
  3. npm run clipper -- aprender    → atualiza a base de conhecimento da IA
  4. Streamers já cadastrados no clipper.config.json: Alanzoka, TCK, Coringa e Cellbit
  5. npm run clipper -- watch       → pega a última live de GTA de cada um
     (ou: npm run clipper -- vod "<link do VOD>" --streamer "Alanzoka")
  6. npm run clipper -- painel      → http://127.0.0.1:4310
`);
process.exitCode = missing.length || !smokeOk ? 1 : 0;
