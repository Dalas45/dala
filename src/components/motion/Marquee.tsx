import { cn } from "@/lib/utils";

/**
 * Doorlopende tekstband. Pure CSS-animatie, dus geen JavaScript en geen
 * hydration-afhankelijkheid; de band draait ook tijdens het laden al.
 *
 * De inhoud wordt twee keer gerenderd zodat de lus naadloos is. De tweede kopie
 * is `aria-hidden`, zodat een schermlezer de tekst één keer hoort.
 */
export function Marquee({
  items,
  className,
  separator = "·",
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="label whitespace-nowrap px-6 sm:px-9">{item}</span>
          <span className="text-champagne" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("tone-noir relative overflow-hidden border-y border-noir-line py-5 text-on-noir", className)}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
