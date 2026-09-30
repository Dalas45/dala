import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DressDetails } from "@/components/dress/DressDetails";
import { DressGallery } from "@/components/dress/DressGallery";
import { DressViewTracker } from "@/components/dress/DressViewTracker";
import { RelatedDresses } from "@/components/dress/RelatedDresses";
import { PriceRequestDialog } from "@/components/forms/PriceRequestDialog";
import { PriceRequestForm } from "@/components/forms/PriceRequestForm";
import { Unveil } from "@/components/motion/SplitText";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Section } from "@/components/ui/Section";
import { StructuredData } from "@/components/ui/StructuredData";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { dressSeoTitle, formatPrice, getAllDresses, getDressBySlug, getImageMeta, getMainImage } from "@/lib/dresses";
import { breadcrumbSchema, productSchema, type BreadcrumbItem } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

/** Alle jurkpagina's worden bij de build statisch gegenereerd. */
export function generateStaticParams() {
  return getAllDresses().map((dress) => ({ slug: dress.slug }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dress = getDressBySlug(slug);
  if (!dress) return { title: "Trouwjurk niet gevonden" };

  const image = getMainImage(dress);
  const meta = getImageMeta(image.src);

  return buildMetadata({
    title: dressSeoTitle(dress),
    description: dress.seo.description,
    path: `/jurken/${dress.slug}`,
    image: { src: image.src, alt: image.alt, width: meta.width, height: meta.height },
  });
}

export default async function DressPage({ params }: PageProps) {
  const { slug } = await params;
  const dress = getDressBySlug(slug);
  if (!dress) notFound();

  const price = formatPrice(dress);
  const index = getAllDresses().findIndex((d) => d.slug === dress.slug);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: "Home", href: "/" },
    { name: "Trouwjurken", href: "/jurken" },
    { name: dress.name, href: `/jurken/${dress.slug}` },
  ];

  return (
    <>
      <DressViewTracker slug={dress.slug} name={dress.name} />

      {/*
        Smalle donkere balk in plaats van een volledige PageHeader: op een
        productpagina moet de fotografie zo snel mogelijk in beeld komen.
      */}
      <section className="tone-noir grain pb-10 pt-28 sm:pb-12 sm:pt-36">
        <div className="container-x">
          <div className="rise" style={{ animationDelay: "0.05s" }}>
            <Breadcrumbs items={breadcrumbs} tone="noir" />
          </div>
          <div className="rise mt-8 flex flex-wrap items-end justify-between gap-6" style={{ animationDelay: "0.14s" }}>
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-champagne" aria-hidden="true" />
                <p className="label text-champagne">Trouwjurk</p>
              </div>
              <h1 className="display-lg mt-6 text-on-noir">{dress.name}</h1>
            </div>
            <p className="index-tag pb-2">
              <span className="text-champagne">{String(index + 1).padStart(2, "0")}</span> / {String(getAllDresses().length).padStart(2, "0")}
            </p>
          </div>
        </div>
      </section>

      <Section spacing="tight">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <DressGallery dress={dress} />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                {/*
                  De tagline is een kop en geen alinea. De h1 is de jurknaam,
                  en daar zoekt niemand op; deze regel benoemt wél wat voor
                  jurk het is ("Baljurk met diepe V-hals …"). Zo krijgt de
                  pagina een kop die aansluit op wat mensen intypen.
                */}
                <h2 className="lead">{dress.tagline}</h2>

                <div className="mt-10 flex items-end justify-between gap-6 border-y border-line py-6">
                  <div>
                    <p className="label text-muted">Huurprijs</p>
                    <p className="mt-2.5 font-display text-3xl text-ink">{price ?? "Op aanvraag"}</p>
                  </div>
                </div>
                {!price ? (
                  <p className="mt-4 text-sm leading-relaxed text-muted">
                    Vraag vrijblijvend de prijs op; je ontvangt zo snel mogelijk een persoonlijk antwoord.
                  </p>
                ) : null}

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <TrackedLink
                    href={`/afspraak?jurk=${dress.slug}`}
                    event="cta_click"
                    params={{ cta: "pasafspraak", location: "jurkpagina", dress_slug: dress.slug }}
                    data-cursor="Plannen"
                    className="group/cta relative inline-flex w-full items-center justify-center overflow-hidden whitespace-nowrap bg-ink px-8 py-4 font-sans text-[0.7rem] uppercase tracking-luxe text-ivory transition-colors duration-500 hover:text-noir sm:w-auto"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-bottom scale-y-0 bg-champagne transition-transform duration-[650ms] ease-[var(--ease-couture)] group-hover/cta:scale-y-100"
                    />
                    <span className="relative">Plan een pasafspraak</span>
                  </TrackedLink>
                  <PriceRequestDialog dressSlug={dress.slug} dressName={dress.name} />
                </div>

                <div className="mt-12 space-y-5">
                  {dress.description.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-[1.75] text-muted">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-14">
                  <DressDetails dress={dress} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Zonder JavaScript blijft de prijsaanvraag hier gewoon bruikbaar. */}
      <Section spacing="default" id="prijs-opvragen" tone="noir" aria-labelledby="prijs-opvragen-titel">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-champagne" aria-hidden="true" />
                <p className="label text-champagne">Vrijblijvend</p>
              </div>
              <Unveil as="h2" className="display-md mt-7">
                <span id="prijs-opvragen-titel">Prijs opvragen voor {dress.name}</span>
              </Unveil>
              <p className="lead mt-7 max-w-sm">
                Laat je gegevens achter en je hoort zo snel mogelijk wat het huren van deze jurk kost, inclusief de mogelijkheden voor
                jouw trouwdatum.
              </p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <PriceRequestForm dressSlug={dress.slug} dressName={dress.name} tone="noir" />
            </div>
          </div>
        </div>
      </Section>

      <RelatedDresses dress={dress} />

      <StructuredData schema={[productSchema(dress), breadcrumbSchema(breadcrumbs)]} />
    </>
  );
}
