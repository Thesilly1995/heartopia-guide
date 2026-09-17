import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PinMap } from '@/components/heartopia/pin-map';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useBubbleLocations, useBubbleWeekLabel } from '@/data/bubble-locations';
import { useLanguage } from '@/hooks/use-language';
import { useServer } from '@/hooks/use-server';
import { currentWeeklyResetKey } from '@/lib/reset-schedule';

const STORAGE_KEY = 'heartopia:bubbels:vinkjes';
const RESET_WEEK_KEY = 'heartopia:bubbels:laatste-reset-week';

const STRINGS = {
  nl: {
    title: 'Wekelijkse Bubbels',
    subtitle: 'Roze bubbels vol beloningen',
    disclaimer:
      'Er zijn elke week 19 roze bubbels (15 op het hoofdeiland, 4 onderwater in Whalefall Canyon) — de exacte plekken en beloningen wisselen elke zaterdag. De kaart hieronder toont de plekken van deze week.',
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
      'There are 19 pink bubbles every week (15 on the main island, 4 underwater in Whalefall Canyon) — the exact spots and rewards change every Saturday. The map below shows this week\'s spots.',
    resetAll: 'Reset all',
    source: 'Source: community map (Illuminight)',
    map: '🗺️ Map',
    list: '📋 List',
    whalefallLabel: '🌊 16-19 (Whalefall Canyon)',
  },
  es: {
    title: 'Burbujas Semanales',
    subtitle: 'Burbujas rosas llenas de recompensas',
    disclaimer:
      'Cada semana hay 19 burbujas rosas (15 en la isla principal, 4 bajo el agua en Whalefall Canyon) — los lugares exactos y las recompensas cambian cada sábado. El mapa de abajo muestra los lugares de esta semana.',
    resetAll: 'Reiniciar todo',
    source: 'Fuente: mapa de la comunidad (Illuminight)',
    map: '🗺️ Mapa',
    list: '📋 Lista',
    whalefallLabel: '🌊 16-19 (Whalefall Canyon)',
  },
  pt: {
    title: 'Bolhas Semanais',
    subtitle: 'Bolhas rosa cheias de recompensas',
    disclaimer:
      'Toda semana há 19 bolhas rosa (15 na ilha principal, 4 debaixo da água em Whalefall Canyon) — os locais exatos e as recompensas mudam todo sábado. O mapa abaixo mostra os locais desta semana.',
    resetAll: 'Redefinir tudo',
    source: 'Fonte: mapa da comunidade (Illuminight)',
    map: '🗺️ Mapa',
    list: '📋 Lista',
    whalefallLabel: '🌊 16-19 (Whalefall Canyon)',
  },
} as const;

const ISLAND_MAP = require('@/assets/images/maps/island-map.jpg');
const WHALEFALL_MAP = require('@/assets/images/maps/whalefall-map.jpg');

export default function BubbelsScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const { server } = useServer();
  const s = STRINGS[language];
  const BUBBLE_LOCATIONS = useBubbleLocations();
  const weekLabel = useBubbleWeekLabel();
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [view, setView] = useState<'map' | 'list'>('map');

  useEffect(() => {
    (async () => {
      let loaded: Record<number, boolean> = {};
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        loaded = raw ? JSON.parse(raw) : {};
      } catch {
        loaded = {};
      }

      try {
        const weekKey = currentWeeklyResetKey(server.offsetHours);
        if ((await AsyncStorage.getItem(RESET_WEEK_KEY)) !== weekKey) {
          loaded = {};
          await AsyncStorage.setItem(RESET_WEEK_KEY, weekKey);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({}));
        }
      } catch {
        // reset-check mislukt (opslag niet bereikbaar) — bestaande vinkjes blijven gewoon staan
      }

      setChecked(loaded);
    })();
  }, [server.offsetHours]);

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
      await AsyncStorage.setItem(RESET_WEEK_KEY, currentWeeklyResetKey(server.offsetHours));
    } catch {
      // opslaan mislukt
    }
  };

  const islandPins = BUBBLE_LOCATIONS.filter((b) => !b.underwater);
  const whalefallPins = BUBBLE_LOCATIONS.filter((b) => b.underwater);

  const header = (
    <View style={{ gap: 10, marginBottom: 10 }}>
      <View style={styles.topRow}>
        <Text style={styles.weekLabel}>{weekLabel}</Text>
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
