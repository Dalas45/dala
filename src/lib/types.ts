/**
 * Domeinmodel van de Dalas-collectie.
 * De data staat los van de UI in `src/data/dresses.ts`.
 */

/**
 * `kort` gaat over de lengte en niet over de vorm, maar hoort in dezelfde
 * filtergroep: één korte jurk rechtvaardigt geen eigen filter-as, en zonder
 * waarde zou die jurk bij elk silhouetfilter wegvallen.
 */
export type Silhouette = "baljurk" | "a-lijn" | "getailleerd" | "kort";
export type Sleeves = "lang" | "kort" | "mouwloos";
export type DressColor = "wit" | "ivoor" | "roze";
export type Availability = "op-aanvraag" | "beschikbaar" | "niet-beschikbaar";

export interface DressImage {
  /** Publiek pad, bv. /images/dresses/queen/trouwjurk-queen-dalas-01.jpg */
  src: string;
  /** Beschrijvende alt-tekst (geen keyword stuffing). */
  alt: string;
}

export interface DressPrice {
  amount: number;
  currency: "EUR";
  /** Bijvoorbeeld "per huurperiode". */
  label?: string;
}

export interface Dress {
  id: string;
  slug: string;
  name: string;
  /** Korte typering van één regel onder de naam. */
  tagline: string;
  /** Beschrijving in alinea's (elk array-item is een alinea). */
  description: string[];
  /** Zichtbare kenmerken van de jurk, gebaseerd op de productfoto's. */
  features: string[];
  silhouette: Silhouette;
  neckline: string;
  sleeves: Sleeves;
  color: DressColor;
  /** Optioneel: vul in zodra bekend. Wordt anders als "op aanvraag" getoond. */
  material?: string;
  sizes?: string[];
  price?: DressPrice | null;
  availability: Availability;
  /**
   * Alt-teksten, in dezelfde volgorde als de foto's die `npm run images`
   * voor deze slug genereert. De eerste hoort bij de hoofdfoto.
   *
   * De bestandspaden staan hier bewust niet: die worden gegenereerd, inclusief
   * een hash van de inhoud, en opgezocht via `getDressImages()`.
   */
  imageAlts: string[];
  featured?: boolean;
  /** Volgorde in de collectie (laag = eerst). */
  order: number;
  seo: {
    title?: string;
    description: string;
  };
  /** Optioneel: handmatige aanbevelingen (slugs). Anders automatisch bepaald. */
  related?: string[];
}

/**
 * Alles wat naast de jurk op /sieraden staat. Begon met sieraden en tiara's en
 * omvat nu de hele aankleding: boeketten, capes en een waaier. De route en de
 * mapnaam blijven `sieraden`, want dat is de naam die bezoekers zien en die in
 * de URL's staat.
 */
export type JewelleryType = "set" | "tiara" | "boeket" | "cape" | "waaier";

export interface JewelleryItem {
  id: string;
  slug: string;
  /** Door Dalas gekozen naam; de aanlevering bevatte alleen foto's. */
  name: string;
  tagline: string;
  description: string;
  type: JewelleryType;
  /**
   * Waar het stuk van gemaakt is. Optioneel: bij een boeket valt van de foto
   * niet met zekerheid af te lezen of het zijde, papier of vers is, en dan
   * liever niets dan een aanname.
   */
  material?: string;
  /** Welke stukken erbij horen, bv. ["Collier", "Oorbellen", "Armband"]. */
  pieces: string[];
  /** Zie `Dress.imageAlts`: de paden komen uit het gegenereerde manifest. */
  imageAlts: string[];
  order: number;
  featured?: boolean;
  price?: DressPrice | null;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Review {
  name: string;
  quote: string;
  /** 1 t/m 5 */
  rating?: number;
  date?: string;
  source?: string;
}
