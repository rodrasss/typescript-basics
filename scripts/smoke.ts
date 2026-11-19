/**
 * Teste de fumaça sem internet e sem chaves: gera um "VOD" sintético com
 * duas explosões de volume, confere se a análise acha os picos e renderiza
 * um corte vertical legendado em output/smoke/.
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

const dir = ensureDir(join(OUTPUT_DIR, "smoke"));
const vod = join(dir, "vod-sintetico.mp4");

console.log("1/4 gerando VOD sintético de 6 min (picos em 2:00 e 4:30)…");
await run("ffmpeg", [
  "-hide_banner", "-loglevel", "error", "-y",
  "-f", "lavfi", "-i", "testsrc2=size=1280x720:rate=30:duration=360",
  "-f", "lavfi", "-i",
  "aevalsrc='0.03*sin(2*PI*220*t)*(1+0.5*sin(t))+(between(t,120,126)+between(t,270,275))*0.6*sin(2*PI*440*t)':s=16000:d=360",
  "-c:v", "libx264", "-preset", "ultrafast", "-crf", "30", "-c:a", "aac", "-shortest", vod,
]);

console.log("2/4 analisando o áudio…");
const db = await loudnessPerSecond(vod);
const peaks = pickPeaks(excitementCurve(db), { count: 5, minScore: 2 });
console.log("   picos:", peaks.map((p) => `${p.t}s (+${p.score.toFixed(1)} dB)`).join(", "));
assert.equal(peaks.length, 2, "esperava 2 picos");
assert.ok(Math.abs(peaks[0].t - 123) <= 4 && Math.abs(peaks[1].t - 272) <= 4, "picos fora do lugar");

console.log("3/4 renderizando corte vertical com legenda…");
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
  hookTitle: "ELE ROUBOU A VIATURA DO PRÓPRIO CHEFE",
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

console.log("4/4 layout com facecam (split) e frames para o Claude…");
const split = await renderClip({
  input: vod,
  offset: 110,
  duration: 8,
  words,
  hookTitle: "LAYOUT COM FACECAM",
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

console.log(`\nOK! Cortes: ${out} e ${split}\nFrames de exemplo: ${join(dir, "frame.png")} e ${join(dir, "frame-split.png")}`);
