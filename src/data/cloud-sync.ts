import AsyncStorage from '@react-native-async-storage/async-storage';

import { supabase } from '@/constants/supabase';

const KEY_PREFIX = 'heartopia:';

/**
 * Sleutels die bewust NIET meegaan in de cloud-back-up: device-lokale
 * instellingen/cache, geen echte speelvoortgang.
 */
const EXCLUDED_KEYS = new Set(['heartopia:premium:test', 'heartopia:remote-content:cache']);

async function collectLocalSaveData(): Promise<Record<string, string>> {
  const allKeys = await AsyncStorage.getAllKeys();
  const keys = allKeys.filter((k) => k.startsWith(KEY_PREFIX) && !EXCLUDED_KEYS.has(k));
  const entries = await AsyncStorage.getMany(keys);
  const data: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value !== null) data[key] = value;
  }
  return data;
}

/** Stuurt alle lokale voortgang naar Supabase, overschrijft de vorige back-up van deze gebruiker. */
export async function pushCloudSave(userId: string): Promise<{ error: string | null; keyCount: number }> {
  const data = await collectLocalSaveData();
  const { error } = await supabase
    .from('cloud_saves')
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  return { error: error ? error.message : null, keyCount: Object.keys(data).length };
}

/** Haalt de laatste back-up op en overschrijft de lokale voortgang op dit toestel ermee. */
export async function pullCloudSave(userId: string): Promise<{ error: string | null; restoredKeys: number; updatedAt: string | null }> {
  const { data: row, error } = await supabase.from('cloud_saves').select('data, updated_at').eq('user_id', userId).maybeSingle();
  if (error) return { error: error.message, restoredKeys: 0, updatedAt: null };
  if (!row?.data) return { error: null, restoredKeys: 0, updatedAt: null };

  const entries = row.data as Record<string, string>;
  await AsyncStorage.setMany(entries);
  return { error: null, restoredKeys: Object.keys(entries).length, updatedAt: row.updated_at ?? null };
}
