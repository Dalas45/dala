import { SplitText } from "@/components/motion/SplitText";
import { Section } from "@/components/ui/Section";

/**
 * Typografisch statement direct onder de hero: één grote zin die woord voor
 * woord opkomt. Geen beeld, geen knoppen — puur een adempauze die het merk zet.
 */
export function Manifesto({ titleId = "manifest" }: { titleId?: string }) {
  return (
    <Section spacing="wide" aria-labelledby={titleId}>
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <p className="eyebrow lg:sticky lg:top-32">Het atelier</p>
          </div>

          <div className="lg:col-span-9 lg:col-start-4">
            {/* Expliciete regelafbreking: zo blijft het statement op elk formaat
                even strak, in plaats van te wrappen waar de kolom toevallig ophoudt. */}
            <SplitText as="h2" onView stagger={0.035} className="display-lg text-ink">
              {"Eén jurk draagt\neen hele dag.\nWij nemen de tijd\nom de jouwe te vinden."}
            </SplitText>

            <div className="mt-14 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 sm:gap-16">
              <p className="lead">
                Bij Dalas huur je de jurk voor jouw dag. Dat betekent dat je een japon kunt dragen die je anders niet zou kiezen: rijk
                geborduurd kant, met de hand aangezette kralen, een korsetlijfje dat het silhouet echt draagt.
              </p>
              <p className="lead">
                We werken op afspraak, met één bruid tegelijk. Geen haast, geen drukte, en alle ruimte om te voelen of het de juiste is.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
