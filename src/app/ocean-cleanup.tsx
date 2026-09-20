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
  es: [
    { name: 'Contaminación Arremolinada', desc: 'El tipo estándar, se retira rápido' },
    { name: 'Contaminación de Caparazón Duro', desc: 'Más resistente — cuesta más limpiarla' },
    { name: 'Contaminación de Caparazón Duro Agrietado', desc: 'Más resistente — luego se rompe en trozos' },
  ],
  pt: [
    { name: 'Poluição Redemoinho', desc: 'O tipo padrão, rápido de remover' },
    { name: 'Poluição de Casca Dura', desc: 'Mais resistente — exige mais esforço para limpar' },
    { name: 'Poluição de Casca Dura Rachada', desc: 'Mais resistente — depois se quebra em pedaços' },
  ],
  fr: [
    { name: 'Pollution Tourbillonnante', desc: 'Le type standard, rapide à retirer' },
    { name: 'Pollution à Coquille Dure', desc: 'Plus coriace — demande plus d\'effort à nettoyer' },
    { name: 'Pollution à Coquille Dure Fissurée', desc: 'Plus coriace — se brise ensuite en morceaux' },
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
  es: {
    title: 'Ocean Cleanup',
    subtitle: 'Limpiando la contaminación en Whalefall Canyon',
    permanentDisclaimer: 'Hobby permanente (actualización Oceanbound 2.7). Se mantiene incluso después de que termine el evento Call of Whales.',
    shellCatalog: '🐚 Catálogo de conchas',
    shellCatalogDesc: 'Las 30 conchas conocidas (fuente: capturas propias + tracker de la comunidad)',
    filterAll: 'Todas',
    filterUndiscovered: '🔍 Aún por descubrir',
    filterNotFiveStar: '⭐ Aún sin 5★',
    filterNoMastery: '🏆 Aún sin mastery',
    goldLabel: 'Oro (vendido a Albert Jr.)',
    tokensLabel: 'Fichas (vendidas a Azure)',
    timeWindow: 'Franja horaria',
    allDay: 'Todo el día',
    notDocumented: 'Aún no documentado',
    masteryAchieved: 'Mastery conseguido',
    unlockTitle: 'Cómo desbloquear',
    unlockText:
      'D.G. Member Nivel 7 → portal al pie de Whale Mountain → habla con Naga y luego con Rory → abre el menú de Hobbies (icono de concha) → Mejorar → habla con Oliver para empezar.',
    swimTitle: '🏊 Nadar',
    swimText:
      "En Whalefall Canyon puedes nadar libremente en cualquier dirección. Usa Shift (o el botón de dash en móvil) para un sprint submarino ('impulso de sirena'). Actualmente no se puede nadar fuera de esta zona submarina.",
    toolTitle: 'Herramienta',
    toolText: 'Limpiador Oceánico Básico — apunta a la contaminación y mantén pulsado el botón de limpiar hasta que desaparezca por completo.',
    pollutantTypesTitle: 'Tipos de contaminación',
    rewardsTitle: 'Recompensas',
    rewardsText:
      'Limpiar la contaminación da Conchas Marinas, que se acumulan como Puntos de Colección. Con ellos compras muebles oceánicos como la Cortina de Cuentas de Conchas Marinas y la Vitrina de Coral y Conchas. Algunos niveles también dan posibilidad de conseguir la caja de regalo Voice of the Deep (con una tarjeta de sonido real de delfín, parte de una campaña de protección de delfines).',
    unconfirmedDisclaimer:
      'Aún sin confirmar: la lista completa de muebles/costes en puntos, si se puede mejorar la herramienta de limpieza, cuántos niveles de hobby hay, y posibles límites diarios.',
  },
  pt: {
    title: 'Ocean Cleanup',
    subtitle: 'Limpando a poluição em Whalefall Canyon',
    permanentDisclaimer: 'Hobby permanente (atualização Oceanbound 2.7). Continua disponível mesmo depois que o evento Call of Whales terminar.',
    shellCatalog: '🐚 Catálogo de conchas',
    shellCatalogDesc: 'Todas as 30 conchas conhecidas (fonte: capturas de tela próprias + tracker da comunidade)',
    filterAll: 'Todas',
    filterUndiscovered: '🔍 Ainda por descobrir',
    filterNotFiveStar: '⭐ Ainda sem 5★',
    filterNoMastery: '🏆 Ainda sem mastery',
    goldLabel: 'Ouro (vendido a Albert Jr.)',
    tokensLabel: 'Fichas (vendidas a Azure)',
    timeWindow: 'Janela de horário',
    allDay: 'O dia todo',
    notDocumented: 'Ainda não documentado',
    masteryAchieved: 'Mastery alcançado',
    unlockTitle: 'Como desbloquear',
    unlockText:
      'D.G. Member Nível 7 → portal ao pé de Whale Mountain → fale com Naga e depois com Rory → abra o menu de Hobbies (ícone de concha) → Upgrade → fale com Oliver para começar.',
    swimTitle: '🏊 Nadar',
    swimText:
      "Em Whalefall Canyon você pode nadar livremente em qualquer direção. Use Shift (ou o botão de dash no celular) para um sprint subaquático ('impulso de sereia'). No momento não é possível nadar fora dessa zona subaquática.",
    toolTitle: 'Ferramenta',
    toolText: 'Limpador Oceânico Básico — mire na poluição e segure o botão de limpar até ela desaparecer completamente.',
    pollutantTypesTitle: 'Tipos de poluição',
    rewardsTitle: 'Recompensas',
    rewardsText:
      'Limpar a poluição rende Conchas do Mar, que se somam em Pontos de Coleção. Use-os para comprar móveis oceânicos como a Cortina de Contas de Conchas do Mar e a Vitrine de Coral e Conchas. Alguns níveis também dão chance de ganhar a caixa de presente Voice of the Deep (com um cartão com som real de golfinho, parte de uma campanha de proteção aos golfinhos).',
    unconfirmedDisclaimer:
      'Ainda não confirmado: a lista completa de móveis/custos em pontos, se a ferramenta de limpeza pode ser melhorada, quantos níveis de hobby existem, e eventuais limites diários.',
  },
  fr: {
    title: 'Ocean Cleanup',
    subtitle: 'Nettoyage de la pollution à Whalefall Canyon',
    permanentDisclaimer: "Passe-temps permanent (mise à jour Oceanbound 2.7). Reste disponible même après la fin de l'événement Call of Whales.",
    shellCatalog: '🐚 Catalogue de coquillages',
    shellCatalogDesc: "Les 30 coquillages connus (source : captures d'écran personnelles + tracker communautaire)",
    filterAll: 'Tous',
    filterUndiscovered: '🔍 Pas encore découverts',
    filterNotFiveStar: '⭐ Pas encore 5★',
    filterNoMastery: '🏆 Pas encore de mastery',
    goldLabel: 'Or (vendu à Albert Jr.)',
    tokensLabel: 'Jetons (vendus à Azure)',
    timeWindow: 'Plage horaire',
    allDay: 'Toute la journée',
    notDocumented: 'Pas encore documenté',
    masteryAchieved: 'Mastery atteint',
    unlockTitle: 'Déblocage',
    unlockText:
      'D.G. Member Niveau 7 → portail au pied de Whale Mountain → parle à Naga, puis à Rory → ouvre le menu Hobby (icône coquillage) → Améliorer → parle à Oliver pour commencer.',
    swimTitle: '🏊 Nager',
    swimText:
      "À Whalefall Canyon, tu peux nager librement dans toutes les directions. Utilise Shift (ou le bouton dash sur mobile) pour un sprint sous-marin (une 'ruée de sirène'). Nager en dehors de cette zone sous-marine n'est pas possible pour l'instant.",
    toolTitle: 'Outil',
    toolText: 'Nettoyeur Océanique de Base — vise la pollution et maintiens le bouton de nettoyage enfoncé jusqu\'à ce qu\'elle disparaisse complètement.',
    pollutantTypesTitle: 'Types de pollution',
    rewardsTitle: 'Récompenses',
    rewardsText:
      "Nettoyer la pollution rapporte des Coquillages de Mer, qui s'additionnent en Points de Collection. Utilise-les pour acheter des meubles océaniques comme le Rideau de Perles Coquillages de Mer et la Vitrine Corail & Coquillages. Certains niveaux donnent aussi une chance d'obtenir le coffret-cadeau Voice of the Deep (avec une vraie carte au son de dauphin, dans le cadre d'une campagne de protection des dauphins).",
    unconfirmedDisclaimer:
      "Pas encore confirmé : la liste complète des meubles/coûts en points, si l'outil de nettoyage peut être amélioré, combien de niveaux de hobby il y a, et d'éventuelles limites quotidiennes.",
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
