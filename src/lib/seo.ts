import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

interface PageMetadataInput {
  /**
   * De volledige title, inclusief merknaam. Wordt als `absolute` gezet zodat de
   * template uit de root layout er geen tweede keer "| Dalas" achter plakt.
   */
  title: string;
  description: string;
  /** Pad zonder domein, bv. "/jurken/queen" */
  path: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
  noIndex?: boolean;
}

/**
 * Bouwt consistente metadata: title, description, canonical, Open Graph en Twitter.
 * De root layout regelt `metadataBase` en de title-template.
 */
export function buildMetadata({ title, description, path, image, type = "website", noIndex = false }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? { src: siteConfig.ogImage, alt: `${siteConfig.name} – trouwjurken huren`, width: 1200, height: 630 };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [
        {
          url: absoluteUrl(ogImage.src),
          alt: ogImage.alt,
          width: ogImage.width,
          height: ogImage.height,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(ogImage.src)],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}
