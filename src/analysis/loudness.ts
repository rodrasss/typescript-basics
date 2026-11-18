import { spawn } from "node:child_process";

/**
 * Detecção de "momentos quentes" pelo áudio.
 *
 * Risadas, gritos e sustos fazem o volume subir bem acima do normal da live.
 * Calculamos o volume (dBFS) de cada segundo, comparamos com a mediana dos
 * ~5 minutos ao redor (o "normal" daquele trecho) e suavizamos para premiar
 * reações que duram alguns segundos em vez de um estalo isolado.
 */

const SILENCE_DB = -90;

function toDb(meanSquare: number): number {
  return meanSquare > 1e-10 ? 10 * Math.log10(meanSquare) : -100;
}

/** Volume em dBFS de cada segundo do arquivo (decodifica com ffmpeg, mono 8 kHz). */
export function loudnessPerSecond(audioPath: string, sampleRate = 8000): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const ff = spawn(
      "ffmpeg",
      ["-hide_banner", "-loglevel", "error", "-i", audioPath, "-vn", "-ac", "1", "-ar", String(sampleRate), "-f", "s16le", "-"],
      { stdio: ["ignore", "pipe", "pipe"] },
    );
    const out: number[] = [];
    let sumSq = 0;
    let count = 0;
    let leftover: Buffer | null = null;
    let stderr = "";

    ff.stdout.on("data", (chunk: Buffer) => {
      const buf: Buffer = leftover ? Buffer.concat([leftover, chunk]) : chunk;
      const usable = buf.length - (buf.length % 2);
      for (let i = 0; i < usable; i += 2) {
        const s = buf.readInt16LE(i) / 32768;
        sumSq += s * s;
        if (++count === sampleRate) {
          out.push(toDb(sumSq / count));
          sumSq = 0;
          count = 0;
        }
      }
      leftover = usable < buf.length ? buf.subarray(usable) : null;
    });
    ff.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
    ff.on("error", (e) => reject(new Error(`ffmpeg não encontrado: ${e.message}`)));
    ff.on("close", (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg falhou ao ler o áudio:\n${stderr.slice(-2000)}`));
      if (count > sampleRate / 4) out.push(toDb(sumSq / count));
      resolve(out);
    });
  });
}

/**
 * Quantos dB cada segundo está acima do "normal" ao redor dele.
 * @param baselineWindow janela (s) da mediana usada como referência
 * @param smoothRadius raio (s) da média móvel aplicada no resultado
 */
export function excitementCurve(db: number[], baselineWindow = 300, smoothRadius = 2): number[] {
  const n = db.length;
  if (n === 0) return [];
  const half = Math.floor(baselineWindow / 2);
  const stride = 10; // recalcula a mediana a cada 10 s (suficiente e bem mais rápido)
  const baseline: number[] = [];
  for (let i = 0; i < n; i += stride) {
    const slice = db.slice(Math.max(0, i - half), Math.min(n, i + half)).filter((v) => v > SILENCE_DB);
    slice.sort((a, b) => a - b);
    baseline.push(slice.length ? slice[Math.floor(slice.length / 2)] : SILENCE_DB);
  }
  const dev = db.map((v, i) => (v <= SILENCE_DB ? 0 : v - baseline[Math.floor(i / stride)]));

  // média móvel com soma acumulada
  const prefix = new Float64Array(n + 1);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + dev[i];
  return dev.map((_, i) => {
    const lo = Math.max(0, i - smoothRadius);
    const hi = Math.min(n, i + smoothRadius + 1);
    return (prefix[hi] - prefix[lo]) / (hi - lo);
  });
}

export interface Peak {
  /** segundo do pico */
  t: number;
  /** dB acima do normal */
  score: number;
}

/** Pega os maiores picos, mantendo uma distância mínima entre eles. */
export function pickPeaks(
  curve: number[],
  { count, minGap = 75, minScore = 2 }: { count: number; minGap?: number; minScore?: number },
): Peak[] {
  const order = curve.map((v, i) => [v, i] as const).sort((a, b) => b[0] - a[0]);
  const picked: Peak[] = [];
  for (const [v, i] of order) {
    if (picked.length >= count || v < minScore) break;
    if (picked.every((p) => Math.abs(p.t - i) >= minGap)) picked.push({ t: i, score: v });
  }
  return picked.sort((a, b) => a.t - b.t);
}

/** Resumo compacto da intensidade (a cada `step` s) para o Claude enxergar onde está a reação. */
export function intensityProfile(curve: number[], start: number, end: number, step = 2): number[] {
  const out: number[] = [];
  for (let t = Math.floor(start); t < end; t += step) {
    const slice = curve.slice(t, Math.min(curve.length, t + step));
    out.push(slice.length ? Math.round(Math.max(...slice)) : 0);
  }
  return out;
}
