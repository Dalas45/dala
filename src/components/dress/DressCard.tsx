import Image from "next/image";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { COLOR_LABELS, SILHOUETTE_LABELS, formatPrice, getImageMeta, getMainImage } from "@/lib/dresses";
import type { Dress } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DressCardProps {
  dress: Dress;
  /** Bovenste rij op de collectiepagina: prioriteit voor de LCP. */
  priority?: boolean;
  /** Waar de kaart staat; komt mee in het analytics-event. */
  location?: string;
  /** Volgnummer, getoond als 01, 02, … */
  index?: number;
  className?: string;
  /** Sizes-attribuut, afgestemd op de grid waarin de kaart staat. */
  sizes?: string;
  tone?: "light" | "noir";
}

/**
 * Kaart in de collectiegrid. De hele kaart is één link naar de jurkpagina,
 * zodat er op mobiel geen concurrerende touch-targets ontstaan.
 *
 * Het volgnummer staat in de hoek van de foto en gebruikt `mix-blend-difference`,
 * waardoor het op elke onderliggende foto leesbaar blijft.
 */
export function DressCard({
  dress,
  priority = false,
  location = "collectie",
  index,
  className,
  sizes = "(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw",
  tone = "light",
}: DressCardProps) {
  const image = getMainImage(dress);
  const meta = getImageMeta(image.src);
  const price = formatPrice(dress);

  return (
    <article className={cn("group h-full", className)}>
      <TrackedLink
        href={`/jurken/${dress.slug}`}
        event="cta_click"
        params={{ cta: "jurk_kaart", location, dress_slug: dress.slug }}
        data-cursor="Bekijken"
        className="flex h-full flex-col focus-visible:outline-offset-4"
      >
        <div className="image-frame aspect-[3/4]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder={meta.blurDataURL ? "blur" : "empty"}
            blurDataURL={meta.blurDataURL || undefined}
            className="object-cover"
          />
          {typeof index === "number" ? (
            <span
              aria-hidden="true"
              className="absolute left-4 top-4 font-sans text-[0.6rem] tabular-nums tracking-luxe text-ivory mix-blend-difference"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <h3
            className={cn(
              "font-display text-2xl transition-opacity duration-500 group-hover:opacity-65",
              tone === "noir" ? "text-on-noir" : "text-ink",
            )}
          >
            {dress.name}
          </h3>
          <p
            className={cn(
              "shrink-0 pt-1.5 text-right text-[0.62rem] uppercase tracking-luxe",
              tone === "noir" ? "text-on-noir-muted" : "text-muted",
            )}
          >
            {price ?? "Op aanvraag"}
          </p>
        </div>

        <p className={cn("mt-2 text-sm leading-snug", tone === "noir" ? "text-on-noir-muted" : "text-muted")}>{dress.tagline}</p>

        {/* Direct onder de tagline in plaats van onderaan uitgelijnd: in de
            verspringende grid zou uitlijnen de regel juist los doen zweven. */}
        <p className={cn("mt-4 text-[0.6rem] uppercase tracking-luxe", tone === "noir" ? "text-on-noir-muted" : "text-muted")}>
          {SILHOUETTE_LABELS[dress.silhouette]} · {COLOR_LABELS[dress.color]}
        </p>
      </TrackedLink>
    </article>
  );
}
