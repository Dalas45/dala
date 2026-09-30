/**
 * Skeleton voor de collectiepagina. De verhoudingen komen overeen met de echte
 * kaarten, zodat er bij het laden geen layout shift optreedt.
 */
export default function LoadingDresses() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Collectie wordt geladen…</span>

      <div className="tone-noir grain pb-20 pt-40">
        <div className="container-x">
          <div className="h-2.5 w-28 animate-pulse bg-noir-line" />
          <div className="mt-10 h-16 w-80 max-w-full animate-pulse bg-noir-line" />
        </div>
      </div>

      <div className="bg-ivory py-16">
        <div className="container-x">
          <div className="h-px w-full bg-line" />
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className={index % 2 === 1 ? "lg:mt-20" : undefined}>
                <div className="aspect-[3/4] animate-pulse bg-cream" />
                <div className="mt-5 h-6 w-36 animate-pulse bg-cream" />
                <div className="mt-3 h-3 w-52 max-w-full animate-pulse bg-cream" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
