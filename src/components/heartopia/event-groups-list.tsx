import { StyleSheet, Text, View } from 'react-native';

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
export function EventGroupsList({ groups, emptyText }: { groups: EventGroup[]; emptyText: string }) {
  const colors = useHeartopiaColors();
  const styles = makeStyles(colors);

  if (groups.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <View key={group.key} style={styles.groupWrap}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupTitle}>
              {group.emoji} {group.eventName}
            </Text>
            <Text style={styles.groupDates}>{group.eventDates}</Text>
          </View>
          {group.items.map((item) => (
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
            </View>
          ))}
        </View>
      ))}
    </>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    emptyWrap: { padding: 32, alignItems: 'center' },
    emptyText: { fontSize: 13, color: c.forestSoft, textAlign: 'center' },
    groupWrap: { marginBottom: 18 },
    groupHeader: { marginBottom: 10, paddingHorizontal: 2 },
    groupTitle: { fontSize: 16, fontWeight: '800', color: c.forest },
    groupDates: { fontSize: 10, color: c.forestSoft, marginTop: 1 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 8 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    emojiBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 16 },
    cardTitle: { fontSize: 14, fontWeight: '600', color: c.forest, flexShrink: 1 },
    detail: { fontSize: 11, color: c.forestSoft, marginTop: 6 },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
    note: { fontSize: 11, color: c.warningText, marginTop: 6 },
  });
}
