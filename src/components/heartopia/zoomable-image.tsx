import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, ImageSourcePropType, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useLanguage } from '@/hooks/use-language';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

const STRINGS = {
  nl: { hint: '🔍 Tik om te vergroten', reset: 'Zoom resetten' },
  en: { hint: '🔍 Tap to enlarge', reset: 'Reset zoom' },
  es: { hint: '🔍 Toca para ampliar', reset: 'Restablecer zoom' },
  pt: { hint: '🔍 Toque para ampliar', reset: 'Redefinir zoom' },
  fr: { hint: '🔍 Touche pour agrandir', reset: 'Réinitialiser le zoom' },
  de: { hint: '🔍 Tippen zum Vergrößern', reset: 'Zoom zurücksetzen' },
} as const;

/**
 * Afbeelding die volledig (niet uitgesneden) in de kaart past, met tik-om-te-vergroten
 * pinch/pan-modal. Geef `trigger` mee om i.p.v. de standaard-thumbnail een eigen
 * knop te tonen (bv. een kalender-icoon) die dezelfde zoom-modal opent.
 */
export function ZoomableImage({ source, aspectRatio, trigger }: { source: ImageSourcePropType; aspectRatio: number; trigger?: React.ReactNode }) {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const [zoomed, setZoomed] = useState(false);

  return (
    <>
      {trigger ? (
        <Pressable onPress={() => setZoomed(true)}>{trigger}</Pressable>
      ) : (
        <Pressable style={[styles.thumbnail, { aspectRatio }]} onPress={() => setZoomed(true)}>
          <Image source={source} style={StyleSheet.absoluteFill} contentFit="contain" />
          <View style={styles.hintBadge}>
            <Text style={styles.hintText}>{s.hint}</Text>
          </View>
        </Pressable>
      )}

      <Modal visible={zoomed} animationType="fade" onRequestClose={() => setZoomed(false)}>
        <GestureHandlerRootView style={styles.modalSafeArea}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <Pressable style={styles.closeButton} onPress={() => setZoomed(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
            <ZoomableContent aspectRatio={aspectRatio} active={zoomed} resetLabel={s.reset} styles={styles}>
              <Image source={source} style={StyleSheet.absoluteFill} contentFit="contain" />
            </ZoomableContent>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

function ZoomableContent({
  aspectRatio,
  active,
  resetLabel,
  styles,
  children,
}: {
  aspectRatio: number;
  active: boolean;
  resetLabel: string;
  styles: ReturnType<typeof makeStyles>;
  children: React.ReactNode;
}) {
  const width = Dimensions.get('window').width;
  const height = width / aspectRatio;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const [showReset, setShowReset] = useState(false);

  // Zoom/pan resetten telkens de afbeelding opnieuw geopend wordt, zodat je niet
  // per ongeluk ingezoomd blijft vanaf een vorige keer.
  useEffect(() => {
    if (active) {
      scale.value = 1;
      savedScale.value = 1;
      translateX.value = 0;
      translateY.value = 0;
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
      setShowReset(false);
    }
  }, [active, scale, savedScale, translateX, translateY, savedTranslateX, savedTranslateY]);

  const syncResetButton = (nextScale: number) => setShowReset(nextScale > 1.01);

  const clamp = (value: number, limit: number) => {
    'worklet';
    return Math.min(Math.max(value, -limit), limit);
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const next = Math.min(Math.max(savedScale.value * e.scale, MIN_SCALE), MAX_SCALE);
      scale.value = next;
      const maxX = Math.max(0, (width * (next - 1)) / 2);
      const maxY = Math.max(0, (height * (next - 1)) / 2);
      translateX.value = clamp(translateX.value, maxX);
      translateY.value = clamp(translateY.value, maxY);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
      runOnJS(syncResetButton)(scale.value);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value <= 1) return;
      const maxX = Math.max(0, (width * (scale.value - 1)) / 2);
      const maxY = Math.max(0, (height * (scale.value - 1)) / 2);
      translateX.value = clamp(savedTranslateX.value + e.translationX, maxX);
      translateY.value = clamp(savedTranslateY.value + e.translationY, maxY);
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const resetZoom = () => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
    setShowReset(false);
  };

  return (
    <View style={styles.modalScroll}>
      <View style={styles.modalScrollContent}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.modalMap, { width, aspectRatio }, animatedStyle]}>{children}</Animated.View>
        </GestureDetector>
      </View>
      {showReset && (
        <Pressable style={styles.resetZoomButton} onPress={resetZoom}>
          <Text style={styles.resetZoomText}>{resetLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    thumbnail: { width: '100%', borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.line, backgroundColor: c.bg, marginTop: 4 },
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
    modalScrollContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    modalMap: { position: 'relative' },
    resetZoomButton: {
      position: 'absolute',
      bottom: 24,
      alignSelf: 'center',
      backgroundColor: '#000000AA',
      borderRadius: 999,
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    resetZoomText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  });
}
