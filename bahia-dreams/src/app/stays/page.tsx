import Link from "next/link";
import { sortedProperties } from "@/content/properties";
import { PropertyFeature } from "@/components/PropertyCards";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Stays — Vacation Rentals in Herradura, Costa Rica",
  description:
    "Explore Bahia Dreams vacation rentals on Costa Rica's Central Pacific coast: ocean-view residences and pool-side condos in Herradura, near Jacó and Los Sueños.",
  path: "/stays",
});

export default function StaysPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Stays", path: "/stays" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="bg-ivory pb-16 pt-32 md:pb-24 md:pt-44">
        <div className="container-x">
          <Breadcrumbs items={crumbs} />
          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <h1 className="font-serif text-5xl leading-[1.02] text-navy md:col-span-7 md:text-7xl">
              Places worth discovering.
            </h1>
            <p className="self-end text-lg leading-relaxed text-ink/80 md:col-span-4 md:col-start-9">
              A small collection of homes around Herradura, on Costa Rica’s Central Pacific coast. Each one is booked
              through its verified listing, so you see real availability and reserve with confidence.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="All stays" className="bg-white py-20 md:py-28">
        <div className="container-x space-y-24 md:space-y-36">
          {sortedProperties.map((p, i) => (
            <div key={p.slug} data-reveal className="grid items-start gap-10 md:grid-cols-12">
              <div className={i % 2 ? "md:order-2 md:col-span-7 md:col-start-6" : "md:col-span-7"}>
                <PropertyFeature p={p} size="wide" sizes="(min-width: 768px) 58vw, 100vw" priority={i === 0} headingLevel={2} />
              </div>
              <p
                aria-hidden
                className={`hidden font-serif text-[9rem] leading-none text-line md:block ${
                  i % 2 ? "md:order-1 md:col-span-4 md:col-start-1" : "md:col-span-4 md:col-start-9 md:text-right"
                }`}
              >
                0{i + 1}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="container-x flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="max-w-xl font-serif text-3xl leading-snug text-navy">Questions before you book? We’re happy to help.</p>
          <Link href="/contact?topic=stay" className="btn btn-navy">
            Contact us
          </Link>
        </div>
      </section>
    </>
  );
}
