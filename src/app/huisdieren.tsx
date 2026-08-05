import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/heartopia/info-card';
import { LevelStepper } from '@/components/heartopia/level-stepper';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { CAT_ACTIONS } from '@/data/cat-actions';
import { CatItem, CATS } from '@/data/cats';
import { DOG_ACTIONS } from '@/data/dog-actions';
import { DogItem, DOGS } from '@/data/dogs';

const BONDS_KEY = 'heartopia:huisdieren:vriendschap';
const ACTIONS_KEY = 'heartopia:huisdieren:acties';

const DOGS_NOTE =
  'Er zijn 37 hondenrassen in het spel — hier staan de bevestigde rassen. We vullen de lijst aan zodra er meer data bekend is. Let op: het favoriete eten verschilt per individuele hond, niet per ras.';

export default function HuisdierenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [tab, setTab] = useState<'cats' | 'dogs'>('cats');
  const [openName, setOpenName] = useState<string | null>(null);
  const [bonds, setBonds] = useState<Record<string, number>>({});
  const [actions, setActions] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      try {
        const [bondsRaw, actionsRaw] = await Promise.all([
          AsyncStorage.getItem(BONDS_KEY),
          AsyncStorage.getItem(ACTIONS_KEY),
        ]);
        setBonds(bondsRaw ? JSON.parse(bondsRaw) : {});
        setActions(actionsRaw ? JSON.parse(actionsRaw) : {});
      } catch {
        setBonds({});
        setActions({});
      }
    })();
  }, []);

  const setBond = async (name: string, value: number) => {
    const updated = { ...bonds, [name]: value };
    setBonds(updated);
    try {
      await AsyncStorage.setItem(BONDS_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const setAction = async (name: string, actionKey: string, value: number) => {
    const mapKey = `${name}::${actionKey}`;
    const current = actions[mapKey] || 0;
    const nextValue = value === current ? 0 : value;
    const updated = { ...actions, [mapKey]: nextValue };
    setActions(updated);
    try {
      await AsyncStorage.setItem(ACTIONS_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const items: (CatItem | DogItem)[] = tab === 'cats' ? CATS : DOGS;
  const petActions = tab === 'cats' ? CAT_ACTIONS : DOG_ACTIONS;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#E8A0A8', '#F5C6CC']}
        icon="🐾"
        title="Dog & Cat Moments"
        tabs={[
          { key: 'cats', label: 'Katten' },
          { key: 'dogs', label: 'Honden' },
        ]}
        activeTab={tab}
        onTabChange={(k) => {
          setTab(k as 'cats' | 'dogs');
          setOpenName(null);
        }}
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <View style={styles.infoRow}>
              <InfoCard label="Adoptieslots per level" value={tab === 'cats' ? 'Lv.1 / 2 / 5 / 7 / 9' : 'Lv.1 / 4 / 8'} />
              <InfoCard label="Verzorging" value="Aaien, voeren, wassen, samen zijn, trucjes, wandelen" />
            </View>
            {tab === 'dogs' && (
              <Text style={styles.disclaimer}>{DOGS_NOTE}</Text>
            )}
          </View>
        }
        renderItem={({ item: pet }) => {
          const isOpen = openName === pet.name;
          const size = 'size' in pet ? pet.size : null;
          return (
            <View style={styles.card}>
              <Pressable style={styles.cardHeader} onPress={() => setOpenName(isOpen ? null : pet.name)}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{pet.emoji}</Text>
                </View>
                <View style={styles.cardText}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {pet.name}
                  </Text>
                  {bonds[pet.name] > 0 && <Text style={styles.bondText}>Lv.{bonds[pet.name]}/15</Text>}
                </View>
                <Text style={styles.chevron}>{isOpen ? '⌄' : '›'}</Text>
              </Pressable>

              {isOpen && (
                <View style={styles.cardBody}>
                  {size || pet.ability ? (
                    <View style={styles.detailGrid}>
                      {size && <InfoCard label="Grootte" value={size} />}
                      {pet.ability && <InfoCard label="Speciale eigenschap" value={pet.ability} full />}
                    </View>
                  ) : (
                    <Text style={styles.mutedText}>
                      Favoriete eten en persoonlijkheid verschillen per individueel dier — ontdek het zelf!
                    </Text>
                  )}

                  <View style={styles.bondBox}>
                    <Text style={styles.bondBoxLabel}>Vriendschapsniveau</Text>
                    <LevelStepper value={bonds[pet.name] || 0} max={15} onSet={(n) => setBond(pet.name, n)} />
                  </View>

                  <Text style={styles.actionsLabel}>Getrainde Acties</Text>
                  <View style={styles.actionsList}>
                    {petActions.map((action) => {
                      const mapKey = `${pet.name}::${action.key}`;
                      return (
                        <View key={action.key} style={styles.actionRow}>
                          <Text style={styles.actionLabel} numberOfLines={1}>
                            {action.label}
                          </Text>
                          <StarRow value={actions[mapKey] || 0} onSet={(n) => setAction(pet.name, action.key, n)} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10 },
    headerInfo: { marginBottom: 10, gap: 8 },
    infoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    disclaimer: { padding: 12, borderRadius: 12, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, color: c.forestSoft, fontSize: 11 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, overflow: 'hidden', marginBottom: 10 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    emojiBadge: { width: 44, height: 44, borderRadius: 22, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 20 },
    cardText: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: c.forest },
    bondText: { fontSize: 12, fontWeight: '700', color: c.yellow, marginTop: 2 },
    chevron: { fontSize: 18, color: c.forestSoft },
    cardBody: { paddingHorizontal: 14, paddingBottom: 14 },
    detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    mutedText: { fontSize: 12, color: c.forestSoft },
    bondBox: { marginTop: 10, padding: 10, borderRadius: 10, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    bondBoxLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    actionsLabel: { fontSize: 12, fontWeight: '700', color: c.forest, marginTop: 12, marginBottom: 6 },
    actionsList: { gap: 6 },
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft, gap: 8 },
    actionLabel: { flex: 1, fontSize: 12, color: c.forestSoft },
  });
}
