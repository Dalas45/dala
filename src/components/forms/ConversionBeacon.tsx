"use client";

import { useEffect, useRef } from "react";
import { track, trackConversion, type AnalyticsEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

export type ThanksKind = "afspraak" | "prijs" | "contact";

const EVENT: Record<ThanksKind, AnalyticsEvent> = {
  afspraak: "appointment_request_submit",
  prijs: "price_request_submit",
  contact: "contact_submit",
};

/**
 * Een eigen conversieactie per formulier, als die in Google Ads bestaat.
 * Zolang die er niet is, telt alles mee op de ene lead-conversie.
 */
const LABEL: Record<ThanksKind, string | undefined> = {
  afspraak: siteConfig.analytics.adsConversionAppointment,
  prijs: siteConfig.analytics.adsConversionPriceRequest,
  contact: siteConfig.analytics.adsConversionContact,
};

/**
 * Meldt de conversie op de bedankpagina in plaats van in het formulier.
 *
 * Het formulier stuurt na een geslaagde verzending door naar /bedankt, en dat
 * is het moment waarop de aanvraag zeker gelukt is. Eén plek voor alle drie de
 * formulieren, zodat de labels niet uit elkaar kunnen lopen.
 *
 * Rendert niets.
 */
export function ConversionBeacon({ kind, dressSlug }: { kind: ThanksKind; dressSlug?: string }) {
  const gemeld = useRef(false);

  useEffect(() => {
    // StrictMode draait effecten in development twee keer; één melding volstaat.
    if (gemeld.current) return;
    gemeld.current = true;
    track(EVENT[kind], dressSlug ? { dress_slug: dressSlug } : {});
    trackConversion({
      adsId: siteConfig.analytics.adsId,
      label: LABEL[kind] ?? siteConfig.analytics.adsConversionLead,
      value: siteConfig.analytics.adsConversionValue,
      currency: siteConfig.analytics.adsConversionCurrency,
    });
  }, [kind, dressSlug]);

  return null;
}
