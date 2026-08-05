import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RarityPill } from '@/components/heartopia/rarity-pill';
import { StarRow } from '@/components/heartopia/star-row';
import { COLORS, ColorKey } from '@/constants/heartopia-colors';

export interface HobbyItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  xp: number;
  emoji: string;
  spot?: string;
  watertype?: string;
  time?: string;
  weather?: string;
  tool?: string;
  ingredients?: string[];
}

const LEVEL_FILTERS = ['Alle', 1, 3, 5, 7, 9] as const;
const WEATHER_FILTERS = ['Alle', 'Zonnig', 'Regen', 'Regenboog'] as const;

export function HobbyListScreen({
  title,
  icon,
  items,
  gradient,
  storageKey,
  hasWeather = false,
}: {
  title: string;
  icon: string;
  items: HobbyItem[];
  gradient: [string, string];
  storageKey: string;
  hasWeather?: boolean;
}) {
  const [openName, setOpenName] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [maxLevel, setMaxLevel] = useState<number>(99);
  const [weatherFilter, setWeatherFilter] = useState<(typeof WEATHER_FILTERS)[number]>('Alle');
  const [stars, setStars] = useState<Record<string, number>>({});
  const [mastery, setMastery] = useState<Record<string, boolean>>({});

  const starsStorageKey = `heartopia:${storageKey}:stars`;
  const masteryStorageKey = `heartopia:${storageKey}:mastery`;

  useEffect(() => {
    (async () => {
      try {
        const [starsRaw, masteryRaw] = await Promise.all([
          AsyncStorage.getItem(starsStorageKey),
          AsyncStorage.getItem(masteryStorageKey),
        ]);
        setStars(starsRaw ? JSON.parse(starsRaw) : {});
        setMastery(masteryRaw ? JSON.parse(masteryRaw) : {});
      } catch {
        setStars({});
        setMastery({});
      }
    })();
  }, [starsStorageKey, masteryStorageKey]);

  const setItemStar = async (name: string, value: number) => {
    const current = stars[name] ?? 0;
    const nextValue = value === current ? 0 : value;
    const updated = { ...stars, [name]: nextValue };
    setStars(updated);
    try {
      await AsyncStorage.setItem(starsStorageKey, JSON.stringify(updated));
    } catch {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    }
  };

  const toggleMastery = async (name: string) => {
    const updated = { ...mastery, [name]: !mastery[name] };
    setMastery(updated);
    try {
      await AsyncStorage.setItem(masteryStorageKey, JSON.stringify(updated));
    } catch {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    }
  };

  const visibleItems = useMemo(() => {
    const filtered = items
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => maxLevel === 99 || item.level >= maxLevel);

    if (weatherFilter === 'Alle') return filtered;

    return [...filtered].sort((a, b) => {
      const aMatch = a.weather?.includes(weatherFilter) ? 1 : 0;
      const bMatch = b.weather?.includes(weatherFilter) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [items, query, maxLevel, weatherFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={gradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={8}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>‹ Terug</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          {icon} {title}
        </Text>
        <Text style={styles.headerCount}>{visibleItems.length} items in deze gids</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Zoeken op naam..."
          placeholderTextColor={COLORS.forestSoft}
          style={styles.searchInput}
        />

        <View style={styles.chipRow}>
          {LEVEL_FILTERS.map((lvl) => {
            const isAll = lvl === 'Alle';
            const active = isAll ? maxLevel === 99 : maxLevel === lvl;
            return (
              <Pressable
                key={lvl}
                onPress={() => setMaxLevel(isAll ? 99 : (lvl as number))}
                style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {isAll ? 'Alle' : `Lv.${lvl}+`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {hasWeather && (
          <View style={styles.chipRow}>
            {WEATHER_FILTERS.map((w) => {
              const active = weatherFilter === w;
              const label =
                w === 'Alle' ? 'Alle weer' : w === 'Zonnig' ? '☀️ Zonnig' : w === 'Regen' ? '🌧️ Regen' : '🌈 Regenboog';
              return (
                <Pressable key={w} onPress={() => setWeatherFilter(w)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isOpen = openName === item.name;
          const weatherMatch = hasWeather && weatherFilter !== 'Alle' && !!item.weather?.includes(weatherFilter);
          const weatherEmoji = weatherFilter === 'Zonnig' ? '☀️' : weatherFilter === 'Regen' ? '🌧️' : '🌈';
          return (
            <View style={[styles.card, weatherMatch && styles.cardHighlighted]}>
              <Pressable style={styles.cardHeader} onPress={() => setOpenName(isOpen ? null : item.name)}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.badgeRow}>
                    <Text style={styles.levelBadge}>Lv.{item.level}</Text>
                    <RarityPill label={item.rarity} colorKey={item.rarityColorKey} />
                    {weatherMatch && <Text style={styles.weatherBadge}>{weatherEmoji}</Text>}
                    {stars[item.name] > 0 && <Text style={styles.starsText}>{'★'.repeat(stars[item.name])}</Text>}
                  </View>
                </View>
                <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.cardBody}>
                  {item.spot !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Plek</Text>
                        <Text style={styles.detailValue}>
                          {item.spot} ({item.watertype})
                        </Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>Tijdstip</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>Weer</Text>
                        <Text style={styles.detailValue}>{item.weather}</Text>
                      </View>
                    </View>
                  )}

                  {item.ingredients !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>Gereedschap</Text>
                        <Text style={styles.detailValue}>{item.tool}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>Ingrediënten</Text>
                        <View style={styles.ingredientRow}>
                          {item.ingredients.map((ing) => (
                            <Text key={ing} style={styles.ingredientPill}>
                              {ing}
                            </Text>
                          ))}
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={styles.starBox}>
                    <Text style={styles.starBoxLabel}>Hoogste resultaat</Text>
                    <StarRow value={stars[item.name] || 0} onSet={(n) => setItemStar(item.name, n)} />
                  </View>

                  <Pressable
                    style={[styles.masteryBox, mastery[item.name] && styles.masteryBoxActive]}
                    onPress={() => toggleMastery(item.name)}>
                    <Text style={[styles.masteryLabel, mastery[item.name] && styles.masteryLabelActive]}>
                      Mastery behaald
                    </Text>
                    <View style={[styles.checkbox, mastery[item.name] && styles.checkboxActive]}>
                      {mastery[item.name] && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </Pressable>
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
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  backButton: { alignSelf: 'flex-start', marginBottom: 8 },
  backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  headerCount: { color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 2 },
  searchInput: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.forest,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' },
  chipActive: { backgroundColor: '#FFFFFF' },
  chipText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  chipTextActive: { color: COLORS.forest },
  listContent: { padding: 16, gap: 10 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', marginBottom: 10 },
  cardHighlighted: { borderWidth: 2, borderColor: COLORS.yellow },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.forest },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  levelBadge: { fontSize: 10, fontWeight: '700', color: COLORS.skyDark, backgroundColor: '#EAF4F4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  weatherBadge: { fontSize: 10, fontWeight: '700', color: '#B8860B', backgroundColor: '#FFF6DC', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  starsText: { fontSize: 12, fontWeight: '700', color: COLORS.yellow },
  chevron: { fontSize: 18, color: COLORS.forestSoft },
  cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  detailBox: { flexBasis: '47%', flexGrow: 1, backgroundColor: '#F5FAF3', borderRadius: 10, padding: 8 },
  detailBoxFull: { flexBasis: '100%' },
  detailLabel: { fontSize: 11, fontWeight: '700', color: COLORS.forest },
  detailValue: { fontSize: 12, color: COLORS.forestSoft, marginTop: 2 },
  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  ingredientPill: { fontSize: 11, color: COLORS.forestSoft, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  starBox: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: '#FBEBBD', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  starBoxLabel: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
  masteryBox: { marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: '#F5FAF3', borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  masteryBoxActive: { backgroundColor: '#FFF6DC', borderColor: '#F5E5A8' },
  masteryLabel: { fontSize: 12, fontWeight: '700', color: COLORS.forestSoft },
  masteryLabelActive: { color: '#B8860B' },
  checkbox: { width: 22, height: 22, borderRadius: 6, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: COLORS.yellow, borderColor: COLORS.yellow },
  checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
});
