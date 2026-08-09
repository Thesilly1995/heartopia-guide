# Sessielog — Heartopia Gids

Doel van dit bestand: een nieuwe Claude-chat kan dit lezen om snel te snappen wat er al is gebouwd, welke keuzes zijn gemaakt, en wat er nog open staat. Voeg bij een volgende sessie een nieuwe sectie bovenaan toe (nieuwste eerst).

## 2026-08-09 (deel 27) — Kaart-coördinaten-tool gebouwd (precisie-probleem uit deel 26)

Gebruiker meldde dat er "veel bubbels verkeerd" stonden na de met-het-oog-geschatte coördinaten uit deel 26, en vroeg om een preciezer hulpmiddel. **Ontdekking**: de twee bubbel-screenshots van deel 26 bleken niet als bestand toegankelijk (`/root/.claude/uploads/<session-scratchpad-id>/` bevatte wel andere eerder-in-de-sessie geplakte afbeeldingen, maar niet die twee) — dus geen pixel-exacte hercontrole van deel 26 zelf mogelijk vanuit deze sessie.

**Oplossing**: `docs/coordinate-picker-tool.html` — losstaande, puur client-side tool (geen dependencies, geen netwerkverkeer): afbeelding uploaden/slepen/plakken (Ctrl+V), op elke pin klikken (percentage wordt berekend relatief aan het canvas-element, dus schermgrootte-onafhankelijk correct), optioneel per punt een omschrijving typen, en de resulterende array direct kopiëren in het `remote-content.json`-`spots`-formaat (`num`/`x`/`y`/`underwater`/`descriptionNl`/`descriptionEn`). Gebruiker kan dit voortaan zelf gebruiken (ook zonder de screenshot naar Claude te hoeven sturen) voor bubbels, regenboog- en meteorenregen-locaties. Getest met Playwright (afbeelding laden, meerdere punten klikken/verwijderen/omschrijving bewerken — JSON klopt in alle gevallen). Gepubliceerd als Artifact: https://claude.ai/code/artifact/bd5dc40e-cdf1-4f02-a0eb-f2b98cf7c228

### Nog open

- De bubbel-coördinaten uit deel 26 staan er nog steeds met de (mogelijk onnauwkeurige) met-het-oog-schatting in — gebruiker kan de nieuwe tool gebruiken om ze te herzien, of gewoon wachten tot de volgende zaterdag-refresh.
- Overige punten uit eerdere delen blijven staan (Play Store-publicatie hangt op Google Play Console-verificatie).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-09 (deel 26) — Bubbels-locaties naar remote-content verplaatst + zaterdag-routine

Gebruiker stuurde twee screenshots (Chinese community-kaart-app "心动小镇"/甜甜包) met de roze-bubbels-locaties voor 8-14 augustus: hoofdeiland-kaart (1-15) en Whalefall Canyon-kaart (16-19). Bubbels-locaties stonden tot nu toe volledig hardcoded in de app (één vaste, inmiddels verouderde snapshot) — de disclaimer zei letterlijk "vraag het in de chat", wat voor echte eindgebruikers zonder chat-toegang niet werkt. Zelfde soort upgrade als eerder bij rainbow/meteor-spots en de plot-kalender: nu ook via `remote-content.json` bijwerkbaar.

- `src/lib/remote-content.ts`: nieuw `RemoteBubbleSpot` (= `RemoteMapSpot` + `underwater`) en `RemoteBubbleWeek` (weekLabel NL/EN + spots-array), nieuw `bubbleWeek`-veld op de payload.
- `src/data/bubble-locations.ts`: `useBubbleLocations()` gebruikt `bubbleWeek.spots` als beschikbaar, anders terugval op de oude gebundelde standaardlijst (nooit een leeg scherm). Nieuwe `useBubbleWeekLabel()`-hook voor de "Deze week (...)"-tekst, die eerder hardcoded was.
- `src/app/bubbels.tsx`: disclaimer herschreven (geen "vraag het in de chat" meer — de kaart is nu gewoon actueel), weeklabel dynamisch.
- `remote-content.json`: `bubbleWeek` gevuld met de locaties van deze week. **Coördinaten met de hand overgenomen uit de screenshots (geen pixel-meettool beschikbaar)** — minder zeker dan de plot-kalender uit deel 22 omdat de bubbel-pins dit keer dicht op elkaar geclusterd stonden (vooral Whalefall Canyon 16-19); gebruiker gevraagd om te spot-checken.
- `docs/remote-content.md` bijgewerkt.

**Nieuwe routine**: `trig_011NBBTxtdw4JHnzTgWMdo5g` ("Heartopia bubbels — zaterdag screenshot"), elke zaterdag 8:00 UTC (bubbels verversen om 6:00 in-game) — vraagt gebruiker om de twee kaartscreenshots, zelfde bind-aan-deze-sessie-patroon als de HeartoCast-weer-routine (deel 12) en de codes-routine (deel 22).

### Nog open

- Gebruiker moet de bubbel-coördinaten van deze week nog spot-checken in de app.
- Rainbow/meteor-locaties: gebruiker stuurt een afbeelding zodra dat event actief is (nog niet ontvangen).
- Overige punten uit eerdere delen blijven staan (Play Store-publicatie hangt op Google Play Console-verificatie).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-09 (deel 25) — Play Store-publicatie in kaart gebracht, privacyverklaring geschreven en gepubliceerd

Gebruiker vroeg wat er nog moet gebeuren voor Play Store-publicatie. Overzicht gegeven: (1) Google Play Console-verificatie — nog in behandeling, geen nieuws; (2) echte AdMob-ID's — kan pas zodra Play Console klaar is en de app daar is aangemeld; (3) production-build (`eas build --profile production --platform android`) — uitgelegd, bewust nog niet gedaan omdat de AdMob-ID's toch weer een nieuwe build vereisen; (4) privacyverklaring — gebouwd (zie hieronder); (5) Data Safety-formulier en (6) store-listing — beide zitten in Play Console zelf, dus ook pas mogelijk zodra de verificatie rond is.

**Publisher-naam bevestigd**: gebruiker maakte een nieuw ontwikkelaarsaccount aan onder de naam **GamerDex** (`gamerdex0826@gmail.com`) — matcht de eerder geziene EAS-accountnaam "gamerdex" uit de build-logs. Dit e-mailadres is nu het officiële contactpunt in de privacyverklaring.

