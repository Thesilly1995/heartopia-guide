import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useEventBirds } from '@/data/event-birds';
import { useEventFish } from '@/data/event-fish';
import { useCurrentEventMeta } from '@/data/event-meta';
import { useEventRecipes } from '@/data/event-recipes';
import { useLanguage } from '@/hooks/use-language';
import { RemoteEventRecipe, RemoteEventSighting, useRemoteContent } from '@/lib/remote-content';

const STORAGE_KEY = 'heartopia:event:sterren';

const STRINGS = {
  nl: {
    title: 'Huidig Event',
    disclaimer:
      'Dit tabblad toont alleen content van het HUIDIGE event. Zodra dit event eindigt, vervangen we deze lijst door de vissen, insecten, vogels en recepten van het nieuwe event — oude event-content is dan niet meer te behalen.',
    insectsNote: 'Nog niet ontgrendeld deze season — insecten komen beschikbaar in Week 3 via Naniwa. We vullen dit aan zodra bekend.',
    fish: 'Vissen',
    birds: 'Vogels',
    recipes: 'Recepten',
    insects: 'Insecten',
    bestResult: 'Hoogste resultaat',
    empty: 'Geen actief event op dit moment — zodra een nieuw event begint, komt de content hier te staan.',
  },
  en: {
    title: 'Current Event',
    disclaimer:
      "This tab only shows content from the CURRENT event. Once this event ends, we'll replace this list with the fish, insects, birds and recipes of the new event — old event content can no longer be obtained then.",
    insectsNote: "Not unlocked yet this season — insects become available in Week 3 via Naniwa. We'll fill this in once known.",
    fish: 'Fish',
    birds: 'Birds',
    recipes: 'Recipes',
    insects: 'Insects',
    bestResult: 'Best result',
    empty: 'No active event right now — once a new event starts, its content will appear here.',
  },
} as const;

type EventItem = { name: string; emoji: string; spot?: string; note?: string | null; ingredients?: string[] };

function mapSighting(item: RemoteEventSighting, language: 'nl' | 'en'): EventItem {
  return {
    name: language === 'en' ? item.nameEn : item.nameNl,
    spot: language === 'en' ? item.spotEn : item.spotNl,
    note: language === 'en' ? item.noteEn : item.noteNl,
    emoji: item.emoji,
  };
}

function mapRecipe(item: RemoteEventRecipe, language: 'nl' | 'en'): EventItem {
  return {
    name: language === 'en' ? item.nameEn : item.nameNl,
    ingredients: language === 'en' ? item.ingredientsEn : item.ingredientsNl,
    emoji: item.emoji,
  };
}

export default function EventsScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const bundledEventFish = useEventFish();
  const bundledEventBirds = useEventBirds();
  const bundledEventRecipes = useEventRecipes();
  const { payload } = useRemoteContent();
  const remoteEvent = payload?.event;
  const [tab, setTab] = useState('fish');
  const [stars, setStars] = useState<Record<string, number>>({});

  const eventFish = remoteEvent ? remoteEvent.fish.map((item) => mapSighting(item, language)) : bundledEventFish;
  const eventBirds = remoteEvent ? remoteEvent.birds.map((item) => mapSighting(item, language)) : bundledEventBirds;
  const eventRecipes = remoteEvent ? remoteEvent.recipes.map((item) => mapRecipe(item, language)) : bundledEventRecipes;
  const eventMeta = useCurrentEventMeta();
  const subtitle = `${eventMeta.emoji} ${eventMeta.name} · ${eventMeta.dates}`;

  const TABS: { key: string; label: string; items: EventItem[] }[] = [
    { key: 'fish', label: s.fish, items: eventFish },
    { key: 'birds', label: s.birds, items: eventBirds },
    { key: 'recipes', label: s.recipes, items: eventRecipes },
    { key: 'insects', label: s.insects, items: [] },
  ];

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
        title={s.title}
        subtitle={subtitle}
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
            <DisclaimerBox text={s.disclaimer} />
            {tab === 'insects' && <DisclaimerBox text={s.insectsNote} warning />}
          </View>
        }
        ListEmptyComponent={tab === 'insects' ? null : <Text style={styles.emptyText}>{s.empty}</Text>}
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
              <Text style={styles.starBoxLabel}>{s.bestResult}</Text>
              <StarRow value={stars[item.name] || 0} onSet={(n) => setItemStar(item.name, n)} />
            </View>
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
    emptyText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', padding: 24, lineHeight: 19 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, marginBottom: 10 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    emojiBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 18 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 15, fontWeight: '700', color: c.forest },
    starsText: { fontSize: 12, fontWeight: '700', color: c.yellow, marginTop: 2 },
    spot: { fontSize: 12, color: c.forestSoft, marginTop: 8 },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    note: { fontSize: 11, fontWeight: '700', color: c.coralDark, marginTop: 8 },
    starBox: { marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    starBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
  });
}
