import type { Metadata } from "next";
import Link from "next/link";
import { DressCollection } from "@/components/dress/DressCollection";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { getAllDresses, getAvailableFilterOptions } from "@/lib/dresses";
import { breadcrumbSchema, collectionSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Alle trouwjurken huren | De collectie van Dalas",
  description:
    "Bekijk alle trouwjurken van Dalas: baljurken, getailleerde jurken en A-lijn bruidsjurken met kant, kralen en sleep. Vraag de prijs op of plan een pasafspraak.",
  path: "/jurken",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Trouwjurken", href: "/jurken" },
];

/**
 * Uitleg onder de grid. Puur beschrijvend: dit zijn algemene kenmerken van de
 * silhouetten, geen uitspraken over prijzen, voorwaarden of wat klanten kiezen.
 * Het geeft de categoriepagina de inhoud die hij als zoekresultaat nodig heeft,
 * zonder iets te beweren dat de eigenaar nog moet bevestigen.
 */
const silhouetten = [
  {
    naam: "Baljurk",
    body: "Een strak lijfje met een volle rok die vanaf de taille uitloopt. Het klassieke prinsessensilhouet, met het meeste volume en meestal een sleep.",
  },
  {
    naam: "Getailleerd",
    body: "Volgt de lijn van het lichaam tot over de heup en loopt daarna pas uit. Laat je figuur zien en beweegt rustiger dan een baljurk.",
  },
  {
    naam: "A-lijn",
    body: "Loopt vanaf de taille geleidelijk breder uit, in de vorm van een A. Zit tussen de baljurk en het getailleerde model in.",
  },
  {
    naam: "Kort",
    body: "Tot boven de knie. Vaak gedragen na de ceremonie, of op een bruiloft waarop je vooral wilt kunnen bewegen.",
  },
];

export default function DressesPage() {
  const dresses = getAllDresses();
  const options = getAvailableFilterOptions(dresses);

  return (
    <>
      <PageHeader
        eyebrow="De collectie"
        title="Trouwjurken huren"
        breadcrumbs={breadcrumbs}
        intro="Zorgvuldig geselecteerde trouwjurken, van volle baljurken tot getailleerde silhouetten. Filter op silhouet, kleur of mouwen en vraag van elke jurk vrijblijvend de prijs op."
        index={`${String(dresses.length).padStart(2, "0")} jurken beschikbaar`}
      />

      <Section spacing="tight">
        <div className="container-x">
          <DressCollection dresses={dresses} options={options} />
        </div>
      </Section>

      <Section tone="cream" aria-labelledby="trouwjurk-huren-uitleg">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeader
                  eyebrow="Goed om te weten"
                  title="Een trouwjurk huren, hoe zit dat?"
                  titleId="trouwjurk-huren-uitleg"
                />
                <p className="lead mt-7 max-w-sm">
                  Je draagt je trouwjurk één dag. Door te huren draag je die dag een jurk die je anders misschien niet zou kiezen,
                  en verdwijnt hij daarna niet in een doos op zolder.
                </p>
                <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
                  Wat er precies bij hoort — de huurperiode en wat er inbegrepen is — bespreken we tijdens de{" "}
                  <Link href="/afspraak" className="link-underline text-ink">
                    pasafspraak
                  </Link>
                  . Staat je jurk er niet tussen, dan maken we hem ook{" "}
                  <Link href="/op-maat" className="link-underline text-ink">
                    op maat
                  </Link>{" "}
                  — reken daarvoor op ongeveer vier weken.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <h3 className="display-sm">Welk silhouet past bij jou?</h3>
              <dl className="mt-10">
                {silhouetten.map((s) => (
                  <div key={s.naam} className="border-t border-line py-7 last:border-b">
                    <dt className="font-display text-xl text-ink">{s.naam}</dt>
                    <dd className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{s.body}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-10 max-w-lg text-sm leading-relaxed text-muted">
                Weet je niet welk silhouet bij je past? Dat hoeft ook niet vooraf. Tijdens het passen zie je vaak binnen een paar
                jurken waar je je thuis in voelt, en denken we met je mee.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <CtaBanner
        location="collectiepagina"
        title={"Twijfel je tussen\neen paar jurken?"}
        body="Dat is heel normaal. Plan een pasafspraak en pas ze rustig naast elkaar, dan weet je het zeker."
      />

      <StructuredData schema={[breadcrumbSchema(breadcrumbs), collectionSchema(dresses)]} />
    </>
  );
}
