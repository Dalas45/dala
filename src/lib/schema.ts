import { reviews } from "@/data/reviews";
import { COLOR_LABELS, SILHOUETTE_LABELS, getDressImages, getMainImage } from "@/lib/dresses";
import { absoluteUrl, hasAddress, siteConfig } from "@/lib/site";
import type { Dress, FaqItem, JewelleryItem } from "@/lib/types";

/**
 * JSON-LD builders. Alle structured data komt overeen met zichtbare content;
 * ontbrekende gegevens (adres, telefoon, prijs, reviews) worden weggelaten in plaats van verzonnen.
 */

export type JsonLd = Record<string, unknown>;

const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

function compact<T extends JsonLd>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)),
  ) as T;
}

function postalAddress(): JsonLd | undefined {
  if (!hasAddress) return undefined;
  return compact({
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.postalCode,
    addressLocality: siteConfig.address.city,
    addressCountry: siteConfig.address.country,
  });
}

function sameAs(): string[] {
  return [siteConfig.social.instagram, siteConfig.social.facebook, siteConfig.social.tiktok, siteConfig.social.googleBusiness].filter(
    (v): v is string => Boolean(v),
  );
}

export function organizationSchema(): JsonLd {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    alternateName: siteConfig.fullName,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddress(),
    vatID: siteConfig.business.vat,
    identifier: {
      "@type": "PropertyValue",
      name: "KVK",
      value: siteConfig.business.kvk,
    },
    sameAs: sameAs(),
  });
}

/** Alleen wanneer er een echt adres is ingesteld. */
export function localBusinessSchema(): JsonLd | undefined {
  if (!hasAddress) return undefined;
  const openingHoursSpecification = siteConfig.openingHours.map((spec) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: spec.days,
    opens: spec.opens,
    closes: spec.closes,
  }));
  return compact({
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    "@id": `${siteConfig.url}/#localbusiness`,
    name: siteConfig.fullName,
    parentOrganization: { "@id": ORGANIZATION_ID },
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.ogImage),
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: postalAddress(),
    hasMap: siteConfig.address.mapsUrl,
    vatID: siteConfig.business.vat,
    identifier: {
      "@type": "PropertyValue",
      name: "KVK",
      value: siteConfig.business.kvk,
    },
    openingHoursSpecification,
    sameAs: sameAs(),
  });
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "nl-NL",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function productSchema(dress: Dress): JsonLd {
  const url = absoluteUrl(`/jurken/${dress.slug}`);
  const offers = dress.price
    ? {
        "@type": "Offer",
        url,
        price: dress.price.amount,
        priceCurrency: dress.price.currency,
        availability: dress.availability === "niet-beschikbaar" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
        seller: { "@id": ORGANIZATION_ID },
      }
    : undefined;

  return compact({
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: dress.name,
    url,
    sku: dress.id,
    image: getDressImages(dress).map((img) => absoluteUrl(img.src)),
    description: `${dress.tagline}. ${dress.description.join(" ")}`,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Trouwjurk",
    color: COLOR_LABELS[dress.color],
    material: dress.material,
    additionalProperty: [
      { "@type": "PropertyValue", name: "Silhouet", value: SILHOUETTE_LABELS[dress.silhouette] },
      { "@type": "PropertyValue", name: "Halslijn", value: dress.neckline },
    ],
    offers,
  });
}

export function collectionSchema(dresses: Dress[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trouwjurken collectie van Dalas",
    numberOfItems: dresses.length,
    itemListElement: dresses.map((dress, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/jurken/${dress.slug}`),
      name: dress.name,
      image: absoluteUrl(getMainImage(dress).src),
    })),
  };
}

/**
 * De accessoires als één ItemList. Bewust geen Product per stuk: er is
 * geen aparte pagina per stuk en zonder prijs zou zo'n Product leeg blijven.
 */
export function jewelleryCollectionSchema(items: JewelleryItem[], imageSrc: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bruidssieraden en accessoires van Dalas",
    url: absoluteUrl("/sieraden"),
    image: absoluteUrl(imageSrc),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      description: item.tagline,
    })),
  };
}

/**
 * De dienst "op maat" als Service-node. Bewust zonder `offers`: er is geen
 * prijs aangeleverd, en een Offer zonder prijs is voor Google waardeloos.
 * De doorlooptijd staat er wel in, want dat is het enige harde gegeven dat we
 * naast het bestaan van de dienst zelf hebben.
 */
export function madeToMeasureSchema(): JsonLd {
  const url = absoluteUrl("/op-maat");
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: "Trouwjurk op maat",
    url,
    serviceType: "Trouwjurk op maat laten maken",
    description: "Dalas maakt trouwjurken op maat. Het maken duurt ongeveer vier weken.",
    provider: { "@id": ORGANIZATION_ID },
    serviceOutput: { "@type": "Product", name: "Trouwjurk op maat" },
    availableChannel: {
      "@type": "ServiceChannel",
      name: "Pasafspraak",
      serviceUrl: absoluteUrl("/afspraak"),
    },
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Doorlooptijd",
      value: "Ongeveer 4 weken",
    },
  });
}

export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Alleen wanneer er echte reviews met een score zijn. */
export function aggregateRatingSchema(): JsonLd | undefined {
  const rated = reviews.filter((r) => typeof r.rating === "number");
  if (rated.length === 0) return undefined;
  const avg = rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.round(avg * 10) / 10,
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    },
  };
}
