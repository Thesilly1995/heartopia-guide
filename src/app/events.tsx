import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { COLORS } from '@/constants/heartopia-colors';
import { EVENT_BIRDS } from '@/data/event-birds';
import { EVENT_FISH } from '@/data/event-fish';
import { EVENT_RECIPES } from '@/data/event-recipes';

const STORAGE_KEY = 'heartopia:event:sterren';

const DISCLAIMER =
  'Dit tabblad toont alleen content van het HUIDIGE event. Zodra dit event eindigt, vervangen we deze lijst door de vissen, insecten, vogels en recepten van het nieuwe event — oude event-content is dan niet meer te behalen.';

const INSECTS_NOTE =
  'Nog niet ontgrendeld deze season — insecten komen beschikbaar in Week 3 via Naniwa. We vullen dit aan zodra bekend.';

type EventItem = { name: string; emoji: string; spot?: string; note?: string | null; ingredients?: string[] };

const TABS: { key: string; label: string; items: EventItem[] }[] = [
  { key: 'fish', label: 'Vissen', items: EVENT_FISH },
  { key: 'birds', label: 'Vogels', items: EVENT_BIRDS },
  { key: 'recipes', label: 'Recepten', items: EVENT_RECIPES },
  { key: 'insects', label: 'Insecten', items: [] },
];

export default function EventsScreen() {
  const [tab, setTab] = useState('fish');
  const [stars, setStars] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setStars(raw ? JSON.parse(raw) : {});
      } catch {
        setStars({});
      }
    })();
  }, []);

  const setItemStar = async (name: string, value: number) => {
    const current = stars[name] ?? 0;
    const nextValue = value === current ? 0 : value;
    const updated = { ...stars, [name]: nextValue };
    setStars(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const activeTab = TABS.find((t) => t.key === tab)!;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#3D7EA6', '#6EC6E8']}
        icon="🎉"
        title="Huidig Event"
        subtitle="🐋 Call of Whales · 11 juli – 22 augustus 2026"
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />
      <FlatList
        data={tab === 'insects' ? [] : activeTab.items}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ gap: 10, marginBottom: 10 }}>
            <DisclaimerBox text={DISCLAIMER} />
            {tab === 'insects' && <DisclaimerBox text={INSECTS_NOTE} warning />}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.emojiBadge}>
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                {stars[item.name] > 0 && <Text style={styles.starsText}>{'★'.repeat(stars[item.name])}</Text>}
              </View>
            </View>
            {item.spot && <Text style={styles.spot}>📍 {item.spot}</Text>}
            {item.ingredients && (
              <View style={styles.ingredientRow}>
                {item.ingredients.map((ing) => (
                  <Text key={ing} style={styles.ingredientPill}>
                    {ing}
                  </Text>
                ))}
              </View>
            )}
            {item.note && <Text style={styles.note}>⚠️ {item.note}</Text>}
            <View style={styles.starBox}>
              <Text style={styles.starBoxLabel}>Hoogste resultaat</Text>
              <StarRow value={stars[item.name] || 0} onSet={(n) => setItemStar(item.name, n)} />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  listContent: { padding: 16, gap: 10 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, padding: 14, marginBottom: 10 },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emojiBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAF4FA', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 18 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.forest },
  starsText: { fontSize: 12, fontWeight: '700', color: COLORS.yellow, marginTop: 2 },
  spot: { fontSize: 12, color: COLORS.forestSoft, marginTop: 8 },
  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  ingredientPill: { fontSize: 11, color: COLORS.forestSoft, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  note: { fontSize: 11, fontWeight: '700', color: COLORS.coralDark, marginTop: 8 },
  starBox: { marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  starBoxLabel: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
});
