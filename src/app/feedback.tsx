import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:feedback:lijst';

const STRINGS = {
  nl: {
    title: 'Feedback',
    subtitle: 'Deel je ideeën voor de gids',
    disclaimer: 'Deze feedback wordt lokaal op dit toestel opgeslagen — alleen jij ziet deze lijst.',
    namePlaceholder: 'Je naam (optioneel)',
    ideaPlaceholder: 'Wat wil je toevoegen of veranderd zien?',
    saving: 'Bezig met opslaan...',
    done: 'Bedankt! ✓',
    submit: 'Versturen',
    recent: 'Eerder toegevoegde ideeën',
    empty: 'Nog geen feedback — voeg de eerste toe!',
    anonymous: 'Anoniem',
  },
  en: {
    title: 'Feedback',
    subtitle: 'Share your ideas for the guide',
    disclaimer: 'This feedback is stored locally on this device — only you see this list.',
    namePlaceholder: 'Your name (optional)',
    ideaPlaceholder: 'What would you like to add or change?',
    saving: 'Saving...',
    done: 'Thanks! ✓',
    submit: 'Submit',
    recent: 'Previously added ideas',
    empty: 'No feedback yet — add the first one!',
    anonymous: 'Anonymous',
  },
} as const;

interface FeedbackEntry {
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

  const loadEntries = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: FeedbackEntry[] = raw ? JSON.parse(raw) : [];
      setEntries(list.slice().reverse());
    } catch {
      setEntries([]);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const submit = async () => {
    if (!idea.trim()) return;
    setStatus('saving');
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const list: FeedbackEntry[] = raw ? JSON.parse(raw) : [];
      list.push({ name: name.trim() || s.anonymous, idea: idea.trim(), date: new Date().toISOString().slice(0, 10) });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setIdea('');
      setName('');
      setStatus('done');
      await loadEntries();
      setTimeout(() => setStatus(null), 2000);
    } catch {
      setStatus(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#6EC6E8', '#B78CD8']} icon="💡" title={s.title} subtitle={s.subtitle} />
      <FlatList
        data={entries}
        keyExtractor={(_, i) => String(i)}
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
                style={styles.input}
              />
              <TextInput
                value={idea}
                onChangeText={setIdea}
                placeholder={s.ideaPlaceholder}
                placeholderTextColor={colors.forestSoft}
                multiline
                numberOfLines={4}
                style={[styles.input, styles.textarea]}
              />
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
    listContent: { padding: 16 },
    form: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, gap: 8 },
    input: { borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: c.forest },
    textarea: { height: 90, textAlignVertical: 'top' },
    submitButton: { backgroundColor: c.coral, borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
    submitButtonDisabled: { backgroundColor: c.line },
    submitText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
    recentLabel: { fontSize: 12, fontWeight: '700', color: c.forest, paddingHorizontal: 2 },
    emptyText: { fontSize: 12, color: c.forestSoft, paddingHorizontal: 2 },
    entryCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    entryIdea: { fontSize: 14, color: c.forest },
    entryMeta: { fontSize: 10, color: c.forestSoft, marginTop: 4 },
  });
}
