"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Vertraging in seconden. */
  delay?: number;
  /** Richting waaruit het element binnenkomt. */
  from?: "up" | "down" | "none";
  /** Hoeveel van het element zichtbaar moet zijn (0–1). */
  amount?: number;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Subtiele scroll-reveal. Respecteert prefers-reduced-motion: dan verschijnt de
 * inhoud direct. Animeert alleen opacity en transform, dus zonder layout shift.
 */
export function Reveal({ children, className, delay = 0, from = "up", amount = 0.2 }: RevealProps) {
  const reduce = useReducedMotion();
  const offset = from === "none" ? 0 : from === "down" ? -28 : 28;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : offset },
        visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 1, delay: reduce ? 0 : delay, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Container die zijn RevealItem-kinderen na elkaar laat verschijnen.
 * Gebruik `as="ol"` of `as="ul"` wanneer de inhoud een lijst is, met RevealItem `as="li"`.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduce = useReducedMotion();
  const shared = {
    className,
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, amount: 0.12 },
    variants: {
      hidden: {},
      visible: { transition: { staggerChildren: reduce ? 0 : stagger } },
    },
  };

  if (as === "ol") return <motion.ol {...shared}>{children}</motion.ol>;
  if (as === "ul") return <motion.ul {...shared}>{children}</motion.ul>;
  return <motion.div {...shared}>{children}</motion.div>;
}

/**
 * Item binnen een RevealGroup.
 * `as="li"` houdt de HTML geldig wanneer de groep een <ul> of <ol> is:
 * een lijst mag alleen <li>-kinderen bevatten.
 */
export function RevealItem({
  children,
  className,
  from = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  from?: "up" | "down" | "none";
  as?: "div" | "li";
}) {
  const reduce = useReducedMotion();
  const offset = from === "none" ? 0 : from === "down" ? -24 : 24;
  const variants = {
    hidden: { opacity: 0, y: reduce ? 0 : offset },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.9, ease: EASE } },
  };

  if (as === "li") {
    return (
      <motion.li className={className} variants={variants}>
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
