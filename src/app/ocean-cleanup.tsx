import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { COLORS } from '@/constants/heartopia-colors';
import { SHELLS } from '@/data/shells';

const STARS_KEY = 'heartopia:schelpen:sterren';
const MASTERY_KEY = 'heartopia:schelpen:sterren:mastery';

const POLLUTANTS = [
  { name: 'Wervelende Vervuiling', desc: 'Het standaard type, snel te verwijderen' },
  { name: 'Harde-Schaal Vervuiling', desc: 'Taaier — kost meer moeite om te reinigen' },
  { name: 'Harde-Schaal Gebarsten Vervuiling', desc: 'Taaier — valt daarna uiteen in stukken' },
];

export default function OceanCleanupScreen() {
  const [openShell, setOpenShell] = useState<string | null>(null);
  const [shellStars, setShellStars] = useState<Record<string, number>>({});
  const [shellMastery, setShellMastery] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const [starsRaw, masteryRaw] = await Promise.all([
          AsyncStorage.getItem(STARS_KEY),
          AsyncStorage.getItem(MASTERY_KEY),
        ]);
        setShellStars(starsRaw ? JSON.parse(starsRaw) : {});
        setShellMastery(masteryRaw ? JSON.parse(masteryRaw) : {});
      } catch {
        setShellStars({});
        setShellMastery({});
      }
    })();
  }, []);

  const setShellStar = async (name: string, value: number) => {
    const current = shellStars[name] || 0;
    const nextValue = value === current ? 0 : value;
    const updated = { ...shellStars, [name]: nextValue };
    setShellStars(updated);
    try {
      await AsyncStorage.setItem(STARS_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const toggleShellMastery = async (name: string) => {
    const updated = { ...shellMastery, [name]: !shellMastery[name] };
    setShellMastery(updated);
    try {
      await AsyncStorage.setItem(MASTERY_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#4FA8CC', '#6EC6E8']} icon="🌊" title="Ocean Cleanup" subtitle="Vervuiling opruimen in Whalefall Canyon" />
      <ScrollView contentContainerStyle={styles.content}>
        <DisclaimerBox text="Permanente hobby (Oceanbound 2.7-update). Blijft ook na afloop van het Call of Whales-event." />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🐚 Schelpencatalogus</Text>
          <Text style={styles.cardDesc}>26 van de 30 bekende schelpen (bron: eigen screenshots)</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            {SHELLS.map((shell) => {
              const isOpen = openShell === shell.name;
              return (
                <View key={shell.name} style={styles.shellRow}>
                  <Pressable style={styles.shellHeader} onPress={() => setOpenShell(isOpen ? null : shell.name)}>
                    <Text style={styles.shellEmoji}>{shell.emoji}</Text>
                    <View style={styles.shellText}>
                      <Text style={styles.shellName} numberOfLines={1}>
                        {shell.name}
                      </Text>
                      {shell.level !== null && <Text style={styles.shellLevel}>Lv.{shell.level}</Text>}
                    </View>
                    <StarRow value={shellStars[shell.name] || 0} onSet={(n) => setShellStar(shell.name, n)} />
                  </Pressable>

                  {isOpen && (
                    <View style={styles.shellBody}>
                      {shell.gold && shell.tokens ? (
                        <>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>Goud (verkocht aan Albert Jr.)</Text>
                            <Text style={styles.shellInfoValue}>
                              {shell.gold.map((v, i) => `${i + 1}★ ${v}🪙`).join('   ')}
                            </Text>
                          </View>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>Tokens (verkocht aan Azure)</Text>
                            <Text style={styles.shellInfoValue}>
                              {shell.tokens.map((v, i) => `${i + 1}★ ${v}🎫`).join('   ')}
                            </Text>
                          </View>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>Tijdvenster</Text>
                            <Text style={styles.shellInfoValue}>{shell.time || 'Hele dag'}</Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.notDocumented}>Nog niet gedocumenteerd</Text>
                      )}
                      <Pressable
                        style={[styles.masteryBox, shellMastery[shell.name] && styles.masteryBoxActive]}
                        onPress={() => toggleShellMastery(shell.name)}>
                        <Text style={[styles.masteryLabel, shellMastery[shell.name] && styles.masteryLabelActive]}>
                          Mastery behaald
                        </Text>
                        <View style={[styles.checkbox, shellMastery[shell.name] && styles.checkboxActive]}>
                          {shellMastery[shell.name] && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ontgrendelen</Text>
          <Text style={styles.cardText}>
            D.G. Member Level 7 → portaal bij de voet van Whale Mountain → praat met Naga, dan Rory → open het
            Hobby-menu (schelp-icoon) → Upgrade → praat met Oliver om te starten.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🏊 Zwemmen</Text>
          <Text style={styles.cardText}>
            In Whalefall Canyon kun je vrij zwemmen in elke richting. Gebruik Shift (of de dash-knop op mobiel) voor
            een onderwater-sprint ('meerminstoot'). Zwemmen buiten deze underwater-zone is momenteel niet mogelijk.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gereedschap</Text>
          <Text style={styles.cardText}>
            Basis Oceaanreiniger — richt op de vervuiling en houd de reinigingsknop ingedrukt tot die volledig
            verdwenen is.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Soorten vervuiling</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            {POLLUTANTS.map((p) => (
              <View key={p.name} style={styles.pollutantBox}>
                <Text style={styles.pollutantName}>{p.name}</Text>
                <Text style={styles.pollutantDesc}>{p.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Beloningen</Text>
          <Text style={styles.cardText}>
            Vervuiling opruimen levert Zeeschelpen op, die optellen tot Collectiepunten. Daarmee koop je
            oceaan-meubels zoals het Zeeschelpen Kralengordijn en de Koraal & Schelpen Vitrinekast. Bepaalde levels
            geven ook kans op de Voice of the Deep geschenkdoos (met een echt dolfijngeluid-kaartje, onderdeel van een
            dolfijnenbeschermingscampagne).
          </Text>
        </View>

        <DisclaimerBox
          warning
          text="Nog niet bevestigd: de volledige lijst met meubels/puntenkosten, of het reinigingsgereedschap uitgebreid kan worden, hoeveel hobby-levels er zijn, en eventuele dagelijkse limieten."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.forest, marginBottom: 4 },
  cardDesc: { fontSize: 12, color: COLORS.forestSoft, marginBottom: 4 },
  cardText: { fontSize: 12, color: COLORS.forestSoft, lineHeight: 18 },
  shellRow: { backgroundColor: '#F5FAF3', borderRadius: 10, overflow: 'hidden' },
  shellHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
  shellEmoji: { fontSize: 18 },
  shellText: { flex: 1 },
  shellName: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
  shellLevel: { fontSize: 10, color: COLORS.skyDark },
  shellBody: { paddingHorizontal: 8, paddingBottom: 8, gap: 6 },
  shellInfoBox: { padding: 8, borderRadius: 8, backgroundColor: '#FFFBEF' },
  shellInfoLabel: { fontSize: 11, fontWeight: '700', color: COLORS.forest, marginBottom: 2 },
  shellInfoValue: { fontSize: 11, color: COLORS.forestSoft },
  notDocumented: { fontSize: 11, color: COLORS.forestSoft },
  masteryBox: { padding: 8, borderRadius: 8, backgroundColor: '#FFFBEF', borderWidth: 1, borderColor: COLORS.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  masteryBoxActive: { backgroundColor: '#FFF6DC', borderColor: '#F5E5A8' },
  masteryLabel: { fontSize: 11, fontWeight: '700', color: COLORS.forestSoft },
  masteryLabelActive: { color: '#B8860B' },
  checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: COLORS.yellow, borderColor: COLORS.yellow },
  checkmark: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  pollutantBox: { padding: 8, borderRadius: 8, backgroundColor: '#F5FAF3' },
  pollutantName: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
  pollutantDesc: { fontSize: 12, color: COLORS.forestSoft, marginTop: 2 },
});
