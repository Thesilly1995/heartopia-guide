import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/heartopia/info-card';
import { LevelStepper } from '@/components/heartopia/level-stepper';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS } from '@/constants/heartopia-colors';
import { WILD_ANIMALS, WILD_ANIMAL_MAX_BOND } from '@/data/wild-animals';

const STORAGE_KEY = 'heartopia:wildedieren:vriendschap';

export default function WildeDierenScreen() {
  const [openName, setOpenName] = useState<string | null>(null);
  const [bonds, setBonds] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setBonds(raw ? JSON.parse(raw) : {});
      } catch {
        setBonds({});
      }
    })();
  }, []);

  const setBond = async (name: string, value: number) => {
    const updated = { ...bonds, [name]: value };
    setBonds(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#8FBF6E', '#C9E6A8']}
        icon="🦊"
        title="Wilde Dieren"
        subtitle="Voertroggen, favoriet eten & vriendschap"
      />
      <FlatList
        data={WILD_ANIMALS}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: animal }) => {
          const isOpen = openName === animal.name;
          const maxBond = WILD_ANIMAL_MAX_BOND[animal.name] ?? 10;
          return (
            <View style={styles.card}>
              <Pressable style={styles.cardHeader} onPress={() => setOpenName(isOpen ? null : animal.name)}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{animal.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {animal.name}
                  </Text>
                  {bonds[animal.name] > 0 && (
                    <Text style={styles.bondText}>
                      Lv.{bonds[animal.name]}/{maxBond}
                    </Text>
                  )}
                </View>
                <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.cardBody}>
                  <View style={styles.detailGrid}>
                    <InfoCard label="Voertrog" value={animal.spot} full />
                    <InfoCard label="Favoriet weer" value={animal.weather} full />
                    <View style={[styles.foodsBox]}>
                      <Text style={styles.detailLabel}>Favoriete eten</Text>
                      <View style={styles.foodsRow}>
                        {animal.foods.map((f) => (
                          <Text key={f} style={styles.foodPill}>
                            {f}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>

                  {animal.note && <Text style={styles.note}>⚠️ {animal.note}</Text>}

                  <View style={styles.bondBox}>
                    <Text style={styles.bondBoxLabel}>Vriendschapsniveau</Text>
                    <LevelStepper value={bonds[animal.name] || 0} max={maxBond} onSet={(n) => setBond(animal.name, n)} />
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  listContent: { padding: 16, gap: 10 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', marginBottom: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5FAF3', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.forest },
  bondText: { fontSize: 12, fontWeight: '700', color: COLORS.yellow, marginTop: 2 },
  chevron: { fontSize: 18, color: COLORS.forestSoft },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  detailLabel: { fontSize: 11, fontWeight: '700', color: COLORS.forest, marginBottom: 4 },
  foodsBox: { flexBasis: '100%', backgroundColor: '#F5FAF3', borderRadius: 10, padding: 8 },
  foodsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  foodPill: { fontSize: 11, color: COLORS.forestSoft, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  note: { marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: '#FFF6DC', borderWidth: 1, borderColor: '#F5E5A8', color: COLORS.coralDark, fontSize: 11, fontWeight: '700' },
  bondBox: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  bondBoxLabel: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
});
