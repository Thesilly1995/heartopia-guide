import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useShells } from '@/data/shells';
import { useLanguage } from '@/hooks/use-language';

const STARS_KEY = 'heartopia:schelpen:sterren';
const MASTERY_KEY = 'heartopia:schelpen:sterren:mastery';
const SHELL_FILTERS = ['all', 'undiscovered', 'notFiveStar', 1, 2, 3, 4, 5, 'noMastery'] as const;
type ShellFilter = (typeof SHELL_FILTERS)[number];

const POLLUTANTS = {
  nl: [
    { name: 'Wervelende Vervuiling', desc: 'Het standaard type, snel te verwijderen' },
    { name: 'Harde-Schaal Vervuiling', desc: 'Taaier — kost meer moeite om te reinigen' },
    { name: 'Harde-Schaal Gebarsten Vervuiling', desc: 'Taaier — valt daarna uiteen in stukken' },
  ],
  en: [
    { name: 'Swirling Pollution', desc: 'The standard type, quick to remove' },
    { name: 'Hard-Shell Pollution', desc: 'Tougher — takes more effort to clean' },
    { name: 'Hard-Shell Cracked Pollution', desc: 'Tougher — then breaks apart into pieces' },
  ],
} as const;

const STRINGS = {
  nl: {
    title: 'Ocean Cleanup',
    subtitle: 'Vervuiling opruimen in Whalefall Canyon',
    permanentDisclaimer: 'Permanente hobby (Oceanbound 2.7-update). Blijft ook na afloop van het Call of Whales-event.',
    shellCatalog: '🐚 Schelpencatalogus',
    shellCatalogDesc: 'Alle 30 bekende schelpen (bron: eigen screenshots + community-tracker)',
    filterAll: 'Alle',
    filterUndiscovered: '🔍 Nog te ontdekken',
    filterNotFiveStar: '⭐ Nog geen 5★',
    filterNoMastery: '🏆 Nog geen mastery',
    goldLabel: 'Goud (verkocht aan Albert Jr.)',
    tokensLabel: 'Tokens (verkocht aan Azure)',
    timeWindow: 'Tijdvenster',
    allDay: 'Hele dag',
    notDocumented: 'Nog niet gedocumenteerd',
    masteryAchieved: 'Mastery behaald',
    unlockTitle: 'Ontgrendelen',
    unlockText:
      'D.G. Member Level 7 → portaal bij de voet van Whale Mountain → praat met Naga, dan Rory → open het Hobby-menu (schelp-icoon) → Upgrade → praat met Oliver om te starten.',
    swimTitle: '🏊 Zwemmen',
    swimText:
      "In Whalefall Canyon kun je vrij zwemmen in elke richting. Gebruik Shift (of de dash-knop op mobiel) voor een onderwater-sprint ('meerminstoot'). Zwemmen buiten deze underwater-zone is momenteel niet mogelijk.",
    toolTitle: 'Gereedschap',
    toolText: 'Basis Oceaanreiniger — richt op de vervuiling en houd de reinigingsknop ingedrukt tot die volledig verdwenen is.',
    pollutantTypesTitle: 'Soorten vervuiling',
    rewardsTitle: 'Beloningen',
    rewardsText:
      'Vervuiling opruimen levert Zeeschelpen op, die optellen tot Collectiepunten. Daarmee koop je oceaan-meubels zoals het Zeeschelpen Kralengordijn en de Koraal & Schelpen Vitrinekast. Bepaalde levels geven ook kans op de Voice of the Deep geschenkdoos (met een echt dolfijngeluid-kaartje, onderdeel van een dolfijnenbeschermingscampagne).',
    unconfirmedDisclaimer:
      'Nog niet bevestigd: de volledige lijst met meubels/puntenkosten, of het reinigingsgereedschap uitgebreid kan worden, hoeveel hobby-levels er zijn, en eventuele dagelijkse limieten.',
  },
  en: {
    title: 'Ocean Cleanup',
    subtitle: 'Cleaning up pollution in Whalefall Canyon',
    permanentDisclaimer: 'Permanent hobby (Oceanbound 2.7 update). Stays even after the Call of Whales event ends.',
    shellCatalog: '🐚 Shell Catalog',
    shellCatalogDesc: 'All 30 known shells (source: own screenshots + community tracker)',
    filterAll: 'All',
    filterUndiscovered: '🔍 Not discovered yet',
    filterNotFiveStar: '⭐ Not 5★ yet',
    filterNoMastery: '🏆 No mastery yet',
    goldLabel: 'Gold (sold to Albert Jr.)',
    tokensLabel: 'Tokens (sold to Azure)',
    timeWindow: 'Time window',
    allDay: 'All day',
    notDocumented: 'Not documented yet',
    masteryAchieved: 'Mastery achieved',
    unlockTitle: 'Unlocking',
    unlockText:
      'D.G. Member Level 7 → portal at the foot of Whale Mountain → talk to Naga, then Rory → open the Hobby menu (shell icon) → Upgrade → talk to Oliver to start.',
    swimTitle: '🏊 Swimming',
    swimText:
      "In Whalefall Canyon you can swim freely in any direction. Use Shift (or the dash button on mobile) for an underwater sprint (a 'mermaid dash'). Swimming outside this underwater zone is currently not possible.",
    toolTitle: 'Tool',
    toolText: 'Basic Ocean Cleaner — aim at the pollution and hold the clean button until it fully disappears.',
    pollutantTypesTitle: 'Pollution types',
    rewardsTitle: 'Rewards',
    rewardsText:
      'Cleaning up pollution earns Sea Shells, which add up to Collection Points. Use those to buy ocean furniture like the Sea Shell Bead Curtain and the Coral & Shell Display Case. Certain levels also give a chance at the Voice of the Deep gift box (with a real dolphin-sound card, part of a dolphin protection campaign).',
    unconfirmedDisclaimer:
      'Not yet confirmed: the full list of furniture/point costs, whether the cleaning tool can be upgraded, how many hobby levels there are, and any daily limits.',
  },
} as const;

