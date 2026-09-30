"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PriceRequestForm } from "@/components/forms/PriceRequestForm";
import { Close } from "@/components/ui/Icons";
import { track } from "@/lib/analytics";

/**
 * "Prijs opvragen" op een jurkpagina.
 *
 * Het formulier staat ook los op de pagina (id="prijs-opvragen") zodat het
 * zonder JavaScript bereikbaar blijft; dit paneel haalt het alleen naar voren
 * voor wie de knop gebruikt. Escape sluit, de focus gaat naar het paneel en
 * keert daarna terug naar de knop.
 *
 * Het paneel schuift op desktop van rechts in beeld, als een la in het atelier.
 */
export function PriceRequestDialog({ dressSlug, dressName }: { dressSlug: string; dressName: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      // Focus terug naar de knop die het venster opende.
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
          track("cta_click", { cta: "prijs_opvragen", location: "jurkpagina", dress_slug: dressSlug });
        }}
        data-cursor="Opvragen"
        className="group/cta relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap border border-ink/20 px-8 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-ink transition-colors duration-500 hover:text-noir sm:w-auto"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
        />
        <span className="relative">Prijs opvragen</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.4 }}
            className="fixed inset-0 z-[80] flex items-end justify-end bg-noir/60 backdrop-blur-sm sm:items-stretch"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="prijs-dialoog-titel"
              tabIndex={-1}
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="tone-noir grain max-h-[92vh] w-full overflow-y-auto p-7 shadow-lift sm:max-h-none sm:w-[34rem] sm:p-12"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-champagne" aria-hidden="true" />
                    <p className="label text-champagne">Vrijblijvend</p>
                  </div>
                  <h2 id="prijs-dialoog-titel" className="display-sm mt-5 text-on-noir">
                    Prijs opvragen
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Sluit het formulier"
                  className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center text-on-noir transition-colors hover:text-champagne"
                >
                  <Close width={20} height={20} />
                </button>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-on-noir-muted">
                Laat je gegevens achter en je ontvangt zo snel mogelijk een persoonlijk antwoord met de huurprijs en de
                mogelijkheden.
              </p>

              <div className="mt-9">
                <PriceRequestForm dressSlug={dressSlug} dressName={dressName} tone="noir" />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
