import Link from "next/link";
import { site, whatsappLink } from "@/config/site";
import { sortedProperties } from "@/content/properties";
import { Logo } from "./Logo";
import { Instagram, Mail, Phone, WhatsApp } from "./Icons";
import { TrackedLink } from "./TrackedLink";

export function Footer() {
  const wa = whatsappLink();
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12 md:py-24">
        <div className="md:col-span-4">
          <Logo variant="light" height={84} className="h-20 w-auto" />
          <p className="mt-6 max-w-xs font-serif text-2xl leading-snug text-white">{site.positioning}</p>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-gold">Stays</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {sortedProperties.map((p) => (
              <li key={p.slug}>
                <Link className="link-underline hover:text-white" href={`/stays/${p.slug}`}>
                  {p.displayName}
                  {p.status === "coming-soon" && <span className="ml-2 text-white/50">· Soon</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-gold">Bahia Dreams</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li><Link className="link-underline hover:text-white" href="/property-management">Property Management</Link></li>
            <li><Link className="link-underline hover:text-white" href="/list-your-property">List Your Property</Link></li>
            <li><Link className="link-underline hover:text-white" href="/about">About</Link></li>
            <li><Link className="link-underline hover:text-white" href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-gold">Get in touch</h2>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <a className="inline-flex items-center gap-3 hover:text-white" href={`mailto:${site.contact.email}`}>
                <Mail className="h-4 w-4 text-gold" />
                <span className="break-all">{site.contact.email}</span>
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-3 hover:text-white" href={`tel:${site.contact.phoneE164}`}>
                <Phone className="h-4 w-4 text-gold" />
                {site.contact.phoneDisplay}
              </a>
            </li>
            {wa && (
              <li>
                <TrackedLink
                  event="WhatsApp Click"
                  props={{ location: "footer" }}
                  className="inline-flex items-center gap-3 hover:text-white"
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsApp className="h-4 w-4 text-gold" />
                  WhatsApp
                  <span className="sr-only"> (opens in a new tab)</span>
                </TrackedLink>
              </li>
            )}
            <li>
              <a
                className="inline-flex items-center gap-3 hover:text-white"
                href={site.socials.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4 text-gold" />
                {site.socials.instagram.handle}
                <span className="sr-only"> on Instagram (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-7 text-xs text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.legal.entityName} · bahiadreamscr.com</p>
          <p className="flex gap-6">
            <Link className="hover:text-white" href="/privacy">Privacy</Link>
            <Link className="hover:text-white" href="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
