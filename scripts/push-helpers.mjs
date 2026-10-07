/**
 * Gedeelde helpers voor de push-notificatiescripts (Supabase-tokens ophalen,
 * versturen via Expo's push-API). Gebruikt door send-content-notifications.mjs,
 * send-backup-reminder.mjs en send-server-timed-notifications.mjs.
 */

/** Haalt alle push-tokens op, optioneel gefilterd op categorie en/of server. */
export async function fetchTokens(supabaseUrl, serviceRoleKey, { category, server } = {}) {
  let url = `${supabaseUrl}/rest/v1/push_tokens?select=token`;
  if (category) url += `&categories=cs.{${category}}`;
  if (server) url += `&server=eq.${server}`;
  const response = await fetch(url, {
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });
  if (!response.ok) {
    console.error(`Supabase-query mislukt (categorie=${category ?? '-'}, server=${server ?? '-'}): HTTP ${response.status}`);
    return [];
  }
  const rows = await response.json();
  return rows.map((row) => row.token);
}

/**
 * Probeert een venster-sleutel exclusief te claimen (insert, met "doe niets
 * bij conflict"). Geeft `true` als dit de eerste keer is (dus: nu versturen),
 * `false` als er al eerder geclaimd is (of de insert mislukte — fail-safe:
 * liever een gemiste melding dan een dubbele). Zie `notified_windows`-tabel,
 * migratie in docs/push-notifications-setup.md.
 */
export async function tryClaimNotifiedWindow(supabaseUrl, serviceRoleKey, key) {
  const response = await fetch(`${supabaseUrl}/rest/v1/notified_windows`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=representation',
    },
    body: JSON.stringify({ key }),
  });
  if (!response.ok) {
    console.error(`Supabase notified_windows-insert mislukt voor "${key}": HTTP ${response.status}`);
    return false;
  }
  const rows = await response.json();
  return rows.length > 0;
}

/** Expo's push-API accepteert max. 100 berichten per request. */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) chunks.push(array.slice(i, i + size));
  return chunks;
}

export async function sendPushBatch(tokens, message) {
  if (tokens.length === 0) return;
  const payloads = tokens.map((token) => ({
    to: token,
    // Taal is hier niet per gebruiker bekend (geen account-systeem) — NL+EN
    // samen in één bericht.
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
