import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumLockedView } from '@/components/heartopia/premium-locked';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { pullCloudSave, pushCloudSave } from '@/data/cloud-sync';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    title: 'Cloud Save',
    subtitle: 'Voortgang bewaren & gebruiken op een ander toestel',
    lockedText: 'Cloud save bewaart je voortgang (mastery, sterren, missies, to-do, feedback) online, zodat je die op een ander toestel kan terugzetten.',
    notConfiguredTitle: 'Cloud save wordt nog opgezet',
    notConfiguredText: 'De backend (Supabase) is nog niet gekoppeld aan de app — dit scherm werkt zodra dat klaar is.',
    emailPlaceholder: 'E-mailadres',
    passwordPlaceholder: 'Wachtwoord (min. 6 tekens)',
    signIn: 'Inloggen',
    signUp: 'Account aanmaken',
    toggleToSignUp: 'Nog geen account? Account aanmaken',
    toggleToSignIn: 'Al een account? Inloggen',
    working: 'Bezig...',
    loggedInAs: 'Ingelogd als',
    signOut: 'Uitloggen',
    backupButton: 'Nu back-uppen naar cloud',
    restoreButton: 'Herstellen vanaf cloud',
    backupDone: (n: number) => `✓ ${n} items opgeslagen in de cloud`,
    restoreDone: (n: number) => `✓ ${n} items hersteld vanaf de cloud`,
    restoreEmpty: 'Nog geen back-up gevonden voor dit account.',
    restoreConfirmTitle: 'Voortgang herstellen?',
    restoreConfirmText: 'Dit overschrijft de voortgang op dit toestel met de laatste cloud-back-up. Weet je het zeker?',
    cancel: 'Annuleren',
    confirm: 'Herstellen',
  },
  en: {
    title: 'Cloud Save',
    subtitle: 'Save your progress & use it on another device',
    lockedText: 'Cloud save stores your progress (mastery, stars, missions, to-do, feedback) online, so you can restore it on another device.',
    notConfiguredTitle: 'Cloud save is still being set up',
    notConfiguredText: 'The backend (Supabase) is not yet connected to the app — this screen will work once that is ready.',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password (min. 6 characters)',
    signIn: 'Sign in',
    signUp: 'Create account',
    toggleToSignUp: "Don't have an account? Create one",
    toggleToSignIn: 'Already have an account? Sign in',
    working: 'Working...',
    loggedInAs: 'Signed in as',
    signOut: 'Sign out',
    backupButton: 'Back up to cloud now',
    restoreButton: 'Restore from cloud',
    backupDone: (n: number) => `✓ ${n} items saved to the cloud`,
    restoreDone: (n: number) => `✓ ${n} items restored from the cloud`,
    restoreEmpty: 'No backup found yet for this account.',
    restoreConfirmTitle: 'Restore progress?',
    restoreConfirmText: 'This overwrites the progress on this device with the latest cloud backup. Are you sure?',
    cancel: 'Cancel',
    confirm: 'Restore',
  },
} as const;

type Strings = (typeof STRINGS)[keyof typeof STRINGS];

export default function CloudSaveScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const { premium } = usePremium();
  const s = STRINGS[language];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[COLORS.coral, COLORS.yellow]} icon="☁️" title={s.title} subtitle={s.subtitle} />
      {premium ? <UnlockedContent s={s} styles={styles} /> : <PremiumLockedView text={s.lockedText} />}
    </SafeAreaView>
  );
}

function UnlockedContent({ s, styles }: { s: Strings; styles: ReturnType<typeof makeStyles> }) {
  const { session, loading, configured } = useAuth();

  if (!configured) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.centerIcon}>🛠️</Text>
        <Text style={styles.centerTitle}>{s.notConfiguredTitle}</Text>
        <Text style={styles.centerText}>{s.notConfiguredText}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.centerText}>{s.working}</Text>
      </View>
    );
  }

  return session ? <AccountPanel s={s} styles={styles} userId={session.user.id} email={session.user.email ?? ''} /> : <AuthForm s={s} styles={styles} />;
}

