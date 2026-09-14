import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from '@/constants/supabase';

/** De meldingscategorieën die een gebruiker apart aan/uit kan zetten. */
export type NotificationCategory = 'rainbow_meteor' | 'event' | 'codes' | 'cloud_backup_reminder';

const ALL_CATEGORIES: NotificationCategory[] = ['rainbow_meteor', 'event', 'codes', 'cloud_backup_reminder'];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync('default', {
    name: 'Heartopedia',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export interface PushRegistrationResult {
  token: string | null;
  /** Alleen gezet bij een onverwachte fout (niet bij een normale weigering/web/simulator). */
  error: string | null;
}

/**
 * Vraagt notificatie-toestemming (indien nog niet gevraagd/geweigerd) en haalt
 * een Expo push token op. `token` is `null` op web, in een simulator, of als
 * toestemming geweigerd is — de aanroepende code moet daarmee om kunnen gaan.
 */
export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  if (Platform.OS === 'web') return { token: null, error: null };
  if (!Device.isDevice) return { token: null, error: null };

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return { token: null, error: null };

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return { token: null, error: 'Geen EAS project-ID gevonden in app-config.' };

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return { token, error: null };
  } catch (err) {
    return { token: null, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Slaat het push-token + welke categorieën aanstaan op in Supabase, via de
 * `save_push_token` RPC (tabel `push_tokens`, zie
 * docs/push-notifications-setup.md). Gebruikt een RPC i.p.v. een directe
 * upsert op de tabel omdat een directe schrijfactie als anon/authenticated
 * onverklaarbaar op een RLS-fout stuitte ondanks correcte policies — de RPC
 * (security definer) omzeilt dat.
 */
export async function savePushToken(token: string, categories: NotificationCategory[]): Promise<{ ok: boolean; error: string | null }> {
  const { error } = await supabase.rpc('save_push_token', {
    p_token: token,
    p_platform: Platform.OS,
    p_categories: categories,
  });
  return { ok: !error, error: error?.message ?? null };
}

/** Verwijdert het token uit Supabase (bv. als de gebruiker alle categorieën uitzet). */
export async function deletePushToken(token: string): Promise<boolean> {
  const { error } = await supabase.rpc('delete_push_token', { p_token: token });
  return !error;
}

export { ALL_CATEGORIES };
