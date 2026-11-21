/**
 * TESTE TÉCNICO sem internet e sem chaves: gera um vídeo FALSO (barras coloridas
 * do ffmpeg) com duas explosões de volume, confere se a análise acha os picos e
 * se a montagem do vídeo vertical funciona. Não usa nenhuma live de verdade —
 * os cortes reais ficam em output/<streamer>/.
 *
 *   npm run smoke
 */
import assert from "node:assert/strict";
import { join } from "node:path";
import { frameTimes, framesFromFile } from "../src/analysis/frames";
import { excitementCurve, loudnessPerSecond, pickPeaks } from "../src/analysis/loudness";
import { OUTPUT_DIR, ensureDir } from "../src/paths";
import { renderClip } from "../src/render/render";
import { run } from "../src/util/exec";

const dir = ensureDir(join(OUTPUT_DIR, "teste-tecnico-sintetico"));
const vod = join(dir, "vod-sintetico.mp4");

console.log("1/5 gerando VOD sintético de 6 min (picos em 2:00 e 4:30)…");
await run("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=30:duration=360",
  "-f", "lavfi", "-i",
  "aevalsrc='0.03*sin(2*PI*220*t)*(1+0.5*sin(t))+(between(t,120,126)+between(t,270,275))*0.6*sin(2*PI*440*t)':s=16000:d=360",
  "-c:v", "libx264", "-preset", "ultrafast", "-crf", "30", "-c:a", "aac", "-shortest", vod,
]);

console.log("2/5 analisando o áudio…");
const db = await loudnessPerSecond(vod);
const peaks = pickPeaks(excitementCurve(db), { count: 5, minScore: 2 });
console.log("   picos:", peaks.map((p) => `${p.t}s (+${p.score.toFixed(1)} dB)`).join(", "));
assert.equal(peaks.length, 2, "esperava 2 picos");
assert.ok(Math.abs(peaks[0].t - 123) <= 4 && Math.abs(peaks[1].t - 272) <= 4, "picos fora do lugar");

console.log("3/5 renderizando corte vertical com legenda…");
const words = "NÃO ACREDITO que ele fez isso com a viatura mano olha isso KKKKK".split(" ").map((text, i) => ({
  text,
  start: 1 + i * 0.45,
  end: 1 + i * 0.45 + 0.4,
}));
const out = await renderClip({
  input: vod,
  offset: 110,
  duration: 20,
  words,
  hookTitle: "TESTE TÉCNICO (VÍDEO SINTÉTICO)",
  credit: "twitch.tv/exemplo",
  layout: "blur",
  zoom: 1.15,
  captions: true,
  font: "Arial",
  highlightColor: "#FFE600",
  preset: "veryfast",
  output: join(dir, "corte-smoke.mp4"),
  workDir: join(dir, "work"),
});
const probe = await run("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type,width,height:format=duration", "-of", "json", out]);
const info = JSON.parse(probe) as { streams: Array<{ codec_type: string; width?: number; height?: number }>; format: { duration: string } };
const v = info.streams.find((s) => s.codec_type === "video")!;
assert.equal(`${v.width}x${v.height}`, "1080x1920");
assert.ok(info.streams.some((s) => s.codec_type === "audio"), "sem áudio");
assert.ok(Math.abs(Number(info.format.duration) - 20) < 0.5, `duração ${info.format.duration}`);

await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "3", "-i", out, "-frames:v", "1", join(dir, "frame.png")]);

console.log("4/5 layout com facecam (split) e frames para o Claude…");
const split = await renderClip({
  input: vod,
  offset: 110,
  duration: 8,
  words,
  hookTitle: "TESTE TÉCNICO: LAYOUT CÂMERA",
  credit: "twitch.tv/exemplo",
  layout: "split",
  facecam: { x: 0.7, y: 0, w: 0.3, h: 0.35 },
  zoom: 1,
  captions: true,
  font: "Arial",
  highlightColor: "#FFE600",
  preset: "veryfast",
  output: join(dir, "corte-split.mp4"),
  workDir: join(dir, "work-split"),
});
const sp = JSON.parse(await run("ffprobe", ["-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "json", split])) as {
  streams: Array<{ width: number; height: number }>;
};
assert.equal(`${sp.streams[0].width}x${sp.streams[0].height}`, "1080x1920");
await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "3", "-i", split, "-frames:v", "1", join(dir, "frame-split.png")]);
const frames = await framesFromFile(vod, frameTimes(100, 175, 3, 123), dir, "cand");
assert.equal(frames.length, 3, "esperava 3 frames");

console.log("5/5 edição da IA: corte de tempo morto, zoom de reação e palavra em destaque…");
const edited = await renderClip({
  input: vod,
  offset: 110,
  duration: 20,
  segments: [
    { start: 0, end: 6 },
    { start: 9, end: 20 },
  ],
  zooms: [{ start: 10, end: 11.5 }],
  words,
  emphasis: ["viatura"],
  emphasisColor: "#4DFF6A",
  hookTitle: "TESTE TÉCNICO: CORTES E ZOOM",
  credit: "twitch.tv/exemplo",
  layout: "blur",
  zoom: 1.15,
  captions: true,
  font: "Arial",
  highlightColor: "#FFE600",
  preset: "veryfast",
  output: join(dir, "corte-editado.mp4"),
  workDir: join(dir, "work-edit"),
});
const ed = JSON.parse(await run("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height", "-of", "json", edited])) as {
  streams: Array<{ codec_type: string; width?: number; height?: number }>;
  format: { duration: string };
};
assert.ok(Math.abs(Number(ed.format.duration) - 17) < 0.5, `duração editada ${ed.format.duration} (esperado 17s)`);
assert.ok(ed.streams.some((x) => x.codec_type === "audio"), "corte editado sem áudio");
await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-ss", "10.5", "-i", edited, "-frames:v", "1", join(dir, "frame-zoom.png")]);

console.log(
  `\nOK! Teste técnico passou (vídeos de barras coloridas em ${dir} — não é live de verdade).` +
    `\nOs cortes reais aparecem em output/<streamer>/ depois de rodar vod/watch com as chaves.`,
);
