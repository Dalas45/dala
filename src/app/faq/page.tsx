import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Faq } from "@/components/sections/Faq";
import { StructuredData } from "@/components/ui/StructuredData";
import { faqItems } from "@/data/faq";
import { breadcrumbSchema, faqSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Veelgestelde vragen | Trouwjurk huren bij Dalas",
  description:
    "Antwoorden op veelgestelde vragen over het huren van een trouwjurk bij Dalas: de pasafspraak, de prijs, maten en het reserveren van je jurk.",
  path: "/faq",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Veelgestelde vragen", href: "/faq" },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="Goed om te weten"
        title="Veelgestelde vragen"
        breadcrumbs={breadcrumbs}
        intro="De vragen die we het vaakst krijgen over het huren van een trouwjurk. Staat jouw vraag er niet bij? Neem gerust contact op."
        index={`${String(faqItems.length).padStart(2, "0")} antwoorden`}
      />

      <Faq
        items={faqItems}
        title="Alles over huren, passen en reserveren"
        eyebrow="Antwoorden"
        description="Van de pasafspraak tot het vastleggen van jouw jurk."
        defaultOpenFirst
        spacing="tight"
        tone="light"
      />

      <CtaBanner
        location="faq"
        title={"Nog een vraag\nover jouw jurk?"}
        body="Tijdens een pasafspraak nemen we alles rustig met je door, van de huurperiode tot de laatste details."
      />

      <StructuredData schema={[breadcrumbSchema(breadcrumbs), faqSchema(faqItems)]} />
    </>
  );
}
