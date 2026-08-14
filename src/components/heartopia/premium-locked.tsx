import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { getPremiumPrice, isPurchasesConfigured } from '@/constants/purchases';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    lockedTitle: 'Alleen voor Premium-leden',
    buyButton: (price: string | null) => (price ? `Koop Premium (${price}) 👑` : 'Koop Premium 👑'),
    working: 'Bezig...',
    restore: 'Aankopen herstellen',
    purchaseError: 'Aankoop mislukt — probeer het later opnieuw.',
    notConfigured: 'Aankopen zijn nog niet beschikbaar — dit wordt binnenkort geactiveerd.',
    testButton: 'Test-premium aanzetten (alleen dev)',
    testNote: 'Alleen zichtbaar in development — testers zien dit niet.',
  },
  en: {
    lockedTitle: 'Premium members only',
    buyButton: (price: string | null) => (price ? `Buy Premium (${price}) 👑` : 'Buy Premium 👑'),
    working: 'Working...',
    restore: 'Restore purchases',
    purchaseError: 'Purchase failed — please try again later.',
    notConfigured: 'Purchases are not available yet — this will be enabled soon.',
    testButton: 'Enable test premium (dev only)',
    testNote: 'Only visible in development — testers do not see this.',
  },
} as const;

export function PremiumLockedView({ text }: { text: string }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { setPremium, purchasing, purchaseError, purchasePremium, restorePurchases } = usePremium();
  const [price, setPrice] = useState<string | null>(null);

  useEffect(() => {
    getPremiumPrice().then(setPrice);
  }, []);

  return (
    <View style={styles.lockedContent}>
      <Text style={styles.lockedIcon}>🔒</Text>
      <Text style={styles.lockedTitle}>{s.lockedTitle}</Text>
      <Text style={styles.lockedText}>{text}</Text>

      {isPurchasesConfigured ? (
        <>
          <Pressable style={styles.upgradeButton} disabled={purchasing} onPress={purchasePremium}>
            <Text style={styles.upgradeButtonText}>{purchasing ? s.working : s.buyButton(price)}</Text>
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
    upgradeButton: { backgroundColor: c.coral, borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginTop: 8 },
    upgradeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
    restoreLink: { fontSize: 12, color: c.skyDark, textDecorationLine: 'underline', marginTop: 2 },
    errorText: { fontSize: 12, color: c.coralDark, textAlign: 'center' },
    notConfiguredText: { fontSize: 12, color: c.forestSoft, textAlign: 'center', marginTop: 4 },
    testButton: { backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9, marginTop: 10 },
    testButtonText: { color: c.forest, fontSize: 12, fontWeight: '700' },
    testNote: { fontSize: 10, color: c.forestSoft, textAlign: 'center' },
  });
}
