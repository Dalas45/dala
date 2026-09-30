import Image from "next/image";
import type { ReactNode } from "react";
import { ParallaxFrame } from "@/components/motion/Parallax";
import { Unveil } from "@/components/motion/SplitText";
import { LinkButton } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getImageMeta } from "@/lib/dresses";
import { cn } from "@/lib/utils";

interface EditorialSplitProps {
  eyebrow?: string;
  title: ReactNode;
  titleId?: string;
  body: string[];
  image: { src: string; alt: string };
  secondaryImage?: { src: string; alt: string };
  cta?: { href: string; label: string };
  /** Foto links of rechts. */
  imageSide?: "left" | "right";
  tone?: "light" | "noir";
  className?: string;
}

/**
 * Editorial moment: grote fotografie met parallax naast rustige tekst.
 * De hoofdfoto schuift langzamer dan de pagina, wat diepte geeft zonder dat er
 * iets verspringt.
 */
export function EditorialSplit({
  eyebrow,
  title,
  titleId,
  body,
  image,
  secondaryImage,
  cta,
  imageSide = "left",
  tone = "light",
  className,
}: EditorialSplitProps) {
  const meta = getImageMeta(image.src);
  const secondaryMeta = secondaryImage ? getImageMeta(secondaryImage.src) : undefined;

  return (
    <Section spacing="wide" tone={tone} className={className} aria-labelledby={titleId}>
      <div className="container-x">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-20">
          <div className={cn("lg:col-span-7", imageSide === "right" && "lg:order-2 lg:col-start-6")}>
            <div className="relative">
              <ParallaxFrame className="aspect-[4/5] shadow-lift" distance={7}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 92vw"
                  placeholder={meta.blurDataURL ? "blur" : "empty"}
                  blurDataURL={meta.blurDataURL || undefined}
                  className="object-cover"
                />
              </ParallaxFrame>

              {secondaryImage && secondaryMeta ? (
                <Reveal
                  delay={0.15}
                  className={cn(
                    "absolute bottom-[-3rem] hidden w-44 sm:block lg:w-56",
                    imageSide === "right" ? "left-[-3rem]" : "right-[-3rem]",
                  )}
                >
                  <div className="image-frame aspect-[3/4] shadow-lift">
                    <Image
                      src={secondaryImage.src}
                      alt={secondaryImage.alt}
                      fill
                      sizes="220px"
                      placeholder={secondaryMeta.blurDataURL ? "blur" : "empty"}
                      blurDataURL={secondaryMeta.blurDataURL || undefined}
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>

          <div className={cn("lg:col-span-5", imageSide === "right" && "lg:order-1 lg:col-start-1")}>
            {eyebrow ? (
              <div className="flex items-center gap-4">
                <span className={cn("h-px w-10", tone === "noir" ? "bg-champagne" : "bg-gold")} aria-hidden="true" />
                <p className="eyebrow">{eyebrow}</p>
              </div>
            ) : null}

            <Unveil as="h2" className="display-md mt-7">
              <span id={titleId}>{title}</span>
            </Unveil>

            <div className="mt-8 space-y-6">
              {body.map((paragraph) => (
                <p key={paragraph} className="lead">
                  {paragraph}
                </p>
              ))}
            </div>

            {cta ? (
              <LinkButton href={cta.href} variant="outline" tone={tone === "noir" ? "noir" : "light"} className="mt-11">
                {cta.label}
                <ArrowRight width={15} height={15} />
              </LinkButton>
            ) : null}
          </div>
        </div>
      </div>
    </Section>
  );
}
