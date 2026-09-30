import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Formuliervelden in twee tonen. Binnen een `.tone-noir`-sectie past de
 * `.field-input`-stijl zich automatisch aan; de labels krijgen hier hun kleur
 * via de `tone`-prop.
 */
type Tone = "light" | "noir";

interface BaseProps {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  tone?: Tone;
}

function FieldWrapper({
  id,
  label,
  error,
  required,
  hint,
  className,
  tone = "light",
  children,
}: Omit<BaseProps, "name"> & { children: ReactNode }) {
  return (
    <div className={cn("min-w-0", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block font-sans text-[0.6rem] uppercase tracking-wide-luxe",
          tone === "noir" ? "text-on-noir-muted" : "text-muted",
        )}
      >
        {label}
        {required ? (
          <span className={tone === "noir" ? "text-champagne" : "text-gold"}> *</span>
        ) : (
          <span className="normal-case tracking-normal opacity-70"> (optioneel)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className={cn("mt-2.5 text-xs", tone === "noir" ? "text-on-noir-muted/80" : "text-muted")}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface TextFieldProps extends BaseProps {
  type?: "text" | "email" | "tel" | "date";
  autoComplete?: string;
  placeholder?: string;
  defaultValue?: string;
  min?: string;
}

export function TextField({ id, name, type = "text", autoComplete, placeholder, defaultValue, min, ...rest }: TextFieldProps) {
  return (
    <FieldWrapper id={id} {...rest}>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        required={rest.required}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        className="field-input mt-1.5"
      />
    </FieldWrapper>
  );
}

interface TextAreaFieldProps extends BaseProps {
  rows?: number;
  placeholder?: string;
  defaultValue?: string;
}

export function TextAreaField({ id, name, rows = 4, placeholder, defaultValue, ...rest }: TextAreaFieldProps) {
  return (
    <FieldWrapper id={id} {...rest}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={rest.required}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        className="field-input mt-1.5 resize-y"
      />
    </FieldWrapper>
  );
}

interface SelectFieldProps extends BaseProps {
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
}

export function SelectField({ id, name, options, defaultValue, ...rest }: SelectFieldProps) {
  // De chevron is een inline SVG in de achtergrond; kleur volgt de toon.
  const arrowColor = rest.tone === "noir" ? "%23a69c90" : "%236e655c";

  return (
    <FieldWrapper id={id} {...rest}>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={rest.required}
        aria-invalid={rest.error ? true : undefined}
        aria-describedby={rest.error ? `${id}-error` : rest.hint ? `${id}-hint` : undefined}
        className={cn(
          "field-input mt-1.5 appearance-none bg-[length:12px] bg-[right_center] bg-no-repeat pr-8",
          rest.tone === "noir" && "[&>option]:bg-noir [&>option]:text-on-noir",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='${arrowColor}' stroke-width='1.4'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5'/%3E%3C/svg%3E")`,
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

/** Verplichte toestemming voor de verwerking van de aanvraaggegevens. */
export function ConsentField({
  id,
  name = "consent",
  error,
  tone = "light",
}: {
  id: string;
  name?: string;
  error?: string;
  tone?: Tone;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={cn("flex cursor-pointer items-start gap-3.5 text-xs leading-relaxed", tone === "noir" ? "text-on-noir-muted" : "text-muted")}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn("mt-0.5 h-4 w-4 shrink-0", tone === "noir" ? "accent-[var(--color-champagne)]" : "accent-[var(--color-ink)]")}
        />
        <span>
          Ik ga ermee akkoord dat Dalas mijn gegevens gebruikt om contact met mij op te nemen over deze aanvraag. Zie de{" "}
          <a href="/privacy" className={cn("link-underline", tone === "noir" ? "text-on-noir" : "text-ink")}>
            privacyverklaring
          </a>
          .
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2.5 text-xs text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Honeypot plus tijdstempel. Onzichtbaar voor mensen, ingevuld door veel bots.
 * De server weigert aanvragen waarin `website` is ingevuld of die te snel binnenkomen.
 */
export function AntiSpamFields({ startedAt }: { startedAt: number }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor="website-veld">Laat dit veld leeg</label>
      <input id="website-veld" type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      <input type="hidden" name="_t" value={startedAt} />
    </div>
  );
}

/** Verzendknop met dezelfde vullende hover als de rest van de site. */
export function SubmitButton({ pending, label, pendingLabel, tone = "light", full = false }: {
  pending: boolean;
  label: string;
  pendingLabel: string;
  tone?: Tone;
  full?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "group/cta relative inline-flex items-center justify-center overflow-hidden px-9 py-4.5 font-sans text-[0.7rem] uppercase tracking-luxe transition-colors duration-500 disabled:cursor-wait disabled:opacity-65",
        full ? "w-full" : "w-full sm:w-auto",
        tone === "noir" ? "bg-champagne text-noir" : "bg-ink text-ivory hover:text-noir",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100",
          tone === "noir" ? "bg-on-noir" : "bg-champagne",
        )}
      />
      <span className="relative">{pending ? pendingLabel : label}</span>
    </button>
  );
}
