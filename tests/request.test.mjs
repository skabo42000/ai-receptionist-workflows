import assert from "node:assert/strict";
import { test } from "node:test";
import { fromOtherSite } from "../lib/request.ts";
import { rateLimit } from "../lib/rate-limit.ts";

test("public POST routes reject missing, malformed and foreign Origins", () => {
  const request = (origin) => new Request("https://demo.example/api/chat", {
    headers: { host: "demo.example", ...(origin ? { origin } : {}) },
  });
  assert.equal(fromOtherSite(request()), true);
  assert.equal(fromOtherSite(request("not-a-url")), true);
  assert.equal(fromOtherSite(request("https://elsewhere.example")), true);
  assert.equal(fromOtherSite(request("https://demo.example")), false);
});

test("burst guard refuses requests beyond its configured window budget", () => {
  const key = `offline-test-${Math.random()}`;
  assert.equal(rateLimit(key, 2, 60_000).allowed, true);
  assert.equal(rateLimit(key, 2, 60_000).allowed, true);
  const denied = rateLimit(key, 2, 60_000);
  assert.equal(denied.allowed, false);
  assert.ok(denied.retryAfterSeconds > 0);
});
