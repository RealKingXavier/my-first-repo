import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { Instagram, Mail, Phone, WhatsApp } from "@/components/Icons";
import { TrackedLink } from "@/components/TrackedLink";
import { site, whatsappLink } from "@/config/site";
import { contactTopics } from "@/lib/validation";
import { getProperty } from "@/content/properties";

export const metadata = pageMetadata({
  title: "Contact Us",
  description: "Questions about a stay or about managing your Costa Rica property? Write to Bahia Dreams by form, email or WhatsApp.",
  path: "/contact",
});

type Search = Promise<{ topic?: string; about?: string }>;

export default async function ContactPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const topic = contactTopics.find((t) => t === sp.topic);
  const about = sp.about && getProperty(sp.about) ? getProperty(sp.about)!.displayName : undefined;
  const wa = whatsappLink();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="bg-ivory pb-24 pt-32 md:pt-44">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-10 font-serif text-5xl leading-[1.04] text-navy md:text-6xl">Let’s talk</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
              Planning a stay, or thinking about management for your home? Send us a note — we read every message.
            </p>
            {about && <p className="mt-4 text-sm text-muted">You’re asking about <strong className="text-navy">{about}</strong>.</p>}
            {site.contact.responseExpectation && <p className="mt-4 text-sm text-muted">{site.contact.responseExpectation}</p>}

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              <Link href="/stays" className="rounded-sm border border-line bg-white p-5 transition-colors hover:border-navy">
                <span className="eyebrow text-coral-deep">Guests</span>
                <span className="mt-2 block font-serif text-xl text-navy">I’m looking for a stay</span>
              </Link>
              <Link href="/list-your-property" className="rounded-sm border border-line bg-white p-5 transition-colors hover:border-navy">
                <span className="eyebrow text-coral-deep">Owners</span>
                <span className="mt-2 block font-serif text-xl text-navy">I own a property</span>
              </Link>
            </div>

            <ul className="mt-12 space-y-5 border-t border-line pt-10">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-4 text-navy hover:text-coral-deep">
                  <Mail className="h-5 w-5" /> <span className="break-all">{site.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneE164}`} className="inline-flex items-center gap-4 text-navy hover:text-coral-deep">
                  <Phone className="h-5 w-5" /> {site.contact.phoneDisplay}
                </a>
              </li>
              {wa && (
                <li>
                  <TrackedLink event="WhatsApp Click" props={{ location: "contact" }} href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-navy hover:text-coral-deep">
                    <WhatsApp className="h-5 w-5 text-[#25D366]" /> Message us on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TrackedLink>
                </li>
              )}
              <li>
                <a href={site.socials.instagram.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 text-navy hover:text-coral-deep">
                  <Instagram className="h-5 w-5" /> {site.socials.instagram.handle}
                  <span className="sr-only"> on Instagram (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ContactForm initialTopic={topic} about={about} />
          </div>
        </div>
      </section>
    </>
  );
}
