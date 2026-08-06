import { Link } from 'expo-router';
import { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useCurrentWeather } from '@/data/current-weather';
import { useDailyPlots } from '@/data/daily-plots';
import { useCurrentEventMeta } from '@/data/event-meta';
import { useMeteorSpots } from '@/data/meteor-spots';
import { useRainbowSpots } from '@/data/rainbow-spots';
import { useWeekForecast } from '@/data/week-forecast';
import { useLanguage } from '@/hooks/use-language';

const SECTIONS: {
  label: { nl: string; en: string };
  items: { href: string; icon: string; title: { nl: string; en: string }; desc: { nl: string; en: string } }[];
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
    ],
  },
  {
    label: { nl: 'Dieren', en: 'Animals' },
    items: [
      { href: '/huisdieren', icon: '🐾', title: { nl: 'Dog & Cat Moments', en: 'Dog & Cat Moments' }, desc: { nl: 'Huisdieren adopteren & verzorgen', en: 'Adopt & care for pets' } },
      { href: '/wilde-dieren', icon: '🦊', title: { nl: 'Wilde Dieren', en: 'Wild Animals' }, desc: { nl: 'Voertroggen, eten & vriendschap', en: 'Feeding troughs, food & friendship' } },
      { href: '/wilde-ingredienten', icon: '🌿', title: { nl: 'Wilde Ingrediënten', en: 'Wild Ingredients' }, desc: { nl: 'Fruit, paddenstoelen & materialen', en: 'Fruit, mushrooms & materials' } },
    ],
  },
  {
    label: { nl: 'Spel', en: 'Game' },
    items: [
      { href: '/events', icon: '🎉', title: { nl: 'Huidig Event', en: 'Current Event' }, desc: { nl: 'Call of Whales', en: 'Call of Whales' } },
      { href: '/missies', icon: '📋', title: { nl: 'Missies', en: 'Missions' }, desc: { nl: 'Dagelijkse & wekelijkse taken', en: 'Daily & weekly tasks' } },
      { href: '/bubbels', icon: '🫧', title: { nl: 'Wekelijkse Bubbels', en: 'Weekly Bubbles' }, desc: { nl: 'Roze bubbels vol beloningen', en: 'Pink bubbles full of rewards' } },
      { href: '/rainbow-meteor', icon: '🌈', title: { nl: 'Rainbow & Meteorenregen', en: 'Rainbow & Meteor Shower' }, desc: { nl: 'Boeketten & sterrenscherven', en: 'Bouquets & star shards' } },
      { href: '/badges', icon: '🏅', title: { nl: 'Badges', en: 'Badges' }, desc: { nl: 'Prestaties & profieltitels', en: 'Achievements & profile titles' } },
      { href: '/codes', icon: '🎁', title: { nl: 'Codes', en: 'Codes' }, desc: { nl: 'Actieve & verlopen codes', en: 'Active & expired codes' } },
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
    todayOak: 'Zwervende Eik vandaag',
    todayFluorite: 'Fluoriet-plek vandaag',
    unknown: 'Onbekend — vraag het na',
    rainbowMeteor: 'Rainbow & Meteorenregen',
    rainbowLabel: '🌈 Rainbow',
    meteorLabel: '☄️ Meteorenregen',
    active: 'Actief nu',
    inactive: 'Niet actief',
    weather: 'Weer',
    weatherUntil: (t: string) => `tot ${t}`,
    weatherStale: 'Kan verouderd zijn',
    forecastTitle: 'Weer deze week',
  },
  en: {
    welcome: 'Welcome back to',
    title: 'Heartopia Guide',
    todayOak: "Roaming Oak today",
    todayFluorite: 'Fluorite spot today',
    unknown: 'Unknown — ask to look it up',
    rainbowMeteor: 'Rainbow & Meteor Shower',
    rainbowLabel: '🌈 Rainbow',
    meteorLabel: '☄️ Meteor Shower',
    active: 'Active now',
    inactive: 'Not active',
    weather: 'Weather',
    weatherUntil: (t: string) => `until ${t}`,
    weatherStale: 'May be outdated',
    forecastTitle: 'Weather this week',
  },
} as const;

