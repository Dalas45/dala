"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Foutpagina voor onverwachte runtime-fouten. Toont geen technische details aan bezoekers. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[dalas] Onverwachte fout:", error);
  }, [error]);

  return (
    <div className="tone-noir grain flex min-h-[85vh] items-center py-32">
      <div className="container-x">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
            <p className="label text-champagne">Er ging iets mis</p>
            <span className="h-px w-10 bg-champagne" aria-hidden="true" />
          </div>

          <h1 className="display-lg mt-8 text-on-noir">Deze pagina kon niet worden geladen</h1>
          <p className="mt-8 text-base leading-[1.75] text-on-noir-muted">
            Probeer het opnieuw. Blijft het misgaan, neem dan gerust even contact met ons op.
          </p>

          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={reset}
              className="group/cta relative inline-flex items-center justify-center overflow-hidden bg-champagne px-9 py-4.5 font-sans text-[0.7rem] uppercase tracking-luxe text-noir"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-bottom scale-y-0 bg-on-noir transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
              />
              <span className="relative">Probeer opnieuw</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center border border-on-noir/25 px-9 py-4.5 font-sans text-[0.7rem] uppercase tracking-luxe text-on-noir transition-colors duration-500 hover:border-champagne"
            >
              Naar de homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
