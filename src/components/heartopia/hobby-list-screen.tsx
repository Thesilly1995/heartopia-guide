import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RarityPill } from '@/components/heartopia/rarity-pill';
import { StarRow } from '@/components/heartopia/star-row';
import { ColorKey, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

export interface HobbyItem {
  name: string;
  level: number;
  rarity: string;
  rarityColorKey: ColorKey;
  xp?: number;
  emoji: string;
  spot?: string;
  watertype?: string;
  time?: string;
  weather?: string;
  tool?: string;
  ingredients?: string[];
  growTime?: string;
  seedPrice?: number;
  method?: string;
  sellPrice?: string;
}

export interface HobbySubTab {
  key: string;
  label: string;
  items: HobbyItem[];
  disclaimer?: string;
}

const LEVEL_FILTERS = ['Alle', 1, 3, 5, 7, 9] as const;
const PROGRESS_FILTERS = ['all', 'undiscovered', 'notFiveStar', 'byStars'] as const;
type ProgressFilter = (typeof PROGRESS_FILTERS)[number];

const WEATHER_WORDS = {
  nl: ['Zonnig', 'Regen', 'Regenboog'],
  en: ['Sunny', 'Rainy', 'Rainbow'],
} as const;

const STRINGS = {
  nl: {
    back: '‹ Terug',
    itemsInGuide: (n: number) => `${n} items in deze gids`,
    searchPlaceholder: 'Zoeken op naam...',
    all: 'Alle',
    allWeather: 'Alle weer',
    spot: 'Plek',
    time: 'Tijdstip',
    weather: 'Weer',
    tool: 'Gereedschap',
    ingredients: 'Ingrediënten',
    growTime: 'Groeitijd',
    seedPrice: 'Zaadprijs',
    method: 'Hoe krijg je dit',
    sellPrice: 'Verkoopprijs',
    bestResult: 'Hoogste resultaat',
    masteryAchieved: 'Mastery behaald',
    progressUndiscovered: '🔍 Nog te ontdekken',
    progressNotFiveStar: '⭐ Nog geen 5★',
    progressByStars: '📋 Mijn sterren (1-5)',
  },
  en: {
    back: '‹ Back',
    itemsInGuide: (n: number) => `${n} items in this guide`,
    searchPlaceholder: 'Search by name...',
    all: 'All',
    allWeather: 'All weather',
    spot: 'Spot',
    time: 'Time',
    weather: 'Weather',
    tool: 'Tool',
    ingredients: 'Ingredients',
    growTime: 'Grow time',
    seedPrice: 'Seed price',
    method: 'How to get this',
    sellPrice: 'Sell price',
    bestResult: 'Best result',
    masteryAchieved: 'Mastery achieved',
    progressUndiscovered: '🔍 Not discovered yet',
    progressNotFiveStar: '⭐ Not 5★ yet',
    progressByStars: '📋 My stars (1-5)',
  },
} as const;

export function HobbyListScreen({
  title,
  icon,
  items,
  subTabs,
  gradient,
  storageKey,
}: {
  title: string;
  icon: string;
  items?: HobbyItem[];
  subTabs?: HobbySubTab[];
  gradient: [string, string];
  storageKey: string;
}) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const WEATHER_FILTERS = ['Alle', ...WEATHER_WORDS[language]] as const;

  const [openName, setOpenName] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [maxLevel, setMaxLevel] = useState<number>(99);
  const [weatherFilter, setWeatherFilter] = useState<string>('Alle');
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>('all');
  const [activeSub, setActiveSub] = useState<string>(subTabs?.[0]?.key ?? '');
  const [stars, setStars] = useState<Record<string, number>>({});
  const [mastery, setMastery] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setWeatherFilter('Alle');
  }, [language]);

  const activeTab = subTabs?.find((tab) => tab.key === activeSub);
  const activeItems = subTabs ? (activeTab?.items ?? []) : (items ?? []);
  const hasWeather = activeItems.length > 0 && activeItems[0].weather !== undefined;
  const activeStorageKey = subTabs ? `${storageKey}:${activeSub}` : storageKey;

  const starsStorageKey = `heartopia:${activeStorageKey}:stars`;
  const masteryStorageKey = `heartopia:${activeStorageKey}:mastery`;

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
    let filtered = activeItems
      .filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
      .filter((item) => maxLevel === 99 || item.level >= maxLevel);

    if (progressFilter === 'undiscovered') {
      filtered = filtered.filter((item) => (stars[item.name] ?? 0) === 0);
    } else if (progressFilter === 'notFiveStar') {
      filtered = filtered.filter((item) => {
        const value = stars[item.name] ?? 0;
        return value > 0 && value < 5;
      });
    } else if (progressFilter === 'byStars') {
      filtered = filtered
        .filter((item) => (stars[item.name] ?? 0) > 0)
        .sort((a, b) => (stars[a.name] ?? 0) - (stars[b.name] ?? 0));
    }

    if (weatherFilter === 'Alle') return filtered;

    return [...filtered].sort((a, b) => {
      const aMatch = a.weather?.includes(weatherFilter) ? 1 : 0;
      const bMatch = b.weather?.includes(weatherFilter) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [activeItems, query, maxLevel, weatherFilter, progressFilter, stars]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LinearGradient colors={gradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          hitSlop={8}
          style={styles.backButton}>
          <Text style={styles.backButtonText}>{s.back}</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          {icon} {title}
        </Text>

        {subTabs && (
          <View style={styles.chipRow}>
            {subTabs.map((tab) => {
              const active = activeSub === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => {
                    setActiveSub(tab.key);
                    setOpenName(null);
                  }}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{tab.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Text style={styles.headerCount}>{s.itemsInGuide(visibleItems.length)}</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={s.searchPlaceholder}
          placeholderTextColor={colors.forestSoft}
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
                  {isAll ? s.all : `Lv.${lvl}+`}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.chipRow}>
          {PROGRESS_FILTERS.map((pf) => {
            const active = progressFilter === pf;
            const label =
              pf === 'all'
                ? s.all
                : pf === 'undiscovered'
                  ? s.progressUndiscovered
                  : pf === 'notFiveStar'
                    ? s.progressNotFiveStar
                    : s.progressByStars;
            return (
              <Pressable key={pf} onPress={() => setProgressFilter(pf)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {hasWeather && (
          <View style={styles.chipRow}>
            {WEATHER_FILTERS.map((w) => {
              const active = weatherFilter === w;
              const label =
                w === 'Alle' ? s.allWeather : `${w === WEATHER_WORDS[language][0] ? '☀️' : w === WEATHER_WORDS[language][1] ? '🌧️' : '🌈'} ${w}`;
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
        ListHeaderComponent={
          activeTab?.disclaimer ? (
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerText}>{activeTab.disclaimer}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const isOpen = openName === item.name;
          const weatherMatch = hasWeather && weatherFilter !== 'Alle' && !!item.weather?.includes(weatherFilter);
          const weatherEmoji =
            weatherFilter === WEATHER_WORDS[language][0] ? '☀️' : weatherFilter === WEATHER_WORDS[language][1] ? '🌧️' : '🌈';
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
                        <Text style={styles.detailLabel}>{s.spot}</Text>
                        <Text style={styles.detailValue}>
                          {item.spot} ({item.watertype})
                        </Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.time}</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.weather}</Text>
                        <Text style={styles.detailValue}>{item.weather}</Text>
                      </View>
                    </View>
                  )}

                  {item.ingredients !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.tool}</Text>
                        <Text style={styles.detailValue}>{item.tool}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.ingredients}</Text>
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

                  {item.growTime !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.growTime}</Text>
                        <Text style={styles.detailValue}>{item.growTime}</Text>
                      </View>
                      <View style={styles.detailBox}>
                        <Text style={styles.detailLabel}>{s.seedPrice}</Text>
                        <Text style={styles.detailValue}>{item.seedPrice} 🪙</Text>
                      </View>
                    </View>
                  )}

                  {item.method !== undefined && (
                    <View style={styles.detailGrid}>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.method}</Text>
                        <Text style={styles.detailValue}>{item.method}</Text>
                      </View>
                      <View style={[styles.detailBox, styles.detailBoxFull]}>
                        <Text style={styles.detailLabel}>{s.sellPrice}</Text>
                        <Text style={styles.detailValue}>{item.sellPrice}</Text>
                      </View>
                    </View>
                  )}

                  <View style={styles.starBox}>
                    <Text style={styles.starBoxLabel}>{s.bestResult}</Text>
                    <StarRow value={stars[item.name] || 0} onSet={(n) => setItemStar(item.name, n)} />
                  </View>

                  <Pressable
                    style={[styles.masteryBox, mastery[item.name] && styles.masteryBoxActive]}
                    onPress={() => toggleMastery(item.name)}>
                    <Text style={[styles.masteryLabel, mastery[item.name] && styles.masteryLabelActive]}>
                      {s.masteryAchieved}
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

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
    backButton: { alignSelf: 'flex-start', marginBottom: 8 },
    backButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
    headerCount: { color: '#FFFFFF', fontSize: 12, opacity: 0.9, marginTop: 2 },
    searchInput: {
      marginTop: 12,
      backgroundColor: c.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: c.forest,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.25)' },
    chipActive: { backgroundColor: '#FFFFFF' },
    chipText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
    chipTextActive: { color: c.forest },
    listContent: { padding: 16, gap: 10 },
    disclaimer: { padding: 12, borderRadius: 12, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, marginBottom: 10 },
    disclaimerText: { fontSize: 11, color: c.forestSoft },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden', marginBottom: 10 },
    cardHighlighted: { borderWidth: 2, borderColor: c.yellow },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 20 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: c.forest },
    badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' },
    levelBadge: { fontSize: 10, fontWeight: '700', color: c.skyDark, backgroundColor: c.chipBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    weatherBadge: { fontSize: 10, fontWeight: '700', color: c.warningText, backgroundColor: c.warningBg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
    starsText: { fontSize: 12, fontWeight: '700', color: c.yellow },
    chevron: { fontSize: 18, color: c.forestSoft },
    cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    detailBox: { flexBasis: '47%', flexGrow: 1, backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    detailBoxFull: { flexBasis: '100%' },
    detailLabel: { fontSize: 11, fontWeight: '700', color: c.forest },
    detailValue: { fontSize: 12, color: c.forestSoft, marginTop: 2 },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    starBox: { marginTop: 12, padding: 10, borderRadius: 10, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    starBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    masteryBox: { marginTop: 8, padding: 10, borderRadius: 10, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    masteryBoxActive: { backgroundColor: c.warningBg, borderColor: c.warningBorder },
    masteryLabel: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
    masteryLabelActive: { color: c.warningText },
    checkbox: { width: 22, height: 22, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  });
}
