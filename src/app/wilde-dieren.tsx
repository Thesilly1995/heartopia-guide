import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/heartopia/info-card';
import { LevelStepper } from '@/components/heartopia/level-stepper';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { WILD_ANIMAL_MAX_BOND, useWildAnimals } from '@/data/wild-animals';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:wildedieren:vriendschap';

const STRINGS = {
  nl: { title: 'Wilde Dieren', subtitle: 'Voertroggen, favoriet eten & vriendschap', feedingSpot: 'Voertrog', favoriteWeather: 'Favoriet weer', favoriteFood: 'Favoriete eten', friendshipLevel: 'Vriendschapsniveau', eventHeading: 'Event dieren' },
  en: { title: 'Wild Animals', subtitle: 'Feeding troughs, favorite food & friendship', feedingSpot: 'Feeding trough', favoriteWeather: 'Favorite weather', favoriteFood: 'Favorite food', friendshipLevel: 'Friendship level', eventHeading: 'Event Animals' },
} as const;

export default function WildeDierenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const wildAnimals = useWildAnimals();
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
        title={s.title}
        subtitle={s.subtitle}
      />
      <FlatList
        data={wildAnimals}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: animal, index }) => {
          const isOpen = openName === animal.name;
          const maxBond = WILD_ANIMAL_MAX_BOND[animal.name] ?? 10;
          const showEventHeading = animal.isEvent && (index === 0 || !wildAnimals[index - 1].isEvent);
          return (
            <>
              {showEventHeading && <Text style={styles.eventHeading}>{s.eventHeading}</Text>}
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
                    <InfoCard label={s.feedingSpot} value={animal.spot} full />
                    <InfoCard label={s.favoriteWeather} value={animal.weather} full />
                    <View style={[styles.foodsBox]}>
                      <Text style={styles.detailLabel}>{s.favoriteFood}</Text>
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
                    <Text style={styles.bondBoxLabel}>{s.friendshipLevel}</Text>
                    <LevelStepper value={bonds[animal.name] || 0} max={maxBond} onSet={(n) => setBond(animal.name, n)} />
                  </View>
                </View>
              )}
              </View>
            </>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    eventHeading: { fontSize: 13, fontWeight: '800', color: c.forest, marginTop: 6, marginBottom: -2 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden', marginBottom: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 20 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: c.forest },
    bondText: { fontSize: 12, fontWeight: '700', color: c.yellow, marginTop: 2 },
    chevron: { fontSize: 18, color: c.forestSoft },
    cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    detailLabel: { fontSize: 11, fontWeight: '700', color: c.forest, marginBottom: 4 },
    foodsBox: { flexBasis: '100%', backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    foodsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    foodPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    note: { marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: c.warningBg, borderWidth: 1, borderColor: c.warningBorder, color: c.coralDark, fontSize: 11, fontWeight: '700' },
    bondBox: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bondBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
  });
}
