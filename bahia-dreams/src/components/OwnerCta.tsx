import Link from "next/link";
import { Macaw } from "./Logo";

export function OwnerCta() {
  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container-x flex flex-col items-center text-center">
        <Macaw size={56} className="h-12 w-12" />
        <h2 className="mt-8 max-w-3xl font-serif text-4xl leading-tight text-navy md:text-6xl">
          Your property deserves more than a listing.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75">
          We care for the home, the guest experience, and the details that make ownership simpler.
        </p>
        <div className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href="/property-management" className="btn btn-navy">
            Explore Management
          </Link>
          <Link href="/list-your-property" className="btn btn-ghost">
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
}
