#!/usr/bin/env node
/**
 * Draait op een cron-schema (elke 15 min, zie
 * .github/workflows/notify-server-timed.yml) en verstuurt de Rainbow/
 * meteorenregen-"is begonnen"-melding per server, op het moment dat het
 * venster écht opengaat op de servertijd van die speler.
 *
 * Vervangt de oude aanpak (voorheen in send-content-notifications.mjs), die
 * vuurde zodra de data naar main gepusht werd, ongeacht klokuur of server.
 * Dat klopte niet meer sinds rainbowSpots/meteorSpots vooraf ingevuld mogen
 * worden — de app zelf bepaalt via src/lib/event-window.ts wanneer ze
 * zichtbaar worden, per geselecteerde server (src/hooks/use-server.tsx).
 * Dit script moet dezelfde regels volgen, anders krijgen spelers de melding
 * (soms uren) te vroeg t.o.v. hun eigen servertijd.
 *
 * LET OP (7 okt 2026): GitHub Actions' `schedule`-trigger draait NIET
 * betrouwbaar elke 15 min — in de praktijk zaten er soms 6-8 uur tussen
 * opeenvolgende runs (GitHub vertraagt/skipt cron-runs, vooral bij lage
 * repo-activiteit). Een smal "net begonnen"-venster (de oude
 * FIRE_WINDOW_MINUTES = 10) werd daardoor bijna altijd gemist. Daarom nu:
 * check het hele blok (6 uur) i.p.v. alleen de eerste 10 minuten, met een
 * `notified_windows`-tabel in Supabase om dubbele meldingen te voorkomen als
 * de cron toch een keer wél op tijd draait (of meerdere keren binnen
 * hetzelfde blok vuurt). Zie migratie in docs/push-notifications-setup.md.
 *
 * Vereiste env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

import { readFileSync } from 'node:fs';
import { fetchTokens, sendPushBatch, tryClaimNotifiedWindow } from './push-helpers.mjs';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten gezet zijn (GitHub Actions secrets).');
  process.exit(1);
}

// Moet in sync blijven met SERVERS in src/hooks/use-server.tsx.
const SERVERS = [
  { id: 'global', offsetHours: 1 },
  { id: 'sea', offsetHours: 7 },
  { id: 'twhkmo', offsetHours: 8 },
  { id: 'america', offsetHours: -5 },
  { id: 'asia', offsetHours: 9 },
];

// Moet in sync blijven met BLOCK_START_HOUR in src/lib/event-window.ts.
const BLOCK_START_HOUR = { '00-06': 0, '06-12': 6, '12-18': 12, '18-00': 18 };

// Blokken zijn altijd 6 uur (00-06/06-12/12-18/18-00). Het hele blok telt als
// "venster" i.p.v. alleen de eerste minuten na de start — dubbele meldingen
// binnen hetzelfde blok worden voorkomen via `notified_windows` (Supabase),
// niet via een kort tijdvenster (zie uitleg bovenaan dit bestand).
const BLOCK_LENGTH_MINUTES = 360;

const MESSAGES = {
  rainbow: {
    titleNl: '🌈 Rainbow is begonnen!',
    titleEn: '🌈 Rainbow has started!',
    bodyNl: 'Bekijk de boeketlocaties in Heartopedia.',
    bodyEn: 'Check the bouquet locations in Heartopedia.',
  },
  meteor: {
    titleNl: '☄️ Meteorenregen is begonnen!',
    titleEn: '☄️ Meteor shower has started!',
    bodyNl: 'Bekijk de fragment-locaties in Heartopedia.',
    bodyEn: 'Check the shard locations in Heartopedia.',
  },
};

const SPOTS_FIELD = { rainbow: 'rainbowSpots', meteor: 'meteorSpots' };

function serverLocalNow(offsetHours) {
  return new Date(Date.now() + offsetHours * 3600000);
}

function dateKeyUTC(d) {
  return d.toISOString().slice(0, 10);
}

const curr = JSON.parse(readFileSync('remote-content.json', 'utf-8'));
const weekForecast = curr.weekForecast ?? [];

let firedAny = false;

for (const server of SERVERS) {
  const now = serverLocalNow(server.offsetHours);
  const hour = now.getUTCHours();
  const minute = now.getUTCMinutes();
  const dateKey = dateKeyUTC(now);
  const entry = weekForecast.find((e) => e.date === dateKey);
  if (!entry) continue;

  for (const kind of ['rainbow', 'meteor']) {
    const slot = entry.kinds
      .map((k) => (typeof k === 'string' ? { kind: k } : k))
      .find((k) => k.kind === kind);
    if (!slot || !slot.block) continue;

    const blockHour = BLOCK_START_HOUR[slot.block];
    const minutesSinceStart = (hour - blockHour) * 60 + minute;
    if (minutesSinceStart < 0 || minutesSinceStart >= BLOCK_LENGTH_MINUTES) continue;

    const spots = curr[SPOTS_FIELD[kind]];
    if (!Array.isArray(spots) || spots.length === 0) {
      console.log(`${server.id}/${kind}: venster is open, maar ${SPOTS_FIELD[kind]} is nog leeg — geen melding (wel opnieuw geprobeerd bij de volgende run).`);
      continue;
    }

    const windowKey = `${dateKey}-${server.id}-${kind}`;
    const claimed = await tryClaimNotifiedWindow(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, windowKey);
    if (!claimed) {
      console.log(`${server.id}/${kind}: al gemeld voor dit venster (${windowKey}), overslaan.`);
      continue;
    }

    firedAny = true;
    const tokens = await fetchTokens(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { category: 'rainbow_meteor', server: server.id });
    console.log(`${server.id}/${kind}: venster is open (${windowKey}), ${tokens.length} toestel(len) op deze server geabonneerd.`);
    await sendPushBatch(tokens, MESSAGES[kind]);
  }
}

if (!firedAny) {
  console.log('Geen nieuwe melding nodig: geen enkele server heeft nu een open Rainbow/meteorenregen-venster dat nog niet gemeld is.');
}
