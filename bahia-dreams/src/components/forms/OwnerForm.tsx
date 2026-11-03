"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  fieldErrors,
  labels,
  ownerAmenities,
  stepSchemas,
  uploadRules,
} from "@/lib/validation";
import { site, whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, Check, Close } from "@/components/Icons";
import { ChoiceGroup, describedBy, Field, Honeypot } from "./FormParts";

type Values = Record<string, unknown> & { amenities: string[] };

const steps = [
  { title: "The property", short: "Property" },
  { title: "Where it stands today", short: "Status" },
  { title: "What you’re looking for", short: "Needs" },
  { title: "How to reach you", short: "Contact" },
];

const SUCCESS = "Thank you for considering Bahia Dreams. We’ve received your property inquiry and will be in touch.";

type Photo = { file: File; url: string };

// Downscale in the browser so phone photos upload quickly and fit the limit.
async function compress(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, uploadRules.maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const q of [0.82, 0.7, 0.55]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", q));
    if (blob && blob.size <= uploadRules.maxBytesPerFile) {
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  }
  throw new Error("too large");
}

export function OwnerForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({ amenities: [], photoConsent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [failure, setFailure] = useState<{ message: string; fallback: boolean } | null>(null);
  const startedAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step, status]);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos]);

  const set = (k: string, v: unknown) => {
    if (!startedAt.current) {
      startedAt.current = Date.now();
      track("Owner Form Start");
    }
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const text = (k: string) => (typeof values[k] === "string" ? (values[k] as string) : values[k] == null ? "" : String(values[k]));
  const err = (k: string) => errors[k] || undefined;

  function validate(i: number) {
    const r = stepSchemas[i].safeParse(values);
    const fe = r.success ? {} : fieldErrors(r.error);
    if (i === 1 && photos.length > 0 && values.photoConsent !== true) {
      fe.photoConsent = "Please confirm you have the right to share these photos.";
    }
    if (!Object.keys(fe).length) {
      setErrors({});
      return true;
    }
    setErrors(fe);
    requestAnimationFrame(() => {
      const first = Object.keys(fe)[0];
      document.querySelector<HTMLElement>(`[name="${first}"], #${first}`)?.focus();
    });
    return false;
  }

  async function addPhotos(list: FileList | null) {
    if (!list) return;
    setPhotoNote(null);
    const room = uploadRules.maxFiles - photos.length;
    const chosen = Array.from(list).slice(0, room);
    if (list.length > room) setPhotoNote(`Up to ${uploadRules.maxFiles} photos — the first ${room || 0} were kept.`);
    const out: Photo[] = [];
    for (const f of chosen) {
      if (!f.type.startsWith("image/")) {
        setPhotoNote("Only image files can be attached.");
        continue;
      }
      try {
        const c = await compress(f);
        out.push({ file: c, url: URL.createObjectURL(c) });
      } catch {
        setPhotoNote(`“${f.name}” couldn’t be read. JPEG, PNG or WebP photos work best.`);
      }
    }
    setPhotos((p) => [...p, ...out]);
  }

  async function submit() {
    if (!validate(3)) return;
    setStatus("sending");
    setFailure(null);
    const fd = new FormData();
    fd.set("payload", JSON.stringify({ ...values, website: honeypot, startedAt: startedAt.current || Date.now() }));
    photos.forEach((p) => fd.append("photos", p.file));
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
        track("Owner Form Complete");
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        const stepWithError = stepSchemas.findIndex((s) => Object.keys(data.errors).some((k) => k in s.shape));
        setStep(stepWithError >= 0 ? stepWithError : step);
        if (data.errors.photos || data.errors.photoConsent) setStep(1);
        setStatus("idle");
        return;
      }
      setFailure({ message: data.message ?? "Something went wrong.", fallback: Boolean(data.fallback) || res.status >= 500 });
      setStatus("failed");
    } catch {
      setFailure({ message: "We couldn’t reach our server.", fallback: true });
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-sm border border-line bg-white p-8 text-center md:p-14" role="status">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white">
          <Check className="h-7 w-7" />
        </span>
        <h2 ref={headingRef} tabIndex={-1} className="mt-8 font-serif text-3xl text-navy outline-none md:text-4xl">
          Inquiry received
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-ink/80">{SUCCESS}</p>
        <Link href="/property-management" className="btn btn-ghost mt-10">
          Back to Property Management
        </Link>
      </div>
    );
  }

  const wa = whatsappLink("Hello Bahia Dreams, I'd like to talk about managing my property.");

  return (
    <div className="rounded-sm border border-line bg-white p-6 md:p-12">
      <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.short} aria-current={i === step ? "step" : undefined}>
            <span className={`block h-1 rounded-full ${i <= step ? "bg-coral" : "bg-line"}`} />
            <span className={`mt-3 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${i === step ? "text-navy" : "text-muted"}`}>
              <span className="sr-only">Step {i + 1} of 4: </span>
              <span className="hidden sm:inline">{i + 1}. </span>
              {s.short}
              {i < step && <span className="sr-only"> (completed)</span>}
            </span>
          </li>
        ))}
      </ol>

      <form
        noValidate
        className="relative mt-10"
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 3) {
            if (validate(step)) setStep(step + 1);
          } else submit();
        }}
      >
        <Honeypot value={honeypot} onChange={setHoneypot} />
        <p className="eyebrow text-coral-deep">Step {step + 1} of 4</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-3 font-serif text-3xl text-navy outline-none md:text-4xl">
          {steps[step].title}
        </h2>

        <div className="mt-10 space-y-8">
          {step === 0 && (
            <>
              <ChoiceGroup name="propertyType" legend="Property type" options={labels.propertyType} value={values.propertyType as never} onChange={(v) => set("propertyType", v)} error={err("propertyType")} columns={4} />
              <div className="grid gap-8 md:grid-cols-2">
                <Field id="propertyName" label="Property name" optional error={err("propertyName")}>
                  <input id="propertyName" name="propertyName" className="field" value={text("propertyName")} onChange={(e) => set("propertyName", e.target.value)} autoComplete="off" />
                </Field>
                <Field id="area" label="City or area" error={err("area")} hint="For example: Herradura, Jacó, Punta Leona">
                  <input id="area" name="area" className="field" value={text("area")} onChange={(e) => set("area", e.target.value)} aria-invalid={!!err("area")} aria-describedby={describedBy("area", err("area"), "x")} autoComplete="address-level2" />
                </Field>
              </div>
              <Field id="address" label="Full address" optional error={err("address")} hint="Only if you're comfortable sharing it now.">
                <input id="address" name="address" className="field" value={text("address")} onChange={(e) => set("address", e.target.value)} aria-describedby={describedBy("address", err("address"), "x")} autoComplete="street-address" />
              </Field>
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {[
                  ["bedrooms", "Bedrooms", "1"],
                  ["bathrooms", "Bathrooms", "0.5"],
                  ["maxGuests", "Max guests", "1"],
                ].map(([k, l, s]) => (
                  <Field key={k} id={k} label={l} error={err(k)}>
                    <input id={k} name={k} type="number" inputMode="decimal" min={0} step={s} className="field" value={text(k)} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)} aria-describedby={describedBy(k, err(k))} />
                  </Field>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <ChoiceGroup name="alreadyListed" legend="Is it already listed for rent?" options={{ yes: "Yes", no: "No" }} value={values.alreadyListed as never} onChange={(v) => set("alreadyListed", v)} error={err("alreadyListed")} />
              {values.alreadyListed === "yes" && (
                <div className="grid gap-6">
                  {[
                    ["airbnbUrl", "Airbnb link"],
                    ["bookingUrl", "Booking.com link"],
                    ["vrboUrl", "Vrbo link"],
                  ].map(([k, l]) => (
                    <Field key={k} id={k} label={l} optional error={err(k)}>
                      <input id={k} name={k} type="url" inputMode="url" placeholder="https://" className="field" value={text(k)} onChange={(e) => set(k, e.target.value)} aria-invalid={!!err(k)} aria-describedby={describedBy(k, err(k))} />
                    </Field>
                  ))}
                </div>
              )}
              <ChoiceGroup name="listingStatus" legend="Current status" options={labels.listingStatus} value={values.listingStatus as never} onChange={(v) => set("listingStatus", v)} error={err("listingStatus")} />
              <fieldset>
                <legend className="field-label">
                  Amenities <span className="ml-2 font-normal normal-case tracking-normal text-muted">(optional)</span>
                </legend>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {ownerAmenities.map((a) => (
                    <label key={a} className="choice">
                      <input
                        type="checkbox"
                        checked={values.amenities.includes(a)}
                        onChange={(e) => set("amenities", e.target.checked ? [...values.amenities, a] : values.amenities.filter((x) => x !== a))}
                      />
                      <span>{labels.amenity[a]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div>
                <p className="field-label">
                  Photos <span className="ml-2 font-normal normal-case tracking-normal text-muted">(optional, up to {uploadRules.maxFiles})</span>
                </p>
                <label className="choice w-full cursor-pointer justify-center border-dashed py-6 text-center text-sm text-muted">
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} disabled={photos.length >= uploadRules.maxFiles} />
                  <span>{photos.length >= uploadRules.maxFiles ? "Photo limit reached" : "Choose photos to attach"}</span>
                </label>
                <p className="mt-2 text-sm text-muted">Photos are resized on your device and stored privately — only our team can see them.</p>
                {(photoNote || err("photos")) && <p className="field-error" role="alert">{err("photos") ?? photoNote}</p>}
                {photos.length > 0 && (
                  <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {photos.map((p, i) => (
                      <li key={p.url} className="relative aspect-square overflow-hidden rounded-sm bg-sand">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.url} alt={`Attached photo ${i + 1}`} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => setPhotos((ps) => ps.filter((x) => x !== p))} className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy/80 text-white" aria-label={`Remove photo ${i + 1}`}>
                          <Close className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {photos.length > 0 && (
                  <label className="mt-4 flex items-start gap-3 text-sm text-ink/80">
                    <input id="photoConsent" name="photoConsent" type="checkbox" className="mt-1 h-4 w-4 accent-navy" checked={values.photoConsent === true} onChange={(e) => set("photoConsent", e.target.checked)} aria-invalid={!!err("photoConsent")} aria-describedby={err("photoConsent") ? "photoConsent-error" : undefined} />
                    <span>I own these photos or have permission to share them, and I agree that Bahia Dreams may store them privately to review my property.</span>
                  </label>
                )}
                {err("photoConsent") && <p id="photoConsent-error" className="field-error">{err("photoConsent")}</p>}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <ChoiceGroup name="serviceNeed" legend="What are you looking for?" options={labels.serviceNeed} value={values.serviceNeed as never} onChange={(v) => set("serviceNeed", v)} error={err("serviceNeed")} />
              <ChoiceGroup name="timeline" legend="When would you like to start?" options={labels.timeline} value={values.timeline as never} onChange={(v) => set("timeline", v)} error={err("timeline")} />
              <Field id="message" label="Anything else we should know?" optional error={err("message")}>
                <textarea id="message" name="message" rows={5} className="field" value={text("message")} onChange={(e) => set("message", e.target.value)} maxLength={3000} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid gap-8 md:grid-cols-2">
                <Field id="name" label="Your name" error={err("name")}>
                  <input id="name" name="name" className="field" autoComplete="name" value={text("name")} onChange={(e) => set("name", e.target.value)} aria-invalid={!!err("name")} aria-describedby={describedBy("name", err("name"))} />
                </Field>
                <Field id="email" label="Email" error={err("email")}>
                  <input id="email" name="email" type="email" className="field" autoComplete="email" value={text("email")} onChange={(e) => set("email", e.target.value)} aria-invalid={!!err("email")} aria-describedby={describedBy("email", err("email"))} />
                </Field>
              </div>
              <Field id="phone" label="WhatsApp or phone" error={err("phone")} hint="Include your country code, e.g. +1 or +506.">
                <input id="phone" name="phone" type="tel" className="field" autoComplete="tel" value={text("phone")} onChange={(e) => set("phone", e.target.value)} aria-invalid={!!err("phone")} aria-describedby={describedBy("phone", err("phone"), "x")} />
              </Field>
              <ChoiceGroup name="contactMethod" legend="Preferred contact method" options={labels.contactMethod} value={values.contactMethod as never} onChange={(v) => set("contactMethod", v)} error={err("contactMethod")} columns={4} />
              <div>
                <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
                  <input id="consent" name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-navy" checked={values.consent === true} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!err("consent")} aria-describedby={err("consent") ? "consent-error" : undefined} />
                  <span>
                    I agree that Bahia Dreams may use these details to contact me about managing my property, as described in the{" "}
                    <Link href="/privacy" className="underline" target="_blank">privacy policy</Link>.
                  </span>
                </label>
                {err("consent") && <p id="consent-error" className="field-error">{err("consent")}</p>}
              </div>
            </>
          )}
        </div>

        {status === "failed" && failure && (
          <div role="alert" className="mt-10 rounded-sm border border-coral/40 bg-coral/5 p-6">
            <p className="font-semibold text-navy">{failure.message}</p>
            {failure.fallback && (
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                Your details haven’t been sent. Please try again in a moment, or reach us directly at{" "}
                <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                {wa && (
                  <>
                    {" "}or on{" "}
                    <a className="underline" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </>
                )}
                .
              </p>
            )}
          </div>
        )}

        <div className="mt-12 flex flex-col-reverse gap-3 border-t border-line pt-8 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button type="button" className="btn btn-ghost" onClick={() => { setErrors({}); setStep(step - 1); }}>
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn-coral" disabled={status === "sending"} aria-busy={status === "sending"}>
            {step < 3 ? (
              <>Next <ArrowRight className="h-4 w-4" /></>
            ) : status === "sending" ? (
              "Sending…"
            ) : (
              "Send inquiry"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
