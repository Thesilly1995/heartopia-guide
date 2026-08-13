import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
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
    recent: 'Eerder toegevoegde ideeën',
    empty: 'Nog geen feedback — voeg de eerste toe!',
    anonymous: 'Anoniem',
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
    recent: 'Previously added ideas',
    empty: 'No feedback yet — add the first one!',
    anonymous: 'Anonymous',
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
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [name, setName] = useState('');
  const [idea, setIdea] = useState('');
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [status, setStatus] = useState<'saving' | 'done' | null>(null);
  const [error, setError] = useState<string | null>(null);

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
        contentContainerStyle={styles.listContent}
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

            <Text style={styles.recentLabel}>{s.recent}</Text>
            {entries.length === 0 && <Text style={styles.emptyText}>{s.empty}</Text>}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryIdea}>{item.idea}</Text>
            <Text style={styles.entryMeta}>
              {item.name} · {item.date}
            </Text>
          </View>
        )}
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
    recentLabel: { fontSize: 12, fontWeight: '700', color: c.forest, paddingHorizontal: 2 },
    emptyText: { fontSize: 12, color: c.forestSoft, paddingHorizontal: 2 },
    entryCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    entryIdea: { fontSize: 14, color: c.forest },
    entryMeta: { fontSize: 10, color: c.forestSoft, marginTop: 4 },
  });
}
