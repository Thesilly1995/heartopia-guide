import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS } from '@/constants/heartopia-colors';

const RAINBOW_DISCLAIMER =
  'De Rainbow-gebeurtenis duurt ~6 uur en de boeketten-locaties zijn steeds anders. Zodra hij actief is, kan je Claude vragen de actuele locaties op te zoeken/toe te voegen — die verschijnen dan hieronder.';

const METEOR_DISCLAIMER =
  'Meteorenregen start willekeurig na 20:00 servertijd en duurt ~6 uur. De ertsplekken zijn steeds anders. Zodra het actief is, kan je Claude vragen de actuele locaties op te zoeken/toe te voegen — die verschijnen dan hieronder.';

export default function RainbowMeteorScreen() {
  const [tab, setTab] = useState<'rainbow' | 'meteor'>('rainbow');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#B78CD8', '#6EC6E8']}
        icon="🌈☄️"
        title="Rainbow & Meteorenregen"
        subtitle="Boeketten & sterrenscherven per gebeurtenis"
        tabs={[
          { key: 'rainbow', label: '🌈 Rainbow' },
          { key: 'meteor', label: '☄️ Meteorenregen' },
        ]}
        activeTab={tab}
        onTabChange={(k) => setTab(k as 'rainbow' | 'meteor')}
      />
      <View style={styles.content}>
        <DisclaimerBox text={tab === 'rainbow' ? RAINBOW_DISCLAIMER : METEOR_DISCLAIMER} warning />
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>{tab === 'rainbow' ? '🌈' : '☄️'}</Text>
          <Text style={styles.emptyText}>Niet actief op dit moment. Zodra dit weer gebeurt, komen de actuele locaties hier te staan.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 16, gap: 12 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', padding: 40, borderRadius: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line, gap: 10 },
  emptyEmoji: { fontSize: 40 },
  emptyText: { fontSize: 13, fontWeight: '700', color: COLORS.forest, textAlign: 'center' },
});
