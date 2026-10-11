/**
 * Event-tracking met één duidelijke naamgeving.
 * Werkt met Google Tag Manager (dataLayer) én met een directe GA4/Google Ads gtag-installatie.
 *
 * Eventnamen (GA4-conventie, snake_case):
 *  - view_dress                 { dress_slug, dress_name }
 *  - cta_click                  { cta, location, dress_slug? }
 *  - gallery_open               { dress_slug, image_index }
 *  - filter_change              { filter, value, active }
 *  - price_request_submit       { dress_slug }
 *  - appointment_request_submit { dress_slug? }
 *  - contact_submit             {}
 *  - phone_click / whatsapp_click / email_click { location }
 */

export type AnalyticsEvent =
  | "view_dress"
  | "cta_click"
  | "gallery_open"
  | "filter_change"
  | "price_request_submit"
  | "appointment_request_submit"
  | "contact_submit"
  | "phone_click"
  | "whatsapp_click"
  | "email_click";

export type AnalyticsParams = Record<string, string | number | boolean | undefined>;

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

/**
 * De gtag-functie, zo nodig zelf aangemaakt.
 *
 * Dit is precies wat de snippet van Google doet: gtag duwt zijn argumenten in
 * de dataLayer, en gtag.js werkt die rij alsnog af zodra het geladen is.
 * Daarmee gaat een melding niet verloren terwijl het externe script nog
 * onderweg is. Dat is geen theoretisch geval: de scripts laden pas ná de
 * hydratie, terwijl een effect meteen draait, dus wie rechtstreeks op
 * /bedankt binnenkomt zou anders ongemerkt niet meetellen.
 */
function gtag(...args: unknown[]): void {
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    const queue = window.dataLayer;
    window.gtag = function () {
      // Hier moet het arguments-object zelf de dataLayer in, niet een array
      // ervan: gtag.js herkent alleen dat eerste als een opdracht. Dat is ook
      // precies wat de snippet van Google doet, dus prefer-rest-params gaat
      // hier niet op.
      // eslint-disable-next-line prefer-rest-params
      queue.push(arguments);
    };
  }
  window.gtag(...args);
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...clean });
  gtag("event", event, clean);
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, clean);
  }
}

/**
 * Paginaweergave bij een navigatie binnen de app.
 *
 * De gtag-snippet meldt alleen de pagina waarop de bezoeker binnenkomt. Daarna
 * wisselt de App Router van pagina via de History API, zonder dat er een nieuw
 * document wordt geladen, en ziet Google de rest van het bezoek niet. Zonder
 * deze melding is een conversie op URL onmogelijk: /bedankt wordt bereikt met
 * een navigatie, niet met een paginalading.
 *
 * Wordt niet bij de eerste render aangeroepen; die weergave staat al in de snippet.
 */
export function trackPageView(path: string): void {
  if (typeof window === "undefined") return;
  const location = `${window.location.origin}${path}`;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: "page_view", page_path: path, page_location: location });
  gtag("event", "page_view", { page_path: path, page_location: location });
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics] page_view", path);
  }
}

export type ConversionKind = "appointment" | "price_request" | "contact";

export interface ConversionInput {
  /** Het Google Ads-id, bv. AW-0000000000. */
  adsId?: string;
  /** Het conversielabel uit de conversieactie in Google Ads. */
  label?: string;
  /** Wat één aanvraag waard is; Google Ads leert hiermee waar het op moet bieden. */
  value?: number;
  /** Valuta bij de waarde, bv. EUR. Alleen zinvol samen met `value`. */
  currency?: string;
}

/**
 * Google Ads-conversie via gtag.
 *
 * Zonder id of label gebeurt er niets: dan bestaat er in Google Ads nog geen
 * conversieactie om naartoe te melden. Bij gebruik van GTM kun je in plaats
 * hiervan de dataLayer-events als trigger nemen.
 */
export function trackConversion({ adsId, label, value, currency }: ConversionInput): void {
  if (typeof window === "undefined" || !adsId || !label) return;
  const payload: Record<string, string | number> = { send_to: `${adsId}/${label}` };
  // Google Ads negeert een waarde zonder valuta, dus die twee gaan samen of niet.
  if (value !== undefined && currency) {
    payload.value = value;
    payload.currency = currency;
  }
  gtag("event", "conversion", payload);
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics] conversion", payload);
  }
}
