import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StarRow } from '@/components/heartopia/star-row';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

export interface EventGroupItem {
  name: string;
  emoji: string;
  spot?: string;
  note?: string | null;
  ingredients?: string[];
}

export interface EventGroup {
  key: string;
  eventName: string;
  eventDates: string;
  emoji: string;
  items: EventGroupItem[];
}

/**
 * Groepeert catalogusitems (vissen/vogels/insecten/recepten) per event, met
 * een kopje (naam + datum) per event — gebruikt door de "Events"-subtab van
 * `HobbyListScreen` (zie `pastEvents` in `remote-content.ts`).
 */
export function EventGroupsList({
  groups,
  emptyText,
  stars,
  onSetStar,
  bestResultLabel,
}: {
  groups: EventGroup[];
  emptyText: string;
  /** Zelfde sterren-opslag als de "Alle"-subtab van dit scherm (zie `heartopia:${storageKey}:stars`), zodat een score op de ene plek ook op de andere zichtbaar is. */
  stars: Record<string, number>;
  onSetStar: (name: string, value: number) => void;
  bestResultLabel: string;
}) {
  const colors = useHeartopiaColors();
  const styles = makeStyles(colors);
  // Het eerste event (huidig event) staat standaard open, de rest (archief) dicht.
  const [openKey, setOpenKey] = useState<string | null>(groups[0]?.key ?? null);

  if (groups.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <>
      {groups.map((group) => {
        const isOpen = openKey === group.key;
        return (
          <View key={group.key} style={styles.groupWrap}>
            <Pressable style={styles.groupHeader} onPress={() => setOpenKey(isOpen ? null : group.key)}>
              <View style={styles.groupHeaderText}>
                <Text style={styles.groupTitle}>
                  {group.emoji} {group.eventName} <Text style={styles.groupCount}>({group.items.length})</Text>
                </Text>
                <Text style={styles.groupDates}>{group.eventDates}</Text>
              </View>
              <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
            </Pressable>
            {isOpen &&
              group.items.map((item) => (
                <View key={item.name} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.emojiBadge}>
                      <Text style={styles.emoji}>{item.emoji}</Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                  </View>
                  {item.spot && <Text style={styles.detail}>📍 {item.spot}</Text>}
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
                    <Text style={styles.starBoxLabel}>{bestResultLabel}</Text>
                    <StarRow value={stars[item.name] || 0} onSet={(n) => onSetStar(item.name, n)} />
                  </View>
                </View>
              ))}
          </View>
        );
      })}
    </>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    emptyWrap: { padding: 32, alignItems: 'center' },
    emptyText: { fontSize: 13, color: c.forestSoft, textAlign: 'center' },
    groupWrap: { marginBottom: 18 },
    groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10, paddingHorizontal: 2, paddingVertical: 4 },
    groupHeaderText: { flex: 1 },
    groupTitle: { fontSize: 16, fontWeight: '800', color: c.forest },
    groupCount: { fontSize: 13, fontWeight: '600', color: c.forestSoft },
    groupDates: { fontSize: 10, color: c.forestSoft, marginTop: 1 },
    chevron: { fontSize: 18, color: c.forestSoft },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 8 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    emojiBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 16 },
    cardTitle: { fontSize: 14, fontWeight: '600', color: c.forest, flexShrink: 1 },
    detail: { fontSize: 11, color: c.forestSoft, marginTop: 6 },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    note: { fontSize: 11, color: c.warningText, marginTop: 6 },
    starBox: { marginTop: 10, padding: 8, borderRadius: 8, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    starBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
  });
}
