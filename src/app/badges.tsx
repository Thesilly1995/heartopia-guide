import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { BADGE_ICON_MAP } from '@/constants/badge-icons';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useBadges } from '@/data/badges';
import { useLanguage } from '@/hooks/use-language';

const STORAGE_KEY = 'heartopia:badges:behaald';

const STRINGS = {
  nl: {
    title: 'Badges',
    subtitle: 'Prestaties & profieltitels (D.G. Level 15+)',
    disclaimer:
      '60+ badges, gebaseerd op een screenshot van jouw eigen Achievement-overzicht. Tik op het icoon om een badge als behaald te markeren, of gebruik de teller om voortgang bij te houden. Er zijn nog een aantal volledig verborgen badges die niet in deze lijst staan (nog geen naam bekend).',
    hiddenDivider: '🔒 Verborgen Prestaties',
  },
  en: {
    title: 'Badges',
    subtitle: 'Achievements & profile titles (D.G. Level 15+)',
    disclaimer:
      "60+ badges, based on a screenshot of your own Achievement overview. Tap the icon to mark a badge as earned, or use the counter to track progress. There are still some fully hidden badges not in this list (name not yet known).",
    hiddenDivider: '🔒 Hidden Achievements',
  },
} as const;

export default function BadgesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const BADGES = useBadges();
  const [earned, setEarned] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setEarned(raw ? JSON.parse(raw) : {});
      } catch {
        setEarned({});
      }
    })();
  }, []);

  const toggle = async (name: string) => {
    const updated = { ...earned, [name]: !earned[name] };
    setEarned(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const visible = BADGES.filter((b) => !b.hidden);
  const hidden = BADGES.filter((b) => b.hidden).sort((a, b) => (a.iconKey ? 0 : 1) - (b.iconKey ? 0 : 1));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#FFD166', '#E8A24F']} icon="🏅" title={s.title} subtitle={s.subtitle} />
      <FlatList
        data={[...visible, { name: '__divider__', emoji: '', hidden: true, iconKey: null }, ...hidden]}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ marginBottom: 10 }}>
            <DisclaimerBox text={s.disclaimer} />
          </View>
        }
        renderItem={({ item: badge }) => {
          if (badge.name === '__divider__') {
            return (
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{s.hiddenDivider}</Text>
                <View style={styles.dividerLine} />
              </View>
            );
          }
          const isEarned = earned[badge.name];
          const iconSource = badge.iconKey ? BADGE_ICON_MAP[badge.iconKey] : null;
          return (
            <Pressable
              style={[styles.card, badge.hidden && styles.cardHidden]}
              onPress={() => toggle(badge.name)}>
              <View style={styles.emojiBadge}>
                {iconSource ? (
                  <Image source={iconSource} style={[styles.icon, !isEarned && styles.iconDimmed]} />
                ) : (
                  <Text style={styles.emoji}>{badge.emoji}</Text>
                )}
                {isEarned && (
                  <View style={styles.earnedOverlay}>
                    <Text style={styles.earnedCheck}>✓</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.name, isEarned && styles.nameEarned]} numberOfLines={2}>
                {badge.name}
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
    listContent: { padding: 16, gap: 10 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 12, marginBottom: 10 },
    cardHidden: { backgroundColor: c.disclaimerBg, borderColor: c.disclaimerBorder },
    emojiBadge: { width: 56, height: 48, borderRadius: 10, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
    emoji: { fontSize: 20 },
    icon: { width: '100%', height: '100%' },
    iconDimmed: { opacity: 0.55 },
    earnedOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,209,102,0.55)', alignItems: 'center', justifyContent: 'center' },
    earnedCheck: { fontSize: 16, fontWeight: '700', color: c.forest },
    name: { flex: 1, fontSize: 14, color: c.forest },
    nameEarned: { textDecorationLine: 'line-through' },
    dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 10, marginBottom: -2 },
    dividerLine: { flex: 1, height: 1, backgroundColor: c.line },
    dividerText: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
  });
}
