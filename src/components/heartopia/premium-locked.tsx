import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { getPremiumPackagePrices, isPurchasesConfigured, type PremiumPackagePrices } from '@/constants/purchases';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    lockedTitle: 'Alleen voor Premium-leden',
    monthlyButton: (price: string | null) => (price ? `Maandelijks — ${price}/maand 👑` : 'Maandelijks 👑'),
    annualButton: (price: string | null) => (price ? `Jaarlijks — ${price}/jaar 👑` : 'Jaarlijks 👑'),
    annualBadge: '2 maanden gratis',
    working: 'Bezig...',
    restore: 'Aankopen herstellen',
    purchaseError: 'Aankoop mislukt — probeer het later opnieuw.',
    notConfigured: 'Aankopen zijn nog niet beschikbaar — dit wordt binnenkort geactiveerd.',
    testButton: 'Test-premium aanzetten (alleen dev)',
    testNote: 'Alleen zichtbaar in development — testers zien dit niet.',
  },
  en: {
    lockedTitle: 'Premium members only',
    monthlyButton: (price: string | null) => (price ? `Monthly — ${price}/month 👑` : 'Monthly 👑'),
    annualButton: (price: string | null) => (price ? `Yearly — ${price}/year 👑` : 'Yearly 👑'),
    annualBadge: '2 months free',
    working: 'Working...',
    restore: 'Restore purchases',
    purchaseError: 'Purchase failed — please try again later.',
    notConfigured: 'Purchases are not available yet — this will be enabled soon.',
    testButton: 'Enable test premium (dev only)',
    testNote: 'Only visible in development — testers do not see this.',
  },
  es: {
    lockedTitle: 'Solo para miembros Premium',
    monthlyButton: (price: string | null) => (price ? `Mensual — ${price}/mes 👑` : 'Mensual 👑'),
    annualButton: (price: string | null) => (price ? `Anual — ${price}/año 👑` : 'Anual 👑'),
    annualBadge: '2 meses gratis',
    working: 'Cargando...',
    restore: 'Restaurar compras',
    purchaseError: 'La compra falló — inténtalo de nuevo más tarde.',
    notConfigured: 'Las compras aún no están disponibles — se activarán pronto.',
    testButton: 'Activar premium de prueba (solo dev)',
    testNote: 'Solo visible en desarrollo — los testers no ven esto.',
  },
  pt: {
    lockedTitle: 'Somente para membros Premium',
    monthlyButton: (price: string | null) => (price ? `Mensal — ${price}/mês 👑` : 'Mensal 👑'),
    annualButton: (price: string | null) => (price ? `Anual — ${price}/ano 👑` : 'Anual 👑'),
    annualBadge: '2 meses grátis',
    working: 'Processando...',
    restore: 'Restaurar compras',
    purchaseError: 'Falha na compra — tente novamente mais tarde.',
    notConfigured: 'As compras ainda não estão disponíveis — isso será ativado em breve.',
    testButton: 'Ativar premium de teste (somente dev)',
    testNote: 'Visível apenas em desenvolvimento — testers não veem isso.',
  },
  fr: {
    lockedTitle: 'Réservé aux membres Premium',
    monthlyButton: (price: string | null) => (price ? `Mensuel — ${price}/mois 👑` : 'Mensuel 👑'),
    annualButton: (price: string | null) => (price ? `Annuel — ${price}/an 👑` : 'Annuel 👑'),
    annualBadge: '2 mois gratuits',
    working: 'Chargement...',
    restore: 'Restaurer les achats',
    purchaseError: "L'achat a échoué — réessaie plus tard.",
    notConfigured: "Les achats ne sont pas encore disponibles — ce sera bientôt activé.",
    testButton: 'Activer le premium de test (dev uniquement)',
    testNote: 'Visible uniquement en développement — les testeurs ne voient pas ceci.',
  },
  de: {
    lockedTitle: 'Nur für Premium-Mitglieder',
    monthlyButton: (price: string | null) => (price ? `Monatlich — ${price}/Monat 👑` : 'Monatlich 👑'),
    annualButton: (price: string | null) => (price ? `Jährlich — ${price}/Jahr 👑` : 'Jährlich 👑'),
    annualBadge: '2 Monate gratis',
    working: 'Wird bearbeitet...',
    restore: 'Käufe wiederherstellen',
    purchaseError: 'Kauf fehlgeschlagen — versuch es später noch einmal.',
    notConfigured: 'Käufe sind noch nicht verfügbar — das wird bald freigeschaltet.',
    testButton: 'Test-Premium aktivieren (nur Dev)',
    testNote: 'Nur in der Entwicklung sichtbar — Tester sehen das nicht.',
  },
} as const;

export function PremiumLockedView({ text }: { text: string }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { setPremium, purchasing, purchaseError, purchasePremium, restorePurchases } = usePremium();
  const [prices, setPrices] = useState<PremiumPackagePrices>({ monthly: null, annual: null });

  useEffect(() => {
    getPremiumPackagePrices().then(setPrices);
  }, []);

  return (
    <View style={styles.lockedContent}>
      <Text style={styles.lockedIcon}>🔒</Text>
      <Text style={styles.lockedTitle}>{s.lockedTitle}</Text>
      <Text style={styles.lockedText}>{text}</Text>

      {isPurchasesConfigured ? (
        <>
          <Pressable style={styles.upgradeButton} disabled={purchasing} onPress={() => purchasePremium('monthly')}>
            <Text style={styles.upgradeButtonText}>{purchasing ? s.working : s.monthlyButton(prices.monthly)}</Text>
          </Pressable>
          <Pressable style={styles.annualButton} disabled={purchasing} onPress={() => purchasePremium('annual')}>
            <Text style={styles.annualBadge}>{s.annualBadge}</Text>
            <Text style={styles.upgradeButtonText}>{purchasing ? s.working : s.annualButton(prices.annual)}</Text>
          </Pressable>
          <Pressable onPress={restorePurchases} disabled={purchasing} hitSlop={6}>
            <Text style={styles.restoreLink}>{s.restore}</Text>
          </Pressable>
          {purchaseError && <Text style={styles.errorText}>{s.purchaseError}</Text>}
        </>
      ) : (
        <Text style={styles.notConfiguredText}>{s.notConfigured}</Text>
      )}

      {__DEV__ && (
        <>
          <Pressable style={styles.testButton} onPress={() => setPremium(true)}>
            <Text style={styles.testButtonText}>{s.testButton}</Text>
          </Pressable>
          <Text style={styles.testNote}>{s.testNote}</Text>
        </>
      )}
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    lockedContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 10 },
    lockedIcon: { fontSize: 40 },
    lockedTitle: { fontSize: 18, fontWeight: '800', color: c.forest, textAlign: 'center' },
    lockedText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', lineHeight: 19 },
    upgradeButton: { backgroundColor: c.coral, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8, alignItems: 'center' },
    annualButton: { backgroundColor: c.coralDark, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8, alignItems: 'center' },
    annualBadge: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', opacity: 0.85, marginBottom: 2 },
    upgradeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    restoreLink: { fontSize: 12, color: c.skyDark, textDecorationLine: 'underline', marginTop: 2 },
    errorText: { fontSize: 12, color: c.coralDark, textAlign: 'center' },
    notConfiguredText: { fontSize: 12, color: c.forestSoft, textAlign: 'center', marginTop: 4 },
    testButton: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, marginTop: 10 },
    testButtonText: { color: c.forest, fontSize: 12, fontWeight: '700' },
    testNote: { fontSize: 10, color: c.forestSoft, textAlign: 'center' },
  });
}
