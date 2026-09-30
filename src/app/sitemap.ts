import type { MetadataRoute } from "next";
import { getAllDresses } from "@/lib/dresses";
import { absoluteUrl } from "@/lib/site";

/**
 * Sitemap. Nieuwe jurken verschijnen hier automatisch zodra ze aan
 * `src/data/dresses.ts` zijn toegevoegd.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/jurken"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/op-maat"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/sieraden"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/afspraak"), lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/over-ons"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/faq"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/privacy"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];

  const dressPages: MetadataRoute.Sitemap = getAllDresses().map((dress) => ({
    url: absoluteUrl(`/jurken/${dress.slug}`),
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticPages, ...dressPages];
}
