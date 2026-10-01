import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone, WhatsApp } from "@/components/ui/Icons";
import { TrackedAnchor } from "@/components/ui/TrackedLink";
import { getAllDresses } from "@/lib/dresses";
import { emailHref, hasAddress, navigation, phoneHref, siteConfig, whatsappDisplay, whatsappHref } from "@/lib/site";

/**
 * Footer in noir: de site sluit af zoals hij opent.
 * Bevat links naar elke jurk, wat de crawlbaarheid van de collectie borgt.
 * Ontbrekende gegevens worden weggelaten in plaats van ingevuld.
 */
export function Footer() {
  const dresses = getAllDresses();
  const year = new Date().getFullYear();
  const { street, postalCode, city, mapsUrl } = siteConfig.address;

  return (
    <footer className="tone-noir grain relative overflow-hidden">
      {/* Groot woordmerk als afsluitend beeldmerk. */}
      <div className="container-x pt-24 sm:pt-32">
        <p
          aria-hidden="true"
          className="select-none font-display text-[clamp(4rem,18vw,16rem)] leading-[0.8] tracking-[-0.04em] text-on-noir/[0.07]"
        >
          DALAS
        </p>
      </div>

      <div className="container-x pb-14 pt-16 sm:pb-16">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-on-noir-muted">
              Dalas verhuurt exclusieve trouwjurken in Haarlem. Persoonlijke begeleiding, een zorgvuldig samengestelde collectie en alle
              rust om jouw jurk te vinden.
            </p>

            {siteConfig.social.instagram || siteConfig.social.facebook ? (
              <div className="mt-9 flex items-center gap-5">
                {siteConfig.social.instagram ? (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dalas op Instagram"
                    className="text-on-noir-muted transition-colors hover:text-champagne"
                  >
                    <Instagram width={20} height={20} />
                  </a>
                ) : null}
                {siteConfig.social.facebook ? (
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dalas op Facebook"
                    className="text-on-noir-muted transition-colors hover:text-champagne"
                  >
                    <Facebook width={20} height={20} />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <nav aria-label="Trouwjurken" className="lg:col-span-4">
            <h2 className="label text-champagne">De collectie</h2>
            <ul className="mt-7 grid grid-cols-2 gap-x-6 gap-y-3">
              {dresses.map((dress, index) => (
                <li key={dress.slug}>
                  <Link
                    href={`/jurken/${dress.slug}`}
                    className="group/link flex items-baseline gap-2.5 text-sm text-on-noir-muted transition-colors hover:text-on-noir"
                  >
                    <span className="text-[0.6rem] tabular-nums opacity-50">{String(index + 1).padStart(2, "0")}</span>
                    <span className="link-underline">{dress.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/jurken" className="label mt-8 inline-block text-champagne transition-opacity hover:opacity-70">
              Alle trouwjurken →
            </Link>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="label text-champagne">Informatie</h2>
            <ul className="mt-7 space-y-3">
              {navigation.footer.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-sm text-on-noir-muted transition-colors hover:text-on-noir">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <address className="not-italic lg:col-span-2">
            <h2 className="label text-champagne">Contact</h2>
            <ul className="mt-7 space-y-4 text-sm text-on-noir-muted">
              {phoneHref ? (
                <li>
                  <TrackedAnchor
                    href={phoneHref}
                    event="phone_click"
                    params={{ location: "footer" }}
                    className="inline-flex items-center gap-2.5 transition-colors hover:text-on-noir"
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
                    params={{ location: "footer" }}
                    aria-label={`Stuur Dalas een WhatsApp-bericht op ${whatsappDisplay}`}
                    className="inline-flex items-center gap-2.5 whitespace-nowrap transition-colors hover:text-on-noir"
                  >
                    <WhatsApp width={16} height={16} />
                    {whatsappDisplay}
                  </TrackedAnchor>
                </li>
              ) : null}
              {emailHref ? (
                <li>
                  <TrackedAnchor
                    href={emailHref}
                    event="email_click"
                    params={{ location: "footer" }}
                    className="inline-flex items-center gap-2.5 break-all transition-colors hover:text-on-noir"
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
                    {mapsUrl ? (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-on-noir">
                        {street}
                        <br />
                        {postalCode} {city}
                      </a>
                    ) : (
                      <>
                        {street}
                        <br />
                        {postalCode} {city}
                      </>
                    )}
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
                <li>Bezoek op afspraak.</li>
              )}
            </ul>
          </address>
        </div>

        <div className="mt-16 border-t border-noir-line pt-8 text-[0.68rem] text-on-noir-muted">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {siteConfig.fullName}. Alle rechten voorbehouden.
            </p>
            <p className="tabular-nums">
              KVK {siteConfig.business.kvk} · BTW {siteConfig.business.vat}
            </p>
          </div>

          <div className="mt-7 flex flex-col gap-3 border-t border-noir-line/60 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="tracking-luxe">Trouwjurken huren in Haarlem · Bruidsjurken · Reinigen inbegrepen</p>
            <p>
              gemaakt met <span aria-hidden="true" className="text-champagne">♥</span>
              <span className="sr-only">liefde</span> door{" "}
              <a
                href={siteConfig.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-on-noir transition-colors hover:text-champagne"
              >
                {siteConfig.credit.name}
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
