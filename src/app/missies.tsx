import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChecklistRow } from '@/components/heartopia/checklist-row';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';
import { currentDailyResetKey, currentWeeklyResetKey } from '@/lib/reset-schedule';

const STORAGE_KEY = 'heartopia:missies:vinkjes';
const CUSTOM_STORAGE_KEY = 'heartopia:missies:eigen-dailies';
const DAILY_RESET_DAY_KEY = 'heartopia:missies:laatste-reset-dag';
const WEEKLY_RESET_WEEK_KEY = 'heartopia:missies:laatste-reset-week';

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

const DAILY_KEYS: string[] = DAILY.nl.map((item) => item.key);
const WEEKLY_KEYS: string[] = [...WEEKLY.nl.map((item) => item.key), ...SHOPS.nl.map((item) => item.key), 'shops_all'];

const STRINGS = {
  nl: {
    title: 'Missies',
    daily: 'Dagelijks',
    weekly: 'Wekelijks',
    reset: 'Reset',
    resetDaily: 'Elke dag om 06:00 (servertijd)',
    resetWeekly: 'Elke zaterdag om 06:00 (servertijd)',
    resetAll: 'Alles resetten',
    checkShops: 'Winkels checken',
    dailyTasks: 'Dagelijkse taken',
    ownDailies: 'Eigen dagelijkse taken',
    ownDailiesPlaceholder: 'Bijv. Ka Ching-aanbieding kopen...',
    add: 'Toevoegen',
    ownDailiesEmpty: 'Nog niks toegevoegd — zet hier je eigen dagelijkse taakjes bij.',
  },
  en: {
    title: 'Missions',
    daily: 'Daily',
    weekly: 'Weekly',
    reset: 'Reset',
    resetDaily: 'Every day at 06:00 (server time)',
    resetWeekly: 'Every Saturday at 06:00 (server time)',
    resetAll: 'Reset all',
    checkShops: 'Check shops',
    dailyTasks: 'Daily tasks',
    ownDailies: 'Your own daily tasks',
    ownDailiesPlaceholder: 'E.g. buy Ka Ching offer...',
    add: 'Add',
    ownDailiesEmpty: 'Nothing added yet — put your own daily tasks here.',
  },
} as const;

interface CustomItem {
  text: string;
  done: boolean;
}

