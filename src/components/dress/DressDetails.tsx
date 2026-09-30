import { AVAILABILITY_LABELS, COLOR_LABELS, SILHOUETTE_LABELS, SLEEVE_LABELS } from "@/lib/dresses";
import type { Dress } from "@/lib/types";

/**
 * Specificatietabel van één jurk.
 * Velden zonder bekende waarde tonen "Op aanvraag" in plaats van een verzonnen waarde.
 */
export function DressDetails({ dress }: { dress: Dress }) {
  const rows: Array<{ label: string; value: string }> = [
    { label: "Silhouet", value: SILHOUETTE_LABELS[dress.silhouette] },
    { label: "Halslijn", value: dress.neckline },
    { label: "Mouwen", value: SLEEVE_LABELS[dress.sleeves] },
    { label: "Kleur", value: COLOR_LABELS[dress.color] },
    { label: "Materiaal", value: dress.material ?? "Op aanvraag" },
    { label: "Maten", value: dress.sizes?.length ? dress.sizes.join(", ") : "Op aanvraag" },
    { label: "Beschikbaarheid", value: AVAILABILITY_LABELS[dress.availability] },
  ];

  return (
    <div>
      <h2 className="label text-gold">Details</h2>
      <dl className="mt-6 border-t border-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 border-b border-line py-4">
            <dt className="text-[0.65rem] uppercase tracking-luxe text-muted">{row.label}</dt>
            <dd className="text-right text-sm text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      {dress.features.length > 0 ? (
        <>
          <h2 className="label mt-14 text-gold">Kenmerken</h2>
          <ul className="mt-6 space-y-3.5">
            {dress.features.map((feature) => (
              <li key={feature} className="flex gap-4 text-sm text-muted">
                <span aria-hidden="true" className="mt-2.5 h-px w-5 shrink-0 bg-gold" />
                {feature}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
