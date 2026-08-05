import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS } from '@/constants/heartopia-colors';
import { WILD_FRUIT } from '@/data/wild-fruit';
import { WILD_MATERIALS } from '@/data/wild-materials';
import { WILD_MUSHROOMS } from '@/data/wild-mushrooms';

const TABS = [
  { key: 'fruit', label: 'Fruit', items: WILD_FRUIT },
  { key: 'mushrooms', label: 'Paddenstoelen', items: WILD_MUSHROOMS },
  { key: 'materials', label: 'Materialen', items: WILD_MATERIALS },
];

export default function WildeIngredientenScreen() {
  const [tab, setTab] = useState('fruit');
  const activeItems = TABS.find((t) => t.key === tab)!.items;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#8FBF6E', '#E8A24F']}
        icon="🌿"
        title="Wilde Ingrediënten"
        subtitle="Fruit, paddenstoelen & materialen om te rapen"
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
              {item.energy !== '—' && <Text style={styles.energy}>Energie: {item.energy}</Text>}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  listContent: { padding: 16, gap: 10 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, padding: 14, marginBottom: 10 },
  emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5FAF3', alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 20 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.forest },
  cardSpot: { fontSize: 12, color: COLORS.forestSoft, marginTop: 2 },
  priceBox: { alignItems: 'flex-end' },
  price: { fontSize: 12, fontWeight: '700', color: COLORS.forest },
  energy: { fontSize: 10, color: COLORS.forestSoft, marginTop: 2 },
});
