import { store } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get("key") ?? "";
  if (!/^lead_[\w]+\/\d+\.(jpeg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });
  const file = await store("lead-files").getBytes(key);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file.data, {
    headers: { "Content-Type": file.contentType, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" },
  });
}
