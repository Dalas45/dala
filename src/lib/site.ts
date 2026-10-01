/**
 * Centrale site-configuratie.
 *
 * Contact- en locatiegegevens komen uit environment variables (zie .env.example).
 * Alles wat niet is ingevuld, wordt in de UI en in de structured data automatisch weggelaten:
 * er worden geen gegevens verzonnen.
 */

const env = (key: string): string | undefined => {
  const value = process.env[key];
  return value && value.trim().length > 0 ? value.trim() : undefined;
};

export interface OpeningHoursSpec {
  /** Schema.org dagnamen: Monday, Tuesday, ... */
  days: string[];
  opens: string;
  closes: string;
  /** Leesbare weergave, bv. "Ma – Vr" */
  label: string;
}

const DAY_MAP: Record<string, { schema: string; label: string }> = {
  ma: { schema: "Monday", label: "Ma" },
  di: { schema: "Tuesday", label: "Di" },
  wo: { schema: "Wednesday", label: "Wo" },
  do: { schema: "Thursday", label: "Do" },
  vr: { schema: "Friday", label: "Vr" },
  za: { schema: "Saturday", label: "Za" },
  zo: { schema: "Sunday", label: "Zo" },
};

/**
 * Formaat NEXT_PUBLIC_OPENING_HOURS: "ma-vr 10:00-18:00; za 10:00-17:00"
 * Dagen: ma, di, wo, do, vr, za, zo. Bereik met "-", losse dagen met ",".
 */
