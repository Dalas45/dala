import { DressCard } from "@/components/dress/DressCard";
import { Unveil } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { getRelatedDresses } from "@/lib/dresses";
import type { Dress } from "@/lib/types";

/**
 * Aanbevelingen onderaan een jurkpagina.
 * De selectie is dynamisch: hetzelfde silhouet weegt het zwaarst, daarna kleur
 * en mouwlengte.
 */
export function RelatedDresses({ dress }: { dress: Dress }) {
  const related = getRelatedDresses(dress, 4);
  if (related.length === 0) return null;

  return (
    <Section spacing="default" aria-labelledby="gerelateerde-jurken">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold" aria-hidden="true" />
              <p className="eyebrow">Ook mooi</p>
            </div>
            <Unveil as="h2" className="display-md mt-7">
              <span id="gerelateerde-jurken">Misschien vind je deze ook mooi</span>
            </Unveil>
          </div>

          <LinkButton href="/jurken" variant="text" size="sm" className="px-0" data-cursor="Bekijken">
            Alle trouwjurken
            <ArrowRight width={15} height={15} />
          </LinkButton>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <DressCard
              key={item.id}
              dress={item}
              location="gerelateerd"
              sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
