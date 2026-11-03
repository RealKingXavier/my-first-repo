"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Photo } from "@/content/properties";
import { ArrowLeft, ArrowRight, Close, Expand } from "./Icons";

// Editorial mosaic that opens into a keyboard-operable lightbox
// (←/→ to move, Esc to close, focus trapped and restored).
export function Gallery({ photos, name }: { photos: Photo[]; name: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number, el: HTMLElement) => {
    openerRef.current = el;
    setIndex(i);
  };
  const close = useCallback(() => {
    setIndex(null);
    openerRef.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (index === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        const els = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? []);
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
  }, [index, close, step]);

  if (!photos.length) return null;
  const mosaic = photos.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2 md:gap-3">
        {mosaic.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={(e) => open(i, e.currentTarget)}
            className={`group relative overflow-hidden rounded-sm bg-sand ${
              i === 0 ? "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto" : "aspect-[4/3]"
            }`}
            aria-label={`Open photo ${i + 1} of ${photos.length}: ${p.caption ?? p.alt}`}
          >
            <span className="img-zoom absolute inset-0 block">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                className="object-cover"
              />
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={(e) => open(0, e.currentTarget)}
        className="btn btn-ghost mt-5"
      >
        <Expand className="h-4 w-4" />
        View all {photos.length} photos
      </button>

      {index !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} photo gallery`}
          className="fixed inset-0 z-[80] flex flex-col bg-navy-deep/97 text-white"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="text-sm text-white/70" aria-live="polite">
              {index + 1} / {photos.length}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close gallery"
            >
              <Close className="h-6 w-6" />
            </button>
          </div>
          <figure className="relative mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 md:px-20">
            <div className="relative min-h-0 flex-1">
              <Image
                key={photos[index].src}
                src={photos[index].src}
                alt={photos[index].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            {photos[index].caption && (
              <figcaption className="py-5 text-center font-serif text-xl text-white/90">{photos[index].caption}</figcaption>
            )}
          </figure>
          <div className="flex justify-center gap-4 pb-6 md:pointer-events-none md:absolute md:inset-x-6 md:top-1/2 md:-translate-y-1/2 md:justify-between md:pb-0">
            <button
              type="button"
              onClick={() => step(-1)}
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 hover:bg-white hover:text-navy"
              aria-label="Previous photo"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 hover:bg-white hover:text-navy"
              aria-label="Next photo"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