function parseOpeningHours(raw?: string): OpeningHoursSpec[] {
  if (!raw) return [];
  const order = ["ma", "di", "wo", "do", "vr", "za", "zo"];
  return raw
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .flatMap((part) => {
      const match = part.match(/^([a-z,\-\s]+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i);
      if (!match) return [];
      const daysRaw = match[1]!;
      const opens = match[2]!;
      const closes = match[3]!;
      const dayTokens = daysRaw.toLowerCase().replace(/\s/g, "");
      const days: string[] = [];
      for (const token of dayTokens.split(",")) {
        if (token.includes("-")) {
          const [from, to] = token.split("-");
          const a = order.indexOf(from ?? "");
          const b = order.indexOf(to ?? "");
          if (a >= 0 && b >= a) days.push(...order.slice(a, b + 1));
        } else if (order.includes(token)) {
          days.push(token);
        }
      }
      if (days.length === 0) return [];
      const first = DAY_MAP[days[0]!]!;
      const last = DAY_MAP[days[days.length - 1]!]!;
      const label =
        days.length > 1 && dayTokens.includes("-") ? `${first.label} – ${last.label}` : days.map((d) => DAY_MAP[d]!.label).join(", ");
      return [{ days: days.map((d) => DAY_MAP[d]!.schema), opens, closes, label }];
    });
}

const siteUrl = env("NEXT_PUBLIC_SITE_URL") ?? "http://localhost:3000";

export const siteConfig = {
  name: "Dalas",
  /** Naam zoals zichtbaar in de zaak. */
  fullName: "Dalas Boutique",
  tagline: "Trouwjurken huren",
  url: siteUrl.replace(/\/$/, ""),
  locale: "nl_NL",
  language: "nl",
  description:
    "Dalas verhuurt exclusieve trouwjurken. Bekijk de collectie baljurken, getailleerde jurken en A-lijn trouwjurken, vraag de prijs op en plan een persoonlijke pasafspraak in de boutique.",
  contact: {
    phone: env("NEXT_PUBLIC_PHONE"),
    /** Internationaal zonder + of spaties, bv. 31612345678 */
    whatsapp: env("NEXT_PUBLIC_WHATSAPP") ?? "31612739993",
    email: env("NEXT_PUBLIC_EMAIL"),
  },
  /**
   * Wettelijke bedrijfsgegevens. Deze staan hier hard in plaats van in een env var:
   * ze verschillen niet per omgeving en moeten op elke deploy zichtbaar zijn.
   */
  business: {
    kvk: "92222188",
    vat: "NL004943700B91",
  },
  address: {
    street: env("NEXT_PUBLIC_ADDRESS_STREET"),
    postalCode: env("NEXT_PUBLIC_ADDRESS_POSTAL_CODE"),
    city: env("NEXT_PUBLIC_ADDRESS_CITY"),
    country: env("NEXT_PUBLIC_ADDRESS_COUNTRY") ?? "NL",
    /** Google Maps-link of Google Business Profile-link */
    mapsUrl: env("NEXT_PUBLIC_MAPS_URL"),
  },
  openingHours: parseOpeningHours(env("NEXT_PUBLIC_OPENING_HOURS")),
  social: {
    instagram: env("NEXT_PUBLIC_INSTAGRAM_URL"),
    facebook: env("NEXT_PUBLIC_FACEBOOK_URL"),
    tiktok: env("NEXT_PUBLIC_TIKTOK_URL"),
    googleBusiness: env("NEXT_PUBLIC_GOOGLE_BUSINESS_URL"),
  },
  analytics: {
    gtmId: env("NEXT_PUBLIC_GTM_ID"),
    gaId: env("NEXT_PUBLIC_GA_ID"),
    adsId: env("NEXT_PUBLIC_GOOGLE_ADS_ID"),
    adsConversionAppointment: env("NEXT_PUBLIC_ADS_CONVERSION_APPOINTMENT"),
    adsConversionPriceRequest: env("NEXT_PUBLIC_ADS_CONVERSION_PRICE_REQUEST"),
    adsConversionContact: env("NEXT_PUBLIC_ADS_CONVERSION_CONTACT"),
  },
  ogImage: "/images/og/dalas-trouwjurken.jpg",
  /** Vermelding van de bouwer in de footer. */
  credit: {
    name: "Start Beheer Solutions",
    url: "https://startbeheer.nl/",
  },
} as const;

export const hasAddress = Boolean(siteConfig.address.street && siteConfig.address.city);
export const hasContact = Boolean(siteConfig.contact.phone || siteConfig.contact.email || siteConfig.contact.whatsapp);

export const phoneHref = siteConfig.contact.phone ? `tel:${siteConfig.contact.phone.replace(/[\s()-]/g, "")}` : undefined;
export const whatsappHref = siteConfig.contact.whatsapp
  ? `https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent("Hallo Dalas, ik heb een vraag over een trouwjurk.")}`
  : undefined;
export const emailHref = siteConfig.contact.email ? `mailto:${siteConfig.contact.email}` : undefined;

/**
 * Leesbare weergave van het WhatsApp-nummer.
 * Nederlandse mobiele nummers worden gegroepeerd (+31 6 1234 5678); bij een andere
 * landcode blijft het nummer ongewijzigd, met alleen een + ervoor.
 */
export const whatsappDisplay = ((): string | undefined => {
  const digits = siteConfig.contact.whatsapp?.replace(/\D/g, "");
  if (!digits) return undefined;
  const nl = digits.match(/^31(6)(\d{4})(\d{4})$/);
  return nl ? `+31 ${nl[1]} ${nl[2]} ${nl[3]}` : `+${digits}`;
})();

export const navigation = {
  // Vijf items is het maximum dat naast het logo en de knop past zonder te
  // verdringen; "Veelgestelde vragen" blijft bereikbaar via de footer en de
  // homepage. Komt er nog een item bij, dan moet de balk anders.
  main: [
    { href: "/jurken", label: "Collectie" },
    { href: "/op-maat", label: "Op maat" },
    { href: "/sieraden", label: "Sieraden" },
    { href: "/over-ons", label: "Over Dalas" },
    { href: "/contact", label: "Contact" },
  ],
  footer: [
    { href: "/jurken", label: "Alle trouwjurken" },
    { href: "/op-maat", label: "Jurk op maat" },
    { href: "/sieraden", label: "Sieraden en accessoires" },
    { href: "/afspraak", label: "Afspraak maken" },
    { href: "/over-ons", label: "Over Dalas" },
    { href: "/faq", label: "Veelgestelde vragen" },
    { href: "/contact", label: "Contact" },
    { href: "/privacy", label: "Privacy" },
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
