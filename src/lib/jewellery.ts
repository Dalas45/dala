import { jewellery } from "@/data/jewellery";
import { jewelleryImagePaths } from "@/data/images.generated";
import type { DressImage, JewelleryItem, JewelleryType } from "@/lib/types";

export const JEWELLERY_TYPE_LABELS: Record<JewelleryType, string> = {
  set: "Set",
  tiara: "Tiara",
  boeket: "Boeket",
  cape: "Cape",
  waaier: "Waaier",
};

/** Meervoud, voor koppen en filters. */
export const JEWELLERY_TYPE_PLURAL: Record<JewelleryType, string> = {
  set: "Sieradensets",
  tiara: "Tiara's",
  boeket: "Boeketten",
  cape: "Capes",
  waaier: "Waaiers",
};

const sorted = [...jewellery].sort((a, b) => a.order - b.order);
const bySlug = new Map(sorted.map((item) => [item.slug, item]));

export function getAllJewellery(): JewelleryItem[] {
  return sorted;
}

export function getJewelleryBySlug(slug: string): JewelleryItem | undefined {
  return bySlug.get(slug);
}

export function getFeaturedJewellery(limit = 4): JewelleryItem[] {
  const featured = sorted.filter((item) => item.featured);
  return (featured.length >= 3 ? featured : sorted).slice(0, limit);
}

/**
 * De foto's van een sieraad: gegenereerde paden uit het manifest, gecombineerd
 * met de handgeschreven alt-teksten. Werkt hetzelfde als `getDressImages`.
 */
export function getJewelleryImages(item: JewelleryItem): DressImage[] {
  const paths = jewelleryImagePaths[item.slug] ?? [];
  return paths.map((src, i) => ({
    src,
    alt: item.imageAlts[i] ?? `${item.name} van Dalas`,
  }));
}

export function getJewelleryMainImage(item: JewelleryItem): DressImage {
  const [first] = getJewelleryImages(item);
  return first ?? { src: "", alt: `${item.name} van Dalas` };
}

/**
 * De types die daadwerkelijk in de collectie voorkomen, in vaste volgorde.
 * De volgorde is bewust niet alfabetisch: sieraden en tiara's zijn de kern van
 * de pagina en staan vooraan, de losse stukken erachter.
 */
export function getJewelleryTypes(items: JewelleryItem[]): JewelleryType[] {
  const present = new Set(items.map((i) => i.type));
  return (["set", "tiara", "boeket", "cape", "waaier"] as JewelleryType[]).filter((t) => present.has(t));
}
