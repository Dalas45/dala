import type { Metadata } from "next";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { Clock, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { getAllDresses, getDressBySlug } from "@/lib/dresses";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { hasAddress, phoneHref, siteConfig, whatsappHref } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Pasafspraak maken in Haarlem | Trouwjurk passen",
  description:
    "Plan een persoonlijke pasafspraak bij Dalas in Haarlem en pas de trouwjurk van je keuze in alle rust. Laat je gegevens achter, dan nemen wij contact op.",
  path: "/afspraak",
});

const breadcrumbs: BreadcrumbItem[] = [
  { name: "Home", href: "/" },
  { name: "Afspraak maken", href: "/afspraak" },
];

const practical = [
  { title: "Neem de tijd", body: "Reken op ongeveer een uur, zodat je meerdere jurken rustig kunt passen." },
  { title: "Kom niet alleen", body: "Neem iemand mee wiens mening je vertrouwt. Te veel meningen maken kiezen lastiger." },
  {
    title: "Denk aan je schoenen",
    body: "Schoenen met ongeveer de hoogte die je op je trouwdag draagt, helpen bij het beoordelen van de lengte.",
  },
];

/** `jurk` in de URL selecteert vooraf de juiste jurk in het formulier. */
type PageProps = { searchParams: Promise<{ jurk?: string }> };

export default async function AppointmentPage({ searchParams }: PageProps) {
  const { jurk } = await searchParams;
  const dresses = getAllDresses();
  const selected = jurk ? getDressBySlug(jurk) : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Persoonlijke pasafspraak"
        title="Plan een afspraak"
        breadcrumbs={breadcrumbs}
        intro={
          selected
            ? `Je wilt ${selected.name} bekijken. Laat je gegevens achter en we bevestigen je afspraak zo snel mogelijk.`
            : "Kom de collectie in het echt bekijken. Laat je gegevens achter en we nemen contact met je op om de afspraak te bevestigen."
        }
      />

      <Section spacing="tight">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <h2 className="label text-gold">Goed om te weten</h2>
                <dl className="mt-7 border-t border-line">
                  {practical.map((item, index) => (
                    <div key={item.title} className="flex gap-6 border-b border-line py-6">
                      <span className="font-sans text-[0.62rem] tabular-nums tracking-luxe text-gold" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <dt className="font-display text-xl text-ink">{item.title}</dt>
                        <dd className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</dd>
                      </div>
                    </div>
                  ))}
                </dl>

                {phoneHref || whatsappHref || hasAddress || siteConfig.openingHours.length > 0 ? (
                  <div className="mt-12">
                    <h2 className="label text-gold">Liever direct contact</h2>
                    <ul className="mt-6 space-y-3.5 text-sm text-muted">
                      {phoneHref ? (
                        <li>
                          <TrackedAnchor
                            href={phoneHref}
                            event="phone_click"
                            params={{ location: "afspraakpagina" }}
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
                            params={{ location: "afspraakpagina" }}
                            className="inline-flex items-center gap-2.5 transition-colors hover:text-ink"
                          >
                            <WhatsApp width={16} height={16} />
                            WhatsApp
                          </TrackedAnchor>
                        </li>
                      ) : null}
                      {hasAddress ? (
                        <li className="flex items-start gap-2.5">
                          <MapPin width={16} height={16} className="mt-0.5 shrink-0" />
                          <span>
                            {siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}
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
                      ) : null}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <AppointmentForm dresses={dresses.map((d) => ({ slug: d.slug, name: d.name }))} selectedSlug={selected?.slug} />
            </div>
          </div>
        </div>
      </Section>

      <StructuredData schema={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
