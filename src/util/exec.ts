import { spawn } from "node:child_process";

export interface RunOptions {
  cwd?: string;
}

/** Executa um programa e devolve o stdout. Lança erro com o fim do stderr se falhar. */
export function run(cmd: string, args: string[], opts: RunOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: opts.cwd, stdio: ["ignore", "pipe", "pipe"] });
    const out: Buffer[] = [];
    let err = "";
    child.stdout.on("data", (d: Buffer) => out.push(d));
    child.stderr.on("data", (d: Buffer) => {
      err += d.toString();
      if (err.length > 40_000) err = err.slice(-40_000);
    });
    child.on("error", (e) =>
      reject(new Error(`Não foi possível executar "${cmd}" (${e.message}). Ele está instalado e no PATH?`)),
    );
    child.on("close", (code) => {
      if (code === 0) return resolve(Buffer.concat(out).toString("utf8"));
      const tail = err.trim().split("\n").slice(-15).join("\n");
      reject(new Error(`${cmd} saiu com código ${code}:\n${tail}`));
    });
  });
}

export async function hasCommand(cmd: string, versionArg = "-version"): Promise<string | null> {
  try {
    const out = await run(cmd, [versionArg]);
    return out.split("\n")[0]?.trim() ?? "";
  } catch {
    return null;
  }
}
