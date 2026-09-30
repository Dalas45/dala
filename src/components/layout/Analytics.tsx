import Script from "next/script";
import { siteConfig } from "@/lib/site";

/**
 * Laadt Google Tag Manager óf een directe gtag-installatie (GA4 / Google Ads),
 * afhankelijk van welke environment variables zijn ingevuld. Zonder configuratie
 * wordt er niets geladen, zodat de site standaard geen externe scripts ophaalt.
 *
 * Alle scripts gebruiken strategy="afterInteractive": ze blokkeren de eerste render niet.
 */
export function Analytics() {
  const { gtmId, gaId, adsId } = siteConfig.analytics;

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
  if (!gtmId) return null;
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
