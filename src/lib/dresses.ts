import { dresses } from "@/data/dresses";
import { dressImagePaths, generatedImages, type GeneratedImage } from "@/data/images.generated";
import type { Dress, DressColor, DressImage, Silhouette, Sleeves } from "@/lib/types";

export const SILHOUETTE_LABELS: Record<Silhouette, string> = {
  baljurk: "Baljurk",
  "a-lijn": "A-lijn",
  getailleerd: "Getailleerd",
  kort: "Kort",
};

export const SLEEVE_LABELS: Record<Sleeves, string> = {
  lang: "Lange mouwen",
  kort: "Korte mouwen",
  mouwloos: "Mouwloos",
};

export const COLOR_LABELS: Record<DressColor, string> = {
  wit: "Wit",
  ivoor: "Ivoor",
  roze: "Roze",
};

export const AVAILABILITY_LABELS: Record<Dress["availability"], string> = {
  "op-aanvraag": "Beschikbaarheid op aanvraag",
  beschikbaar: "Beschikbaar",
  "niet-beschikbaar": "Momenteel niet beschikbaar",
};

/**
 * Het soort jurk in gewone woorden, bv. "baljurk met lange mouwen".
 *
 * Bewust anders verwoord dan `SILHOUETTE_LABELS`: dat zijn korte filterchips
 * ("A-lijn"), dit zijn zinsdelen die in een titel of kop kunnen staan.
 * `mouwloos` wordt "zonder mouwen", want "A-lijn jurk mouwloos" loopt niet.
 */
const SILHOUETTE_PHRASE: Record<Silhouette, string> = {
  baljurk: "baljurk",
  "a-lijn": "A-lijn jurk",
  getailleerd: "getailleerde jurk",
  kort: "korte jurk",
};

const SLEEVE_PHRASE: Record<Sleeves, string> = {
  lang: "met lange mouwen",
  kort: "met korte mouwen",
  mouwloos: "zonder mouwen",
};

export function dressTypeLabel(dress: Dress, { withSleeves = true } = {}): string {
  const silhouette = SILHOUETTE_PHRASE[dress.silhouette];
  return withSleeves ? `${silhouette} ${SLEEVE_PHRASE[dress.sleeves]}` : silhouette;
}

/** Google kapt een titel af rond deze lengte; daarboven leest niemand de staart. */
const TITLE_MAX = 60;

/**
 * De titel van een jurkpagina zoals hij in Google verschijnt.
 *
 * De jurknamen zijn van Dalas zelf — op "Queen" of "Danteel" zoekt niemand.
 * Daarom staat het zoekwoord vooraan en dient de naam alleen ter
 * onderscheiding: "Trouwjurk Queen huren — baljurk met lange mouwen | Dalas".
 *
 * Past dat niet binnen de afkapgrens, dan valt de titel terug op alleen het
 * silhouet en daarna op de kale vorm. Zo krijgt elke nieuwe jurk vanzelf een
 * bruikbare titel, en kan `seo.title` in de data hem altijd overrulen.
 */
export function dressSeoTitle(dress: Dress): string {
  if (dress.seo.title) return dress.seo.title;

  const head = `Trouwjurk ${dress.name} huren`;
  const kandidaten = [
    `${head} — ${dressTypeLabel(dress)} | Dalas`,
    `${head} — ${dressTypeLabel(dress, { withSleeves: false })} | Dalas`,
  ];
  return kandidaten.find((titel) => titel.length <= TITLE_MAX) ?? `${head} | Dalas`;
}

const sorted = [...dresses].sort((a, b) => a.order - b.order);
const bySlug = new Map(sorted.map((d) => [d.slug, d]));

export function getAllDresses(): Dress[] {
  return sorted;
}

export function getDressBySlug(slug: string): Dress | undefined {
  return bySlug.get(slug);
}

export function getFeaturedDresses(limit = 6): Dress[] {
  const featured = sorted.filter((d) => d.featured);
  return (featured.length >= 3 ? featured : sorted).slice(0, limit);
}