**Privacyverklaring**: `docs/privacy-policy.html` (NL+EN, gebaseerd op de app's eigen kleurenpalet uit `heartopia-colors.ts` voor herkenbaarheid) — beschrijft de daadwerkelijke gegevenspraktijken: Cloud Save (e-mail/wachtwoord via Supabase + spelvoortgang-back-up), Feedback (naam optioneel + tekst, zichtbaar voor alle gebruikers), AdMob-advertenties (advertentie-ID, alleen niet-Premium). Vermeldt expliciet dat het een onofficiële fan-app is. Gepubliceerd als Artifact voor een directe openbare link: https://claude.ai/code/artifact/f70c2a59-1ef4-441c-aab0-670257df2744 — bronbestand blijft ook in de repo staan. Visueel gecontroleerd in licht/donker thema via Playwright-screenshot.

### Nog open

- Alles hangt nu aan Google Play Console-verificatie — zodra die binnen is: AdMob koppelen, Data Safety-formulier, store-listing, en dan pas de "echte" production-build met echte AdMob-ID's.
- Rainbow/meteor-locaties: gebruiker stuurt een afbeelding zodra dat event actief is (nog niet ontvangen).
- Meteor-icoon-fix v2 (deel 23-24) nog te bevestigen of definitief goed staat (gebruiker zei dat het weekweer-kaartje klopt, dus vermoedelijk wel — niet expliciet nogmaals genoemd).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-09 (deel 24) — Weekweer + feedback bevestigd werkend, feedback-meldingsroutine toegevoegd

Gebruiker bevestigde: het weekweer-kaartje (incl. de meteor-icoon-fix v2) klopt nu helemaal, en het gedeelde Feedback-scherm werkt end-to-end (getest, test-rijtje weer verwijderd uit Supabase door gebruiker zelf).

**Nieuwe routine**: `trig_01UhVBLdV83EHVyMsfpAFCFK` ("Heartopia feedback-check"), elke 6 uur (`50 */6 * * *`, server-geankerd op aanmaakminuut), spawnt een verse sessie die de `feedback`-tabel bevraagt op rijen van de laatste ~7 uur via de Supabase REST API (curl, geen repo-checkout nodig). Leeg → stil afsluiten. Nieuwe feedback → eindbericht met aantal + naam/tekst per item, wat een pushmelding naar gebruiker triggert (notifications: push=true, email=false). Zelfde patroon als de Supabase-keep-alive-routine uit deel 13.

### Nog open

- Rainbow/meteor-locaties: gebruiker stuurt een afbeelding zodra dat event actief is (nog niet ontvangen).
- Overige punten uit eerdere delen blijven staan: echte AdMob-ID's invullen, Google Play Console-verificatie, store-listing, pushmeldingen-backend (voor de app zelf, niet te verwarren met deze ontwikkelaars-gerichte feedback-meldingsroutine).

### Repo-status

Geen codewijzigingen deze sectie — alleen een nieuwe Routine aangemaakt (geen repo-commit nodig).

## 2026-08-09 (deel 23) — Meteor-icoon-fix v2 (aparte Text-elementen), Feedback gekoppeld aan Supabase

**Meteor-icoon nog steeds onzichtbaar na de spatie-fix uit deel 22.** Gebruiker stuurde een screenshot: op woensdag werd wél ruimte gereserveerd voor een tweede icoon (de dagnaam-tekst stond verder naar rechts dan bij andere dagen), maar het icoon zelf verscheen niet — terwijl diezelfde ☄️-emoji op donderdag (alleen meteor, geen combinatie) prima rendert. Dat wijst op een glyph-shaping-eigenaardigheid specifiek bij meerdere emoji in dezelfde tekst-run op dit toestel, niet op een ontbrekend lettertype-glyph. Robuustere fix: `WeekForecastEntry.emoji` is nu `string[]` (één per conditie) i.p.v. samengevoegde string; elk icoon krijgt in `(tabs)/index.tsx` zijn eigen `<Text>`-element i.p.v. samen in één tekstnode — sluit cross-emoji-font-shaping-interferentie binnen één Text-run volledig uit als foutbron. **Nog niet opnieuw bevestigd door gebruiker** (vereist weer een nieuwe build of live-reload via de net opgezette development-build).

### Feedback-scherm gekoppeld aan Supabase

Gebruiker bevestigde: ja, feedback moet bij de ontwikkelaar terechtkomen — tot nu toe puur lokaal per toestel (AsyncStorage), nooit gezien door de ontwikkelaar.

- `docs/supabase-setup.md`: nieuwe SQL-sectie voor een `feedback`-tabel. Bewust **geen** per-gebruiker-RLS zoals `cloud_saves` — open insert+select via de anon key, geen login nodig (matcht het "gedeeld ideeënbord"-idee uit het originele prototype vóór de RN-conversie, lage drempel om feedback te geven). Kanttekening expliciet gedocumenteerd: de anon key is publiek, dus dit is geen spamfilter/moderatie, acceptabel risico voor een klein fan-project.
- `src/app/feedback.tsx`: AsyncStorage-opslag vervangen door Supabase select (laatste 50, nieuwste eerst)/insert. "Niet geconfigureerd"-fallback en foutmeldingen bij laad-/verzendfouten, zelfde patroon als `cloud-save.tsx`. Disclaimer-tekst aangepast van "alleen jij ziet dit" naar expliciet "gedeeld".
- Getest: query-vorm bevestigd correct tegen de live Supabase-instantie (tabel bestaat nog niet → nette `PGRST205`-fout via het los testscript, geen crash-pad in de code).
- **Gebruiker moet nog** de SQL uit `docs/supabase-setup.md` draaien in de Supabase SQL Editor voordat dit scherm echt werkt.

### Overige kleine dingen uit deel 22 afgehandeld

- Nieuwe routine: codes-check woensdag & zondag (`trig_01Bxi1rBTD1wiB5Tb4r3SkiQ`).
- Plot-kalender (deel 22) door gebruiker gecontroleerd en akkoord bevonden — geen correcties nodig.

### Nog open

- Bevestigen dat de meteor-icoon-fix v2 nu wél werkt (nieuwe build/reload nodig).
- Gebruiker moet de `feedback`-tabel-SQL nog draaien in Supabase.
- Rainbow/meteor-locaties: gebruiker stuurt een afbeelding zodra dat event actief is (nog niet ontvangen).
- Overige punten uit eerdere delen blijven staan: echte AdMob-ID's invullen, Google Play Console-verificatie, store-listing, pushmeldingen-backend.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-09 (deel 22) — Missies-resettijd gefixt, emoji-clipping-fix bevestigd, codes-check-routine, plot-kalender vooruit ingepland

**Missies-resettijden**: gebruiker gaf door dat het echte in-game schema "elke dag 7:00" (was 6:00 in de app) en wekelijkse reset "elke zaterdag 7:00" (was "elke maandag 6:00") is. Beide teksten in `src/app/missies.tsx` gecorrigeerd (NL+EN).

**Emoji-clipping-fix bevestigd**: de spatie-tussen-iconen-fix uit het vorige deel (hittegolf+meteorenregen op één dag) is door gebruiker bevestigd werkend op zijn development-build.

**Nieuwe routine: codes-check woensdag & zondag** (`trig_01Bxi1rBTD1wiB5Tb4r3SkiQ`, cron `0 8 * * 0,3`, bindt aan deze sessie zoals de weekweer-routine). Doorzoekt het web naar nieuwe Heartopia-redemption-codes, vergelijkt met `src/data/codes.ts`, werkt bij + commit/push als er iets nieuws is, blijft stil als niet.

**Feedback-scherm — belangrijke beperking bevestigd aan gebruiker**: het Feedback-scherm (`src/app/feedback.tsx`) slaat nog steeds puur lokaal op (AsyncStorage, per toestel) — er is geen backend aan gekoppeld, dus feedback die toekomstige gebruikers via de gepubliceerde app insturen, komt **niet** bij de gebruiker (developer) terecht. Dit was al zo sinds de prototype-conversie (deel 1), nu expliciet benoemd omdat de gebruiker ernaar vroeg. **Nog niet opgelost** — zou met de nu al bestaande Supabase-infrastructuur (cloud save) relatief eenvoudig alsnog gekoppeld kunnen worden aan een gedeelde tabel, maar is nog niet gebouwd; gebruiker moet aangeven of ze dit wil.

### Plot-kalender: eik/fluoriet-plots weken vooruit ingepland

Gebruiker stuurde een in-game-kalenderafbeelding (Japanse UI, "無垢な蛍石ツルツルオーク場所" = zuivere-fluoriet/gladde-oak-locaties) met per dag de eik- en fluoriet-plotnummers voor de rest van juli t/m 31 augustus 2026. Op dagen zonder plot toont de afbeelding een locatienaam i.p.v. een nummer: "松林" (dennenbos) onder de eik-kolom, "遺跡" (ruïne) onder de fluoriet-kolom.

- `src/lib/remote-content.ts`: nieuw veld `dailyPlotsCalendar` (array met datum + eik/fluoriet per dag) naast het oudere enkelvoudige `dailyPlots` (blijft als terugval bestaan).
- `src/data/daily-plots.ts`: `useDailyPlots()` zoekt eerst een kalender-entry voor vandaag, valt anders terug op `dailyPlots`, anders op `null` (ongewijzigd "onbekend, vraag het na"-gedrag).
- `remote-content.json`: kalender ingevuld van vandaag (9 augustus) t/m 31 augustus — 23 dagen. Geen-plot-dagen krijgen `"🌲 Bos"`/`"🌲 Forest"` (eik) of `"🏛️ Ruïne"`/`"🏛️ Ruins"` (fluoriet) i.p.v. een plotnummer, op verzoek van gebruiker (emoji + woord voor de zekerheid, na de emoji-clipping-ervaring van hierboven).
- `docs/remote-content.md` bijgewerkt met het nieuwe schema.
- **Kanttekening**: de kalenderwaarden zijn handmatig uit de afbeelding overgenomen (geen OCR-tool gebruikt) — bij twijfel over een specifieke dag waard om even te laten spot-checken door gebruiker, vooral bij drukke/kleine cijfers.

### Nog open

- Feedback-backend (zie boven) — wachten op beslissing gebruiker.
- Overige punten uit eerdere delen blijven staan: echte AdMob-ID's invullen, Google Play Console-verificatie, store-listing, pushmeldingen-backend.
- Rainbow/meteor-locaties: gebruiker gaf aan dat hij, zodra dat event actief is, een afbeelding met de boeket-/ertsplek-locaties stuurt (nog niet ontvangen).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-09 (deel 21) — Development/preview-build eindelijk gelukt + weekweer bijgewerkt

**Bevestigd door gebruiker: de `preview`-build is geslaagd en de `.apk` staat op zijn telefoon.** Dit sluit de build-saga uit deel 17-20 af (Expo Go werkte niet meer door de echte AdMob-native-module → Gradle/Kotlin-versiebotsing met Google's Play Services Ads → uiteindelijk opgelost door `react-native-google-mobile-ads` te pinnen op exact `16.0.0`/`play-services-ads 24.6.0`, zie deel 20 voor de onderbouwing). **Nog niet apart bevestigd: de EXPO_TOKEN-login-stap moest een tweede keer herhaald worden** (nieuw terminalvenster = env var weg) — gebruiker gewezen op `setx EXPO_TOKEN "..."` als permanente oplossing voor volgende keren, i.p.v. steeds opnieuw `$env:EXPO_TOKEN` per sessie.

### Weekweer (9-16 augustus) + nieuwe conditie "hittegolf"

Wekelijkse HeartoCast-reminder (routine uit deel 12) vuurde. Kon de site niet automatisch screenshotten (`hearto.ixtj.dev` blokkeert headless/geautomatiseerd browserverkeer — curl komt er wel doorheen met een browser-UA, maar Chromium via Playwright kreeg steeds `ERR_CONNECTION_RESET`, ook met proxy/CA correct ingesteld; waarschijnlijk TLS-fingerprint-gebaseerde bot-detectie op de site zelf). Gebruiker gaf de week in plaats daarvan door als tekst, en vroeg om een nieuwe conditie "hittegolf" (🌞🕶️-idee, Unicode heeft geen zon+zonnebril-combi dus 😎 gebruikt) — met woensdag zowel hittegolf als meteorenregen tegelijk, wat het bestaande schema (één `kind` per dag) niet kon uitdrukken.

- `src/lib/remote-content.ts`: `RemoteWeekForecastDay.kind` (enkelvoud) → `kinds` (array). Nieuwe `WeekForecastKind`-waarde `'heatwave'`.
- `src/data/week-forecast.ts`: emoji/label worden nu samengesteld uit alle `kinds` van een dag (join), i.p.v. één-op-één opzoeken.
- `docs/remote-content.md`: schema-doc bijgewerkt naar het `kinds`-array-formaat, met voorbeeld van een dag met twee condities.
- `remote-content.json`: nieuwe week 9-16 augustus; oude 7/8 augustus-entries (voorbij) verwijderd.
- **Testkanttekening**: kon de live-fetch niet zichtbaar in de browser-preview bevestigen — de proxy-laag in deze sandbox is te traag voor de interne fetch-timeout van de app (`ERR_ABORTED`), dus de app viel terug op "geen data" i.p.v. te crashen (correct, veilig gedrag, geen bug). In plaats daarvan de exacte hook-logica (filter/sort/map) in een los Node-scriptje tegen de echte gepushte `remote-content.json` gedraaid — output klopte precies (incl. "😎☄️ Hittegolf + Meteorenregen" op woensdag).

### Nog open

- Gebruiker gaat nu de geïnstalleerde testversie op zijn telefoon proberen (eerste keer sinds de AdMob-integratie dat dit weer kan) — nog geen feedback daarover.
- Overige punten uit eerdere delen blijven staan: echte AdMob-ID's invullen i.p.v. Google's testwaarden (vereist weer een nieuwe build zodra dat gebeurt), Google Play Console-verificatie, store-listing, pushmeldingen-backend.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 20) — Kotlin-versie-fix bleek zelf kapot, AdMob-bibliotheek gedowngraded als echte oplossing

**Vervolg op deel 19.** Twee git-sync-issues onderweg, zelfde categorie als eerder: (1) gebruiker had de Kotlin-fix nog niet gepulld voor de eerste hertest (opgelost met opnieuw `git pull`, ditmaal zonder file-conflict), (2) een `app.json`-conflict tussen de lokale EAS-`projectId` (die `eas build` er zelf in had gezet) en mijn gepushte wijziging — opgelost met `git stash` → `git pull` → `git stash pop` (auto-merge, geen conflict) i.p.v. de eerdere blunte "gooi lokale wijzigingen weg"-aanpak, omdat de projectId ditmaal wél bewaard moest blijven. Project-ID gecommit/gepusht door gebruiker.

**De Kotlin-versie-fix uit deel 19 bleek niet goed genoeg**: de build kwam verder (root-project-log toonde `kotlin: 2.3.0`), maar `react-native-safe-area-context` — die daarvoor prima compileerde — brak nu óók, met kotlin-stdlib-fouten ("Unresolved reference 'mapOf'" etc.) en dezelfde soort Kotlin-metadata-mismatch als bij AdMob. Conclusie: `expo-build-properties`' `android.kotlinVersion`-override propageert in deze Expo/RN-new-architecture Gradle-opzet niet schoon naar alle sub-modules — sommige compileren nog met de oude 2.1.0-compiler terwijl kotlin-stdlib al naar 2.3.0 was opgetrokken, een kapotte tussenstaat die npm-modules brak die eerst niet stuk waren.

**Echte fix**: Kotlin-versie-override volledig teruggedraaid (`expo-build-properties` weer verwijderd — geen nettoresultaat, dus geen reden om 'm te houden). In plaats daarvan `react-native-google-mobile-ads` teruggezet naar exact `16.0.0` (was `^16.4.0`, geïnstalleerd met `npx expo install` zodat het gepind staat zonder `^`, om te voorkomen dat een toekomstige `npm install` weer stilzwijgend naar een kapotte versie springt). Onderbouwd i.p.v. gegokt: publicatiedata opgehaald van `dl.google.com` (Google's eigen Maven-repo) en `repo1.maven.org` (Kotlin/JetBrains) — Kotlin 2.3.0 verscheen pas op 16 december 2025; `play-services-ads 24.6.0` (wat `react-native-google-mobile-ads@16.0.0` binnenhaalt) is van 8 september 2025, dus onmogelijk met Kotlin 2.3 gecompileerd. Ter vergelijking: `play-services-ads 25.0.0` (gebruikt door de tussenliggende 16.1.0–16.3.4-releases) is van februari 2026, ná Kotlin 2.3.0 — dus geen betrouwbaar veiliger alternatief, vandaar de sprong helemaal terug naar `16.0.0`/`24.6.0`.

**Niet bevestigd**: of dit de build daadwerkelijk laat slagen — nog steeds geen Android SDK in deze sandbox om zelf te verifiëren. Gebruiker moet de build opnieuw draaien.

### Nog open

- Bevestigen of `eas build --profile preview --platform android` nu slaagt.
- Zodra een build een keer lukt: de `.apk` op het toestel installeren en testen (dit was het oorspronkelijke doel van deel 17-20).
- Overige punten uit eerdere delen blijven staan (echte AdMob-ID's invullen i.p.v. Google's testwaarden — let op: dat vereist dan weer een nieuwe build —, Play Console-verificatie, store-listing, pushmeldingen-backend).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 19) — Echte oorzaak Gradle-fout gevonden: Kotlin-versie t.o.v. Play Services Ads

