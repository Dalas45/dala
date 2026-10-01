import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { emailHref, siteConfig } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacyverklaring | Dalas",
  description:
    "Hoe Dalas omgaat met de gegevens die je achterlaat via het contact- of afspraakformulier: wat we bewaren, hoelang, en welke rechten je hebt.",
  path: "/privacy",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Privacy", href: "/privacy" },
];

const sections = [
  {
    title: "Wie verantwoordelijk is",
    body: `${siteConfig.fullName} is verantwoordelijk voor de verwerking van je gegevens. We staan ingeschreven bij de Kamer van Koophandel onder nummer ${siteConfig.business.kvk} en ons btw-identificatienummer is ${siteConfig.business.vat}.`,
  },
  {
    title: "Welke gegevens we verzamelen",
    body: "Wanneer je een formulier op deze website invult, vragen we om je naam en e-mailadres, en optioneel om je telefoonnummer en een bericht. Bij een afspraak- of prijsaanvraag leggen we vast om welke jurk het gaat.",
  },
  {
    title: "Waarvoor we ze gebruiken",
    body: "We gebruiken deze gegevens uitsluitend om je aanvraag te beantwoorden en om een afspraak met je te maken. We sturen je geen nieuwsbrief tenzij je daar zelf om vraagt, en we verkopen je gegevens niet.",
  },
  {
    title: "Hoe ze worden verstuurd",
    body: "Formulieren worden op onze server verwerkt en als e-mail naar ons doorgestuurd. Om misbruik tegen te gaan controleren we of een formulier niet automatisch is ingevuld en beperken we het aantal aanvragen per bezoeker.",
  },
  {
    title: "Statistieken",
    body: "We meten hoe de website wordt gebruikt om hem te kunnen verbeteren, bijvoorbeeld welke pagina's worden bekeken en op welke knoppen wordt geklikt. Voor zover daarbij cookies of vergelijkbare technieken worden ingezet, gebeurt dat via de instellingen die voor deze website zijn geconfigureerd.",
  },
];

/**
 * Privacyverklaring.
 *
 * LET OP: dit is een feitelijke basis op grond van wat de website technisch doet.
 * Laat de tekst vóór livegang juridisch controleren en vul aan wat hier nog
 * ontbreekt (verwerkersovereenkomsten, bewaartermijnen).
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Juridisch" title="Privacyverklaring" breadcrumbs={breadcrumbs} />

      <Section spacing="tight">
        <div className="container-x">
          <div className="max-w-3xl">
            <div className="border-t border-line">
              {sections.map((section, index) => (
                <div key={section.title} className="flex gap-7 border-b border-line py-9 sm:gap-12">
                  <span className="font-sans text-[0.62rem] tabular-nums tracking-luxe text-gold" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="display-sm">{section.title}</h2>
                    <p className="mt-3.5 text-sm leading-[1.75] text-muted">{section.body}</p>
                  </div>
                </div>
              ))}

              <div className="flex gap-7 border-b border-line py-9 sm:gap-12">
                <span className="font-sans text-[0.62rem] tabular-nums tracking-luxe text-gold" aria-hidden="true">
                  {String(sections.length + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="display-sm">Je rechten</h2>
                  <p className="mt-3.5 text-sm leading-[1.75] text-muted">
                    Je mag ons altijd vragen welke gegevens we van je hebben, ze laten corrigeren of laten verwijderen. Stuur daarvoor
                    een bericht via de{" "}
                    <Link href="/contact" className="link-underline text-ink">
                      contactpagina
                    </Link>
                    {emailHref ? (
                      <>
                        {" "}
                        of mail naar{" "}
                        <a href={emailHref} className="link-underline text-ink">
                          {siteConfig.contact.email}
                        </a>
                      </>
                    ) : null}
                    .
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-10 text-xs leading-relaxed text-muted">
              Deze verklaring beschrijft wat de website technisch doet. Laat hem vóór livegang juridisch controleren en vul de
              bewaartermijnen aan.
            </p>
          </div>
        </div>
      </Section>

      <StructuredData schema={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
