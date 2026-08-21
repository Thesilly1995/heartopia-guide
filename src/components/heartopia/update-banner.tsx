import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: '🔄 Nieuwe versie beschikbaar',
    text: 'Er is een update met de nieuwste content en verbeteringen.',
    update: 'Nu bijwerken',
    updating: 'Bezig...',
    dismiss: 'Later',
  },
  en: {
    title: '🔄 New version available',
    text: 'There is an update with the latest content and improvements.',
    update: 'Update now',
    updating: 'Working...',
    dismiss: 'Later',
  },
} as const;

/**
 * Toont een dismissible banner zodra er een nieuwe OTA-update klaarstaat.
 * Werkt automatisch en voor iedereen (geen Premium/toestemming nodig), in
 * tegenstelling tot de categorie-pushmeldingen op het Meldingen-scherm — zie
 * docs/push-notifications-setup.md voor de afweging.
 */
export function UpdateBanner() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (__DEV__ || !Updates.isEnabled) return;
    Updates.checkForUpdateAsync()
      .then((result) => setAvailable(result.isAvailable))
      .catch(() => {
        // geen internet, of check mislukt om een andere reden — gewoon stil laten falen
      });
  }, []);

  if (!available || dismissed) return null;

  const onUpdate = async () => {
    setUpdating(true);
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch {
      setUpdating(false);
    }
  };

  return (
    <View style={styles.banner}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.text}>{s.text}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => setDismissed(true)} disabled={updating} hitSlop={6}>
          <Text style={styles.dismissText}>{s.dismiss}</Text>
        </Pressable>
        <Pressable style={styles.updateButton} onPress={onUpdate} disabled={updating}>
          <Text style={styles.updateButtonText}>{updating ? s.updating : s.update}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    banner: {
      backgroundColor: c.disclaimerBg,
      borderBottomWidth: 1,
      borderBottomColor: c.disclaimerBorder,
      padding: 12,
      gap: 8,
    },
    textWrap: { gap: 2 },
    title: { fontSize: 13, fontWeight: '700', color: c.forest },
    text: { fontSize: 11, color: c.forestSoft },
    actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 14 },
    dismissText: { fontSize: 12, fontWeight: '700', color: c.forestSoft },
    updateButton: { backgroundColor: c.coral, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 7 },
    updateButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  });
}
