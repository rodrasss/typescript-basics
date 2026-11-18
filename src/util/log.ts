const color = (code: number) => (s: string) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s);
const gray = color(90);
const yellow = color(33);
const red = color(31);
const green = color(32);

function stamp(): string {
  return gray(new Date().toLocaleTimeString("pt-BR"));
}

export const log = {
  info: (...a: unknown[]) => console.log(stamp(), ...a),
  ok: (...a: unknown[]) => console.log(stamp(), green("✔"), ...a),
  warn: (...a: unknown[]) => console.warn(stamp(), yellow("!"), ...a),
  error: (...a: unknown[]) => console.error(stamp(), red("✖"), ...a),
  step: (s: string) => console.log(stamp(), color(36)(`▶ ${s}`)),
};
