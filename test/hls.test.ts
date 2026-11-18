import assert from "node:assert/strict";
import { test } from "node:test";
import { parseMediaPlaylist, pickVariant, segmentsFor } from "../src/sources/hls";

const media = `#EXTM3U
#EXT-X-VERSION:6
#EXT-X-TARGETDURATION:10
#EXT-X-MAP:URI="init-0.mp4"
#EXTINF:10.000,
0.mp4
#EXTINF:10.000,
1.mp4
#EXTINF:10.000,
2.mp4
#EXTINF:7.500,
3.mp4
#EXT-X-ENDLIST`;

test("lê a playlist com init e tempos acumulados", () => {
  const pl = parseMediaPlaylist(media, "https://cdn.example/vod/480p30/index-dvr.m3u8");
  assert.equal(pl.map, "https://cdn.example/vod/480p30/init-0.mp4");
  assert.equal(pl.encrypted, false);
  assert.deepEqual(
    pl.segments.map((s) => [s.uri.split("/").pop(), s.start]),
    [["0.mp4", 0], ["1.mp4", 10], ["2.mp4", 20], ["3.mp4", 30]],
  );
});

test("seleciona só os segmentos que cobrem o trecho", () => {
  const pl = parseMediaPlaylist(media, "https://cdn.example/x/index.m3u8");
  assert.deepEqual(segmentsFor(pl.segments, 12, 25).map((s) => s.start), [10, 20]);
  assert.deepEqual(segmentsFor(pl.segments, 20, 30).map((s) => s.start), [20]);
});

test("detecta criptografia e escolhe a variante de maior bitrate", () => {
  assert.equal(parseMediaPlaylist(`#EXT-X-KEY:METHOD=AES-128,URI="k"\n#EXTINF:4,\na.ts`, "https://x/").encrypted, true);
  const master = `#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=6000000,RESOLUTION=1920x1080
1080p/index.m3u8`;
  assert.equal(pickVariant(master, "https://x/master.m3u8"), "https://x/1080p/index.m3u8");
});
