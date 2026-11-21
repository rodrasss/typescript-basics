import assert from "node:assert/strict";
import { test } from "node:test";
import { tiktokPkce } from "../src/publish/oauth";
import { chunkPlan } from "../src/publish/tiktok";

test("divide o vídeo do TikTok conforme as regras de pedaços", () => {
  assert.deepEqual(chunkPlan(4_000_000), { chunkSize: 4_000_000, count: 1 });
  assert.deepEqual(chunkPlan(10_000_000), { chunkSize: 10_000_000, count: 1 });
  // até 64 MB: um pedaço só do tamanho do arquivo (19 MB com pedaço de 10 MB era recusado)
  assert.deepEqual(chunkPlan(19_792_594), { chunkSize: 19_792_594, count: 1 });
  assert.deepEqual(chunkPlan(64_000_000), { chunkSize: 64_000_000, count: 1 });
  // acima disso: pedaços de 10 MB, o último leva o resto
  assert.deepEqual(chunkPlan(65_000_000), { chunkSize: 10_000_000, count: 6 });
  const big = chunkPlan(130_000_123);
  assert.equal(big.count, 13);
  const last = 130_000_123 - (big.count - 1) * big.chunkSize;
  assert.ok(last >= big.chunkSize && last <= 128_000_000);
});

test("PKCE do TikTok usa SHA256 em hex", () => {
  const { verifier, challenge } = tiktokPkce();
  assert.match(verifier, /^[A-Za-z0-9\-._~]{43,128}$/);
  assert.match(challenge, /^[0-9a-f]{64}$/);
});

test("crédito aponta para a plataforma de onde veio a live", async () => {
  const { creditFor } = await import("../src/config");
  const s = { name: "TCK", twitch: "tck10", kick: "tck10", credit: "twitch.tv/tck10", clipPermission: true };
  assert.equal(creditFor(s, "https://kick.com/tck10/videos/abc"), "kick.com/tck10");
  assert.equal(creditFor(s, "https://www.twitch.tv/videos/123"), "twitch.tv/tck10");
  assert.equal(creditFor({ ...s, kick: undefined }, "https://kick.com/x/videos/abc"), "twitch.tv/tck10");
});
