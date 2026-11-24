# Firebase Analytics opzetten

Doel: downloads/opens van Android én iOS samen zien in één gratis dashboard
(Firebase Console → Analytics), in plaats van los in Play Console en App
Store Connect. De app-code staat al klaar (`@react-native-firebase/app` +
`@react-native-firebase/analytics`, `src/lib/analytics.ts`, ingehaakt in
`src/app/_layout.tsx`) — dit zijn de stappen die jij zelf nog moet doen.

## Belangrijk: dit vereist een nieuwe `eas build`, geen `eas update`

Dit voegt **nieuwe native dependencies** toe (net als destijds de
bubbelkaart-deelfunctie, zie `docs/SESSION_LOG.md` 15/16 nov). Dat betekent:

- **Nooit** deze branch rechtstreeks naar `main` mergen totdat je er een
  volledige `eas build` voor beide platforms mee hebt gedraaid. Als dit per
  ongeluk via `eas update` live gaat vóórdat de build bestaat, crasht de app
  voor iedereen op de huidige build (1.0.1) — exact hetzelfde scenario als
  toen.
- Zodra je klaar bent om de nieuwe build te maken (jij gaf aan: pas na
  Apple's goedkeuring): laat het weten, dan merge ik deze branch naar `main`
  vlak vóór die build, niet eerder.

## 1. iOS-app toevoegen aan het bestaande Firebase-project

Er bestaat al een Firebase-project (`heartopedia-cadb3`) voor de
push-notificaties — daar hoeft geen nieuw project voor te komen.

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com)
   → open project **heartopedia-cadb3**.
2. Project settings (tandwiel, linksboven) → onderaan "Your apps" → **"Add
   app"** → kies het iOS-icoon.
3. Bundle ID: `com.thesilly1995.heartopiagids` (zelfde als in `app.json`).
   App nickname mag "Heartopedia iOS" zijn, App Store ID mag je leeg laten
   of later invullen.
4. Download het bestand **`GoogleService-Info.plist`** dat Firebase je geeft.
5. Zet dat bestand in de root van dit project (zelfde map als
   `google-services.json`), met exact die bestandsnaam.
6. De rest van de wizard ("Add Firebase SDK" / cocoapods-instructies) kun je
   overslaan — dat regelt EAS Build automatisch via de config plugin in
   `app.json`.

## 2. Analytics aanzetten (meestal al standaard aan)

Firebase Console → **Analytics** (linkermenu) → als er nog "Analytics
inschakelen" staat, klik dat aan. Meestal staat dit al aan zodra er een app
aan het project hangt.

## 3. Build maken (zodra je zover bent)

```
git pull
eas build --profile production --platform all
```

(Niet `eas update` — zie boven.) Na de build-submissie naar de stores duurt
het meestal enkele uren voordat de eerste `first_open`-events in Firebase
Analytics verschijnen (er zit vertraging in de rapportage, dat is normaal).

## Wat je straks ziet

Firebase Console → Analytics → Realtime/Dashboard toont actieve
gebruikers en opens van **beide platforms samen**, zonder onderscheid
(tenzij je zelf filtert op platform). Downloadaantallen zelf (hoe vaak de
app uit de store is gehaald) blijven wel apart in Play Console/App Store
Connect — Firebase telt *opens/actieve gebruikers*, geen store-downloads.
