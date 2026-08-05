import { Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/heartopia-colors';

export function LevelStepper({ value, max, onSet }: { value: number; max: number; onSet: (n: number) => void }) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={() => onSet(Math.max(0, value - 1))} hitSlop={6}>
        <Text style={styles.buttonText}>−</Text>
      </Pressable>
      <Text style={styles.value}>
        Lv.{value}/{max}
      </Text>
      <Pressable style={styles.button} onPress={() => onSet(Math.min(max, value + 1))} hitSlop={6}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  button: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#EAF4F4', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: COLORS.skyDark, fontWeight: '700', fontSize: 14 },
  value: { fontSize: 13, fontWeight: '700', color: COLORS.forest, width: 56, textAlign: 'center' },
});
