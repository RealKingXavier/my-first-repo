import { loadLeads, loadMessages } from "@/lib/records";

export const dynamic = "force-dynamic";

// Quote every cell and neutralise leading =,+,-,@ so spreadsheets don't run formulas.
const cell = (v: unknown) => {
  let s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const type = new URL(req.url).searchParams.get("type") === "messages" ? "messages" : "leads";
  const rows: Record<string, unknown>[] = type === "leads" ? await loadLeads() : await loadMessages();
  const cols =
    type === "leads"
      ? ["id", "receivedAt", "name", "email", "phone", "contactMethod", "propertyType", "propertyName", "area", "address", "bedrooms", "bathrooms", "maxGuests", "alreadyListed", "airbnbUrl", "bookingUrl", "vrboUrl", "listingStatus", "amenities", "serviceNeed", "timeline", "message", "photoKeys"]
      : ["id", "receivedAt", "name", "email", "topic", "about", "message"];
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\r\n");
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bahia-dreams-${type}-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
