import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

export function InfoCard({ label, value, full }: { label: string; value: string; full?: boolean }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={[styles.box, full && styles.full]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    box: { flexBasis: '47%', flexGrow: 1, backgroundColor: c.surfaceSoft, borderRadius: 10, padding: 8 },
    full: { flexBasis: '100%' },
    label: { fontSize: 11, fontWeight: '700', color: c.forest },
    value: { fontSize: 12, color: c.forestSoft, marginTop: 2 },
  });
}
