import { Image } from 'expo-image';
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '@/constants/heartopia-colors';

export interface MapPin {
  num: number;
  x: number;
  y: number;
}

export function PinMap({
  source,
  aspectRatio,
  pins,
  checked,
  onToggle,
  pinColor,
  emptyText,
}: {
  source: ImageSourcePropType;
  aspectRatio: number;
  pins: MapPin[];
  checked: Record<number, boolean>;
  onToggle: (num: number) => void;
  pinColor: string;
  emptyText?: string;
}) {
  return (
    <View style={[styles.container, { aspectRatio }]}>
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      {pins.map((pin) => {
        const isChecked = checked[pin.num];
        return (
          <Pressable
            key={pin.num}
            onPress={() => onToggle(pin.num)}
            style={[
              styles.pin,
              { left: `${pin.x}%`, top: `${pin.y}%`, backgroundColor: isChecked ? COLORS.yellow : pinColor },
            ]}>
            <Text style={styles.pinText}>{isChecked ? '✓' : pin.num}</Text>
          </Pressable>
        );
      })}
      {pins.length === 0 && emptyText && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>{emptyText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.bg },
  pin: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  pinText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  emptyOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  emptyText: { fontSize: 13, fontWeight: '700', color: COLORS.forest, textAlign: 'center' },
});
