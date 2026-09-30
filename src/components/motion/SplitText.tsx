"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  /** De tekst wordt per woord opgesplitst; regeleindes markeer je met een `\n`. */
  children: string;
  className?: string;
  /** Vertraging voor het eerste woord, in seconden. */
  delay?: number;
  /** Vertraging tussen opeenvolgende woorden. */
  stagger?: number;
  /** Animeert bij het in beeld komen in plaats van direct bij mount. */
  onView?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

/**
 * Woord-voor-woord onthulling: elk woord schuift van onderen omhoog achter een
 * masker vandaan. Dat is de kenmerkende beweging van couture-editorials.
 *
 * Belangrijk voor toegankelijkheid en SEO: de volledige tekst staat als één
 * `aria-label` op het element en de losse woorden zijn `aria-hidden`. Een
 * schermlezer leest dus een normale zin, geen losse woorden.
 */
export function SplitText({ children, className, delay = 0, stagger = 0.045, onView = false, as = "span" }: SplitTextProps) {
  const reduce = useReducedMotion();
  const lines = children.split("\n");

  const MotionTag = as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : as === "p" ? motion.p : motion.span;

  // Zonder bewegingsvoorkeur: gewoon de tekst, geen maskers.
  if (reduce) {
    return (
      <MotionTag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </MotionTag>
    );
  }

  // De vertraging loopt door over alle regels heen. De startindex per regel
  // wordt daarom vooraf berekend, zonder tijdens de render iets te muteren.
  //
  // De drempel voor `whileInView` staat bewust laag (0.25): bij een hoge kop
  // komt de helft pas in beeld wanneer hij de viewport al bijna vult, en dan
  // start de animatie te laat.
  const wordsPerLine = lines.map((line) => line.split(" "));
  const lineOffsets = wordsPerLine.map((_, lineIdx) =>
    wordsPerLine.slice(0, lineIdx).reduce((sum, words) => sum + words.length, 0),
  );

  return (
    <MotionTag
      className={className}
      aria-label={children.replace(/\n/g, " ")}
      initial="hidden"
      {...(onView ? { whileInView: "visible", viewport: { once: true, amount: 0.25 } } : { animate: "visible" })}
    >
      {wordsPerLine.map((words, lineIdx) => (
        <span key={lineIdx} className="block pb-[0.1em]" aria-hidden="true">
          {words.map((word, i) => {
            const order = lineOffsets[lineIdx]! + i;
            return (
              // Het masker zit per woord. De padding rekt het maskervlak naar
              // beneden op zodat de staarten van j, g en y er niet afvallen; de
              // negatieve marge geeft die ruimte weer terug, zodat het woord op
              // exact dezelfde regel blijft staan. Het woord start daardoor iets
              // dieper (140% in plaats van 108%) om volledig verborgen te zijn.
              <span key={`${lineIdx}-${i}`} className="-mb-[0.3em] inline-block overflow-hidden pb-[0.3em] align-bottom">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "140%" },
                    visible: {
                      y: 0,
                      transition: { duration: 1.05, delay: delay + order * stagger, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  {word}
                  {i === words.length - 1 ? "" : " "}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </MotionTag>
  );
}

/**
 * Variant voor koppen met opgemaakte delen (bijvoorbeeld een cursief woord).
 * Onthult het geheel als één blok in plaats van per woord.
 *
 * De zichtbaarheidsdetectie zit bewust op de WRAPPER en niet op de kop zelf.
 * De kop staat in zijn beginstand volledig onder het masker, en een element dat
 * door een `overflow: hidden`-voorouder wordt weggeknipt geldt voor de browser
 * als onzichtbaar. Zou de detectie op de kop zitten, dan zou die zichzelf zo
 * goed verbergen dat de animatie nooit start. De wrapper transformeert niet en
 * wordt dus altijd correct waargenomen.
 */
export function Unveil({
  children,
  className,
  delay = 0,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "div" | "span";
}) {
  const reduce = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  // De wrapper wordt waargenomen, niet de kop zelf. `useInView` met een eigen
  // ref is hier betrouwbaarder dan variant-propagatie via whileInView.
  const inView = useInView(wrapperRef, { once: true, amount: 0.2 });

  const MotionTag =
    as === "h1" ? motion.h1 : as === "h2" ? motion.h2 : as === "h3" ? motion.h3 : as === "div" ? motion.div : motion.span;

  return (
    <div ref={wrapperRef} className="overflow-hidden">
      {/*
        De padding hoort op de kop en niet op de wrapper: `em` rekent hier met
        de lettergrootte van de kop zelf. Zo groeit het maskervlak precies mee
        met de staarten van j, g en y, die bij een regelhoogte van 0.92 buiten
        de border-box vallen en er anders recht worden afgesneden.
        */}
      <MotionTag
        className={cn("pb-[0.3em]", className)}
        initial={{ y: reduce ? 0 : "105%" }}
        animate={{ y: inView || reduce ? 0 : "105%" }}
        transition={{ duration: reduce ? 0 : 1.1, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </MotionTag>
    </div>
  );
}
