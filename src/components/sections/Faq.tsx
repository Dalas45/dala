import { Unveil } from "@/components/motion/SplitText";
import { Plus } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import type { FaqItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FaqProps {
  items: FaqItem[];
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
  /** `cream` is visueel licht; alleen `noir` keert de tekstkleuren om. */
  tone?: "light" | "cream" | "noir";
  /** Eerste vraag standaard open. */
  defaultOpenFirst?: boolean;
  spacing?: "tight" | "default" | "wide";
}

/**
 * FAQ-accordeon op basis van <details>/<summary>: werkt zonder JavaScript, is
 * toetsenbordtoegankelijk en wordt door schermlezers correct aangekondigd.
 * Het plusteken draait naar een kruis wanneer een vraag opengaat.
 */
export function Faq({
  items,
  title = "Veelgestelde vragen",
  eyebrow = "Goed om te weten",
  description,
  className,
  tone = "light",
  defaultOpenFirst = false,
  spacing = "default",
}: FaqProps) {
  if (items.length === 0) return null;

  const borderClass = tone === "noir" ? "border-noir-line" : "border-line";

  return (
    <Section tone={tone} spacing={spacing} className={className} aria-labelledby="faq-titel">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <div className="flex items-center gap-4">
                <span className={cn("h-px w-10", tone === "noir" ? "bg-champagne" : "bg-gold")} aria-hidden="true" />
                <p className="eyebrow">{eyebrow}</p>
              </div>
              <Unveil as="h2" className="display-md mt-7">
                <span id="faq-titel">{title}</span>
              </Unveil>
              {description ? <p className="lead mt-7 max-w-sm">{description}</p> : null}
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className={cn("border-t", borderClass)}>
              {items.map((item, index) => (
                <details key={item.question} open={defaultOpenFirst && index === 0} className={cn("group border-b", borderClass)}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-8 py-7 [&::-webkit-details-marker]:hidden">
                    <h3
                      className={cn(
                        "display-sm font-display transition-opacity duration-500 group-hover:opacity-65",
                        tone === "noir" ? "text-on-noir" : "text-ink",
                      )}
                    >
                      {item.question}
                    </h3>
                    <span
                      className={cn(
                        "mt-1.5 shrink-0 transition-transform duration-[600ms] ease-[var(--ease-couture)] group-open:rotate-[135deg]",
                        tone === "noir" ? "text-champagne" : "text-gold",
                      )}
                    >
                      <Plus width={20} height={20} />
                    </span>
                  </summary>
                  <p
                    className={cn(
                      "max-w-2xl pb-8 pr-10 text-sm leading-relaxed",
                      tone === "noir" ? "text-on-noir-muted" : "text-muted",
                    )}
                  >
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
