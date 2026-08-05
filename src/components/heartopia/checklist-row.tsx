import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/heartopia-colors';

export function ChecklistRow({
  label,
  checked,
  onPress,
  bold,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  bold?: boolean;
}) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>{checked && <Text style={styles.checkmark}>✓</Text>}</View>
      <Text style={[styles.label, bold && styles.labelBold, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.line },
  checkbox: { width: 24, height: 24, borderRadius: 6, backgroundColor: '#F5FAF3', borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: COLORS.yellow, borderColor: COLORS.yellow },
  checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
  label: { flex: 1, fontSize: 14, color: COLORS.forest },
  labelBold: { fontWeight: '700' },
  labelChecked: { color: COLORS.forestSoft, textDecorationLine: 'line-through' },
});
