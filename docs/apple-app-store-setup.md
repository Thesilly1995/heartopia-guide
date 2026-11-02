# Heartopedia naar de Apple App Store

Checklist voor de iOS-release. De Android-app (Play Store) staat al live; dit
document is het vervolg zodra er een Apple Developer-account is — tot die tijd
was dit bewust uitgesteld (zie sessielog deel 13 en de iOS-paragrafen in
`admob-setup.md`/`revenuecat-setup.md`/`push-notifications-setup.md`).

Je hebt hiervoor **geen Mac nodig** — EAS Build maakt de iOS-build in de
cloud, ook zonder Apple-hardware.

## ✅ Al gedaan (code-kant, zonder Apple-account mogelijk)

- [x] `app.json` → `ios.bundleIdentifier` gezet op `com.thesilly1995.heartopiagids`
      (zelfde pakketnaam als Android — moet straks exact zo in App Store
      Connect worden ingevuld).

## 1. Apple Developer Account aanmaken

- [x] Ingeschreven en betaald (€99/jaar).
- [ ] Wacht op verificatie door Apple (kan enkele uren tot 1-2 dagen duren —
      je krijgt een mail zodra het account actief is).

## 2. AdMob — iOS App-ID en ad unit aanmaken

Zelfde stappen als in `docs/admob-setup.md` deed voor Android, nu voor iOS:

- [ ] [apps.admob.com](https://apps.admob.com) → **Apps → App toevoegen** →
      platform **iOS** → naam `Heartopedia`.
- [ ] Nieuwe **banner-advertentie-eenheid** aanmaken (zelfde als Android-stap 2
      in `admob-setup.md`).
- [ ] In `app.json`, bij de `react-native-google-mobile-ads`-plugin, `iosAppId`
      vervangen (staat nu nog op Google's test-ID
      `ca-app-pub-3940256099942544~1458002511`).
- [ ] In `src/constants/ads.ts`, `PRODUCTION_BANNER_AD_UNIT_ID.ios` invullen
      (staat nu op `null`).
- [ ] Nieuwe `eas build` nodig na deze wijziging (zit in native config).

## 3. RevenueCat — iOS product + key

Zelfde stappen als in `docs/revenuecat-setup.md`, nu voor iOS:

- [ ] In App Store Connect: in-app-abonnementen aanmaken (Monthly + Annual,
      zelfde structuur als de Google Play-producten).
- [ ] In RevenueCat: iOS-app toevoegen aan het project, App Store Connect
      koppelen (API-key vanuit App Store Connect → Users and Access →
      Integrations), de twee producten aan dezelfde `premium`-entitlement
      hangen als Android.
- [ ] `src/constants/purchases.ts` → `REVENUECAT_API_KEY_IOS` invullen (staat
      nu leeg).
- [ ] Nieuwe `eas build` nodig (key zit in de JS-bundle).

## 4. Push notifications — APNs

Zelfde flow als `docs/push-notifications-setup.md`, nu voor iOS:

- [ ] In Apple Developer account: **Certificates, Identifiers & Profiles** →
      een APNs-key aanmaken (.p8-bestand + Key ID + Team ID).
- [ ] Die gegevens uploaden naar het Expo-project
      (`eas credentials` → iOS → Push Notifications), of via de
      Expo-dashboard.
- [ ] Geen codewijziging nodig — `registerForPushNotificationsAsync()` werkt
      dan vanzelf ook op iOS (geeft nu nog gewoon `null` terug, geen crash).

## 5. App Store Connect — de listing

- [ ] App aanmaken in [appstoreconnect.apple.com](https://appstoreconnect.apple.com),
      bundle ID `com.thesilly1995.heartopiagids` koppelen.
- [ ] Screenshots in de vereiste iPhone-formaten (6,9" en 6,5" verplicht;
      bestaande Play Store-screenshots zijn andere verhoudingen, dus nieuwe
      nodig — zie `docs/play-store-listing.md` voor de teksten die hergebruikt
      kunnen worden).
- [ ] Beschrijving/trefwoorden: tekst uit `docs/play-store-listing.md` als
      basis.
- [ ] Privacybeleid-URL: `docs/privacy-policy.html` (moet ergens gehost staan,
      bv. als GitHub Pages — check of dat al zo is of nog moet gebeuren).
- [ ] Leeftijdsclassificatie invullen (vragenlijst in App Store Connect).
- [ ] **App Privacy**-vragenlijst invullen: welke data verzameld wordt via
      AdMob (advertentie-ID, diagnostiek), RevenueCat (aankoopgeschiedenis) en
      Supabase (push-token, cloud-save/account-gegevens indien van toepassing).

## 6. Build, testen, indienen

- [ ] `eas build --platform ios` (genereert certificaten/profielen automatisch
      via EAS, geen handmatig Xcode-werk nodig).
- [ ] Build testen via **TestFlight** (eigen toestel + evt. een paar
      testers toevoegen).
- [ ] `eas submit --platform ios` → koppelt de build aan de App Store Connect-listing.
- [ ] Apple-review afwachten (meestal 1-3 dagen, soms vragen ze om
      verduidelijking — reageer gewoon in Resolution Center).

## Let op

- Punten 2-4 vereisen elk een nieuwe `eas build`, maar kunnen prima **samen**
  in één build verwerkt worden — geen reden om na elke stap apart te bouwen.
- Zodra de iOS-app live is, kan de webversie-melding in
  `src/components/heartopia/premium-locked.tsx` (`webNotice`, alle 6 talen)
  eventueel aangepast worden — die zegt nu "Premium is alleen te koop in de
  Heartopedia Android-app", wat na de iOS-release niet meer helemaal klopt.
