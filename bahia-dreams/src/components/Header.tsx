"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "./Logo";
import { Close, Menu } from "./Icons";
import { track } from "@/lib/analytics";

// Routes that open on a full-bleed dark hero, where the bar can start clear.
function hasDarkHero(path: string) {
  if (path === "/" || path === "/property-management" || path === "/about") return true;
  return /^\/stays\/(carara-sky-house|enchanting|lovely|casa-kathia)$/.test(path);
}

export function Header() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = focusables();
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const clear = hasDarkHero(pathname) && !scrolled && !open;
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-500 ${
        clear ? "bg-transparent text-white" : "bg-ivory/95 text-navy shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
      }`}
    >
      {clear && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-40 bg-gradient-to-b from-navy-deep/60 to-transparent" />
      )}
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6 md:h-20">
        <Link href="/" aria-label="Bahia Dreams Costa Rica — home" className="shrink-0">
          <Logo variant={clear ? "light" : "dark"} height={48} className="h-11 w-auto md:h-12" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`link-underline text-[0.8rem] font-semibold uppercase tracking-[0.14em] ${
                isActive(item.href) ? "bg-[length:100%_1px]" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/list-your-property"
            onClick={() => track("Owner CTA", { location: "header" })}
            className={`btn !min-h-0 !px-5 !py-2.5 ${clear ? "btn-ghost-light" : "btn-coral"}`}
          >
            List Your Property
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-ivory text-navy md:top-20 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x flex flex-col py-8">
          {[{ href: "/", label: "Home" }, ...nav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="border-b border-line py-5 font-serif text-3xl"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/list-your-property"
            onClick={() => track("Owner CTA", { location: "mobile-menu" })}
            className="btn btn-coral mt-10 w-full"
          >
            List Your Property
          </Link>
          <Link href="/stays" className="btn btn-ghost mt-3 w-full">
            Explore Our Stays
          </Link>
        </nav>
      </div>
    </header>
  );
}
