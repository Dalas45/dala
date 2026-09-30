import { reviews } from "@/data/reviews";
import { Unveil } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";

/**
 * Reviewsectie.
 *
 * Zolang `src/data/reviews.ts` leeg is, tonen we bewust géén verzonnen quotes.
 * In plaats daarvan staat er een eerlijke uitnodiging. Zodra er echte reviews
 * worden toegevoegd, verschijnt de quote-grid automatisch.
 */
export function Reviews() {
  const hasReviews = reviews.length > 0;

  return (
    <Section aria-labelledby="reviews-titel">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
            <p className="eyebrow">Ervaringen</p>
            <span className="h-px w-10 bg-gold" aria-hidden="true" />
          </div>

          <Unveil as="h2" className="display-md mt-8">
            <span id="reviews-titel">{hasReviews ? "Wat bruiden over Dalas zeggen" : "Jouw ervaring telt"}</span>
          </Unveil>

          {!hasReviews ? (
            <p className="lead mt-7">
              We verzamelen de ervaringen van onze bruiden. Heb jij bij Dalas je jurk gevonden? We horen het graag.
            </p>
          ) : null}
        </div>

        {hasReviews ? (
          <RevealGroup className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <RevealItem key={`${review.name}-${review.quote.slice(0, 24)}`}>
                <figure className="flex h-full flex-col border border-line bg-porcelain p-9">
                  {typeof review.rating === "number" ? (
                    <p className="text-gold" aria-label={`${review.rating} van de 5 sterren`}>
                      <span aria-hidden="true">{"★".repeat(review.rating)}</span>
                    </p>
                  ) : null}
                  <blockquote className="mt-5 flex-1 font-display text-xl leading-relaxed text-ink">“{review.quote}”</blockquote>
                  <figcaption className="label mt-8 text-muted">
                    {review.name}
                    {review.source ? ` · ${review.source}` : null}
                  </figcaption>
                </figure>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="mt-12 flex justify-center">
            {siteConfig.social.googleBusiness ? (
              <a
                href={siteConfig.social.googleBusiness}
                target="_blank"
                rel="noopener noreferrer"
                className="group/cta relative inline-flex items-center justify-center overflow-hidden bg-ink px-8 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-ivory transition-colors duration-500 hover:text-noir"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
                />
                <span className="relative">Deel je ervaring</span>
              </a>
            ) : (
              <LinkButton href="/contact">Deel je ervaring</LinkButton>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
