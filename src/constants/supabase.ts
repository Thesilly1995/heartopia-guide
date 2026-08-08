import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * Vul hier de Project URL en anon/public key in zodra het Supabase-project
 * bestaat (Supabase-dashboard → Project Settings → API). De anon key hoort
 * gewoon in de app-code te staan — de echte beveiliging zit in Postgres
 * Row Level Security (zie docs/supabase-setup.md), dit is geen geheime sleutel.
 */
const SUPABASE_URL = 'https://dhttdbbnxynaqycjlltd.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodHRkYmJueHluYXF5Y2psbHRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxOTkyNDksImV4cCI6MjEwMTc3NTI0OX0.8pHh-8lOXt7J4_SSg5DE6L_Fcrp3ptZCyBlyoCcAYiE';

export const isSupabaseConfigured = SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

// `expo-router`'s statische web-export rendert schermen ook server-side (Node), waar
// `window`/localStorage niet bestaan — AsyncStorage's web-implementatie crasht daarop.
// Sessie-persistentie is server-side toch zinloos (geen echte gebruiker aanwezig), dus
// daar valt de auth-client terug op een in-memory storage in plaats van AsyncStorage.
const isBrowser = typeof window !== 'undefined';
const memoryStore = new Map<string, string>();
const memoryStorage = {
  getItem: async (key: string) => memoryStore.get(key) ?? null,
  setItem: async (key: string, value: string) => {
    memoryStore.set(key, value);
  },
  removeItem: async (key: string) => {
    memoryStore.delete(key);
  },
};

export const supabase = createClient(SUPABASE_URL || 'https://placeholder.supabase.co', SUPABASE_ANON_KEY || 'placeholder-anon-key', {
  auth: {
    storage: isBrowser ? AsyncStorage : memoryStorage,
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
    detectSessionInUrl: false,
  },
});
