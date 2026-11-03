import type { ReactNode } from "react";
import { site } from "@/config/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-ivory pb-24 pt-32 md:pt-44">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-coral-deep">Last updated {site.legal.lastUpdated}</p>
          <h1 className="mt-4 font-serif text-5xl text-navy md:text-6xl">{title}</h1>
          <p className="mt-6 rounded-sm border border-gold/50 bg-gold/10 p-4 text-sm text-ink/80">
            Draft pending legal review. This page will be finalised before it is relied upon.
          </p>
          <div className="mt-12 space-y-6 leading-relaxed text-ink/85 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:text-navy [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
