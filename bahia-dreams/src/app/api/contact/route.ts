import { NextResponse } from "next/server";
import { antiSpamSchema, contactSchema, contactTopicLabels, fieldErrors } from "@/lib/validation";
import { newId, rateLimited, sameOrigin, tooFast, withTimeout } from "@/lib/guard";
import { StorageUnavailableError, store } from "@/lib/store";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, message: "Invalid request." }, 403);
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const spam = antiSpamSchema.safeParse(raw);
  if (!spam.success) return json({ ok: true });
  if (tooFast(spam.data.startedAt)) return json({ ok: false, message: "That was quick — please review your message and send again." }, 400);

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, errors: fieldErrors(parsed.error) }, 400);
  const msg = parsed.data;

  try {
    if (await withTimeout("rate-limit", rateLimited(req, "contact", 5))) {
      return json({ ok: false, message: "We’ve received several messages from this connection. Please try again later or email us." }, 429);
    }
    const id = newId("msg");
    const record = { id, receivedAt: new Date().toISOString(), ...msg, notification: null as unknown };
    await withTimeout("store", store("messages").setJSON(id, record));

    record.notification = await withTimeout("notify", notify({
      form: "contact",
      subject: `New message — ${contactTopicLabels[msg.topic]}${msg.about ? ` (${msg.about})` : ""}`,
      replyTo: msg.email,
      fields: {
        Reference: id,
        Name: msg.name,
        Email: msg.email,
        Topic: contactTopicLabels[msg.topic],
        About: msg.about ?? "—",
        Message: msg.message,
      },
    }), 9000);
    await withTimeout("store-update", store("messages").setJSON(id, record));
    return json({ ok: true, id });
  } catch (e) {
    if (e instanceof StorageUnavailableError) {
      return json({ ok: false, fallback: true, message: "Online messages are temporarily unavailable." }, 503);
    }
    console.error("[contact] failed to save message:", (e as Error).message);
    return json({ ok: false, fallback: true, message: "Something went wrong sending your message." }, 500);
  }
}
