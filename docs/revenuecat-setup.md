# RevenueCat opzetten voor echte Premium-aankopen

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

## Migratie: maand- + jaarabonnement naast de bestaande eenmalige aankoop (okt 2026)

**Aanleiding**: eenmalig Premium (€4,99) wordt vervangen door een abonnement
(€3/maand, €30/jaar — "2 maanden gratis"), omdat de doorlopende
onderhoudskosten (servers, API's) niet in verhouding stonden tot een
eenmalig bedrag. **Bestaande kopers van de eenmalige `heartopedia_premium`
hoeven niets te doen en verliezen niets**: hun aankoop blijft gewoon gekoppeld
aan de `premium`-entitlement in RevenueCat (niet-verlopend), en de
`isPremiumActive()`-check in `src/constants/purchases.ts` kijkt alleen naar
of die entitlement actief is — niet naar wélk product 'm heeft geactiveerd.
Geen migratie-actie nodig, puur nieuwe producten toevoegen naast het oude.

De code (`src/constants/purchases.ts`, `src/hooks/use-premium.tsx`,
`src/components/heartopia/premium-locked.tsx`) is al aangepast en verwacht nu
een **abonnement-Offering met een `monthly`- en een `annual`-package**
(RevenueCat's `PurchasesOffering.monthly` / `.annual`, gevuld op basis van het
package-type dat je in stap 3 hieronder instelt) — niet meer
`availablePackages[0]` zoals bij de oude eenmalige aankoop. Het slotscherm
toont nu automatisch twee knoppen (maandelijks/jaarlijks, met "2 maanden
gratis"-badge op de jaarlijkse) zodra beide packages bestaan.

### 1. Twee nieuwe abonnement-producten in Play Console

Play Console gebruikt voor abonnementen een ander producttype dan de oude
eenmalige aankoop: **Inkomsten genereren met Play → Producten →
Abonnementen → Abonnement maken** (niet "In-app-producten", dat is alleen
voor eenmalige aankopen).

- **Abonnement-ID**: bv. `heartopedia_premium_sub` (één abonnement-product
  kan meerdere **basisplannen** met verschillende periodes bevatten — dus
  één abonnement-product volstaat voor zowel maand- als jaarplan).
- Daarbinnen twee **basisplannen** aanmaken:
  - Basisplan-ID `monthly`, factureringsperiode **Maandelijks**, prijs **€3,00**.
  - Basisplan-ID `annual`, factureringsperiode **Jaarlijks**, prijs **€30,00**.
- Beide basisplannen op **Actief** zetten.
- De oude eenmalige `heartopedia_premium` (in-app-product) laat je gewoon
  staan — niet verwijderen of op inactief zetten, anders kunnen bestaande
  kopers 'm niet meer terugvinden bij "Aankopen herstellen"/opnieuw
  installeren. Hij wordt vanzelf niet meer aangeboden omdat de app 'm niet
  meer opvraagt (zie hierboven).

### 2. Build met BILLING-recht

Als er al een build is geüpload met `react-native-purchases` (zie stap 1
hierboven, sessie 14 aug) dan hoeft dit niet opnieuw — het `BILLING`-recht
zit al in de APK/AAB sinds die build. Alleen een nieuwe build nodig als de
huidige live build ouder is dan die wijziging.

### 3. Basisplannen koppelen aan dezelfde `premium`-entitlement in RevenueCat

In RevenueCat (project Heartopedia):

1. **Products → New** (of "Import" vanuit Play Console) voor beide
   basisplannen (`monthly` en `annual` van `heartopedia_premium_sub`).
2. Koppel **beide** aan de bestaande **`premium`**-entitlement (dezelfde
   waar `heartopedia_premium` ook al aan hangt) — dit is de kern van de hele
   migratie: drie verschillende producten (1 eenmalig + 2 abonnementen),
   allemaal dezelfde entitlement, dus de app-code hoeft niet te weten welk
   product iemand precies heeft gekocht.
3. In de bestaande (of een nieuwe) **Offering**: twee packages toevoegen met
   package-type **Monthly** → wijst naar het `monthly`-basisplan, en
   **Annual** → wijst naar het `annual`-basisplan. (Het bestaande
   eenmalige package mag blijven staan in dezelfde Offering — de app vraagt
   er alleen niet meer naar.)
4. Zorg dat deze Offering **Current** staat.

### 4. Testen

Zelfde licentie-tester-account als bij de oude aankoop (Play Console →
licentie-testers) kan ook abonnementen "kopen" zonder dat er geld wordt
afgeschreven, inclusief een versnelde test-renewal-cyclus (Google vernieuwt
testabonnementen in minuten i.p.v. maanden, handig om de hele flow te
controleren). Check in de app: beide knoppen tonen de juiste
Play Store-prijs (`€3,00`/`€30,00`), en na aankoop van **beide** varianten
hoort `premium` in de app actief te worden.