export default function HomeScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language, toggleLanguage } = useLanguage();
  const s = STRINGS[language];
  const dailyPlots = useDailyPlots();
  const eventMeta = useCurrentEventMeta();
  const rainbowSpots = useRainbowSpots();
  const meteorSpots = useMeteorSpots();
  const weather = useCurrentWeather();
  const weekForecast = useWeekForecast();
  const weatherDesc = !weather.label
    ? s.weather
    : weather.stale
      ? s.weatherStale
      : weather.validUntilLabel
        ? s.weatherUntil(weather.validUntilLabel)
        : s.weather;
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

        <View style={styles.statusCard}>
          <Text style={styles.statusIcon}>{weather.emoji}</Text>
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>{weather.label ?? s.unknown}</Text>
            <Text style={styles.statusDesc}>{weatherDesc}</Text>
          </View>
        </View>

        {weekForecast.length > 0 && (
          <View style={styles.forecastCard}>
            <Text style={styles.forecastTitle}>{s.forecastTitle}</Text>
            {weekForecast.map((entry) => (
              <View key={entry.date} style={styles.forecastRow}>
                <Text style={styles.forecastIcon}>{entry.emoji}</Text>
                <Text style={styles.forecastDay}>{entry.dayLabel}</Text>
                <Text style={[styles.forecastLabel, entry.kind === 'normal' && styles.forecastLabelMuted]}>
                  {entry.label}
                </Text>
              </View>
            ))}
          </View>
        )}

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

        <Link href="/rainbow-meteor" asChild>
          <TouchableOpacity style={styles.plotsCard}>
            <View style={styles.plotsItem}>
              <Text style={styles.plotsIcon}>🌈</Text>
              <View>
                <Text style={styles.plotsLabel}>{s.rainbowLabel}</Text>
                <Text style={styles.plotsValue}>{rainbowSpots.length > 0 ? s.active : s.inactive}</Text>
              </View>
            </View>
            <View style={styles.plotsItem}>
              <Text style={styles.plotsIcon}>☄️</Text>
              <View>
                <Text style={styles.plotsLabel}>{s.meteorLabel}</Text>
                <Text style={styles.plotsValue}>{meteorSpots.length > 0 ? s.active : s.inactive}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>

        <View style={styles.plotsCard}>
          <View style={styles.plotsItem}>
            <Text style={styles.plotsIcon}>🌳</Text>
            <View>
              <Text style={styles.plotsLabel}>{s.todayOak}</Text>
              <Text style={styles.plotsValue}>{dailyPlots.oakPlot ?? s.unknown}</Text>
            </View>
          </View>
          <View style={styles.plotsItem}>
            <Text style={styles.plotsIcon}>💎</Text>
            <View>
              <Text style={styles.plotsLabel}>{s.todayFluorite}</Text>
              <Text style={styles.plotsValue}>{dailyPlots.fluoritePlot ?? s.unknown}</Text>
            </View>
          </View>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.label.nl} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label[language]}</Text>
            {section.items.map((item) => (
              <Link key={item.href} href={item.href as never} asChild>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.title[language]}</Text>
                    <Text style={styles.cardDesc}>{item.desc[language]}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        ))}
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
    forecastCard: {
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 16,
      padding: 12,
      marginTop: 4,
      gap: 8,
    },
    forecastTitle: { color: c.forestSoft, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
    forecastRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    forecastIcon: { fontSize: 16 },
    forecastDay: { width: 70, color: c.forest, fontSize: 13, fontWeight: '700' },
    forecastLabel: { flex: 1, textAlign: 'right', color: c.forest, fontSize: 13, fontWeight: '600' },
    forecastLabelMuted: { color: c.forestSoft, fontWeight: '400' },
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
    plotsItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    plotsIcon: { fontSize: 18 },
    plotsLabel: { color: c.forestSoft, fontSize: 10 },
    plotsValue: { color: c.forest, fontSize: 13, fontWeight: '700', marginTop: 2 },
    section: { marginTop: 16, gap: 10 },
    sectionLabel: { color: c.forestSoft, fontSize: 14, marginBottom: 2 },
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
  });
}
