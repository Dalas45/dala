import Image from "next/image";
import { SilkBackdrop } from "@/components/three/SilkBackdrop";
import { ArrowRight } from "@/components/ui/Icons";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { GeneratedImage } from "@/data/images.generated";

interface HeroProps {
  image: { src: string; alt: string };
  meta: GeneratedImage;
  dressCount: number;
}

/**
 * Hero: een fullscreen donker openingsbeeld.
 *
 * Opbouw in lagen:
 *  1. Diepe noir met een subtiel verloop — altijd zichtbaar, geen laadkosten.
 *  2. De 3D-zijde, die alleen laadt wanneer het apparaat dat aankan.
 *  3. De fotografie rechts, die achter een oplopend gordijn vandaan komt.
 *
 * De entree is bewust CSS en geen JavaScript: zo hoeft de hero niet op
 * hydration te wachten en valt de Largest Contentful Paint bij de eerste paint.
 * Daarom is dit ook een server component.
 */
export function Hero({ image, meta, dressCount }: HeroProps) {
  return (
    <section className="tone-noir grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-14 pt-28 sm:pb-16 sm:pt-32 lg:pb-20">
      {/* Laag 1: statische basis en fallback */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(130%_90%_at_72%_18%,#241d18_0%,#120f0d_52%,#0a0908_100%)]"
      />
      {/* Laag 2: 3D-zijde, alleen wanneer het apparaat het aankan.
          Op een smal scherm vult de scene het hele beeld, dus daar staat hij
          bewust zachter dan op desktop. */}
      <SilkBackdrop className="absolute inset-0 -z-10 opacity-55 sm:opacity-80" />

      <div className="container-x flex flex-1 items-center">
        <div className="grid w-full items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="rise flex items-center gap-4" style={{ animationDelay: "0.1s" }}>
              <span className="h-px w-10 bg-champagne" aria-hidden="true" />
              <p className="label text-champagne">Trouwjurken huren</p>
            </div>

            {/*
              Elke regel komt achter een eigen masker vandaan. Puur CSS, dus de
              tekst staat vanaf de eerste paint in de HTML.

              De regelomhulling knipt bewust niets af: `.unveil` maskeert zichzelf
              al met clip-path. Een extra `overflow-hidden` hier zou de staarten
              van de j en de g er alsnog recht afsnijden.
            */}
            <h1 className="display-xl mt-7 text-on-noir">
              <span className="block">
                <span className="unveil block" style={{ animationDelay: "0.2s" }}>
                  Vind de
                </span>
              </span>
              <span className="block">
                <span className="unveil block" style={{ animationDelay: "0.33s" }}>
                  trouwjurk
                </span>
              </span>
              <span className="block">
                <span className="unveil block italic text-champagne" style={{ animationDelay: "0.46s" }}>
                  die jou draagt.
                </span>
              </span>
            </h1>

            <div className="mt-8 sm:mt-10">
              {/* De tekst blijft smal voor de leesbaarheid; de knoppen mogen breder. */}
              <p
                className="rise max-w-md text-[0.95rem] leading-[1.7] text-on-noir-muted sm:text-base"
                style={{ animationDelay: "0.66s" }}
              >
                Een atelier van {dressCount} zorgvuldig gekozen trouwjurken, van volle baljurken tot getailleerde silhouetten. Je past
                ze in alle rust, met persoonlijke begeleiding.
              </p>

              <div className="rise mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap" style={{ animationDelay: "0.78s" }}>
                <TrackedLink
                  href="/jurken"
                  event="cta_click"
                  params={{ cta: "bekijk_collectie", location: "hero" }}
                  data-cursor="Bekijken"
                  className="group/cta relative inline-flex items-center justify-center gap-3 overflow-hidden bg-champagne px-9 py-4.5 font-sans text-[0.7rem] uppercase tracking-luxe text-noir"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-on-noir transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
                  />
                  <span className="relative flex items-center gap-3">
                    Bekijk de collectie
                    <ArrowRight width={15} height={15} className="transition-transform duration-500 group-hover/cta:translate-x-1" />
                  </span>
                </TrackedLink>

                <TrackedLink
                  href="/afspraak"
                  event="cta_click"
                  params={{ cta: "afspraak", location: "hero" }}
                  data-cursor="Plannen"
                  className="group/cta relative inline-flex items-center justify-center overflow-hidden border border-on-noir/25 px-9 py-4.5 font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir transition-colors duration-500 hover:text-noir"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
                  />
                  <span className="relative">Plan een afspraak</span>
                </TrackedLink>
              </div>
            </div>
          </div>

          {/* Fotografie: staat rechts, komt achter een gordijn vandaan. */}
          <div className="lg:col-span-6 lg:col-start-7">
            {/*
              Het kader heeft dezelfde 3:4-verhouding als de foto's zelf, zodat
              `object-cover` niets wegsnijdt en de hele jurk in beeld staat.

              De hoogte wordt begrensd via de BREEDTE (54vh × 4/3 ≈ 72vh) en niet
              via `max-height`. Een hoogtegrens zou het kader liggend maken en de
              foto alsnog strak inzoomen op het midden.
            */}
            <div
              className="image-frame curtain relative aspect-[3/4] w-full shadow-lift lg:ml-auto lg:max-w-[min(32rem,54vh)]"
              style={{ animationDelay: "0.35s" }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 32rem, 92vw"
                priority
                fetchPriority="high"
                placeholder={meta.blurDataURL ? "blur" : "empty"}
                blurDataURL={meta.blurDataURL || undefined}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Onderbalk: index en scroll-hint */}
      <div className="container-x">
        <div className="rise flex items-end justify-between gap-6 border-t border-noir-line pt-6" style={{ animationDelay: "0.95s" }}>
          <p className="index-tag">
            <span className="text-champagne">{String(dressCount).padStart(2, "0")}</span> trouwjurken in de collectie
          </p>
          <p className="label hidden items-center gap-3 text-on-noir-muted sm:flex">
            Scroll
            <span className="relative block h-8 w-px overflow-hidden bg-noir-line" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-3 animate-[dalas-rise_1.6s_var(--ease-couture)_infinite] bg-champagne" />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
