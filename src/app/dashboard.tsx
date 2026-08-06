import { Link } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useCatalogProgress } from '@/data/catalog-progress';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: 'Voortgangsdashboard',
    subtitle: 'Mastery-voortgang in al je catalogussen',
    totalLabel: 'Totale voortgang',
    countLabel: (m: number, t: number) => `${m} / ${t} mastery behaald`,
    premiumNote: 'Premium-functie — voorlopig gratis te gebruiken terwijl er nog geen betaalopties zijn.',
  },
  en: {
    title: 'Progress Dashboard',
    subtitle: 'Mastery progress across all your catalogs',
    totalLabel: 'Total progress',
    countLabel: (m: number, t: number) => `${m} / ${t} mastered`,
    premiumNote: 'Premium feature — free to use for now while payment options are not yet available.',
  },
} as const;

export default function DashboardScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const catalogs = useCatalogProgress();

  const totals = catalogs.reduce(
    (acc, cat) => ({ mastered: acc.mastered + cat.mastered, total: acc.total + cat.total }),
    { mastered: 0, total: 0 }
  );
  const totalPct = totals.total > 0 ? Math.round((totals.mastered / totals.total) * 100) : 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[COLORS.coral, COLORS.yellow]} icon="📊" title={s.title} subtitle={s.subtitle} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.premiumNote}>👑 {s.premiumNote}</Text>

        <View style={styles.totalCard}>
          <View style={styles.totalHeaderRow}>
            <Text style={styles.totalLabel}>{s.totalLabel}</Text>
            <Text style={styles.totalPct}>{totalPct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${totalPct}%` }]} />
          </View>
          <Text style={styles.totalCount}>{s.countLabel(totals.mastered, totals.total)}</Text>
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
                </View>
              </TouchableOpacity>
            </Link>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 10, paddingBottom: 40 },
    premiumNote: {
      fontSize: 11,
      color: c.forestSoft,
      backgroundColor: c.disclaimerBg,
      borderWidth: 1,
      borderColor: c.disclaimerBorder,
      borderRadius: 12,
      padding: 10,
    },
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
  });
}
