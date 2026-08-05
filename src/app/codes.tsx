import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { CODES } from '@/data/codes';

const STORAGE_KEY = 'heartopia:codes:ingevuld';

const DISCLAIMER =
  'Codes wijzigen regelmatig. Deze lijst is zo actueel als ons laatste onderzoek — vraag me gerust om ze opnieuw op te zoeken als je twijfelt.';

export default function CodesScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [redeemed, setRedeemed] = useState<Record<string, boolean>>({});
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setRedeemed(raw ? JSON.parse(raw) : {});
      } catch {
        setRedeemed({});
      }
    })();
  }, []);

  const toggleRedeemed = async (code: string) => {
    const updated = { ...redeemed, [code]: !redeemed[code] };
    setRedeemed(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const copyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={['#FF8FA3', '#FFB3C1']} icon="🎁" title="Actieve Codes" subtitle="Laatst gecontroleerd: 2 augustus 2026" />
      <FlatList
        data={CODES}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={{ marginBottom: 10 }}>
            <DisclaimerBox text={DISCLAIMER} />
          </View>
        }
        renderItem={({ item: c }) => {
          const isRedeemed = redeemed[c.code];
          const isCopied = copiedCode === c.code;
          return (
            <View style={[styles.card, isRedeemed && styles.cardRedeemed]}>
              <View style={styles.topRow}>
                <Pressable style={styles.codeButton} onPress={() => toggleRedeemed(c.code)}>
                  <View style={[styles.checkbox, isRedeemed && styles.checkboxActive]}>
                    {isRedeemed && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.code, isRedeemed && styles.codeRedeemed]} numberOfLines={1}>
                    {c.code}
                  </Text>
                </Pressable>
                <Pressable style={[styles.copyButton, isCopied && styles.copyButtonActive]} onPress={() => copyCode(c.code)}>
                  <Text style={[styles.copyText, isCopied && styles.copyTextActive]}>
                    {isCopied ? 'Gekopieerd!' : 'Kopiëren'}
                  </Text>
                </Pressable>
              </View>
              <Text style={styles.reward}>{c.reward}</Text>
              <Text style={styles.expires}>Verloopt: {c.expires}</Text>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, marginBottom: 10 },
    cardRedeemed: { opacity: 0.55 },
    topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    codeButton: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
    checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
    code: { fontSize: 16, fontWeight: '700', color: c.forest, flexShrink: 1 },
    codeRedeemed: { textDecorationLine: 'line-through' },
    copyButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: c.chipBg },
    copyButtonActive: { backgroundColor: c.yellow },
    copyText: { fontSize: 10, fontWeight: '700', color: c.skyDark },
    copyTextActive: { color: c.forest },
    reward: { fontSize: 12, color: c.forestSoft, marginTop: 8 },
    expires: { fontSize: 10, color: c.forestSoft, marginTop: 8 },
  });
}
