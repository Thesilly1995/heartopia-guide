import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS } from '@/constants/heartopia-colors';
import { BUBBLE_LOCATIONS } from '@/data/bubble-locations';

const STORAGE_KEY = 'heartopia:bubbels:vinkjes';

const DISCLAIMER =
  'Er zijn elke week 19 roze bubbels (15 op het hoofdeiland, 4 onderwater in Whalefall Canyon), op vaste plekken die week — maar de exacte plekken en beloningen wisselen elke zaterdag. Deze app kan geen live locaties bijhouden; vraag me in de chat om de actuele lijst op te zoeken wanneer je hem nodig hebt.';

export default function BubbelsScreen() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setChecked(raw ? JSON.parse(raw) : {});
      } catch {
        setChecked({});
      }
    })();
  }, []);

  const toggle = async (num: number) => {
    const updated = { ...checked, [num]: !checked[num] };
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const resetAll = async () => {
    setChecked({});
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    } catch {
      // opslaan mislukt
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#E8A0A8', '#FF8FA3']} icon="🫧" title="Wekelijkse Bubbels" subtitle="Roze bubbels vol beloningen" />
      <FlatList
        data={BUBBLE_LOCATIONS}
        keyExtractor={(item) => String(item.num)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 10 }}>
            <View style={styles.topRow}>
              <Text style={styles.weekLabel}>Deze week (1-8 aug 2026)</Text>
              <Pressable style={styles.resetButton} onPress={resetAll}>
                <Text style={styles.resetButtonText}>Alles resetten</Text>
              </Pressable>
            </View>
            <Text style={styles.source}>Bron: community-kaart (Illuminight)</Text>
            <DisclaimerBox text={DISCLAIMER} />
          </View>
        }
        renderItem={({ item: b }) => {
          const isChecked = checked[b.num];
          return (
            <Pressable style={styles.row} onPress={() => toggle(b.num)}>
              <View style={[styles.numBadge, isChecked && styles.numBadgeActive]}>
                <Text style={[styles.numText, isChecked && styles.numTextActive]}>{isChecked ? '✓' : b.num}</Text>
              </View>
              <Text style={[styles.desc, isChecked && styles.descChecked]}>
                {b.underwater ? '🌊 ' : ''}
                {b.description}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  listContent: { padding: 16, gap: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  weekLabel: { fontSize: 16, fontWeight: '700', color: COLORS.forest },
  resetButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: '#EAF4F4' },
  resetButtonText: { fontSize: 10, fontWeight: '700', color: COLORS.skyDark },
  source: { fontSize: 10, color: COLORS.forestSoft, marginTop: -6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, padding: 12, marginBottom: 10 },
  numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#EAF4FA', alignItems: 'center', justifyContent: 'center' },
  numBadgeActive: { backgroundColor: COLORS.yellow },
  numText: { fontSize: 12, fontWeight: '700', color: COLORS.skyDark },
  numTextActive: { color: COLORS.forest },
  desc: { flex: 1, fontSize: 12, color: COLORS.forest },
  descChecked: { color: COLORS.forestSoft, textDecorationLine: 'line-through' },
});
