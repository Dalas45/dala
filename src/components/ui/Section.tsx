import type { ReactNode } from "react";
import { Unveil } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  as?: "section" | "article" | "div" | "aside";
  id?: string;
  /** Verticale ruimte. */
  spacing?: "tight" | "default" | "wide" | "none";
  /**
   * De toon bepaalt óók de achtergrond. Elke sectie zet die expliciet, want de
   * body is noir: een sectie zonder achtergrond zou donkere tekst op donker
   * tonen. Geef daarom nooit een eigen `bg-`klasse mee via `className`.
   */
  tone?: "light" | "cream" | "noir";
  "aria-labelledby"?: string;
}

const spacings = {
  none: "",
  tight: "py-16 sm:py-24",
  default: "py-24 sm:py-32 lg:py-40",
  wide: "py-28 sm:py-44 lg:py-56",
};

/**
 * De achtergronden zijn bewust volledig dekkend. De body is noir; een
 * half-transparante kleur zou die donkere basis laten doorschijnen en de
 * tekstcontrast onderuit halen.
 */
const tones = {
  light: "bg-ivory",
  cream: "bg-cream",
  noir: "tone-noir grain",
};

export function Section({ children, className, as: Tag = "section", id, spacing = "default", tone = "light", ...rest }: SectionProps) {
  return (
    <Tag id={id} className={cn("relative", tones[tone], spacings[spacing], className)} {...rest}>
      {children}
    </Tag>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  /** Genummerd label rechts, bijvoorbeeld "01 — 04". */
  index?: string;
  title: ReactNode;
  description?: ReactNode;
  titleId?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2" | "h3";
  size?: "lg" | "md" | "sm";
}

/**
 * Sectiekop met eyebrow, titel en optionele beschrijving.
 * De titel komt achter een masker vandaan zodra hij in beeld schuift.
 */
export function SectionHeader({
  eyebrow,
  index,
  title,
  description,
  titleId,
  align = "left",
  className,
  as: Heading = "h2",
  size = "md",
}: SectionHeaderProps) {
  const sizeClass = size === "lg" ? "display-lg" : size === "sm" ? "display-sm" : "display-md";

  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow || index ? (
        <div className={cn("mb-6 flex items-baseline gap-5", align === "center" && "justify-center")}>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          {index ? <span className="index-tag">{index}</span> : null}
        </div>
      ) : null}

      <Unveil as={Heading === "h1" ? "h1" : Heading === "h3" ? "h3" : "h2"} className={sizeClass}>
        <span id={titleId}>{title}</span>
      </Unveil>

      {description ? <div className="lead mt-7">{description}</div> : null}
    </div>
  );
}
