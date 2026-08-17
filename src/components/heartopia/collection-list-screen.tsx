import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { CollectionItem } from '@/data/collections';
import { useLanguage } from '@/hooks/use-language';

export interface CollectionSubTab {
  key: string;
  label: string;
  items: CollectionItem[];
}

const STRINGS = {
  nl: {
    searchPlaceholder: 'Zoeken op naam...',
    collected: (n: number, t: number) => `${n} / ${t} verzameld`,
  },
  en: {
    searchPlaceholder: 'Search by name...',
    collected: (n: number, t: number) => `${n} / ${t} collected`,
  },
} as const;

export function CollectionListScreen({
  title,
  icon,
  gradient,
  storageKey,
  subTabs,
  disclaimer,
}: {
  title: string;
  icon: string;
  gradient: [string, string];
  storageKey: string;
  subTabs: CollectionSubTab[];
  disclaimer?: string;
}) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];

  const [activeSub, setActiveSub] = useState(subTabs[0]?.key ?? '');
  const [query, setQuery] = useState('');
  const [collected, setCollected] = useState<Record<string, boolean>>({});

  const activeTab = subTabs.find((tab) => tab.key === activeSub);
  const activeItems = activeTab?.items ?? [];
  const activeStorageKey = `heartopia:${storageKey}:${activeSub}:verzameld`;

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(activeStorageKey);
        setCollected(raw ? JSON.parse(raw) : {});
      } catch {
        setCollected({});
      }
    })();
  }, [activeStorageKey]);

  const toggle = async (name: string) => {
    const updated = { ...collected, [name]: !collected[name] };
    setCollected(updated);
    try {
      await AsyncStorage.setItem(activeStorageKey, JSON.stringify(updated));
    } catch {
      // opslaan mislukt, lokale state blijft zichtbaar tot een herstart
    }
  };

  const visibleItems = useMemo(
    () => activeItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())),
    [activeItems, query]
  );

  const collectedCount = activeItems.filter((item) => collected[item.name]).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={gradient}
        icon={icon}
        title={title}
        subtitle={s.collected(collectedCount, activeItems.length)}
        tabs={subTabs.map((tab) => ({ key: tab.key, label: tab.label }))}
        activeTab={activeSub}
        onTabChange={(key) => {
          setActiveSub(key);
          setQuery('');
        }}
      />
      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={s.searchPlaceholder}
          placeholderTextColor={colors.forestSoft}
          style={styles.searchInput}
        />
      </View>
      <FlatList
        data={visibleItems}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={disclaimer ? <DisclaimerBox text={disclaimer} /> : null}
        renderItem={({ item }) => {
          const isCollected = collected[item.name];
          return (
            <Pressable style={[styles.card, isCollected && styles.cardCollected]} onPress={() => toggle(item.name)}>
              <View style={styles.emojiBadge}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                {isCollected && (
                  <View style={styles.collectedOverlay}>
                    <Text style={styles.collectedCheck}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.name, isCollected && styles.nameCollected]} numberOfLines={2}>
                {item.name}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
    searchInput: {
      backgroundColor: c.card,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: c.forest,
      borderWidth: 1,
      borderColor: c.line,
    },
    listContent: { padding: 16, gap: 10 },
    row: { gap: 10 },
    card: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.line,
      padding: 12,
      marginBottom: 10,
      gap: 8,
    },
    cardCollected: { backgroundColor: c.disclaimerBg, borderColor: c.disclaimerBorder },
    emojiBadge: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: c.iconBg,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    emoji: { fontSize: 24 },
    collectedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,209,102,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    collectedCheck: { fontSize: 18, fontWeight: '700', color: c.forest },
    name: { fontSize: 12, color: c.forest, textAlign: 'center' },
    nameCollected: { textDecorationLine: 'line-through' },
  });
}
