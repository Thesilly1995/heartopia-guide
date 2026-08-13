import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { Dimensions, ImageSourcePropType, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

export interface MapPin {
  num: number;
  x: number;
  y: number;
}

const STRINGS = {
  nl: { hint: '🔍 Tik om te vergroten' },
  en: { hint: '🔍 Tap to enlarge' },
} as const;

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
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [zoomed, setZoomed] = useState(false);

  const mapContent = (
    <>
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      {pins.map((pin) => {
        const isChecked = checked[pin.num];
        return (
          <Pressable
            key={pin.num}
            onPress={() => onToggle(pin.num)}
            style={[
              styles.pin,
              { left: `${pin.x}%`, top: `${pin.y}%`, backgroundColor: isChecked ? colors.yellow : pinColor },
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
    </>
  );

  return (
    <>
      <Pressable style={[styles.container, { aspectRatio }]} onPress={() => setZoomed(true)}>
        {mapContent}
        {pins.length > 0 && (
          <View style={styles.hintBadge}>
            <Text style={styles.hintText}>{s.hint}</Text>
          </View>
        )}
      </Pressable>

      <Modal visible={zoomed} animationType="fade" onRequestClose={() => setZoomed(false)}>
        <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
          <Pressable style={styles.closeButton} onPress={() => setZoomed(false)}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
          <ScrollView
            style={styles.modalScroll}
            contentContainerStyle={styles.modalScrollContent}
            maximumZoomScale={4}
            minimumZoomScale={1}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}>
            <View style={[styles.modalMap, { aspectRatio, width: Dimensions.get('window').width }]}>{mapContent}</View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    container: { width: '100%', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: c.line, backgroundColor: c.bg },
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
    emptyOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: c.card + 'CC', alignItems: 'center', justifyContent: 'center', padding: 20 },
    emptyText: { fontSize: 13, fontWeight: '700', color: c.forest, textAlign: 'center' },
    hintBadge: { position: 'absolute', right: 8, bottom: 8, backgroundColor: '#000000AA', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4 },
    hintText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
    modalSafeArea: { flex: 1, backgroundColor: '#000000' },
    closeButton: {
      position: 'absolute',
      top: 12,
      right: 12,
      zIndex: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: '#000000AA',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    modalScroll: { flex: 1 },
    modalScrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
    modalMap: { position: 'relative' },
  });
}
