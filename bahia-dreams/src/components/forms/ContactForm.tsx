"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { contactSchema, contactTopicLabels, contactTopics, fieldErrors } from "@/lib/validation";
import { site } from "@/config/site";
import { track } from "@/lib/analytics";
import { Check } from "@/components/Icons";
import { ChoiceGroup, describedBy, Field, Honeypot } from "./FormParts";

type Topic = (typeof contactTopics)[number];

export function ContactForm({ initialTopic, about }: { initialTopic?: Topic; about?: string }) {
  const [v, setV] = useState({ name: "", email: "", message: "", topic: initialTopic as Topic | undefined, consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "failed">("idle");
  const [failure, setFailure] = useState<string | null>(null);
  const startedAt = useRef(Date.now());
  const doneRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...v, about, website: honeypot, startedAt: startedAt.current };
    const r = contactSchema.safeParse(payload);
    if (!r.success) {
      const fe = fieldErrors(r.error);
      setErrors(fe);
      document.querySelector<HTMLElement>(`[name="${Object.keys(fe)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
        track("Contact Form Complete", { topic: v.topic ?? "other" });
        requestAnimationFrame(() => doneRef.current?.focus());
        return;
      }
      if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setFailure(data.message ?? "Something went wrong.");
      setStatus("failed");
    } catch {
      setFailure("We couldn’t reach our server.");
      setStatus("failed");
    }
  }

  if (status === "done") {
    return (
      <div role="status" className="rounded-sm border border-line bg-white p-8 md:p-12">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white">
          <Check className="h-6 w-6" />
        </span>
        <h2 ref={doneRef} tabIndex={-1} className="mt-6 font-serif text-3xl text-navy outline-none">
          Message received
        </h2>
        <p className="mt-4 leading-relaxed text-ink/80">Thank you for writing to Bahia Dreams. We’ll reply to {v.email} as soon as we can.</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-8 rounded-sm border border-line bg-white p-6 md:p-10">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <ChoiceGroup name="topic" legend="How can we help?" options={contactTopicLabels} value={v.topic} onChange={(t) => set("topic", t)} error={errors.topic || undefined} columns={1} />
      {v.topic === "owner" && (
        <p className="-mt-4 text-sm text-muted">
          Tip: the <Link className="underline" href="/list-your-property">property inquiry form</Link> lets you share details and photos in one go.
        </p>
      )}
      <div className="grid gap-8 md:grid-cols-2">
        <Field id="c-name" label="Name" error={errors.name || undefined}>
          <input id="c-name" name="name" className="field" autoComplete="name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={describedBy("c-name", errors.name)} />
        </Field>
        <Field id="c-email" label="Email" error={errors.email || undefined}>
          <input id="c-email" name="email" type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={describedBy("c-email", errors.email)} />
        </Field>
      </div>
      <Field id="c-message" label="Message" error={errors.message || undefined}>
        <textarea id="c-message" name="message" rows={6} maxLength={3000} className="field" value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={describedBy("c-message", errors.message)} />
      </Field>
      <div>
        <label className="flex items-start gap-3 text-sm leading-relaxed text-ink/80">
          <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-navy" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={!!errors.consent} aria-describedby={errors.consent ? "c-consent-error" : undefined} />
          <span>
            I agree that Bahia Dreams may use these details to reply to me, as described in the{" "}
            <Link href="/privacy" className="underline" target="_blank">privacy policy</Link>.
          </span>
        </label>
        {errors.consent && <p id="c-consent-error" className="field-error">{errors.consent}</p>}
      </div>
      {status === "failed" && failure && (
        <div role="alert" className="rounded-sm border border-coral/40 bg-coral/5 p-5 text-sm leading-relaxed">
          <p className="font-semibold text-navy">{failure}</p>
          <p className="mt-1 text-ink/80">
            Your message hasn’t been sent. Please email us at{" "}
            <a className="underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a> instead.
          </p>
        </div>
      )}
      <button type="submit" className="btn btn-coral w-full sm:w-auto" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
