import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    label: '📢 Advertentie',
    note: 'Placeholder — Premium-leden zien straks geen advertenties',
  },
  en: {
    label: '📢 Advertisement',
    note: 'Placeholder — Premium members will not see ads',
  },
} as const;

/**
 * Mock advertentiebanner, vast onderin het scherm (zoals een echte banner-ad-SDK
 * dat ook zou doen). Puur UI-voorbereiding: er is nog geen ad-netwerk aangesloten.
 * Verdwijnt zodra de (test-)premium-status aan staat, zodat je alvast kan zien hoe
 * "premium = reclamevrij" zal aanvoelen.
 */
export function AdBanner() {
  const colors = useHeartopiaColors();
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const { premium } = usePremium();
  const s = STRINGS[language];

  if (premium) return null;

  const styles = makeStyles(colors, insets.bottom);
  return (
    <View style={styles.banner} pointerEvents="none">
      <Text style={styles.label}>{s.label}</Text>
      <Text style={styles.note}>{s.note}</Text>
    </View>
  );
}

function makeStyles(c: ThemeColors, bottomInset: number) {
  return StyleSheet.create({
    banner: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: bottomInset + 6,
      paddingTop: 6,
      alignItems: 'center',
      backgroundColor: c.surfaceSoft,
      borderTopWidth: 1,
      borderTopColor: c.line,
    },
    label: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    note: { fontSize: 9, color: c.forestSoft, marginTop: 1 },
  });
}
