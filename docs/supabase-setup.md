# Supabase opzetten voor Cloud Save

Dit hoort bij de Cloud Save-feature (Premium-sectie op het homescreen). De app-code
staat al klaar (`src/constants/supabase.ts`, `src/hooks/use-auth.tsx`,
`src/data/cloud-sync.ts`, `src/app/cloud-save.tsx`) — deze stappen zijn wat jij zelf
in het Supabase-dashboard moet doen voordat het écht werkt.

## 1. Project aanmaken

1. Ga naar [supabase.com](https://supabase.com) → account aanmaken (kan met het
   Google-account waarmee je ook bij AdMob zit, hoeft niet).
2. "New project" → kies een naam (bv. `heartopia-guide`) en een wachtwoord voor de
   database (bewaar dit ergens veilig, niet nodig voor de app zelf).
3. Wacht tot het project klaar is (paar minuten).

## 2. E-mail/wachtwoord-login aanzetten

Authentication → Providers → **Email** staat standaard al aan. Je kan onder
Authentication → Settings desgewenst "Confirm email" uitzetten tijdens het testen
(anders moet elk test-account eerst een bevestigingsmail aanklikken).

## 3. Tabel + beveiliging aanmaken

Ga naar **SQL Editor** → New query, en plak dit:

```sql
create table cloud_saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table cloud_saves enable row level security;

create policy "Users can read their own save"
  on cloud_saves for select
  using (auth.uid() = user_id);

create policy "Users can insert their own save"
  on cloud_saves for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own save"
  on cloud_saves for update
  using (auth.uid() = user_id);
```

Dit zorgt ervoor dat elke gebruiker alleen zijn/haar eigen rij kan lezen/schrijven —
niemand kan bij andermans voortgang, ook niet via de anon key.

## 4. App koppelen

Project Settings → API, en kopieer:
- **Project URL**
- **anon public** key (niet de `service_role`-key, die hoort nooit in de app)

Vul die twee in bij `SUPABASE_URL` en `SUPABASE_ANON_KEY` in
`src/constants/supabase.ts`. Zodra beide ingevuld zijn, schakelt de app
automatisch van "Cloud save wordt nog opgezet" naar het echte login-scherm.

## Wat de app al doet

- **Login**: e-mail + wachtwoord (aanmaken/inloggen), via Supabase Auth.
- **Back-up**: verzamelt alle lokale voortgang (`AsyncStorage`-sleutels die met
  `heartopia:` beginnen, met uitzondering van device-lokale instellingen zoals de
  premium-test-toggle) en zet die als één JSON-blob in `cloud_saves.data`.
- **Herstellen**: haalt die JSON-blob op en zet 'm terug in `AsyncStorage` op het
  huidige toestel (met bevestigingsdialoog, want dit overschrijft lokale voortgang).

Er is geen automatische/achtergrond-sync — de gebruiker moet zelf op "Nu
back-uppen" / "Herstellen vanaf cloud" tikken. Dat kan later uitgebreid worden
(bv. automatisch back-uppen bij het sluiten van de app) zodra dit basisstuk
getest is.
