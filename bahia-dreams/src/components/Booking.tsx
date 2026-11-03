"use client";

import { useEffect, useState } from "react";
import { availableBookingLinks, type Property } from "@/content/properties";
import { whatsappLink } from "@/config/site";
import { track } from "@/lib/analytics";
import { External, WhatsApp } from "./Icons";

function BookingButtons({ p, compact }: { p: Property; compact?: boolean }) {
  // The compact (sticky) bar has room for the primary platform only.
  const links = availableBookingLinks(p).slice(0, compact ? 1 : undefined);
  return (
    <>
      {links.map((l, i) => (
        <a
          key={l.platform}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Book ${p.displayName} on ${l.label} (opens in a new tab)`}
          onClick={() => track("Booking Click", { platform: l.platform, property: p.slug })}
          className={`btn ${i === 0 ? "btn-coral" : "btn-ghost"} ${compact ? "flex-1" : "w-full"}`}
        >
          Book on {l.label}
          <External className="h-4 w-4" />
        </a>
      ))}
    </>
  );
}

export function BookingPanel({ p }: { p: Property }) {
  const links = availableBookingLinks(p);
  const wa = whatsappLink(`Hello Bahia Dreams, I have a question about ${p.displayName}.`);
  return (
    <aside aria-labelledby="book-heading" className="rounded-sm border border-line bg-white p-7 md:p-8">
      <p className="eyebrow text-coral-deep">Reserve</p>
      <h2 id="book-heading" className="mt-3 font-serif text-3xl text-navy">
        Book {p.displayName}
      </h2>
      {links.length > 0 ? (
        <>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Reservations, live availability and pricing are handled securely on the platform below.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <BookingButtons p={p} />
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-muted">Booking details coming soon.</p>
      )}
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("WhatsApp Click", { location: "booking-panel", property: p.slug })}
          className="mt-6 inline-flex items-center gap-2 border-t border-line pt-6 text-sm font-semibold text-navy hover:text-coral-deep"
        >
          <WhatsApp className="h-5 w-5 text-[#25D366]" />
          Ask a question on WhatsApp
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </aside>
  );
}

// Fixed bar on small screens that appears once the hero has scrolled away.
export function StickyBookingBar({ p }: { p: Property }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!availableBookingLinks(p).length) return null;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-500 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
      inert={!show}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight text-navy">{p.displayName}</p>
          <p className="truncate text-xs text-muted">{p.sleeps ? `Sleeps ${p.sleeps} · ` : ""}{p.locationLabel}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <BookingButtons p={p} compact />
        </div>
      </div>
    </div>
  );
}
