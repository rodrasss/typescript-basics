import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { createInterface } from "node:readline";

/**
 * Espera o retorno de um login OAuth.
 * - Se o redirect for http://localhost:PORTA ou http://127.0.0.1:PORTA, sobe um
 *   servidorzinho e captura o código sozinho.
 * - Em qualquer caso, aceita que você cole no terminal a URL para onde o
 *   navegador foi redirecionado (útil quando o redirect é um https que não abre).
 */
export async function waitForRedirect(redirectUri: string, authUrl: string): Promise<URLSearchParams> {
  console.log("\n1) Abra este link no navegador, logado na conta certa:\n\n" + authUrl + "\n");
  const target = new URL(redirectUri);
  const loopback = ["localhost", "127.0.0.1"].includes(target.hostname) && target.port !== "";
  console.log(
    loopback
      ? "2) Autorize. O terminal captura o retorno sozinho. Se não capturar, cole aqui a URL da barra de endereço:"
      : "2) Autorize e, quando o navegador for redirecionado, copie a URL inteira da barra de endereço e cole aqui:",
  );

  return new Promise((resolve, reject) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    let server: ReturnType<typeof createServer> | null = null;
    const finish = (params: URLSearchParams) => {
      rl.close();
      server?.close();
      const err = params.get("error");
      if (err) reject(new Error(`Autorização negada: ${params.get("error_description") ?? err}`));
      else if (!params.get("code")) reject(new Error("A URL não tem o parâmetro code."));
      else resolve(params);
    };

    rl.on("line", (line) => {
      const text = line.trim();
      if (!text) return;
      try {
        const u = new URL(text.replace(/#_?$/, ""));
        finish(u.searchParams);
      } catch {
        console.log("Isso não parece uma URL. Cole a URL completa (começando com http).");
      }
    });

    if (loopback) {
      server = createServer((req, res) => {
        const u = new URL(req.url ?? "/", redirectUri);
        if (!u.searchParams.has("code") && !u.searchParams.has("error")) {
          res.writeHead(404).end();
          return;
        }
        res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(u.searchParams.has("code") ? "Pronto! Pode fechar esta aba e voltar ao terminal." : "Autorização negada.");
        finish(u.searchParams);
      });
      server.on("error", (e) => console.log(`(não consegui abrir a porta ${target.port}: ${e.message}; cole a URL)`));
      server.listen(Number(target.port), target.hostname);
    }
  });
}

export function randomState(): string {
  return randomBytes(12).toString("hex");
}

/** PKCE no formato do TikTok: verifier com caracteres seguros e challenge = SHA256 em HEX. */
export function tiktokPkce(): { verifier: string; challenge: string } {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const bytes = randomBytes(64);
  const verifier = Array.from(bytes, (b) => chars[b % chars.length]).join("");
  return { verifier, challenge: createHash("sha256").update(verifier).digest("hex") };
}
