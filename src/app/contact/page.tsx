import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Clock, Mail, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { breadcrumbSchema, localBusinessSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { emailHref, hasAddress, hasContact, phoneHref, siteConfig, whatsappHref } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Contact | Dalas trouwjurken Haarlem",
  description:
    "Neem contact op met Dalas in Haarlem over het huren van een trouwjurk. Stel je vraag via het formulier of stuur ons een WhatsApp-bericht.",
  path: "/contact",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
];

/** `onderwerp` in de URL vult het onderwerpveld vooraf in, bv. vanaf een sieraad. */
type PageProps = { searchParams: Promise<{ onderwerp?: string }> };

export default async function ContactPage({ searchParams }: PageProps) {
  const { onderwerp } = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We horen graag van je"
        breadcrumbs={breadcrumbs}
        intro="Heb je een vraag over een jurk, de huurperiode of een pasafspraak? Stuur ons een bericht, dan reageren we zo snel mogelijk."
      />

      <Section spacing="tight">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                {hasContact || hasAddress ? (
                  <address className="not-italic">
                    <h2 className="label text-gold">Gegevens</h2>
                    <ul className="mt-7 space-y-4 text-sm text-muted">
                      {phoneHref ? (
                        <li>
                          <TrackedAnchor
                            href={phoneHref}
                            event="phone_click"
                            params={{ location: "contactpagina" }}
                            className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                          >
                            <Phone width={16} height={16} />
                            {siteConfig.contact.phone}
                          </TrackedAnchor>
                        </li>
                      ) : null}
                      {whatsappHref ? (
                        <li>
                          <TrackedAnchor
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            event="whatsapp_click"
                            params={{ location: "contactpagina" }}
                            className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                          >
                            <WhatsApp width={16} height={16} />
                            WhatsApp
                          </TrackedAnchor>
                        </li>
                      ) : null}
                      {emailHref ? (
                        <li>
                          <TrackedAnchor
                            href={emailHref}
                            event="email_click"
                            params={{ location: "contactpagina" }}
                            className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-ink"
                          >
                            <Mail width={16} height={16} />
                            {siteConfig.contact.email}
                          </TrackedAnchor>
                        </li>
                      ) : null}
                      {hasAddress ? (
                        <li className="flex items-start gap-2.5">
                          <MapPin width={16} height={16} className="mt-0.5 shrink-0" />
                          <span>
                            {siteConfig.address.street}
                            <br />
                            {siteConfig.address.postalCode} {siteConfig.address.city}
                            {siteConfig.address.mapsUrl ? (
                              <>
                                <br />
                                <a
                                  href={siteConfig.address.mapsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="link-underline text-ink"
                                >
                                  Bekijk de route
                                </a>
                              </>
                            ) : null}
                          </span>
                        </li>
                      ) : null}
                      {siteConfig.openingHours.length > 0 ? (
                        <li className="flex items-start gap-2.5">
                          <Clock width={16} height={16} className="mt-0.5 shrink-0" />
                          <span>
                            {siteConfig.openingHours.map((spec) => (
                              <span key={spec.label} className="block">
                                {spec.label} {spec.opens}–{spec.closes}
                              </span>
                            ))}
                          </span>
                        </li>
                      ) : (
                        <li>Bezoek uitsluitend op afspraak.</li>
                      )}
                    </ul>
                  </address>
                ) : (
                  <p className="border-l-2 border-gold bg-cream/60 px-5 py-4 text-sm text-muted">
                    Gebruik het formulier hiernaast; we reageren zo snel mogelijk per e-mail.
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <h2 className="display-sm">Stuur een bericht</h2>
              <div className="mt-10">
                <ContactForm defaultSubject={onderwerp} />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CtaBanner
        location="contactpagina"
        title={"Liever meteen\nlangskomen?"}
        body="Plan een pasafspraak en bekijk de collectie in het echt."
      />

      <StructuredData schema={[breadcrumbSchema(breadcrumbs), localBusinessSchema()]} />
    </>
  );
}
