// Privacy-conscious event tracking. Events go to Plausible (cookieless) only
// when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set; otherwise every call is a no-op.
// Never pass names, emails, phone numbers or free text as props.

export type TrackEvent =
  | "Booking Click"
  | "WhatsApp Click"
  | "Owner CTA"
  | "Owner Form Start"
  | "Owner Form Complete"
  | "Contact Form Complete";

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: Props }) => void) & { q?: unknown[] };
  }
}

export function track(event: TrackEvent, props?: Props) {
  if (typeof window === "undefined" || !window.plausible) return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    // analytics must never break the page
  }
}
