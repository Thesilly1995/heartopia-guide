import { StyleSheet, Text } from 'react-native';

import { COLORS, ColorKey } from '@/constants/heartopia-colors';

export function RarityPill({ label, colorKey }: { label: string; colorKey: ColorKey }) {
  const color = COLORS[colorKey] ?? COLORS.forestSoft;
  return (
    <Text style={[styles.pill, { color, borderColor: color }]} numberOfLines={1}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  pill: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
