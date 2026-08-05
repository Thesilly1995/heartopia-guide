import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';

export function DisclaimerBox({ text, warning }: { text: string; warning?: boolean }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return <Text style={[styles.box, warning && styles.warning]}>{text}</Text>;
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    box: {
      padding: 12,
      borderRadius: 12,
      backgroundColor: c.disclaimerBg,
      borderWidth: 1,
      borderColor: c.disclaimerBorder,
      color: c.forestSoft,
      fontSize: 11,
    },
    warning: {
      backgroundColor: c.warningBg,
      borderColor: c.warningBorder,
    },
  });
}
