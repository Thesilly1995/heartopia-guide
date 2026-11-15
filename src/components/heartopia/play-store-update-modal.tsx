import { useMemo } from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const ANDROID_PACKAGE = 'com.thesilly1995.heartopiagids';
const MARKET_URL = `market://details?id=${ANDROID_PACKAGE}`;
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const STRINGS = {
  nl: {
    title: '🔄 Update beschikbaar',
    body: 'Er staat een belangrijke update in de Play Store die een crashprobleem oplost. Update de app zodra je kunt, voor de beste (en stabielste) ervaring.',
    cta: 'Open Play Store',
    dismiss: 'Later',
  },
  en: {
    title: '🔄 Update available',
    body: 'An important update is available in the Play Store that fixes a crash issue. Please update as soon as you can, for the best (and most stable) experience.',
    cta: 'Open Play Store',
    dismiss: 'Later',
  },
  es: {
    title: '🔄 Actualización disponible',
    body: 'Hay una actualización importante en Play Store que soluciona un problema de cierres inesperados. Actualiza en cuanto puedas, para la mejor (y más estable) experiencia.',
    cta: 'Abrir Play Store',
    dismiss: 'Más tarde',
  },
  pt: {
    title: '🔄 Atualização disponível',
    body: 'Há uma atualização importante na Play Store que corrige um problema de fechamentos inesperados. Atualize assim que possível, para a melhor (e mais estável) experiência.',
    cta: 'Abrir Play Store',
    dismiss: 'Mais tarde',
  },
  fr: {
    title: '🔄 Mise à jour disponible',
    body: 'Une mise à jour importante est disponible sur le Play Store et corrige un problème de plantage. Mets à jour dès que possible, pour la meilleure expérience (et la plus stable).',
    cta: 'Ouvrir le Play Store',
    dismiss: 'Plus tard',
  },
  de: {
    title: '🔄 Update verfügbar',
    body: 'Im Play Store ist ein wichtiges Update verfügbar, das ein Absturzproblem behebt. Bitte aktualisiere so bald wie möglich, für die beste (und stabilste) Erfahrung.',
    cta: 'Play Store öffnen',
    dismiss: 'Später',
  },
} as const;

export function PlayStoreUpdateModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];

  const openPlayStore = async () => {
    try {
      await Linking.openURL(MARKET_URL);
    } catch {
      try {
        await Linking.openURL(PLAY_STORE_URL);
      } catch {
        // openen mislukt (bv. geen Play Store beschikbaar) — stil negeren
      }
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{s.title}</Text>

          <View style={styles.bodyBox}>
            <Text style={styles.body}>{s.body}</Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={openPlayStore}>
            <Text style={styles.ctaButtonText}>{s.cta}</Text>
          </Pressable>
          <Pressable onPress={onClose} hitSlop={6}>
            <Text style={styles.dismissText}>{s.dismiss}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    card: { width: '100%', maxWidth: 360, backgroundColor: c.card, borderRadius: 20, padding: 24, gap: 12, alignItems: 'center' },
    title: { fontSize: 19, fontWeight: '800', color: c.forest, textAlign: 'center' },
    bodyBox: { alignSelf: 'stretch', marginVertical: 4 },
    body: { fontSize: 13, color: c.forest, lineHeight: 19, textAlign: 'center' },
    ctaButton: { alignSelf: 'stretch', backgroundColor: c.coral, borderRadius: 999, paddingVertical: 13, marginTop: 6 },
    ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
    dismissText: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
  });
}