**Vervolg op deel 18.** De async-storage-terugzet loste de build niet op. Gebruiker liep tegen een `git pull`-conflict aan (lokale, niet-gecommitte wijzigingen aan `package.json`/`package-lock.json` blokkeerden de pull — opgelost met `git checkout -- package.json package-lock.json` gevolgd door `git pull`). Daarna leverde een `preview`-build (i.p.v. `development`) eindelijk de volledige Gradle-log op, met de echte fout:

```
:react-native-google-mobile-ads:compileReleaseKotlin FAILED
Module was compiled with an incompatible version of Kotlin. The binary version of its metadata is 2.3.0, expected version is 2.1.0.
```

**Oorzaak**: `react-native-google-mobile-ads@16.4.0` trekt `com.google.android.gms:play-services-ads:25.4.0` binnen (hardcoded in het pakket zelf, via `sdkVersions.android.googleMobileAds` in `node_modules/react-native-google-mobile-ads/package.json` — niet overrideable zonder het pakket te downgraden). Die Google-library is gecompileerd met Kotlin 2.3.0, terwijl Expo SDK 57 standaard Kotlin 2.1.20 gebruikt — een oudere Kotlin-compiler kan geen metadata lezen die door een nieuwere is gegenereerd.

**Fix**: `expo-build-properties` toegevoegd (nieuwe dependency + plugin-entry in `app.json`) met `android.kotlinVersion: "2.3.0"`. Dit is de door Expo ondersteunde manier om zulke Gradle-instellingen te overriden zonder de (niet-gecommitte, telkens opnieuw gegenereerde) `android/`-map zelf te bewerken. Bevestigd via lokale `expo prebuild` dat de instelling doorkomt in `android/gradle.properties`. Overwogen alternatief (react-native-google-mobile-ads downgraden naar een oudere `play-services-ads`-versie) bewust niet gekozen: geen manier om zonder een echte Android SDK/Gradle-run te verifiëren of oudere versies wél compatibel zijn, terwijl Kotlin-versie omhoog zetten een goed-ondersteunde, voorwaarts-compatibele richting is (een nieuwere Kotlin-compiler kan oudere metadata gewoon lezen).

**Niet bevestigd**: of dit de build daadwerkelijk laat slagen — kon niet lokaal gereproduceerd worden (geen Android SDK in deze sandbox, zie ook deel 18). Gebruiker moet de build opnieuw draaien.

### Nog open

- Bevestigen of `eas build --profile preview --platform android` nu slaagt.
- Overige punten uit deel 17/18 blijven staan (AdMob-ID's, Play Console-verificatie, store-listing, pushmeldingen-backend, `app.json`'s `extra.eas.projectId` committen zodra een build een keer gelukt is).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 18) — Eerste EAS development-build gaf "Gradle build failed", async-storage teruggezet als vermoedelijke oorzaak

Gebruiker volgde deel 17's stappen (EXPO_TOKEN i.p.v. wachtwoord-login, want account is GitHub-SSO — CLI-wachtwoordlogin werkt dan niet). `eas build --profile development --platform android` startte, maar eindigde met "Gradle build failed with unknown error". De buildpagina op expo.dev kon ik niet inzien (vereist login op gebruikers-account + `expo.dev` is sowieso geblokkeerd voor het netwerkbeleid van deze sandbox) — `expo prebuild --platform android` lokaal gedraaid ter controle (geen Android SDK hier, dus geen echte Gradle-run mogelijk, wel de gegenereerde config gecontroleerd: package-naam/AdMob-manifest zagen er correct uit). Gegenereerde `android/`-map + package.json-scriptwijziging van prebuild weer verwijderd/gereverteerd na de check, niet gecommit.

Gebruiker draaide zelf `npx expo doctor`: enige gefaalde check was `@react-native-async-storage/async-storage@3.1.1` vs verwachte `2.2.0` — exact de bewuste afwijking uit deel 13/16. Een major-versie-sprong in een native module kan de onderliggende Android/iOS-code veranderen, dus dit is een plausibele oorzaak voor de Gradle-crash. Teruggezet naar `2.2.0` (`npx expo install`), `src/data/cloud-sync.ts` weer omgezet naar de oude API (`multiGet`/`multiSet` i.p.v. `getMany`/`setMany`). `expo doctor`'s pakket-versie-check is nu schoon (de 2 overige gefaalde checks zijn netwerk-gerelateerd, niet project-gerelateerd). `tsc` schoon, `expo start --web` + `/cloud-save`- en `/todo`-routes laden zonder fouten.

**Niet bevestigd**: of dit daadwerkelijk de Gradle-fout oplost — kon niet lokaal gereproduceerd worden (geen Android SDK in deze sandbox). Gebruiker moet de development build opnieuw draaien (`eas build --profile development --platform android`) om te zien of hij nu wél slaagt.

### Nog open

- Bevestigen of de development build nu slaagt; zo niet, de werkelijke Gradle-foutmelding uit de "Run gradlew"-fase op de buildpagina nodig om verder te zoeken.
- Overige punten uit deel 17 blijven staan (AdMob-ID's, Play Console-verificatie, store-listing, pushmeldingen-backend, `app.json`'s `extra.eas.projectId` committen zodra de build een keer gelukt is).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 17) — Expo Go werkt niet meer, eas.json opgezet voor een development build

**Aanleiding:** gebruiker probeerde de app op zijn Android-telefoon te openen via Expo Go en kreeg meerdere crashes/errors (screenshots). Kernoorzaak achterhaald: `TurboModuleRegistry.getEnforcing(...): 'RNGoogleMobileAdsModule' could not be found`. Sinds `react-native-google-mobile-ads` (echte AdMob-module, deel 12) is toegevoegd, kan dit project niet meer in de kale Expo Go-app draaien — Expo Go bevat alleen de standaard-modules, geen custom native modules zoals AdMob. De overige gemelde fouten (AsyncStorage "Native module is null", expo-router "Cannot read property 'ErrorBoundary' of undefined", "_layout.tsx missing default export") zijn gevolgschade van diezelfde mismatch, geen aparte bugs.

**Fix (workflow, geen codewijziging aan de app zelf):** `eas.json` toegevoegd met drie standaard-profielen (`development`, `preview`, `production`). `development`/`preview` bouwen een direct installeerbare `.apk` (`distribution: internal`, `buildType: apk`) — dit is de "eigen Expo Go" die gebruiker één keer op zijn telefoon moet installeren om weer te kunnen testen. `production` blijft de standaard `.aab` voor de Play Store-upload later.

**Gebruiker moet zelf** (vanaf zijn Windows-machine, met een gratis Expo/EAS-account):
1. `git pull` zodat `eas.json` lokaal staat.
2. `npm install -g eas-cli` (of `npx eas-cli` zonder installeren) + `eas login`.
3. `eas build --profile development --platform android` — bouwt in de cloud (geen Android Studio nodig), vraagt bij de eerste keer om een EAS-project aan te maken/koppelen (schrijft een `projectId` in `app.json` — die wijziging moet gebruiker zelf committen/pushen na afloop).
4. De resulterende `.apk` downloaden en op de telefoon installeren (normale sideload, dus "installeren van onbekende bron" toestaan).
5. Daarna weer gewoon `npx expo start` gebruiken, maar verbinden vanuit de nieuw geïnstalleerde eigen app in plaats van Expo Go.

**Let op voor later**: zodra de echte AdMob App-ID/ad-unit-ID's worden ingevuld (nog steeds Google's publieke test-ID's, zie deel 12), verandert de native config opnieuw — dan is een nieuwe development build nodig, het is dan niet meer genoeg om alleen JS/TS-code te wijzigen.

### Nog open

- Gebruiker moet de development build zelf uitvoeren (kan niet vanuit deze cloud-sessie, vereist eigen EAS-login).
- `app.json` krijgt na de eerste `eas build` een `extra.eas.projectId` — moet nog gecommit/gepusht worden zodra dat gebeurd is.
- Overige punten uit deel 16 blijven staan (AdMob-ID's, Play Console-verificatie, store-listing, pushmeldingen-backend).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 16) — Ad-banner overlapte tab-balk gefixt, Expo-pakketten geüpdatet

**Ad-banner/tab-balk-overlap**: gebruiker meldde dat de onderste menubalk (Home/Explore, `NativeTabs`) niet meer zichtbaar was, overlapt door de advertentiebanner. Oorzaak: `AdBanner` (`src/components/heartopia/ad-banner.tsx`) was los-zwevend (`position: absolute`) t.o.v. de hele app (root `_layout.tsx`), dus tekende hij over de native tab-balk heen op Home/Explore. Fix: op die twee routes (`/` en `/explore`, gedetecteerd via `usePathname()`) telt de banner nu `BottomTabInset` (bestaande constante uit `constants/theme.ts`, al gebruikt in het ongewijzigde Explore-scaffold voor exact hetzelfde doel) op bij de veilige-gebied-marge. Alleen `ad-banner.tsx` (native) aangepast — `ad-banner.web.tsx` niet, want web heeft geen onderste tab-balk (de "Expo Starter"-navbar zit daar bovenaan, zie deel 6). **Kon niet op een echt toestel getest worden vanuit deze sandbox** (alleen web-preview beschikbaar, en web volgt een ander codepad) — gebruiker moet zelf bevestigen dat de balk nu zichtbaar blijft.

**Expo-update**: gebruiker zag een updatemelding. `npx expo install expo@latest` → 57.0.10 → 57.0.11 (nog steeds SDK 57, geen major-sprong — SDK 58 bestaat alleen als canary/pre-release, dus bewust niet genomen). `package.json`'s expo-versiebereik van `^` teruggezet naar `~` (Expo's eigen conventie voor SDK-pakketten). `npx expo install --check` gaf ook `expo-router` en `expo-symbols` als licht-achterlopend aan — mee-geüpdatet. `@react-native-async-storage/async-storage` blijft bewust op `^3.1.1` ondanks dat de checker `2.2.0` "verwacht": de Cloud Save-code (`data/cloud-sync.ts`) gebruikt de nieuwe v3-API (`getMany`/`setMany`, zie deel 13) die in 2.2.0 niet bestaat — downgraden zou Cloud Save breken. Getest: `tsc --noEmit` schoon, `expo start --web` + `/cloud-save`-route laden zonder fouten.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 15) — App hernoemd naar Heartopedia, Android-pakketnaam vastgelegd

