# Remote content (rainbow/meteor-locaties, dagelijkse plots, event-override, weer, gift codes)

## Waarom

Rainbow-boeketten, meteorenregen-ertsplekken, de dagelijkse Zwervende
Eik-plot, de dagelijkse Fluoriet-plot, het huidige event, het
spelweer (wisselt elke 6 uur), en de actieve gift codes wisselen
regelmatig. Die data zit niet vast in de app — hij wordt bij het
opstarten opgehaald van één JSON-bestand op een URL die jij kiest. Zo
kan die content bijgewerkt worden zonder nieuwe appversie/Play
Store-review.

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
    { "num": 1, "x": 58, "y": 28, "underwater": false, "descriptionNl": "Onsen Berg, oostkant", "descriptionEn": "Onsen Mountain, east side" },
    { "num": 3, "x": 66, "y": 71, "underwater": true, "descriptionNl": "Whalefall Canyon, onderaan het cluster", "descriptionEn": "Whalefall Canyon, bottom of the cluster" }
  ],
  "meteorSpots": [
    { "num": 1, "x": 34, "y": 19, "descriptionNl": "Noordwestelijk woestijngebied", "descriptionEn": "Northwest desert area" }
  ],
  "bubbleWeek": {
    "weekLabelNl": "Deze week (8-14 aug 2026)",
    "weekLabelEn": "This week (Aug 8-14, 2026)",
    "spots": [
      { "num": 1, "x": 31, "y": 10, "underwater": false, "descriptionNl": "Hoofdeiland, noordpunt", "descriptionEn": "Main island, north tip" },
      { "num": 16, "x": 66, "y": 71, "underwater": true, "descriptionNl": "Whalefall Canyon, onderaan het cluster", "descriptionEn": "Whalefall Canyon, bottom of the cluster" }
    ]
  },
  "dailyPlotsCalendar": [
    { "date": "2026-08-09", "oakPlotNl": "Plot 6", "oakPlotEn": "Plot 6", "fluoritePlotNl": "Plot 11", "fluoritePlotEn": "Plot 11" },
    { "date": "2026-08-10", "oakPlotNl": "🌲 Bos", "oakPlotEn": "🌲 Forest", "fluoritePlotNl": "Plot 7", "fluoritePlotEn": "Plot 7" },
    { "date": "2026-08-29", "oakPlotNl": "Plot 12", "oakPlotEn": "Plot 12", "fluoritePlotNl": "🏛️ Ruïne", "fluoritePlotEn": "🏛️ Ruins" }
  ],
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
  "weekForecast": [
    { "date": "2026-08-07", "kinds": ["rain"] },
    { "date": "2026-08-08", "kinds": ["warm_sun"] },
    { "date": "2026-08-09", "kinds": ["normal"] },
    { "date": "2026-08-12", "kinds": ["heatwave", "meteor"] }
  ],
  "codes": [
    { "code": "aughatogift", "rewardNl": "50x Maanlicht Kristal, 5x Kleurrijk Fontein Vuurwerk (Roze), 3x Regenboog Fokpoeder", "rewardEn": "50x Moonlight Crystal, 5x Colorful Fountain Firework (Pink), 3x Rainbow Breeding Powder", "expiresNl": "31 aug 2026", "expiresEn": "Aug 31, 2026" }
  ]
}
```

### Velduitleg

- **`rainbowSpots` / `meteorSpots`**: lijst van pinnetjes op de
  eilandkaart. `x`/`y` zijn percentages (0-100) t.o.v. de kaartafbeelding
  (`assets/images/maps/island-map.jpg`), zelfde systeem als de
  bestaande Bubbels-kaart. Laat de array leeg (`[]`) of weg als de
  gebeurtenis niet actief is. `rainbowSpots` ondersteunt ook
  `underwater: true` voor de 4 vaste boeketplekken in Whalefall Canyon
  (`whalefall-map.jpg`) — die blijven permanent staan, los van of het
  Rainbow-event actief is (van de 4 kan een speler er maar 1
  daadwerkelijk pakken, verschilt per speler). `meteorSpots` heeft
  geen `underwater`-ondersteuning.
- **`bubbleWeek`**: de 19 roze-bubbels-locaties van deze week (15 op de
  hoofdeiland-kaart `island-map.jpg`, 4 onderwater op de Whalefall
  Canyon-kaart `whalefall-map.jpg`, onderscheiden via `underwater`).
  Verspringt elke zaterdag 6:00 — `weekLabelNl`/`weekLabelEn` is de
  getoonde weekaanduiding (bv. `"Deze week (8-14 aug 2026)"`), `spots`
  gebruikt hetzelfde `num`/`x`/`y`-systeem als `rainbowSpots`/
  `meteorSpots`. Ontbreekt dit veld, dan valt de app terug op een
  gebundelde (verouderde) standaardlijst.
- **`dailyPlotsCalendar`**: één entry per kalenderdag (`date` als
  `"YYYY-MM-DD"`) met de Zwervende Eik-plot en Fluoriet-plot van die
  dag — meestal `"Plot <nummer>"` (vaak identiek in NL/EN omdat het
  plot-nummers zijn). Op dagen dat de eik/fluoriet niet op een plot
  staat (in-game-kalender toont dan een locatienaam i.p.v. een
  nummer): gebruik `"🌲 Bos"`/`"🌲 Forest"` voor de eik, `"🏛️ Ruïne"`/`"🏛️ Ruins"`
  voor de fluoriet. Werkt goed vooruit-ingevuld (bv. een hele maand in
  één keer uit een in-game-kalenderafbeelding) — de app zoekt zelf de
  entry voor vandaag op, dagen buiten bereik tonen gewoon "onbekend".
  Het oudere `dailyPlots`-veld (één vaste waarde, geen datum) wordt nog
  ondersteund als terugval-formaat maar is achterhaald zodra deze
  kalender een entry voor vandaag heeft.
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
- **`weekForecast`**: de weekvoorspelling uit het in-game
  weekvoorspelling-telefoontje — één entry per kalenderdag (`date` als
  `"YYYY-MM-DD"`, de lokale speldatum, geen terugkerende weekdag).
  `kinds` is een **array** (meestal 1 element, maar een dag kan
  meerdere bijzonderheden tegelijk hebben, bv. hittegolf + meteorenregen
  op dezelfde dag — dan gewoon beide in de array zetten, de app toont
  dan beide iconen/teksten achter elkaar). Geldige waarden: `"normal"`
  (niks bijzonders), `"rain"`, `"rainbow"`, `"warm_sun"` (warme zon),
  `"meteor"` of `"heatwave"` (hittegolf). In tegenstelling tot
  `weather` hoef je hier geen `labelNl`/`labelEn` bij te zetten — de
  app kent per waarde een vaste NL/EN-tekst en icoon.
  **Neem bewust ook de dagen zonder bijzonderheden op** (`kinds:
  ["normal"]`) — de app toont dit als een echte weekweergave (vandaag
  t/m zondag) op het homescreen, niet alleen de uitschieters. Dagen
  vóór vandaag worden automatisch niet meer getoond; je hoeft ze dus
  niet te verwijderen zodra ze voorbij zijn.
- **`codes`**: de lijst met actieve redemption-codes op het
  Codes-scherm. Elke entry heeft een `code`, een beloning
  (`rewardNl`/`rewardEn`) en een vervaldatum (`expiresNl`/`expiresEn`,
  vrije tekst — bv. `"31 aug 2026"` of `"Onbekend, recent
  toegevoegd"` als de vervaldatum nog niet bekend is). Vervangt de
  hele lijst zodra dit veld aanwezig is — verlopen codes dus gewoon
  weglaten i.p.v. los markeren. Ontbreekt dit veld, dan valt de app
  terug op de gebundelde (per definitie verouderde) standaardlijst.

## Waar dit in de code zit

- `src/constants/remote.ts` — de URL-configuratie.
- `src/lib/remote-content.ts` — het gedeelde fetch/cache-mechanisme
  (`useRemoteContent()`) en de TypeScript-types voor het schema
  hierboven.
- `src/data/rainbow-spots.ts`, `src/data/meteor-spots.ts`,
  `src/data/daily-plots.ts`, `src/data/current-weather.ts`,
  `src/data/week-forecast.ts`, `src/data/codes.ts` — combineren de
  remote data met een bundel-fallback en de huidige taal.
- `src/data/event-meta.ts` — naam/data van het huidige event, gedeeld
  tussen het homescreen-kaartje en `src/app/events.tsx`.
- `src/app/events.tsx` — combineert `payload.event` met de gebundelde
  `useEventFish()`/`useEventBirds()`/`useEventRecipes()`-hooks.
- `src/app/(tabs)/index.tsx` — toont bovenaan het homescreen: weer,
  weekvoorspelling, huidig event, Rainbow/Meteorenregen-status, en de
  dagelijkse plots.
