import "server-only";

// Sends the "new inquiry" email to the company inbox. Two providers, tried in
// order; whichever is configured is used:
//   1. Resend  — RESEND_API_KEY, NOTIFY_FROM (verified sender), NOTIFY_TO
//   2. Netlify Forms relay — NETLIFY_FORMS_RELAY=true; the submission is
//      relayed to a hidden Netlify Form and Netlify's form notification emails
//      it to the addresses configured in the Netlify dashboard.
// Returns which channel delivered, or null if none is configured / all failed.

export type Notification = {
  form: "owner-lead" | "contact";
  subject: string;
  replyTo?: string;
  // Flat, human-readable fields; these become the email body / form fields.
  fields: Record<string, string>;
};

export type NotifyResult = { channel: "resend" | "netlify-forms" | null; error?: string };

export const formFieldName = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

async function viaResend(n: Notification): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_TO;
  const from = process.env.NOTIFY_FROM;
  if (!key || !to || !from) return false;
  const rows = Object.entries(n.fields)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#5b6470;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: n.replyTo,
      subject: n.subject,
      html: `<div style="font-family:system-ui,sans-serif;color:#16202b"><h2 style="color:#102d4d">${esc(n.subject)}</h2><table>${rows}</table></div>`,
      text: Object.entries(n.fields).map(([k, v]) => `${k}: ${v}`).join("\n"),
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

async function viaNetlifyForms(n: Notification): Promise<boolean> {
  if (process.env.NETLIFY_FORMS_RELAY !== "true") return false;
  // Field names must match the hidden form in public/__forms.html.
  const body = new URLSearchParams({ "form-name": n.form, subject: n.subject });
  for (const [k, v] of Object.entries(n.fields)) body.set(formFieldName(k), v);
  // Try the netlify.app address first (reachable even before the custom
  // domain's DNS points at Netlify), then the primary URL. A response only
  // counts if Netlify itself served it — never a registrar parking page.
  const bases = [process.env.SITE_NAME && `https://${process.env.SITE_NAME}.netlify.app`, process.env.URL].filter(Boolean) as string[];
  let lastError = "no relay URL available";
  for (const base of [...new Set(bases)]) {
    try {
      const res = await fetch(`${base}/__forms.html`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok && res.headers.get("server")?.toLowerCase() === "netlify") return true;
      lastError = `${new URL(base).host} responded ${res.status}`;
    } catch (e) {
      lastError = `${new URL(base).host}: ${(e as Error).message}`;
    }
  }
  throw new Error(`Netlify Forms relay failed (${lastError})`);
}

export async function notify(n: Notification): Promise<NotifyResult> {
  const errors: string[] = [];
  for (const [channel, fn] of [
    ["resend", viaResend],
    ["netlify-forms", viaNetlifyForms],
  ] as const) {
    try {
      if (await fn(n)) return { channel };
    } catch (e) {
      // Log the failure without any submitted content.
      errors.push(`${channel}: ${(e as Error).message}`);
    }
  }
  if (errors.length) console.error("[notify] delivery failed", errors);
  return { channel: null, error: errors.join("; ") || "no email channel configured" };
}

export function emailConfigured() {
  return Boolean(
    (process.env.RESEND_API_KEY && process.env.NOTIFY_TO && process.env.NOTIFY_FROM) ||
      (process.env.NETLIFY_FORMS_RELAY === "true" && (process.env.URL || process.env.SITE_NAME)),
  );
}
