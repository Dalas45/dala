import { Unveil } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

const steps = [
  { title: "Bekijk de collectie", body: "Neem online de tijd om door alle trouwjurken te bladeren." },
  { title: "Kies je favorieten", body: "Vraag de prijs op van de jurken die je aanspreken." },
  { title: "Plan een afspraak", body: "Laat je gegevens achter; we stemmen samen een moment af." },
  { title: "Kom passen", body: "Je past de jurken in alle rust, met begeleiding." },
  { title: "Vind jouw jurk", body: "We bespreken de huurperiode en leggen alles samen vast." },
];

/** De Dalas-ervaring: vijf stappen van collectie naar jurk. */
export function ExperienceSteps() {
  return (
    <Section tone="cream" aria-labelledby="dalas-ervaring">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold" aria-hidden="true" />
                <p className="label text-gold">De ervaring</p>
              </div>
              <Unveil as="h2" className="display-md mt-7">
                <span id="dalas-ervaring">Van eerste blik tot jouw jurk</span>
              </Unveil>
              <p className="lead mt-7 max-w-sm">Vijf stappen, zonder verrassingen.</p>
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
      </div>
    </Section>
  );
}
