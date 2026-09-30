import type { Dress } from "@/lib/types";

/**
 * De Dalas-collectie.
 *
 * - Elke jurk heeft een uniek `id`, `slug` en een eigen SEO-pagina op /jurken/[slug].
 * - Alle beschrijvingen, kenmerken en alt-teksten zijn gebaseerd op wat zichtbaar is
 *   op de officiele productfoto's in `_source/nieuw/<slug>/`.
 * - Prijs, maten en materiaal zijn nog niet aangeleverd en staan daarom op "op aanvraag".
 *   Vul `price`, `sizes` en `material` in zodra de gegevens bekend zijn; de UI past zich automatisch aan.
 * - Het aantal `imageAlts`-regels moet gelijk zijn aan het aantal fotos dat
 *   `npm run images` voor die slug genereert. Dat script drukt het aantal per jurk af.
 */
export const dresses: Dress[] = [
  {
    id: "dress-queen",
    slug: "queen",
    name: "Queen",
    tagline: "Baljurk met diepe V-hals en lange, met kralen bezette mouwen",
    description: [
      "Queen is een statement in elke zaal. De diepe V-hals loopt over in een verfijnde opstaande kraag, terwijl de lange, doorschijnende mouwen volledig met kralen zijn afgewerkt.",
      "Het rijk geborduurde lijfje gaat over in een volle rok van kant met een subtiele glinstering. Een jurk voor de bruid die groots en elegant tegelijk wil zijn.",
    ],
    features: [
      "Diepe V-hals met opstaande kraag",
      "Lange doorschijnende mouwen met kralen",
      "Rijk geborduurd lijfje",
      "Volle rok van kant met glinstering",
    ],
    silhouette: "baljurk",
    neckline: "Diepe V-hals met opstaande kraag",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 1,
    imageAlts: [
      "Trouwjurk Queen van Dalas, een witte baljurk met diepe V-hals, lange kralenmouwen en volle kanten rok",
    ],
    seo: {
      description:
        "Huur trouwjurk Queen bij Dalas: een witte baljurk met diepe V-hals, lange kralenmouwen en een volle kanten rok. Vraag de prijs op of plan een pasafspraak.",
    },
  },
  {
    id: "dress-princess",
    slug: "princess",
    name: "Princess",
    tagline: "Baljurk met bloemenschouders en glinsterende sleep",
    description: [
      "Princess opent met off-shoulder bandjes waarop stoffen bloemen zijn aangezet. Het korsetlijfje met fijne kralen loopt strak toe naar de taille.",
      "Daaronder valt een volle rok die het licht vangt in korte glinsterlijnen, met een brede sleep die zich achter je uitspreidt.",
    ],
    features: [
      "Off-shoulder bandjes met stoffen bloemen",
      "Korsetlijfje met fijne kralen",
      "Volle rok met glinsterende lijnen",
      "Brede sleep",
    ],
    silhouette: "baljurk",
    neckline: "Off-shoulder met bloemdetails",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 2,
    imageAlts: [
      "Trouwjurk Princess van Dalas, een witte baljurk met off-shoulder bloemenschouders, korsetlijfje en brede glinsterende sleep",
    ],
    seo: {
      description:
        "Huur trouwjurk Princess bij Dalas: een baljurk met off-shoulder bloemenschouders, korsetlijfje en een brede glinsterende sleep.",
    },
  },
  {
    id: "dress-danteel",
    slug: "danteel",
    name: "Danteel",
    tagline: "Romantische kanten baljurk met off-shoulder mouwen en korsetlijfje",
    description: [
      "Danteel is volledig opgebouwd uit kant. Het off-shoulder lijfje met sweetheart-halslijn heeft een zichtbare korsetstructuur en lange, nauwsluitende kanten mouwen.",
      "De rok valt breed en licht, met een fijne glinstering die pas opvalt wanneer het licht erop valt. Tijdloos, romantisch en verfijnd.",
    ],
    features: [
      "Off-shoulder met sweetheart-halslijn",
      "Lange kanten mouwen",
      "Korsetlijfje met zichtbare baleinen",
      "Volle rok van kant met subtiele glinstering",
    ],
    silhouette: "baljurk",
    neckline: "Off-shoulder sweetheart",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 3,
    imageAlts: [
      "Kanten trouwjurk Danteel van Dalas, een baljurk met off-shoulder mouwen, korsetlijfje en volle glinsterende rok",
    ],
    seo: {
      description:
        "Huur trouwjurk Danteel bij Dalas: een romantische kanten baljurk met off-shoulder mouwen, sweetheart-halslijn en korsetlijfje. Plan een pasafspraak.",
    },
  },
  {
    id: "dress-lang-op-lichaam",
    slug: "lang-op-lichaam",
    name: "Lang op Lichaam",
    tagline: "Getailleerde kanten jurk met off-shoulder mouwtjes en lange sleep",
    description: [
      "Lang op Lichaam volgt de lijn van het lichaam en eindigt in een brede, transparante kanten sleep. Het korsetlijfje met zichtbare baleinen is afgewerkt met korte, gerimpelde off-shoulder mouwtjes.",
      "De jurk is van boven tot onder bekleed met kant en fijne kralen, waardoor hij elegant blijft zonder zwaar te worden.",
    ],
    features: [
      "Getailleerd silhouet",
      "Off-shoulder met korte gerimpelde mouwtjes",
      "Korsetlijfje met baleinen",
      "Brede kanten sleep",
    ],
    silhouette: "getailleerd",
    neckline: "Off-shoulder",
    sleeves: "kort",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 4,
    imageAlts: [
      "Getailleerde kanten trouwjurk Lang op Lichaam van Dalas met off-shoulder mouwtjes en brede kanten sleep",
    ],
    seo: {
      description:
        "Huur trouwjurk Lang op Lichaam bij Dalas: een getailleerde kanten jurk met off-shoulder mouwtjes, korsetlijfje en brede sleep. Vraag de prijs op.",
    },
  },
  {
    id: "dress-op-lichaam",
    slug: "op-lichaam",
    name: "Op Lichaam",
    tagline: "Nauwsluitende jurk met lange mouwen en dicht kralenborduursel",
    description: [
      "Op Lichaam is een nauwsluitende jurk met lange mouwen, van boven tot onder afgewerkt met kralen en kant. De hoge, met kralen bezette kraag maakt het silhouet compleet.",
      "Een jurk voor wie houdt van bedekt, verfijnd en toch opvallend door het detail.",
    ],
    features: [
      "Getailleerd silhouet",
      "Hoge kraag met kralen",
      "Lange doorschijnende mouwen",
      "Dicht kralen- en kantborduursel",
    ],
    silhouette: "getailleerd",
    neckline: "Hoge hals",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    order: 5,
    imageAlts: [
      "Nauwsluitende trouwjurk Op Lichaam van Dalas met hoge kraag, lange mouwen en dicht kralenborduursel",
    ],
    seo: {
      description:
        "Huur trouwjurk Op Lichaam bij Dalas: een nauwsluitende jurk met lange mouwen en fijn kralenborduursel. Plan een pasafspraak in de boutique.",
    },
  },
  {
    id: "dress-wit-2-in-1",
    slug: "wit-2-in-1",
    name: "Wit 2-in-1",
    tagline: "Twee looks in één: baljurk met afneembare overrok of getailleerde jurk",
    description: [
      "Wit 2-in-1 geeft je twee jurken in één dag. Met de afneembare overrok is het een volle baljurk; zonder overrok blijft een getailleerde jurk over die de lijn van het lichaam volgt.",
      "Het lijfje heeft een illusie-halslijn en lange pofmouwen, bezet met kralen in een golvend patroon dat doorloopt over de hele jurk.",
    ],
    features: [
      "Afneembare overrok (2-in-1)",
      "Illusie-halslijn",
      "Lange pofmouwen met kralen",
      "Golvend kralenpatroon over de hele jurk",
    ],
    silhouette: "getailleerd",
    neckline: "Illusie-halslijn",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 6,
    imageAlts: [
      "Trouwjurk Wit 2-in-1 van Dalas als volle baljurk, met overrok en lange pofmouwen",
      "Trouwjurk Wit 2-in-1 van Dalas zonder overrok, als getailleerde jurk met pofmouwen",
    ],
    seo: {
      // De automatische titel maakt hier "getailleerde jurk" van, want dat is
      // het silhouet zónder overrok. Deze jurk is juist allebei, dus de titel
      // staat handmatig.
      title: "Trouwjurk Wit 2-in-1 huren — baljurk of getailleerd | Dalas",
      description:
        "Huur trouwjurk Wit 2-in-1 bij Dalas: baljurk met afneembare overrok, illusie-halslijn en lange pofmouwen met kralen. Twee looks in één.",
    },
  },
  {
    id: "dress-sultan",
    slug: "sultan",
    name: "Sultan",
    tagline: "Glinsterende baljurk met bijpassende lange cape",
    description: [
      "Sultan is een strapless baljurk in een glinsterende stof met een diepe V-inkeping in de halslijn. De rok valt breed en vangt het licht in fijne lijnen.",
      "Bij de jurk hoort een lange cape met hoge kraag, die je tijdens de ceremonie kunt dragen en later kunt afdoen.",
    ],
    features: [
      "Strapless met diepe V-inkeping",
      "Glinsterende stof",
      "Bijpassende lange cape met hoge kraag",
      "Volle rok",
    ],
    silhouette: "baljurk",
    neckline: "Strapless met V-inkeping",
    sleeves: "mouwloos",
    color: "wit",
    availability: "op-aanvraag",
    featured: true,
    order: 7,
    imageAlts: [
      "Trouwjurk Sultan van Dalas, een strapless glinsterende baljurk met diepe V-inkeping",
      "Trouwjurk Sultan van Dalas gedragen met de bijpassende lange cape met hoge kraag",
    ],
    seo: {
      description:
        "Huur trouwjurk Sultan bij Dalas: een glinsterende strapless baljurk met bijpassende lange cape. Vraag de prijs op of plan een bezichtiging.",
    },
  },
  {
    id: "dress-barbi-roze",
    slug: "barbi-roze",
    name: "Barbi Roze",
    tagline: "Roze prinsessenjurk met kristallen lijfje en geborduurde rok",
    description: [
      "Barbi Roze is de jurk voor wie durft te kiezen voor kleur. Het lijfje aan fijne bandjes is volledig bezet met kristallen, en de wijde rok is bekleed met geborduurd kant en kralen.",
      "Een echte prinsessenjurk, in een zachte roze tint die op foto's prachtig uitkomt.",
    ],
    features: [
      "Lijfje volledig bezet met kristallen",
      "Fijne schouderbandjes",
      "Wijde rok met geborduurd kant",
      "Zachte roze tint",
    ],
    silhouette: "baljurk",
    neckline: "Rechte halslijn met fijne bandjes",
    sleeves: "mouwloos",
    color: "roze",
    availability: "op-aanvraag",
    featured: true,
    order: 8,
    imageAlts: [
      "Roze trouwjurk Barbi Roze van Dalas, een baljurk met kristallen lijfje en geborduurde rok",
    ],
    seo: {
      description:
        "Huur de roze prinsessenjurk Barbi Roze bij Dalas: kristallen lijfje en wijde rok met geborduurd kant. Plan een pasafspraak.",
    },
  },
  {
    id: "dress-barbi-wit",
    slug: "barbi-wit",
    name: "Barbi Wit",
    tagline: "Volledig bezette prinsessenjurk met sweetheart-halslijn",
    description: [
      "Barbi Wit is van boven tot onder bezet met kralen en pailletten op kant. Het strapless lijfje heeft een sweetheart-halslijn en loopt uit in een volle, glinsterende rok.",
      "Een jurk die in beweging het mooist is.",
    ],
    features: [
      "Strapless sweetheart-halslijn",
      "Volledig bezet met kralen en pailletten",
      "Volle rok van kant",
    ],
    silhouette: "baljurk",
    neckline: "Strapless sweetheart",
    sleeves: "mouwloos",
    color: "wit",
    availability: "op-aanvraag",
    order: 9,
    imageAlts: [
      "Witte trouwjurk Barbi Wit van Dalas, een prinsessenjurk met sweetheart-halslijn, volledig bezet met kralen",
    ],
    seo: {
      description:
        "Huur trouwjurk Barbi Wit bij Dalas: een strapless prinsessenjurk met sweetheart-halslijn, volledig bezet met kralen en pailletten.",
    },
  },
  {
    id: "dress-ster",
    slug: "ster",
    name: "Ster",
    tagline: "Baljurk met sterrenborduursel en doorschijnende cape-panelen",
    description: [
      "Ster dankt haar naam aan het borduursel: over de hele rok zijn stervormige pailletten en kralen aangebracht. Het strapless lijfje heeft een sweetheart-halslijn met diepe V-inkeping.",
      "Aan de schouders hangen lange, doorschijnende cape-panelen die de jurk een dramatische, lichte beweging geven.",
    ],
    features: [
      "Strapless sweetheart met V-inkeping",
      "Stervormig pailletten- en kralenborduursel",
      "Doorschijnende cape-panelen aan de schouders",
      "Volle rok",
    ],
    silhouette: "baljurk",
    neckline: "Strapless sweetheart met V-inkeping",
    sleeves: "mouwloos",
    color: "wit",
    availability: "op-aanvraag",
    order: 10,
    imageAlts: [
      "Trouwjurk Ster van Dalas, een witte baljurk met sterrenborduursel en doorschijnende cape-panelen",
    ],
    seo: {
      description:
        "Huur trouwjurk Ster bij Dalas: een baljurk met stervormig pailletten-borduursel, sweetheart-halslijn en doorschijnende cape-panelen.",
    },
  },
  {
    id: "dress-banan",
    slug: "banan",
    name: "Banan",
    tagline: "Satijnen A-lijn met kristallen lijfje en franjemouwtjes",
    description: [
      "Banan combineert een licht, satijnen A-lijn silhouet met een lijfje vol kristallen en kralenfranje. De korte, losvallende mouwtjes laten de schouders vrij.",
      "Een jurk die met je meebeweegt, met een brede satijnen sleep.",
    ],
    features: [
      "A-lijn silhouet van satijn",
      "Lijfje met kristallen en kralenfranje",
      "Korte franjemouwtjes, schouders vrij",
      "Brede satijnen sleep",
    ],
    silhouette: "a-lijn",
    neckline: "Rechte halslijn, off-shoulder",
    sleeves: "kort",
    color: "ivoor",
    availability: "op-aanvraag",
    order: 11,
    imageAlts: [
      "Satijnen A-lijn trouwjurk Banan van Dalas met kristallen lijfje en off-shoulder franjemouwtjes",
    ],
    seo: {
      description:
        "Huur trouwjurk Banan bij Dalas: een satijnen A-lijn jurk met kristallen lijfje en franjemouwtjes. Vraag de prijs op of plan een pasafspraak.",
    },
  },
  {
    id: "dress-strik",
    slug: "strik",
    name: "Strik",
    tagline: "Baljurk met een grote strik in de taille",
    description: [
      "Strik heeft een korsetlijfje van kant met fijne kralen, gedragen op korte off-shoulder mouwtjes die in laagjes vallen.",
      "In de taille ligt een brede strik van hetzelfde kant, die overgaat in een volle rok. De sleep loopt rondom door en spreidt zich in een cirkel achter je uit.",
    ],
    features: [
      "Off-shoulder mouwtjes in laagjes",
      "Korsetlijfje van kant met kralen",
      "Brede strik in de taille",
      "Volle rok met ronde sleep",
    ],
    silhouette: "baljurk",
    neckline: "Off-shoulder, recht afgewerkt",
    sleeves: "kort",
    color: "ivoor",
    availability: "op-aanvraag",
    order: 12,
    imageAlts: [
      "Ivoren trouwjurk Strik van Dalas, een baljurk met off-shoulder mouwtjes, kanten korsetlijfje en een brede strik in de taille",
      "Achterzijde van trouwjurk Strik van Dalas met de strik op de rug en een ronde kanten sleep",
    ],
    seo: {
      description:
        "Huur trouwjurk Strik bij Dalas: een kanten baljurk met off-shoulder mouwtjes, korsetlijfje en een brede strik in de taille.",
    },
  },
  {
    id: "dress-etincelle",
    slug: "etincelle",
    name: "Étincelle",
    tagline: "Korte jurk met een lijfje vol kralen",
    description: [
      "Étincelle heeft een brede, ronde halslijn die over de schouders valt. Het lijfje is helemaal bezet met kralen en kristal, in lijnen die naar beneden uitwaaieren.",
      "Daaronder zit een korte rok van tule in laagjes, bezaaid met losse steentjes. Een jurk voor het feest na de ceremonie, of voor een bruiloft waarop je wilt kunnen bewegen.",
    ],
    features: [
      "Korte lengte, tot boven de knie",
      "Lijfje volledig bezet met kralen en kristal",
      "Brede ronde halslijn over de schouders",
      "Korte tulerok in laagjes met losse steentjes",
    ],
    silhouette: "kort",
    neckline: "Brede ronde halslijn",
    sleeves: "mouwloos",
    color: "ivoor",
    availability: "op-aanvraag",
    order: 13,
    imageAlts: [
      "Korte ivoren trouwjurk Étincelle van Dalas met een lijfje vol kralen en kristal en een korte tulerok",
    ],
    seo: {
      description:
        "Huur de korte trouwjurk Étincelle bij Dalas: een kralenlijfje met kristal en een korte tulerok. Vraag de prijs op of plan een pasafspraak.",
    },
  },
  {
    id: "dress-op-lichaam-kant",
    slug: "op-lichaam-kant",
    name: "Op Lichaam Kant",
    tagline: "Nauwsluitende kanten jurk met off-shoulder mouwen",
    description: [
      "Op Lichaam Kant volgt het lichaam van schouder tot knie en loopt daaronder uit in een sleep. De jurk is helemaal van kant, met een geschulpte rand langs de zoom en rond de sleep.",
      "De halslijn valt off-shoulder, met dunne bandjes over de schouders en een diepe inkeping in het midden. De lange mouwen zijn van hetzelfde kant en eindigen in een geschulpte manchet.",
    ],
    features: [
      "Nauwsluitend silhouet met sleep",
      "Geheel van kant, met geschulpte randen",
      "Off-shoulder met dunne schouderbandjes",
      "Lange kanten mouwen",
    ],
    silhouette: "getailleerd",
    neckline: "Off-shoulder met bandjes en diepe inkeping",
    sleeves: "lang",
    color: "wit",
    availability: "op-aanvraag",
    order: 14,
    imageAlts: [
      "Kanten trouwjurk Op Lichaam Kant van Dalas, nauwsluitend met off-shoulder bandjes, lange kanten mouwen en een geschulpte sleep",
    ],
    seo: {
      description:
        "Huur trouwjurk Op Lichaam Kant bij Dalas: een nauwsluitende kanten jurk met off-shoulder bandjes, lange mouwen en een geschulpte sleep.",
    },
  },
];
