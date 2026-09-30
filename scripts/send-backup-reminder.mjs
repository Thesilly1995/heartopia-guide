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

import { fetchTokens, sendPushBatch } from './push-helpers.mjs';

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

const tokens = await fetchTokens(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { category: CATEGORY });
console.log(`${CATEGORY}: ${tokens.length} toestel(len) geabonneerd op de back-up-herinnering.`);
await sendPushBatch(tokens, MESSAGE);
