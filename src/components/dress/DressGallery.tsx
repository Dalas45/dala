"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";
import { getDressImages, getImageMeta } from "@/lib/dresses";
import type { Dress } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Eén `sizes` voor de mobiele carrousel én de desktop-hoofdfoto: beide varianten kiezen
 * dan dezelfde bron, zodat de preload van de eerste foto op elk schermformaat wordt benut.
 */
const GALLERY_SIZES = "(min-width: 768px) 50vw, 100vw";

/**
 * Fotogalerij van één jurk.
 *
 * Mobiel : horizontale swipe-carrousel met scroll-snap en positie-indicator.
 * Desktop: grote hoofdfoto met thumbnails eronder.
 * Beide  : klik of Enter opent een fullscreen lightbox met pijltjestoetsen en Escape.
 */
export function DressGallery({ dress }: { dress: Dress }) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** De knop die de lightbox opende; krijgt de focus terug bij sluiten. */
  const triggerRef = useRef<HTMLElement | null>(null);
  const images = getDressImages(dress);
  const total = images.length;

  const go = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const openLightbox = useCallback(
    (at: number, event?: { currentTarget: HTMLElement }) => {
      // Onthoud welke knop de lightbox opende, zodat de focus daar later terugkeert.
      triggerRef.current = event?.currentTarget ?? null;
      setIndex(at);
      setLightboxOpen(true);
      track("gallery_open", { dress_slug: dress.slug, image_index: at + 1 });
    },
    [dress.slug],
  );

  // Toetsenbordbediening en focusbeheer binnen de lightbox.
  useEffect(() => {
    if (!lightboxOpen) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      trigger?.focus();
    };
  }, [lightboxOpen, index, go]);

  // Mobiele carrousel: houd de indicator gelijk met de scrollpositie.
  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    const next = Math.round(el.scrollLeft / el.clientWidth);
    if (next !== index) setIndex(next);
  };

  const active = images[index] ?? images[0]!;
  const activeMeta = getImageMeta(active.src);

  return (
    <>
      {/* Mobiel: swipe-carrousel */}
      <div className="md:hidden">
        <div
          ref={scrollerRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label={`Foto's van trouwjurk ${dress.name}`}
        >
          {images.map((image, i) => {
            const meta = getImageMeta(image.src);
            return (
              <button
                key={image.src}
                type="button"
                onClick={(e) => openLightbox(i, e)}
                className="image-frame relative aspect-[3/4] w-full shrink-0 snap-center"
                aria-label={`Foto ${i + 1} van ${total} vergroot bekijken`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  // Zelfde `sizes` als de desktopvariant, zodat beide dezelfde bron kiezen
                  // en de preload van de eerste foto op elk formaat wordt gebruikt.
                  sizes={GALLERY_SIZES}
                  priority={i === 0}
                  placeholder={meta.blurDataURL ? "blur" : "empty"}
                  blurDataURL={meta.blurDataURL || undefined}
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
        {total > 1 ? (
          <>
            <div className="mt-4 flex items-center justify-center gap-2" aria-hidden="true">
              {images.map((image, i) => (
                <span
                  key={image.src}
                  className={cn("h-px w-8 transition-colors duration-500", i === index ? "bg-ink" : "bg-line-strong")}
                />
              ))}
            </div>
            <p className="mt-3 text-center text-[0.65rem] uppercase tracking-luxe text-muted">
              {index + 1} / {total} · Tik voor groot
            </p>
          </>
        ) : (
          <p className="mt-3 text-center text-[0.65rem] uppercase tracking-luxe text-muted">Tik voor groot</p>
        )}
      </div>

      {/* Desktop: hoofdfoto met thumbnails */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={(e) => openLightbox(index, e)}
          className="image-frame group relative block aspect-[3/4] w-full"
          aria-label={`Foto ${index + 1} van trouwjurk ${dress.name} vergroot bekijken`}
        >
          <Image
            src={active.src}
            alt={active.alt}
            fill
            sizes={GALLERY_SIZES}
            // Geen `priority`: de mobiele variant hierboven regelt de preload van dezelfde bron.
            loading="eager"
            fetchPriority="high"
            placeholder={activeMeta.blurDataURL ? "blur" : "empty"}
            blurDataURL={activeMeta.blurDataURL || undefined}
            className="object-cover"
          />
          <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center bg-ivory/85 text-ink opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
            <Expand width={16} height={16} />
          </span>
        </button>

        {total > 1 ? (
          <div className="mt-4 grid grid-cols-4 gap-3">
            {images.map((image, i) => {
              const meta = getImageMeta(image.src);
              return (
                <button
                  key={image.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Toon foto ${i + 1} van ${dress.name}`}
                  aria-current={i === index}
                  className={cn(
                    "image-frame relative aspect-[3/4] transition-opacity duration-500",
                    // De thumbnails staan op de lichte sectie, dus een inkt-ring op ivoor.
                    i === index ? "opacity-100 ring-1 ring-ink ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100",
                  )}
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="12vw"
                    placeholder={meta.blurDataURL ? "blur" : "empty"}
                    blurDataURL={meta.blurDataURL || undefined}
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto's van trouwjurk ${dress.name}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-noir/96 backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir-muted">
                {dress.name} · {index + 1} / {total}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Sluit de fotoweergave"
                className="inline-flex h-11 w-11 items-center justify-center text-on-noir transition-opacity hover:opacity-70"
              >
                <Close width={22} height={22} />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center px-4 pb-8 sm:px-16">
              <motion.div
                key={active.src}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full max-w-4xl"
              >
                <Image src={active.src} alt={active.alt} fill sizes="(min-width: 768px) 80vw, 100vw" className="object-contain" />
              </motion.div>

              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Vorige foto"
                    className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-on-noir transition-opacity hover:opacity-70 sm:left-4"
                  >
                    <ArrowLeft width={24} height={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label="Volgende foto"
                    className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-on-noir transition-opacity hover:opacity-70 sm:right-4"
                  >
                    <ArrowRight width={24} height={24} />
                  </button>
                </>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
