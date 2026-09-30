import type { JewelleryItem } from "@/lib/types";

/**
 * Alles wat Dalas naast de jurk aanbiedt: sieradensets, tiara's, boeketten,
 * capes en bolero's en een waaier. Ze staan samen op /sieraden. De korte jurk
 * hoort bij de collectie en staat daarom in `dresses.ts`.
 *
 * De namen zijn door ons gekozen; de aanlevering bevatte alleen foto's. Alle
 * beschrijvingen zijn gebaseerd op wat zichtbaar is op de productfoto's in
 * `_source/sieraden/<slug>/`. Prijzen zijn niet aangeleverd en staan daarom
 * overal op "op aanvraag".
 *
 * Het aantal `imageAlts`-regels moet gelijk zijn aan het aantal foto's dat
 * `npm run images` voor die slug genereert.
 */
export const jewellery: JewelleryItem[] = [
  {
    id: "jewel-perla",
    slug: "perla",
    name: "Perla",
    tagline: "Parels en kristal in een Y-vormig collier",
    description:
      "Een warme set waarin ronde parels zijn gevat in kransjes van kristal. Het collier loopt uit in een Y-vorm die de halslijn verlengt.",
    type: "set",
    material: "Kristal en parels",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Perla van Dalas met parels en kristal, collier, oorbellen en armband"],
    order: 1,
    featured: true,
  },
  {
    id: "jewel-laurier",
    slug: "laurier",
    name: "Laurier",
    tagline: "Bladmotief van marquise-kristallen",
    description:
      "De kristallen liggen als laurierblaadjes over elkaar, in het collier én in de langwerpige oorbellen. Ingetogen en toch vol licht.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Laurier van Dalas met bladvormig kristalmotief"],
    order: 2,
    featured: true,
  },
  {
    id: "jewel-fleur",
    slug: "fleur",
    name: "Fleur",
    tagline: "Bloemmotief met hanger",
    description:
      "Kristallen bloemen rijgen zich aaneen tot een collier dat uitkomt in een bloemhanger. De oorbellen herhalen datzelfde motief in het klein.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Fleur van Dalas met kristallen bloemmotief en hanger"],
    order: 3,
    featured: true,
  },
  {
    id: "jewel-adora",
    slug: "adora",
    name: "Adora",
    tagline: "V-vormig collier met lange oorhangers",
    description:
      "Een collier dat in een zachte V samenkomt, met marquise-geslepen kristallen die naar het midden toe groter worden. De oorbellen hangen lang en smal.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Adora van Dalas, V-vormig collier met lange kristallen oorhangers"],
    order: 4,
  },
  {
    id: "jewel-verona",
    slug: "verona",
    name: "Verona",
    tagline: "Fijn bladwerk dat samenkomt in een punt",
    description:
      "Fijne kristallen blaadjes lopen langs de hele halslijn en komen in het midden samen tot een punt. Licht van gewicht, groot van effect.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Verona van Dalas met fijn kristallen bladwerk"],
    order: 5,
  },
  {
    id: "jewel-solitaire",
    slug: "solitaire",
    name: "Solitaire",
    tagline: "Strakke rij kristallen met druppelhanger",
    description:
      "Een egale rij kristallen met daaraan een grote druppelhanger, bezet met kleine steentjes. Bij deze set hoort ook een ring.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband", "Ring"],
    imageAlts: ["Bruidssieradenset Solitaire van Dalas met druppelhanger, oorbellen, armband en ring"],
    order: 6,
  },
  {
    id: "jewel-cascade",
    slug: "cascade",
    name: "Cascade",
    tagline: "Statement collier met druppelfranje",
    description:
      "Het rijkste stuk van de collectie: een breed collier waar kristallen druppels als franje onderuit vallen. Voor wie de sieraden het woord wil laten doen.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Statement bruidscollier Cascade van Dalas met kristallen druppelfranje"],
    order: 7,
    featured: true,
  },
  {
    id: "jewel-aurora",
    slug: "aurora",
    name: "Aurora",
    tagline: "Waaiervormige kristalclusters",
    description:
      "Clusters van kristal openen zich als kleine waaiers langs de halslijn, met een grotere waaier in het midden. De armband herhaalt het motief.",
    type: "set",
    material: "Kristal",
    pieces: ["Collier", "Oorbellen", "Armband"],
    imageAlts: ["Bruidssieradenset Aurora van Dalas met waaiervormige kristalclusters"],
    order: 8,
  },
  {
    id: "jewel-imperia",
    slug: "imperia",
    name: "Imperia",
    tagline: "Brede tiara met baguette- en marquise-kristallen",
    description:
      "Een brede, laag oplopende tiara waarin rechthoekige en puntige slijpvormen elkaar afwisselen. Draagt makkelijk onder een sluier.",
    type: "tiara",
    material: "Kristal",
    pieces: ["Tiara"],
    imageAlts: ["Bruidstiara Imperia van Dalas, breed model met baguette- en marquise-kristallen"],
    order: 9,
    featured: true,
  },
  {
    id: "jewel-lumiere",
    slug: "lumiere",
    name: "Lumière",
    tagline: "Hoge tiara met takvormige kristallen",
    description:
      "Kristallen takken groeien omhoog uit een smalle band. De hoogste tiara van de collectie, voor wie een uitgesproken silhouet wil.",
    type: "tiara",
    material: "Kristal",
    pieces: ["Tiara"],
    imageAlts: ["Bruidstiara Lumière van Dalas, hoog model met takvormige kristallen"],
    order: 10,
  },
  {
    id: "jewel-couronne",
    slug: "couronne",
    name: "Couronne",
    tagline: "Kroonmodel met peervormige kristallen",
    description:
      "Een tiara in kroonvorm, met peervormige kristallen die in punten omhoog wijzen en in het midden samenkomen rond één grote steen.",
    type: "tiara",
    material: "Kristal",
    pieces: ["Tiara"],
    imageAlts: ["Bruidstiara Couronne van Dalas in kroonvorm met peervormige kristallen"],
    order: 11,
  },
  {
    id: "jewel-celeste",
    slug: "celeste",
    name: "Céleste",
    tagline: "Fijne tiara met marquise-bladeren",
    description:
      "Een lager model waarin marquise-geslepen kristallen als blaadjes uitwaaieren. De meest ingetogen tiara, mooi bij een opgestoken kapsel.",
    type: "tiara",
    material: "Kristal",
    pieces: ["Tiara"],
    imageAlts: ["Bruidstiara Céleste van Dalas, fijn model met marquise-kristallen"],
    order: 12,
  },

  // --- Boeketten -------------------------------------------------------
  // Geen `material`: op de foto is niet met zekerheid te zien of de bloemen
  // zijde, papier of vers zijn, en dat verzinnen we liever niet.
  {
    id: "jewel-cristal",
    slug: "cristal",
    name: "Cristal",
    tagline: "Ivoren rozen met kristaltakken",
    description:
      "Een rond boeket van ivoren rozen waartussen takjes met geslepen kristal en parels omhoog waaieren. De steel is omwikkeld met satijnlint en afgezet met een parelband.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Cristal van Dalas met ivoren rozen, kristaltakjes en een satijnen steel"],
    order: 13,
    featured: true,
  },
  {
    id: "jewel-rubis",
    slug: "rubis",
    name: "Rubis",
    tagline: "Rode en witte rozen met parelranken",
    description:
      "Diepe rode rozen rondom een hart van witte rozen, met zilverkleurige bladeren en losse parelranken die langs het boeket naar beneden vallen. De steel is volledig met parels bekleed.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Rubis van Dalas met rode en witte rozen en afhangende parelranken"],
    order: 14,
  },
  {
    id: "jewel-corail",
    slug: "corail",
    name: "Corail",
    tagline: "Orchideeën in crème en perzik",
    description:
      "Grote crèmekleurige orchideeën met perzikkleurige harten, aangevuld met slanke pluimen in koraal. Kristallen op draad en parelranken maken het geheel lichter.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Corail van Dalas met crème orchideeën, perzikkleurige pluimen en parelranken"],
    order: 15,
  },
  {
    id: "jewel-soleil",
    slug: "soleil",
    name: "Soleil",
    tagline: "Gele calla's met parelfranje",
    description:
      "Zachtgele calla's rond een kern van witte rozen en knoppen. Onder het boeket hangt een franje van parelsnoeren met kristallen aan de uiteinden.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Soleil van Dalas met gele calla's, witte rozen en een franje van parelsnoeren"],
    order: 16,
  },
  {
    id: "jewel-plume",
    slug: "plume",
    name: "Plume",
    tagline: "Crème tulpen met veren handvat",
    description:
      "Strak gebundelde crème tulpen met kristal in het hart, opgevangen in een krans van parels en kristal. Het handvat is omwikkeld met parelsnoeren en eindigt in witte veren.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Plume van Dalas met crème tulpen, parels en een handvat van witte veren"],
    order: 17,
  },
  {
    id: "jewel-lys",
    slug: "lys",
    name: "Lys",
    tagline: "Witte calla's in een strakke bundel",
    description:
      "Alleen witte calla's, met hun gekrulde punten naar buiten. Geen kristal of parels; de steel is met natuurlijk touw omwikkeld. Het strakste boeket van de reeks.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Lys van Dalas met witte calla's en een met touw omwikkelde steel"],
    order: 18,
  },
  {
    id: "jewel-jardin",
    slug: "jardin",
    name: "Jardin",
    tagline: "Witte tulpen met gipskruid",
    description:
      "Een bol van witte tulpen op een krans van gipskruid en groen blad. Landelijker dan de andere boeketten, met de stelen zichtbaar onder een lint.",
    type: "boeket",
    pieces: ["Boeket"],
    imageAlts: ["Bruidsboeket Jardin van Dalas met witte tulpen, gipskruid en groen blad"],
    order: 19,
  },

  // --- Capes en bolero's ------------------------------------------------
  {
    id: "jewel-neige",
    slug: "neige",
    name: "Neige",
    tagline: "Lange satijnen cape met capuchon",
    description:
      "Een wijd uitlopende cape van glanzend satijn, met een capuchon die is afgezet met kant en parels. Dezelfde afwerking loopt door over de hele voorrand. Sluit met een lint op borsthoogte.",
    type: "cape",
    material: "Satijn met kant en parels",
    pieces: ["Cape"],
    imageAlts: ["Satijnen bruidscape Neige van Dalas met capuchon en een rand van kant en parels"],
    order: 20,
    featured: true,
  },
  {
    id: "jewel-nuage",
    slug: "nuage",
    name: "Nuage",
    tagline: "Satijnen bolero met capuchon",
    description:
      "Een kort jasje op heuphoogte met lange mouwen en een ruime capuchon. Over de sluiting en langs de capuchon loopt een band van bloemkant met parels. Bedekt de schouders zonder de jurk te verbergen.",
    type: "cape",
    material: "Satijn met kant en parels",
    pieces: ["Bolero"],
    imageAlts: ["Satijnen bruidsbolero Nuage van Dalas met capuchon en bloemkant met parels"],
    order: 21,
  },

  // --- Overig -----------------------------------------------------------
  {
    id: "jewel-zephyr",
    slug: "zephyr",
    name: "Zéphyr",
    tagline: "Verenwaaier met opengewerkt montuur",
    description:
      "Een handwaaier van witte veren op een ivoorkleurig montuur waarin maantjes en sterretjes zijn uitgesneden. Aan de onderkant zit een gouden ring om hem aan te dragen.",
    type: "waaier",
    pieces: ["Waaier"],
    imageAlts: ["Bruidswaaier Zéphyr van Dalas met witte veren en een opengewerkt ivoorkleurig montuur"],
    order: 22,
  },
];
