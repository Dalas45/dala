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
 * Hoort in de <head> van de root layout en staat daar bewust als gewone
 * <script>, niet via next/script. Google schrijft voor dat de tag direct na
 * <head> staat, en next/script haalt hem daar juist weg: zelfs met
 * beforeInteractive belandt hij in de eigen scriptlader van Next, verderop in
 * de body. Dat is hier geen formaliteit — de tag schrijft bij binnenkomst de
 * gclid uit de advertentielink in een cookie, en wie wegklikt voordat dat
 * gebeurd is, is een betaalde klik die niet meer aan een latere aanvraag te
 * koppelen valt. Het externe script houdt `async`, dus het blokkeert de
 * opbouw van de pagina niet.
 */
export function Analytics() {
  const { gtmId, gaId, adsId } = siteConfig.analytics;

  if (!inProductie) return null;

  if (gtmId) {
    return (
      // De GoogleTagManager-component van @next/third-parties die de lintregel
      // voorstelt laadt de container pas na de hydratie, en dat is precies wat
      // hier niet moet. Zie de uitleg boven deze component.
      // eslint-disable-next-line @next/next/next-script-for-ga
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`,
        }}
      />
    );
  }

  // Eén tag per pagina: gtag.js wordt één keer geladen en krijgt daarna een
  // config-regel per property.
  //
  // Het Ads-id gaat voor in de laad-URL. Dat is geen willekeur: laadt dat ene
  // script niet, dan werkt er niets meer, ook de config-regels niet. Toen hier
  // het GA4-id stond gaf googletagmanager.com daar 404 op, en lag daarmee ook
  // de conversiemeting van Google Ads plat. De advertenties hangen van die
  // meting af; GA4 is rapportage. Dus draagt het id met het meeste te
  // verliezen de laad-URL, en komt het andere er als config-regel bij.
  const directId = adsId ?? gaId;
  if (!directId) return null;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${directId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${gaId ? `gtag('config', '${gaId}');\n` : ""}${adsId ? `gtag('config', '${adsId}');` : ""}`,
        }}
      />
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
