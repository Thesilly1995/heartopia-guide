# Remote content (rainbow/meteor-locaties, dagelijkse plots, event-override, weer)

## Waarom

Rainbow-boeketten, meteorenregen-ertsplekken, de dagelijkse Zwervende
Eik-plot, de dagelijkse Fluoriet-plot, het huidige event, en het
spelweer (wisselt elke 6 uur) wisselen regelmatig. Die data zit niet
vast in de app — hij wordt bij het opstarten opgehaald van één
JSON-bestand op een URL die jij kiest. Zo kan die content bijgewerkt
worden zonder nieuwe appversie/Play Store-review.

Zolang er geen URL is ingesteld (of het ophalen mislukt, bv. geen
internet), valt de app terug op de vast-gebakken standaardwaarden —
de app blijft dus altijd bruikbaar.

## Hosting instellen

1. Zet een JSON-bestand (zie schema hieronder) ergens publiek
   toegankelijk neer — bijvoorbeeld:
   - Een **raw GitHub-link** naar een JSON-bestand in een (eventueel
     apart, publiek) repo: `https://raw.githubusercontent.com/<owner>/<repo>/main/heartopia-content.json`
   - Een **GitHub Gist** (raw-link van een los bestand)
   - Elke andere plek die een geldige `Content-Type: application/json`
     (of tenminste geldige JSON-body) teruggeeft op een GET-request,
     zonder authenticatie.
2. Vul die URL in bij `REMOTE_CONTENT_URL` in
   `src/constants/remote.ts`.
3. Klaar — de app haalt de content automatisch op bij het opstarten
   van elk scherm dat ervan afhangt, cachet hem lokaal (AsyncStorage),
   en ververst op de achtergrond bij een volgende sessie.

Bijwerken van de content zelf (nieuwe rainbow-locaties opzoeken,
nieuw event invullen) gebeurt daarna gewoon door het JSON-bestand op
die plek te overschrijven — dat kan in een chat-sessie met Claude,
of handmatig.

## JSON-schema

Alle velden zijn optioneel — laat een sectie weg (of `null`) als die
nog niet bekend is; de app valt dan terug op de bundel-standaard voor
dat specifieke onderdeel.

```json
{
  "updatedAt": "2026-08-10T12:00:00Z",
  "rainbowSpots": [
    { "num": 1, "x": 58, "y": 28, "descriptionNl": "Onsen Berg, oostkant", "descriptionEn": "Onsen Mountain, east side" }
  ],
  "meteorSpots": [
    { "num": 1, "x": 34, "y": 19, "descriptionNl": "Noordwestelijk woestijngebied", "descriptionEn": "Northwest desert area" }
  ],
  "dailyPlots": {
    "oakPlotNl": "Plot 7",
    "oakPlotEn": "Plot 7",
    "fluoritePlotNl": "Plot 2",
    "fluoritePlotEn": "Plot 2"
  },
  "event": {
    "nameNl": "Call of Whales",
    "nameEn": "Call of Whales",
    "datesNl": "11 juli – 22 augustus 2026",
    "datesEn": "Jul 11 – Aug 22, 2026",
    "fish": [
      { "nameNl": "Sint-Jakobsschelp", "nameEn": "Scallop", "spotNl": "Walviszee", "spotEn": "Whale Sea", "noteNl": null, "noteEn": null, "emoji": "🐟" }
    ],
    "birds": [
      { "nameNl": "Witvleugelstern", "nameEn": "White Winged Tern", "spotNl": "Bloemenveld", "spotEn": "Flower Field", "noteNl": null, "noteEn": null, "emoji": "🐦" }
    ],
    "recipes": [
      { "nameNl": "IJskoud Oceaandrankje", "nameEn": "Ocean Iced Drink", "ingredientsNl": ["2x Spirulina Poeder", "2x Sterfruit"], "ingredientsEn": ["2x Spirulina Powder", "2x Starfruit"], "emoji": "🍽️" }
    ]
  },
  "weather": {
    "kind": "rainbow",
    "labelNl": "Regenboog",
    "labelEn": "Rainbow",
    "validUntil": "2026-08-10T17:00:00Z"
  },
  "specialWeather": [
    { "kind": "meteor", "labelNl": "Meteorenregen", "labelEn": "Meteor Shower", "startsAt": "2026-08-12T13:00:00Z" },
    { "kind": "rainbow", "labelNl": "Regenboog", "labelEn": "Rainbow", "startsAt": "2026-08-13T06:00:00Z" }
  ]
}
```

