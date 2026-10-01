import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { EditorialSplit } from "@/components/sections/EditorialSplit";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { getAllDresses, getDressBySlug, getMainImage } from "@/lib/dresses";
import { breadcrumbSchema, madeToMeasureSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trouwjurk op maat laten maken in Haarlem | Dalas",
  description:
    "Dalas in Haarlem maakt trouwjurken op maat. Het maken duurt ongeveer vier weken. Plan een afspraak om je wensen en je maten rustig te bespreken.",
  path: "/op-maat",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Op maat", href: "/op-maat" },
];

/**
 * Er staan bewust maar twee harde gegevens op deze pagina: dat Dalas op maat
 * maakt en dat het ongeveer vier weken duurt. Alles daaromheen is procestekst.
 * Prijzen, het aantal pasmomenten, stofkeuzes en voorwaarden komen er pas bij
 * zodra de eigenaar ze bevestigt.
 */
const steps = [
  {
    title: "Plan een afspraak",
    body: "We bespreken wat je voor ogen hebt en nemen je maten. Meebrengen wat je inspireert mag altijd.",
  },
  {
    title: "We maken je jurk",
    body: "Vanaf dat moment duurt het maken ongeveer vier weken.",
  },
  {
    title: "Je komt hem passen",
    body: "In de boutique bekijken we samen of alles zit zoals het hoort.",
  },
];

export default function MadeToMeasurePage() {
  const dresses = getAllDresses();
  const showcase = getDressBySlug("danteel") ?? dresses[0]!;

  return (
    <>
      <PageHeader
        eyebrow="Op maat"
        title="Een jurk die voor jou wordt gemaakt"
        breadcrumbs={breadcrumbs}
        intro="Staat je jurk niet tussen de collectie, of wil je hem net even anders? We maken trouwjurken ook op maat. Het maken duurt ongeveer vier weken."
        index="Circa 4 weken"
      />

      <Section spacing="tight">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <SectionHeader eyebrow="Zo werkt het" title="Van eerste gesprek tot jouw jurk" titleId="op-maat-stappen" />
                <p className="lead mt-7 max-w-sm">Drie stappen, met vier weken ertussen.</p>
                <LinkButton href="/afspraak" className="mt-10" data-cursor="Plannen">
                  Plan een afspraak
                  <ArrowRight width={15} height={15} />
                </LinkButton>
              </div>
            </div>

            <RevealGroup as="ol" className="lg:col-span-7 lg:col-start-6" stagger={0.09}>
              {steps.map((step, index) => (
                <RevealItem key={step.title} as="li" className="group border-t border-line py-8 last:border-b">
                  <div className="flex items-baseline gap-7 sm:gap-12">
                    <span className="font-sans text-[0.68rem] tabular-nums tracking-luxe text-gold" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="display-sm transition-opacity duration-500 group-hover:opacity-70">{step.title}</h3>
                      <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <p className="mt-16 max-w-xl text-sm leading-relaxed text-muted">
            Wat een jurk op maat kost, hangt af van wat je kiest. Dat bespreken we tijdens de afspraak, zonder dat je ergens aan
            vastzit.
          </p>
        </div>
      </Section>

      <EditorialSplit
        eyebrow="Vier weken"
        title={"Plan op tijd,\ndan is er rust"}
        titleId="op-maat-planning"
        body={[
          "Het maken van een jurk op maat duurt ongeveer vier weken. Houd daar rekening mee bij het kiezen van je afspraak, dan komt de jurk ruim voor je trouwdag af.",
          "Twijfel je of het binnen jouw planning past? Vraag het gerust; we denken met je mee over wat haalbaar is.",
        ]}
        image={getMainImage(showcase)}
        cta={{ href: "/contact?onderwerp=Jurk%20op%20maat", label: "Stel je vraag" }}
        imageSide="right"
        tone="noir"
      />

      <CtaBanner
        location="opmaatpagina"
        title={"Benieuwd wat er\nmogelijk is?"}
        body="Plan een afspraak, dan bespreken we je wensen en je maten en weet je meteen waar je aan toe bent."
      />

      <StructuredData schema={[breadcrumbSchema(breadcrumbs), madeToMeasureSchema()]} />
    </>
  );
}
