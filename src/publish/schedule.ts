import type { Config } from "../config";
import type { ClipRecord } from "../state";

/** "18:00-22:30" → minutos do dia [1080, 1350] */
function parseWindow(w: string): [number, number] | null {
  const m = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(w.trim());
  if (!m) return null;
  return [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])];
}

export function inWindow(now: Date, windows: { weekdays: string[]; weekend: string[] }): boolean {
  const day = now.getDay();
  const list = day === 0 || day === 6 ? windows.weekend : windows.weekdays;
  if (!list.length) return true;
  const min = now.getHours() * 60 + now.getMinutes();
  return list.map(parseWindow).some((w) => !!w && min >= w[0] && min <= w[1]);
}

/** Horários (ms) de todos os posts que deram certo. */
export function postTimes(clips: ClipRecord[]): number[] {
  return clips.flatMap((c) =>
    Object.values(c.posts)
      .filter((p) => p?.id)
      .map((p) => Date.parse(p!.at)),
  );
}

/** Pode postar este corte agora? (limite por dia, intervalo mínimo e janelas de horário) */
export function canPostNow(
  now: Date,
  pub: Config["publish"],
  history: number[],
  isLive: boolean,
): { ok: boolean; stop?: boolean; reason?: string } {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const today = history.filter((t) => t >= startOfDay).length;
  if (today >= pub.maxPerDay) return { ok: false, stop: true, reason: `limite de ${pub.maxPerDay} posts por dia atingido` };
  const last = history.length ? Math.max(...history) : 0;
  const waitMin = Math.ceil((last + pub.minGapMinutes * 60_000 - now.getTime()) / 60_000);
  if (waitMin > 0) return { ok: false, stop: true, reason: `próximo post em ${waitMin} min (intervalo mínimo de ${pub.minGapMinutes} min)` };
  if (!(isLive && pub.liveAnytime) && !inWindow(now, pub.windows)) {
    return { ok: false, reason: "fora das janelas de horário (cortes de live encerrada esperam o próximo horário bom)" };
  }
  return { ok: true };
}
