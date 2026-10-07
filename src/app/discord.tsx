import { useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ZoomableImage } from '@/components/heartopia/zoomable-image';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const DISCORD_IMAGE = require('@/assets/images/discord/discord-community.jpg');
const DISCORD_INVITE_URL = 'https://discord.gg/Nj9HPEEyTG';

const STRINGS = {
  nl: {
    title: 'Discord',
    subtitle: 'Kom gezellig kletsen met de community',
    button: 'Join onze Discord',
    note: 'Alleen voor Nederlandse/Belgische spelers',
  },
  en: {
    title: 'Discord',
    subtitle: 'Come hang out with the community',
    button: 'Join our Discord',
    note: 'Dutch/Belgian players only',
  },
} as const;

export default function DiscordScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language === 'nl' ? 'nl' : 'en'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[COLORS.sky, COLORS.skyDark]} icon="💬" title={s.title} subtitle={s.subtitle} />
      <ScrollView contentContainerStyle={styles.content}>
        <ZoomableImage source={DISCORD_IMAGE} aspectRatio={1} />
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(DISCORD_INVITE_URL)}>
          <Text style={styles.buttonText}>{s.button}</Text>
        </TouchableOpacity>
        <Text style={styles.note}>{s.note}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    content: { padding: 16, gap: 16, flexGrow: 1 },
    button: { backgroundColor: '#5865F2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    note: { fontSize: 12, color: c.forestSoft, textAlign: 'center', marginTop: -8 },
  });
}
