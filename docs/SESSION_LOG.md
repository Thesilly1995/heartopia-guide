# Sessielog — Heartopia Gids

Doel van dit bestand: een nieuwe Claude-chat kan dit lezen om snel te snappen wat er al is gebouwd, welke keuzes zijn gemaakt, en wat er nog open staat. Voeg bij een volgende sessie een nieuwe sectie bovenaan toe (nieuwste eerst).

## 2026-08-06 — Engelse vertaling (NL/EN taalwissel) toegevoegd

**Uitgangspunt:** vorige sessie liet de EN-vertaling bewust achterwege voor snelheid; het session-bound prototype-bestand (met de echte `nameNl`/`nameEn`-paren) was niet meer bereikbaar. Gebruiker heeft `heartopiagidsprototype.jsx` opnieuw geüpload zodat de originele EN-content gebruikt kon worden i.p.v. machinevertaling te verzinnen.

### Wat is gebouwd

- **Taal-infrastructuur**: `src/hooks/use-language.tsx` — React Context + AsyncStorage-persistentie (`heartopia:language`), default `'nl'`. Provider zit in `src/app/_layout.tsx`, buiten de `ThemeProvider`.
- **Taalwissel-UI**: een NL/EN-pil rechtsboven in de header van het homescreen (`src/app/(tabs)/index.tsx`), tikt tussen talen en onthoudt de keuze.
- **Databestanden** (`src/data/*.ts`, 23 bestanden): elk bestand kreeg een `*_RAW`-array met `nameNl`/`nameEn`-paren (uit het prototype geëxtraheerd en per item gematcht op de Nederlandse naam — alle 23 arrays kwamen 1-op-1 overeen qua aantal items, geen ontbrekende matches) plus een `useXxx()`-hook die op basis van `useLanguage()` de juiste taal teruggeeft in dezelfde vorm als de oude `interface XxxItem`. Componenten die de data gebruikten zijn omgezet van `import { FISH } from '@/data/fish'` naar `const FISH = useFish()` binnen de component — de velden zelf (`item.name`, `item.spot`, etc.) bleven ongewijzigd, dus vrijwel geen JSX-herschrijven nodig in de renderlogica.
- **Losse EN-gaten in het prototype zelf aangevuld**: een klein aantal velden was in het prototype per ongeluk niet vertaald (`sizeEn` voor honden bleef "Klein"/"Middel"/"Groot", een paar `spotEn`-locatiebeschrijvingen bij Wilde Dieren en Event-vogels waren identiek aan het Nederlands). Deze zijn handmatig vertaald na een geautomatiseerde nl==en-vergelijking over alle bestanden.
- **Vaste interface-tekst**: elk scherm kreeg een lokaal `STRINGS = { nl: {...}, en: {...} }`-object (headers, filterlabels, disclaimers, placeholders, knoppen). `hobby-list-screen.tsx` (het gedeelde component voor Vissen/Insecten/Vogels/Koken/Tuinieren/Beeldhouwen) en `screen-header.tsx` (gedeelde terugknop, gebruikt door alle overige schermen) zijn ook vertaald — die dekken de meeste schermen in één keer.
- **Weer-filter fix**: de weer-filterchips (Zonnig/Regen/Regenboog) vergeleken voorheen tegen hardcoded Nederlandse strings terwijl de onderliggende data nu taalafhankelijk is. Filter-opties zijn nu `WEATHER_WORDS[language]`, en de filterkeuze reset automatisch bij het wisselen van taal (anders bleef een oude taal-string "hangen" zonder match).

### Bekende bewuste keuzes

- De "Explore"-tab (onaangeroerde Expo-scaffold, geen Heartopia-content) is niet vertaald — puur leftover boilerplate, niet gelinkt vanaf het homescreen.
- Op web (`expo start --web`) overlapt de losse "Expo Starter"-tabbalk (uit `app-tabs.web.tsx`, ongewijzigde scaffold) de bovenkant van het homescreen-scrollcontent. Dit bestond al voor deze sessie, maar blokkeerde nu ook de nieuwe taalwissel-knop — opgelost met een web-only `paddingTop` op de home-header (`Platform.OS === 'web' ? 56 : 20`), geen effect op native.
- Getest via `expo start --web` + Playwright-screenshots (NL→EN→NL round-trip, Vissen/Fishing incl. opengeklapte kaart, Badges, Dog & Cat Moments incl. Honden-tab, Tuinieren/Gardening subtabs) — geen console errors, alle gecontroleerde teksten correct vertaald.

### Open ideeën / mogelijk vervolg

- Rainbow/Meteor- en Bubbels-locaties zijn nog steeds tijdgebonden en leeg/actueel-per-week — ongewijzigd t.o.v. vorige sessie.
- Geen automated tests (unchanged).
- De prototype-bronbestand-upload is weer sessie-gebonden; als er ooit een derde vertaalronde nodig is (bijv. een nieuwe taal), moet het bestand opnieuw geüpload worden tenzij het los bewaard wordt.

### Repo-status

Alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-05/06 — Prototype omgezet naar werkende Expo-app

**Uitgangspunt:** een los React-prototype (`heartopiagidsprototype.jsx`, als bestand geüpload in de chat, ~800KB, bevat alle data + web-UI voor de hele gids) moest overgezet worden naar deze Expo/React Native-app (`heartopia-guide`).

### Wat is gebouwd

Alle 16 secties uit het prototype staan nu als losse routes in `src/app/`, gegroepeerd op het homescreen (`src/app/(tabs)/index.tsx`):

