import { SplitText } from "@/components/motion/SplitText";
import { Section } from "@/components/ui/Section";
import { TrackedAnchor, TrackedLink } from "@/components/ui/TrackedLink";
import { phoneHref, siteConfig, whatsappHref } from "@/lib/site";
import { cn } from "@/lib/utils";

interface CtaBannerProps {
  /** Regeleindes markeer je met `\n`; elke regel komt apart op. */
  title?: string;
  body?: string;
  /** Waar de banner staat; komt mee in het analytics-event. */
  location: string;
  className?: string;
}

/**
 * Afsluitende call to action in noir. Primair: een afspraak plannen.
 * Telefoon en WhatsApp verschijnen alleen wanneer die gegevens zijn ingesteld.
 */
export function CtaBanner({
  title = "Klaar om jouw\njurk te vinden?",
  body = "Plan een pasafspraak en ontdek in alle rust welke jurk bij jou past. We nemen snel contact met je op om de afspraak te bevestigen.",
  location,
  className,
}: CtaBannerProps) {
  return (
    <Section tone="noir" spacing="wide" className={cn("overflow-hidden", className)} aria-labelledby={`cta-${location}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(100%_80%_at_50%_100%,#241d18_0%,#0d0b0a_70%)]"
      />

      <div className="container-x text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
            <p className="label text-champagne">Persoonlijke pasafspraak</p>
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
          </div>

          <SplitText as="h2" onView stagger={0.05} className="display-lg mt-9 text-on-noir">
            {title}
          </SplitText>
          <span id={`cta-${location}`} className="sr-only">
            {title.replace("\n", " ")}
          </span>

          <p className="mt-8 max-w-xl text-base leading-[1.75] text-on-noir-muted sm:text-lg">{body}</p>

          <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row">
            <TrackedLink
              href="/afspraak"
              event="cta_click"
              params={{ cta: "afspraak", location }}
              data-cursor="Plannen"
              className="group/cta relative inline-flex w-full items-center justify-center overflow-hidden bg-champagne px-10 py-5 font-sans text-[0.7rem] uppercase tracking-luxe text-noir sm:w-auto"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-on-noir transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
              />
              <span className="relative">Plan een afspraak</span>
            </TrackedLink>

            <TrackedLink
              href="/jurken"
              event="cta_click"
              params={{ cta: "bekijk_collectie", location }}
              data-cursor="Bekijken"
              className="group/cta relative inline-flex w-full items-center justify-center overflow-hidden border border-on-noir/25 px-10 py-5 font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir transition-colors duration-500 hover:text-noir sm:w-auto"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
              />
              <span className="relative">Bekijk de collectie</span>
            </TrackedLink>
          </div>

          {phoneHref || whatsappHref ? (
            <p className="mt-10 text-sm text-on-noir-muted">
              Liever direct contact?{" "}
              {phoneHref ? (
                <TrackedAnchor href={phoneHref} event="phone_click" params={{ location }} className="link-underline text-on-noir">
                  {siteConfig.contact.phone}
                </TrackedAnchor>
              ) : null}
              {phoneHref && whatsappHref ? " of " : null}
              {whatsappHref ? (
                <TrackedAnchor
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  event="whatsapp_click"
                  params={{ location }}
                  className="link-underline text-on-noir"
                >
                  WhatsApp
                </TrackedAnchor>
              ) : null}
            </p>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
