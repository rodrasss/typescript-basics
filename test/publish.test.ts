import assert from "node:assert/strict";
import { test } from "node:test";
import { tiktokPkce } from "../src/publish/oauth";
import { chunkPlan } from "../src/publish/tiktok";

test("divide o vídeo do TikTok conforme as regras de pedaços", () => {
  assert.deepEqual(chunkPlan(4_000_000), { chunkSize: 4_000_000, count: 1 });
  assert.deepEqual(chunkPlan(10_000_000), { chunkSize: 10_000_000, count: 1 });
  // 25 MB: 2 pedaços de 10 MB, o último leva o resto (15 MB)
  assert.deepEqual(chunkPlan(25_000_000), { chunkSize: 10_000_000, count: 2 });
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