export default function OceanCleanupScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const SHELLS = useShells();
  const [openShell, setOpenShell] = useState<string | null>(null);
  const [shellStars, setShellStars] = useState<Record<string, number>>({});
  const [shellMastery, setShellMastery] = useState<Record<string, boolean>>({});
  const [shellFilter, setShellFilter] = useState<ShellFilter>('all');

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

  const filteredShells = useMemo(() => {
    if (shellFilter === 'undiscovered') {
      return SHELLS.filter((shell) => (shellStars[shell.name] ?? 0) === 0);
    }
    if (shellFilter === 'notFiveStar') {
      return SHELLS.filter((shell) => {
        const value = shellStars[shell.name] ?? 0;
        return value > 0 && value < 5;
      });
    }
    if (typeof shellFilter === 'number') {
      return SHELLS.filter((shell) => (shellStars[shell.name] ?? 0) === shellFilter);
    }
    if (shellFilter === 'noMastery') {
      return SHELLS.filter((shell) => !shellMastery[shell.name]);
    }
    return SHELLS;
  }, [SHELLS, shellStars, shellMastery, shellFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#4FA8CC', '#6EC6E8']} icon="🌊" title={s.title} subtitle={s.subtitle} />
      <ScrollView contentContainerStyle={styles.content}>
        <DisclaimerBox text={s.permanentDisclaimer} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.shellCatalog}</Text>
          <Text style={styles.cardDesc}>{s.shellCatalogDesc}</Text>
          <View style={styles.chipRow}>
            {SHELL_FILTERS.map((sf) => {
              const active = shellFilter === sf;
              const label =
                typeof sf === 'number'
                  ? `${sf}★`
                  : sf === 'all'
                    ? s.filterAll
                    : sf === 'undiscovered'
                      ? s.filterUndiscovered
                      : sf === 'notFiveStar'
                        ? s.filterNotFiveStar
                        : s.filterNoMastery;
              return (
                <Pressable key={sf} onPress={() => setShellFilter(sf)} style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={{ gap: 8, marginTop: 8 }}>
            {filteredShells.map((shell) => {
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
                    <Pressable
                      style={[styles.masteryCheckbox, shellMastery[shell.name] && styles.checkboxActive]}
                      hitSlop={6}
                      onPress={() => toggleShellMastery(shell.name)}>
                      {shellMastery[shell.name] && <Text style={styles.checkmark}>✓</Text>}
                    </Pressable>
                    <StarRow value={shellStars[shell.name] || 0} onSet={(n) => setShellStar(shell.name, n)} />
                  </Pressable>

                  {isOpen && (
                    <View style={styles.shellBody}>
                      {shell.gold && shell.tokens ? (
                        <>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>{s.goldLabel}</Text>
                            <Text style={styles.shellInfoValue}>
                              {shell.gold.map((v, i) => `${i + 1}★ ${v}🪙`).join('   ')}
                            </Text>
                          </View>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>{s.tokensLabel}</Text>
                            <Text style={styles.shellInfoValue}>
                              {shell.tokens.map((v, i) => `${i + 1}★ ${v}🎫`).join('   ')}
                            </Text>
                          </View>
                          <View style={styles.shellInfoBox}>
                            <Text style={styles.shellInfoLabel}>{s.timeWindow}</Text>
                            <Text style={styles.shellInfoValue}>{shell.time || s.allDay}</Text>
                          </View>
                        </>
                      ) : (
                        <Text style={styles.notDocumented}>{s.notDocumented}</Text>
                      )}
                      <Pressable
                        style={[styles.masteryBox, shellMastery[shell.name] && styles.masteryBoxActive]}
                        onPress={() => toggleShellMastery(shell.name)}>
                        <Text style={[styles.masteryLabel, shellMastery[shell.name] && styles.masteryLabelActive]}>
                          {s.masteryAchieved}
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
          <Text style={styles.cardTitle}>{s.unlockTitle}</Text>
          <Text style={styles.cardText}>{s.unlockText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.swimTitle}</Text>
          <Text style={styles.cardText}>{s.swimText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.toolTitle}</Text>
          <Text style={styles.cardText}>{s.toolText}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.pollutantTypesTitle}</Text>
          <View style={{ gap: 8, marginTop: 8 }}>
            {POLLUTANTS[language].map((p) => (
              <View key={p.name} style={styles.pollutantBox}>
                <Text style={styles.pollutantName}>{p.name}</Text>
                <Text style={styles.pollutantDesc}>{p.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{s.rewardsTitle}</Text>
          <Text style={styles.cardText}>{s.rewardsText}</Text>
        </View>

        <DisclaimerBox warning text={s.unconfirmedDisclaimer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 12 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: c.forest, marginBottom: 4 },
    cardDesc: { fontSize: 12, color: c.forestSoft, marginBottom: 4 },
    cardText: { fontSize: 12, color: c.forestSoft, lineHeight: 18 },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
    chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, flexShrink: 0 },
    chipActive: { backgroundColor: c.forest, borderColor: c.forest },
    chipText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    chipTextActive: { color: '#FFFFFF' },
    shellRow: { backgroundColor: c.surfaceSoft, borderRadius: 10, overflow: 'hidden' },
    shellHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8 },
    shellEmoji: { fontSize: 18 },
    shellText: { flex: 1 },
    shellName: { fontSize: 12, fontWeight: '700', color: c.forest },
    shellLevel: { fontSize: 10, color: c.skyDark },
    masteryCheckbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    shellBody: { paddingHorizontal: 8, paddingBottom: 8, gap: 6 },
    shellInfoBox: { padding: 8, borderRadius: 8, backgroundColor: c.disclaimerBg },
    shellInfoLabel: { fontSize: 11, fontWeight: '700', color: c.forest, marginBottom: 2 },
    shellInfoValue: { fontSize: 11, color: c.forestSoft },
    notDocumented: { fontSize: 11, color: c.forestSoft },
    masteryBox: { padding: 8, borderRadius: 8, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.line, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    masteryBoxActive: { backgroundColor: c.warningBg, borderColor: c.warningBorder },
    masteryLabel: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    masteryLabelActive: { color: c.warningText },
    checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
    pollutantBox: { padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    pollutantName: { fontSize: 12, fontWeight: '700', color: c.forest },
    pollutantDesc: { fontSize: 12, color: c.forestSoft, marginTop: 2 },
  });
}
