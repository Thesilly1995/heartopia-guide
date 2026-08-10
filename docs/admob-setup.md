# AdMob opzetten voor echte advertenties

Dit hoort bij de advertentiebanner (niet-Premium gebruikers, `src/components/heartopia/ad-banner.tsx`).
De app-code staat al klaar en gebruikt tot nu toe Google's publieke **test**-ID's —
deze stappen zijn wat jij zelf in de AdMob-console moet doen om daar echte ID's
voor terug te krijgen. Alleen Android hieronder, want Apple Developer is bewust
uitgesteld (zie sessielog deel 13) — de iOS-kant blijft gewoon op de test-ID
draaien tot dat verandert, dat hoeft niet te blokkeren.

## 1. App toevoegen in AdMob

1. Ga naar [apps.admob.com](https://apps.admob.com) (zelfde Google-account als
   Play Console, hoeft niet perse).
2. **Apps → App toevoegen** → "Is de app al gepubliceerd op Google Play?" →
   als de production-build nog niet in een testtrack/productie staat: **Nee**,
   handmatig invullen.
3. Platform: **Android**. App-naam: `Heartopedia`.
4. Zodra de app in Play Console staat (interne test is genoeg), kun je 'm
   later alsnog koppelen via "Zoek naar je app op Google Play" — pakketnaam
   is `com.thesilly1995.heartopiagids`.
5. Na het aanmaken krijg je een **App-ID** in de vorm
   `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`. Kopieer die.

## 2. Banner-advertentie-eenheid aanmaken

1. In de nieuwe app → **Advertentie-eenheden → Advertentie-eenheid toevoegen**.
2. Type: **Banner**.
3. Naam: bv. `Heartopedia Android Banner`.
4. Na het aanmaken krijg je een **Ad unit-ID**, vorm
   `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ` (let op: `/` i.p.v. `~`). Kopieer die.

## 3. ID's in de code invullen

Twee plekken, allebei nog op Google's test-ID's:

**`app.json`** — zoek de `react-native-google-mobile-ads`-plugin-config en
vervang `androidAppId` (laat `iosAppId` staan zoals 'ie is):

```json
["react-native-google-mobile-ads", {
  "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
  "iosAppId": "ca-app-pub-3940256099942544~1458002511"
}]
```

**`src/constants/ads.ts`** — vul `android` in bij `PRODUCTION_BANNER_AD_UNIT_ID`
(laat `ios: null` staan):

```ts
const PRODUCTION_BANNER_AD_UNIT_ID: { android: string | null; ios: string | null } = {
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ',
  ios: null,
};
```

## 4. Nieuwe build nodig

De App-ID in `app.json` zit in de native config (AndroidManifest.xml na
prebuild) — dat verandert pas na een nieuwe `eas build`. Alleen
`ads.ts` aanpassen zonder ook `app.json` bij te werken laat de banner een
mismatch-fout geven. Doe beide tegelijk, dan één keer opnieuw builden.

## Let op tijdens testen

Zolang je zelf op je eigen toestel test (ook met een productie-build), telt
elke keer dat je zelf op de advertentie tikt of 'm veel ziet als **invalid
traffic** en kan dat je AdMob-account laten waarschuwen/blokkeren. AdMob
heeft hiervoor **testapparaten**: Instellingen → Testapparaten → je eigen
apparaat-ID toevoegen (verschijnt in de Logcat/Metro-logs als de banner
laadt) zodat je altijd een duidelijk gelabelde test-advertentie ziet, ook
met de echte ad-unit-ID.
