import type { Metadata } from "next";
import { DressCard } from "@/components/dress/DressCard";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { getFeaturedDresses } from "@/lib/dresses";

export const metadata: Metadata = {
  title: "Pagina niet gevonden",
  robots: { index: false, follow: true },
};

/**
 * 404. Een bezoeker die op een verwijderde jurkpagina landt, krijgt meteen
 * alternatieven te zien in plaats van een doodlopende pagina.
 */
export default function NotFound() {
  const suggestions = getFeaturedDresses(3);

  return (
    <>
      <Section tone="noir" spacing="wide" className="pt-40 sm:pt-48">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_0%,#241d18_0%,#0d0b0a_60%)]"
        />
        <div className="container-x text-center">
          <p className="font-display text-[clamp(5rem,18vw,14rem)] leading-none text-on-noir/10" aria-hidden="true">
            404
          </p>
          <div className="mx-auto -mt-8 max-w-xl sm:-mt-14">
            <h1 className="display-lg text-on-noir">Deze pagina bestaat niet meer</h1>
            <p className="mt-8 text-base leading-[1.75] text-on-noir-muted">
              Mogelijk is de jurk uit de collectie gehaald of klopt het adres niet. Bekijk de volledige collectie of neem contact met
              ons op.
            </p>
            <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/jurken" tone="noir" data-cursor="Bekijken">
                Bekijk de collectie
                <ArrowRight width={15} height={15} />
              </LinkButton>
              <LinkButton href="/contact" variant="outline" tone="noir">
                Neem contact op
              </LinkButton>
            </div>
          </div>
        </div>
      </Section>

      <Section spacing="default">
        <div className="container-x">
          <h2 className="label text-center text-gold">Misschien zoek je deze</h2>
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((dress) => (
              <DressCard key={dress.id} dress={dress} location="404" sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw" />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