/**
 * De foto's van een jurk: gegenereerde paden uit het manifest, gecombineerd met
 * de handgeschreven alt-teksten uit `dresses.ts`.
 *
 * Staat er geen alt-tekst voor een foto, dan valt hij terug op de naam van de
 * jurk. Zo blijft de site werken wanneer er een foto is bijgekomen waarvoor de
 * alt-tekst nog moet worden geschreven.
 */
export function getDressImages(dress: Dress): DressImage[] {
  const paths = dressImagePaths[dress.slug] ?? [];
  return paths.map((src, i) => ({
    src,
    alt: dress.imageAlts[i] ?? `Trouwjurk ${dress.name} van Dalas`,
  }));
}

export function getMainImage(dress: Dress): DressImage {
  const [first] = getDressImages(dress);
  // Zonder foto's zou de UI crashen; een lege src is zichtbaar fout maar veilig.
  return first ?? { src: "", alt: `Trouwjurk ${dress.name} van Dalas` };
}

/** Afmetingen + blur-placeholder uit het gegenereerde manifest. */
export function getImageMeta(src: string): GeneratedImage {
  const meta = generatedImages[src];
  if (!meta) {
    // Valt terug op 3:4; voorkomt een crash wanneer een foto nog niet is gegenereerd.
    return { width: 1200, height: 1600, blurDataURL: "" };
  }
  return meta;
}

/**
 * Dynamische aanbevelingen: eerst hetzelfde silhouet, dan dezelfde kleur, dan dezelfde mouwlengte.
 * Handmatige `related`-slugs krijgen voorrang.
 */
export function getRelatedDresses(dress: Dress, limit = 4): Dress[] {
  const manual = (dress.related ?? []).map((slug) => bySlug.get(slug)).filter((d): d is Dress => Boolean(d));
  const candidates = sorted.filter((d) => d.slug !== dress.slug && !manual.includes(d));
  const score = (d: Dress): number =>
    (d.silhouette === dress.silhouette ? 4 : 0) +
    (d.color === dress.color ? 2 : 0) +
    (d.sleeves === dress.sleeves ? 1 : 0) +
    (d.featured ? 0.5 : 0);
  const ranked = candidates.map((d) => ({ d, s: score(d) })).sort((a, b) => b.s - a.s || a.d.order - b.d.order);
  return [...manual, ...ranked.map((r) => r.d)].slice(0, limit);
}

export interface DressFilters {
  silhouette?: Silhouette[];
  color?: DressColor[];
  sleeves?: Sleeves[];
}

export function filterDresses(list: Dress[], filters: DressFilters): Dress[] {
  return list.filter((d) => {
    if (filters.silhouette?.length && !filters.silhouette.includes(d.silhouette)) return false;
    if (filters.color?.length && !filters.color.includes(d.color)) return false;
    if (filters.sleeves?.length && !filters.sleeves.includes(d.sleeves)) return false;
    return true;
  });
}

export function formatPrice(dress: Dress): string | undefined {
  if (!dress.price) return undefined;
  const amount = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: dress.price.currency,
    maximumFractionDigits: 0,
  }).format(dress.price.amount);
  return dress.price.label ? `${amount} ${dress.price.label}` : amount;
}

/** Alleen filters tonen waarvoor minimaal twee verschillende waarden bestaan. */
export function getAvailableFilterOptions(list: Dress[]) {
  const unique = <T,>(values: T[]) => Array.from(new Set(values));
  const silhouettes = unique(list.map((d) => d.silhouette));
  const colors = unique(list.map((d) => d.color));
  const sleeves = unique(list.map((d) => d.sleeves));
  return {
    silhouette: silhouettes.length > 1 ? silhouettes : [],
    color: colors.length > 1 ? colors : [],
    sleeves: sleeves.length > 1 ? sleeves : [],
  };
}
