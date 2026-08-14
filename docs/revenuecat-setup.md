# RevenueCat opzetten voor echte Premium-aankopen (€4,99 eenmalig)

Dit hoort bij het Premium-slot (`src/hooks/use-premium.tsx`,
`src/components/heartopia/premium-locked.tsx`). De code staat klaar en gebruikt
`react-native-purchases` (RevenueCat SDK) — zonder een echte API-key blijft
premium gewoon uit en tonen de sloten "Aankopen zijn nog niet beschikbaar".

## Wat al gedaan is (sessie 14 aug 2026)

1. Google Cloud-project `heartopedia-revenuecat` aangemaakt, **Google Play
   Android Developer API** ingeschakeld.
2. Serviceaccount aangemaakt: `heartopedia-revenuecat@heartopedia-revenuecat.iam.gserviceaccount.com`,
   JSON-sleutel gegenereerd en geüpload in RevenueCat's Play Store-configuratie.
3. Dat serviceaccount heeft in Play Console (Gebruikers en rechten) toegang
   gekregen tot Heartopedia met: "Financiële gegevens, bestellingen en
   enquêtes over annuleringen bekijken", "Bestellingen en abonnementen
   beheren", "App-informatie en bulkrapporten bekijken (alleen-lezen)".
   RevenueCat's "Check credentials" gaf groen licht op alle 3.
4. Google Payments-verkopersaccount aangemaakt (vereist om iets te kunnen
   verkopen in Play Console).
5. `react-native-purchases` toegevoegd aan de app — dit voegt automatisch het
   `BILLING`-recht toe aan de APK/AAB. **Vereist een nieuwe build** voordat
   Play Console je toestaat een in-app product aan te maken (Play Console
   blokkeert dat scherm zolang de laatst geüploade build geen BILLING-recht
   heeft).

## Nog te doen, in deze volgorde

### 1. Nieuwe build uploaden

`eas build --profile production --platform android` draaien en de resulterende
`.aab` uploaden naar Play Console (zelfde flow als altijd). Zodra die build
staat, is de blokkade op het volgende punt weg.

### 2. In-app product aanmaken in Play Console

Heartopedia-app → **Inkomsten genereren met Play → Producten →
In-app-producten → Product maken**:

- **Product-ID**: `heartopedia_premium` (kleine letters, kan later niet meer
  wijzigen — de code verwacht geen specifieke ID, dus deze naam is een eigen
  keuze, geen technische vereiste)
- **Naam**: Premium
- **Beschrijving**: "Ontgrendelt het voortgangsdashboard, cloud save en een
  reclamevrije ervaring."
- **Prijs**: €4,99
- Status op **Actief** zetten.

### 3. Entitlement + Offering in RevenueCat

In RevenueCat (project Heartopedia):

1. **Entitlements → New** → identifier moet exact **`premium`** zijn (de code
   in `src/constants/purchases.ts` — `PREMIUM_ENTITLEMENT_ID` — verwacht deze
   naam letterlijk).
2. Koppel het Play Store-product `heartopedia_premium` aan deze entitlement.
3. **Offerings → New offering** (of gebruik de standaard "default") → voeg een
   **Package** toe die naar het `heartopedia_premium`-product wijst.
4. Zet deze Offering als **Current**.

### 4. API-key ophalen en invullen

RevenueCat → **Project settings → API keys → Google Play** — kopieer de
**Public API key** (begint met `goog_...`).

Vul die in `src/constants/purchases.ts`:

```ts
const REVENUECAT_API_KEY_ANDROID = 'goog_XXXXXXXXXXXXXXXXXXXXXXXXXXX';
```

(`REVENUECAT_API_KEY_IOS` mag leeg blijven zolang er geen Apple Developer-
account is, zelfde afspraak als bij AdMob.)

### 5. Nog een build

De API-key zit in de JS-bundel, dus ook hiervoor is een nieuwe
`eas build` + Play Console-upload nodig voordat de knop echt werkt.

## Testen zonder echt te betalen

Voeg je eigen Google-account toe als **License tester** in Play Console
(Instellingen/Setup → daar waar de licentie-testers staan) — daarmee kan je
de echte koopflow doorlopen zonder dat er geld wordt afgeschreven. Zonder dit
worden testaankopen gewoon als echte aankopen verwerkt.

## Test-schakelaar tijdens development

`src/hooks/use-premium.tsx` heeft nog een lokale `__DEV__`-only test-toggle
(zichtbaar als "Test-premium aanzetten" onderaan het slotscherm, alleen in
`expo start`, nooit in een build) — handig om snel te zien hoe de app met
premium aanvoelt zonder de hele koopflow te doorlopen. Testers zien dit nooit.