**Uitgangspunt:** vervolg op deel 14 (herstel-pad-fix). Gebruiker was bezig in de AdMob-console met "Winkels aan app toevoegen" en moest daar een Android-pakketnaam invullen — dat veld bestond nog nergens (`app.json` had geen `android.package`). Voorgesteld: `com.thesilly1995.heartopiagids` (omgekeerde-domeinnotatie o.b.v. GitHub-username, aangezien er geen eigen domein is). Gebruiker akkoord, en gaf er meteen bij aan dat de definitieve appnaam **"Heartopedia"** wordt (niet langer "Heartopia-Guide"/"Heartopia Gids").

**Gewijzigd in `app.json`:**
- `name`/`slug`: `"Heartopia-Guide"` → `"Heartopedia"` / `"heartopedia"` (geen EAS-project gekoppeld, dus veilig om slug nu nog te wijzigen).
- `scheme`: `"heartopiaguide"` → `"heartopedia"`.
- `android.package`: nieuw, `"com.thesilly1995.heartopiagids"` — **belangrijk: moet exact (incl. hoofdletters) matchen met wat in AdMob en straks Play Console wordt ingevuld.** Pakketnaam zelf bevat bewust nog "heartopiagids" (afwijkend van de nieuwe appnaam "Heartopedia") — is al aan gebruiker bevestigd zo, pakketnaam is achteraf toch niet meer te wijzigen na publicatie dus geen reden om 'm nu nog aan te passen.

Gevalideerd met `npx expo config --type public`. Geen `ios.bundleIdentifier` gezet — Apple Developer is nog steeds bewust uitgesteld (zie deel 13).

### Nog open

- Gebruiker moet dezelfde pakketnaam (`com.thesilly1995.heartopiagids`) straks ook exact zo invullen bij het aanmaken van de Play Console-listing.
- Overige punten uit deel 14 blijven staan: AdMob-App-ID/ad-unit-ID's nog invullen (nu nog Google's publieke test-ID's in de `react-native-google-mobile-ads`-plugin-config), Google Play Console-verificatie, EAS-build/`eas.json`, pushmeldingen-backend, store-listing.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-08 (deel 14) — AdMob-plugin-fout opgelost, Cloud Save end-to-end bevestigd werkend

**Uitgangspunt:** vervolg op deel 13, andere chat-sessie (deze zat oorspronkelijk in het `website-1`-project, omgeschakeld naar `heartopia-guide`). Gebruiker liep lokaal tegen twee dingen aan die hier zijn opgelost.

### `PluginError: Failed to resolve plugin for module "react-native-google-mobile-ads"`

Gebruiker kreeg dit bij `npx expo start` op zijn Windows-checkout. Oorzaak: een parallelle sessie had `react-native-google-mobile-ads` als config-plugin aan `app.json` en als dependency aan `package.json` toegevoegd en gepusht (samen met een grote batch ander werk: Cloud Save/Supabase, `dashboard.tsx`, AdMob-bannercomponenten, `week-forecast.ts` als vervanger van `special-weather.ts`) — de lokale checkout had die commits nog niet gepulled/geïnstalleerd. Bevestigd door het hier zelf te pullen + `npm install` + `npx expo config --type prebuild` + `tsc --noEmit`: alles resolvet en compileert schoon zodra `node_modules` up-to-date is. **Fix:** `git pull` + `npm install` vóór `npx expo start`. Geen codewijziging nodig — puur een lokale-installatie-achterstand, zelfde categorie fout als eerdere ontbrekende dependencies.

### Cloud Save — "email rate limit exceeded" bij account aanmaken

Gebruiker kreeg deze foutmelding op het "Account aanmaken"-formulier. Dit is een Supabase-limiet op de ingebouwde e-mailservice (bevestigingsmail bij sign-up), niet een app-bug — de gratis/standaard SMTP staat maar een paar e-mails per uur toe, en die limiet werd geraakt tijdens het testen. Gebruiker vond via Authentication in het Supabase-dashboard de instelling om **"Confirm email"** uit te zetten (zat al even zoeken: niet bij "OAuth Apps", wel bij **Sign In / Providers** → Email-provider).

### Cloud Save — volledig end-to-end bevestigd werkend (via de app-UI, niet alleen testscript)

Na het uitzetten van "Confirm email" heeft gebruiker zelf via de echte app-schermen (niet een los testscript zoals in deel 13) een account aangemaakt, ingelogd, en op "Nu back-uppen naar cloud" getikt — resultaat: "✓ 3 items opgeslagen in de cloud" zichtbaar in de UI, inclusief het account-paneel met back-uppen/herstellen/uitloggen. Hiermee is de laatste openstaande "nog niet getest"-regel uit deel 13 (volledige back-up/herstel-cyclus via de app-UI zelf) afgevinkt voor het back-up-pad. Herstellen-knop is nog niet expliciet getest door gebruiker.

**Nog open:** herstel-pad (Herstellen vanaf cloud) nog niet expliciet bevestigd door gebruiker; gedrag op native/EAS-build nog niet getest (alleen web/Expo Go tot nu toe).

### Herstel-pad alsnog bevestigd + web-only bug gevonden en gefixt (zelfde dag, vervolgsessie)

De "niet expliciet getest"-regel hierboven bleek een echte bug te verbergen: gebruiker klikte op "Herstellen vanaf cloud" en zag niks gebeuren. Oorzaak: `Alert.alert` (gebruikt voor de bevestigingsvraag) is in `react-native-web` een lege no-op-stub (`node_modules/react-native-web/.../exports/Alert/index.js`: `static alert() {}`) — op web verscheen de confirm-dialoog dus nooit, en dus gebeurde er ook niks bij "bevestigen" (want er was niks om te bevestigen). Op native/Expo Go zou dit wél gewerkt hebben.

**Fix in `src/app/cloud-save.tsx`**: `Alert.alert` vervangen door een eigen inline bevestigingsblokje (state `confirmingRestore`, met Annuleren/Herstellen-knoppen in de bestaande kaartstijl) — werkt identiek op web én native, geen platform-specifieke code nodig. Getest via een tijdelijke debug-route + Playwright (klik toont het bevestigingsblokje, geen console-errors), route erna weer verwijderd.

**Definitief bevestigd door gebruiker via screenshots**: volledige cyclus werkt nu end-to-end — inloggen, "Nu back-uppen naar cloud" (✓ 3 items opgeslagen), "Herstellen vanaf cloud" → bevestigingsblokje → "✓ 3 items hersteld vanaf de cloud". Cloud Save is hiermee volledig af voor wat betreft de kernflow.

**Nog steeds open:** gedrag op native/EAS-build nog niet getest (alleen web tot nu toe, al zou de Alert-bug daar sowieso niet gespeeld hebben).

## 2026-08-08 (deel 13) — Nieuwe badge, Google Play Console gestart, Cloud Save met Supabase voorbereid

**Uitgangspunt:** vervolg op deel 12. Gebruiker meldde een nieuwe in-game badge, gaf een statusupdate over Google Play Console (identiteits-/telefoonverificatie loopt, mail volgt), besloot Apple Developer voorlopig over te slaan (99$/jaar, nu te duur) en gaf groen licht voor Supabase (cloud save).

### Nieuwe badge: "Current of Life" / "Stroming van het Leven"

- Toegevoegd aan `src/data/badges.ts`, direct vóór de verborgen badges (nieuwste normale badge).
- Gebruiker uploadde de originele unlock-screenshot (`image-1786199901536.png`) naar de repo-root. Bijgesneden met Pillow tot alleen het schild-icoon (meldingsbubbel/naam/datum weggehaald, klein resterend bubbel-fragment overgeschilderd met de achtergrondkleur) en opgeslagen als `assets/images/badges/current-of-life.jpg`; `iconKey` bijgewerkt, ruwe upload verwijderd.

### Google Play Console

Gebruiker toonde een screenshot van de lopende accountverificatie (identiteit + telefoonnummer) — nog niet afgerond, mail volgt. Zolang dit loopt: nog geen IAP-producten aanmaken in Play Console, nog niet publiceren. Apple Developer-account bewust overgeslagen voor nu (kosten) — kan later alsnog, RevenueCat/IAP op iOS wacht dus tot dat besluit verandert.

### Cloud Save (voorbereiding, nog niet functioneel)

- `@supabase/supabase-js` + `react-native-url-polyfill` toegevoegd.
- `src/constants/supabase.ts`: Supabase-client met placeholder URL/anon-key (leeg tot het project bestaat). **Belangrijke ontdekking**: `expo-router`'s `web.output: "static"` rendert schermen ook server-side (Node) tijdens `expo start --web`/build — Supabase's auth-client crashte daar met "window is not defined" omdat AsyncStorage's web-implementatie op `window`/localStorage leunt. Opgelost met een in-memory-storage-fallback wanneer `typeof window === 'undefined'` (sessie-persistentie is server-side toch zinloos).
- `src/hooks/use-auth.tsx`: `AuthProvider`/`useAuth()` — e-mail/wachtwoord sign up/in/out, sessie-state, met foutafhandeling als `getSession()` faalt (geen netwerk).
- `src/data/cloud-sync.ts`: verzamelt alle lokale `heartopia:`-voortgang (AsyncStorage) tot één JSON-blob en zet die in een `cloud_saves`-tabel (push), en het omgekeerde (pull, overschrijft lokale voortgang na bevestiging). Gebruikte de nieuwe `getMany`/`setMany`-API van `@react-native-async-storage/async-storage` (deze repo zit op v3.1.1, een ingrijpend herschreven API zonder `multiGet`/`multiSet` — zie ook de AGENTS.md-waarschuwing dat Expo/dit ecosysteem sterk is veranderd).
- `src/app/cloud-save.tsx`: nieuw scherm, zelfde premium-gate-patroon als `dashboard.tsx`. Daarna: "nog niet geconfigureerd" (huidige staat, want Supabase-project bestaat nog niet) → anders auth-formulier (toggle inloggen/account aanmaken) → anders account-paneel met "Nu back-uppen"/"Herstellen vanaf cloud" (met bevestigingsdialoog) en uitloggen.
- Homescreen-tegel "Cloud Save" wijst nu naar `/cloud-save` i.p.v. de "Komt binnenkort"-placeholder (Meldingen staat nog wel op `href: null`).
- `docs/supabase-setup.md` (nieuw): stap-voor-stap voor gebruiker — project aanmaken, e-mail-auth, het exacte SQL-schema + RLS-policies voor de `cloud_saves`-tabel, en waar de URL/anon-key in de code moeten.
- Getest via `expo start --web` + Playwright: locked-state, "nog niet geconfigureerd"-state, en (met tijdelijk nep-config, nadien teruggezet naar lege placeholders) het auth-formulier — geen console-errors. **Nog niet getest met een echt Supabase-project** (bestaat nog niet) en niet op native/EAS-build.

