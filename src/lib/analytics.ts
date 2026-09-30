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

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined));
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...clean });
  if (typeof window.gtag === "function") {
    window.gtag("event", event, clean);
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, clean);
  }
}

export type ConversionKind = "appointment" | "price_request" | "contact";

/**
 * Google Ads-conversie via gtag (alleen actief met NEXT_PUBLIC_GOOGLE_ADS_ID + conversion label).
 * Bij gebruik van GTM kun je in plaats hiervan de dataLayer-events als trigger gebruiken.
 */
export function trackConversion(adsId?: string, label?: string): void {
  if (typeof window === "undefined" || !adsId || !label || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", { send_to: `${adsId}/${label}` });
}
