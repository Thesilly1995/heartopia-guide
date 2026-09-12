import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ADMIN_CODE } from '@/constants/admin';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { isSupabaseConfigured, supabase } from '@/constants/supabase';
import { useLanguage } from '@/hooks/use-language';
import { translateToEnglish } from '@/lib/translate';

const STRINGS = {
  nl: {
    title: 'Feedback',
    subtitle: 'Deel je ideeën voor de gids',
    disclaimer: 'Deze feedback wordt gedeeld — iedereen die de app opent kan de lijst zien, geen account nodig.',
    notConfigured: 'Feedback is nog niet beschikbaar — de backend wordt nog opgezet.',
    namePlaceholder: 'Je naam (optioneel)',
    ideaPlaceholder: 'Wat wil je toevoegen of veranderd zien?',
    saving: 'Bezig met versturen...',
    done: 'Bedankt! ✓',
    submit: 'Versturen',
    error: 'Versturen mislukt — probeer het later opnieuw.',
    loadError: 'Laden mislukt — probeer het later opnieuw.',
    recent: 'Eerder toegevoegde ideeën — verwerkte feedback halen we van de lijst af, dus staat jouw idee er niet meer bij? Dan is het opgepakt! ✓',
    empty: 'Nog geen feedback — voeg de eerste toe!',
    anonymous: 'Anoniem',
    adminLink: 'Beheerder',
    adminLockLink: '🔒 Vergrendelen',
    adminPrompt: 'Code invoeren om feedback te kunnen verwijderen.',
    adminCodePlaceholder: 'Beheerderscode',
    adminUnlock: 'Ontgrendelen',
    adminWrongCode: 'Onjuiste code.',
    deleteConfirmText: 'Dit haalt dit idee definitief van de gedeelde lijst af.',
    deleteConfirm: 'Verwijderen',
    cancel: 'Annuleren',
    deleteError: 'Verwijderen mislukt — probeer het opnieuw.',
  },
  en: {
    title: 'Feedback',
    subtitle: 'Share your ideas for the guide',
    disclaimer: 'This feedback is shared — everyone who opens the app can see the list, no account needed.',
    notConfigured: 'Feedback is not available yet — the backend is still being set up.',
    namePlaceholder: 'Your name (optional)',
    ideaPlaceholder: 'What would you like to add or change?',
    saving: 'Submitting...',
    done: 'Thanks! ✓',
    submit: 'Submit',
    error: 'Submitting failed — please try again later.',
    loadError: 'Loading failed — please try again later.',
    recent: "Previously added ideas — we remove feedback once it's been handled, so if your idea is no longer listed, it's been taken care of! ✓",
    empty: 'No feedback yet — add the first one!',
    anonymous: 'Anonymous',
    adminLink: 'Admin',
    adminLockLink: '🔒 Lock',
    adminPrompt: 'Enter the code to be able to delete feedback.',
    adminCodePlaceholder: 'Admin code',
    adminUnlock: 'Unlock',
    adminWrongCode: 'Incorrect code.',
    deleteConfirmText: 'This will permanently remove this idea from the shared list.',
    deleteConfirm: 'Delete',
    cancel: 'Cancel',
    deleteError: 'Delete failed — please try again.',
  },
} as const;

interface FeedbackEntry {
  id: string;
  name: string;
  idea: string;
  date: string;
}

