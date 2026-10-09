import { useState } from 'react';
import { ImageSourcePropType, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';

import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { ZoomableImage } from '@/components/heartopia/zoomable-image';

/**
 * Swipebare set afbeeldingen (paginering + bolletjes-indicator) — elke pagina
 * is een losse `ZoomableImage`, dus tikken op een pagina vergroot 'm nog
 * steeds zoals gewoonlijk. Paginabreedte wordt gemeten i.p.v. aangenomen,
 * zodat dit op elk schermformaat/elke kaartbreedte klopt.
 */
export function ImageCarousel({ sources, aspectRatio }: { sources: ImageSourcePropType[]; aspectRatio: number }) {
  const colors = useHeartopiaColors();
  const styles = makeStyles(colors);
  const [pageWidth, setPageWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setPageWidth(e.nativeEvent.layout.width);
  // `onScroll` i.p.v. alleen `onMomentumScrollEnd` — die laatste vuurt niet
  // betrouwbaar bij wiel-/trackpad-scrollen op web, waardoor de bolletjes-
  // indicator daar zou blijven hangen op de vorige pagina.
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth === 0) return;
    setIndex(Math.round(e.nativeEvent.contentOffset.x / pageWidth));
  };

  return (
    <View onLayout={onLayout}>
      {pageWidth > 0 && (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}>
          {sources.map((source, i) => (
            <View key={i} style={{ width: pageWidth }}>
              <ZoomableImage source={source} aspectRatio={aspectRatio} />
            </View>
          ))}
        </ScrollView>
      )}
      {sources.length > 1 && (
        <View style={styles.dots}>
          {sources.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.line },
    dotActive: { backgroundColor: c.coral, width: 16 },
  });
}
