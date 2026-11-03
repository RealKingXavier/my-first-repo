import { NextResponse } from "next/server";
import { antiSpamSchema, fieldErrors, labels, ownerLeadSchema, uploadRules } from "@/lib/validation";
import { newId, rateLimited, sameOrigin, tooFast, withTimeout } from "@/lib/guard";
import { StorageUnavailableError, store } from "@/lib/store";
import { notify } from "@/lib/notify";
import { site } from "@/config/site";

export const runtime = "nodejs";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function sniffImage(buf: Uint8Array): string | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "image/png";
  if (String.fromCharCode(...buf.slice(0, 4)) === "RIFF" && String.fromCharCode(...buf.slice(8, 12)) === "WEBP") return "image/webp";
  return null;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, message: "Invalid request." }, 403);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ ok: false, message: "The submission was too large or malformed. Try fewer photos." }, 413);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? "{}"));
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }

  const spam = antiSpamSchema.safeParse(raw);
  if (!spam.success) return json({ ok: true }); // honeypot filled: accept silently, store nothing
  if (tooFast(spam.data.startedAt, 8000)) return json({ ok: false, message: "That was quick — please review the form and submit again." }, 400);

  const parsed = ownerLeadSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, errors: fieldErrors(parsed.error) }, 400);
  const lead = parsed.data;

  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > uploadRules.maxFiles) return json({ ok: false, errors: { photos: `Up to ${uploadRules.maxFiles} photos, please.` } }, 400);
  if (files.length && !lead.photoConsent) return json({ ok: false, errors: { photoConsent: "Please confirm you have the right to share these photos." } }, 400);

  const images: { data: ArrayBuffer; type: string }[] = [];
  for (const f of files) {
    if (f.size > uploadRules.maxBytesPerFile) return json({ ok: false, errors: { photos: "One of the photos is too large." } }, 400);
    const data = await f.arrayBuffer();
    const type = sniffImage(new Uint8Array(data.slice(0, 12)));
    if (!type) return json({ ok: false, errors: { photos: "Photos must be JPEG, PNG or WebP images." } }, 400);
    images.push({ data, type });
  }

  try {
    if (await withTimeout("rate-limit", rateLimited(req, "leads", 4))) {
      return json({ ok: false, message: "We’ve received several submissions from this connection. Please try again later or email us." }, 429);
    }

    const id = newId("lead");
    const photoKeys: string[] = [];
    for (const [i, img] of images.entries()) {
      const key = `${id}/${i + 1}.${img.type.split("/")[1]}`;
      await withTimeout("photo-upload", store("lead-files").setBytes(key, img.data, img.type), 10000);
      photoKeys.push(key);
    }

    const record = {
      id,
      receivedAt: new Date().toISOString(),
      ...lead,
      photoKeys,
      notification: null as null | { channel: string | null; error?: string },
    };
    await withTimeout("store", store("leads").setJSON(id, record));

    const result = await withTimeout("notify", notify({
      form: "owner-lead",
      subject: `New property inquiry — ${lead.propertyName || labels.propertyType[lead.propertyType]} in ${lead.area}`,
      replyTo: lead.email,
      fields: {
        "Reference": id,
        "Name": lead.name,
        "Email": lead.email,
        "Phone / WhatsApp": lead.phone,
        "Preferred contact": labels.contactMethod[lead.contactMethod],
        "Property type": labels.propertyType[lead.propertyType],
        "Property name": lead.propertyName ?? "—",
        "Area": lead.area,
        "Address": lead.address ?? "—",
        "Bedrooms / bathrooms / max guests": `${lead.bedrooms} / ${lead.bathrooms} / ${lead.maxGuests}`,
        "Already listed": lead.alreadyListed,
        "Listing links": [lead.airbnbUrl, lead.bookingUrl, lead.vrboUrl].filter(Boolean).join("  ") || "—",
        "Status": labels.listingStatus[lead.listingStatus],
        "Amenities": lead.amenities.map((a) => labels.amenity[a]).join(", ") || "—",
        "Looking for": labels.serviceNeed[lead.serviceNeed],
        "Timeline": labels.timeline[lead.timeline],
        "Message": lead.message ?? "—",
        "Photos": photoKeys.length ? `${photoKeys.length} — view in ${site.url}/admin` : "None",
      },
    }), 9000);
    record.notification = result;
    await withTimeout("store-update", store("leads").setJSON(id, record));

    return json({ ok: true, id });
  } catch (e) {
    if (e instanceof StorageUnavailableError) {
      return json({ ok: false, fallback: true, message: "Online submissions are temporarily unavailable." }, 503);
    }
    console.error("[leads] failed to save submission:", (e as Error).message);
    return json({ ok: false, fallback: true, message: "Something went wrong saving your inquiry." }, 500);
  }
}
