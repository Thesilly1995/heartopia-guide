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
const WHALEFALL_MAP = require('@/assets/images/maps/whalefall-map.jpg');

const STRINGS = {
  nl: {
    title: 'Rainbow & Meteorenregen',
    subtitle: 'Boeketten & sterrenscherven per gebeurtenis',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteorenregen',
    emptyText: 'Niet actief op dit moment. Zodra dit weer gebeurt, komen de actuele locaties hier te staan.',
    resetProgress: 'Voortgang resetten',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      'In Whalefall Canyon staan tijdens een Rainbow-moment 4 boeketplekken, maar je kunt er maar 1 van de 4 pakken — welke dat is, verschilt per speler.',
    dorisNote:
      '👧 Doris staat bij Whalefall Canyon tijdens Rainbow-momenten (12:00-06:00) — bij haar kun je dan shoppen.',
    mailboxNote: '📮 Vergeet ook niet het boeket bij je eigen brievenbus — die staat er altijd, maar niet op de kaart (want dat is jouw eigen huisplek).',
  },
  en: {
    title: 'Rainbow & Meteor Shower',
    subtitle: 'Bouquets & star shards per event',
    rainbowTab: '🌈 Rainbow',
    meteorTab: '☄️ Meteor Shower',
    emptyText: 'Not active right now. Once this happens again, the current locations will appear here.',
    resetProgress: 'Reset progress',
    whalefallLabel: '🌊 Whalefall Canyon',
    whalefallDisclaimer:
      "During a Rainbow moment, Whalefall Canyon has 4 bouquet spots, but you can only grab 1 of the 4 — which one differs per player.",
    dorisNote: "👧 Doris is at Whalefall Canyon during Rainbow moments (12:00-06:00) — you can shop with her then.",
    mailboxNote: "📮 Don't forget the bouquet above your own mailbox either — it's always there, but not on the map (since that's your own house spot).",
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

  const islandSpots = spots.filter((spot) => !('underwater' in spot) || !spot.underwater);
  const whalefallSpots = tab === 'rainbow' ? rainbowSpots.filter((spot) => spot.underwater) : [];
  const pinColor = tab === 'rainbow' ? '#B78CD8' : colors.skyDark;
  const withIcon = (list: typeof spots) =>
    tab === 'rainbow' ? list.map((spot) => ({ ...spot, icon: 'isDoris' in spot && spot.isDoris ? '👧' : '🌈' })) : list;

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
        {tab === 'rainbow' && <DisclaimerBox text={s.mailboxNote} />}
        {tab === 'rainbow' && rainbowSpots.some((spot) => spot.isDoris) && <DisclaimerBox text={s.dorisNote} />}

        <PinMap
          source={ISLAND_MAP}
          aspectRatio={825 / 799}
          pins={withIcon(islandSpots)}
          checked={prefixedChecked}
          onToggle={toggle}
          pinColor={pinColor}
          emptyText={tab === 'rainbow' && whalefallSpots.length > 0 ? undefined : s.emptyText}
        />

        {tab === 'rainbow' && whalefallSpots.length > 0 && (
          <>
            <Text style={styles.mapLabel}>{s.whalefallLabel}</Text>
            <DisclaimerBox text={s.whalefallDisclaimer} />
            <PinMap
              source={WHALEFALL_MAP}
              aspectRatio={1197 / 880}
              pins={withIcon(whalefallSpots)}
              checked={prefixedChecked}
              onToggle={toggle}
              pinColor={pinColor}
            />
          </>
        )}

        {spots.length > 0 && (
          <Pressable style={styles.resetButton} onPress={resetAll}>
            <Text style={styles.resetButtonText}>{s.resetProgress}</Text>
          </Pressable>
        )}

        {spots.map((spot) => {
          const isChecked = prefixedChecked[spot.num];
          const underwater = 'underwater' in spot && spot.underwater;
          return (
            <Pressable key={spot.num} style={styles.row} onPress={() => toggle(spot.num)}>
              <View style={[styles.numBadge, isChecked && styles.numBadgeActive]}>
                <Text style={[styles.numText, isChecked && styles.numTextActive]}>{isChecked ? '✓' : spot.num}</Text>
              </View>
              <Text style={[styles.desc, isChecked && styles.descChecked]}>
                {underwater ? '🌊 ' : ''}
                {spot.description}
              </Text>
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
    mapLabel: { fontSize: 13, fontWeight: '700', color: c.forest, marginTop: 4 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12 },
    numBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    numBadgeActive: { backgroundColor: c.yellow },
    numText: { fontSize: 12, fontWeight: '700', color: c.skyDark },
    numTextActive: { color: c.forest },
    desc: { flex: 1, fontSize: 12, color: c.forest },
    descChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
