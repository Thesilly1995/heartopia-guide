import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

const STORAGE_KEY = 'heartopia:feedback:lijst';

const DISCLAIMER = 'Deze feedback wordt lokaal op dit toestel opgeslagen — alleen jij ziet deze lijst.';

interface FeedbackEntry {
  name: string;
  idea: string;
  date: string;
}

export default function FeedbackScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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
      list.push({ name: name.trim() || 'Anoniem', idea: idea.trim(), date: new Date().toISOString().slice(0, 10) });
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
      <ScreenHeader gradient={['#6EC6E8', '#B78CD8']} icon="💡" title="Feedback" subtitle="Deel je ideeën voor de gids" />
      <FlatList
        data={entries}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 10 }}>
            <DisclaimerBox text={DISCLAIMER} />

            <View style={styles.form}>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Je naam (optioneel)"
                placeholderTextColor={colors.forestSoft}
                style={styles.input}
              />
              <TextInput
                value={idea}
                onChangeText={setIdea}
                placeholder="Wat wil je toevoegen of veranderd zien?"
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
                  {status === 'saving' ? 'Bezig met opslaan...' : status === 'done' ? 'Bedankt! ✓' : 'Versturen'}
                </Text>
              </Pressable>
            </View>

            <Text style={styles.recentLabel}>Eerder toegevoegde ideeën</Text>
            {entries.length === 0 && <Text style={styles.emptyText}>Nog geen feedback — voeg de eerste toe!</Text>}
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
