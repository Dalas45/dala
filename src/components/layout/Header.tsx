"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/layout/Logo";
import { Close, Phone, WhatsApp } from "@/components/ui/Icons";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { navigation, phoneHref, siteConfig, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Header die meeademt met de pagina.
 *
 * Elke pagina opent met een donkere sectie, dus bovenaan is de header
 * transparant met lichte letters. Zodra je die opening voorbij scrollt, klapt
 * hij om naar een ivoren balk met donkere letters.
 *
 * Het mobiele menu is een fullscreen paneel dat van boven naar beneden opent,
 * met de navigatie in groot display-formaat.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const reduce = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Sluit het menu bij navigatie. Tijdens de render aanpassen in plaats van in
  // een effect voorkomt dat het oude menu nog één frame zichtbaar blijft.
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    let previous = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // Verbergen bij naar beneden scrollen geeft de fotografie het volle scherm.
      setHidden(y > 400 && y > previous);
      previous = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const onNoir = !scrolled && !open;

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: hidden && !open ? "-105%" : 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,padding,border-color] duration-700 ease-[var(--ease-couture)]",
          onNoir
            ? "border-b border-transparent bg-transparent py-6 text-on-noir sm:py-8"
            : "border-b border-line bg-ivory/92 py-4 text-ink backdrop-blur-xl",
        )}
      >
        <div className="container-x flex items-center justify-between gap-8">
          <Logo compact={!onNoir} />

          <nav aria-label="Hoofdnavigatie" className="hidden items-center gap-10 lg:flex">
            {navigation.main.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group/nav relative font-sans text-[0.66rem] uppercase tracking-luxe transition-opacity duration-500",
                    active ? "opacity-100" : "opacity-70 hover:opacity-100",
                  )}
                >
                  <span className="mr-2 text-[0.55rem] tabular-nums opacity-45">{String(index + 1).padStart(2, "0")}</span>
                  <span className="rule-hover">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            {phoneHref ? (
              <TrackedAnchor
                href={phoneHref}
                event="phone_click"
                params={{ location: "header" }}
                className="hidden items-center gap-2 font-sans text-[0.66rem] uppercase tracking-luxe opacity-75 transition-opacity hover:opacity-100 xl:inline-flex"
              >
                <Phone width={14} height={14} />
                <span className="sr-only">Bel Dalas: </span>
                {siteConfig.contact.phone}
              </TrackedAnchor>
            ) : null}

            {whatsappHref ? (
              <TrackedAnchor
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                event="whatsapp_click"
                params={{ location: "header" }}
                className="inline-flex h-10 w-10 items-center justify-center opacity-80 transition-opacity hover:opacity-100 lg:hidden"
                aria-label="Stuur een WhatsApp-bericht naar Dalas"
              >
                <WhatsApp width={19} height={19} />
              </TrackedAnchor>
            ) : null}

            <TrackedLink
              href="/afspraak"
              event="cta_click"
              params={{ cta: "afspraak", location: "header" }}
              data-cursor="Plannen"
              className={cn(
                "group/cta relative hidden overflow-hidden px-7 py-3.5 font-sans text-[0.66rem] uppercase tracking-luxe transition-colors duration-500 lg:inline-flex",
                onNoir ? "bg-champagne text-noir" : "bg-ink text-ivory",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100",
                  onNoir ? "bg-on-noir" : "bg-champagne",
                )}
              />
              <span className="relative">Plan een afspraak</span>
            </TrackedLink>

            {/* Menuknop: drie lijnen die bij hover uit elkaar lopen. */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              aria-controls="mobiel-menu"
              className="group/menu inline-flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-couture)] group-hover/menu:-translate-y-0.5" />
              <span className="h-px w-6 bg-current" />
              <span className="h-px w-6 bg-current transition-transform duration-500 ease-[var(--ease-couture)] group-hover/menu:translate-y-0.5" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobiel-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigatiemenu"
            initial={{ clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: reduce ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)", opacity: reduce ? 0 : 1 }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="tone-noir grain fixed inset-0 z-[70] flex flex-col lg:hidden"
          >
            <div className="container-x flex items-center justify-between py-6 text-on-noir">
              <Logo />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menu sluiten"
                className="inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-65"
              >
                <Close width={22} height={22} />
              </button>
            </div>

            <nav aria-label="Mobiele navigatie" className="container-x flex flex-1 flex-col justify-center">
              <ul>
                {navigation.main.map((item, index) => (
                  <li key={item.href} className="overflow-hidden border-b border-noir-line">
                    <motion.div
                      initial={{ y: reduce ? 0 : "100%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.18 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link href={item.href} className="flex items-baseline gap-4 py-5 text-on-noir transition-opacity hover:opacity-65">
                        <span className="font-sans text-[0.6rem] tabular-nums tracking-luxe text-champagne">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="display-sm font-display">{item.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.5 }}
                className="mt-12 space-y-3"
              >
                <TrackedLink
                  href="/afspraak"
                  event="cta_click"
                  params={{ cta: "afspraak", location: "mobiel_menu" }}
                  className="flex w-full items-center justify-center bg-champagne px-6 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-noir"
                >
                  Plan een afspraak
                </TrackedLink>
                {phoneHref ? (
                  <TrackedAnchor
                    href={phoneHref}
                    event="phone_click"
                    params={{ location: "mobiel_menu" }}
                    className="flex w-full items-center justify-center gap-2 border border-on-noir/25 px-6 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir"
                  >
                    <Phone width={15} height={15} />
                    {siteConfig.contact.phone}
                  </TrackedAnchor>
                ) : null}
                {whatsappHref ? (
                  <TrackedAnchor
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="whatsapp_click"
                    params={{ location: "mobiel_menu" }}
                    className="flex w-full items-center justify-center gap-2 border border-on-noir/25 px-6 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir"
                  >
                    <WhatsApp width={16} height={16} />
                    WhatsApp
                  </TrackedAnchor>
                ) : null}
              </motion.div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
