import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * Zoekmachines krijgen toegang tot alle pagina's én tot de assets.
 *
 * JavaScript- en CSS-bestanden onder /_next/ worden bewust NIET geblokkeerd:
 * Google heeft ze nodig om de pagina te renderen. Blokkeren leidt tot een
 * onvolledige weergave in de index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
