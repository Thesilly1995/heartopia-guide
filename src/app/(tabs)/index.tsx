import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/heartopia-colors';

const SECTIONS: { label: string; items: { href: string; icon: string; title: string; desc: string }[] }[] = [
  {
    label: "Hobby's",
    items: [
      { href: '/vissen', icon: '🎣', title: 'Vissen', desc: 'Vissoorten, plekken & tijden' },
      { href: '/koken', icon: '🍳', title: 'Koken', desc: 'Recepten & ingrediënten' },
      { href: '/tuinieren', icon: '🌱', title: 'Tuinieren', desc: 'Zaden, groei & oogst' },
      { href: '/insecten', icon: '🦋', title: 'Insecten', desc: 'Vlinders, kevers & meer' },
      { href: '/vogels', icon: '🐦', title: 'Vogels', desc: 'Vogelsoorten & plekken' },
      { href: '/beeldhouwen', icon: '🏖️', title: 'Beeldhouwen', desc: 'Zand- en sneeuwsculpturen' },
      { href: '/ocean-cleanup', icon: '🌊', title: 'Ocean Cleanup', desc: 'Vervuiling opruimen & schelpen' },
    ],
  },
  {
    label: 'Dieren',
    items: [
      { href: '/huisdieren', icon: '🐾', title: 'Dog & Cat Moments', desc: 'Huisdieren adopteren & verzorgen' },
      { href: '/wilde-dieren', icon: '🦊', title: 'Wilde Dieren', desc: 'Voertroggen, eten & vriendschap' },
      { href: '/wilde-ingredienten', icon: '🌿', title: 'Wilde Ingrediënten', desc: 'Fruit, paddenstoelen & materialen' },
    ],
  },
  {
    label: 'Spel',
    items: [
      { href: '/events', icon: '🎉', title: 'Huidig Event', desc: 'Call of Whales' },
      { href: '/missies', icon: '📋', title: 'Missies', desc: 'Dagelijkse & wekelijkse taken' },
      { href: '/bubbels', icon: '🫧', title: 'Wekelijkse Bubbels', desc: 'Roze bubbels vol beloningen' },
      { href: '/rainbow-meteor', icon: '🌈', title: 'Rainbow & Meteorenregen', desc: 'Boeketten & sterrenscherven' },
      { href: '/badges', icon: '🏅', title: 'Badges', desc: 'Prestaties & profieltitels' },
      { href: '/codes', icon: '🎁', title: 'Codes', desc: 'Actieve & verlopen codes' },
    ],
  },
  {
    label: 'Overig',
    items: [
      { href: '/todo', icon: '📝', title: 'To-do', desc: 'Wat wil je nog gaan doen?' },
      { href: '/feedback', icon: '💡', title: 'Feedback', desc: 'Deel je ideeën voor de gids' },
    ],
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welkom terug in</Text>
          <Text style={styles.title}>Heartopia Gids</Text>
        </View>

        {SECTIONS.map((section) => (
          <View key={section.label} style={styles.section}>
            <Text style={styles.sectionLabel}>{section.label}</Text>
            {section.items.map((item) => (
              <Link key={item.href} href={item.href as never} asChild>
                <TouchableOpacity style={styles.card}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDesc}>{item.desc}</Text>
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 4 },
  header: { paddingVertical: 20 },
  welcome: { color: COLORS.forestSoft, fontSize: 14 },
  title: { color: COLORS.forest, fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  section: { marginTop: 16, gap: 10 },
  sectionLabel: { color: COLORS.forestSoft, fontSize: 14, marginBottom: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.line,
    gap: 12,
  },
  cardIcon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { color: COLORS.forest, fontSize: 16, fontWeight: '600' },
  cardDesc: { color: COLORS.forestSoft, fontSize: 12, marginTop: 2 },
});
