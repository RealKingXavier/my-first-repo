import Image from "next/image";
import Link from "next/link";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Check } from "@/components/Icons";
import { site } from "@/config/site";

export const metadata = pageMetadata({
  title: "Vacation Rental Property Management in Costa Rica",
  description:
    "Bespoke vacation rental management on Costa Rica's Pacific coast: listing strategy, guest care, property maintenance and transparent monthly owner reporting.",
  path: "/property-management",
  image: "/images/stays/enchanting/01.jpg",
});

// Drawn from the Bahia Dreams owner brochures (brand journey, maintenance and
// service guides). Keep claims factual; no guarantees of income or occupancy.
const services = [
  {
    id: "listing",
    title: "Listing strategy",
    lead: "Every property has its own character. We craft the story that shows guests why yours is worth the trip.",
    items: [
      "Professional presentation with high-quality photography, coordinated for you",
      "Compelling descriptions built around your home’s standout features",
      "Distribution across Airbnb, Booking.com and Vrbo",
      "Dynamic pricing informed by market data, seasons and special occasions",
    ],
  },
  {
    id: "guests",
    title: "Guest management",
    lead: "Clear, prompt and warm communication — from the first question to the last goodbye.",
    items: [
      "Responsive pre-booking communication",
      "Detailed property information and clear check-in and check-out instructions",
      "Support for guests throughout their stay",
      "Guest criteria tailored to your home — group size, minimum stays and guest ratings",
    ],
  },
  {
    id: "care",
    title: "Property care",
    lead: "We look after the home itself with precision and attention, inside and out.",
    items: [
      "Cleaning and housekeeping coordination between every stay",
      "Proactive monitoring and recommended preventive upkeep",
      "Interior systems: HVAC, plumbing, electrical and appliances",
      "Exterior care, painting and touch-ups, pool maintenance and landscaping",
      "General repairs, safety and security systems",
      "Coordination of emergency repairs when something can’t wait",
    ],
  },
  {
    id: "admin",
    title: "Owner administration",
    lead: "We take on the administrative load and keep everything visible to you.",
    items: [
      "Expense invoices processed, paid and forwarded",
      "HOA fees and property-tax payments coordinated where applicable",
      "Monthly reports detailing bookings and expenses",
      "Owner payouts on a consistent, predetermined date each month",
    ],
  },
];

const onboarding = [
  { title: "Owner consultation", body: "We listen to your goals and concerns and assess what your home needs." },
  { title: "Contracts & accounting", body: "Agreements are signed and payout and accounting details are set up." },
  { title: "Your property’s story", body: "We define the essence of your home — the foundation for every listing and guest experience." },
  { title: "Listing setup", body: "Booking profiles built around that story, with high-quality images, across the major platforms." },
  { title: "Condition assessment", body: "We review the property’s current condition, create checklists and recommend a maintenance plan." },
];

export default function ManagementPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Property Management", path: "/property-management" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="relative flex min-h-[80svh] items-end overflow-hidden bg-navy-deep text-white">
        <Image src="/images/stays/enchanting/01.jpg" alt="Bright, freshly prepared living room in a Bahia Dreams managed condo" fill priority sizes="(max-width: 767px) 240vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/45 to-navy-deep/30" />
        <div className="container-x relative pb-16 pt-36 md:pb-24">
          <Breadcrumbs items={crumbs} tone="light" />
          <p className="eyebrow mt-8 text-gold">For homeowners</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.02] md:text-7xl">Your property deserves more than a listing.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
            We care for the home, the guest experience, and the details that make ownership simpler.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/list-your-property" className="btn btn-coral">List Your Property</Link>
            <Link href="/contact?topic=owner" className="btn btn-ghost-light">Ask a question</Link>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <h2 className="font-serif text-4xl leading-tight text-navy md:col-span-5 md:text-5xl">Built on trust, transparency and a bespoke approach.</h2>
          <div className="grid gap-10 sm:grid-cols-3 md:col-span-7">
            {[
              ["Trust", "We treat your home as if it were our own, and we’re accountable for how it is cared for."],
              ["Transparency", "Open communication and a clear breakdown of services, expenses and payouts."],
              ["Bespoke", "A management plan shaped around your property, your goals and how you use it."],
            ].map(([t, b]) => (
              <div key={t} data-reveal className="border-t border-navy/20 pt-6">
                <h3 className="font-serif text-2xl text-navy">{t}</h3>
                <p className="mt-3 leading-relaxed text-ink/75">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section aria-labelledby="services" className="bg-white py-24 md:py-32">
        <div className="container-x">
          <p className="eyebrow text-coral-deep">What we do</p>
          <h2 id="services" className="mt-4 max-w-2xl font-serif text-4xl text-navy md:text-5xl">End-to-end care for your vacation home</h2>
          <div className="mt-16 divide-y divide-line border-y border-line">
            {services.map((s, i) => (
              <article key={s.id} data-reveal className="grid gap-8 py-12 md:grid-cols-12 md:py-16">
                <div className="md:col-span-5">
                  <span className="font-serif text-xl text-coral">0{i + 1}</span>
                  <h3 className="mt-3 font-serif text-3xl text-navy md:text-4xl">{s.title}</h3>
                  <p className="mt-4 max-w-md leading-relaxed text-ink/75">{s.lead}</p>
                </div>
                <ul className="grid gap-4 sm:grid-cols-2 md:col-span-7">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-3 leading-relaxed text-ink/85">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-coral-deep" />
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section aria-labelledby="onboarding" className="bg-navy py-24 text-white md:py-32">
        <div className="container-x">
          <p className="eyebrow text-gold">Tailored onboarding</p>
          <h2 id="onboarding" className="mt-4 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">From first conversation to first guest</h2>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {onboarding.map((o, i) => (
              <li key={o.title} data-reveal className="bg-navy p-8">
                <span className="font-serif text-4xl text-gold">{i + 1}</span>
                <h3 className="mt-6 font-serif text-2xl">{o.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{o.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fees */}
      <section className="bg-ivory py-24 md:py-28">
        <div className="container-x grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow text-coral-deep">Fees</p>
            <h2 className="mt-4 font-serif text-4xl text-navy">A clear proposal, written for your home</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-relaxed text-ink/80">
              Management terms depend on the property and the services it needs. After an initial consultation we share
              a written proposal with a full breakdown of what’s included, how fees are calculated and how payouts work
              — so there are no surprises later.
            </p>
            {site.pricing.showOnPublicSite && <p className="mt-6 rounded-sm border border-line bg-white p-5 text-sm text-ink/80">{site.pricing.commissionNote}</p>}
            <p className="mt-6 text-sm text-muted">Tax obligations remain the owner’s responsibility; we’re happy to coordinate with your accountant.</p>
          </div>
        </div>
      </section>

      <section className="bg-sand py-24">
        <div className="container-x flex flex-col items-center text-center">
          <h2 className="max-w-2xl font-serif text-4xl leading-tight text-navy md:text-5xl">Tell us about your property</h2>
          <p className="mt-5 max-w-lg text-lg text-ink/75">A few short steps. We’ll review the details and get in touch personally.</p>
          <Link href="/list-your-property" className="btn btn-coral mt-10">List Your Property</Link>
        </div>
      </section>
    </>
  );
}
