/** Rustige laadstatus op de donkere basis, zodat er geen lichtflits ontstaat. */
export default function Loading() {
  return (
    <div className="tone-noir grain flex min-h-[80vh] items-center justify-center" role="status" aria-live="polite">
      <span className="label animate-pulse text-champagne">Dalas</span>
    </div>
  );
}
