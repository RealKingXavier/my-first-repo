import { loadLeads, loadMessages } from "@/lib/records";
import { storageMode } from "@/lib/store";
import { emailConfigured } from "@/lib/notify";
import { contactTopicLabels, labels } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { timeZone: "America/Costa_Rica", dateStyle: "medium", timeStyle: "short" });

export default async function AdminPage() {
  const mode = storageMode();
  const [leads, messages] = mode === "unavailable" ? [[], []] : await Promise.all([loadLeads(), loadMessages()]);
  return (
    <section className="bg-ivory pb-24 pt-32">
      <div className="container-x">
        <h1 className="font-serif text-5xl text-navy">Inquiries</h1>
        <div className="mt-6 flex flex-wrap gap-3 text-xs">
          <span className={`rounded-full px-3 py-1 ${mode === "netlify-blobs" ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"}`}>
            Storage: {mode === "netlify-blobs" ? "production (Netlify Blobs)" : mode === "local-disk" ? "demo (local disk)" : "not configured"}
          </span>
          <span className={`rounded-full px-3 py-1 ${emailConfigured() ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-900"}`}>
            Email notifications: {emailConfigured() ? "configured" : "not configured"}
          </span>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn btn-navy" href="/admin/export?type=leads">Export owner leads (CSV)</a>
          <a className="btn btn-ghost" href="/admin/export?type=messages">Export messages (CSV)</a>
          <a className="btn btn-ghost" href="/admin/guide">Owner service guide (PDF)</a>
        </div>

        <h2 className="mt-16 font-serif text-3xl text-navy">Owner leads ({leads.length})</h2>
        <div className="mt-6 space-y-4">
          {leads.length === 0 && <p className="text-muted">No owner leads yet.</p>}
          {leads.map((l) => (
            <details key={l.id} className="rounded-sm border border-line bg-white p-5">
              <summary className="cursor-pointer">
                <strong className="text-navy">{l.name}</strong> · {labels.propertyType[l.propertyType]} in {l.area} ·{" "}
                <span className="text-muted">{fmt(l.receivedAt)}</span>
                {!l.notification?.channel && <span className="ml-2 rounded bg-amber-100 px-2 text-xs text-amber-900">email not sent</span>}
              </summary>
              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[12rem_1fr]">
                {[
                  ["Reference", l.id],
                  ["Email", l.email],
                  ["Phone / WhatsApp", l.phone],
                  ["Preferred contact", labels.contactMethod[l.contactMethod]],
                  ["Property name", l.propertyName ?? "—"],
                  ["Address", l.address ?? "—"],
                  ["Bedrooms / baths / guests", `${l.bedrooms} / ${l.bathrooms} / ${l.maxGuests}`],
                  ["Already listed", l.alreadyListed],
                  ["Listing links", [l.airbnbUrl, l.bookingUrl, l.vrboUrl].filter(Boolean).join("  ") || "—"],
                  ["Status", labels.listingStatus[l.listingStatus]],
                  ["Amenities", l.amenities.map((a) => labels.amenity[a]).join(", ") || "—"],
                  ["Looking for", labels.serviceNeed[l.serviceNeed]],
                  ["Timeline", labels.timeline[l.timeline]],
                  ["Message", l.message ?? "—"],
                ].map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="whitespace-pre-wrap break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              {l.photoKeys.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {l.photoKeys.map((k) => (
                    <li key={k}>
                      <a href={`/admin/file?key=${encodeURIComponent(k)}`} target="_blank" rel="noopener noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`/admin/file?key=${encodeURIComponent(k)}`} alt="Owner-submitted photo" className="h-24 w-24 rounded-sm object-cover" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          ))}
        </div>

        <h2 className="mt-16 font-serif text-3xl text-navy">Contact messages ({messages.length})</h2>
        <div className="mt-6 space-y-4">
          {messages.length === 0 && <p className="text-muted">No messages yet.</p>}
          {messages.map((m) => (
            <details key={m.id} className="rounded-sm border border-line bg-white p-5">
              <summary className="cursor-pointer">
                <strong className="text-navy">{m.name}</strong> · {contactTopicLabels[m.topic]}
                {m.about ? ` (${m.about})` : ""} · <span className="text-muted">{fmt(m.receivedAt)}</span>
              </summary>
              <p className="mt-3 text-sm">
                <a className="underline" href={`mailto:${m.email}`}>{m.email}</a>
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