export default function MissiesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [tab, setTab] = useState<'daily' | 'weekly'>('daily');
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [shopsOpen, setShopsOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(true);
  const [customOpen, setCustomOpen] = useState(false);
  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    (async () => {
      let loadedChecked: Record<string, boolean> = {};
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        loadedChecked = raw ? JSON.parse(raw) : {};
      } catch {
        loadedChecked = {};
      }

      let loadedCustom: CustomItem[] = [];
      try {
        const rawCustom = await AsyncStorage.getItem(CUSTOM_STORAGE_KEY);
        loadedCustom = rawCustom ? JSON.parse(rawCustom) : [];
      } catch {
        loadedCustom = [];
      }

      let checkedChanged = false;
      let customChanged = false;

      try {
        const todayKey = currentDailyResetKey();
        if ((await AsyncStorage.getItem(DAILY_RESET_DAY_KEY)) !== todayKey) {
          loadedChecked = Object.fromEntries(Object.entries(loadedChecked).filter(([key]) => !DAILY_KEYS.includes(key)));
          checkedChanged = true;
          if (loadedCustom.some((item) => item.done)) {
            loadedCustom = loadedCustom.map((item) => ({ ...item, done: false }));
            customChanged = true;
          }
          await AsyncStorage.setItem(DAILY_RESET_DAY_KEY, todayKey);
        }

        const weekKey = currentWeeklyResetKey();
        if ((await AsyncStorage.getItem(WEEKLY_RESET_WEEK_KEY)) !== weekKey) {
          loadedChecked = Object.fromEntries(Object.entries(loadedChecked).filter(([key]) => !WEEKLY_KEYS.includes(key)));
          checkedChanged = true;
          await AsyncStorage.setItem(WEEKLY_RESET_WEEK_KEY, weekKey);
        }
      } catch {
        // reset-check mislukt (opslag niet bereikbaar) — bestaande vinkjes blijven gewoon staan
      }

      setChecked(loadedChecked);
      setCustomItems(loadedCustom);
      if (checkedChanged) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(loadedChecked)).catch(() => {});
      if (customChanged) AsyncStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(loadedCustom)).catch(() => {});
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

  const resetCurrentTab = async () => {
    const keysToClear = tab === 'daily' ? DAILY_KEYS : WEEKLY_KEYS;
    const updated = Object.fromEntries(Object.entries(checked).filter(([key]) => !keysToClear.includes(key)));
    setChecked(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      if (tab === 'daily') {
        await AsyncStorage.setItem(DAILY_RESET_DAY_KEY, currentDailyResetKey());
      } else {
        await AsyncStorage.setItem(WEEKLY_RESET_WEEK_KEY, currentWeeklyResetKey());
      }
    } catch {
      // opslaan mislukt
    }
    if (tab === 'daily' && customItems.some((item) => item.done)) {
      saveCustom(customItems.map((item) => ({ ...item, done: false })));
    }
  };

  const saveCustom = async (updated: CustomItem[]) => {
    setCustomItems(updated);
    try {
      await AsyncStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const addCustomItem = () => {
    if (!customText.trim()) return;
    saveCustom([...customItems, { text: customText.trim(), done: false }]);
    setCustomText('');
  };

  const toggleCustomItem = (i: number) => {
    saveCustom(customItems.map((item, idx) => (idx === i ? { ...item, done: !item.done } : item)));
  };

  const removeCustomItem = (i: number) => {
    saveCustom(customItems.filter((_, idx) => idx !== i));
  };

  const items = tab === 'daily' ? DAILY[language] : WEEKLY[language];
  const resetText = tab === 'daily' ? s.resetDaily : s.resetWeekly;
  const dailyDoneCount = DAILY[language].filter((item) => checked[item.key]).length;

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
          <View>
            <Text style={styles.resetLabel}>{s.reset}</Text>
            <Text style={styles.resetText}>{resetText}</Text>
          </View>
          <Pressable style={styles.resetButton} onPress={resetCurrentTab}>
            <Text style={styles.resetButtonText}>{s.resetAll}</Text>
          </Pressable>
        </View>

        {tab === 'daily' ? (
          <>
            <View style={styles.collapsibleCard}>
              <Pressable style={styles.collapsibleHeader} onPress={() => setDailyOpen(!dailyOpen)}>
                <Text style={styles.collapsibleTitle}>{s.dailyTasks}</Text>
                <Text style={styles.progressBadge}>
                  {dailyDoneCount}/{DAILY[language].length}
                </Text>
                <Text style={styles.chevron}>{dailyOpen ? '⌄' : '›'}</Text>
              </Pressable>
              {dailyOpen && (
                <View style={styles.collapsibleBody}>
                  {items.map((item) => (
                    <ChecklistRow key={item.key} label={item.label} checked={!!checked[item.key]} onPress={() => toggle(item.key)} />
                  ))}
                </View>
              )}
            </View>

            <View style={styles.collapsibleCard}>
              <Pressable style={styles.collapsibleHeader} onPress={() => setCustomOpen(!customOpen)}>
                <Text style={styles.collapsibleTitle}>{s.ownDailies}</Text>
                {customItems.length > 0 && (
                  <Text style={styles.progressBadge}>
                    {customItems.filter((i) => i.done).length}/{customItems.length}
                  </Text>
                )}
                <Text style={styles.chevron}>{customOpen ? '⌄' : '›'}</Text>
              </Pressable>
              {customOpen && (
                <View style={styles.collapsibleBody}>
                  <View style={styles.addRow}>
                    <TextInput
                      value={customText}
                      onChangeText={setCustomText}
                      onSubmitEditing={addCustomItem}
                      placeholder={s.ownDailiesPlaceholder}
                      placeholderTextColor={colors.forestSoft}
                      style={styles.input}
                    />
                    <Pressable style={styles.addButton} onPress={addCustomItem}>
                      <Text style={styles.addButtonText}>{s.add}</Text>
                    </Pressable>
                  </View>
                  {customItems.length === 0 && <Text style={styles.emptyText}>{s.ownDailiesEmpty}</Text>}
                  {customItems.map((item, i) => (
                    <View key={i} style={styles.customRow}>
                      <Pressable style={[styles.checkbox, item.done && styles.checkboxActive]} onPress={() => toggleCustomItem(i)}>
                        {item.done && <Text style={styles.checkmark}>✓</Text>}
                      </Pressable>
                      <Text style={[styles.customItemText, item.done && styles.customItemTextDone]}>{item.text}</Text>
                      <Pressable onPress={() => removeCustomItem(i)} hitSlop={8}>
                        <Text style={styles.removeText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            {items.map((item) => (
              <ChecklistRow key={item.key} label={item.label} checked={!!checked[item.key]} onPress={() => toggle(item.key)} />
            ))}

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
          </>
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
    resetButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.chipBg },
    resetButtonText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    collapsibleCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden' },
    collapsibleHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
    collapsibleTitle: { flex: 1, fontSize: 14, fontWeight: '700', color: c.forest },
    progressBadge: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    collapsibleBody: { paddingHorizontal: 14, paddingBottom: 14, gap: 8 },
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
    addRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
    input: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, color: c.forest, backgroundColor: c.surfaceSoft },
    addButton: { paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.coral, alignItems: 'center', justifyContent: 'center' },
    addButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
    emptyText: { fontSize: 12, color: c.forestSoft },
    customRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    customItemText: { flex: 1, fontSize: 13, color: c.forest },
    customItemTextDone: { color: c.forestSoft, textDecorationLine: 'line-through' },
    removeText: { fontSize: 13, color: c.forestSoft },
  });
}
