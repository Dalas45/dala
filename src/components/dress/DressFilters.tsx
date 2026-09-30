"use client";

import { COLOR_LABELS, SILHOUETTE_LABELS, SLEEVE_LABELS } from "@/lib/dresses";
import type { DressColor, Silhouette, Sleeves } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface FilterState {
  silhouette: Silhouette[];
  color: DressColor[];
  sleeves: Sleeves[];
}

export type FilterOptions = FilterState;

interface DressFiltersProps {
  options: FilterOptions;
  value: FilterState;
  onChange: (next: FilterState) => void;
  resultCount: number;
  totalCount: number;
}

type Group = keyof FilterState;

const GROUP_LABELS: Record<Group, string> = {
  silhouette: "Silhouet",
  color: "Kleur",
  sleeves: "Mouwen",
};

const VALUE_LABELS: Record<Group, Record<string, string>> = {
  silhouette: SILHOUETTE_LABELS,
  color: COLOR_LABELS,
  sleeves: SLEEVE_LABELS,
};

/**
 * Filterbalk voor de collectiepagina.
 *
 * Alleen groepen waarvoor daadwerkelijk meerdere waarden bestaan worden getoond;
 * filters die niets kunnen doen laten we weg. De keuzes zijn checkboxen met een
 * eigen opmaak, zodat toetsenbordbediening en schermlezers blijven werken.
 */
export function DressFilters({ options, value, onChange, resultCount, totalCount }: DressFiltersProps) {
  const groups = (Object.keys(GROUP_LABELS) as Group[]).filter((group) => options[group].length > 0);
  const activeCount = groups.reduce((sum, group) => sum + value[group].length, 0);

  if (groups.length === 0) return null;

  const toggle = (group: Group, item: string) => {
    const current = value[group] as string[];
    const next = current.includes(item) ? current.filter((v) => v !== item) : [...current, item];
    onChange({ ...value, [group]: next } as FilterState);
  };

  return (
    <div className="border-y border-line py-8">
      <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-7 sm:flex-row sm:flex-wrap sm:gap-12">
          {groups.map((group) => (
            <fieldset key={group} className="min-w-0">
              <legend className="mb-4 font-sans text-[0.58rem] uppercase tracking-wide-luxe text-muted">{GROUP_LABELS[group]}</legend>
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {options[group].map((item) => {
                  const checked = (value[group] as string[]).includes(item);
                  return (
                    <label
                      key={item}
                      className={cn(
                        "group/filter relative cursor-pointer select-none font-sans text-[0.72rem] uppercase tracking-luxe transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-gold",
                        checked ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(group, item)} />
                      {VALUE_LABELS[group][item] ?? item}
                      {/* Onderstreping markeert de actieve keuze; geen zware pillen. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ease-[var(--ease-couture)]",
                          checked ? "scale-x-100" : "scale-x-0 group-hover/filter:scale-x-100",
                        )}
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex items-center gap-6 xl:pt-9">
          <p aria-live="polite" className="font-sans text-[0.68rem] tabular-nums uppercase tracking-luxe text-muted">
            <span className="text-ink">{String(resultCount).padStart(2, "0")}</span> / {String(totalCount).padStart(2, "0")} jurken
          </p>
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={() => onChange({ silhouette: [], color: [], sleeves: [] })}
              className="link-underline font-sans text-[0.68rem] uppercase tracking-luxe text-gold"
            >
              Wis filters
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
