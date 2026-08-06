import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PinMap } from '@/components/heartopia/pin-map';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useMeteorSpots } from '@/data/meteor-spots';
import { useRainbowSpots } from '@/data/rainbow-spots';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:rainbow-meteor:vinkjes';

const ISLAND_MAP = require('@/assets/images/maps/island-map.jpg');

const STRINGS = {
  nl: {
    title: 'Rainbow & Meteorenregen',
    subtitle: 'Boeketten & sterrenscherven per gebeurtenis',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteorenregen',
    rainbowDisclaimer:
      'De Rainbow-gebeurtenis duurt ~6 uur en de boeketten-locaties zijn steeds anders. Zodra hij actief is, kan je Claude vragen de actuele locaties op te zoeken/toe te voegen — die verschijnen dan hieronder.',
    meteorDisclaimer:
      'Meteorenregen start willekeurig na 20:00 servertijd en duurt ~6 uur. De ertsplekken zijn steeds anders. Zodra het actief is, kan je Claude vragen de actuele locaties op te zoeken/toe te voegen — die verschijnen dan hieronder.',
    emptyText: 'Niet actief op dit moment. Zodra dit weer gebeurt, komen de actuele locaties hier te staan.',
    resetProgress: 'Voortgang resetten',
  },
  en: {
    title: 'Rainbow & Meteor Shower',
    subtitle: 'Bouquets & star shards per event',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteor Shower',
    rainbowDisclaimer:
      'The Rainbow event lasts ~6 hours and the bouquet locations differ every time. Once it becomes active, you can ask Claude to look up/add the current locations — they will then appear below.',
    meteorDisclaimer:
      'Meteor Shower starts randomly after 20:00 server time and lasts ~6 hours. The ore spots differ every time. Once it becomes active, you can ask Claude to look up/add the current locations — they will then appear below.',
    emptyText: 'Not active right now. Once this happens again, the current locations will appear here.',
    resetProgress: 'Reset progress',
  },
} as const;

export default function RainbowMeteorScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const rainbowSpots = useRainbowSpots();
  const meteorSpots = useMeteorSpots();
  const [tab, setTab] = useState<'rainbow' | 'meteor'>('rainbow');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

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
    const key = `${tab[0]}${num}`;
    const updated = { ...checked, [key]: !checked[key] };
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

  const spots = tab === 'rainbow' ? rainbowSpots : meteorSpots;
  const prefix = tab[0];
  const prefixedChecked = Object.fromEntries(
    Object.entries(checked)
      .filter(([k]) => k.startsWith(prefix))
      .map(([k, v]) => [Number(k.slice(1)), v])
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#B78CD8', '#6EC6E8']}
        icon="🌈☄️"
        title={s.title}
        subtitle={s.subtitle}
        tabs={[
          { key: 'rainbow', label: s.rainbowTab },
          { key: 'meteor', label: s.meteorTab },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'rainbow' | 'meteor')}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <DisclaimerBox text={tab === 'rainbow' ? s.rainbowDisclaimer : s.meteorDisclaimer} warning />

        <PinMap
          source={ISLAND_MAP}
          aspectRatio={825 / 799}
          pins={spots}
          checked={prefixedChecked}
          onToggle={toggle}
          pinColor={tab === 'rainbow' ? '#B78CD8' : colors.skyDark}
          emptyText={s.emptyText}
        />

        {spots.length > 0 && (
          <Pressable style={styles.resetButton} onPress={resetAll}>
            <Text style={styles.resetButtonText}>{s.resetProgress}</Text>
          </Pressable>
        )}

        {spots.map((spot) => {
          const isChecked = prefixedChecked[spot.num];
          return (
            <Pressable key={spot.num} style={styles.row} onPress={() => toggle(spot.num)}>
              <View style={[styles.numBadge, isChecked && styles.numBadgeActive]}>
                <Text style={[styles.numText, isChecked && styles.numTextActive]}>{isChecked ? '✓' : spot.num}</Text>
              </View>
              <Text style={[styles.desc, isChecked && styles.descChecked]}>{spot.description}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 12 },
    resetButton: { alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    resetButtonText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12 },
    numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    numBadgeActive: { backgroundColor: c.yellow },
    numText: { fontSize: 12, fontWeight: '700', color: c.skyDark },
    numTextActive: { color: c.forest },
    desc: { flex: 1, fontSize: 12, color: c.forest },
    descChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
