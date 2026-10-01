"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Mail, WhatsApp } from "@/components/ui/Icons";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { whatsappDisplay, whatsappHref } from "@/lib/site";

/** Pas tonen zodra de hero voorbij is: boven de vouw staat de eigen CTA al. */
const REVEAL_AFTER = 420;

const button =
  "group/sticky flex h-13 w-13 items-center justify-center gap-2.5 rounded-full shadow-lift transition-colors duration-500 ease-[var(--ease-couture)] lg:h-12 lg:w-auto lg:justify-start lg:px-6";
const label = "hidden font-sans text-[0.7rem] font-medium uppercase tracking-luxe lg:inline";

/**
 * Zwevende contactknoppen rechtsonder.
 *
 * Blijft onder de z-index van het menu (70) en de dialogen (80): staat er een
 * overlay open, dan hoort die de knoppen af te dekken.
 */
export function StickyActions() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // Een gewone scroll-listener, geen useScroll van motion: die leest de positie
  // pas bij het eerste animatieframe. Dit meet ook meteen bij het monteren, zodat
  // de knoppen er staan als de pagina al gescrold opent (terugknop, #anker).
  useEffect(() => {
    const update = () => setVisible(window.scrollY > REVEAL_AFTER);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Op de contactpagina zelf voegt een knop naar diezelfde pagina niets toe.
  const showContact = pathname !== "/contact";
  if (!whatsappHref && !showContact) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.94 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex flex-col items-end gap-3 print:hidden"
        >
          {showContact ? (
            <TrackedLink
              href="/contact"
              event="cta_click"
              params={{ location: "sticky", target: "contact" }}
              aria-label="Contact opnemen met Dalas"
              className={`${button} bg-ink text-ivory ring-1 ring-ivory/15 hover:bg-noir-raised`}
            >
              <Mail width={19} height={19} aria-hidden="true" />
              <span className={label}>Contact</span>
            </TrackedLink>
          ) : null}

          {whatsappHref ? (
            <TrackedAnchor
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              event="whatsapp_click"
              params={{ location: "sticky" }}
              aria-label={`Stuur Dalas een WhatsApp-bericht op ${whatsappDisplay}`}
              className={`${button} bg-champagne text-noir hover:bg-on-noir`}
            >
              <WhatsApp width={21} height={21} aria-hidden="true" />
              <span className={label}>WhatsApp</span>
            </TrackedAnchor>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
