import type { Metadata } from "next";
import { JewelleryGrid } from "@/components/jewellery/JewelleryGrid";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { getAllJewellery, getJewelleryMainImage } from "@/lib/jewellery";
import { breadcrumbSchema, jewelleryCollectionSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bruidssieraden, tiara's en boeketten | Dalas",
  description:
    "Alles wat je look compleet maakt bij Dalas: kristallen colliers met oorbellen en armband, tiara's, bruidsboeketten en capes. Vraag de prijs op.",
  path: "/sieraden",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Sieraden", href: "/sieraden" },
];

export default function JewelleryPage() {
  const items = getAllJewellery();
  const jewels = items.filter((i) => i.type === "set" || i.type === "tiara").length;
  const bouquets = items.filter((i) => i.type === "boeket").length;
  const hero = getJewelleryMainImage(items[0]!);

  return (
    <>
      <PageHeader
        eyebrow="De accessoires"
        title="Sieraden en accessoires"
        breadcrumbs={breadcrumbs}
        intro="Een jurk wordt af met wat eromheen komt. De colliers hebben bijpassende oorbellen en armband, de tiara's dragen makkelijk onder een sluier, en daarnaast zijn er boeketten en capes."
        index={`${String(jewels).padStart(2, "0")} sieraden · ${String(bouquets).padStart(2, "0")} boeketten`}
      />

      <Section spacing="tight">
        <div className="container-x">
          <JewelleryGrid items={items} />

          <p className="mt-16 max-w-xl text-sm leading-relaxed text-muted">
            Alle accessoires zijn te huur of te koop in combinatie met een trouwjurk. Tijdens je pasafspraak leggen we ze naast de
            jurk van je keuze, zodat je meteen ziet wat bij elkaar past.
          </p>
        </div>
      </Section>

      <CtaBanner
        location="sieradenpagina"
        title={"Samen met\njouw jurk passen?"}
        body="Plan een pasafspraak en bekijk de sieraden naast de jurk van je keuze, in het licht van de boutique."
      />

      <StructuredData
        schema={[
          breadcrumbSchema(breadcrumbs),
          jewelleryCollectionSchema(items, hero.src),
        ]}
      />
    </>
  );
}
