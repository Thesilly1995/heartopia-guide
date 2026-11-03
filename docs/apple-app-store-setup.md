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

- [x] Ingeschreven, betaald en geverifieerd — account is actief.

## 2. AdMob — iOS App-ID en ad unit aanmaken

- [x] iOS-app aangemaakt in AdMob, App-ID `ca-app-pub-4511788652457861~2746550352`
      ingevuld in `app.json`.
- [x] Banner-advertentie-eenheid aangemaakt, Ad unit-ID
      `ca-app-pub-4511788652457861/9419769918` ingevuld in
      `src/constants/ads.ts`.
- [ ] Nog in een (gecombineerde) `eas build` nodig — zit in native config, dus
      geen `eas update`.

## 3. RevenueCat — iOS product + key

- [x] Paid Apps Agreement actief (Legal Entity, Banking, Tax/W-8BEN en
      DSA-trader-status allemaal afgerond).

Zelfde stappen als in `docs/revenuecat-setup.md`, nu voor iOS:

- [x] In App Store Connect: Subscription Group "Heartopedia Premium"
      aangemaakt met `heartopedia_premium_monthly` (€2,99/maand) en
      `heartopedia_premium_annual` (€29,99/jaar), beide op "Prepare for
      Submission" (nog niet ingediend voor review).
- [x] In RevenueCat: iOS-app toegevoegd aan het project, App Store Connect
      gekoppeld (via een In-App Purchase-key, niet de algemene App Store
      Connect API-key), beide producten gekoppeld aan dezelfde
      `premium`-entitlement als Android (nu 4 producten in totaal).
- [x] `src/constants/purchases.ts` → `REVENUECAT_API_KEY_IOS` ingevuld.
- [ ] Nieuwe `eas build` nodig (key zit in de JS-bundle) — kan gecombineerd
      met de andere punten die ook een build nodig hebben.

## 4. Push notifications — APNs

- [x] Push key aangemaakt en gekoppeld aan het EAS-project via
      `eas credentials` (ingelogd met Apple ID, EAS regelde de key
      automatisch — Developer Portal ID `K8JN4JYR65`).
- [x] Geen codewijziging nodig — `registerForPushNotificationsAsync()` werkt
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
