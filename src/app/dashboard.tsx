import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useCatalogProgress } from '@/data/catalog-progress';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    title: 'Voortgangsdashboard',
    subtitle: 'Mastery-voortgang in al je catalogussen',
    totalLabel: 'Totale voortgang',
    countLabel: (m: number, t: number) => `${m} / ${t} mastery behaald`,
    starsLabel: (n: number, max: number) => `⭐ ${n} / ${max} sterren`,
    lockedTitle: 'Alleen voor Premium-leden',
    lockedText:
      'Het voortgangsdashboard laat in één oogopslag zien hoeveel mastery je hebt behaald in elke catalogus (Vissen, Koken, Tuinieren, Insecten, Vogels, Beeldhouwen, Ocean Cleanup).',
    upgradeButton: 'Word Premium-lid (test) 👑',
    testNote: 'Er is nog geen echte betaalflow — dit is een lokale test-schakelaar. Je vindt hem ook op het homescreen, onder "Premium".',
    activeBadge: '👑 Premium actief (test)',
    disablePremium: 'Test-premium uitzetten',
  },
  en: {
    title: 'Progress Dashboard',
    subtitle: 'Mastery progress across all your catalogs',
    totalLabel: 'Total progress',
    countLabel: (m: number, t: number) => `${m} / ${t} mastered`,
    starsLabel: (n: number, max: number) => `⭐ ${n} / ${max} stars`,
    lockedTitle: 'Premium members only',
    lockedText:
      'The progress dashboard shows at a glance how much mastery you have achieved in every catalog (Fishing, Cooking, Gardening, Insects, Birds, Sculpting, Ocean Cleanup).',
    upgradeButton: 'Become a Premium member (test) 👑',
    testNote: 'There is no real payment flow yet — this is a local test toggle. You can also find it on the homescreen, under "Premium".',
    activeBadge: '👑 Premium active (test)',
    disablePremium: 'Turn off test premium',
  },
} as const;

type DashboardStrings = (typeof STRINGS)[keyof typeof STRINGS];

export default function DashboardScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const { premium, setPremium } = usePremium();
  const s = STRINGS[language];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[COLORS.coral, COLORS.yellow]} icon="📊" title={s.title} subtitle={s.subtitle} />
      {premium ? <UnlockedDashboard s={s} styles={styles} onDisablePremium={() => setPremium(false)} /> : <LockedDashboard s={s} styles={styles} onUpgrade={() => setPremium(true)} />}
    </SafeAreaView>
  );
}

function LockedDashboard({
  s,
  styles,
  onUpgrade,
}: {
  s: DashboardStrings;
  styles: ReturnType<typeof makeStyles>;
  onUpgrade: () => void;
}) {
  return (
    <View style={styles.lockedContent}>
      <Text style={styles.lockedIcon}>🔒</Text>
      <Text style={styles.lockedTitle}>{s.lockedTitle}</Text>
      <Text style={styles.lockedText}>{s.lockedText}</Text>
      <Pressable style={styles.upgradeButton} onPress={onUpgrade}>
        <Text style={styles.upgradeButtonText}>{s.upgradeButton}</Text>
      </Pressable>
      <Text style={styles.testNote}>{s.testNote}</Text>
    </View>
  );
}

function UnlockedDashboard({
  s,
  styles,
  onDisablePremium,
}: {
  s: DashboardStrings;
  styles: ReturnType<typeof makeStyles>;
  onDisablePremium: () => void;
}) {
  const catalogs = useCatalogProgress();

  const totals = catalogs.reduce(
    (acc, cat) => ({
      mastered: acc.mastered + cat.mastered,
      total: acc.total + cat.total,
      stars: acc.stars + cat.stars,
      maxStars: acc.maxStars + cat.maxStars,
    }),
    { mastered: 0, total: 0, stars: 0, maxStars: 0 }
  );
  const totalPct = totals.total > 0 ? Math.round((totals.mastered / totals.total) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.activeBadgeRow}>
        <Text style={styles.activeBadge}>{s.activeBadge}</Text>
        <Pressable onPress={onDisablePremium} hitSlop={6}>
          <Text style={styles.disablePremiumLink}>{s.disablePremium}</Text>
        </Pressable>
      </View>

      <View style={styles.totalCard}>
        <View style={styles.totalHeaderRow}>
          <Text style={styles.totalLabel}>{s.totalLabel}</Text>
          <Text style={styles.totalPct}>{totalPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${totalPct}%` }]} />
        </View>
        <Text style={styles.totalCount}>{s.countLabel(totals.mastered, totals.total)}</Text>
        <Text style={styles.totalStars}>{s.starsLabel(totals.stars, totals.maxStars)}</Text>
      </View>

      {catalogs.map((cat) => {
        const pct = cat.total > 0 ? Math.round((cat.mastered / cat.total) * 100) : 0;
        return (
          <Link key={cat.key} href={cat.href as never} asChild>
            <TouchableOpacity style={styles.card}>
              <Text style={styles.cardIcon}>{cat.icon}</Text>
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.cardTitle}>{cat.title}</Text>
                  <Text style={styles.cardPct}>{pct}%</Text>
                </View>
                <View style={styles.progressTrackSmall}>
                  <View style={[styles.progressFillSmall, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.cardCount}>{s.countLabel(cat.mastered, cat.total)}</Text>
                <Text style={styles.cardStars}>{s.starsLabel(cat.stars, cat.maxStars)}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        );
      })}
    </ScrollView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 10, paddingBottom: 40 },
    lockedContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
    lockedIcon: { fontSize: 40 },
    lockedTitle: { fontSize: 18, fontWeight: '800', color: c.forest, textAlign: 'center' },
    lockedText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', lineHeight: 19 },
    upgradeButton: { backgroundColor: c.coral, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8 },
    upgradeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    testNote: { fontSize: 11, color: c.forestSoft, textAlign: 'center', marginTop: 4 },
    activeBadgeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    activeBadge: { fontSize: 12, fontWeight: '700', color: c.forest },
    disablePremiumLink: { fontSize: 11, color: c.coralDark, textDecorationLine: 'underline' },
    totalCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 16,
      padding: 16,
      gap: 8,
    },
    totalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    totalLabel: { fontSize: 13, fontWeight: '700', color: c.forest },
    totalPct: { fontSize: 20, fontWeight: '800', color: c.coralDark },
    progressTrack: { height: 10, borderRadius: 999, backgroundColor: c.surfaceSoft, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 999, backgroundColor: c.coral },
    totalCount: { fontSize: 12, color: c.forestSoft },
    totalStars: { fontSize: 12, color: c.forestSoft },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: c.line,
      gap: 12,
    },
    cardIcon: { fontSize: 22 },
    cardBody: { flex: 1, gap: 6 },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardTitle: { fontSize: 14, fontWeight: '700', color: c.forest },
    cardPct: { fontSize: 13, fontWeight: '700', color: c.forestSoft },
    progressTrackSmall: { height: 6, borderRadius: 999, backgroundColor: c.surfaceSoft, overflow: 'hidden' },
    progressFillSmall: { height: '100%', borderRadius: 999, backgroundColor: c.yellow },
    cardCount: { fontSize: 11, color: c.forestSoft },
    cardStars: { fontSize: 11, color: c.forestSoft },
  });
}
