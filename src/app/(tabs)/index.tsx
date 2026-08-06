import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useBubblesProgress } from '@/data/bubbles-progress';
import { useDailyPlots } from '@/data/daily-plots';
import { useCurrentEventMeta } from '@/data/event-meta';
import { useMeteorSpots } from '@/data/meteor-spots';
import { useMissionsProgress } from '@/data/missions-progress';
import { useRainbowSpots } from '@/data/rainbow-spots';
import { useWeekForecast } from '@/data/week-forecast';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const SECTIONS: {
  label: { nl: string; en: string };
  items: { href: string | null; icon: string; title: { nl: string; en: string }; desc: { nl: string; en: string } }[];
}[] = [
  {
    label: { nl: "Hobby's", en: 'Hobbies' },
    items: [
      { href: '/vissen', icon: '🎣', title: { nl: 'Vissen', en: 'Fishing' }, desc: { nl: 'Vissoorten, plekken & tijden', en: 'Fish species, spots & times' } },
      { href: '/koken', icon: '🍳', title: { nl: 'Koken', en: 'Cooking' }, desc: { nl: 'Recepten & ingrediënten', en: 'Recipes & ingredients' } },
      { href: '/tuinieren', icon: '🌱', title: { nl: 'Tuinieren', en: 'Gardening' }, desc: { nl: 'Zaden, groei & oogst', en: 'Seeds, growth & harvest' } },
      { href: '/insecten', icon: '🦋', title: { nl: 'Insecten', en: 'Insects' }, desc: { nl: 'Vlinders, kevers & meer', en: 'Butterflies, beetles & more' } },
      { href: '/vogels', icon: '🐦', title: { nl: 'Vogels', en: 'Birds' }, desc: { nl: 'Vogelsoorten & plekken', en: 'Bird species & spots' } },
      { href: '/beeldhouwen', icon: '🏖️', title: { nl: 'Beeldhouwen', en: 'Sculpting' }, desc: { nl: 'Zand- en sneeuwsculpturen', en: 'Sand and snow sculptures' } },
      { href: '/ocean-cleanup', icon: '🌊', title: { nl: 'Ocean Cleanup', en: 'Ocean Cleanup' }, desc: { nl: 'Vervuiling opruimen & schelpen', en: 'Cleaning up pollution & shells' } },
      { href: '/huisdieren', icon: '🐾', title: { nl: 'Dog & Cat Moments', en: 'Dog & Cat Moments' }, desc: { nl: 'Huisdieren adopteren & verzorgen', en: 'Adopt & care for pets' } },
    ],
  },
  {
    label: { nl: 'Extra', en: 'Extra' },
    items: [
      { href: '/wilde-dieren', icon: '🦊', title: { nl: 'Wilde Dieren', en: 'Wild Animals' }, desc: { nl: 'Voertroggen, eten & vriendschap', en: 'Feeding troughs, food & friendship' } },
      { href: '/wilde-ingredienten', icon: '🌿', title: { nl: 'Wilde Ingrediënten', en: 'Wild Ingredients' }, desc: { nl: 'Fruit, paddenstoelen & materialen', en: 'Fruit, mushrooms & materials' } },
    ],
  },
  {
    label: { nl: 'Spel', en: 'Game' },
    items: [
      { href: '/badges', icon: '🏅', title: { nl: 'Badges', en: 'Badges' }, desc: { nl: 'Prestaties & profieltitels', en: 'Achievements & profile titles' } },
      { href: '/codes', icon: '🎁', title: { nl: 'Codes', en: 'Codes' }, desc: { nl: 'Actieve & verlopen codes', en: 'Active & expired codes' } },
    ],
  },
  {
    label: { nl: 'Premium', en: 'Premium' },
    items: [
      { href: '/dashboard', icon: '📊', title: { nl: 'Voortgangsdashboard', en: 'Progress Dashboard' }, desc: { nl: 'Overzicht van je voortgang in alle catalogussen', en: 'Overview of your progress across all catalogs' } },
      { href: null, icon: '🔔', title: { nl: 'Meldingen', en: 'Notifications' }, desc: { nl: 'Herinneringen bij nieuwe events & bijzonder weer', en: 'Reminders for new events & special weather' } },
      { href: null, icon: '☁️', title: { nl: 'Cloud Save', en: 'Cloud Save' }, desc: { nl: 'Voortgang bewaren & gebruiken op een ander toestel', en: 'Save your progress & use it on another device' } },
    ],
  },
  {
    label: { nl: 'Overig', en: 'Other' },
    items: [
      { href: '/todo', icon: '📝', title: { nl: 'To-do', en: 'To-do' }, desc: { nl: 'Wat wil je nog gaan doen?', en: 'What do you still want to do?' } },
      { href: '/feedback', icon: '💡', title: { nl: 'Feedback', en: 'Feedback' }, desc: { nl: 'Deel je ideeën voor de gids', en: 'Share your ideas for the guide' } },
    ],
  },
];

