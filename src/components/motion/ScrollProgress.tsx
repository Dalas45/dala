"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * Dunne voortgangslijn bovenaan de pagina. Geeft bij lange pagina's houvast
 * over hoever je bent, zonder visueel gewicht toe te voegen.
 */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 34, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduce ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-champagne"
    />
  );
}
