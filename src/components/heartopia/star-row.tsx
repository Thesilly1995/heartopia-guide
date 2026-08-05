import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useHeartopiaColors } from '@/constants/heartopia-colors';

export function StarRow({ value, onSet }: { value: number; onSet: (n: number) => void }) {
  const colors = useHeartopiaColors();
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onSet(n)} hitSlop={6}>
          <Text style={[styles.star, { color: n <= value ? colors.yellow : colors.line }]}>★</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: { fontSize: 18 },
});
