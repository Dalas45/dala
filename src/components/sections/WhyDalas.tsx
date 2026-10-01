import { Unveil } from "@/components/motion/SplitText";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/**
 * Waarom Dalas — donkere sectie met genummerde beloftes.
 * Alle punten beschrijven de werkwijze, geen meetbare claims zoals aantallen
 * klanten of jaren ervaring; die zijn niet aangeleverd.
 */
const reasons = [
  {
    title: "Eén bruid per afspraak",
    body: "Je komt op een tijd die we samen kiezen. De winkel is dan van jou, zonder andere klanten of wachttijd.",
  },
  {
    title: "Zorgvuldig geselecteerd",
    body: "Elke jurk is uitgekozen op snit, afwerking en hoe hij valt. Liever een kleine collectie waar we achter staan.",
  },
  {
    title: "Begeleiding bij het passen",
    body: "We helpen je het silhouet te vinden dat bij je past en denken mee over de complete look.",
  },
  {
    title: "Huren in plaats van kopen",
    body: "Een couture-jurk dragen op jouw dag, zonder dat hij daarna jarenlang in de kast hangt. Het reinigen zit bij de huur inbegrepen.",
  },
];

export function WhyDalas() {
  return (
    <Section tone="noir" aria-labelledby="waarom-dalas">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-champagne" aria-hidden="true" />
                <p className="label text-champagne">Waarom Dalas</p>
              </div>
              <Unveil as="h2" className="display-md mt-7">
                <span id="waarom-dalas">De jurk vinden hoort een mooi moment te zijn</span>
              </Unveil>
              <p className="lead mt-7 max-w-sm">
                Wij geloven dat het uitzoeken van je trouwjurk net zo bijzonder mag zijn als de dag zelf.
              </p>
            </div>
          </div>

          <RevealGroup as="ol" className="lg:col-span-7 lg:col-start-6" stagger={0.1}>
            {reasons.map((reason, index) => (
              <RevealItem key={reason.title} as="li" className="group border-t border-noir-line py-9 last:border-b">
                <div className="flex gap-7 sm:gap-12">
                  <span className="font-sans text-[0.68rem] tabular-nums tracking-luxe text-champagne" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="display-sm text-on-noir transition-opacity duration-500 group-hover:opacity-75">{reason.title}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-on-noir-muted">{reason.body}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
