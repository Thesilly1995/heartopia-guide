import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useWildFruit } from '@/data/wild-fruit';
import { useWildMaterials } from '@/data/wild-materials';
import { useWildMushrooms } from '@/data/wild-mushrooms';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: { title: 'Wilde Ingrediënten', subtitle: 'Fruit, paddenstoelen & materialen om te rapen', fruit: 'Fruit', mushrooms: 'Paddenstoelen', materials: 'Materialen', energy: 'Energie' },
  en: { title: 'Wild Ingredients', subtitle: 'Fruit, mushrooms & materials to forage', fruit: 'Fruit', mushrooms: 'Mushrooms', materials: 'Materials', energy: 'Energy' },
} as const;

export default function WildeIngredientenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const wildFruit = useWildFruit();
  const wildMushrooms = useWildMushrooms();
  const wildMaterials = useWildMaterials();
  const [tab, setTab] = useState('fruit');

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
  });
}
