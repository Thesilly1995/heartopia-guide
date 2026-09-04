import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumLockedView } from '@/components/heartopia/premium-locked';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useTips } from '@/data/tips';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    title: 'Tips & Tricks',
    subtitle: 'Handige weetjes over het spel en events',
    lockedText: 'Tips & Tricks is een Premium-functie.',
  },
  en: {
    title: 'Tips & Tricks',
    subtitle: 'Handy things to know about the game and events',
    lockedText: 'Tips & Tricks is a Premium feature.',
  },
} as const;

export default function TipsScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { premium } = usePremium();
  const categories = useTips();
  const [openKey, setOpenKey] = useState<string | null>(categories[0]?.key ?? null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[colors.coral, colors.yellow]} icon="💡" title={s.title} subtitle={s.subtitle} />
      <ScrollView contentContainerStyle={styles.content}>
        {premium ? (
          categories.map((cat) => {
            const isOpen = openKey === cat.key;
            return (
              <View key={cat.key} style={styles.categoryCard}>
                <Pressable style={styles.categoryHeader} onPress={() => setOpenKey(isOpen ? null : cat.key)}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categoryCount}>{cat.tips.length}</Text>
                  <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
                </Pressable>
                {isOpen && (
                  <View style={styles.tipList}>
                    {cat.tips.map((tip) => (
                      <View key={tip.title} style={styles.card}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.emoji}>{tip.emoji}</Text>
                          <Text style={styles.cardTitle}>{tip.title}</Text>
                        </View>
                        <Text style={styles.cardBody}>{tip.body}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <PremiumLockedView text={s.lockedText} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 10, paddingBottom: 40 },
    categoryCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden' },
    categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
    categoryLabel: { fontSize: 14, fontWeight: '700', color: c.forest, flex: 1 },
    categoryCount: { fontSize: 12, fontWeight: '700', color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
    chevron: { fontSize: 16, color: c.forestSoft, width: 18, textAlign: 'center' },
    tipList: { paddingHorizontal: 14, paddingBottom: 14, gap: 10 },
    card: { backgroundColor: c.disclaimerBg, borderRadius: 12, borderWidth: 1, borderColor: c.disclaimerBorder, padding: 12, gap: 6 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    emoji: { fontSize: 18 },
    cardTitle: { fontSize: 13, fontWeight: '700', color: c.forest, flex: 1 },
    cardBody: { fontSize: 12, color: c.forestSoft, lineHeight: 17 },
  });
}
