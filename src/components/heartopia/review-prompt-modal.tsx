import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';
import { markReviewPromptOptedOut, requestNativeReview } from '@/lib/review-prompt';

const STRINGS = {
  nl: {
    title: 'Vind je Heartopedia leuk? ⭐',
    body: 'Een review in de Play Store helpt andere spelers de app te vinden — het kost maar een paar tikjes!',
    cta: "Ja, ik review 'm!",
    dismiss: 'Niet nu',
  },
  en: {
    title: 'Enjoying Heartopedia? ⭐',
    body: 'A review in the Play Store helps other players find the app — it only takes a few taps!',
    cta: "Yes, I'll review it!",
    dismiss: 'Not now',
  },
  es: {
    title: '¿Te gusta Heartopedia? ⭐',
    body: 'Una reseña en Play Store ayuda a otros jugadores a encontrar la app — ¡solo toma unos segundos!',
    cta: '¡Sí, la reseño!',
    dismiss: 'Ahora no',
  },
  pt: {
    title: 'Está gostando do Heartopedia? ⭐',
    body: 'Uma avaliação na Play Store ajuda outros jogadores a encontrar o app — leva só alguns segundos!',
    cta: 'Sim, vou avaliar!',
    dismiss: 'Agora não',
  },
  fr: {
    title: 'Tu aimes Heartopedia ? ⭐',
    body: "Un avis sur le Play Store aide d'autres joueurs à trouver l'appli — ça ne prend que quelques secondes !",
    cta: 'Oui, je laisse un avis !',
    dismiss: 'Pas maintenant',
  },
  de: {
    title: 'Gefällt dir Heartopedia? ⭐',
    body: 'Eine Bewertung im Play Store hilft anderen Spielern, die App zu finden — das dauert nur ein paar Sekunden!',
    cta: 'Ja, ich bewerte sie!',
    dismiss: 'Nicht jetzt',
  },
} as const;

export function ReviewPromptModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];

  const handleYes = async () => {
    onClose();
    await markReviewPromptOptedOut();
    await requestNativeReview();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{s.title}</Text>

          <View style={styles.bodyBox}>
            <Text style={styles.body}>{s.body}</Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={handleYes}>
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
