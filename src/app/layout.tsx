import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics, AnalyticsNoScript } from "@/components/layout/Analytics";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { StickyActions } from "@/components/layout/StickyActions";
import { Cursor } from "@/components/motion/Cursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { StructuredData } from "@/components/ui/StructuredData";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site";
import "./globals.css";

/**
 * Fonts worden self-hosted door next/font: geen extra verbinding naar Google en
 * `display: swap` voorkomt onzichtbare tekst.
 *
 * Bodoni Moda is een didone met extreem hoog contrast — couture-typografie,
 * uitsluitend voor display. Inter Tight draagt alle UI en lopende tekst.
 */
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Trouwjurk huren bij Dalas | Exclusieve bruidsjurken",
    template: "%s | Dalas",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["trouwjurk huren", "trouwjurken huren", "bruidsjurk huren", "trouwjurk verhuur", "trouwjurk passen", "bruidsmode"],
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  formatDetection: { telephone: true, address: false, email: true },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Trouwjurk huren bij Dalas | Exclusieve bruidsjurken",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Trouwjurken van Dalas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trouwjurk huren bij Dalas",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0b0a",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" data-scroll-behavior="smooth" className={`${bodoni.variable} ${interTight.variable}`}>
      <head>
        {/*
          Scroll-animaties starten verborgen: op opacity 0, of weggeschoven onder
          een masker. Zonder JavaScript wordt die beginstand nooit weggeanimeerd,
          dus maken we die elementen dan direct zichtbaar.
        */}
        <noscript>
          <style>
            {`[style*="opacity:0"],[style*="translateY"],[style*="translateX"]{opacity:1 !important;transform:none !important;}`}
          </style>
        </noscript>
      </head>
      <body className="min-h-dvh bg-noir">
        <AnalyticsNoScript />
        <a
          href="#hoofdinhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-champagne focus:px-5 focus:py-3 focus:font-sans focus:text-[0.7rem] focus:uppercase focus:tracking-luxe focus:text-noir"
        >
          Naar de inhoud
        </a>

        <ScrollProgress />
        <Cursor />
        <Header />
        <main id="hoofdinhoud">{children}</main>
        <Footer />
        <StickyActions />

        <StructuredData schema={[organizationSchema(), websiteSchema(), localBusinessSchema()]} />
        <Analytics />
        {/* Alleen op Vercel: elders bestaat het endpoint niet en levert het een 404 op. */}
        {process.env.VERCEL ? <VercelAnalytics /> : null}
      </body>
    </html>
  );
}
