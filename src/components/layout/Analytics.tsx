import Script from "next/script";
import { siteConfig } from "@/lib/site";

/**
 * Alleen in productie een tag laden. Een Google Ads-tag die meeluistert op
 * `next dev` of op een preview-deploy maakt van elk testformulier een echte
 * conversie, en dat vervuilt precies de cijfers waarop de advertenties bieden.
 * In development logt `track()` de events wel in de console.
 *
 * VERCEL_ENV is "production", "preview" of "development"; buiten Vercel bestaat
 * het niet, en dan is NODE_ENV het enige wat we hebben.
 */
const inProductie =
  process.env.NODE_ENV === "production" && (process.env.VERCEL_ENV ?? "production") === "production";

/**
 * Laadt Google Tag Manager óf een directe gtag-installatie (GA4 / Google Ads),
 * afhankelijk van welke environment variables zijn ingevuld. Zonder configuratie
 * wordt er niets geladen, zodat de site standaard geen externe scripts ophaalt.
 *
 * Alle scripts gebruiken strategy="afterInteractive": ze blokkeren de eerste render niet.
 */
export function Analytics() {
  const { gtmId, gaId, adsId } = siteConfig.analytics;

  if (!inProductie) return null;

  if (gtmId) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
      </Script>
    );
  }

  const directId = gaId ?? adsId;
  if (!directId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${directId}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${gaId ? `gtag('config', '${gaId}');` : ""}
${adsId ? `gtag('config', '${adsId}');` : ""}`}
      </Script>
    </>
  );
}

/** Noscript-fallback voor GTM; hoort direct na de openende body-tag. */
export function AnalyticsNoScript() {
  const { gtmId } = siteConfig.analytics;
  if (!inProductie || !gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
