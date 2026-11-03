import { storageMode, store } from "@/lib/store";
import { emailConfigured } from "@/lib/notify";

export const dynamic = "force-dynamic";

// Operational check for the admin: is storage reachable, is email configured?
// Reports only booleans and timings — no secrets, no submission data.
export async function GET() {
  const withTimeout = <T,>(p: Promise<T>, ms: number) =>
    Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error(`timed out after ${ms}ms`)), ms))]);

  const out: Record<string, unknown> = {
    storageMode: storageMode(),
    emailConfigured: emailConfigured(),
    env: {
      NETLIFY_BLOBS_CONTEXT: Boolean(process.env.NETLIFY_BLOBS_CONTEXT),
      globalBlobsContext: Boolean((globalThis as { netlifyBlobsContext?: unknown }).netlifyBlobsContext),
      SITE_ID: Boolean(process.env.SITE_ID),
      URL: Boolean(process.env.URL),
    },
  };
  const t = Date.now();
  try {
    await withTimeout(store("ratelimit").setJSON("health/check", { at: t }), 8000);
    const back = await withTimeout(store("ratelimit").getJSON<{ at: number }>("health/check"), 8000);
    out.blobs = { ok: back?.at === t, ms: Date.now() - t };
    const t2 = Date.now();
    const missing = await withTimeout(store("ratelimit").getJSON(`health/missing-${t2}`), 8000);
    out.blobsMissingKey = { ok: missing === null, ms: Date.now() - t2 };
  } catch (e) {
    out.blobsError = { error: (e as Error).message, ms: Date.now() - t };
  }
  return Response.json(out, { headers: { "Cache-Control": "no-store" } });
}
