import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChecklistRow } from '@/components/heartopia/checklist-row';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:missies:vinkjes';

const DAILY = {
  nl: [
    { key: 'd0', label: 'Dagelijkse check-in' },
    { key: 'd1', label: '5x Bewonersverzoek (Resident Requests)' },
    { key: 'd3', label: 'Winkel-restock bekijken (meubels & kleding)' },
    { key: 'd4', label: 'Post/mailbox controleren' },
    { key: 'd6', label: 'Huisdier voeren, aaien & trainen' },
    { key: 'd7', label: 'Wilde dieren voeren' },
    { key: 'd10', label: 'Gewassen oogsten & water geven' },
    { key: 'd11', label: 'Bloemen checken & water geven' },
    { key: 'd12', label: "Ka Ching's winkel bekijken" },
    { key: 'd13', label: 'Azure bekijken (indien actief event)' },
    { key: 'd14', label: 'Laboratorium checken' },
  ],
  en: [
    { key: 'd0', label: 'Daily check-in' },
    { key: 'd1', label: '5x Resident Request' },
    { key: 'd3', label: 'Check shop restock (furniture & clothing)' },
    { key: 'd4', label: 'Check mail/mailbox' },
    { key: 'd6', label: 'Feed, pet & train your pet' },
    { key: 'd7', label: 'Feed wild animals' },
    { key: 'd10', label: 'Harvest crops & water them' },
    { key: 'd11', label: 'Check flowers & water them' },
    { key: 'd12', label: "Check Ka Ching's shop" },
    { key: 'd13', label: 'Check Azure (if an event is active)' },
    { key: 'd14', label: 'Check the Laboratory' },
  ],
} as const;

const WEEKLY = {
  nl: [
    { key: 'w1', label: 'Wekelijkse taken afronden (D.G. Level 13+)' },
    { key: 'w2', label: 'Roze Bubbels verzamelen' },
    { key: 'w3', label: 'Event-weekdoelen (indien actief)' },
  ],
  en: [
    { key: 'w1', label: 'Complete weekly tasks (D.G. Level 13+)' },
    { key: 'w2', label: 'Collect Pink Bubbles' },
    { key: 'w3', label: 'Event weekly goals (if active)' },
  ],
} as const;

const SHOPS = {
  nl: [
    { key: 's1', label: 'Boekenwinkel' },
    { key: 's2', label: 'Insectenwinkel (Naniwa)' },
    { key: 's3', label: 'Viswinkel (Vanya)' },
    { key: 's4', label: 'Tuinwinkel (Blanc)' },
    { key: 's5', label: 'Instrumentenwinkel (Annie)' },
    { key: 's6', label: 'Laboratorium (aanbiedingen)' },
    { key: 's7', label: 'Kookwinkel (Massimo)' },
    { key: 's8', label: 'Vogelwinkel (Bailey)' },
  ],
  en: [
    { key: 's1', label: 'Book Shop' },
    { key: 's2', label: 'Insect Shop (Naniwa)' },
    { key: 's3', label: 'Fishing Shop (Vanya)' },
    { key: 's4', label: 'Garden Shop (Blanc)' },
    { key: 's5', label: 'Instrument Shop (Annie)' },
    { key: 's6', label: 'Laboratory (offers)' },
    { key: 's7', label: 'Cooking Shop (Massimo)' },
    { key: 's8', label: 'Bird Shop (Bailey)' },
  ],
} as const;

const STRINGS = {
  nl: {
    title: 'Missies',
    daily: 'Dagelijks',
    weekly: 'Wekelijks',
    reset: 'Reset',
    resetDaily: 'Elke dag om 7:00 (servertijd)',
    resetWeekly: 'Elke zaterdag om 7:00 (servertijd)',
    checkShops: 'Winkels checken',
  },
  en: {
    title: 'Missions',
    daily: 'Daily',
    weekly: 'Weekly',
    reset: 'Reset',
    resetDaily: 'Every day at 7:00 (server time)',
    resetWeekly: 'Every Saturday at 7:00 (server time)',
    checkShops: 'Check shops',
  },
} as const;

export default function MissiesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shopsOpen, setShopsOpen] = useState(false);

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

  const toggle = async (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const items = tab === 'daily' ? DAILY[language] : WEEKLY[language];
  const resetText = tab === 'daily' ? s.resetDaily : s.resetWeekly;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#E8A24F', '#F0C674']}
        icon="📋"
        title={s.title}
        tabs={[
          { key: 'daily', label: s.daily },
          { key: 'weekly', label: s.weekly },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'daily' | 'weekly')}
      />
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.resetRow}>
          <Text style={styles.resetLabel}>{s.reset}</Text>
          <Text style={styles.resetText}>{resetText}</Text>
        </View>

        {items.map((item) => (
          <ChecklistRow key={item.key} label={item.label} checked={!!checked[item.key]} onPress={() => toggle(item.key)} />
        ))}

        {tab === 'weekly' && (
          <View style={styles.shopsCard}>
            <Pressable style={styles.shopsHeader} onPress={() => setShopsOpen(!shopsOpen)}>
              <View style={[styles.checkbox, checked.shops_all && styles.checkboxActive]}>
                {checked.shops_all && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.shopsTitle}>{s.checkShops}</Text>
              <Text style={styles.chevron}>{shopsOpen ? '⌄' : '›'}</Text>
            </Pressable>
            {shopsOpen && (
              <View style={styles.shopsList}>
                {SHOPS[language].map((shop) => (
                  <Pressable key={shop.key} style={styles.shopRow} onPress={() => toggle(shop.key)}>
                    <View style={[styles.smallCheckbox, checked[shop.key] && styles.checkboxActive]}>
                      {checked[shop.key] && <Text style={styles.checkmarkSmall}>✓</Text>}
                    </View>
                    <Text style={[styles.shopLabel, checked[shop.key] && styles.shopLabelChecked]}>{shop.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    resetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder },
    resetLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    resetText: { fontSize: 12, color: c.forestSoft },
    shopsCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden' },
    shopsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    checkbox: { width: 24, height: 24, borderRadius: 6, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
    shopsTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: c.forest },
    chevron: { fontSize: 18, color: c.forestSoft },
    shopsList: { paddingHorizontal: 14, paddingBottom: 14, gap: 6 },
    shopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    smallCheckbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkmarkSmall: { fontSize: 11, color: '#FFFFFF', fontWeight: '700' },
    shopLabel: { flex: 1, fontSize: 12, color: c.forest },
    shopLabelChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