### Cloud Save — Supabase-project gekoppeld en getest (zelfde dag, vervolg)

Gebruiker maakte het Supabase-project aan en stuurde de Project URL + anon key (JWT-vorm, `ref: dhttdbbnxynaqycjlltd` → `https://dhttdbbnxynaqycjlltd.supabase.co`) door. Ingevuld in `src/constants/supabase.ts` en gepusht.

**Netwerk-obstakel in deze cloud-sessie:** deze cloud-omgeving ("Default") stond aanvankelijk op "Trusted network access" (beperkte allowlist: GitHub/npm/etc.) — verzoeken naar `*.supabase.co` kregen een 403 van de agent-proxy ("Host not in allowlist"). Gebruiker heeft de omgevingsinstelling zelf aangepast (niet via deze chat te doen — zit in de claude.ai/code-omgevingsinstellingen, niet in het algemene Settings-scherm) naar volledige netwerktoegang. Daarna werkte het meteen.

**Extra val bij het testen:** Node's ingebouwde `fetch` (gebruikt door `@supabase/supabase-js`) leest `HTTPS_PROXY` niet vanzelf op Node 22 — testscripts moesten met `NODE_USE_ENV_PROXY=1 node ...` gedraaid worden. Dit is alleen relevant voor test/debug-scripts in deze sandbox, niet voor de app zelf (Expo/Metro's fetch-implementatie had hier geen last van, `expo start --web` werkte al zonder die vlag).

**Live getest (los testscript, niet de app-UI) en bevestigd werkend:**
- `cloud_saves`-tabel + RLS bestaan en zijn correct (SQL uit `docs/supabase-setup.md` door gebruiker gedraaid in de SQL Editor).
- Sign-up werkt (nieuwe gebruiker aangemaakt in `auth.users`).
- **"Confirm email" staat aan** (Supabase-default) — sign-in geeft `Email not confirmed` tot de gebruiker de bevestigingsmail aanklikt. Dit is verwacht gedrag, zie stap 2 in `docs/supabase-setup.md` als je dit tijdens testen wil uitzetten.
- RLS blokkeert ongeauthenticeerde reads (anon-key-only request op de tabel geeft 0 rijen).
- Er staat nog één test-gebruiker (`heartopiatest<timestamp>@gmail.com`, onbevestigd, nep e-mailadres) in `auth.users` van dit testscript — kan opgeruimd worden via Authentication → Users in het Supabase-dashboard, verder onschadelijk.
- App zelf (via `expo start --web`) toont nu het echte login-formulier op `/cloud-save` i.p.v. de "nog niet geconfigureerd"-melding, geen console-errors.

**Nog niet getest:** een volledige back-up/herstel-cyclus via de app-UI zelf met een bevestigd account (het losse testscript deed dit via de API, niet via de schermen), en gedrag op native/EAS-build.

### Keep-alive Routine voor Supabase Free-tier

Supabase's gratis tier pauzeert projecten na ~7 dagen zonder API-activiteit. Op verzoek van gebruiker een Routine aangemaakt (`trig_01AAH6a8Va74qJU45B1r7mAu`, "Heartopia Supabase keep-alive ping") die elke 3 dagen (`0 9 */3 * *`, UTC) een verse sessie spawnt die één `curl`-verzoek naar de `cloud_saves`-tabel doet (met de anon key, hardcoded in de trigger-prompt — dit is de publieke/niet-geheime key). Bij HTTP 200: stille afsluiting, geen bericht. Bij iets anders: rapporteert dat als eindbericht, wat een pushmelding naar gebruiker triggert (notifications: push=true, email=false). Zo hoeft gebruiker nooit zelf te controleren of het project nog leeft.

### Nog open