- **Hobby's**: Vissen, Koken, Tuinieren (gewassen+bloemen subtabs), Insecten, Vogels, Beeldhouwen (zand+sneeuw subtabs), Ocean Cleanup (schelpencatalogus)
- **Dieren**: Dog & Cat Moments, Wilde Dieren, Wilde Ingrediënten
- **Spel**: Huidig Event, Missies, Wekelijkse Bubbels (met kaart), Rainbow & Meteorenregen (met kaart), Badges (met echte spel-iconen), Codes
- **Overig**: To-do, Feedback (beide lokaal opgeslagen, geen backend)

Data komt uit het prototype-bestand, geëxtraheerd met kleine Node-scripts (JS-object-literals ge-`eval`'d en omgezet naar TypeScript in `src/data/*.ts`). Vissen/insecten/vogels/koken/tuinieren/beeldhouwen delen één generiek component: `src/components/heartopia/hobby-list-screen.tsx` (zoeken, level-filter, weer-filter, subtabs, uitklapbare kaarten, sterren-rating, mastery-vinkje — alles via AsyncStorage lokaal opgeslagen per sectie).

### Belangrijke technische keuzes

- **Routing-fix**: de originele `_layout.tsx` gebruikte `NativeTabs` (uit `expo-router/unstable-native-tabs`) als enige navigator. Routes die geen tab waren (Vissen, Koken, etc.) werden door de tab-router genegeerd — `Link href="/vissen"` deed dan niets. Fix: Home/Explore zitten nu in een `(tabs)` group met eigen `_layout.tsx`, en de root `_layout.tsx` is een `Stack` met alle secties als losse schermen (elk met eigen terugknop in de header).
- **Light/dark mode**: volgt automatisch de systeeminstelling (`useColorScheme()`), geen handmatige schakelaar. Kleuren zitten in `src/constants/heartopia-colors.ts` als `light`/`dark`-object; elk scherm/component gebruikt de hook `useHeartopiaColors()` en bouwt zijn `StyleSheet` dynamisch via een `makeStyles(colors)`-functie + `useMemo`. Gradient-headers blijven bewust hetzelfde in beide thema's.
- **Badge-afbeeldingen**: het prototype had 68 echte spel-iconen als base64 ingebakken (`BADGE_ICONS`). Die zijn uitgepakt naar losse jpg's in `assets/images/badges/` (528KB totaal) en gekoppeld via `src/constants/badge-icons.ts` (statische `require()`-mapping, nodig omdat Metro geen dynamische `require()`-paden ondersteunt). Badges zonder icoon (3 stuks) tonen het 🔒-emoji en staan gegroepeerd onderaan de "verborgen"-sectie.
- **Kaarten (Bubbels, Rainbow/Meteor)**: het prototype had ook een eilandkaart en een Whalefall Canyon-kaart als base64 (`BUBBLE_MAP_IMG`, `WHALEFALL_MAP_IMG`), uitgepakt naar `assets/images/maps/`. Herbruikbare component `src/components/heartopia/pin-map.tsx` toont pinnetjes op x/y-percentages bovenop de kaartafbeelding, met tap-to-toggle en een "niet actief"-overlay als de lijst leeg is (Rainbow/Meteor-locaties zijn nu leeg — die vult de game-community elke keer opnieuw in).
- **Alleen Nederlands**: bewuste keuze (gebruiker gaf aan snelheid > EN nu). De Engelse teksten staan al in het prototype, dus EN kan later alsnog toegevoegd worden zonder opnieuw data te hoeven zoeken.

### Bekende afwijkingen t.o.v. het prototype (bewuste vereenvoudigingen)

- Geen NL/EN-taalwissel (zie hierboven).
- Feedback-sectie is nu puur lokaal (op één toestel), i.p.v. "gedeeld met iedereen die de app opent" — er is geen backend in deze RN-app.
- Kleine pastelkleur-varianten (bv. verschillende iconachtergrondtinten per scherm) zijn samengevoegd tot één set thema-tokens (`surfaceSoft`, `iconBg`, `disclaimerBg/Border`, `chipBg`, `warningBg/Border/Text`) i.p.v. losse hex-codes — nodig voor de dark-mode-refactor, nauwelijks zichtbaar verschil.

### Waar is het prototype-bronbestand?

Het originele geüploade bestand stond in deze sessie op `/root/.claude/uploads/8bdde126-e68c-5456-868b-11d6e9b9576a/803b37f2-heartopiagidsprototype.jsx` — dat pad is sessie-gebonden en dus **niet meer bereikbaar in een nieuwe chat**. Als er later nog een sectie uit het prototype ontbreekt of moet worden nagekeken, moet de gebruiker het `.jsx`-bestand opnieuw uploaden.

### Open ideeën / mogelijk vervolg

- Engelse vertaling toevoegen (data heeft al NL/EN in het prototype, alleen UI_STRINGS + taalwissel-component ontbreken nog in deze app).
- Rainbow/Meteor- en Bubbels-locaties zijn tijdgebonden (wisselen wekelijks/per event) — de gebruiker kan in de chat vragen om actuele locaties op te zoeken en toe te voegen aan de data-bestanden.
- Geen automated tests; alles is handmatig getest via `expo start --web` + Playwright-screenshots tijdens de sessie.

### Repo-status

Alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide` (geen open branches, geen PR-workflow gebruikt — gebruiker werkt direct op main, zoals in eerdere sessies ook al gebeurde).