### Velduitleg

- **`rainbowSpots` / `meteorSpots`**: lijst van pinnetjes op de
  eilandkaart. `x`/`y` zijn percentages (0-100) t.o.v. de kaartafbeelding
  (`assets/images/maps/island-map.jpg`), zelfde systeem als de
  bestaande Bubbels-kaart. Laat de array leeg (`[]`) of weg als de
  gebeurtenis niet actief is.
- **`dailyPlots`**: de plot-naam zoals die in-game getoond wordt (bv.
  `"Plot 7"`). Vaak identiek in NL/EN omdat het plot-nummers zijn.
- **`event`**: een volledige override van het "Huidig Event"-scherm.
  Als dit veld ontbreekt, blijft de bestaande gebundelde Call of
  Whales-content (zoals nu al in de app zit) getoond worden — dit
  veld hoeft dus pas ingevuld te worden zodra het volgende event
  begint.
- **`weather`**: het spelweer van dit moment. `kind` is `"sunny"`,
  `"rain"` of `"rainbow"` (bepaalt het icoontje); `labelNl`/`labelEn`
  zijn de weergegeven teksten (`"Zonnig"`/`"Sunny"`,
  `"Regen"`/`"Rainy"`, `"Regenboog"`/`"Rainbow"`). `validUntil` is het
  einde van het huidige 6-uursblok **in UTC**, bv. als het blok om
  19:00 Nederlandse tijd eindigt in de zomer (UTC+2), zet je
  `"...T17:00:00Z"`. Zodra dit tijdstip verstreken is, toont de app
  het weer als "kan verouderd zijn" i.p.v. het gewoon te blijven
  claimen — er is geen officiële API om dit automatisch te bepalen,
  dus dit veld moet elke keer dat het blok wisselt (07:00, 13:00,
  19:00, 01:00 servertijd) opnieuw gezet worden, bv. door het in een
  chat-sessie te vragen na te kijken.
- **`specialWeather`**: de vooraf aangekondigde bijzondere
  weersomstandigheden voor de komende week, zoals te zien in het
  in-game weekvoorspelling-telefoontje. `kind` is `"rain"`,
  `"rainbow"`, `"warm_sun"` (warme zon) of `"meteor"`.
  **Normaal/standaard weer wordt hier bewust niet in opgenomen** — de
  app toont dit als losse "Bijzonder weer deze week"-lijst op het
  homescreen, en laat items automatisch verdwijnen zodra hun blok
  (~6 uur vanaf `startsAt`) voorbij is. `startsAt` is het beginmoment
  van dat blok, in UTC.

## Waar dit in de code zit

- `src/constants/remote.ts` — de URL-configuratie.
- `src/lib/remote-content.ts` — het gedeelde fetch/cache-mechanisme
  (`useRemoteContent()`) en de TypeScript-types voor het schema
  hierboven.
- `src/data/rainbow-spots.ts`, `src/data/meteor-spots.ts`,
  `src/data/daily-plots.ts`, `src/data/current-weather.ts`,
  `src/data/special-weather.ts` — combineren de remote data met een
  bundel-fallback en de huidige taal.
- `src/data/event-meta.ts` — naam/data van het huidige event, gedeeld
  tussen het homescreen-kaartje en `src/app/events.tsx`.
- `src/app/events.tsx` — combineert `payload.event` met de gebundelde
  `useEventFish()`/`useEventBirds()`/`useEventRecipes()`-hooks.
- `src/app/(tabs)/index.tsx` — toont bovenaan het homescreen: weer,
  huidig event, Rainbow/Meteorenregen-status, en de dagelijkse plots.
