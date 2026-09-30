import { DressCard } from "@/components/dress/DressCard";
import type { Dress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DressGridProps {
  dresses: Dress[];
  /** Aantal kolommen op desktop. */
  columns?: 2 | 3 | 4;
  location?: string;
  className?: string;
  /** Aantal kaarten dat met priority laadt (bovenste rij). */
  priorityCount?: number;
}

const columnClasses: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

const sizesFor: Record<2 | 3 | 4, string> = {
  2: "(min-width: 640px) 46vw, 92vw",
  3: "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw",
  4: "(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw",
};

export function DressGrid({ dresses, columns = 3, location, className, priorityCount = 0 }: DressGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-x-6 gap-y-12 sm:gap-x-8 sm:gap-y-16", columnClasses[columns], className)}>
      {dresses.map((dress, index) => (
        <DressCard key={dress.id} dress={dress} priority={index < priorityCount} location={location} sizes={sizesFor[columns]} />
      ))}
    </div>
  );
}
