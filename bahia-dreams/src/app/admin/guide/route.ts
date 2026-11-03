import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

// The owner "Service & Pricing" guide contains fee terms, so it is never in
// /public. Staff download it here and send it privately after a consultation.
export async function GET() {
  try {
    const pdf = await readFile(path.join(process.cwd(), "private", "service-guide.pdf"));
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Bahia-Dreams-Service-and-Pricing.pdf"',
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new Response("Guide not found", { status: 404 });
  }
}
