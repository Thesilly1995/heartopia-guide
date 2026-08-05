import { StyleSheet, Text } from 'react-native';

import { COLORS } from '@/constants/heartopia-colors';

export function DisclaimerBox({ text, warning }: { text: string; warning?: boolean }) {
  return <Text style={[styles.box, warning && styles.warning]}>{text}</Text>;
}

const styles = StyleSheet.create({
  box: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFBEF',
    borderWidth: 1,
    borderColor: '#FBEBBD',
    color: COLORS.forestSoft,
    fontSize: 11,
  },
  warning: {
    backgroundColor: '#FFF6DC',
    borderColor: '#F5E5A8',
  },
});
