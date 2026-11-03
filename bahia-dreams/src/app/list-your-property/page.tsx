import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OwnerForm } from "@/components/forms/OwnerForm";
import { site, whatsappLink } from "@/config/site";

export const metadata = pageMetadata({
  title: "List Your Property — Owner Inquiry",
  description:
    "Tell Bahia Dreams about your Costa Rica property. Share a few details and we'll be in touch personally to discuss vacation rental management.",
  path: "/list-your-property",
});

export default function ListYourPropertyPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Property Management", path: "/property-management" },
    { name: "List Your Property", path: "/list-your-property" },
  ];
  const wa = whatsappLink("Hello Bahia Dreams, I'd like to talk about managing my property.");
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="bg-ivory pb-24 pt-32 md:pt-44">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Breadcrumbs items={crumbs} />
            <h1 className="mt-10 font-serif text-5xl leading-[1.04] text-navy md:text-6xl">List your property</h1>
            <p className="mt-6 text-lg leading-relaxed text-ink/80">
              Share a few details about your home. It takes about three minutes, and there’s no commitment — we’ll review
              your inquiry and contact you personally.
            </p>
            <div className="mt-10 border-t border-line pt-8 text-sm leading-relaxed text-muted">
              <p>Prefer to talk first?</p>
              <p className="mt-2">
                <a className="font-semibold text-navy underline" href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                {wa && (
                  <>
                    {" · "}
                    <a className="font-semibold text-navy underline" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <OwnerForm />
          </div>
        </div>
      </section>
    </>
  );
}
