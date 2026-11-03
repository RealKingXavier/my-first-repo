import Link from "next/link";
import { Macaw } from "@/components/Logo";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-navy pb-24 pt-36 text-white">
      <div className="container-x flex flex-col items-center text-center">
        <Macaw size={64} className="h-14 w-14" />
        <p className="eyebrow mt-8 text-gold">404</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl">This page has flown off.</h1>
        <p className="mt-6 max-w-md text-lg text-white/75">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-coral">Back to home</Link>
          <Link href="/stays" className="btn btn-ghost-light">Explore our stays</Link>
        </div>
      </div>
    </section>
  );
}
