import type { FaqItem } from "@/lib/types";

/**
 * Veelgestelde vragen.
 * De antwoorden zijn bewust procesgericht en bevatten geen verzonnen prijzen, termijnen of voorwaarden.
 * Vul concrete details (huurperiode, borg, vermaken) aan zodra de eigenaar deze heeft bevestigd.
 */
export const faqItems: FaqItem[] = [
  {
    question: "Hoe werkt het huren van een trouwjurk bij Dalas?",
    answer:
      "Je bekijkt de collectie online, kiest een of meer jurken die je aanspreken en plant een pasafspraak in de boutique. Tijdens de afspraak pas je de jurken en bespreken we samen de huurperiode, de prijs en eventuele aanpassingen.",
  },
  {
    question: "Wat kost het huren van een trouwjurk?",
    answer:
      "De huurprijs verschilt per jurk. Op elke jurkpagina kun je de prijs opvragen; je ontvangt dan snel een persoonlijk antwoord. Tijdens de pasafspraak bespreken we alles wat bij de prijs inbegrepen is.",
  },
  {
    question: "Maken jullie ook trouwjurken op maat?",
    answer:
      "Ja. Naast de collectie maken we trouwjurken op maat. Het maken duurt ongeveer vier weken, dus plan je afspraak ruim voor je trouwdatum. Tijdens die afspraak bespreken we je wensen, nemen we je maten en hoor je wat het kost.",
  },
  {
    question: "Kan ik een jurk eerst passen voordat ik beslis?",
    answer:
      "Ja. Passen is de belangrijkste stap. Plan een pasafspraak en geef aan welke jurk of jurken je wilt zien, dan zorgen wij dat ze voor je klaarhangen.",
  },
  {
    question: "Moet ik een afspraak maken om de collectie te bekijken?",
    answer:
      "We raden het sterk aan. Met een afspraak heb je onze volledige aandacht en is de jurk van je keuze beschikbaar. Je plant eenvoudig een afspraak via de website.",
  },
  {
    question: "In welke maten zijn de jurken beschikbaar?",
    answer:
      "De beschikbare maten verschillen per jurk. Vermeld je maat bij je aanvraag of afspraak, dan laten we je direct weten welke mogelijkheden er zijn.",
  },
  {
    question: "Wie mag ik meenemen naar de pasafspraak?",
    answer:
      "Neem gerust iemand mee wiens mening je vertrouwt. Laat het ons weten bij het plannen van je afspraak, zodat we hier rekening mee kunnen houden.",
  },
  {
    question: "Kan ik een jurk reserveren voor mijn trouwdatum?",
    answer:
      "Vermeld je trouwdatum bij je aanvraag. We controleren de beschikbaarheid van de jurk en bespreken tijdens de afspraak hoe je deze vastlegt.",
  },
];

/** Selectie voor de homepage. */
export const homeFaqItems = faqItems.slice(0, 4);
