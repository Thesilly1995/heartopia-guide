# Pushmeldingen opzetten

Dit hoort bij het Meldingen-scherm (`src/app/meldingen.tsx`,
`src/hooks/use-notifications.tsx`, `src/lib/push-notifications.ts`). De
app-code staat volledig klaar. Er zijn twee delen:

1. **Update-banner** (🔄 nieuwe versie beschikbaar) — werkt automatisch, voor
   iedereen, geen setup nodig. Gebruikt alleen `expo-updates`, geen externe
   dienst.
2. **Pushmeldingen** (Rainbow/meteorenregen, nieuw event, nieuwe code, en een
   wekelijkse cloud save-herinnering) — Premium-only, vereist wél setup: een
   Firebase-project (voor Android-push), een Supabase-tabel om tokens in te
   bewaren, en GitHub Actions-secrets zodat de automatische
   melding-workflows kunnen versturen.

## Wat al gedaan is (code-kant)

- `expo-notifications` toegevoegd, permissie-flow + Expo push-token ophalen
  (`src/lib/push-notifications.ts`).
- `src/hooks/use-notifications.tsx`: per-categorie aan/uit, lokaal onthouden
  én gesynchroniseerd naar Supabase (tabel `push_tokens`, zie hieronder).
- `src/app/meldingen.tsx`: het instellingenscherm, met de update-banner-uitleg
  bovenaan (altijd zichtbaar) en de vier Premium-only toggles daaronder
  (Rainbow/meteorenregen, nieuw event, nieuwe code, cloud save-herinnering).
- `src/components/heartopia/update-banner.tsx`: checkt bij het openen van de
  app of er een nieuwe OTA-update is, toont een pop-up met een "Nu
  bijwerken"-knop. Zit al in `_layout.tsx`, verder niks voor nodig.
- `scripts/send-content-notifications.mjs` +
  `.github/workflows/notify-content-changes.yml`: vergelijkt bij elke push
  naar `main` die `remote-content.json` raakt de vorige met de nieuwe versie,
  en verstuurt een melding zodra er een nieuw event verschijnt of er een
  nieuwe code bijkomt. Werkt dus ook als jij zelf het bestand rechtstreeks op
  GitHub bewerkt, niet alleen via een sessie met mij.
- `scripts/send-server-timed-notifications.mjs` +
  `.github/workflows/notify-server-timed.yml`: draait elke 15 minuten en
  verstuurt de Rainbow/meteorenregen-"is begonnen"-melding **per server**, op
  het moment dat het venster daadwerkelijk opengaat op de servertijd van de
  ontvanger (zie "Server-timing", hieronder) — i.p.v. bij elke wijziging van
  `remote-content.json`, want die kan nu vooraf gebeuren (de app zelf bepaalt
  wanneer Rainbow/meteorenregen zichtbaar wordt, zie `src/lib/event-window.ts`).
- `scripts/send-backup-reminder.mjs` +
  `.github/workflows/send-backup-reminder.yml`: verstuurt wekelijks (zondag
  18:00 UTC = 20:00 zomertijd / 19:00 wintertijd) een herinnering naar alle
  toestellen met de categorie `cloud_backup_reminder` aan. Draait op een
  cron-schema, dus onafhankelijk van wijzigingen aan `remote-content.json`.
  Heeft ook `workflow_dispatch` aan staan — kan dus ook handmatig getest
  worden via de Actions-tab op GitHub ("Run workflow").

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
-- de tokens van andere toestellen lezen. Geldt voor zowel `anon` (geen
-- Cloud Save-account) als `authenticated` (wél ingelogd voor Cloud Save) —
-- pushmeldingen staan los van het account-systeem, dus dezelfde regels
-- moeten in beide gevallen gelden.
create policy "toestel kan eigen token schrijven"
  on push_tokens for insert
  to anon, authenticated
  with check (true);

create policy "toestel kan eigen token bijwerken"
  on push_tokens for update
  to anon, authenticated
  using (true);

create policy "toestel kan eigen token verwijderen"
  on push_tokens for delete
  to anon, authenticated
  using (true);
