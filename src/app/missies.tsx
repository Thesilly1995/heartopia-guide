import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChecklistRow } from '@/components/heartopia/checklist-row';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

const STORAGE_KEY = 'heartopia:missies:vinkjes';

const DAILY = [
  { key: 'd1', label: '5x Bewonersverzoek (Resident Requests)' },
  { key: 'd3', label: 'Winkel-restock bekijken (meubels & kleding)' },
  { key: 'd4', label: 'Post/mailbox controleren' },
  { key: 'd5', label: "Hobby's beoefenen (vissen, tuinieren, insecten, etc.)" },
  { key: 'd6', label: 'Huisdier voeren, aaien & trainen' },
  { key: 'd7', label: 'Wilde dieren voeren' },
  { key: 'd10', label: 'Gewassen oogsten & water geven' },
  { key: 'd11', label: 'Bloemen checken & water geven' },
  { key: 'd12', label: "Ka Ching's winkel bekijken" },
  { key: 'd13', label: 'Azure bekijken (indien actief event)' },
  { key: 'd14', label: 'Laboratorium checken' },
];

const WEEKLY = [
  { key: 'w1', label: 'Wekelijkse taken afronden (D.G. Level 13+)' },
  { key: 'w2', label: 'Roze Bubbels verzamelen' },
  { key: 'w3', label: 'Event-weekdoelen (indien actief)' },
];

const SHOPS = [
  { key: 's1', label: 'Boekenwinkel' },
  { key: 's2', label: 'Insectenwinkel (Naniwa)' },
  { key: 's3', label: 'Viswinkel (Vanya)' },
  { key: 's4', label: 'Tuinwinkel (Blanc)' },
  { key: 's5', label: 'Instrumentenwinkel (Annie)' },
  { key: 's6', label: 'Laboratorium (aanbiedingen)' },
  { key: 's7', label: 'Kookwinkel (Massimo)' },
  { key: 's8', label: 'Vogelwinkel (Bailey)' },
];


export default function MissiesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
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

  const items = tab === 'daily' ? DAILY : WEEKLY;
  const resetText = tab === 'daily' ? 'Elke dag om 6:00 (servertijd)' : 'Elke maandag om 6:00 (servertijd)';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#E8A24F', '#F0C674']}
        icon="📋"
        title="Missies"
        tabs={[
          { key: 'daily', label: 'Dagelijks' },
          { key: 'weekly', label: 'Wekelijks' },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'daily' | 'weekly')}
      />
      <ScrollView contentContainerStyle={styles.listContent}>
        <View style={styles.resetRow}>
          <Text style={styles.resetLabel}>Reset</Text>
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
              <Text style={styles.shopsTitle}>Winkels checken</Text>
              <Text style={styles.chevron}>{shopsOpen ? '⌄' : '›'}</Text>
            </Pressable>
            {shopsOpen && (
              <View style={styles.shopsList}>
                {SHOPS.map((shop) => (
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
