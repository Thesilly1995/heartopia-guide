import { router } from 'expo-router';
import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: '👑 Ontdek Premium',
    intro: 'Steun de app en speel zonder afleiding:',
    benefit1: '🚫 Geen advertenties meer',
    benefit2: '☁️ Cloud-save (voortgang veilig op meerdere toestellen)',
    benefit3: '📊 Voortgangsdashboard met al je mastery-percentages',
    cta: 'Bekijk Premium 👑',
    dismiss: 'Misschien later',
  },
  en: {
    title: '👑 Discover Premium',
    intro: 'Support the app and play without distractions:',
    benefit1: '🚫 No more ads',
    benefit2: '☁️ Cloud save (progress safe across multiple devices)',
    benefit3: '📊 Progress dashboard with all your mastery percentages',
    cta: 'View Premium 👑',
    dismiss: 'Maybe later',
  },
  es: {
    title: '👑 Descubre Premium',
    intro: 'Apoya la app y juega sin distracciones:',
    benefit1: '🚫 Sin anuncios',
    benefit2: '☁️ Guardado en la nube (progreso seguro en varios dispositivos)',
    benefit3: '📊 Panel de progreso con todos tus porcentajes de mastery',
    cta: 'Ver Premium 👑',
    dismiss: 'Quizás más tarde',
  },
  pt: {
    title: '👑 Conheça o Premium',
    intro: 'Apoie o app e jogue sem distrações:',
    benefit1: '🚫 Sem anúncios',
    benefit2: '☁️ Salvamento na nuvem (progresso seguro em vários aparelhos)',
    benefit3: '📊 Painel de progresso com todas as suas porcentagens de mastery',
    cta: 'Ver Premium 👑',
    dismiss: 'Talvez depois',
  },
  fr: {
    title: '👑 Découvre Premium',
    intro: "Soutiens l'app et joue sans distraction :",
    benefit1: '🚫 Plus de publicités',
    benefit2: '☁️ Sauvegarde cloud (progression en sécurité sur plusieurs appareils)',
    benefit3: '📊 Tableau de progression avec tous tes pourcentages de mastery',
    cta: 'Voir Premium 👑',
    dismiss: 'Peut-être plus tard',
  },
  de: {
    title: '👑 Entdecke Premium',
    intro: 'Unterstütze die App und spiele ohne Ablenkung:',
    benefit1: '🚫 Keine Werbung mehr',
    benefit2: '☁️ Cloud-Speicherung (Fortschritt sicher auf mehreren Geräten)',
    benefit3: '📊 Fortschritts-Dashboard mit all deinen Mastery-Prozenten',
    cta: 'Premium ansehen 👑',
    dismiss: 'Vielleicht später',
  },
} as const;

export function PremiumPromoModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];

  const goToPremium = () => {
    onClose();
    router.push('/dashboard' as never);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.intro}>{s.intro}</Text>

          <View style={styles.benefits}>
            <Text style={styles.benefit}>{s.benefit1}</Text>
            <Text style={styles.benefit}>{s.benefit2}</Text>
            <Text style={styles.benefit}>{s.benefit3}</Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={goToPremium}>
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
    intro: { fontSize: 13, color: c.forestSoft, textAlign: 'center' },
    benefits: { alignSelf: 'stretch', gap: 8, marginVertical: 4 },
    benefit: { fontSize: 13, color: c.forest, lineHeight: 19 },
    ctaButton: { alignSelf: 'stretch', backgroundColor: c.coral, borderRadius: 999, paddingVertical: 13, marginTop: 6 },
    ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
    dismissText: { fontSize: 12, color: c.forestSoft, textDecorationLine: 'underline', marginTop: 2 },
  });
}
