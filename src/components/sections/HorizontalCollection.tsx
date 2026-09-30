"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { COLOR_LABELS, SILHOUETTE_LABELS, formatPrice, getImageMeta, getMainImage } from "@/lib/dresses";
import type { Dress } from "@/lib/types";

/**
 * Horizontale collectiegalerij: de jurken staan naast elkaar op een rail waar
 * je doorheen sleept, veegt of met de pijlen doorheen stapt.
 *
 * Bewust met native scroll-snap in plaats van een JavaScript-carrousel:
 * - werkt met touch, trackpad, muiswiel en toetsenbord zonder extra code
 * - blijft bruikbaar als JavaScript uitvalt
 * - kost geen animatiebudget tijdens het scrollen
 *
 * De pijlen zijn een toevoeging voor muisgebruikers en zijn voor schermlezers
 * verborgen, omdat de lijst zelf al volledig navigeerbaar is.
 */
export function HorizontalCollection({ dresses }: { dresses: Dress[] }) {
  const railRef = useRef<HTMLUListElement>(null);

  const step = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector("li");
    const distance = card ? card.getBoundingClientRect().width + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: distance * direction, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <ul
        ref={railRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 sm:gap-8"
        // Marge links laat de eerste kaart uitlijnen met de container.
        style={{ scrollPaddingLeft: "1.25rem" }}
      >
        {dresses.map((dress, index) => {
          const image = getMainImage(dress);
          const meta = getImageMeta(image.src);
          const price = formatPrice(dress);

          return (
            <li
              key={dress.id}
              className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[26vw]"
            >
              <article className="group h-full">
                <TrackedLink
                  href={`/jurken/${dress.slug}`}
                  event="cta_click"
                  params={{ cta: "jurk_kaart", location: "homepage_rail", dress_slug: dress.slug }}
                  data-cursor="Bekijken"
                  className="flex h-full flex-col focus-visible:outline-offset-4"
                >
                  <div className="image-frame aspect-[3/4]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1280px) 26vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 78vw"
                      // Geen `priority`: deze rail staat als vierde sectie ver
                      // onder de vouw. Een preload hier concurreert alleen met
                      // de herofoto, en die bepaalt de LCP.
                      loading="lazy"
                      placeholder={meta.blurDataURL ? "blur" : "empty"}
                      blurDataURL={meta.blurDataURL || undefined}
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-4 top-4 font-sans text-[0.6rem] tabular-nums tracking-luxe text-ivory mix-blend-difference"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="font-display text-2xl text-ink">{dress.name}</h3>
                    <p className="shrink-0 pt-1.5 text-[0.62rem] uppercase tracking-luxe text-muted">{price ?? "Op aanvraag"}</p>
                  </div>
                  <p className="mt-2 text-sm leading-snug text-muted">{dress.tagline}</p>
                  <p className="mt-4 text-[0.6rem] uppercase tracking-luxe text-muted">
                    {SILHOUETTE_LABELS[dress.silhouette]} · {COLOR_LABELS[dress.color]}
                  </p>
                </TrackedLink>
              </article>
            </li>
          );
        })}
      </ul>

      <div className="container-x mt-10 flex items-center justify-between gap-6" aria-hidden="true">
        <p className="label text-muted">Sleep of veeg om door de collectie te gaan</p>
        <div className="flex gap-3">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => step(-1)}
            className="inline-flex h-12 w-12 items-center justify-center border border-line-strong text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory"
          >
            <ArrowLeft width={18} height={18} />
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => step(1)}
            className="inline-flex h-12 w-12 items-center justify-center border border-line-strong text-ink transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-ivory"
          >
            <ArrowRight width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
