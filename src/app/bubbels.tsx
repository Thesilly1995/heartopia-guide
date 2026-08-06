import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PinMap } from '@/components/heartopia/pin-map';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useBubbleLocations } from '@/data/bubble-locations';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:bubbels:vinkjes';

const STRINGS = {
  nl: {
    title: 'Wekelijkse Bubbels',
    subtitle: 'Roze bubbels vol beloningen',
    disclaimer:
      'Er zijn elke week 19 roze bubbels (15 op het hoofdeiland, 4 onderwater in Whalefall Canyon), op vaste plekken die week — maar de exacte plekken en beloningen wisselen elke zaterdag. Deze app kan geen live locaties bijhouden; vraag me in de chat om de actuele lijst op te zoeken wanneer je hem nodig hebt.',
    week: 'Deze week (1-8 aug 2026)',
    resetAll: 'Alles resetten',
    source: 'Bron: community-kaart (Illuminight)',
    map: '🗺️ Kaart',
    list: '📋 Lijst',
    whalefallLabel: '🌊 16-19 (Whalefall Canyon)',
  },
  en: {
    title: 'Weekly Bubbles',
    subtitle: 'Pink bubbles full of rewards',
    disclaimer:
      "There are 19 pink bubbles every week (15 on the main island, 4 underwater in Whalefall Canyon), at fixed spots for that week — but the exact spots and rewards change every Saturday. This app can't track live locations; just ask me in the chat to look up the current list whenever you need it.",
    week: 'This week (Aug 1-8, 2026)',
    resetAll: 'Reset all',
    source: 'Source: community map (Illuminight)',
    map: '🗺️ Map',
    list: '📋 List',
    whalefallLabel: '🌊 16-19 (Whalefall Canyon)',
  },
} as const;

const ISLAND_MAP = require('@/assets/images/maps/island-map.jpg');
const WHALEFALL_MAP = require('@/assets/images/maps/whalefall-map.jpg');

export default function BubbelsScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const BUBBLE_LOCATIONS = useBubbleLocations();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [view, setView] = useState<'map' | 'list'>('map');

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

  const islandPins = BUBBLE_LOCATIONS.filter((b) => !b.underwater);
  const whalefallPins = BUBBLE_LOCATIONS.filter((b) => b.underwater);

  const header = (
    <View style={{ gap: 10, marginBottom: 10 }}>
      <View style={styles.topRow}>
        <Text style={styles.weekLabel}>{s.week}</Text>
        <Pressable style={styles.resetButton} onPress={resetAll}>
          <Text style={styles.resetButtonText}>{s.resetAll}</Text>
        </Pressable>
      </View>
      <Text style={styles.source}>{s.source}</Text>
      <DisclaimerBox text={s.disclaimer} />
      <View style={styles.viewToggle}>
        {(['map', 'list'] as const).map((v) => (
          <Pressable key={v} style={[styles.viewChip, view === v && styles.viewChipActive]} onPress={() => setView(v)}>
            <Text style={[styles.viewChipText, view === v && styles.viewChipTextActive]}>
              {v === 'map' ? s.map : s.list}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#E8A0A8', '#FF8FA3']} icon="🫧" title={s.title} subtitle={s.subtitle} />

      {view === 'map' ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          {header}
          <PinMap source={ISLAND_MAP} aspectRatio={825 / 799} pins={islandPins} checked={checked} onToggle={toggle} pinColor={colors.coral} />
          <Text style={styles.mapLabel}>{s.whalefallLabel}</Text>
          <PinMap
            source={WHALEFALL_MAP}
            aspectRatio={1197 / 880}
            pins={whalefallPins}
            checked={checked}
            onToggle={toggle}
            pinColor={colors.skyDark}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={BUBBLE_LOCATIONS}
          keyExtractor={(item) => String(item.num)}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={header}
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
      )}
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    weekLabel: { fontSize: 16, fontWeight: '700', color: c.forest },
    resetButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    resetButtonText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    source: { fontSize: 10, color: c.forestSoft, marginTop: -6 },
    viewToggle: { flexDirection: 'row', gap: 8 },
    viewChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: c.chipBg },
    viewChipActive: { backgroundColor: c.coral },
    viewChipText: { fontSize: 12, fontWeight: '700', color: c.skyDark },
    viewChipTextActive: { color: '#FFFFFF' },
    mapLabel: { fontSize: 13, fontWeight: '700', color: c.forest, marginTop: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    numBadgeActive: { backgroundColor: c.yellow },
    numText: { fontSize: 12, fontWeight: '700', color: c.skyDark },
    numTextActive: { color: c.forest },
    desc: { flex: 1, fontSize: 12, color: c.forest },
    descChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
