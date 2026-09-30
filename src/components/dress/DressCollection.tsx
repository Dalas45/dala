"use client";

import { useMemo, useState } from "react";
import { DressCard } from "@/components/dress/DressCard";
import { DressFilters, type FilterOptions, type FilterState } from "@/components/dress/DressFilters";
import { LinkButton } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { filterDresses } from "@/lib/dresses";
import type { Dress } from "@/lib/types";

const EMPTY: FilterState = { silhouette: [], color: [], sleeves: [] };

/**
 * Client-gedeelte van de collectiepagina: filters plus grid.
 * De jurken komen als props binnen uit de server component.
 *
 * De grid is bewust verspringend: elke tweede kaart staat iets lager, wat de
 * pagina een editorial ritme geeft in plaats van een strak webshop-raster.
 */
export function DressCollection({ dresses, options }: { dresses: Dress[]; options: FilterOptions }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY);

  const visible = useMemo(() => filterDresses(dresses, filters), [dresses, filters]);

  const handleChange = (next: FilterState) => {
    // Log alleen de groep die daadwerkelijk veranderde.
    (Object.keys(next) as Array<keyof FilterState>).forEach((group) => {
      if (next[group].length !== filters[group].length) {
        track("filter_change", { filter: group, value: next[group].join(",") || "leeg", active: next[group].length });
      }
    });
    setFilters(next);
  };

  return (
    <>
      <DressFilters options={options} value={filters} onChange={handleChange} resultCount={visible.length} totalCount={dresses.length} />

      {visible.length > 0 ? (
        <>
          {/*
            Visueel verborgen tussenkop. De jurknamen in de kaarten zijn h3;
            zonder deze h2 zou de kopstructuur van h1 naar h3 springen.
          */}
          <h2 className="sr-only">Alle trouwjurken in de collectie</h2>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {visible.map((dress, index) => (
              <DressCard
                key={dress.id}
                dress={dress}
                index={index}
                // Twee in plaats van drie: de grid begint pas onder de donkere
                // kop en de filterbalk, dus de derde kaart haalt de vouw niet.
                priority={index < 2}
                location="collectiepagina"
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                // Elke tweede kaart zakt iets, wat de grid zijn editorial ritme geeft.
                className={index % 2 === 1 ? "lg:mt-20" : undefined}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-20 border border-line bg-porcelain px-6 py-20 text-center">
          <h2 className="display-sm">Geen jurken met deze combinatie</h2>
          <p className="lead mx-auto mt-5 max-w-md">
            Pas je filters aan om meer jurken te zien, of laat ons weten waar je naar op zoek bent. We denken graag met je mee.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <LinkButton href="/contact" variant="outline">
              Stel je vraag
            </LinkButton>
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="group/cta relative inline-flex items-center justify-center overflow-hidden bg-ink px-8 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-ivory transition-colors duration-500 hover:text-noir"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
              />
              <span className="relative">Wis alle filters</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
