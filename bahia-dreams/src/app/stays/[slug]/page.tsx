import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { activeProperties, availableBookingLinks, getProperty, properties, type Property } from "@/content/properties";
import { site } from "@/config/site";
import { Gallery } from "@/components/Gallery";
import { BookingPanel, StickyBookingBar } from "@/components/Booking";
import { AmenityIcon, amenityLabels, Bath, Bed, Home, Pin, Users } from "@/components/Icons";
import { PropertyFeature } from "@/components/PropertyCards";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Macaw } from "@/components/Logo";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProperty((await params).slug);
  if (!p) return {};
  return pageMetadata({
    title: p.seo.title,
    description: p.seo.description,
    path: `/stays/${p.slug}`,
    image: p.heroImage?.src,
    // Coming-soon pages are thin until the home is finished.
    noindex: p.status !== "active",
  });
}

function vacationRentalJsonLd(p: Property) {
  // Only verified attributes; no ratings, prices or availability.
  return {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: p.displayName,
    description: p.shortDescription,
    url: `${site.url}/stays/${p.slug}`,
    image: p.gallery.slice(0, 6).map((g) => `${site.url}${g.src}`),
    address: { "@type": "PostalAddress", addressLocality: "Herradura", addressRegion: "Puntarenas", addressCountry: "CR" },
    containsPlace: {
      "@type": "Accommodation",
      additionalType: "EntirePlace",
      numberOfBedrooms: p.bedrooms,
      numberOfBathroomsTotal: p.bathrooms,
      occupancy: p.sleeps ? { "@type": "QuantitativeValue", maxValue: p.sleeps } : undefined,
      amenityFeature: p.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: amenityLabels[a], value: true })),
    },
    sameAs: availableBookingLinks(p).map((l) => l.url),
  };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProperty((await params).slug);
  if (!p) notFound();
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Stays", path: "/stays" },
    { name: p.displayName, path: `/stays/${p.slug}` },
  ];
  if (p.status === "coming-soon") return <ComingSoon p={p} crumbs={crumbs} />;

  const related = activeProperties.filter((r) => r.slug !== p.slug);
  const specs = [
    p.bedrooms && { icon: Bed, label: `${p.bedrooms} bedroom${p.bedrooms > 1 ? "s" : ""}${p.beds ? ` · ${p.beds} bed${p.beds > 1 ? "s" : ""}` : ""}` },
    p.bathrooms && { icon: Bath, label: `${p.bathrooms} bathroom${p.bathrooms > 1 ? "s" : ""}` },
    p.sleeps && { icon: Users, label: `Up to ${p.sleeps} guests` },
    p.propertyType && { icon: Home, label: p.propertyType },
  ].filter(Boolean) as { icon: typeof Bed; label: string }[];

  return (
    <>
      <JsonLd data={vacationRentalJsonLd(p)} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-navy-deep text-white md:min-h-[90svh]">
        {p.heroImage && (
          <Image src={p.heroImage.src} alt={p.heroImage.alt} fill priority sizes="(max-width: 767px) 240vw, 100vw" className="object-cover" />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/25 to-navy-deep/30" />
        <div className="container-x relative pb-14 pt-36 md:pb-20">
          <Breadcrumbs items={crumbs} tone="light" />
          <p className="eyebrow mt-8 inline-flex items-center gap-2 text-gold">
            <Pin className="h-4 w-4" /> {p.locationLabel}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl lg:text-8xl">{p.displayName}</h1>
          <p className="mt-5 max-w-xl font-serif text-2xl italic text-white/85 md:text-3xl">{p.tagline}</p>
        </div>
      </section>

      {specs.length > 0 && (
        <div className="border-b border-line bg-white">
          <ul className="container-x flex flex-wrap gap-x-10 gap-y-4 py-6 text-sm text-ink/80">
            {specs.map((s) => (
              <li key={s.label} className="inline-flex items-center gap-3">
                <s.icon className="h-5 w-5 text-coral-deep" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-coral-deep">Overview</p>
            <div className="prose-editorial mt-6 text-lg leading-relaxed text-ink/85">
              {p.longDescription.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <BookingPanel p={p} />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="gallery-heading" className="bg-white py-20 md:py-28">
        <div className="container-x">
          <h2 id="gallery-heading" className="font-serif text-4xl text-navy md:text-5xl">
            Inside {p.displayName}
          </h2>
          <div className="mt-10">
            {p.gallery.length ? (
              <Gallery photos={p.gallery} name={p.displayName} />
            ) : (
              <p className="text-muted">Photographs coming soon.</p>
            )}
          </div>
        </div>
      </section>

      {p.experience && p.experience.length > 0 && (
        <section aria-labelledby="experience" className="bg-navy py-20 text-white md:py-28">
          <div className="container-x">
            <p className="eyebrow text-gold">The experience</p>
            <h2 id="experience" className="mt-4 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
              Days at {p.displayName}
            </h2>
            <ol className="mt-14 grid gap-10 md:grid-cols-3">
              {p.experience.map((e, i) => (
                <li key={e.title} data-reveal className="border-t border-white/20 pt-8">
                  <span className="font-serif text-lg text-gold">0{i + 1}</span>
                  <h3 className="mt-4 font-serif text-2xl md:text-3xl">{e.title}</h3>
                  <p className="mt-3 leading-relaxed text-white/75">{e.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section aria-labelledby="amenities" className="bg-ivory py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="amenities" className="font-serif text-4xl text-navy md:text-5xl">
              What’s included
            </h2>
            {p.amenities.length ? (
              <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {p.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-4 border-b border-line pb-5 text-ink/85">
                    <AmenityIcon name={a} className="h-6 w-6 shrink-0 text-navy" />
                    {amenityLabels[a]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-muted">Details coming soon.</p>
            )}
          </div>
          {p.guestAccess && (
            <div className="lg:col-span-4 lg:col-start-9">
              <h3 className="eyebrow text-coral-deep">Guest access</h3>
              <ul className="mt-6 space-y-4 leading-relaxed text-ink/80">
                {p.guestAccess.map((g) => (
                  <li key={g} className="border-l-2 border-gold pl-4">
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {p.mapArea && (
        <section aria-labelledby="location" className="bg-white py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-coral-deep">Location</p>
              <h2 id="location" className="mt-4 font-serif text-4xl text-navy md:text-5xl">
                The area
              </h2>
              <p className="mt-5 leading-relaxed text-ink/80">{p.mapArea.label}, on Costa Rica’s Central Pacific coast.</p>
              {p.nearby && (
                <ul className="mt-8 space-y-4">
                  {p.nearby.map((n) => (
                    <li key={n.label} className="flex justify-between gap-6 border-b border-line pb-4">
                      <span className="font-medium text-navy">{n.label}</span>
                      <span className="text-right text-sm text-muted">{n.detail}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-6 text-xs text-muted">
                The map shows the general area. The exact address is shared with confirmed guests.
              </p>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-line bg-sand">
                <Image
                  src={p.mapArea.image}
                  alt={`Map of the general area around ${p.displayName}: ${p.mapArea.label}`}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-2 flex justify-between gap-4 text-xs text-muted">
                <a className="underline" href={p.mapArea.osmUrl} target="_blank" rel="noopener noreferrer">
                  Open in OpenStreetMap<span className="sr-only"> (opens in a new tab)</span>
                </a>
                <span>
                  Map data ©{" "}
                  <a className="underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                    OpenStreetMap contributors
                  </a>
                </span>
              </p>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="related" className="bg-ivory py-20 md:py-28">
          <div className="container-x">
            <h2 id="related" className="font-serif text-4xl text-navy md:text-5xl">
              More stays
            </h2>
            <div className="mt-12 grid gap-14 md:grid-cols-2">
              {related.map((r) => (
                <PropertyFeature key={r.slug} p={r} sizes="(min-width: 768px) 50vw, 100vw" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-navy py-16 text-white">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <Macaw size={48} className="h-11 w-11" />
            <p className="font-serif text-2xl md:text-3xl">Cared for by Bahia Dreams.</p>
          </div>
          <Link href="/property-management" className="btn btn-ghost-light">
            Own a home on the coast?
          </Link>
        </div>
      </section>

      <StickyBookingBar p={p} />
    </>
  );
}

function ComingSoon({ p, crumbs }: { p: Property; crumbs: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="relative overflow-hidden bg-navy pb-24 pt-36 text-white md:pb-36 md:pt-48">
        <div aria-hidden className="absolute inset-6 rounded-sm border border-white/10 md:inset-10" />
        <div className="container-x relative">
          <Breadcrumbs items={crumbs} tone="light" />
          <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center text-center">
            <Macaw size={72} className="h-16 w-16" />
            <p className="eyebrow mt-8 text-gold">Coming soon</p>
            <h1 className="mt-4 font-serif text-6xl leading-none md:text-8xl">{p.displayName}</h1>
            <p className="mt-6 font-serif text-2xl italic text-white/85">{p.tagline}</p>
            <div className="prose-editorial mt-8 leading-relaxed text-white/75">
              {p.longDescription.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href={`/contact?topic=stay&about=${p.slug}`} className="btn btn-coral">
                Inquire for updates
              </Link>
              <Link href="/stays" className="btn btn-ghost-light">
                See available stays
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
