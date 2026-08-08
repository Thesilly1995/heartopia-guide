import type { Session } from '@supabase/supabase-js';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/constants/supabase';

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  /** false zolang SUPABASE_URL/SUPABASE_ANON_KEY nog niet zijn ingevuld in constants/supabase.ts. */
  configured: boolean;
  signUp: (email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: false,
  configured: false,
  signUp: async () => 'not configured',
  signIn: async () => 'not configured',
  signOut: async () => {},
});

/**
 * E-mail/wachtwoord-auth via Supabase, voor cloud save (zie data/cloud-sync.ts).
 * Zolang isSupabaseConfigured false is (geen project aangemaakt/ingevuld),
 * wordt er nooit een netwerkcall gedaan en blijft session altijd null.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        setLoading(false);
      })
      .catch(() => {
        // Geen netwerk / Supabase (nog) niet bereikbaar — blijf op "niet ingelogd".
        setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, loading, configured: isSupabaseConfigured, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
