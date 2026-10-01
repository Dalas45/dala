import type { Metadata } from "next";
import { Marquee } from "@/components/motion/Marquee";
import { Unveil } from "@/components/motion/SplitText";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { EditorialSplit } from "@/components/sections/EditorialSplit";
import { ExperienceSteps } from "@/components/sections/ExperienceSteps";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HorizontalCollection } from "@/components/sections/HorizontalCollection";
import { Manifesto } from "@/components/sections/Manifesto";
import { Reviews } from "@/components/sections/Reviews";
import { WhyDalas } from "@/components/sections/WhyDalas";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { homeFaqItems } from "@/data/faq";
import { getAllDresses, getDressBySlug, getImageMeta, getMainImage } from "@/lib/dresses";
import { aggregateRatingSchema, collectionSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Trouwjurk huren in Haarlem | Dalas bruidsmode",
  description:
    "Huur je trouwjurk bij Dalas in Haarlem. Bekijk de collectie baljurken, getailleerde en A-lijn bruidsjurken, vraag de prijs op en plan een pasafspraak.",
  path: "/",
});

export default function HomePage() {
  const dresses = getAllDresses();

  // Hero: de Queen-jurk is de sterkste openingsfoto van de collectie.
  const heroDress = getDressBySlug("queen") ?? dresses[0]!;
  const heroImage = getMainImage(heroDress);

  const editorialDress = getDressBySlug("danteel") ?? dresses[1] ?? dresses[0]!;
  const secondEditorialDress = getDressBySlug("barbi-roze") ?? dresses[2] ?? dresses[0]!;
  const atelierDress = getDressBySlug("lang-op-lichaam") ?? dresses[3] ?? dresses[0]!;
  const madeToMeasureDress = getDressBySlug("strik") ?? dresses[4] ?? dresses[0]!;

  return (
    <>
      <Hero image={heroImage} meta={getImageMeta(heroImage.src)} dressCount={dresses.length} />

      <Marquee
        items={["Trouwjurken huren", "Bruidsjurken", "Persoonlijke pasafspraak", "Baljurken", "Getailleerde silhouetten", "Kant & kralen"]}
      />

      <Manifesto />

      {/* Collectie als horizontale rail: de volledige breedte van het scherm. */}
      <Section spacing="default" className="overflow-hidden" aria-labelledby="collectie-rail">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold" aria-hidden="true" />
                <p className="eyebrow">De collectie</p>
                <span className="index-tag">{String(dresses.length).padStart(2, "0")} jurken</span>
              </div>
              <Unveil as="h2" className="display-lg mt-7">
                <span id="collectie-rail">Uit het atelier</span>
              </Unveil>
            </div>

            <LinkButton href="/jurken" variant="text" size="sm" className="px-0" data-cursor="Bekijken">
              Alle trouwjurken
              <ArrowRight width={15} height={15} />
            </LinkButton>
          </div>
        </div>

        <div className="mt-14 pl-5 sm:pl-8 lg:pl-14">
          <HorizontalCollection dresses={dresses} />
        </div>
      </Section>

      <WhyDalas />

      <EditorialSplit
        eyebrow="Vakmanschap"
        title="Kant, kralen en handwerk in elk detail"
        titleId="editorial-vakmanschap"
        body={[
          "De jurken in onze collectie zijn gekozen om hun afwerking: geborduurd kant, met de hand aangebrachte kralen en korsetlijfjes die het silhouet dragen.",
          "Het verschil zit in de details die je pas ziet wanneer je de jurk aan hebt. Daarom nodigen we je uit om te komen passen.",
        ]}
        image={getMainImage(editorialDress)}
        secondaryImage={getMainImage(secondEditorialDress)}
        cta={{ href: "/jurken", label: "Bekijk de collectie" }}
        imageSide="left"
      />

      <ExperienceSteps />

      {/* Licht tussen de crème stappen en de donkere pasafspraak, zodat de
          secties blijven afwisselen. */}
      <EditorialSplit
        eyebrow="Op maat"
        title="Niet gevonden wat je zocht? Dan maken we hem"
        titleId="editorial-op-maat"
        body={[
          "Naast de collectie maken we trouwjurken op maat. Je vertelt wat je voor ogen hebt, wij nemen je maten, en daarna gaan we aan de slag.",
          "Het maken duurt ongeveer vier weken. Plan je afspraak dus ruim voor je trouwdatum, dan is er tijd genoeg.",
        ]}
        image={getMainImage(madeToMeasureDress)}
        cta={{ href: "/op-maat", label: "Lees over op maat" }}
        imageSide="right"
      />

      <EditorialSplit
        eyebrow="De pasafspraak"
        title="De winkel is een uur lang van jou"
        titleId="editorial-afspraak"
        body={[
          "Je komt binnen op een tijd die we samen afspreken. De jurken van je keuze hangen klaar, er is geen andere klant, en je hoeft nergens op te wachten.",
          "We helpen je met het silhouet dat bij je past en denken mee over de complete look. Zonder druk; de beslissing is helemaal aan jou.",
        ]}
        image={getMainImage(atelierDress)}
        cta={{ href: "/afspraak", label: "Plan een afspraak" }}
        imageSide="right"
        tone="noir"
      />

      <Reviews />

      <Faq
        items={homeFaqItems}
        description="Nog een vraag? Bekijk alle veelgestelde vragen of neem gerust contact op."
        tone="cream"
      />

      <CtaBanner location="homepage" />

      <StructuredData schema={[collectionSchema(dresses), faqSchema(homeFaqItems), aggregateRatingSchema()]} />
    </>
  );
}