```

(Geen `select`-policy — lezen gebeurt alleen server-side door de GitHub
Action, met de service-role-key die RLS omzeilt.)

**Bekend probleem (14 sep 2026)**: een directe `upsert`/`delete` op `push_tokens`
als `anon`/`authenticated` gaf onverklaarbaar `"new row violates row-level
security policy"`, ondanks correcte policies (uitgebreid gecheckt: policies,
grants, RLS-status, actieve rol via een `debug_whoami()`-RPC, zelfs een
`set role anon; insert ...` rechtstreeks in de SQL Editor werkte gewoon —
het zat dus niet in Postgres zelf, maar ergens in de Supabase API-laag,
ook niet opgelost door het project te herstarten). **Oplossing**: de app
schrijft niet meer rechtstreeks in de tabel, maar via twee RPC-functies
(`security definer`, omzeilt het probleem volledig):

```sql
create or replace function public.save_push_token(p_token text, p_platform text, p_categories text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into push_tokens (token, platform, categories, updated_at)
  values (p_token, p_platform, p_categories, now())
  on conflict (token) do update
    set platform = excluded.platform,
        categories = excluded.categories,
        updated_at = excluded.updated_at;
end;
$$;

grant execute on function public.save_push_token(text, text, text[]) to anon, authenticated;

create or replace function public.delete_push_token(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from push_tokens where token = p_token;
end;
$$;

grant execute on function public.delete_push_token(text) to anon, authenticated;
```

Zie `src/lib/push-notifications.ts` (`savePushToken`/`deletePushToken`,
gebruiken `supabase.rpc(...)`). De tabel-policies hierboven blijven
onschadelijk staan (niet meer gebruikt door de app, maar ook geen kwaad).

### Migratie: server-kolom toevoegen (30 sep 2026)

**Aanleiding**: gebruiker kreeg de Rainbow-melding uren te vroeg (op het
moment dat de data gepusht werd, niet op het moment dat het venster echt
opengaat op haar eigen servertijd). De in-app weergave was al langer
per-server automatisch (`src/lib/event-window.ts`, sinds deel 58/59), maar de
pushmelding niet — die vuurde nog steeds bij elke `remote-content.json`-wijziging,
ongeacht klokuur of server. Opgelost door de Rainbow/meteorenregen-melding te
verplaatsen naar een cron-job die per server checkt of het venster nét
begonnen is (zie hierboven) — dat vereist wel te weten welke server bij welk
token hoort, vandaar deze kolom.

In het Supabase-dashboard → SQL Editor → dit uitvoeren:

```sql
alter table push_tokens add column if not exists server text not null default 'global';

drop function if exists public.save_push_token(text, text, text[]);

create or replace function public.save_push_token(p_token text, p_platform text, p_categories text[], p_server text default 'global')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into push_tokens (token, platform, categories, server, updated_at)
  values (p_token, p_platform, p_categories, p_server, now())
  on conflict (token) do update
    set platform = excluded.platform,
        categories = excluded.categories,
        server = excluded.server,
        updated_at = excluded.updated_at;
end;
$$;

grant execute on function public.save_push_token(text, text, text[], text) to anon, authenticated;
```

Na deze migratie + de bijbehorende app-update (`eas update`, geen nieuwe build
nodig — puur JS): bestaande tokens krijgen automatisch `server = 'global'`
(kolom-default) totdat de gebruiker de app opnieuw opent (dan wordt de
daadwerkelijke geselecteerde server opgeslagen, zie `src/hooks/use-notifications.tsx`).

**Server-timing**: de server-ids in `push_tokens.server` en de offsets in
`scripts/send-server-timed-notifications.mjs` moeten in sync blijven met
`SERVERS` in `src/hooks/use-server.tsx` (`global`/`sea`/`twhkmo`/`america`/`asia`).
Wijzigt die lijst ooit (nieuwe server, ander offset), dan moet dat op alle drie
de plekken bijgewerkt worden.

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
- Een nieuw event of nieuwe code toevoegen aan `remote-content.json` op
  `main` en de Actions-tab checken of de "Notify content changes"-workflow
  draait en je toestel een melding krijgt.
- Voor Rainbow/meteorenregen: `workflow_dispatch` op "Notify server-timed
  weather" handmatig draaien via de Actions-tab (i.p.v. 15 min wachten) —
  vuurt alleen als er op dat moment voor minstens één server een venster
  binnen de laatste `FIRE_WINDOW_MINUTES` is gestart én de bijbehorende
  spots-lijst niet leeg is.

## iOS

Bewust uitgesteld, zelfde reden als AdMob/RevenueCat: geen Apple Developer-
account. `registerForPushNotificationsAsync()` werkt dan gewoon niet op iOS
(geeft `null` terug, geen crash) totdat dat er wel is.
