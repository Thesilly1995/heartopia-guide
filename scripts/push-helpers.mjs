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
