import { Check } from "@/components/ui/Icons";
import type { FormState } from "@/lib/actions";
import { cn } from "@/lib/utils";

/**
 * Status na verzending. Gebruikt role="status" zodat schermlezers de bevestiging
 * of de foutmelding automatisch voorlezen.
 */
export function FormStatusMessage({ state, tone = "light" }: { state: FormState; tone?: "light" | "noir" }) {
  if (state.status === "idle" || !state.message) return null;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex items-start gap-3.5 border-l-2 border-success px-5 py-4",
          tone === "noir" ? "bg-on-noir/5 text-on-noir" : "bg-success/5 text-ink",
        )}
      >
        <Check width={18} height={18} className="mt-0.5 shrink-0 text-success" />
        <p className="text-sm leading-relaxed">{state.message}</p>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn("border-l-2 border-error px-5 py-4", tone === "noir" ? "bg-on-noir/5 text-on-noir" : "bg-error/5 text-ink")}
    >
      <p className="text-sm leading-relaxed">{state.message}</p>
    </div>
  );
}
