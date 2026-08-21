import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { supabase } from '@/constants/supabase';

/** De vier meldingscategorieën die een gebruiker apart aan/uit kan zetten. */
export type NotificationCategory = 'rainbow_meteor' | 'event' | 'codes';

const ALL_CATEGORIES: NotificationCategory[] = ['rainbow_meteor', 'event', 'codes'];

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

/**
 * Vraagt notificatie-toestemming (indien nog niet gevraagd/geweigerd) en haalt
 * een Expo push token op. Geeft `null` terug op web, in een simulator, of als
 * toestemming geweigerd is — de aanroepende code moet daarmee om kunnen gaan.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  if (!Device.isDevice) return null;

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) return null;

  try {
    const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });
    return token;
  } catch {
    return null;
  }
}

/**
 * Slaat het push-token + welke categorieën aanstaan op in Supabase (tabel
 * `push_tokens`, zie docs/push-notifications-setup.md). `upsert` op `token`
 * zodat een toestel dat opnieuw registreert gewoon zijn rij bijwerkt i.p.v.
 * een dubbele aan te maken.
 */
export async function savePushToken(token: string, categories: NotificationCategory[]): Promise<boolean> {
  const { error } = await supabase.from('push_tokens').upsert(
    {
      token,
      platform: Platform.OS,
      categories,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'token' }
  );
  return !error;
}

/** Verwijdert het token uit Supabase (bv. als de gebruiker alle categorieën uitzet). */
export async function deletePushToken(token: string): Promise<boolean> {
  const { error } = await supabase.from('push_tokens').delete().eq('token', token);
  return !error;
}

export { ALL_CATEGORIES };
