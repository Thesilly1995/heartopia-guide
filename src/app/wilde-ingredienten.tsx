import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImageCarousel } from '@/components/heartopia/image-carousel';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { MUSHROOM_LOCATION_ASPECT_RATIO, MUSHROOM_LOCATION_IMAGES } from '@/data/mushroom-locations';
import { useWildFruit } from '@/data/wild-fruit';
import { useWildMaterials } from '@/data/wild-materials';
import { useWildMushrooms } from '@/data/wild-mushrooms';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: { title: 'Wilde Ingrediënten', subtitle: 'Fruit, paddenstoelen & materialen om te rapen', fruit: 'Fruit', mushrooms: 'Paddenstoelen', materials: 'Materialen', energy: 'Energie', locations: '📍 Paddenstoelen-locaties', locationsLocked: 'Alleen voor Premium-leden 👑' },
  en: { title: 'Wild Ingredients', subtitle: 'Fruit, mushrooms & materials to forage', fruit: 'Fruit', mushrooms: 'Mushrooms', materials: 'Materials', energy: 'Energy', locations: '📍 Mushroom locations', locationsLocked: 'Premium members only 👑' },
  es: { title: 'Ingredientes Silvestres', subtitle: 'Fruta, hongos y materiales para recolectar', fruit: 'Fruta', mushrooms: 'Hongos', materials: 'Materiales', energy: 'Energía', locations: '📍 Ubicaciones de hongos', locationsLocked: 'Solo para miembros Premium 👑' },
  pt: { title: 'Ingredientes Selvagens', subtitle: 'Frutas, cogumelos e materiais para coletar', fruit: 'Frutas', mushrooms: 'Cogumelos', materials: 'Materiais', energy: 'Energia', locations: '📍 Localizações de cogumelos', locationsLocked: 'Somente para membros Premium 👑' },
  fr: { title: 'Ingrédients Sauvages', subtitle: 'Fruits, champignons et matériaux à récolter', fruit: 'Fruits', mushrooms: 'Champignons', materials: 'Matériaux', energy: 'Énergie', locations: '📍 Emplacements des champignons', locationsLocked: 'Réservé aux membres Premium 👑' },
  de: { title: 'Wilde Zutaten', subtitle: 'Früchte, Pilze & Materialien zum Sammeln', fruit: 'Früchte', mushrooms: 'Pilze', materials: 'Materialien', energy: 'Energie', locations: '📍 Pilz-Standorte', locationsLocked: 'Nur für Premium-Mitglieder 👑' },
} as const;

export default function WildeIngredientenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const wildFruit = useWildFruit();
  const wildMushrooms = useWildMushrooms();
  const wildMaterials = useWildMaterials();
  const { premium } = usePremium();
  const [tab, setTab] = useState('fruit');
  const [locationsOpen, setLocationsOpen] = useState(false);

  const TABS = [
    { key: 'fruit', label: s.fruit, items: wildFruit },
    { key: 'mushrooms', label: s.mushrooms, items: wildMushrooms },
    { key: 'materials', label: s.materials, items: wildMaterials },
  ];
  const activeItems = TABS.find((t) => t.key === tab)!.items;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#8FBF6E', '#E8A24F']}
        icon="🌿"
        title={s.title}
        subtitle={s.subtitle}
        tabs={TABS}
        activeTab={tab}
        onTabChange={setTab}
      />
      <FlatList
        data={activeItems}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          tab === 'mushrooms' ? (
            <View style={styles.locationsCard}>
              <Pressable
                style={styles.locationsHeader}
                onPress={() => (premium ? setLocationsOpen((v) => !v) : router.push('/dashboard' as never))}>
                <View style={styles.locationsTitleCol}>
                  <Text style={styles.locationsTitle}>{s.locations}</Text>
                  {!premium && <Text style={styles.locationsLockedText}>{s.locationsLocked}</Text>}
                </View>
                <Text style={styles.chevron}>{premium ? (locationsOpen ? '⌄' : '›') : '🔒'}</Text>
              </Pressable>
              {premium && locationsOpen && (
                <View style={styles.locationsBody}>
                  <ImageCarousel sources={MUSHROOM_LOCATION_IMAGES} aspectRatio={MUSHROOM_LOCATION_ASPECT_RATIO} />
                </View>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.emojiBadge}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardSpot}>{item.spot}</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.price}>{item.sellPrice}</Text>
              {item.energy !== '—' && <Text style={styles.energy}>{s.energy}: {item.energy}</Text>}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, marginBottom: 10 },
    emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 20 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: c.forest },
    cardSpot: { fontSize: 12, color: c.forestSoft, marginTop: 2 },
    priceBox: { alignItems: 'flex-end' },
    price: { fontSize: 12, fontWeight: '700', color: c.forest },
    energy: { fontSize: 10, color: c.forestSoft, marginTop: 2 },
    locationsCard: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden', marginBottom: 10 },
    locationsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 14 },
    locationsTitleCol: { flex: 1, gap: 2 },
    locationsTitle: { fontSize: 14, fontWeight: '700', color: c.forest },
    locationsLockedText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    chevron: { fontSize: 16, color: c.forestSoft, width: 18, textAlign: 'center' },
    locationsBody: { paddingHorizontal: 14, paddingBottom: 14 },
  });
}
