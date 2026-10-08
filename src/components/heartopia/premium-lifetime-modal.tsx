import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: '👑 Bedankt voor je steun!',
    intro: 'Je hebt ooit Premium eenmalig gekocht — super bedankt daarvoor!',
    body: 'Premium is vanaf nu een maand- of jaarabonnement voor nieuwe leden. Jouw eigen Premium blijft gewoon voor altijd actief, zonder dat je iets hoeft te doen.',
    cta: 'Mooi, dankjewel!',
  },
  en: {
    title: '👑 Thank you for your support!',
    intro: 'You bought Premium as a one-time purchase in the past — thank you so much for that!',
    body: "Premium is now a monthly or annual subscription for new members. Your own Premium simply stays active forever, no action needed on your part.",
    cta: 'Great, thanks!',
  },
  es: {
    title: '👑 ¡Gracias por tu apoyo!',
    intro: 'Hace tiempo compraste Premium como pago único — ¡muchísimas gracias por eso!',
    body: 'Premium ahora es una suscripción mensual o anual para los nuevos miembros. Tu Premium sigue activo para siempre, sin que tengas que hacer nada.',
    cta: '¡Genial, gracias!',
  },
  pt: {
    title: '👑 Obrigado pelo seu apoio!',
    intro: 'Você comprou o Premium como um pagamento único no passado — muito obrigado por isso!',
    body: 'O Premium agora é uma assinatura mensal ou anual para novos membros. O seu Premium continua ativo para sempre, sem que você precise fazer nada.',
    cta: 'Ótimo, obrigado!',
  },
  fr: {
    title: '👑 Merci pour ton soutien !',
    intro: "Tu as acheté Premium en paiement unique il y a un moment — merci beaucoup pour ça !",
    body: "Premium est désormais un abonnement mensuel ou annuel pour les nouveaux membres. Ton propre Premium reste actif pour toujours, sans rien à faire de ton côté.",
    cta: 'Super, merci !',
  },
  de: {
    title: '👑 Danke für deine Unterstützung!',
    intro: 'Du hast Premium damals als einmaligen Kauf erworben — vielen Dank dafür!',
    body: 'Premium ist jetzt ein Monats- oder Jahresabonnement für neue Mitglieder. Dein eigenes Premium bleibt einfach für immer aktiv, ohne dass du etwas tun musst.',
    cta: 'Super, danke!',
  },
} as const;

export function PremiumLifetimeModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.intro}>{s.intro}</Text>

          <View style={styles.bodyBox}>
            <Text style={styles.body}>{s.body}</Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={onClose}>
            <Text style={styles.ctaButtonText}>{s.cta}</Text>
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
    bodyBox: { alignSelf: 'stretch', marginVertical: 4 },
    body: { fontSize: 13, color: c.forest, lineHeight: 19, textAlign: 'center' },
    ctaButton: { alignSelf: 'stretch', backgroundColor: c.coral, borderRadius: 999, paddingVertical: 13, marginTop: 6 },
    ctaButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  });
}
