"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

/**
 * Scroll-parallax. Het beeld beweegt langzamer dan de pagina, waardoor er
 * diepte ontstaat. De beweging loopt via een spring, zodat hij nooit schokt.
 *
 * Gebruik dit alleen op elementen die ruimer zijn dan hun container (zie
 * `ParallaxImage` hieronder), anders ontstaan er randen.
 */
export function Parallax({
  children,
  className,
  /** Verplaatsing in procenten van de elementhoogte. Negatief = tegen de scroll in. */
  distance = 12,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [`${distance}%`, `${-distance}%`]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Beeldcontainer met parallax binnen een vaste uitsnede.
 * Het kind wordt bewust 120% hoog gemaakt zodat de verschuiving geen gaten laat.
 */
export function ParallaxFrame({
  children,
  className,
  distance = 8,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [`-${distance}%`, `${distance}%`]);
  const y = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div className="absolute inset-x-0 -inset-y-[12%]" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
