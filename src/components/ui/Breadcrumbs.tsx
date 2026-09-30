import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/schema";
import { cn } from "@/lib/utils";

/**
 * Zichtbare breadcrumb-navigatie. De bijbehorende BreadcrumbList JSON-LD
 * wordt op paginaniveau met dezelfde items opgebouwd.
 */
export function Breadcrumbs({
  items,
  className,
  tone = "light",
}: {
  items: BreadcrumbItem[];
  className?: string;
  tone?: "light" | "noir";
}) {
  return (
    <nav
      aria-label="Kruimelpad"
      className={cn("font-sans text-[0.62rem] uppercase tracking-luxe", tone === "noir" ? "text-on-noir-muted" : "text-muted", className)}
    >
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2.5">
              {isLast ? (
                <span aria-current="page" className={tone === "noir" ? "text-champagne" : "text-ink"}>
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className={cn("link-underline transition-colors", tone === "noir" ? "hover:text-on-noir" : "hover:text-ink")}
                  >
                    {item.name}
                  </Link>
                  <span aria-hidden="true" className="opacity-40">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
