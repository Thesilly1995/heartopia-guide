import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

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
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>{checked && <Text style={styles.checkmark}>✓</Text>}</View>
      <Text style={[styles.label, bold && styles.labelBold, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: c.card, borderWidth: 1, borderColor: c.line },
    checkbox: { width: 24, height: 24, borderRadius: 6, backgroundColor: c.surfaceSoft, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 13, color: '#FFFFFF', fontWeight: '700' },
    label: { flex: 1, fontSize: 14, color: c.forest },
    labelBold: { fontWeight: '700' },
    labelChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
