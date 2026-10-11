# Google Ads — campagne Dalas

`import-google-ads-editor.csv` bevat de complete zoekcampagne. Account
`522-131-5029`. **Alles staat op Paused**: na importeren wordt er niets
uitgegeven tot je de campagne zelf aanzet.

## Importeren

Google Ads Editor → **Account** → **Importeren** → **Uit bestand** → kies de CSV
→ bekijk het voorbeeld → **Wijzigingen posten**.

## Wat erin zit

| Advertentiegroep | Bestemming | Zoekwoorden |
|---|---|---|
| Trouwjurk huren | `/jurken` | 11 |
| Bruidsjurk huren | `/jurken` | 9 |
| Bruidsmode Haarlem | `/` | 10 |
| Trouwjurk op maat | `/op-maat` | 8 |
| Pasafspraak | `/afspraak` | 5 |

43 zoekwoorden, alleen in woordgroep- en exacte overeenkomst. Geen brede
overeenkomst: die trekt bij dit budget te veel ongericht verkeer.

37 campagne-uitsluitingen. De belangrijkste groep is "passen voor de lol" —
`trouwjurken passen voor de lol` heeft 1000 zoekopdrachten per maand en
`bruidsjurken passen voor de lol` nog 590. Dat zijn geen bruiden. Verder
uitgesloten: kopen in plaats van huren, tweedehands, andere producten
(galajurk, carnaval, kostuum), doe-het-zelf, andere merken, en vacatures.

Vijf responsieve zoekadvertenties, elk met 12 koppen en 4 beschrijvingen.
Alle teksten zijn gecontroleerd op Google's limieten (30 tekens per kop,
90 per beschrijving).

## Wat je na het importeren zelf instelt

1. **Locatie.** Haarlem met een straal van ongeveer 30 km. Dat past niet
   betrouwbaar in een CSV, dus stel het in bij Instellingen → Locaties →
   *Radius invoeren*. Zet daar ook *Aanwezigheid: mensen in of regelmatig in
   je doellocaties* — anders betaal je voor zoekers in heel Nederland die
   toevallig naar Haarlem kijken.
2. **Budget controleren.** Er staat €15 per dag. Ik moest een getal kiezen;
   de zoekcijfers wijzen op ongeveer 50 cent tot 1 euro per klik, dus dat is
   ruwweg 450 tot 900 klikken per maand. Pas het aan als je iets anders wilt.
3. **Conversie koppelen.** De conversieactie "Leadformulier indienen"
   (`AW-18470230470/E8kQCIfzqpkdEMazpedE`) wordt al gemeld door de website op
   `/bedankt`. Zet bij die actie **Aantal: Eén**, anders telt iemand die de
   bedankpagina ververst dubbel.
4. **Pas na een week of twee** op *Conversies maximaliseren* overstappen.
   Nu is er nog geen conversiedata, en dan heeft slim bieden niets om op te
   sturen.

## Bewust niet opgenomen

**Grote maten.** Dit is het grootste gemiste zoekvolume: `trouwjurk grote
maat` 590 per maand, `trouwjurk plus size` 260, `bruidsjurken grote maten`
260, `plus size bruidsjurken` 110. Samen meer dan `trouwjurk huren` zelf.
Het staat er niet in omdat niet vastligt welke maten de collectie dekt, en
een advertentie mag niets beloven wat er niet is. Zodra dat duidelijk is, is
het een eigen advertentiegroep waard.

**Prijzen.** Nergens in de teksten, want ze staan ook niet op de site.

## Eerst dit, dan pas aanzetten

De formulieren worden in productie geweigerd zolang de SMTP-gegevens niet in
Vercel staan (`FORM_TO_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`,
`SMTP_PASSWORD`). Zet je de campagne eerder aan, dan betaal je voor klikken
die geen aanvraag kunnen worden, en meet Google Ads nul conversies om op te
leren.
