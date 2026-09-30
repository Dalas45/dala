import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Het Dalas-logo: gouden monogram met kroon, de merknaam en het silhouet van een bruid.
 *
 * Het bestand is bijna vierkant en bevat de naam al, dus er staat geen losse
 * tekst naast. Op de donkere header komt het goud vanzelf uit; op de lichte
 * header werkt het net zo goed, omdat het beeld nauwelijks witte vlakken heeft.
 *
 * De toegankelijke naam staat in `alt`: schermlezers en spraakbesturing horen
 * "Dalas Boutique", precies wat er in het beeld staat.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  // Twee maten: ruim bovenaan de pagina, compacter zodra de header krimpt.
  const height = compact ? 46 : 62;

  return (
    <Link href="/" className={cn("group inline-flex items-center", className)}>
      {/* Bronbestand is 248x260; de hoogte stuurt, de breedte volgt. */}
      <Image
        src="/logo.png"
        alt="Dalas Boutique"
        width={248}
        height={260}
        priority
        sizes="80px"
        className="w-auto transition-opacity duration-500 group-hover:opacity-80"
        style={{ height }}
      />
    </Link>
  );
}
