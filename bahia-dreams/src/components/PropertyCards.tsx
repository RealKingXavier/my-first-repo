import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/content/properties";
import { ArrowRight } from "./Icons";
import { Macaw } from "./Logo";

function Specs({ p }: { p: Property }) {
  const parts = [
    p.bedrooms && `${p.bedrooms} bedroom${p.bedrooms > 1 ? "s" : ""}`,
    p.bathrooms && `${p.bathrooms} bath${p.bathrooms > 1 ? "s" : ""}`,
    p.sleeps && `Sleeps ${p.sleeps}`,
  ].filter(Boolean);
  if (!parts.length) return null;
  return <p className="text-sm text-muted">{parts.join(" · ")}</p>;
}

export function PropertyFeature({
  p,
  size = "large",
  sizes,
  priority,
  headingLevel = 3,
}: {
  p: Property;
  size?: "large" | "tall" | "wide";
  sizes: string;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  if (p.status === "coming-soon") return <ComingSoonFeature p={p} headingLevel={headingLevel} />;
  const H = `h${headingLevel}` as const;
  const aspect = size === "tall" ? "aspect-[4/5]" : size === "wide" ? "aspect-[16/10]" : "aspect-[4/3]";
  return (
    <article className="group relative">
      <Link href={`/stays/${p.slug}`} className="block" aria-label={`Discover ${p.displayName}`}>
        <div className={`img-zoom relative overflow-hidden rounded-sm bg-sand ${aspect}`}>
          {(p.cardImage ?? p.heroImage) && (
            <Image
              src={(p.cardImage ?? p.heroImage)!.src}
              alt={(p.cardImage ?? p.heroImage)!.alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
            />
          )}
          {p.badges && p.badges.length > 0 && (
            <ul className="absolute left-4 top-4 flex flex-wrap gap-2">
              {p.badges.map((b) => (
                <li key={b} className="rounded-full bg-ivory/90 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-navy backdrop-blur">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Link>
      <div className="mt-6 flex flex-col gap-2">
        <p className="eyebrow text-coral-deep">{p.locationLabel}</p>
        <H className="font-serif text-3xl text-navy md:text-4xl">
          <Link href={`/stays/${p.slug}`} className="hover:text-coral-deep">
            {p.displayName}
          </Link>
        </H>
        <Specs p={p} />
        <p className="mt-1 max-w-xl leading-relaxed text-ink/80">{p.shortDescription}</p>
        <Link
          href={`/stays/${p.slug}`}
          className="mt-3 inline-flex w-fit items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-navy"
        >
          <span className="link-underline">Discover Property</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          <span className="sr-only">: {p.displayName}</span>
        </Link>
      </div>
    </article>
  );
}

export function ComingSoonFeature({ p, headingLevel = 3 }: { p: Property; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as const;
  return (
    <article className="group relative">
      <Link href={`/stays/${p.slug}`} className="block" aria-label={`${p.displayName} — coming soon`}>
        <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-sm bg-navy text-center text-white">
          <div aria-hidden className="absolute inset-6 rounded-sm border border-white/15 transition-colors duration-700 group-hover:border-gold/50" />
          <Macaw size={64} className="relative h-14 w-14 opacity-90" />
          <p className="eyebrow relative mt-6 text-gold">Coming soon</p>
          <p className="relative mt-3 font-serif text-4xl md:text-5xl">{p.displayName}</p>
          <p className="relative mt-3 max-w-[16rem] text-sm text-white/70">Under construction</p>
        </div>
      </Link>
      <div className="mt-6 flex flex-col gap-2">
        <p className="eyebrow text-coral-deep">New to the collection</p>
        <H className="font-serif text-3xl text-navy md:text-4xl">
          <Link href={`/stays/${p.slug}`} className="hover:text-coral-deep">
            {p.displayName}
          </Link>
        </H>
        <p className="mt-1 max-w-xl leading-relaxed text-ink/80">{p.shortDescription}</p>
        <Link
          href={`/stays/${p.slug}`}
          className="mt-3 inline-flex w-fit items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-navy"
        >
          <span className="link-underline">Follow its progress</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
