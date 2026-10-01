"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";
import { getImageMeta } from "@/lib/dresses";
import { JEWELLERY_TYPE_LABELS, JEWELLERY_TYPE_PLURAL, getJewelleryMainImage, getJewelleryTypes } from "@/lib/jewellery";
import type { JewelleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * De accessoires bij de jurk: sieradensets, tiara's, boeketten, capes, een
 * waaier en een korte jurk. Eén grid met een filter op type, waarbij elk item
 * in een fullscreen weergave te bekijken is.
 *
 * Bewust géén aparte pagina per stuk. Een boeket of tiara heeft weinig eigen
 * tekst; ruim twintig dunne pagina's zouden slechter scoren dan één sterke
 * categoriepagina. De vergrote weergave geeft toch alle details.
 */
export function JewelleryGrid({ items }: { items: JewelleryItem[] }) {
  const [type, setType] = useState<"alle" | JewelleryItem["type"]>("alle");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const types = getJewelleryTypes(items);
  const visible = type === "alle" ? items : items.filter((i) => i.type === type);
  const total = visible.length;

  const go = useCallback(
    (next: number) => setOpenIndex(((next % total) + total) % total),
    [total],
  );

  // Toetsenbordbediening en focusbeheer in de vergrote weergave.
  useEffect(() => {
    if (openIndex === null) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") go(openIndex + 1);
      if (e.key === "ArrowLeft") go(openIndex - 1);
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
  }, [openIndex, go]);

  const active = openIndex === null ? null : visible[openIndex];

  return (
    <>
      {types.length > 1 ? (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-6">
          <p className="font-sans text-[0.58rem] uppercase tracking-wide-luxe text-muted">Tonen</p>
          {(["alle", ...types] as const).map((value) => {
            const actief = type === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setType(value);
                  track("filter_change", { filter: "sieraad_type", value });
                }}
                aria-pressed={actief}
                className={cn(
                  "group/f relative font-sans text-[0.72rem] uppercase tracking-luxe transition-colors duration-300",
                  actief ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {value === "alle" ? "Alles" : JEWELLERY_TYPE_PLURAL[value]}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ease-[var(--ease-couture)]",
                    actief ? "scale-x-100" : "scale-x-0 group-hover/f:scale-x-100",
                  )}
                />
              </button>
            );
          })}
          <p aria-live="polite" className="ml-auto font-sans text-[0.68rem] tabular-nums uppercase tracking-luxe text-muted">
            <span className="text-ink">{String(total).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
          </p>
        </div>
      ) : null}

      {/*
        Visueel verborgen tussenkop, net als op de collectiepagina. De namen van
        de sieraden zijn h3; zonder deze h2 springt de kopstructuur van h1 naar
        h3 en leest een schermlezer een gat in de hiërarchie.
      */}
      <h2 className="sr-only">Alle sieraden en accessoires</h2>

      <ul className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
        {visible.map((item, index) => {
          const image = getJewelleryMainImage(item);
          const meta = getImageMeta(image.src);
          return (
            <li key={item.id}>
              <article className="group h-full">
                <button
                  type="button"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setOpenIndex(index);
                    track("gallery_open", { dress_slug: item.slug, image_index: 1 });
                  }}
                  data-cursor="Bekijken"
                  className="flex h-full w-full flex-col text-left focus-visible:outline-offset-4"
                  aria-label={`${item.name} vergroot bekijken`}
                >
                  {/* Sieraden zijn op een lichte ondergrond gefotografeerd. Het
                      kader volgt de 3:4-verhouding van de foto's zelf, zodat de
                      armband bovenaan en de spiegeling onderaan in beeld blijven;
                      een vierkante uitsnede sneed die er allebei af. */}
                  <div className="image-frame aspect-[3/4]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(min-width: 1024px) 23vw, 46vw"
                      // Twee, niet vier: onder de donkere paginakop en de
                      // filterbalk is hooguit de bovenrand van de eerste rij
                      // zichtbaar. Elke extra preload vertraagt de kop.
                      priority={index < 2}
                      placeholder={meta.blurDataURL ? "blur" : "empty"}
                      blurDataURL={meta.blurDataURL || undefined}
                      className="object-cover"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute left-3 top-3 font-sans text-[0.55rem] tabular-nums tracking-luxe text-ink/55"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-xl text-ink transition-opacity duration-500 group-hover:opacity-65">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-snug text-muted">{item.tagline}</p>
                  <p className="mt-3 text-[0.58rem] uppercase tracking-luxe text-muted">
                    {/* Het aantal alleen bij een set: "Boeket · 1 stuk" zegt niets. */}
                    {JEWELLERY_TYPE_LABELS[item.type]}
                    {item.pieces.length > 1 ? ` · ${item.pieces.length} stuks` : ""}
                  </p>
                </button>
              </article>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {active ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name}, ${JEWELLERY_TYPE_LABELS[active.type].toLowerCase()} van Dalas`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-noir/95 backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-5 py-4 sm:px-8">
              <p className="font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir-muted">
                {active.name} · {(openIndex ?? 0) + 1} / {total}
              </p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpenIndex(null)}
                aria-label="Sluit de weergave"
                className="inline-flex h-11 w-11 items-center justify-center text-on-noir transition-opacity hover:opacity-70"
              >
                <Close width={22} height={22} />
              </button>
            </div>

            {/*
              Centreren gebeurt met `m-auto` op het kind, niet met
              `items-center` op deze container. In een scrollbare flexcontainer
              verdeelt `items-center` de overloop over bóven en onder, en wat
              boven de scrollpositie uitsteekt is dan onbereikbaar: op mobiel
              viel zo de bovenste helft van de foto weg. Automatische marges
              nemen alleen positieve vrije ruimte op, dus de inhoud staat
              gecentreerd als hij past en bovenaan zodra hij dat niet doet.
            */}
            <div className="relative flex flex-1 overflow-y-auto px-4 pb-10 pt-2 sm:px-16">
              <motion.div
                key={active.slug}
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="m-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2 lg:gap-14"
              >
                {/* Zelfde verhouding als de foto; de hoogte blijft begrensd via
                    de breedte, zodat het sieraad ook op een laag scherm in één
                    oogopslag te zien is. */}
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[min(26rem,48vh)]">
                  <Image
                    src={getJewelleryMainImage(active).src}
                    alt={getJewelleryMainImage(active).alt}
                    fill
                    sizes="(min-width: 1024px) 26rem, 92vw"
                    className="object-contain"
                  />
                </div>

                <div className="text-on-noir">
                  <p className="label text-champagne">{JEWELLERY_TYPE_LABELS[active.type]}</p>
                  <h2 className="display-md mt-4">{active.name}</h2>
                  <p className="mt-5 text-sm leading-[1.75] text-on-noir-muted">{active.description}</p>

                  <dl className="mt-8 border-t border-noir-line text-sm">
                    {/* Materiaal alleen tonen als het bekend is; bij een boeket
                        staat het er bewust niet bij. */}
                    {active.material ? (
                      <div className="flex justify-between gap-6 border-b border-noir-line py-3.5">
                        <dt className="text-[0.65rem] uppercase tracking-luxe text-on-noir-muted">Materiaal</dt>
                        <dd className="text-right text-on-noir">{active.material}</dd>
                      </div>
                    ) : null}
                    {/* Bij één stuk staat het type al boven de naam; dan voegt
                        een regel "Onderdelen: Boeket" niets toe. */}
                    {active.pieces.length > 1 ? (
                      <div className="flex justify-between gap-6 border-b border-noir-line py-3.5">
                        <dt className="text-[0.65rem] uppercase tracking-luxe text-on-noir-muted">Onderdelen</dt>
                        <dd className="text-right text-on-noir">{active.pieces.join(", ")}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-6 border-b border-noir-line py-3.5">
                      <dt className="text-[0.65rem] uppercase tracking-luxe text-on-noir-muted">Prijs</dt>
                      <dd className="text-right text-on-noir">Op aanvraag</dd>
                    </div>
                  </dl>

                  <a
                    // Het onderwerp benoemt het soort stuk, zodat een aanvraag
                    // voor een boeket niet als "Sieraad: …" binnenkomt.
                    href={`/contact?onderwerp=${encodeURIComponent(`${JEWELLERY_TYPE_LABELS[active.type]}: ${active.name}`)}`}
                    onClick={() => track("cta_click", { cta: "sieraad_prijs", location: "sieraden", dress_slug: active.slug })}
                    className="group/cta relative mt-9 inline-flex w-full items-center justify-center overflow-hidden bg-champagne px-8 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-noir sm:w-auto"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-bottom scale-y-0 bg-on-noir transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
                    />
                    <span className="relative">Vraag de prijs op</span>
                  </a>
                </div>
              </motion.div>

              {total > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go((openIndex ?? 0) - 1)}
                    aria-label="Vorig sieraad"
                    className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center text-on-noir transition-opacity hover:opacity-70 sm:left-4"
                  >
                    <ArrowLeft width={24} height={24} />
                  </button>
                  <button
                    type="button"
                    onClick={() => go((openIndex ?? 0) + 1)}
                    aria-label="Volgend sieraad"
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
