# Pushmeldingen opzetten

Dit hoort bij het Meldingen-scherm (`src/app/meldingen.tsx`,
`src/hooks/use-notifications.tsx`, `src/lib/push-notifications.ts`). De
app-code staat volledig klaar. Er zijn twee delen:

1. **Update-banner** (🔄 nieuwe versie beschikbaar) — werkt automatisch, voor
   iedereen, geen setup nodig. Gebruikt alleen `expo-updates`, geen externe
   dienst.
2. **Pushmeldingen** (Rainbow/meteorenregen, nieuw event, nieuwe code) —
   Premium-only, vereist wél setup: een Firebase-project (voor Android-push),
   een Supabase-tabel om tokens in te bewaren, en een GitHub Actions-secret
   zodat de automatische melding-workflow kan versturen.

## Wat al gedaan is (code-kant)

- `expo-notifications` toegevoegd, permissie-flow + Expo push-token ophalen
  (`src/lib/push-notifications.ts`).
- `src/hooks/use-notifications.tsx`: per-categorie aan/uit, lokaal onthouden
  én gesynchroniseerd naar Supabase (tabel `push_tokens`, zie hieronder).
- `src/app/meldingen.tsx`: het instellingenscherm, met de update-banner-uitleg
  bovenaan (altijd zichtbaar) en de drie Premium-only toggles daaronder.
- `src/components/heartopia/update-banner.tsx`: checkt bij het openen van de
  app of er een nieuwe OTA-update is, toont een pop-up met een "Nu
  bijwerken"-knop. Zit al in `_layout.tsx`, verder niks voor nodig.
- `scripts/send-content-notifications.mjs` +
  `.github/workflows/notify-content-changes.yml`: vergelijkt bij elke push
  naar `main` die `remote-content.json` raakt de vorige met de nieuwe versie,
  en verstuurt een melding zodra Rainbow/meteorenregen van leeg naar gevuld
  gaat (= net begonnen), er een nieuw event verschijnt, of er een nieuwe code
  bijkomt. Werkt dus ook als jij zelf het bestand rechtstreeks op GitHub
  bewerkt, niet alleen via een sessie met mij.

**Vereist een nieuwe build** (native module, zoals AdMob/RevenueCat eerder) —
puur `eas update` is niet genoeg.

## Nog te doen, in deze volgorde

### 1. Firebase-project voor Android-push

1. Ga naar [Firebase Console](https://console.firebase.google.com) → nieuw
   project aanmaken (of een bestaand Google-project hergebruiken).
2. Voeg een Android-app toe met pakketnaam **`com.thesilly1995.heartopiagids`**
   (moet exact matchen, zelfde als bij AdMob/Play Console).
3. Download `google-services.json` uit de Firebase Console, zet 'm in de
   root van de repo, en stuur 'm naar mij (of plak de inhoud) zodat ik
   `"android.googleServicesFile": "./google-services.json"` aan `app.json`
   toevoeg. **Niet zelf in de repo committen als er gevoelige velden in
   zitten** — dit bestand bevat geen geheime sleutel (client-side config),
   dus committen mag normaal gesproken gewoon, maar zeg het even als je twijfelt.
4. Project Settings → **Service Accounts** → "Generate New Private Key" →
   bewaar dat JSON-bestand veilig (bevat wél een geheime sleutel — nooit
   committen, nooit naar mij sturen via de repo).
5. Draai zelf (vereist EAS-login, kan niet vanuit deze sandbox):
   ```
   eas credentials
   ```
   → Android → production → **Google Service Account** → upload het
   private-key-JSON-bestand uit stap 4.

### 2. Supabase-tabel aanmaken

In het Supabase-dashboard (zelfde project als Cloud Save/Feedback) → SQL
Editor → dit uitvoeren:

```sql
create table push_tokens (
  token text primary key,
  platform text not null,
  categories text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table push_tokens enable row level security;

-- Toestellen mogen hun eigen token aanmaken/bijwerken/verwijderen, maar niet
-- de tokens van andere toestellen lezen (geen account-systeem, dus dit is
-- puur schrijf-toegang voor de anon-key vanuit de app).
create policy "anon kan eigen token schrijven"
  on push_tokens for insert
  to anon
  with check (true);

create policy "anon kan eigen token bijwerken"
  on push_tokens for update
  to anon
  using (true);

create policy "anon kan eigen token verwijderen"
  on push_tokens for delete
  to anon
  using (true);
```

(Geen `select`-policy voor `anon` — lezen gebeurt alleen server-side door de
GitHub Action, met de service-role-key die RLS omzeilt.)

### 3. GitHub Actions-secrets instellen

Repo → **Settings → Secrets and variables → Actions → New repository
secret**, twee toevoegen:

- `SUPABASE_URL` — dezelfde als in `src/constants/supabase.ts`
  (`https://dhttdbbnxynaqycjlltd.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase-dashboard → Project Settings → API
  → **service_role key** (⚠️ geheim, nooit in de app-code of een publieke
  plek zetten — alleen als GitHub-secret, die alleen de Action zelf kan
  lezen).

### 4. Nieuwe build

`eas build --profile production --platform android` — neemt
`expo-notifications` + de Firebase-config mee. Daarna testen: Meldingen-
scherm openen (als Premium-lid), een categorie aanzetten, toestemming geven.

## Testen

- Permissie-flow: categorie aanzetten in het Meldingen-scherm, toestel vraagt
  om toestemming (alleen de eerste keer).
- Check in Supabase (tabel `push_tokens`) of er een rij met je token
  verschijnt.
- Een test-wijziging pushen naar `remote-content.json` op `main` (bv.
  `rainbowSpots` van `[]` naar een paar testpunten) en de Actions-tab op
  GitHub checken of de workflow draait en of je toestel een melding krijgt.

## iOS

Bewust uitgesteld, zelfde reden als AdMob/RevenueCat: geen Apple Developer-
account. `registerForPushNotificationsAsync()` werkt dan gewoon niet op iOS
(geeft `null` terug, geen crash) totdat dat er wel is.
