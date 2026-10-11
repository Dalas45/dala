"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/analytics";

/**
 * Meldt elke navigatie binnen de app als paginaweergave.
 *
 * De App Router wisselt van pagina met de History API: er wordt geen nieuw
 * document geladen, dus de gtag-snippet komt na de eerste pagina niet meer aan
 * bod. Zonder deze melding kent Google alleen de pagina waarop de bezoeker
 * binnenkwam, en kan /bedankt niet als conversie op URL dienen.
 *
 * Rendert niets.
 */
export function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const eersteRender = useRef(true);

  useEffect(() => {
    // De eerste weergave meldt gtag('config', ...) zelf al; anders staat die dubbel.
    if (eersteRender.current) {
      eersteRender.current = false;
      return;
    }
    const query = searchParams.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}
