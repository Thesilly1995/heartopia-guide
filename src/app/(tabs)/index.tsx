import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  bg: '#EFF7EC',
  card: '#FFFFFF',
  forest: '#2B4739',
  forestSoft: '#6B8A7A',
  line: '#DCEBD8',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.welcome}>Welkom terug in</Text>
          <Text style={styles.title}>Heartopia Gids</Text>
        </View>

        <Text style={styles.sectionLabel}>Kies een hobby om te verkennen</Text>

        <Link href="/vissen" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>🎣</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Vissen</Text>
              <Text style={styles.cardDesc}>Vissoorten, plekken & tijden</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/koken" asChild>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardIcon}>🍳</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Koken</Text>
              <Text style={styles.cardDesc}>Recepten & ingrediënten</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { padding: 20, gap: 12 },
  header: { paddingVertical: 20 },
  welcome: { color: COLORS.forestSoft, fontSize: 14 },
  title: { color: COLORS.forest, fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  sectionLabel: { color: COLORS.forestSoft, fontSize: 14, marginBottom: 4 },
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