const STRINGS = {
  nl: {
    welcome: 'Welkom terug in',
    title: 'Heartopia Gids',
    unknown: 'Onbekend — vraag het na',
    active: 'Actief nu',
    inactive: 'Niet actief',
    forecastTitle: 'Weer deze week',
    comingSoon: 'Komt binnenkort ✨',
    premiumRequired: 'Vereist Premium 👑',
    premiumTestOn: 'Test: Premium AAN',
    premiumTestOff: 'Test: Premium UIT',
  },
  en: {
    welcome: 'Welcome back to',
    title: 'Heartopia Guide',
    unknown: 'Unknown — ask to look it up',
    active: 'Active now',
    inactive: 'Not active',
    forecastTitle: 'Weather this week',
    comingSoon: 'Coming soon ✨',
    premiumRequired: 'Requires Premium 👑',
    premiumTestOn: 'Test: Premium ON',
    premiumTestOff: 'Test: Premium OFF',
  },
} as const;

export default function HomeScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language, toggleLanguage } = useLanguage();
  const { premium, togglePremium } = usePremium();
  const s = STRINGS[language];
  const [forecastExpanded, setForecastExpanded] = useState(false);
  const [comingSoonKey, setComingSoonKey] = useState<string | null>(null);
  const dailyPlots = useDailyPlots();
  const eventMeta = useCurrentEventMeta();
  const rainbowSpots = useRainbowSpots();
  const meteorSpots = useMeteorSpots();
  const weekForecast = useWeekForecast();
  const missionsProgress = useMissionsProgress();
  const bubblesProgress = useBubblesProgress();
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.welcome}>{s.welcome}</Text>
              <Text style={styles.title}>{s.title}</Text>
            </View>
            <Pressable style={styles.langSwitch} onPress={toggleLanguage} hitSlop={8}>
              <Text style={[styles.langOption, language === 'nl' && styles.langOptionActive]}>NL</Text>
              <Text style={styles.langDivider}>/</Text>
              <Text style={[styles.langOption, language === 'en' && styles.langOptionActive]}>EN</Text>
            </Pressable>
          </View>
        </View>

        <Link href="/events" asChild>
          <TouchableOpacity style={styles.statusCard}>
            <Text style={styles.statusIcon}>{eventMeta.emoji}</Text>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{eventMeta.name}</Text>
              <Text style={styles.statusDesc}>{eventMeta.dates}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </Link>

        {weekForecast.length > 0 && (
          <View style={styles.forecastCard}>
            <Pressable
              style={styles.forecastHeader}
              onPress={() => setForecastExpanded((v) => !v)}
              hitSlop={4}
            >
              <Text style={styles.forecastTitle}>{s.forecastTitle}</Text>
              <View style={styles.forecastHeaderRight}>
                {!forecastExpanded && (
                  <View style={styles.forecastPreview}>
                    <Text style={styles.forecastIcon}>{weekForecast[0].emoji}</Text>
                    <Text style={styles.forecastDay}>{weekForecast[0].weekdayLabel}</Text>
                  </View>
                )}
                <Text style={[styles.chevron, forecastExpanded && styles.chevronExpanded]}>›</Text>
              </View>
            </Pressable>
            {forecastExpanded &&
              weekForecast.map((entry) => (
                <View key={entry.date} style={styles.forecastRow}>
                  <Text style={styles.forecastIcon}>{entry.emoji}</Text>
                  <Text style={styles.forecastDay}>{entry.dayLabel}</Text>
                </View>
              ))}
          </View>
        )}

        <Link href="/rainbow-meteor" asChild>
          <TouchableOpacity style={styles.plotsCard}>
            <View style={styles.plotsRow}>
              <Text style={styles.plotsRowIcon}>🌈</Text>
              <Text style={styles.plotsRowText}>{rainbowSpots.length > 0 ? s.active : s.inactive}</Text>
            </View>
            <View style={styles.plotsRow}>
              <Text style={styles.plotsRowIcon}>☄️</Text>
              <Text style={styles.plotsRowText}>{meteorSpots.length > 0 ? s.active : s.inactive}</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.plotsCard}>
          <View style={styles.plotsRow}>
            <Text style={styles.plotsRowIcon}>🌳</Text>
            <Text style={styles.plotsRowText}>{dailyPlots.oakPlot ?? s.unknown}</Text>
          </View>
          <View style={styles.plotsRow}>
            <Text style={styles.plotsRowIcon}>💎</Text>
            <Text style={styles.plotsRowText}>{dailyPlots.fluoritePlot ?? s.unknown}</Text>
          </View>
        </View>

        <View style={styles.plotsCard}>
          <Link href="/missies" asChild>
            <TouchableOpacity style={styles.plotsRow}>
              <Text style={styles.plotsRowIcon}>📋</Text>
              <Text style={styles.plotsRowText}>{missionsProgress.done}/{missionsProgress.total}</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/bubbels" asChild>
            <TouchableOpacity style={styles.plotsRow}>
              <Text style={styles.plotsRowIcon}>🫧</Text>
              <Text style={styles.plotsRowText}>{bubblesProgress.done}/{bubblesProgress.total}</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {SECTIONS.map((section) => {
          const isPremiumSection = section.label.nl === 'Premium';
          return (
            <View key={section.label.nl} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionLabel}>{section.label[language]}</Text>
                {isPremiumSection && (
                  <Pressable style={styles.premiumTestPill} onPress={togglePremium} hitSlop={6}>
                    <Text style={styles.premiumTestPillText}>{premium ? s.premiumTestOn : s.premiumTestOff}</Text>
                  </Pressable>
                )}
              </View>
              {section.items.map((item) => {
                const itemKey = `${section.label.nl}:${item.title.nl}`;
                if (item.href) {
                  return (
                    <Link key={itemKey} href={item.href as never} asChild>
                      <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardIcon}>{item.icon}</Text>
                        <View style={styles.cardText}>
                          <Text style={styles.cardTitle}>{item.title[language]}</Text>
                          <Text style={styles.cardDesc}>{item.desc[language]}</Text>
                        </View>
                      </TouchableOpacity>
                    </Link>
                  );
                }
                const isComingSoon = comingSoonKey === itemKey;
                const lockedMessage = isPremiumSection && !premium ? s.premiumRequired : s.comingSoon;
                return (
                  <TouchableOpacity
                    key={itemKey}
                    style={styles.card}
                    onPress={() => {
                      setComingSoonKey(itemKey);
                      setTimeout(() => {
                        setComingSoonKey((current) => (current === itemKey ? null : current));
                      }, 2200);
                    }}
                  >
                    <Text style={styles.cardIcon}>{item.icon}</Text>
                    <View style={styles.cardText}>
                      <Text style={styles.cardTitle}>{item.title[language]}</Text>
                      <Text style={[styles.cardDesc, isComingSoon && styles.cardDescComingSoon]}>
                        {isComingSoon ? lockedMessage : item.desc[language]}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    scrollContent: { padding: 20, paddingBottom: 40, gap: 4 },
    header: { paddingVertical: 20, paddingTop: Platform.OS === 'web' ? 56 : 20 },
    headerTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    welcome: { color: c.forestSoft, fontSize: 14 },
    title: { color: c.forest, fontSize: 28, fontWeight: 'bold', marginTop: 4 },
    langSwitch: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginTop: 4 },
    langOption: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
    langOptionActive: { color: c.coral },
    langDivider: { fontSize: 12, color: c.line },
    statusCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 16,
      padding: 12,
      marginTop: 4,
      gap: 10,
    },
    statusIcon: { fontSize: 20 },
    statusText: { flex: 1 },
    statusTitle: { color: c.forest, fontSize: 14, fontWeight: '700' },
    statusDesc: { color: c.forestSoft, fontSize: 11, marginTop: 1 },
    chevron: { fontSize: 16, color: c.forestSoft },
    chevronExpanded: { transform: [{ rotate: '90deg' }] },
    forecastCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 16,
      padding: 12,
      marginTop: 4,
      gap: 8,
    },
    forecastHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    forecastHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    forecastPreview: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    forecastTitle: { color: c.forestSoft, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    forecastRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    forecastIcon: { fontSize: 16 },
    forecastDay: { color: c.forest, fontSize: 13, fontWeight: '700' },
    plotsCard: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: c.disclaimerBg,
      borderWidth: 1,
      borderColor: c.disclaimerBorder,
      borderRadius: 16,
      padding: 12,
      marginTop: 4,
    },
    plotsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    plotsRowIcon: { fontSize: 18 },
    plotsRowText: { color: c.forest, fontSize: 13, fontWeight: '700' },
    section: { marginTop: 16, gap: 10 },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
    sectionLabel: { color: c.forestSoft, fontSize: 14 },
    premiumTestPill: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
    premiumTestPillText: { fontSize: 10, fontWeight: '700', color: c.forestSoft },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: c.line,
      gap: 12,
    },
    cardIcon: { fontSize: 24 },
    cardText: { flex: 1 },
    cardTitle: { color: c.forest, fontSize: 16, fontWeight: '600' },
    cardDesc: { color: c.forestSoft, fontSize: 12, marginTop: 2 },
    cardDescComingSoon: { color: c.coralDark, fontWeight: '700' },
  });
}
