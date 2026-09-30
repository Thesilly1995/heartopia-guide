#!/usr/bin/env node
/**
 * Vergelijkt de vorige en huidige `remote-content.json` en verstuurt
 * pushmeldingen (via Expo's push-API) voor een nieuw event of nieuwe gift
 * codes. Draait als GitHub Action bij elke push naar main die
 * remote-content.json raakt — zie .github/workflows/notify-content-changes.yml
 * en docs/push-notifications-setup.md.
 *
 * Rainbow/meteorenregen "is begonnen" zit hier NIET meer in — dat gebeurt
 * per server op het exacte moment dat het venster opengaat, zie
 * send-server-timed-notifications.mjs. Dit script vuurt bij een push naar
 * main, ongeacht klokuur, en dat klopt niet meer sinds rainbowSpots/
 * meteorSpots vooraf ingevuld mogen worden (de app zelf bepaalt wanneer
 * ze zichtbaar worden, zie src/lib/event-window.ts) — anders krijgen
 * spelers de melding uren voor hun eigen servertijd-venster opengaat.
 *
 * Vereiste env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Argumenten: <pad-naar-vorige-json> <pad-naar-huidige-json>
 */

import { readFileSync } from 'node:fs';
import { fetchTokens, sendPushBatch } from './push-helpers.mjs';

const [, , prevPath, currPath] = process.argv;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!prevPath || !currPath) {
  console.error('Gebruik: node send-content-notifications.mjs <vorige.json> <huidige.json>');
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten gezet zijn (GitHub Actions secrets).');
  process.exit(1);
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    // Vorige versie bestond nog niet (allereerste commit) of is geen geldige JSON — leeg object,
    // zodat alles daarna als "nieuw" telt i.p.v. dat het script crasht.
    return {};
  }
}

const prev = readJson(prevPath);
const curr = readJson(currPath);

/** @typedef {{ category: 'event' | 'codes', titleNl: string, titleEn: string, bodyNl: string, bodyEn: string }} PushMessage */

/** @type {PushMessage[]} */
const messages = [];

// Nieuw event: event aanwezig en de naam is veranderd (of er was nog geen event).
const prevEventName = prev?.event?.nameNl ?? null;
const currEventName = curr?.event?.nameNl ?? null;
if (currEventName && currEventName !== prevEventName) {
  messages.push({
    category: 'event',
    titleNl: '🎉 Nieuw event gestart!',
    titleEn: '🎉 New event started!',
    bodyNl: `${curr.event.nameNl} is nu live.`,
    bodyEn: `${curr.event.nameEn ?? curr.event.nameNl} is now live.`,
  });
}

// Nieuwe codes: elke code in curr.codes die nog niet in prev.codes stond (op `code`-veld).
const prevCodes = new Set((prev?.codes ?? []).map((c) => c.code));
const newCodes = (curr?.codes ?? []).filter((c) => !prevCodes.has(c.code));
if (newCodes.length > 0) {
  const codeList = newCodes.map((c) => c.code).join(', ');
  messages.push({
    category: 'codes',
    titleNl: '🎁 Nieuwe code toegevoegd!',
    titleEn: '🎁 New code added!',
    bodyNl: `Code: ${codeList}`,
    bodyEn: `Code: ${codeList}`,
  });
}

if (messages.length === 0) {
  console.log('Geen relevante wijzigingen gevonden, geen meldingen verstuurd.');
  process.exit(0);
}

for (const message of messages) {
  const tokens = await fetchTokens(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { category: message.category });
  console.log(`${message.category}: ${tokens.length} toestel(len) geabonneerd op "${message.titleNl}"`);
  await sendPushBatch(tokens, message);
}