function AuthForm({ s, styles }: { s: Strings; styles: ReturnType<typeof makeStyles> }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setBusy(true);
    setError(null);
    const fn = mode === 'signIn' ? signIn : signUp;
    const message = await fn(email.trim(), password);
    setBusy(false);
    if (message) setError(message);
  };

  return (
    <View style={styles.formCard}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={s.emailPlaceholder}
        placeholderTextColor={styles.placeholderColor.color}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder={s.passwordPlaceholder}
        placeholderTextColor={styles.placeholderColor.color}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Pressable style={styles.primaryButton} disabled={busy || !email.trim() || password.length < 6} onPress={submit}>
        <Text style={styles.primaryButtonText}>{busy ? s.working : mode === 'signIn' ? s.signIn : s.signUp}</Text>
      </Pressable>
      <Pressable onPress={() => setMode(mode === 'signIn' ? 'signUp' : 'signIn')} hitSlop={6}>
        <Text style={styles.linkText}>{mode === 'signIn' ? s.toggleToSignUp : s.toggleToSignIn}</Text>
      </Pressable>
    </View>
  );
}

function AccountPanel({ s, styles, userId, email }: { s: Strings; styles: ReturnType<typeof makeStyles>; userId: string; email: string }) {
  const { signOut } = useAuth();
  const [busy, setBusy] = useState<'backup' | 'restore' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingRestore, setConfirmingRestore] = useState(false);

  const backup = async () => {
    setBusy('backup');
    setMessage(null);
    const { error, keyCount } = await pushCloudSave(userId);
    setBusy(null);
    setMessage(error ?? s.backupDone(keyCount));
  };

  const confirmRestore = async () => {
    setConfirmingRestore(false);
    setBusy('restore');
    setMessage(null);
    const { error, restoredKeys } = await pullCloudSave(userId);
    setBusy(null);
    setMessage(error ?? (restoredKeys > 0 ? s.restoreDone(restoredKeys) : s.restoreEmpty));
  };

  return (
    <View style={styles.formCard}>
      <Text style={styles.centerText}>
        {s.loggedInAs} <Text style={{ fontWeight: '700' }}>{email}</Text>
      </Text>
      <Pressable style={styles.primaryButton} disabled={busy !== null} onPress={backup}>
        <Text style={styles.primaryButtonText}>{busy === 'backup' ? s.working : s.backupButton}</Text>
      </Pressable>

      {confirmingRestore ? (
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>{s.restoreConfirmTitle}</Text>
          <Text style={styles.confirmText}>{s.restoreConfirmText}</Text>
          <View style={styles.confirmButtonRow}>
            <Pressable style={styles.confirmCancelButton} onPress={() => setConfirmingRestore(false)}>
              <Text style={styles.confirmCancelText}>{s.cancel}</Text>
            </Pressable>
            <Pressable style={styles.confirmDestructiveButton} onPress={confirmRestore}>
              <Text style={styles.confirmDestructiveText}>{s.confirm}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={styles.secondaryButton} disabled={busy !== null} onPress={() => setConfirmingRestore(true)}>
          <Text style={styles.secondaryButtonText}>{busy === 'restore' ? s.working : s.restoreButton}</Text>
        </Pressable>
      )}

      {message && <Text style={styles.centerText}>{message}</Text>}
      <Pressable onPress={signOut} hitSlop={6}>
        <Text style={styles.linkText}>{s.signOut}</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
    centerIcon: { fontSize: 40 },
    centerTitle: { fontSize: 18, fontWeight: '800', color: c.forest, textAlign: 'center' },
    centerText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', lineHeight: 19 },
    testNote: { fontSize: 11, color: c.forestSoft, textAlign: 'center', marginTop: 4 },
    formCard: { margin: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 16, padding: 16, gap: 10 },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: c.forest },
    placeholderColor: { color: c.forestSoft },
    primaryButton: { backgroundColor: c.coral, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    secondaryButton: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
    secondaryButtonText: { color: c.forest, fontWeight: '700', fontSize: 14 },
    linkText: { fontSize: 12, color: c.forestSoft, textDecorationLine: 'underline', textAlign: 'center' },
    errorText: { fontSize: 12, color: c.coralDark },
    confirmBox: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, gap: 8 },
    confirmTitle: { fontSize: 13, fontWeight: '700', color: c.forest },
    confirmText: { fontSize: 12, color: c.forest, lineHeight: 17 },
    confirmButtonRow: { flexDirection: 'row', gap: 8 },
    confirmCancelButton: { flex: 1, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
    confirmCancelText: { color: c.forest, fontWeight: '700', fontSize: 13 },
    confirmDestructiveButton: { flex: 1, backgroundColor: c.coral, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
    confirmDestructiveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  });
}
