import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:todo:lijst';

const STRINGS = {
  nl: {
    title: 'To-do',
    subtitle: 'Wat wil je nog gaan doen in het spel?',
    placeholder: 'Bijv. de nieuwe wijk afmaken, alle vlinders vangen...',
    add: 'Toevoegen',
    empty: 'Nog niks op je lijstje — voeg iets toe!',
  },
  en: {
    title: 'To-do',
    subtitle: 'What do you still want to do in the game?',
    placeholder: 'E.g. finish the new district, catch all the butterflies...',
    add: 'Add',
    empty: 'Nothing on your list yet — add something!',
  },
} as const;

interface TodoItem {
  text: string;
  done: boolean;
}

export default function TodoScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [items, setItems] = useState<TodoItem[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
    })();
  }, []);

  const save = async (updated: TodoItem[]) => {
    setItems(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const addItem = () => {
    if (!text.trim()) return;
    save([...items, { text: text.trim(), done: false }]);
    setText('');
  };

  const toggleItem = (i: number) => {
    save(items.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));
  };

  const removeItem = (i: number) => {
    save(items.filter((_, idx) => idx !== i));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#8FBF6E', '#6EC6E8']} icon="📝" title={s.title} subtitle={s.subtitle} />
      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.addRow}>
            <TextInput
              value={text}
              onChangeText={setText}
              onSubmitEditing={addItem}
              placeholder={s.placeholder}
              placeholderTextColor={colors.forestSoft}
              style={styles.input}
            />
            <Pressable style={styles.addButton} onPress={addItem}>
              <Text style={styles.addButtonText}>{s.add}</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={<Text style={styles.emptyText}>{s.empty}</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Pressable style={[styles.checkbox, item.done && styles.checkboxActive]} onPress={() => toggleItem(index)}>
              {item.done && <Text style={styles.checkmark}>✓</Text>}
            </Pressable>
            <Text style={[styles.itemText, item.done && styles.itemTextDone]}>{item.text}</Text>
            <Pressable onPress={() => removeItem(index)} hitSlop={8}>
              <Text style={styles.removeText}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    addRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
    input: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, color: c.forest, backgroundColor: c.card },
    addButton: { paddingHorizontal: 16, borderRadius: 12, backgroundColor: c.coral, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
    emptyText: { fontSize: 12, color: c.forestSoft, paddingHorizontal: 2 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    checkbox: { width: 22, height: 22, borderRadius: 6, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
    itemText: { flex: 1, fontSize: 14, color: c.forest },
    itemTextDone: { color: c.forestSoft, textDecorationLine: 'line-through' },
    removeText: { fontSize: 14, color: c.forestSoft },
  });
}
