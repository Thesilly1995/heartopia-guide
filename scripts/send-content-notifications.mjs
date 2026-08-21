#!/usr/bin/env node
/**
 * Vergelijkt de vorige en huidige `remote-content.json` en verstuurt
 * pushmeldingen (via Expo's push-API) voor relevante wijzigingen: Rainbow of
 * meteorenregen die net begonnen is, een nieuw event, of nieuwe gift codes.
 * Draait als GitHub Action bij elke push naar main die remote-content.json
 * raakt — zie .github/workflows/notify-content-changes.yml en
 * docs/push-notifications-setup.md.
 *
 * Vereiste env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 * Argumenten: <pad-naar-vorige-json> <pad-naar-huidige-json>
 */

import { readFileSync } from 'node:fs';

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

/** @typedef {{ category: 'rainbow_meteor' | 'event' | 'codes', titleNl: string, titleEn: string, bodyNl: string, bodyEn: string }} PushMessage */

/** @type {PushMessage[]} */
const messages = [];

function hadSpots(payload, key) {
  return Array.isArray(payload?.[key]) && payload[key].length > 0;
}

// Rainbow: leeg -> gevuld = net begonnen.
if (!hadSpots(prev, 'rainbowSpots') && hadSpots(curr, 'rainbowSpots')) {
  messages.push({
    category: 'rainbow_meteor',
    titleNl: '🌈 Rainbow is begonnen!',
    titleEn: '🌈 Rainbow has started!',
    bodyNl: 'Bekijk de boeketlocaties in Heartopedia.',
    bodyEn: 'Check the bouquet locations in Heartopedia.',
  });
}

// Meteorenregen: leeg -> gevuld = net begonnen.
if (!hadSpots(prev, 'meteorSpots') && hadSpots(curr, 'meteorSpots')) {
  messages.push({
    category: 'rainbow_meteor',
    titleNl: '☄️ Meteorenregen is begonnen!',
    titleEn: '☄️ Meteor shower has started!',
    bodyNl: 'Bekijk de ertslocaties in Heartopedia.',
    bodyEn: 'Check the ore locations in Heartopedia.',
  });
}

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

async function fetchTokensForCategory(category) {
  const url = `${SUPABASE_URL}/rest/v1/push_tokens?select=token&categories=cs.{${category}}`;
  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });
  if (!response.ok) {
    console.error(`Supabase-query mislukt voor categorie ${category}: HTTP ${response.status}`);
    return [];
  }
  const rows = await response.json();
  return rows.map((row) => row.token);
}

/** Expo's push-API accepteert max. 100 berichten per request. */
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

async function sendPushBatch(tokens, message) {
  if (tokens.length === 0) return;
  const payloads = tokens.map((token) => ({
    to: token,
    // Taal is hier niet per gebruiker bekend (geen account-systeem) — NL+EN
    // samen in één bericht, zelfde aanpak als de rest van de app bij content
    // waar de taalvoorkeur van de ontvanger niet server-side bekend is.
    title: `${message.titleNl} / ${message.titleEn}`,
    body: `${message.bodyNl}\n${message.bodyEn}`,
    sound: 'default',
  }));

  for (const batch of chunk(payloads, 100)) {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(batch),
    });
    if (!response.ok) {
      console.error(`Expo push-API gaf HTTP ${response.status} voor "${message.titleNl}"`);
      continue;
    }
    const result = await response.json();
    console.log(`Verstuurd naar ${batch.length} toestel(len) voor "${message.titleNl}":`, JSON.stringify(result.data ?? result));
  }
}

for (const message of messages) {
  const tokens = await fetchTokensForCategory(message.category);
  console.log(`${message.category}: ${tokens.length} toestel(len) geabonneerd op "${message.titleNl}"`);
  await sendPushBatch(tokens, message);
}
