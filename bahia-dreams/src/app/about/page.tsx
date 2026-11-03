import Image from "next/image";
import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OwnerCta } from "@/components/OwnerCta";

export const metadata = pageMetadata({
  title: "About Us — Boutique Hospitality in Costa Rica",
  description:
    "Bahia Dreams is a boutique Costa Rican hospitality and property management company built on care, trust and transparent communication.",
  path: "/about",
  image: "/images/stays/carara-sky-house/01.jpg",
});

const values = [
  ["Care", "Every home is looked after as if it were our own — the visible details and the ones guests never see."],
  ["Thoughtful hospitality", "Clear information, quick answers and small touches that make arriving feel easy."],
  ["Trust", "Owners hand us something important. We take that seriously, and we stay accountable."],
  ["Transparent communication", "Honest updates, clear reporting and no surprises — for owners and guests alike."],
  ["Local knowledge", "Knowing the coast — its seasons, its services and its people — is part of how a home runs well here."],
  ["Long-term relationships", "We’d rather build a partnership over years than fill a calendar for a season."],
];

export default function AboutPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="relative flex min-h-[78svh] items-end overflow-hidden bg-navy-deep text-white">
        <Image src="/images/stays/carara-sky-house/01.jpg" alt="Balcony overlooking jungle-covered hills and the Pacific" fill priority sizes="(max-width: 767px) 240vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-navy-deep/30" />
        <div className="container-x relative pb-16 pt-36 md:pb-24">
          <Breadcrumbs items={crumbs} tone="light" />
          <p className="eyebrow mt-8 text-gold">About Bahia Dreams</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.04] md:text-7xl">
            A beautiful home deserves thoughtful care.
          </h1>
        </div>
      </section>

      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <p className="font-serif text-3xl italic leading-snug text-navy md:col-span-5 md:text-4xl">
            “We believe a beautiful home deserves thoughtful care — and every guest deserves a memorable stay.”
          </p>
          <div className="prose-editorial text-lg leading-relaxed text-ink/80 md:col-span-6 md:col-start-7">
            <p>
              Bahia Dreams is a boutique Costa Rican hospitality and property management company. We look after vacation
              homes on the Central Pacific coast and the guests who stay in them.
            </p>
            <p>
              For owners, that means a partner who handles marketing, bookings, housekeeping and maintenance with care —
              and who keeps them informed every step of the way. For guests, it means a home that is ready, a host who
              answers, and a stay that feels effortless.
            </p>
            <p>Our collection is small, and every home in it gets the same attention.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="values" className="bg-white py-24 md:py-32">
        <div className="container-x">
          <p className="eyebrow text-coral-deep">What guides us</p>
          <h2 id="values" className="mt-4 font-serif text-4xl text-navy md:text-5xl">Our values</h2>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {values.map(([t, b]) => (
              <li key={t} data-reveal className="bg-white p-8 md:p-10">
                <h3 className="font-serif text-2xl text-navy">{t}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{b}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-col gap-3 sm:flex-row">
            <Link href="/stays" className="btn btn-navy">Explore Our Stays</Link>
            <Link href="/contact" className="btn btn-ghost">Get in touch</Link>
          </div>
        </div>
      </section>

      <OwnerCta />
    </>
  );
}
