import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { store } from "./store";

// Request hygiene shared by the form endpoints: same-origin check, a time
// trap, and a per-IP rate limit. IPs are only ever stored as salted hashes.

export function clientIp(req: Request) {
  return (
    req.headers.get("x-nf-client-connection-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Humans take more than a few seconds to fill in a form; bots usually don't.
export function tooFast(startedAt: number, minMs = 3000) {
  const elapsed = Date.now() - startedAt;
  return elapsed < minMs || elapsed > 1000 * 60 * 60 * 12;
}

function ipHash(ip: string) {
  const salt = process.env.RATE_LIMIT_SALT || "bahia-dreams";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function rateLimited(req: Request, bucket: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const key = `${bucket}/${ipHash(clientIp(req))}`;
  const s = store("ratelimit");
  const now = Date.now();
  const rec = (await s.getJSON<{ hits: number[] }>(key)) ?? { hits: [] };
  const hits = rec.hits.filter((t) => now - t < windowMs);
  if (hits.length >= limit) return true;
  hits.push(now);
  await s.setJSON(key, { hits });
  return false;
}

export function newId(prefix: string) {
  const d = new Date();
  const stamp = d.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  return `${prefix}_${stamp}_${randomBytes(4).toString("hex")}`;
}

export class StepTimeoutError extends Error {}

// Storage and email calls must never hold a visitor's request open.
export function withTimeout<T>(step: string, p: Promise<T>, ms = 6000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    p.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new StepTimeoutError(`${step} timed out after ${ms}ms`)), ms);
    }),
  ]);
}
