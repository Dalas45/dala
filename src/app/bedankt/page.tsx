import type { Metadata } from "next";
import { ConversionBeacon, type ThanksKind } from "@/components/forms/ConversionBeacon";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight, WhatsApp } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { getDressBySlug } from "@/lib/dresses";
import { whatsappDisplay, whatsappHref } from "@/lib/site";

export const metadata: Metadata = {
  // Zonder "| Dalas": de title-template van de root layout plakt die er al achter.
  title: "Bedankt voor je aanvraag",
  // Een bedankpagina hoort niet in de zoekresultaten: hij heeft alleen betekenis
  // direct na het versturen van een formulier. `follow` blijft aan, zodat de
  // links naar de collectie hun waarde wel doorgeven.
  robots: { index: false, follow: true },
};

const TEKSTEN: Record<ThanksKind, { eyebrow: string; titel: string; body: string }> = {
  afspraak: {
    eyebrow: "Aanvraag ontvangen",
    titel: "Je pasafspraak is aangevraagd",
    body: "We nemen zo snel mogelijk persoonlijk contact met je op om een moment af te spreken dat jou schikt. Houd je mail in de gaten, en kijk ook even in je spambox als je niets ziet.",
  },
  prijs: {
    eyebrow: "Aanvraag ontvangen",
    titel: "Je prijsaanvraag is verstuurd",
    body: "Je krijgt zo snel mogelijk een persoonlijk antwoord met de huurprijs en wat daarbij inbegrepen is. Houd je mail in de gaten, en kijk ook even in je spambox als je niets ziet.",
  },
  contact: {
    eyebrow: "Bericht ontvangen",
    titel: "Bedankt voor je bericht",
    body: "We lezen het en reageren zo snel mogelijk. Houd je mail in de gaten, en kijk ook even in je spambox als je niets ziet.",
  },
};

function isKind(waarde: unknown): waarde is ThanksKind {
  return waarde === "afspraak" || waarde === "prijs" || waarde === "contact";
}

/**
 * Bevestiging na een verstuurd formulier.
 *
 * Een eigen URL in plaats van een melding op de pagina zelf: dat geeft de
 * bezoeker een duidelijk eindpunt, en het maakt de aanvraag meetbaar als
 * conversie in Google Ads en Analytics.
 */
export default async function BedanktPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const soort: ThanksKind = isKind(params.type) ? params.type : "contact";
  // De slug gaat door onze eigen data heen; de parameter zelf komt nooit in beeld.
  const jurk = typeof params.jurk === "string" ? getDressBySlug(params.jurk) : undefined;
  const tekst = TEKSTEN[soort];

  return (
    <>
      <ConversionBeacon kind={soort} dressSlug={jurk?.slug} />

      <Section tone="noir" spacing="wide" className="pt-40 sm:pt-48">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_0%,#241d18_0%,#0d0b0a_60%)]"
        />
        <div className="container-x text-center">
          <div className="mx-auto max-w-2xl">
            <p className="label text-champagne">{tekst.eyebrow}</p>
            <h1 className="display-lg mt-7 text-on-noir">{tekst.titel}</h1>
            <p className="mt-8 text-base leading-[1.75] text-on-noir-muted">
              {jurk ? `Het gaat om ${jurk.name}. ` : ""}
              {tekst.body}
            </p>

            <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/jurken" tone="noir" data-cursor="Bekijken">
                Verder kijken in de collectie
                <ArrowRight width={15} height={15} />
              </LinkButton>
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Stuur Dalas een WhatsApp-bericht op ${whatsappDisplay}`}
                  className="group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap border border-on-noir/25 px-8 py-4 font-sans text-[0.7rem] font-medium uppercase tracking-luxe text-on-noir transition-colors duration-500 ease-[var(--ease-couture)] hover:border-champagne hover:text-noir"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/btn:scale-y-100"
                  />
                  <span className="relative flex items-center gap-2.5">
                    <WhatsApp width={16} height={16} />
                    Liever direct contact
                  </span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