export default function FeedbackScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [status, setStatus] = useState<'saving' | 'done' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminCodeInput, setAdminCodeInput] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadEntries = async () => {
    const { data, error: fetchError } = await supabase
      .from('feedback')
      .select('id, name, idea, idea_en, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (fetchError) {
      setError(s.loadError);
      return;
    }
    setError(null);
    setEntries(
      (data ?? []).map((row) => ({
        id: row.id,
        name: row.name?.trim() || s.anonymous,
        idea: row.idea_en || row.idea,
        date: String(row.created_at).slice(0, 10),
      }))
    );
  };

  useEffect(() => {
    if (isSupabaseConfigured) loadEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const submit = async () => {
    if (!idea.trim()) return;
    setStatus('saving');
    setError(null);
    const ideaTrimmed = idea.trim();
    const ideaEn = await translateToEnglish(ideaTrimmed);
    const { error: insertError } = await supabase
      .from('feedback')
      .insert({ name: name.trim() || null, idea: ideaTrimmed, idea_en: ideaEn });
    if (insertError) {
      setStatus(null);
      setError(s.error);
      return;
    }
    setIdea('');
    setName('');
    setStatus('done');
    await loadEntries();
    setTimeout(() => setStatus(null), 2000);
  };

  const unlockAdmin = () => {
    if (adminCodeInput === ADMIN_CODE) {
      setIsAdmin(true);
      setShowAdminPrompt(false);
      setAdminCodeInput('');
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  const deleteEntry = async (id: string) => {
    setDeleteError(null);
    const { error: deleteErr } = await supabase.from('feedback').delete().eq('id', id);
    setConfirmDeleteId(null);
    if (deleteErr) {
      setDeleteError(s.deleteError);
      return;
    }
    await loadEntries();
  };

  if (!isSupabaseConfigured) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScreenHeader gradient={['#6EC6E8', '#B78CD8']} icon="💡" title={s.title} subtitle={s.subtitle} />
        <View style={styles.centerContent}>
          <Text style={styles.centerText}>{s.notConfigured}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#6EC6E8', '#B78CD8']} icon="💡" title={s.title} subtitle={s.subtitle} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 16 + insets.bottom }]}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 10 }}>
            <DisclaimerBox text={s.disclaimer} />

            <View style={styles.form}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={s.namePlaceholder}
                placeholderTextColor={colors.forestSoft}
                maxLength={100}
                style={styles.input}
              />
              <TextInput
                value={idea}
                onChangeText={setIdea}
                placeholder={s.ideaPlaceholder}
                placeholderTextColor={colors.forestSoft}
                multiline
                numberOfLines={4}
                maxLength={1000}
                style={[styles.input, styles.textarea]}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
              <Pressable
                style={[styles.submitButton, !idea.trim() && styles.submitButtonDisabled]}
                disabled={!idea.trim() || status === 'saving'}
                onPress={submit}>
                <Text style={styles.submitText}>
                  {status === 'saving' ? s.saving : status === 'done' ? s.done : s.submit}
                </Text>
              </Pressable>
            </View>

            <DisclaimerBox text={s.recent} />
            {entries.length === 0 && <Text style={styles.emptyText}>{s.empty}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <View style={styles.entryRow}>
              <Text style={[styles.entryIdea, { flex: 1 }]}>{item.idea}</Text>
              {isAdmin && (
                <Pressable onPress={() => setConfirmDeleteId(item.id)} hitSlop={8}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.entryMeta}>
              {item.name} · {item.date}
            </Text>
            {confirmDeleteId === item.id && (
              <View style={styles.confirmBox}>
                <Text style={styles.confirmText}>{s.deleteConfirmText}</Text>
                <View style={styles.confirmButtonRow}>
                  <Pressable style={styles.confirmCancelButton} onPress={() => setConfirmDeleteId(null)}>
                    <Text style={styles.confirmCancelText}>{s.cancel}</Text>
                  </Pressable>
                  <Pressable style={styles.confirmDestructiveButton} onPress={() => deleteEntry(item.id)}>
                    <Text style={styles.confirmDestructiveText}>{s.deleteConfirm}</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}
        ListFooterComponent={
          <View style={styles.adminSection}>
            {deleteError && <Text style={styles.errorText}>{deleteError}</Text>}
            {isAdmin ? (
              <Pressable onPress={() => setIsAdmin(false)} hitSlop={8}>
                <Text style={styles.adminLink}>{s.adminLockLink}</Text>
              </Pressable>
            ) : showAdminPrompt ? (
              <View style={styles.adminPromptBox}>
                <Text style={styles.adminPromptText}>{s.adminPrompt}</Text>
                <TextInput
                  value={adminCodeInput}
                  onChangeText={(text) => {
                    setAdminCodeInput(text);
                    setAdminError(false);
                  }}
                  placeholder={s.adminCodePlaceholder}
                  placeholderTextColor={colors.forestSoft}
                  secureTextEntry
                  style={styles.input}
                  onSubmitEditing={unlockAdmin}
                />
                {adminError && <Text style={styles.errorText}>{s.adminWrongCode}</Text>}
                <Pressable style={styles.submitButton} onPress={unlockAdmin}>
                  <Text style={styles.submitText}>{s.adminUnlock}</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setShowAdminPrompt(true)} hitSlop={8}>
                <Text style={styles.adminLink}>{s.adminLink}</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
    centerText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', lineHeight: 19 },
    listContent: { padding: 16 },
    form: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, gap: 8 },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: c.forest },
    textarea: { height: 90, textAlignVertical: 'top' },
    submitButton: { backgroundColor: c.coral, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: c.line },
    submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    errorText: { fontSize: 12, color: c.coralDark },
    emptyText: { fontSize: 12, color: c.forestSoft, paddingHorizontal: 2 },
    entryCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    entryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    entryIdea: { fontSize: 14, color: c.forest },
    entryMeta: { fontSize: 10, color: c.forestSoft, marginTop: 4 },
    deleteIcon: { fontSize: 16 },
    confirmBox: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 10, gap: 8, marginTop: 8 },
    confirmText: { fontSize: 12, color: c.forest, lineHeight: 17 },
    confirmButtonRow: { flexDirection: 'row', gap: 8 },
    confirmCancelButton: { flex: 1, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
    confirmCancelText: { color: c.forest, fontWeight: '700', fontSize: 13 },
    confirmDestructiveButton: { flex: 1, backgroundColor: c.coral, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
    confirmDestructiveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    adminSection: { marginTop: 16, alignItems: 'center', gap: 8 },
    adminLink: { fontSize: 11, color: c.forestSoft, textDecorationLine: 'underline' },
    adminPromptBox: { width: '100%', backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, gap: 8 },
    adminPromptText: { fontSize: 11, color: c.forestSoft, textAlign: 'center' },
  });
}
