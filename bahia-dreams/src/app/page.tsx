import Image from "next/image";
import Link from "next/link";
import { sortedProperties } from "@/content/properties";
import { PropertyFeature } from "@/components/PropertyCards";
import { ArrowRight } from "@/components/Icons";
import { pageMetadata } from "@/lib/seo";
import { OwnerCta } from "@/components/OwnerCta";

export const metadata = pageMetadata({
  title: "Bahia Dreams Costa Rica — Vacation Rentals & Property Management",
  description:
    "Curated vacation rentals in Herradura on Costa Rica's Central Pacific coast, and thoughtful, transparent property management for homeowners.",
  path: "/",
});

const pillars = [
  {
    n: "01",
    title: "Listing & Revenue Strategy",
    body: "A story for your home, professional presentation across Airbnb, Booking.com and Vrbo, and pricing that follows the seasons.",
  },
  {
    n: "02",
    title: "Guest Experience",
    body: "Prompt, clear communication from the first question to check-out, with guest criteria set around your home.",
  },
  {
    n: "03",
    title: "Property Care",
    body: "Cleaning, preventive upkeep and repairs coordinated inside and out — so the home is ready for every arrival.",
  },
  {
    n: "04",
    title: "Owner Transparency",
    body: "Monthly reports on bookings and expenses, invoices handled for you, and payouts on a set date each month.",
  },
];

