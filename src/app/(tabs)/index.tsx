import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useBubblesProgress } from '@/data/bubbles-progress';
import { useDailyPlots } from '@/data/daily-plots';
import { useCurrentEventMeta } from '@/data/event-meta';
import { useMeteorSpots } from '@/data/meteor-spots';
import { useMissionsProgress } from '@/data/missions-progress';
import { useRainbowSpots } from '@/data/rainbow-spots';
import { useWeekForecast } from '@/data/week-forecast';
import { LANGUAGES, useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';
import { SERVERS, useServer } from '@/hooks/use-server';
import { formatGmtOffset } from '@/lib/reset-schedule';

type LocalizedText = { nl: string; en: string; es: string; pt: string };

const SECTIONS: {
  label: LocalizedText;
  items: { href: string | null; icon: string; title: LocalizedText; desc: LocalizedText }[];
}[] = [
  {
    label: { nl: "Hobby's", en: 'Hobbies', es: 'Aficiones', pt: 'Hobbies' },
    items: [
      { href: '/vissen', icon: '🎣', title: { nl: 'Vissen', en: 'Fishing', es: 'Pesca', pt: 'Pesca' }, desc: { nl: 'Vissoorten, plekken & tijden', en: 'Fish species, spots & times', es: 'Especies de peces, lugares y horarios', pt: 'Espécies de peixes, locais e horários' } },
      { href: '/koken', icon: '🍳', title: { nl: 'Koken', en: 'Cooking', es: 'Cocinar', pt: 'Cozinhar' }, desc: { nl: 'Recepten & ingrediënten', en: 'Recipes & ingredients', es: 'Recetas e ingredientes', pt: 'Receitas e ingredientes' } },
      { href: '/tuinieren', icon: '🌱', title: { nl: 'Tuinieren', en: 'Gardening', es: 'Jardinería', pt: 'Jardinagem' }, desc: { nl: 'Zaden, groei & oogst', en: 'Seeds, growth & harvest', es: 'Semillas, crecimiento y cosecha', pt: 'Sementes, crescimento e colheita' } },
      { href: '/insecten', icon: '🦋', title: { nl: 'Insecten', en: 'Insects', es: 'Insectos', pt: 'Insetos' }, desc: { nl: 'Vlinders, kevers & meer', en: 'Butterflies, beetles & more', es: 'Mariposas, escarabajos y más', pt: 'Borboletas, besouros e mais' } },
      { href: '/vogels', icon: '🐦', title: { nl: 'Vogels', en: 'Birds', es: 'Aves', pt: 'Aves' }, desc: { nl: 'Vogelsoorten & plekken', en: 'Bird species & spots', es: 'Especies de aves y lugares', pt: 'Espécies de aves e locais' } },
      { href: '/beeldhouwen', icon: '🏖️', title: { nl: 'Beeldhouwen', en: 'Sculpting', es: 'Escultura', pt: 'Escultura' }, desc: { nl: 'Zand- en sneeuwsculpturen', en: 'Sand and snow sculptures', es: 'Esculturas de arena y nieve', pt: 'Esculturas de areia e neve' } },
      { href: '/ocean-cleanup', icon: '🌊', title: { nl: 'Ocean Cleanup', en: 'Ocean Cleanup', es: 'Limpieza del océano', pt: 'Limpeza do oceano' }, desc: { nl: 'Vervuiling opruimen & schelpen', en: 'Cleaning up pollution & shells', es: 'Limpiar la contaminación y conchas', pt: 'Limpar a poluição e conchas' } },
      { href: '/huisdieren', icon: '🐾', title: { nl: 'Dog & Cat Moments', en: 'Dog & Cat Moments', es: 'Dog & Cat Moments', pt: 'Dog & Cat Moments' }, desc: { nl: 'Huisdieren adopteren & verzorgen', en: 'Adopt & care for pets', es: 'Adopta y cuida mascotas', pt: 'Adote e cuide de animais de estimação' } },
    ],
  },
  {
    label: { nl: 'Extra', en: 'Extra', es: 'Extra', pt: 'Extra' },
    items: [
      { href: '/wilde-dieren', icon: '🦊', title: { nl: 'Wilde Dieren', en: 'Wild Animals', es: 'Animales Salvajes', pt: 'Animais Selvagens' }, desc: { nl: 'Voertroggen, eten & vriendschap', en: 'Feeding troughs, food & friendship', es: 'Comederos, comida y amistad', pt: 'Comedouros, comida e amizade' } },
      { href: '/wilde-ingredienten', icon: '🌿', title: { nl: 'Wilde Ingrediënten', en: 'Wild Ingredients', es: 'Ingredientes Silvestres', pt: 'Ingredientes Selvagens' }, desc: { nl: 'Fruit, paddenstoelen & materialen', en: 'Fruit, mushrooms & materials', es: 'Fruta, setas y materiales', pt: 'Frutas, cogumelos e materiais' } },
    ],
  },
  {
    label: { nl: 'Spel', en: 'Game', es: 'Juego', pt: 'Jogo' },
    items: [
      { href: '/badges', icon: '🏅', title: { nl: 'Badges', en: 'Badges', es: 'Insignias', pt: 'Emblemas' }, desc: { nl: 'Prestaties & profieltitels', en: 'Achievements & profile titles', es: 'Logros y títulos de perfil', pt: 'Conquistas e títulos de perfil' } },
      { href: '/puzzels-boeken', icon: '🧩', title: { nl: 'Puzzels & Boeken', en: 'Puzzles & Books', es: 'Puzzles y Libros', pt: 'Quebra-cabeças e Livros' }, desc: { nl: 'Other Collections: puzzels & boeken', en: 'Other Collections: puzzles & books', es: 'Other Collections: puzzles y libros', pt: 'Other Collections: quebra-cabeças e livros' } },
      { href: '/codes', icon: '🎁', title: { nl: 'Codes', en: 'Codes', es: 'Códigos', pt: 'Códigos' }, desc: { nl: 'Actieve & verlopen codes', en: 'Active & expired codes', es: 'Códigos activos y caducados', pt: 'Códigos ativos e expirados' } },
    ],
  },
  {
    label: { nl: 'Premium', en: 'Premium', es: 'Premium', pt: 'Premium' },
    items: [
      { href: '/dashboard', icon: '📊', title: { nl: 'Voortgangsdashboard', en: 'Progress Dashboard', es: 'Panel de Progreso', pt: 'Painel de Progresso' }, desc: { nl: 'Overzicht van je voortgang in alle catalogussen', en: 'Overview of your progress across all catalogs', es: 'Resumen de tu progreso en todos los catálogos', pt: 'Resumo do seu progresso em todos os catálogos' } },
      { href: '/meldingen', icon: '🔔', title: { nl: 'Meldingen', en: 'Notifications', es: 'Notificaciones', pt: 'Notificações' }, desc: { nl: 'Herinneringen bij nieuwe events & bijzonder weer', en: 'Reminders for new events & special weather', es: 'Recordatorios de nuevos eventos y clima especial', pt: 'Lembretes de novos eventos e clima especial' } },
      { href: '/cloud-save', icon: '☁️', title: { nl: 'Cloud Save', en: 'Cloud Save', es: 'Guardado en la Nube', pt: 'Salvamento na Nuvem' }, desc: { nl: 'Voortgang bewaren & gebruiken op een ander toestel', en: 'Save your progress & use it on another device', es: 'Guarda tu progreso y úsalo en otro dispositivo', pt: 'Salve seu progresso e use em outro dispositivo' } },
      { href: '/tips', icon: '💡', title: { nl: 'Tips & Tricks', en: 'Tips & Tricks', es: 'Trucos y Consejos', pt: 'Dicas e Truques' }, desc: { nl: 'Handige weetjes over het spel en events', en: 'Handy things to know about the game and events', es: 'Datos útiles sobre el juego y los eventos', pt: 'Informações úteis sobre o jogo e eventos' } },
    ],
  },
  {
    label: { nl: 'Overig', en: 'Other', es: 'Otros', pt: 'Outros' },
    items: [
      { href: '/todo', icon: '📝', title: { nl: 'To-do', en: 'To-do', es: 'Tareas', pt: 'Tarefas' }, desc: { nl: 'Wat wil je nog gaan doen?', en: 'What do you still want to do?', es: '¿Qué más quieres hacer?', pt: 'O que você ainda quer fazer?' } },
      { href: '/feedback', icon: '💡', title: { nl: 'Feedback', en: 'Feedback', es: 'Comentarios', pt: 'Feedback' }, desc: { nl: 'Deel je ideeën voor de gids', en: 'Share your ideas for the guide', es: 'Comparte tus ideas para la guía', pt: 'Compartilhe suas ideias para o guia' } },
    ],
  },
];

const STRINGS = {
  nl: {
    welcome: 'Welkom bij',
    title: 'Heartopedia',
    unknown: 'Onbekend — vraag het na',
    active: 'Actief nu',
    inactive: 'Niet actief',
    forecastTitle: 'Weer deze week',
    comingSoon: 'Komt binnenkort ✨',
    premiumRequired: 'Vereist Premium 👑',
    premiumTestOn: 'Test: Premium AAN',
    premiumTestOff: 'Test: Premium UIT',
    premiumBenefits: 'Krijg voordelen ✨',
    dailyResetNote: 'Daily reset 06:00',
    serverModalTitle: 'Kies je server',
    langModalTitle: 'Kies je taal',
  },
  en: {
    welcome: 'Welcome to',
    title: 'Heartopedia',
    unknown: 'Unknown — ask to look it up',
    active: 'Active now',
    inactive: 'Not active',
    forecastTitle: 'Weather this week',
    comingSoon: 'Coming soon ✨',
    premiumRequired: 'Requires Premium 👑',
    premiumTestOn: 'Test: Premium ON',
    premiumTestOff: 'Test: Premium OFF',
    premiumBenefits: 'Get benefits ✨',
    dailyResetNote: 'Daily reset 06:00',
    serverModalTitle: 'Choose your server',
    langModalTitle: 'Choose your language',
  },
  es: {
    welcome: 'Bienvenido a',
    title: 'Heartopedia',
    unknown: 'Desconocido — lo confirmaremos',
    active: 'Activo ahora',
    inactive: 'No activo',
    forecastTitle: 'Clima esta semana',
    comingSoon: 'Próximamente ✨',
    premiumRequired: 'Requiere Premium 👑',
    premiumTestOn: 'Prueba: Premium ACTIVADO',
    premiumTestOff: 'Prueba: Premium DESACTIVADO',
    premiumBenefits: 'Obtén beneficios ✨',
    dailyResetNote: 'Reinicio diario 06:00',
    serverModalTitle: 'Elige tu servidor',
    langModalTitle: 'Elige tu idioma',
  },
  pt: {
    welcome: 'Bem-vindo(a) ao',
    title: 'Heartopedia',
    unknown: 'Desconhecido — vamos confirmar',
    active: 'Ativo agora',
    inactive: 'Não ativo',
    forecastTitle: 'Clima esta semana',
    comingSoon: 'Em breve ✨',
    premiumRequired: 'Requer Premium 👑',
    premiumTestOn: 'Teste: Premium ATIVADO',
    premiumTestOff: 'Teste: Premium DESATIVADO',
    premiumBenefits: 'Obtenha benefícios ✨',
    dailyResetNote: 'Reinício diário 06:00',
    serverModalTitle: 'Escolha seu servidor',
    langModalTitle: 'Escolha seu idioma',
  },
} as const;

export default function HomeScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language, setLanguage } = useLanguage();
  const { premium, togglePremium } = usePremium();
  const { server, setServer } = useServer();
  const s = STRINGS[language];
  const [forecastExpanded, setForecastExpanded] = useState(false);
  const [comingSoonKey, setComingSoonKey] = useState<string | null>(null);
  const [serverPickerOpen, setServerPickerOpen] = useState(false);
  const [langPickerOpen, setLangPickerOpen] = useState(false);
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
            <View style={styles.headerTopRight}>
              <Pressable style={styles.serverSwitch} onPress={() => setServerPickerOpen(true)} hitSlop={8}>
                <Text style={styles.serverSwitchText}>🌐 {server.label}</Text>
              </Pressable>
              <Pressable style={styles.langSwitch} onPress={() => setLangPickerOpen(true)} hitSlop={8}>
                <Text style={styles.langSwitchText}>🌍 {language.toUpperCase()}</Text>
              </Pressable>
            </View>
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
                    <Text style={styles.forecastDay}>{weekForecast[0].weekdayLabel}</Text>
                    <View style={styles.forecastIconRow}>
                      {weekForecast[0].slots.map((slot, i) => (
                        <Text key={i} style={styles.forecastIcon}>{slot.emoji}</Text>
                      ))}
                    </View>
                  </View>
                )}
                <Text style={[styles.chevron, forecastExpanded && styles.chevronExpanded]}>›</Text>
              </View>
            </Pressable>
            {forecastExpanded &&
              weekForecast.map((entry) => (
                <View key={entry.date} style={styles.forecastRow}>
                  <Text style={[styles.forecastDay, styles.forecastDayFixed]}>{entry.dayLabel}</Text>
                  <View style={styles.forecastIconRow}>
                    {entry.slots.map((slot, i) => (
                      <View key={i} style={styles.forecastSlot}>
                        <Text style={styles.forecastIcon}>{slot.emoji}</Text>
                        {slot.blockLabel && <Text style={styles.forecastBlockLabel}>{slot.blockLabel}</Text>}
                      </View>
                    ))}
                  </View>
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
        <Text style={styles.dailyResetNote}>{s.dailyResetNote}</Text>

        {SECTIONS.map((section) => {
          const isPremiumSection = section.label.nl === 'Premium';
          return (
            <View key={section.label.nl} style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionLabelRow}>
                  <Text style={[styles.sectionLabel, isPremiumSection && styles.sectionLabelPremium]}>{section.label[language]}</Text>
                  {isPremiumSection && !premium && <Text style={styles.premiumBenefitsText}>{s.premiumBenefits}</Text>}
                </View>
                {isPremiumSection && __DEV__ && (
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

      <Modal visible={serverPickerOpen} transparent animationType="fade" onRequestClose={() => setServerPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setServerPickerOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{s.serverModalTitle}</Text>
            {SERVERS.map((option) => {
              const active = option.id === server.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.serverOptionRow, active && styles.serverOptionRowActive]}
                  onPress={() => {
                    setServer(option);
                    setServerPickerOpen(false);
                  }}>
                  <Text style={[styles.serverOptionText, active && styles.serverOptionTextActive]}>{option.label}</Text>
                  <Text style={[styles.serverOptionOffset, active && styles.serverOptionTextActive]}>
                    {formatGmtOffset(option.offsetHours)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

      <Modal visible={langPickerOpen} transparent animationType="fade" onRequestClose={() => setLangPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setLangPickerOpen(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{s.langModalTitle}</Text>
            {LANGUAGES.map((option) => {
              const active = option.code === language;
              return (
                <Pressable
                  key={option.code}
                  style={[styles.serverOptionRow, active && styles.serverOptionRowActive]}
                  onPress={() => {
                    setLanguage(option.code);
                    setLangPickerOpen(false);
                  }}>
                  <Text style={[styles.serverOptionText, active && styles.serverOptionTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    scrollContent: { padding: 20, paddingBottom: 40, gap: 4 },
    header: { paddingVertical: 20, paddingTop: Platform.OS === 'web' ? 56 : 20 },
    headerTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    headerTopRight: { alignItems: 'flex-end', gap: 6 },
    welcome: { color: c.forestSoft, fontSize: 14 },
    title: { color: c.forest, fontSize: 28, fontWeight: 'bold', marginTop: 4 },
    langSwitch: { backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
    langSwitchText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    serverSwitch: { backgroundColor: c.card, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
    serverSwitchText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    modalCard: { width: '100%', maxWidth: 320, backgroundColor: c.card, borderRadius: 18, padding: 16, gap: 8 },
    modalTitle: { fontSize: 15, fontWeight: '700', color: c.forest, marginBottom: 4 },
    serverOptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 12, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line },
    serverOptionRowActive: { backgroundColor: c.coral, borderColor: c.coral },
    serverOptionText: { fontSize: 14, fontWeight: '600', color: c.forest },
    serverOptionOffset: { fontSize: 12, color: c.forestSoft },
    serverOptionTextActive: { color: '#FFFFFF' },
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
    forecastIconRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
    forecastSlot: { alignItems: 'center', gap: 1 },
    forecastIcon: { fontSize: 16 },
    forecastBlockLabel: { fontSize: 9, fontWeight: '700', color: c.forestSoft },
    forecastDay: { color: c.forest, fontSize: 13, fontWeight: '700' },
    forecastDayFixed: { width: 84 },
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
    dailyResetNote: { color: c.forestSoft, fontSize: 10, marginTop: 4, marginLeft: 4 },
    section: { marginTop: 16, gap: 10 },
    sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
    sectionLabelRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
    sectionLabel: { color: c.forestSoft, fontSize: 14 },
    sectionLabelPremium: { color: c.coral, fontSize: 15, fontWeight: '800' },
    premiumBenefitsText: { color: c.coral, fontSize: 11, fontWeight: '600' },
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
