import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Knoppen in twee tonen. `tone="noir"` gebruik je binnen donkere secties.
 *
 * De primaire knop heeft een vullende hover: een champagne vlak dat van onder
 * naar boven oploopt. Dat is één van de kenmerkende bewegingen van het merk.
 */
type Variant = "primary" | "outline" | "text";
type Tone = "light" | "noir";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap font-sans text-[0.7rem] font-medium uppercase tracking-luxe transition-colors duration-500 ease-[var(--ease-couture)] disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-ink text-ivory hover:text-noir",
    outline: "border border-ink/20 text-ink hover:border-ink/40 hover:text-noir",
    text: "text-ink hover:text-gold",
  },
  noir: {
    primary: "bg-champagne text-noir hover:text-noir",
    outline: "border border-on-noir/25 text-on-noir hover:border-champagne hover:text-noir",
    text: "text-on-noir hover:text-champagne",
  },
};

const fills: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-champagne",
    outline: "bg-ink",
    text: "",
  },
  noir: {
    primary: "bg-on-noir",
    outline: "bg-champagne",
    text: "",
  },
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-8 py-4",
  lg: "px-10 py-5",
};

interface CommonProps {
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
}

function Inner({ variant, tone, children }: { variant: Variant; tone: Tone; children: ReactNode }) {
  return (
    <>
      {variant !== "text" ? (
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/btn:scale-y-100",
            fills[tone][variant],
          )}
        />
      ) : null}
      <span className="relative flex items-center gap-2.5">{children}</span>
    </>
  );
}

type ButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;
type LinkButtonProps = CommonProps & Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children">;

export function Button({ variant = "primary", tone = "light", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[tone][variant], sizes[size], className)} {...props}>
      <Inner variant={variant} tone={tone}>
        {children}
      </Inner>
    </button>
  );
}

export function LinkButton({ variant = "primary", tone = "light", size = "md", className, children, ...props }: LinkButtonProps) {
  return (
    <Link className={cn(base, variants[tone][variant], sizes[size], className)} {...props}>
      <Inner variant={variant} tone={tone}>
        {children}
      </Inner>
    </Link>
  );
}