- **Cloud Save**: e-mailbevestiging afronden voor een testaccount en de volledige back-up/herstel-flow via de echte app-UI doorlopen (niet alleen via testscript). Testgebruiker uit deel 13 evt. opruimen in Supabase-dashboard.
- **Google Play Console**: wachten op bevestigingsmail.
- **AdMob**: ongewijzigd t.o.v. deel 12 — wacht op echte App-ID/ad-unit-ID's van gebruiker.
- **Apple Developer / RevenueCat (iOS)**: bewust uitgesteld.
- Overige punten uit deel 11/12 blijven staan: pushmeldingen-backend, Play Store-publicatie (package-config, EAS build, store-listing, privacyverklaring).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide` (inclusief de echte Supabase-config in `src/constants/supabase.ts` — dit is de publieke anon key, geen geheim, beveiliging zit in RLS).

## 2026-08-07 (deel 12) — Weekweer bevestigd, HeartoCast-upload opgeruimd, AdMob-integratie voorbereid, wekelijkse reminder ingesteld

**Uitgangspunt:** vervolg op deel 11. Gebruiker vroeg eerst naar de weekweer-update (open punt uit deel 9-11), daarna is een AdMob-account aangemaakt en gevraagd om de ad-integratie alvast te bouwen terwijl de AdMob-console verder wordt ingericht.

### Weekweer

- Gebruiker uploadde een opgeslagen HTML-pagina van `hearto.ixtj.dev` naar de repo-root — bleek de lege, niet-gehydrateerde paginaschil van een client-side gerenderde Next.js-app te zijn (geen forecast-data erin). Verwijderd; gebruiker stuurde in plaats daarvan screenshots.
- Screenshots van de HeartoCast-tijdlijn bevestigden dat de datums onder de tijden echte kalenderdatums zijn (bv. "08/03 Mon" klopt met de kalender). 08/08 (warm_sun) en 08/09 (normal) kwamen exact overeen met de bestaande waarden in `remote-content.json` — alleen `updatedAt` bijgewerkt. 07/08 op verzoek van gebruiker overgeslagen.
- **Wekelijkse reminder ingesteld** (Routine/trigger `trig_01NpC2y9MUgKJM1rDCvQRtbY`, cron `0 8 * * 0` = zondag 10:00 Europe/Amsterdam) die deze sessie elke zondag vraagt om een nieuwe HeartoCast-screenshot.

### AdMob-integratie (voorbereiding, nog niet live)

- `react-native-google-mobile-ads` (16.4.0) toegevoegd. Config-plugin in `app.json` met Google's officiële **test**-App-ID's als placeholder (`ca-app-pub-3940256099942544~...`) tot de echte AdMob-App-ID's er zijn.
- **Belangrijke ontdekking**: een lazy `require()` van de native module binnen een `Platform.OS`-check is niet genoeg om Metro's web-bundeling te laten slagen — Metro volgt `require()`-calls statisch, ongeacht of de tak ooit wordt uitgevoerd, en crasht op `codegenNativeComponent`-imports die niet op web bestaan. **Oplossing**: platform-specifieke bestanden (Metro/Expo's ingebouwde resolutiemechanisme), niet lazy requires.
  - `src/constants/ads.ts` (native, echte `mobileAds()/TestIds`) + `src/constants/ads.web.ts` (no-op stub).
  - `src/components/heartopia/ad-banner.tsx` (native, echte `<BannerAd>`) + `src/components/heartopia/ad-banner.web.tsx` (de oude mock-placeholder, want AdMob heeft geen web-implementatie).
- `mobileAds().initialize()` wordt bij app-start aangeroepen via `_layout.tsx` (native only, via het bestaande `ads.ts`/`ads.web.ts`-platformonderscheid).
- Getest: `expo start --web` bundelt weer succesvol (voorheen crash), Playwright bevestigde geen console-errors en de mock-banner zichtbaar op het homescreen. **Niet** getest op een echt device/simulator — dat vereist een dev-client/EAS-build, want dit is een native module (werkt niet in Expo Go).

### Nog open

- **AdMob**: zodra gebruiker in de AdMob-console een app + banner-ad-unit heeft aangemaakt, de echte App-ID's in `app.json` en de banner-ad-unit-ID's in `PRODUCTION_BANNER_AD_UNIT_ID` (`src/constants/ads.ts`) invullen. Pas dan (en na een dev-client/EAS-build) is er echt getest of de banner op een device verschijnt.
- **RevenueCat/Supabase/Expo push**: nog steeds open — gebruiker moet hiervoor accounts aanmaken (RevenueCat, Supabase, en voor IAP ook Apple Developer + Google Play Console; voor Android-push mogelijk een Firebase-project vanwege FCM v1).
- Overige punten uit deel 11 (reclame was hiervan het enige dat nu is opgepakt) blijven staan: IAP/betaalflow, cloud save (account-systeem), pushmeldingen-backend, Play Store-publicatie.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 11) — Sessie afgesloten, vervolg in nieuwe chat

Gebruiker rondt deze chat af en gaat verder in een nieuwe sessie. Alles uit deel 1 t/m 10 staat al gecommit en gepusht op `main` — niets onafgemaakt in de working tree.

### Nog open bij de start van de volgende sessie

- **Weekweer van `hearto.ixtj.dev`**: gebruiker wil een externe weer-website gebruiken om de `weekForecast`-data (en mogelijk tijden) in `remote-content.json` bij te werken. De site zelf én een reader-proxy (`r.jina.ai`) zijn allebei geblokkeerd door het netwerkbeleid van de Claude-sessie (403 op de egress-proxy — een bewuste organisatiebeslissing, dus niet omzeilen via een andere proxy/dienst). Gebruiker zou een **screenshot** sturen van het weerschema zodat de dagen/tijden alsnog handmatig overgenomen kunnen worden — dat is nog niet gebeurd.
- **Reclame**: mock-banner staat er (deel 10), maar er is nog geen echt advertentienetwerk (bv. AdMob) aangesloten — bewust uitgesteld tot er een keuze is gemaakt.
- **IAP/echte betaalflow, cloud save (account-systeem), pushmeldingen-backend**: nog steeds allemaal open, zie eerdere secties (deel 6 e.v.) voor de volledige toelichting waarom en de aanbevolen aanpak (RevenueCat resp. Supabase/Firebase resp. Expo push notifications).
- **Play Store-publicatie**: ongewijzigd al meerdere sessies open (android package config, EAS build, privacyverklaring, store-listing).

### Repo-status

Werkboom schoon, alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 10) — Mock advertentiebanner, verdwijnt met (test-)premium

**Uitgangspunt:** vervolg op deel 9 — gebruiker kondigde daar aan later reclame in de app te willen zetten, met premium-leden reclamevrij. Gevraagd of dit nu al als UI-voorbereiding gebouwd mocht worden (zelfde aanpak als dashboard/meldingen/cloud save eerder), gebruiker zei ja.

### Wat is gebouwd

- **`src/components/heartopia/ad-banner.tsx`** (nieuw): `<AdBanner />` — een vaste balk onderin het scherm ("📢 Advertentie" + toelichting dat het een placeholder is), met `position: absolute` zodat hij zich gedraagt zoals een echte banner-ad-SDK dat ook zou doen (los van de scroll-content, boven op de bestaande schermen). Gebruikt `usePremium()`: rendert `null` zodra (test-)premium aan staat.
- **`src/app/_layout.tsx`**: `<AdBanner />` toegevoegd op root-niveau, buiten de `<Stack>` maar binnen `ThemeProvider` — daardoor verschijnt hij automatisch op **elk** scherm zonder dat de losse schermbestanden aangepast hoefden te worden.

### Bekende bewuste keuzes

- Puur mock/placeholder — geen echt advertentienetwerk (AdMob o.i.d.) aangesloten. Dat vereist eigen accounts/SDK-integratie en hoort bij dezelfde categorie als de eerdere "later aansluiten"-features.
- Absolute positionering i.p.v. ruimte reserveren in elk scherm's layout — dekt soms even de onderkant van scrollbare content af (zoals een echte banner-ad dat ook doet), geen aanpassingen aan bestaande schermen nodig.

### Getest

Via `expo start --web` + Playwright: banner zichtbaar onderin op zowel het homescreen als een willekeurig ander scherm (Vissen); na het aanzetten van de premium-test-toggle verdwijnt de banner meteen op alle schermen. Geen console errors.

### Open ideeën / mogelijk vervolg

- Weekweer van `hearto.ixtj.dev`: nog open, gebruiker stuurt een screenshot (zie deel 9).
- Echte ad-SDK integratie zodra er een keuze is gemaakt (AdMob is de meest gangbare optie voor Expo/React Native).

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 9) — Sterren-totaal toegevoegd aan het voortgangsdashboard; reclame en weer-website nog open

**Uitgangspunt:** gebruiker wilde op het voortgangsdashboard ook het totaal aantal sterren per catalogus zien (naast de bestaande mastery-%). Twee andere punten kwamen ter sprake maar zijn nog niet afgerond: (1) reclame in de app toevoegen met premium-leden reclamevrij (aangekondigd, nog niet expliciet gevraagd te bouwen — nog geen actie op ondernomen, staat open), (2) een externe website (`hearto.ixtj.dev`) met weersverwachtingen/tijden die de gebruiker wilde gebruiken voor de weekweer-data — deze site is geblokkeerd door het netwerkbeleid van deze sessie (403 op de egress-proxy, bevestigd via zowel WebFetch als curl), dus gebruiker stuurt in plaats daarvan een screenshot na.

### Wat is gebouwd

- **`src/data/catalog-progress.ts`**: `CatalogProgressEntry` kreeg `stars`/`maxStars`. Elke catalogus-def kreeg een `starsKeys`-lijst naast de bestaande `masteryKeys` (zelfde AsyncStorage-sleutels als de hobby-schermen al gebruiken voor sterren, bv. `heartopia:vissen:stars`; voor Ocean Cleanup is dat de losse `heartopia:schelpen:sterren` zonder `:mastery`-suffix, want dat IS al de sterren-sleutel). Nieuwe `sumStars()`-helper telt de sterwaarden (1-5 per item) bij elkaar op, i.p.v. alleen booleans te tellen zoals `sumBooleans()` (hernoemd van `countMastered`) voor mastery doet. `maxStars = total * 5`.
- **`src/app/dashboard.tsx`**: elk catalogus-kaartje en de totaalkaart tonen nu een extra regel `⭐ {sterren} / {maxSterren} sterren` onder de mastery-telling.

### Getest

Via `expo start --web` + Playwright: een item op het Vissen-scherm op 3 sterren gezet, daarna (na premium via het test-pilletje aan te zetten) het dashboard geopend — Vissen toonde correct "⭐ 3 / 425 sterren" en de totaalkaart "⭐ 3 / 1555 sterren" (311 items × 5 = 1555, klopt). Geen console errors.

### Open ideeën / mogelijk vervolg

- **Reclame + premium-advertentievrij**: gebruiker kondigde dit aan maar er is nog niets voor gebouwd — moet nog uitgevraagd/gepland worden (zelfde "eerst UI, later echte integratie"-aanpak als bij de andere premium-features ligt voor de hand, met een mock-advertentiebanner die verdwijnt zodra de premium-test-toggle aan staat).
- **Weekweer van `hearto.ixtj.dev`**: site is geblokkeerd voor deze sessie's netwerktoegang; gebruiker stuurt een screenshot om de dagen/tijden alsnog over te nemen in `remote-content.json`.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 8) — Missies & Bubbels als statuskaartje bovenaan het homescreen

**Uitgangspunt:** gebruiker wilde Missies en Wekelijkse Bubbels ook bovenaan het homescreen, in dezelfde stijl als het bestaande Rainbow/Meteorenregen-kaartje (icoon + korte statustekst, i.p.v. de gewone kaart-met-titel-en-beschrijving in de secties eronder). In tegenstelling tot Rainbow/Meteor hebben Missies en Bubbels geen "actief/niet actief"-concept (ze zijn altijd beschikbaar) — in plaats daarvan toont het kaartje de voortgang: hoeveel dagelijkse missies/bubbel-vinkjes je al hebt afgevinkt.

### Wat is gebouwd

- **`src/data/missions-progress.ts`** (nieuw): `useMissionsProgress()` — telt hoeveel van de dagelijkse missie-sleutels (dezelfde `d0`/`d1`/`d3`/... als in `src/app/missies.tsx`) zijn aangevinkt in `heartopia:missies:vinkjes`, tegenover het totaal.
- **`src/data/bubbles-progress.ts`** (nieuw): `useBubblesProgress()` — zelfde idee voor `heartopia:bubbels:vinkjes` t.o.v. het aantal bubbel-locaties (19, via `useBubbleLocations()`).
- Beide hooks verversen via `useFocusEffect` (uit `expo-router`) elke keer dat het homescreen focus krijgt, zelfde patroon als `useCatalogProgress()` voor het premium-dashboard.
- **`src/app/(tabs)/index.tsx`**: nieuw kaartje in `plotsCard`-stijl direct onder het Zwervende Eik/Fluoriet-kaartje, met twee los tikbare rijen (elk een eigen `Link`, want ze gaan naar verschillende schermen — anders dan Rainbow/Meteor waar de hele kaart naar één scherm linkt): 📋 `{gedaan}/{totaal}` → `/missies`, 🫧 `{gedaan}/{totaal}` → `/bubbels`. Missies en Wekelijkse Bubbels zijn uit de "Spel"-sectie gehaald (die had alleen nog Badges en Codes over) — zelfde redenering als eerder bij Event/Rainbow-Meteor: niet dubbel tonen.

### Getest

Via `expo start --web` + Playwright: kaartje toont "0/11" en "0/19" bij een lege staat; na het aanvinken van "Dagelijkse check-in" op het Missies-scherm en terugkeren naar home sprong de teller naar "1/11" (bevestigt de focus-refresh). Tikken op de Bubbels-rij navigeert naar `/bubbels`. Geen console errors.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 7) — Echte premium-gate (test-toggle) voor het voortgangsdashboard

**Uitgangspunt:** na het bouwen van de Premium-sectie (deel 6) vroeg de gebruiker of niet-premium gebruikers het dashboard/meldingen/cloud save niet zouden moeten kunnen zien/gebruiken. Antwoord was: klopte nog niet — er was helemaal geen premium/gratis-onderscheid, dashboard was voor iedereen gratis bruikbaar, en "Komt binnenkort" gold voor iedereen omdat de features nog niet bestaan. Gebruiker wilde dat alsnog gesimuleerd hebben: een lokale test-toggle die echt bepaalt of je bij het dashboard kan, zodat je kan voorproeven hoe het straks aanvoelt.

### Wat is gebouwd

- **`src/hooks/use-premium.tsx`** (nieuw): `PremiumProvider` + `usePremium()` — zelfde patroon als `use-language.tsx` (React Context, AsyncStorage-persistentie onder `heartopia:premium:test`, default `false`). Nadrukkelijk een test-schakelaar, geen echte toegangscontrole (geen server, geen account).
- **`src/app/_layout.tsx`**: `PremiumProvider` toegevoegd (binnen `LanguageProvider`, buiten `ThemeProvider`), en `dashboard` als `Stack.Screen` geregistreerd (stond er nog niet bij, werkte al wel via file-based routing maar nu consistent met de rest).
- **`src/app/dashboard.tsx`**: nu echt gated. Zonder premium: een centraal slotscherm ("Alleen voor Premium-leden") met uitleg + een knop "Word Premium-lid (test) 👑" die de test-toggle aanzet en meteen het echte dashboard toont. Mét premium: het bestaande dashboard, plus een badge "Premium actief (test)" met een link om de test-premium weer uit te zetten.
- **`src/app/(tabs)/index.tsx`**: de "Premium"-sectiekop kreeg een pilletje ("Test: Premium AAN/UIT", zelfde stijl als de NL/EN-taalwissel) om de test-toggle ook vanaf het homescreen te bedienen. De Meldingen/Cloud Save-kaartjes (`href: null`) reageren nu op de premium-status: zonder premium toont een tik "Vereist Premium 👑", mét premium (het normale geval zodra er wel premium is, maar de feature nog niet bestaat) toont een tik gewoon "Komt binnenkort ✨" zoals voorheen.

### Bekende bewuste keuzes

- Nog steeds geen echte IAP — de knop "Word Premium-lid (test)" zet enkel de lokale AsyncStorage-vlag, geen betaling. Duidelijk gelabeld met "(test)" in zowel de knoptekst als een toelichtende regel eronder, zodat het niet per ongeluk voor een echte aankoop wordt aangezien.
- Premium-status is device-lokaal (AsyncStorage), niet gekoppeld aan een account — dat is precies waarom Cloud Save als aparte, nog-niet-bestaande feature is blijven staan (zou premium-status ook syncen tussen toestellen, maar dat vereist eerst een account-systeem).

### Getest

Via `expo start --web` + Playwright: zonder premium toont het dashboard het slotscherm en tonen Meldingen/Cloud Save "Vereist Premium 👑" bij een tik; na tikken op "Word Premium-lid (test)" toont het dashboard meteen de echte voortgang, het homescreen-pilletje springt naar "AAN", en Meldingen/Cloud Save tonen daarna "Komt binnenkort ✨" i.p.v. het premium-verzoek — status blijft correct tussen schermen. EN gecontroleerd inclusief het pilletje zelf als aan/uit-schakelaar vanaf het homescreen. Geen console errors.

### Open ideeën / mogelijk vervolg

- Zodra er een echte IAP-integratie komt: de test-toggle vervangen door een echte aankoopflow (bv. RevenueCat), en de AsyncStorage-vlag vervangen door een serverside/entitlement-check.
- Cloud save vereist alsnog een account-systeem — zie eerdere sessie-secties.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 6) — Premium-sectie: werkend voortgangsdashboard + "komt binnenkort" voor meldingen/cloud save

**Uitgangspunt:** gebruiker wil straks betaalde extra's in de app: een voortgangsdashboard (overzicht van alle catalogussen), push-meldingen voor events/weer, en cloud-save tussen toestellen. Afgesproken aanpak (na overleg): nu de UI bouwen, betaling/notificatie-backend/cloud-opslag pas aansluiten zodra de bijbehorende accounts/infrastructuur er is. Gebruiker gaf daarna nog een concrete vereenvoudiging mee: geen nep-instellingenschermen voor meldingen/cloud save bouwen — gewoon een "Komt binnenkort"-melding tonen bij een tik, tot de echte backend er is.

### Wat is gebouwd

- **`src/data/catalog-progress.ts`** (nieuw): `useCatalogProgress()`-hook die voor de 7 catalogus-hobby's (Vissen, Koken, Tuinieren, Insecten, Vogels, Beeldhouwen, Ocean Cleanup) het aantal mastery-vinkjes optelt tegenover het totaal aantal items. Leest de bestáánde AsyncStorage-sleutels die de hobby-schermen zelf al gebruiken (`heartopia:<storageKey>:mastery`, en voor Ocean Cleanup de losse `heartopia:schelpen:sterren:mastery`) — geen nieuwe opslag nodig, dus meteen consistent met wat de gebruiker al heeft aangevinkt. Tuinieren en Beeldhouwen tellen hun twee subtabs (gewassen+bloemen resp. zand+sneeuw) bij elkaar op. Ververst via `useFocusEffect` (uit `expo-router`) elke keer dat het dashboardscherm focus krijgt.
- **`src/app/dashboard.tsx`** (nieuw): het voortgangsdashboard zelf — een totaalbalk bovenaan (percentage + aantal mastery van het totaal over alle catalogussen samen) en daaronder één kaart per catalogus met eigen voortgangsbalk, tikbaar om naar dat hobbyscherm te gaan. Een disclaimer-regel bovenaan meldt dat dit een premium-functie is die voorlopig gratis werkt zolang er nog geen betaalopties zijn.
- **`src/app/(tabs)/index.tsx`**: nieuwe sectie "Premium" tussen "Spel" en "Overig" met 3 kaarten: Voortgangsdashboard (linkt echt naar `/dashboard`), Meldingen en Cloud Save (geen route — `href: null`). `SECTIONS`-items met `href: null` renderen nu als `TouchableOpacity` i.p.v. `Link`; een tik zet 2,2 seconden lang de beschrijvingsregel op "Komt binnenkort ✨" (coral, vet) in plaats van te navigeren, daarna springt de tekst terug naar de normale beschrijving.

### Bekende bewuste keuzes

- Geen echte IAP/betaalflow, geen accountsysteem, geen pushmeldingen-backend — puur UI-voorbereiding zoals afgesproken. Het dashboard zelf is niet achter een betaalmuur gezet (kan nog niet, er is geen IAP) en is dus voor iedereen gewoon te gebruiken; dat staat expliciet in de disclaimer-tekst op het scherm.
- "Komt binnenkort" is een lokale timeout-gebaseerde tekstwissel in de kaart zelf (geen native `Alert.alert`, geen aparte toast-component) — simpel, werkt identiek op web/native, en blijft consistent met de rest van de homescreen-kaartenstijl.

### Getest

Via `expo start --web` + Playwright met gemockte `remote-content.json`: Premium-sectie op homescreen (NL+EN), tik op Meldingen/Cloud Save toont "Komt binnenkort ✨"/"Coming soon ✨", tik op Voortgangsdashboard navigeert naar een werkend dashboard. Op het dashboard: alle 7 catalogi tonen het juiste totale aantal items (311 in totaal); na het aanvinken van één mastery-item op het Vissen-scherm en terugkeren naar het dashboard klopte de teller meteen (1/85, totaal 1/311) — bevestigt dat de `useFocusEffect`-refresh werkt. Geen console errors.

### Open ideeën / mogelijk vervolg

- IAP/betaling opzetten (RevenueCat oid.) zodra Play Store-publicatie een stap dichterbij is.
- Pushmeldingen: Expo push notifications + een trigger-mechanisme voor "nieuw event"/"bijzonder weer" (vermoedelijk gekoppeld aan het bestaande remote-content-systeem).
- Cloud save: een account-systeem (bv. Supabase/Firebase) nodig om AsyncStorage-voortgang (mastery/sterren per catalogus, missies-vinkjes, to-do, feedback) te syncen tussen toestellen.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 5) — Homescreen-secties herschikt + missies bijgewerkt

**Uitgangspunt:** vervolg op deel 3/4 (hieronder). Gebruiker wilde: (1) het kopje "Dieren" hernoemen naar "Extra", Dog & Cat Moments daaruit weghalen en onder Ocean Cleanup zetten (in de Hobby's-sectie dus), Wilde Dieren + Wilde Ingrediënten blijven achter onder "Extra"; (2) in de "Spel"-sectie Huidig Event en Rainbow & Meteorenregen weghalen, want die staan al als kaartjes bovenaan de homepage (dubbel); (3) bij de dagelijkse missies "Hobby's beoefenen" weghalen en daarvoor "Dagelijkse check-in" toevoegen.

### Wat is gebouwd

- **`src/app/(tabs)/index.tsx`**: `SECTIONS`-array aangepast — Dog & Cat Moments verplaatst naar het eind van de Hobby's-lijst (na Ocean Cleanup), sectielabel "Dieren"/"Animals" hernoemd naar "Extra" (nu alleen Wilde Dieren + Wilde Ingrediënten), Huidig Event en Rainbow & Meteorenregen uit de "Spel"-sectie verwijderd. De routes/schermen zelf (`/events`, `/rainbow-meteor`) bestaan nog gewoon en blijven bereikbaar via de kaartjes bovenaan het homescreen.
- **`src/app/missies.tsx`**: `DAILY`-lijst — item `d5` ("Hobby's beoefenen") verwijderd, nieuw item `d0` ("Dagelijkse check-in"/"Daily check-in") toegevoegd als eerste rij.

### Getest

Via `expo start --web` + Playwright met gemockte `remote-content.json`: homescreen toont Hobby's (incl. Dog & Cat Moments als laatste), Extra (Wilde Dieren + Wilde Ingrediënten), Spel (Missies/Bubbels/Badges/Codes, geen Event/Rainbow meer) — en de Missies-pagina toont "Dagelijkse check-in" als eerste dagelijkse taak zonder "Hobby's beoefenen". Geen console errors.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 4) — Weer-preview toont weekdagnaam i.p.v. "Vandaag"

**Uitgangspunt:** vervolg op deel 3 (net hieronder). Gebruiker wilde dat de ingeklapte preview van het weer-kaartje de echte weekdagnaam toont (bv. "Dinsdag") in plaats van "Vandaag" — elke dag dus de actuele dag van de week.

### Wat is gebouwd

- **`src/data/week-forecast.ts`**: `WeekForecastEntry` kreeg een extra veld `weekdayLabel` — altijd de weekdagnaam, ook voor vandaag (i.t.t. het bestaande `dayLabel`, dat voor vandaag "Vandaag"/"Today" blijft geven).
- **`src/app/(tabs)/index.tsx`**: de ingeklapte preview van het weer-kaartje gebruikt nu `weekForecast[0].weekdayLabel` i.p.v. `dayLabel`. De uitgeklapte lijst blijft ongewijzigd "Vandaag" tonen voor de eerste rij — alleen de preview is aangepast.

### Getest

Via `expo start --web` + Playwright met een gemockte payload met een entry voor de systeemdatum van vandaag (2026-08-06, donderdag): preview toont "Donderdag", uitgeklapte lijst toont nog gewoon "Vandaag" op de eerste rij gevolgd door de overige dagen. Geen console errors.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 3) — Homescreen-volgorde en kaartjes-opmaak op verzoek aangepast

**Uitgangspunt:** gebruiker gaf drie concrete feedbackpunten op het homescreen: (1) het "Weer deze week"-kaartje moet inklapbaar worden zodat het niet te lang wordt zodra vanaf volgende week alle 7 dagen erop staan, (2) het Event-kaartje moet bovenaan staan omdat dat nu een belangrijk onderwerp is, (3) de Rainbow/Meteorenregen- en Zwervende Eik/Fluoriet-kaartjes moeten dezelfde opmaak krijgen als het weer-kaartje: een icoon gevolgd door alleen actief/niet-actief of de plotnaam, zonder aparte labelregel erboven.

### Wat is gebouwd (`src/app/(tabs)/index.tsx`)

- **Volgorde aangepast**: Event-kaartje staat nu direct onder de header, vóór het weer-kaartje (was andersom).
- **"Weer deze week" inklapbaar**: lokale `useState(false)`-toggle, header is nu een `Pressable` met titel + (indien ingeklapt) een preview van vandaag (icoon + dag) + een chevron die 90° roteert bij uitklappen. De volledige dagenlijst wordt alleen gerenderd als `forecastExpanded` true is.
- **Rainbow/Meteor- en Eik/Fluoriet-kaartjes herstijld**: van een stacked layout (icoon boven label boven waarde, `plotsItem`/`plotsLabel`/`plotsValue`) naar een horizontale rij (icoon + waarde-tekst naast elkaar, `plotsRow`/`plotsRowIcon`/`plotsRowText`) — zelfde patroon als de weer-rijen. De losse bijschriften ("🌈 Rainbow", "Zwervende Eik vandaag", etc.) zijn vervallen; het icoon zelf identificeert nu wat er getoond wordt, zoals gevraagd. Bijbehorende ongebruikte STRINGS-velden (`rainbowLabel`, `meteorLabel`, `todayOak`, `todayFluorite`, `rainbowMeteor`) opgeruimd.

### Getest

Via `expo start --web` + Playwright, met `page.route()`-interceptie van `remote-content.json` (proxy in deze omgeving gaf 405 op een directe fetch naar raw.githubusercontent.com vanuit Chromium — geen probleem van de app zelf, alleen van deze testomgeving). Gecontroleerd: NL ingeklapt/uitgeklapt, EN, dark mode — Event bovenaan, weer-kaartje toont "Vrijdag" als preview en klapt naar Vrijdag/Zaterdag/Zondag uit met roterende chevron, rainbow/meteor en plots-kaartjes tonen icoon+tekst zonder labels. Geen console errors.

### Repo-status

Gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later, deel 2) — Weekweer herontworpen naar dagniveau + inhaalslag andere sessie

**Uitgangspunt:** gebruiker had in een andere Claude-sessie (buiten deze chat) al drie dingen gedaan die hier niet gelogd waren — zie hieronder ter aanvulling. Daarna vroeg de gebruiker hier om het "Bijzonder weer deze week"-kaartje anders op te zetten: een echte weekweergave (vandaag t/m zondag) met per dag een status, óók de dagen zonder bijzonderheden (bv. "vrijdag regen, zaterdag warme zon, zondag normale zon/niks bijzonders") i.p.v. alleen bijzondere dagen te noemen.

### Inhaalslag (niet door mij gebouwd, wel nu meegenomen)

Een andere sessie had, zonder dit hier te loggen: `REMOTE_CONTENT_URL` live gezet (wijst naar `remote-content.json` in dit repo zelf via de publieke raw-GitHub-link — het repo is dus publiek gemaakt), een eerste versie van een "Bijzonder weer deze week"-kaartje gebouwd (blok-gebaseerd, `specialWeather`-veld, verborg normale dagen), en 6 schelpnamen bijgewerkt naar de spelupdate van 5 augustus. Ingehaald via `git pull` — alles compileert en werkt.

### Wat is in déze sessie gebouwd

- **`specialWeather` (blok-gebaseerd, `startsAt`) vervangen door `weekForecast`** (dag-gebaseerd, `date` als `"YYYY-MM-DD"`): één entry per kalenderdag, `kind` is nu ook `"normal"` naast `rain`/`rainbow`/`warm_sun`/`meteor`. Geen `labelNl`/`labelEn` meer nodig in de JSON — de app kent een vaste tekst/icoon per `kind` (`src/data/week-forecast.ts`, vervangt `special-weather.ts`).
- Homescreen-kaartje toont nu alle resterende dagen van de week (vandaag t/m zondag), inclusief expliciete "Niks bijzonders"-dagen in een gedempte kleur i.p.v. weggelaten te worden.
- `remote-content.json` bijgewerkt met de echte actuele weekvoorspelling (vrijdag 7 aug: regen, zaterdag 8 aug: warme zon, zondag 9 aug: niks bijzonders) — nog niet gepusht op het moment van committen van code, dus meteen meegenomen in dezelfde commit.
- Na feedback verder versimpeld: de tekstlabel per dag (bv. "Regen") is uit de weekweergave gehaald — alleen het icoontje + dagnaam blijft staan (icoon is zelfverklarend). Het losse "huidig weer nu"-kaartje (blok-gebaseerd, boven de weekweergave) is op verzoek helemaal verwijderd van het homescreen — `src/data/current-weather.ts` bestaat nog (ongebruikt, maar functioneel) mocht dit ooit elders nodig zijn, bv. om automatisch te tonen welke vissen/insecten passen bij het huidige weer.

### Bekende bewuste keuzes

- `date` i.p.v. een terugkerende weekdag-naam, zodat er geen aannames nodig zijn over welke week het is — dagen vóór vandaag verdwijnen vanzelf uit de weergave, hoeven niet handmatig verwijderd te worden.
- Getest met een gemockte payload (route-interceptie op de echte live raw-GitHub-URL, met de lokale `remote-content.json` als body) in beide talen — geen console errors, weekweergave en "niks bijzonders"-styling kloppen.

### Open ideeën / mogelijk vervolg

- Hostingplek/Play Store-punten: ongewijzigd t.o.v. eerdere sessies.

### Repo-status

Alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (nog later) — Event/rainbow/meteor bovenaan homescreen + live spelweer

**Uitgangspunt:** vervolg op de remote-content-infrastructuur van eerder vandaag. Gebruiker wilde (1) het huidige event en de rainbow/meteorenregen-status ook als kaartje bovenaan het homescreen, net als het bestaande Zwervende Eik/Fluoriet-kaartje, en (2) het spelweer (Zonnig/Regen/Regenboog, wisselt elke 6 uur in vaste blokken van 07:00/13:00/19:00/01:00 servertijd) in de app. Gevraagd of het weer per blok voorspelbaar/vast is (dan met een pure klok-widget te doen) of willekeurig (dan moet het via dezelfde remote-content-route als de rest) — antwoord: willekeurig, dus optie B.

### Wat is gebouwd

- **Event- en Rainbow/Meteor-kaartjes bovenaan**: tikbaar, navigeren naar `/events` resp. `/rainbow-meteor`. Rainbow/Meteor toont "Actief nu"/"Niet actief" op basis van of er remote spots binnenkomen.
- **`src/data/event-meta.ts`**: naam/data van het huidige event (remote override of gebundelde Call of Whales-standaard) — nu gedeeld tussen `events.tsx` en het homescreen i.p.v. gedupliceerd.
- **Spelweer** (`src/data/current-weather.ts`): nieuw `weather`-veld in het remote-content-schema — `kind` (`sunny`/`rain`/`rainbow`), `labelNl`/`labelEn`, en `validUntil` (ISO-timestamp UTC van het einde van het huidige 6-uursblok). De app rekent zelf niets uit over de blok-tijden zelf (geen aannames over de tijdzone van de speler of de server nodig) — degene die de content bijwerkt zet gewoon het eindtijdstip van het blok als UTC-timestamp. Als dat tijdstip verstreken is, toont de app "Kan verouderd zijn" i.p.v. te blijven doen alsof het klopt. Weer-kaartje staat helemaal bovenaan.
- **Fetch-interval versoepeld**: `useRemoteContent()` haalt niet meer maar één keer per app-sessie op, maar ververst opnieuw zodra een scherm mount én de laatste geslaagde fetch >5 minuten geleden is — nodig omdat weer elke 6 uur wisselt en de oude "eenmalig ooit"-aanpak dat niet zou oppikken tijdens een langere sessie.

### Bekende bewuste keuzes

- Weer blijft, net als event/rainbow/meteor, afhankelijk van iemand die het handmatig bijwerkt (geen officiële API) — de infrastructuur maakt alleen de *verspreiding* naar gebruikers automatisch.
- Getest met een gemockte remote-payload (via Playwright route-interceptie, `REMOTE_CONTENT_URL` tijdelijk op een test-URL gezet en daarna teruggezet naar `null`): alle vier kaartjes (weer, event, rainbow/meteor, dagelijkse plots) tonen correct actieve data, en het "verouderd weer"-pad (`validUntil` in het verleden) toont ook correct de stale-tekst. `REMOTE_CONTENT_URL` staat na deze sessie weer op `null` — app gedraagt zich identiek aan hiervoor totdat er een hostingplek gekozen wordt.

### Open ideeën / mogelijk vervolg

- Hostingplek kiezen voor het JSON-bestand (ongewijzigd t.o.v. vorige sessie, zie `docs/remote-content.md`).
- Play Store-publicatie (ongewijzigd t.o.v. vorige sessie).
- Zodra er een hostingplek is: iemand moet elke 6 uur het actuele weer + `validUntil` bijwerken in het JSON-bestand, wil dit kaartje kloppen — dat kan bijvoorbeeld door dit elke sessie even te vragen na te kijken, of op termijn een routine/trigger hiervoor in te stellen.

### Repo-status

Alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

## 2026-08-06 (later) — Remote-content infrastructuur voorbereid (rainbow/meteor/dagelijkse plots/event zonder appstore-update bijwerkbaar)

**Uitgangspunt:** gebruiker wil de app straks in de Play Store zetten, en wil dat tijdgebonden content (rainbow-locaties, meteorenregen-ertsplekken, event, en de dagelijkse Zwervende Eik/Fluoriet-plot) bijgewerkt kan worden zonder telkens een nieuwe appversie door de store-review te moeten halen. Ik heb gevraagd waar die content gehost moet worden (nieuwe publieke GitHub-repo / Gist / pas later kiezen); die vraag is niet beantwoord (sessie werd onderbroken), dus heb ik de veilige default gekozen: de app-code voorbereiden met een instelbare URL, hostingkeuze blijft open.

### Wat is gebouwd

- **`src/constants/remote.ts`**: `REMOTE_CONTENT_URL` — nu `null`. Zodra er een hostingplek gekozen is (bv. een raw GitHub-link naar een JSON-bestand, of een Gist), hier invullen. Zolang dit `null` blijft, gedraagt de app zich exact als voorheen (geen netwerkverkeer, alle bundel-standaarden).
- **`src/lib/remote-content.ts`**: gedeelde `useRemoteContent()`-hook — haalt één JSON-payload op, cachet in AsyncStorage, toont meteen gecachte/bundel-data terwijl op de achtergrond ververst wordt, faalt stil (blijft op cache/bundel staan) bij geen internet of als de URL niet is ingesteld. Eén fetch wordt gedeeld tussen alle schermen (geen dubbel ophalen).
- **`docs/remote-content.md`**: het volledige JSON-schema + hosting-instructies, zodat een volgende sessie (of de gebruiker) precies weet hoe het bestand eruit moet zien en waar `REMOTE_CONTENT_URL` op te zetten.
- **Rainbow/Meteor** (`src/data/rainbow-spots.ts`, `meteor-spots.ts`): van statische lege arrays omgezet naar `useRainbowSpots()`/`useMeteorSpots()`-hooks die remote data prefereren, met de bestaande lege bundel-fallback (ongewijzigd gedrag zolang er geen remote data is).
- **Dagelijkse plots** (nieuw, bestond niet eerder in de app — wel als `TODAY_OAK_PLOT`/`TODAY_FLUORITE_PLOT` in het prototype maar nooit overgezet): `src/data/daily-plots.ts` + een kaartje op het homescreen ("Zwervende Eik vandaag" / "Fluoriet-plek vandaag"), toont "Onbekend — vraag het na" zolang er geen remote data is.
- **Huidig Event** (`src/app/events.tsx`): als `payload.event` aanwezig is, overschrijft dat de titel/data/vissen/vogels/recepten; anders blijft de bestaande gebundelde Call of Whales-content (zoals nu al in de app) gewoon getoond.

### Bekende bewuste keuzes

- Geen hostingplek is nog gekozen — `REMOTE_CONTENT_URL` staat op `null`. De app werkt hierdoor identiek aan voor deze wijziging; dit is puur voorbereidend werk.
- Getest via `expo start --web` + Playwright met `REMOTE_CONTENT_URL = null`: homescreen (incl. nieuw plots-kaartje), Rainbow & Meteorenregen, Huidig Event — geen console errors, gedrag ongewijzigd t.o.v. voor deze sessie.

### Open ideeën / mogelijk vervolg

- **Hostingplek kiezen** voor het JSON-bestand (zie `docs/remote-content.md` voor opties) en `REMOTE_CONTENT_URL` invullen.
- **Play Store-publicatie**: `android.package` toevoegen aan `app.json`, `eas.json` opzetten, EAS-build maken, Play Console-account, privacyverklaring, content rating, store-listing (screenshots/beschrijving), en duidelijk maken dat het een onofficiële fan-gids is (geen officiële Heartopia-branding gebruiken).
- Bubbels-locaties (`src/data/bubble-locations.ts`) zijn nu nog steeds volledig statisch — niet meegenomen in deze remote-content-ronde omdat de gebruiker specifiek rainbow/meteor/event/plots noemde. Kan op dezelfde manier aangepakt worden als er behoefte aan is.

### Repo-status

Alles gecommit en gepusht naar `main` op `github.com/Thesilly1995/heartopia-guide`.

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
