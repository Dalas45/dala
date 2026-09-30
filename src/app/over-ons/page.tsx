import type { Metadata } from "next";
import { Marquee } from "@/components/motion/Marquee";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { EditorialSplit } from "@/components/sections/EditorialSplit";
import { ExperienceSteps } from "@/components/sections/ExperienceSteps";
import { StructuredData } from "@/components/ui/StructuredData";
import { getAllDresses, getDressBySlug, getMainImage } from "@/lib/dresses";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Over Dalas | Trouwjurken huren met persoonlijke aandacht",
  description:
    "Dalas verhuurt exclusieve trouwjurken met persoonlijke begeleiding. Lees hoe we onze collectie samenstellen en wat je van een pasafspraak mag verwachten.",
  path: "/over-ons",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Over Dalas", href: "/over-ons" },
];

export default function AboutPage() {
  const dresses = getAllDresses();
  const first = getDressBySlug("lang-op-lichaam") ?? dresses[0]!;
  const second = getDressBySlug("sultan") ?? dresses[1] ?? dresses[0]!;
  const third = getDressBySlug("wit-2-in-1") ?? dresses[2] ?? dresses[0]!;

  return (
    <>
      <PageHeader
        eyebrow="Over Dalas"
        title="Eén jurk, één dag, alle aandacht"
        breadcrumbs={breadcrumbs}
        intro="Dalas is een bridal atelier waar je trouwjurken huurt. We werken op afspraak, met een collectie die we zelf zorgvuldig samenstellen."
        index={`${String(dresses.length).padStart(2, "0")} jurken in de collectie`}
      />

      <Marquee items={["Persoonlijke begeleiding", "Eén bruid per afspraak", "Couture-afwerking", "Huren in plaats van kopen"]} />

      <EditorialSplit
        eyebrow="Onze aanpak"
        title="De collectie kiezen we met de hand"
        titleId="over-collectie"
        body={[
          "Elke jurk die we opnemen, beoordelen we op snit, afwerking en hoe hij valt. Kant dat mooi ligt, kralen die stevig zijn aangezet, een korsetlijfje dat het silhouet echt draagt.",
          "Daarom is onze collectie niet eindeloos groot, maar wel zorgvuldig. Liever een jurk waar we achter staan dan tien waarvan je er negen overslaat.",
        ]}
        image={getMainImage(first)}
        secondaryImage={getMainImage(second)}
        cta={{ href: "/jurken", label: "Bekijk de collectie" }}
        imageSide="right"
      />

      <EditorialSplit
        eyebrow="De pasafspraak"
        title="Passen doe je op afspraak, in alle rust"
        titleId="over-pasafspraak"
        body={[
          "Je komt binnen op een tijd die we samen afspreken, zodat je niet hoeft te wachten en de jurken van je keuze klaarhangen.",
          "We helpen je met het silhouet dat bij je past en denken mee over de complete look. Zonder druk; de beslissing is helemaal aan jou.",
        ]}
        image={getMainImage(third)}
        cta={{ href: "/afspraak", label: "Plan een afspraak" }}
        imageSide="left"
        tone="noir"
      />

      <ExperienceSteps />

      <CtaBanner location="over_ons" />

      <StructuredData schema={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
