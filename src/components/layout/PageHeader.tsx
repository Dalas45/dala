import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { BreadcrumbItem } from "@/lib/schema";

interface PageHeaderProps {
  eyebrow: string;
  title: ReactNode;
  /** Tekst rechts naast de titel. */
  intro?: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  /** Genummerd label, bijvoorbeeld het aantal jurken. */
  index?: string;
  children?: ReactNode;
}

/**
 * Donkere opening voor subpagina's.
 *
 * Elke pagina begint hiermee, zodat de site overal hetzelfde ritme heeft:
 * eerst noir, daarna licht. De header rekent daarop en toont bovenaan altijd
 * lichte letters.
 *
 * Server component met CSS-entree, dus geen hydration-afhankelijkheid.
 */
export function PageHeader({ eyebrow, title, intro, breadcrumbs, index, children }: PageHeaderProps) {
  return (
    <section className="tone-noir grain relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40 lg:pb-24 lg:pt-48">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_80%_0%,#241d18_0%,#120f0d_55%,#0a0908_100%)]"
      />

      <div className="container-x">
        <div className="rise" style={{ animationDelay: "0.05s" }}>
          <Breadcrumbs items={breadcrumbs} tone="noir" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="rise flex items-center gap-4" style={{ animationDelay: "0.12s" }}>
              <span className="h-px w-10 bg-champagne" aria-hidden="true" />
              <p className="label text-champagne">{eyebrow}</p>
            </div>

            {/*
              Geen `overflow-hidden` op de omhulling: `.unveil` maskeert zichzelf
              met clip-path, en een tweede masker zou de staarten van j, g en y
              er recht afsnijden.
            */}
            <h1 className="display-lg mt-7 text-on-noir">
              <span className="block">
                <span className="unveil block" style={{ animationDelay: "0.22s" }}>
                  {title}
                </span>
              </span>
            </h1>
          </div>

          {intro ? (
            <div className="rise lg:col-span-4 lg:col-start-9 lg:pt-3" style={{ animationDelay: "0.42s" }}>
              <p className="text-base leading-[1.75] text-on-noir-muted">{intro}</p>
              {index ? <p className="index-tag mt-8 border-t border-noir-line pt-5">{index}</p> : null}
            </div>
          ) : null}
        </div>

        {children ? (
          <div className="rise mt-14" style={{ animationDelay: "0.55s" }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
