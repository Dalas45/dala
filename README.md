# Dalas — trouwjurken huren

Production-ready website voor Dalas, met een eigen SEO-pagina per trouwjurk, formulieren voor
prijsaanvragen en pasafspraken, en een volledig uitgewerkte meetstructuur voor Google Analytics
en Google Ads.

---

## Snel starten

```bash
npm install
cp .env.example .env.local     # vul minimaal NEXT_PUBLIC_SITE_URL in
npm run dev                    # http://localhost:3000
```

Overige commando's:

| Commando | Doet |
| --- | --- |
| `npm run build` | Productiebuild (genereert alle jurkpagina's statisch) |
| `npm start` | Draait de productiebuild lokaal |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript zonder build |
| `npm run images` | Verwerkt de originele foto's opnieuw (zie "Foto's") |

---

## Technologie

- **Next.js 16** met de App Router en Turbopack
- **React 19**, **TypeScript** in strict mode
- **Tailwind CSS v4** met design tokens in `src/app/globals.css`
- **Motion** voor scroll-animaties en overgangen
- **React Three Fiber / Three.js** voor de 3D-achtergrond in de hero
- **Zod** voor server-side formuliervalidatie
- **Resend** (via REST, geen extra dependency) voor het doorsturen van aanvragen

Server Components zijn de standaard. Alleen componenten die interactie nodig hebben
(header, galerij, filters, formulieren, 3D-scene) zijn client components.

---

## Design

De site is cinematografisch opgebouwd: **elke pagina opent in diep noir** en gaat daarna over
naar ivoor. Dat ritme geeft de fotografie een podium en onderscheidt Dalas van de lichte,
pastelkleurige bruidswebsites.

### Palet

| Rol | Token | Waarde |
| --- | --- | --- |
| Donkere basis | `noir` | `#0d0b0a` |
| Tekst op donker | `on-noir` / `on-noir-muted` | `#f7f4ee` / `#a69c90` |
| Lichte basis | `ivory` / `cream` | `#f7f4ee` / `#eee8dd` |
| Tekst op licht | `ink` / `muted` | `#14110f` / `#6e655c` |
| Accent op donker | `champagne` | `#d9be87` |
| Accent op licht | `gold` | `#7a6139` |

Beide accenten halen ruim WCAG AA, ook op de kleine gespatieerde labels.

### Typografie

**Bodoni Moda** voor display: een didone met extreem hoog contrast, de typografie van
modehuizen. Uitsluitend voor koppen; op kleine formaten is hij niet leesbaar. **Inter Tight**
draagt alle UI en lopende tekst.

De hero-kop schaalt mee met de viewport-**hoogte** zowel als de breedte
(`clamp(3rem, min(6vw, 10.5vh), 7.5rem)`). Zo blijft de primaire knop op een laptop met een
lage viewport boven de vouw, terwijl de kop op een groot scherm groots uitpakt.

### Toon per sectie

`<Section tone="light" | "cream" | "noir">` bepaalt achtergrond én tekstkleuren. De body is
noir, dus **elke sectie zet zijn achtergrond expliciet**; geef nooit een eigen `bg-`klasse mee
via `className`, anders schijnt de donkere basis erdoorheen.

---

## Pagina's

| URL | Inhoud |
| --- | --- |
| `/` | Homepage: hero, introductie, uitgelichte jurken, waarom Dalas, editorial, stappenplan, reviews, FAQ, slot-CTA |
| `/jurken` | Volledige collectie met filters op silhouet, kleur en mouwen |
| `/op-maat` | De dienst "jurk op maat": drie stappen en de doorlooptijd van circa vier weken |
| `/sieraden` | Sieraden, tiara's, boeketten, capes en meer, met filter op type en een vergrote weergave per stuk |
| `/jurken/[slug]` | Individuele jurk: galerij, details, prijsaanvraag, pasafspraak, gerelateerde jurken |
| `/over-ons` | Over Dalas, werkwijze en pasafspraak |
| `/afspraak` | Afspraakformulier; `?jurk=<slug>` selecteert de jurk vooraf |
| `/contact` | Contactformulier en gegevens |
| `/faq` | Alle veelgestelde vragen |
| `/privacy` | Privacyverklaring (juridisch laten controleren vóór livegang) |
| `/sitemap.xml`, `/robots.txt` | Automatisch gegenereerd |

Een onbekende jurk geeft een nette 404 met alternatieven uit de collectie.

---

## Jurkencollectie

Alle jurkdata staat los van de UI in **`src/data/dresses.ts`**. Eén generieke template
(`src/app/jurken/[slug]/page.tsx`) rendert elke jurk; er is niets per jurk hardcoded.

Het datamodel staat in `src/lib/types.ts`:

```
id · slug · name · tagline · description[] · features[]
silhouette · neckline · sleeves · color · material? · sizes? · price?
availability · imageAlts[] · featured? · order · seo · related?
```

**De bestandspaden van foto's staan hier niet in.** Die genereert het fotoscript, inclusief een
hash van de inhoud, in `dressImagePaths`. Je onderhoudt alleen de alt-teksten, in dezelfde
volgorde als de foto's in de bronmap. `getDressImages()` in `src/lib/dresses.ts` voegt beide
samen.

### Een jurk toevoegen of zijn foto's vervangen

1. Zet de foto's in `_source/nieuw/<slug>/`.
2. Draai `npm run images`. Het script drukt af hoeveel foto's elke jurk heeft.
3. Zorg dat `src/data/dresses.ts` voor die slug evenveel `imageAlts`-regels bevat.

De jurk verschijnt daarna automatisch op `/jurken`, in de footer, in de sitemap, bij de
gerelateerde jurken en in de keuzelijst van het afspraakformulier.

Wil je een andere foto als hoofdfoto? Zet de slug in `ORDER` bovenin het script, met de
bestandsnamen in de gewenste volgorde.

### Sieraden en accessoires

Dezelfde werkwijze, maar dan met `_source/sieraden/<slug>/` en `src/data/jewellery.ts`. Op
`/sieraden` staat alles wat naast de jurk wordt aangeboden. Elk item heeft een `type`, een lijst
`pieces` met de losse stukken en optioneel een `material`. De namen zijn door ons gekozen; de
aanlevering bevatte alleen foto's.

| `type` | Enkelvoud / meervoud in de UI |
| --- | --- |
| `set` | Set / Sieradensets |
| `tiara` | Tiara / Tiara's |
| `boeket` | Boeket / Boeketten |
| `cape` | Cape / Capes (ook de bolero) |
| `waaier` | Waaier / Waaiers |

Een nieuw type voeg je toe in `JewelleryType` (`src/lib/types.ts`); de compiler wijst je daarna
vanzelf naar de twee labelmappen en de filtervolgorde in `src/lib/jewellery.ts`.

`material` is **optioneel**: bij een boeket is van de foto niet af te lezen of de bloemen zijde,
papier of vers zijn, en dan laten we de regel liever weg dan iets aan te nemen. Staat er maar één
stuk in `pieces`, dan tonen de kaart en de vergrote weergave alleen het type — "Boeket · 1 stuk"
voegt niets toe.

Er is bewust **geen aparte pagina per stuk**: een boeket of tiara heeft te weinig eigen tekst om
een pagina te dragen, dus ruim twintig dunne pagina's zouden slechter scoren dan één sterke
categoriepagina. De vergrote weergave op `/sieraden` toont alle details, en de knop "Vraag de
prijs op" stuurt door naar het contactformulier met het onderwerp al ingevuld (`Boeket: Rubis`).

### Het logo

`public/logo.png` is de verkleinde versie (248 × 260, 65 KB) die de header en footer tonen; het
origineel op volle resolutie staat in `_source/logo/`. De favicons in `src/app/` zijn uit
hetzelfde beeld gegenereerd, op een noir vlak zodat het goud ook in een browsertab uitkomt.

### Ontbrekende gegevens

Prijs, maten en materiaal zijn nog niet aangeleverd en zijn daarom **niet ingevuld**. De UI toont
"Op aanvraag" en de `Product`-structured data laat het `offers`-veld weg. Zodra je `price` invult,
verschijnt het bedrag overal en wordt het automatisch aan de structured data toegevoegd.

Hetzelfde geldt voor `/op-maat`: daar staan bewust maar twee harde gegevens, namelijk dát Dalas op
maat maakt en dat het ongeveer vier weken duurt. Prijzen, het aantal pasmomenten, stofkeuzes en
annuleringsvoorwaarden komen er pas bij zodra je ze bevestigt; de tekst staat in
`src/app/op-maat/page.tsx` en in de bijbehorende FAQ-vraag in `src/data/faq.ts`.

---

## Foto's

Alles in `_source/` staat in `.gitignore` en wordt niet gedeployed:

| Map | Inhoud |
| --- | --- |
| `nieuw/<slug>/` | De huidige jurkfoto's; deze bepalen wat op de site staat |
| `sieraden/<slug>/` | De foto's van de sieraden en accessoires, één map per stuk |
| `logo/` | Het originele logobestand op volle resolutie |
| `_vorige-website-fotos/` | De eerder gebruikte foto's, bewaard maar niet meer in gebruik |
| `<Naam jurk>/` | De originele uitpak van de eerste ZIP-aanlevering |

`scripts/process-images.py` leest `_source/nieuw/`, corrigeert de EXIF-oriëntatie, leest HEIC in,
schaalt naar maximaal 1800 px en schrijft:

- `public/images/dresses/<slug>/trouwjurk-<slug>-dalas-NN-<hash>.webp` — WebP q82
- `public/images/og/dalas-trouwjurken.jpg` — Open Graph-afbeelding, 1200 × 630, **blijft JPEG**
- `src/data/images.generated.ts` — paden per jurk, plus afmetingen en blur-placeholder

De bronnen zijn WebP en geen JPEG. Dat scheelt ongeveer 38 % op schijf (9,8 → 6,1 MB) en het
scheelt een generatie kwaliteitsverlies, want de PNG's gaan nu in één stap naar WebP in plaats van
via JPEG. De Open Graph-afbeelding is de uitzondering: WhatsApp en iMessage tonen een WebP-preview
niet betrouwbaar.

Next.js Image serveert hieruit AVIF en WebP in responsive maten — de bezoeker krijgt dus nooit het
bronbestand zelf. Omdat breedte en hoogte vooraf bekend zijn, is de Cumulative Layout Shift 0.

De `<hash>` is de eerste acht tekens van de SHA-1 van de bestandsinhoud. **Dat is geen franje:**
afbeeldingen worden een jaar lang als `immutable` gecachet. Zonder die hash zou een vervangen foto
dezelfde URL houden, en bleven terugkerende bezoekers wekenlang de oude versie zien. Nu krijgt elke
gewijzigde foto vanzelf een nieuwe URL.

Vereisten voor het script: Python 3.10+ met `pip install pillow pillow-heif`.

**Alle foto's tonen de echte Dalas-jurken**, gefotografeerd op een paspop in een neutrale
boutique-setting.

---

## Formulieren

Drie formulieren, alle met Server Actions (`src/lib/actions.ts`) en server-side validatie via Zod
(`src/lib/validation.ts`):

- **Prijsaanvraag** — per jurk; de slug gaat mee in een verborgen veld
- **Pasafspraak** — met jurkkeuze; bewust géén datum- of dagdeelveld, want een afspraak gaat op
  aanvraag en wordt persoonlijk bevestigd. Een voorkeur voor een moment schrijft de bezoeker in het
  berichtveld
- **Contact** — algemene vragen

Elk formulier heeft een laad-, succes- en foutstatus, foutmeldingen per veld, en een
toestemmingsvinkje. Beveiliging tegen spam: een honeypot-veld, een minimale invultijd van drie
seconden en een limiet van vijf inzendingen per IP per tien minuten.

Aanvragen worden als e-mail verstuurd via Resend. **Zonder `RESEND_API_KEY` en `FORM_TO_EMAIL`
weigert het formulier in productie** en toont het een nette foutmelding, zodat er geen aanvragen
stil verloren gaan. In development wordt de aanvraag in de terminal gelogd.

---

## SEO

- Unieke title, meta description en canonical per pagina (`src/lib/seo.ts`)
- Open Graph en Twitter-kaarten met de juiste afbeelding per jurk
- Eén `<h1>` per pagina, semantische kopstructuur daaronder
- Zichtbare breadcrumbs plus bijbehorende `BreadcrumbList`
- Sitemap en robots.txt worden automatisch gegenereerd; nieuwe jurken verschijnen vanzelf
- Beschrijvende bestandsnamen en alt-teksten voor elke foto, zonder keyword stuffing
- Interne linkstructuur: homepage → collectie → jurk → gerelateerde jurken → afspraak

### Structured data (JSON-LD)

| Type | Waar |
| --- | --- |
| `Organization`, `WebSite` | Elke pagina |
| `ClothingStore` (LocalBusiness) | Alleen wanneer er een adres is ingesteld |
| `BreadcrumbList` | Collectie, jurk, en alle subpagina's |
| `Product` | Elke jurkpagina; `offers` alleen bij een bekende prijs |
| `ItemList` | Homepage en collectiepagina |
| `FAQPage` | Homepage en FAQ-pagina |
| `AggregateRating` | Alleen zodra er echte reviews zijn |

Structured data komt altijd overeen met zichtbare content. Ontbrekende gegevens worden weggelaten
in plaats van ingevuld.

---

## Analytics en Google Ads

`src/lib/analytics.ts` stuurt events naar de `dataLayer` (Google Tag Manager) en naar `gtag`
wanneer GA4 of Google Ads direct is ingesteld. Zonder configuratie laadt er geen enkel extern script.

| Event | Wanneer | Parameters |
| --- | --- | --- |
| `view_dress` | Jurkpagina geopend | `dress_slug`, `dress_name` |
| `cta_click` | Klik op een CTA | `cta`, `location`, `dress_slug?` |
| `gallery_open` | Foto vergroot | `dress_slug`, `image_index` |
| `filter_change` | Filter aangepast | `filter`, `value`, `active` |
| `price_request_submit` | Prijsaanvraag verstuurd | `dress_slug` |
| `appointment_request_submit` | Afspraakaanvraag verstuurd | `dress_slug?` |
| `contact_submit` | Contactformulier verstuurd | — |
| `phone_click` / `whatsapp_click` / `email_click` | Klik op contactlink | `location` |

Voor Google Ads: gebruik bij voorkeur GTM met deze events als trigger. Zonder GTM kun je de
conversielabels uit Google Ads in de `NEXT_PUBLIC_ADS_CONVERSION_*`-variabelen zetten; die worden
dan rechtstreeks via `gtag` afgevuurd.

---

## Performance

Gemeten op de productiebuild (homepage, desktop, zonder throttling):

| Meting | Waarde |
| --- | --- |
| Largest Contentful Paint | 468 ms |
| Cumulative Layout Shift | 0,00 |
| Lighthouse toegankelijkheid | 100 |
| Lighthouse best practices | 100 |
| Lighthouse SEO | 100 |

Belangrijkste keuzes:

- De hero-entree is een **CSS-animatie**, geen JavaScript. De hero hoeft niet op hydration te
  wachten; zonder die keuze lag de LCP op 1364 ms.
- Alle pagina's zijn statisch, behalve `/afspraak` (die leest de `?jurk=`-parameter).
- Fonts worden self-hosted via `next/font` met `display: swap`.
- Alle afbeeldingen hebben vaste afmetingen en een blur-placeholder.
- De 3D-scene laadt pas na `requestIdleCallback` en stopt met renderen zodra de hero uit beeld is.
- De eigen cursor schrijft zijn positie rechtstreeks naar het DOM-element in een
  `requestAnimationFrame`-lus, zonder React-state per frame.

---

## 3D en animaties

### De zijde in de hero

Twee planes op verschillende diepte met een eigen shader in
`src/components/three/SilkScene.tsx`: zijde die in het donker beweegt en alleen oplicht waar het
strijklicht hem raakt. Geen modellen, texturen of post-processing, dus de bundel blijft klein.
Op een muis-apparaat duwt de cursor het doek subtiel op.

`src/components/three/SilkBackdrop.tsx` bepaalt of de scene überhaupt laadt. De scene wordt
overgeslagen bij `prefers-reduced-motion`, zonder WebGL, bij minder dan vier CPU-cores en bij een
`save-data`-verbinding. In al die gevallen blijft de gradient eronder zichtbaar en verandert de
layout niet. Op smalle schermen staat de scene bewust zachter, omdat hij daar het hele beeld vult.

### Bewegingsrepertoire

| Component | Doet |
| --- | --- |
| `motion/SplitText` | Onthult een kop woord voor woord achter een masker |
| `motion/SplitText` → `Unveil` | Onthult een kop als één blok |
| `motion/Parallax` | Laat beelden langzamer bewegen dan de pagina |
| `motion/Marquee` | Doorlopende tekstband, pure CSS |
| `motion/Cursor` | Eigen cursor op desktop, met contextlabel per element |
| `motion/ScrollProgress` | Dunne voortgangslijn bovenaan |
| `sections/HorizontalCollection` | Horizontale collectierail met scroll-snap |

Twee constructiedetails die makkelijk misgaan:

- **De zichtbaarheidsdetectie zit op de wrapper, niet op de kop.** Een kop die onder zijn masker
  staat, wordt door de browser als onzichtbaar beschouwd; zat de detectie op de kop zelf, dan zou
  die zichzelf zo goed verbergen dat de animatie nooit start.
- **De hero animeert met CSS, niet met JavaScript.** Daardoor hoeft hij niet op hydration te
  wachten en valt de Largest Contentful Paint vroeg.

Alles respecteert `prefers-reduced-motion`. Zonder JavaScript maakt een `<noscript>`-stijl in de
layout alle verborgen beginstanden direct zichtbaar, zodat er nooit onzichtbare content overblijft.
De horizontale rail gebruikt native scroll-snap en blijft dus ook zonder JavaScript bruikbaar.

---

## Toegankelijkheid

- Volledige toetsenbordbediening; lightbox en dialoogvensters sluiten met Escape en geven de focus
  terug aan de knop die ze opende
- Zichtbare focus-states in de accentkleur
- Alle tekst haalt minimaal WCAG AA-contrast
- Formulierlabels, foutmeldingen met `role="alert"` en statusmeldingen met `role="status"`
- Semantische HTML, skip-link naar de inhoud, alt-tekst op elke foto

---

## Deployment op Vercel

1. Push de repository naar GitHub en importeer hem in Vercel. Het framework wordt automatisch
   herkend; build command en output hoeven niet te worden aangepast.
2. Zet de environment variables uit `.env.example` in Vercel (Production en Preview).
3. `NEXT_PUBLIC_SITE_URL` moet het definitieve domein zijn, zonder slash aan het einde. Deze waarde
   bepaalt de canonicals, de sitemap en de Open Graph-URL's.
4. Deploy. De 10 jurkpagina's worden tijdens de build statisch gegenereerd.

`.npmrc` bevat `legacy-peer-deps=true`. Dat is nodig omdat React Three Fiber optionele
Expo-peerdependencies declareert die npm anders als conflict ziet.

### Environment variables

| Variabele | Verplicht | Doel |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | ja | Canonicals, sitemap, Open Graph |
| `RESEND_API_KEY` | voor formulieren | API-key van resend.com |
| `FORM_TO_EMAIL` | voor formulieren | Adres waar aanvragen binnenkomen |
| `FORM_FROM_EMAIL` | aanbevolen | Afzender; geverifieerd domein in Resend |
| `NEXT_PUBLIC_PHONE` | nee | Telefoonnummer in header, footer en schema |
| `NEXT_PUBLIC_WHATSAPP` | nee | WhatsApp-nummer, internationaal, alleen cijfers |
| `NEXT_PUBLIC_EMAIL` | nee | E-mailadres |
| `NEXT_PUBLIC_ADDRESS_*` | nee | Adres voor Local SEO en LocalBusiness-schema |
| `NEXT_PUBLIC_MAPS_URL` | nee | Route-link |
| `NEXT_PUBLIC_OPENING_HOURS` | nee | Formaat: `ma-vr 10:00-18:00; za 10:00-17:00` |
| `NEXT_PUBLIC_INSTAGRAM_URL` e.a. | nee | Social links en `sameAs` |
| `NEXT_PUBLIC_GTM_ID` | nee | Google Tag Manager |
| `NEXT_PUBLIC_GA_ID` | nee | GA4, alleen zonder GTM |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | nee | Google Ads |
| `NEXT_PUBLIC_ADS_CONVERSION_*` | nee | Conversielabels, alleen zonder GTM |

Alles behalve `NEXT_PUBLIC_SITE_URL` is optioneel. Ontbrekende gegevens worden overal in de UI en
in de structured data weggelaten; er wordt nooit iets verzonnen.

---

## Wat nog ingevuld moet worden

Deze gegevens waren niet beschikbaar en zijn bewust niet ingevuld:

1. **Contactgegevens** — telefoon, WhatsApp, e-mail. Zonder deze gegevens verdwijnen de bel- en
   WhatsApp-knoppen; het contactformulier blijft werken.
2. **Adres en openingstijden** — nodig voor het `LocalBusiness`-schema en de lokale vindbaarheid.
   Zolang ze ontbreken, wordt dat schema helemaal niet uitgestuurd.
3. **Prijzen per jurk** — vul `price` in `src/data/dresses.ts`.
4. **Maten en materiaal** — vul `sizes` en `material` per jurk.
5. **Reviews** — `src/data/reviews.ts` is leeg. Er zijn bewust geen reviews verzonnen.
6. **Resend-account** — anders komen formulierinzendingen in productie niet aan.
7. **Privacyverklaring** — de tekst beschrijft wat de site technisch doet, maar moet juridisch
   worden gecontroleerd en aangevuld met bedrijfsgegevens en bewaartermijnen.

---

## Aanbevelingen voor de volgende fase

- **Professionele fotografie.** De huidige foto's zijn in de salon gemaakt en tonen op de achtergrond
  het bord "Hair Care Dalas". Een shoot tegen een neutrale achtergrond, met per jurk een voor-, zij-
  en achteraanzicht plus een detailshot, tilt de uitstraling aanzienlijk. Dit is de grootste
  verbetering die je kunt maken. Het design is hierop gebouwd: de donkere secties en de grote
  beeldvlakken komen pas volledig tot hun recht met editorial fotografie.
- **AI-fotografie.** Nu bewust niet ingezet: de aangeleverde beelden zijn te beperkt om dezelfde jurk
  betrouwbaar in een andere setting te reconstrueren zonder kant, mouwen of halslijn te veranderen.
  Met een goede shoot als referentie wordt dit wel realistisch.
- **Reviews verzamelen.** Koppel een Google Business Profile en vraag bruiden actief om een
  beoordeling. De reviewsectie en `AggregateRating` activeren zich automatisch.
- **Prijstransparantie.** Zichtbare vanafprijzen verlagen de drempel en verbeteren de kwaliteit van
  de aanvragen. De structuur ligt er al klaar.
- **Locatiepagina's.** Zodra de vestigingsplaats bekend is, zijn pagina's als
  `/trouwjurk-huren/<stad>` een logische uitbreiding voor lokale zoekopdrachten.
- **Beschikbaarheidskalender.** Het veld `availability` per jurk kan uitgroeien tot echte
  reserveringen per datum.