export default function HomePage() {
  const [one, two, three, four] = sortedProperties;
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-navy-deep text-white md:min-h-[100svh]">
        <Image
          src="/images/stays/carara-sky-house/04.jpg"
          alt="Forested hills rolling down to the Pacific Ocean, seen from Carara Sky House"
          fill
          priority
          sizes="(max-width: 767px) 240vw, 100vw"
          className="object-cover object-[50%_60%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/35 to-navy-deep/20" />
        <div className="container-x relative pb-16 pt-40 md:pb-24">
          <p className="eyebrow text-gold">Costa Rica · Central Pacific</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[2.9rem] leading-[1.02] md:text-7xl lg:text-[5.5rem]">
            A different kind of escape.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            Exceptional homes. Unforgettable experiences. Thoughtful management on Costa Rica’s Pacific coast.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/stays" className="btn btn-coral">
              Explore Our Stays
            </Link>
            <Link href="/list-your-property" className="btn btn-ghost-light">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="bg-ivory py-24 md:py-36">
        <div className="container-x grid gap-10 md:grid-cols-12">
          <p data-reveal className="eyebrow text-coral-deep md:col-span-3 md:pt-4">
            Exceptional stays. <br className="hidden md:block" />
            Thoughtfully managed.
          </p>
          <div data-reveal className="md:col-span-8 md:col-start-5">
            <h2 className="font-serif text-4xl leading-[1.1] text-navy md:text-6xl">
              A curated collection of places worth discovering.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">
              Bahia Dreams is a small collection of homes on Costa Rica’s Central Pacific coast, each one cared for as if
              it were our own. We look after the guests who stay in them and the owners who trust us with them — with
              the same attention, the same honesty, and a feel for the details that make a place memorable.
            </p>
          </div>
        </div>
      </section>

      {/* Featured collection */}
      <section aria-labelledby="collection" className="bg-white py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-coral-deep">The collection</p>
              <h2 id="collection" className="mt-4 font-serif text-4xl text-navy md:text-5xl">
                Our stays
              </h2>
            </div>
            <Link href="/stays" className="inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-navy">
              <span className="link-underline">View all stays</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 grid gap-x-10 gap-y-20 md:grid-cols-12 md:gap-y-28">
            <div data-reveal className="md:col-span-7">
              <PropertyFeature p={one} size="large" sizes="(min-width: 768px) 58vw, 100vw" />
            </div>
            <div data-reveal className="md:col-span-5 md:mt-40">
              <PropertyFeature p={two} size="tall" sizes="(min-width: 768px) 42vw, 100vw" />
            </div>
            <div data-reveal className="md:col-span-5 md:col-start-1">
              <PropertyFeature p={three} size="tall" sizes="(min-width: 768px) 42vw, 100vw" />
            </div>
            <div data-reveal className="md:col-span-6 md:col-start-7 md:mt-40">
              <PropertyFeature p={four} sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Split audience */}
      <section className="grid md:grid-cols-2">
        {[
          {
            img: "/images/stays/lovely/09.jpg",
            alt: "Balcony with rattan chairs among tropical trees",
            eyebrow: "For travellers",
            title: "For the places you’ll remember",
            body: "Homes chosen for their light, their views and their sense of calm — each with clear, honest details and booking on the platforms you already trust.",
            href: "/stays",
            cta: "Explore Our Stays",
          },
          {
            img: "/images/stays/enchanting/10.jpg",
            alt: "Wicker lounge chairs on a balcony looking out to green hills",
            eyebrow: "For homeowners",
            title: "For the homes you’ve invested in",
            body: "Management built on trust and transparency: we care for the property, the guests and the paperwork, and keep you informed every month.",
            href: "/property-management",
            cta: "Explore Management",
          },
        ].map((b) => (
          <Link key={b.href} href={b.href} className="group relative flex min-h-[34rem] items-end overflow-hidden bg-navy text-white md:min-h-[44rem]">
            <div className="img-zoom absolute inset-0">
              <Image src={b.img} alt={b.alt} fill sizes="(min-width: 768px) 50vw, 200vw" className="object-cover" />
            </div>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/60 to-navy-deep/10" />
            <div className="relative p-8 md:p-14">
              <p className="eyebrow text-gold">{b.eyebrow}</p>
              <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight md:text-5xl">{b.title}</h2>
              <p className="mt-5 max-w-md leading-relaxed text-white/80">{b.body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em]">
                <span className="link-underline">{b.cta}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Owner services teaser */}
      <section aria-labelledby="services" className="bg-ivory py-24 md:py-32">
        <div className="container-x">
          <div className="grid gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="eyebrow text-coral-deep">Property management</p>
              <h2 id="services" className="mt-4 font-serif text-4xl leading-tight text-navy md:text-5xl">
                Care for the home, the guests, and every detail between.
              </h2>
            </div>
            <p className="self-end text-lg leading-relaxed text-ink/80 md:col-span-6 md:col-start-7">
              Every property has its own character. We build a management plan around yours — and stay accountable for
              it, month after month.
            </p>
          </div>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <li key={p.n} data-reveal className="bg-ivory p-8 md:p-10">
                <span className="font-serif text-xl text-coral">{p.n}</span>
                <h3 className="mt-6 font-serif text-2xl text-navy">{p.title}</h3>
                <p className="mt-4 leading-relaxed text-ink/75">{p.body}</p>
              </li>
            ))}
          </ol>
          <Link href="/property-management" className="btn btn-navy mt-12">
            Explore Management
          </Link>
        </div>
      </section>

      {/* Location storytelling */}
      <section aria-labelledby="place" className="overflow-hidden bg-navy py-24 text-white md:py-32">
        <div className="container-x grid items-center gap-14 md:grid-cols-12">
          <div data-reveal className="relative md:col-span-7">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src="/images/stays/carara-sky-house/02.jpg"
                alt="Hillside infinity pool with a thatched shade structure, the Pacific beyond"
                fill
                sizes="(min-width: 768px) 58vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 right-4 hidden w-2/5 overflow-hidden rounded-sm border-[6px] border-navy md:block">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/stays/enchanting/11.jpg"
                  alt="Palms and tropical gardens around low-rise condominium buildings"
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div data-reveal className="md:col-span-4 md:col-start-9">
            <p className="eyebrow text-gold">The place</p>
            <h2 id="place" className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
              Where the rainforest meets the Pacific.
            </h2>
            <div className="prose-editorial mt-6 leading-relaxed text-white/80">
              <p>
                Our homes sit around Herradura, on the Central Pacific coast — a bay framed by green hills, a short
                drive from Jacó and the marina at Los Sueños.
              </p>
              <p>
                Days here move between the pool, the beach and the forest. Evenings are for long dinners and the light
                going gold over the water.
              </p>
            </div>
          </div>
        </div>
      </section>

      <OwnerCta />
    </>
  );
}
