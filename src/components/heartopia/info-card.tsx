import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/heartopia-colors';

export function InfoCard({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <View style={[styles.box, full && styles.full]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexBasis: '47%', flexGrow: 1, backgroundColor: '#F5FAF3', borderRadius: 10, padding: 8 },
  full: { flexBasis: '100%' },
  label: { fontSize: 11, fontWeight: '700', color: COLORS.forest },
  value: { fontSize: 12, color: COLORS.forestSoft, marginTop: 2 },
});
