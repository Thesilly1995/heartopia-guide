#!/usr/bin/env node
/**
 * Verstuurt de wekelijkse "back-up je voortgang"-herinnering (via Expo's
 * push-API) naar alle toestellen die de categorie `cloud_backup_reminder`
 * hebben aanstaan. Draait op een cron-schema — zie
 * .github/workflows/send-backup-reminder.yml en
 * docs/push-notifications-setup.md.
 *
 * Vereiste env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY moeten gezet zijn (GitHub Actions secrets).');
  process.exit(1);
}

const CATEGORY = 'cloud_backup_reminder';
const MESSAGE = {
  titleNl: '☁️ Tijd voor een back-up!',
  titleEn: '☁️ Time for a backup!',
  bodyNl: 'Vergeet niet je voortgang (mastery, missies, to-do) te back-uppen naar de cloud.',
  bodyEn: "Don't forget to back up your progress (mastery, missions, to-do) to the cloud.",
};

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
    // samen in één bericht, zelfde aanpak als scripts/send-content-notifications.mjs.
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

const tokens = await fetchTokensForCategory(CATEGORY);
console.log(`${CATEGORY}: ${tokens.length} toestel(len) geabonneerd op de back-up-herinnering.`);
await sendPushBatch(tokens, MESSAGE);
