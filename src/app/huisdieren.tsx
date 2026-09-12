import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InfoCard } from '@/components/heartopia/info-card';
import { LevelStepper } from '@/components/heartopia/level-stepper';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { StarRow } from '@/components/heartopia/star-row';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useCatActions } from '@/data/cat-actions';
import { CatItem, useCats } from '@/data/cats';
import { useDogActions } from '@/data/dog-actions';
import { DogItem, useDogs } from '@/data/dogs';
import { useCatFoods, useDogFoods } from '@/data/pet-foods';
import { useLanguage } from '@/hooks/use-language';

const BONDS_KEY = 'heartopia:huisdieren:vriendschap';
const ACTIONS_KEY = 'heartopia:huisdieren:acties';
const FED_KEY = 'heartopia:huisdieren:voeding';
const FAVORITE_FOOD_KEY = 'heartopia:huisdieren:favoriet-eten';

const DOGS_NOTE = {
  nl: 'Er zijn 37 hondenrassen in het spel — hier staan de bevestigde rassen. We vullen de lijst aan zodra er meer data bekend is. Let op: het favoriete eten verschilt per individuele hond, niet per ras.',
  en: "There are 37 dog breeds in the game — these are the confirmed breeds. We'll add more as data becomes known. Note: favorite food differs per individual dog, not per breed.",
} as const;

const STRINGS = {
  nl: {
    title: 'Dog & Cat Moments',
    cats: 'Katten',
    dogs: 'Honden',
    adoptionSlots: 'Adoptieslots per level',
    care: 'Verzorging',
    careValue: 'Aaien, voeren, wassen, samen zijn, trucjes, wandelen',
    size: 'Grootte',
    specialAbility: 'Speciale eigenschap',
    randomTraits: 'Favoriete eten en persoonlijkheid verschillen per individueel dier — ontdek het zelf!',
    friendshipLevel: 'Vriendschapsniveau',
    trainedActions: 'Getrainde Acties',
    feedingList: 'Voedingslijst',
    feedingCount: (fed: number, total: number) => `${fed}/${total} gevoerd`,
    feedingHint: 'Vink af wat je al gevoerd hebt, en tik op het hartje bij het favoriete eten van dit dier.',
  },
  en: {
    title: 'Dog & Cat Moments',
    cats: 'Cats',
    dogs: 'Dogs',
    adoptionSlots: 'Adoption slots per level',
    care: 'Care',
    careValue: 'Petting, feeding, washing, hanging out, tricks, walking',
    size: 'Size',
    specialAbility: 'Special ability',
    randomTraits: 'Favorite food and personality differ per individual animal — discover it yourself!',
    friendshipLevel: 'Friendship level',
    trainedActions: 'Trained Actions',
    feedingList: 'Feeding List',
    feedingCount: (fed: number, total: number) => `${fed}/${total} fed`,
    feedingHint: "Check off what you've already fed, and tap the heart on this animal's favorite food.",
  },
} as const;

export default function HuisdierenScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const CAT_ACTIONS = useCatActions();
  const CATS = useCats();
  const DOG_ACTIONS = useDogActions();
  const DOGS = useDogs();
  const CAT_FOODS = useCatFoods();
  const DOG_FOODS = useDogFoods();
  const [tab, setTab] = useState<'cats' | 'dogs'>('cats');
  const [openName, setOpenName] = useState<string | null>(null);
  const [foodOpenName, setFoodOpenName] = useState<string | null>(null);
  const [bonds, setBonds] = useState<Record<string, number>>({});
  const [actions, setActions] = useState<Record<string, number>>({});
  const [fed, setFed] = useState<Record<string, boolean>>({});
  const [favoriteFood, setFavoriteFood] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const [bondsRaw, actionsRaw, fedRaw, favoriteFoodRaw] = await Promise.all([
          AsyncStorage.getItem(BONDS_KEY),
          AsyncStorage.getItem(ACTIONS_KEY),
          AsyncStorage.getItem(FED_KEY),
          AsyncStorage.getItem(FAVORITE_FOOD_KEY),
        ]);
        setBonds(bondsRaw ? JSON.parse(bondsRaw) : {});
        setActions(actionsRaw ? JSON.parse(actionsRaw) : {});
        setFed(fedRaw ? JSON.parse(fedRaw) : {});
        setFavoriteFood(favoriteFoodRaw ? JSON.parse(favoriteFoodRaw) : {});
      } catch {
        setBonds({});
        setActions({});
        setFed({});
        setFavoriteFood({});
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

  const toggleFed = async (name: string, foodKey: string) => {
    const mapKey = `${name}::${foodKey}`;
    const updated = { ...fed, [mapKey]: !fed[mapKey] };
    setFed(updated);
    try {
      await AsyncStorage.setItem(FED_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const toggleFavoriteFood = async (name: string, foodKey: string) => {
    const updated = { ...favoriteFood };
    if (updated[name] === foodKey) {
      delete updated[name];
    } else {
      updated[name] = foodKey;
    }
    setFavoriteFood(updated);
    try {
      await AsyncStorage.setItem(FAVORITE_FOOD_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const items: (CatItem | DogItem)[] = tab === 'cats' ? CATS : DOGS;
  const petActions = tab === 'cats' ? CAT_ACTIONS : DOG_ACTIONS;
  const petFoods = tab === 'cats' ? CAT_FOODS : DOG_FOODS;
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aBonded = (bonds[a.name] || 0) > 0;
        const bBonded = (bonds[b.name] || 0) > 0;
        if (aBonded === bBonded) return 0;
        return aBonded ? -1 : 1;
      }),
    [items, bonds]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={['#E8A0A8', '#F5C6CC']}
        icon="🐾"
        title={s.title}
        tabs={[
          { key: 'cats', label: s.cats },
          { key: 'dogs', label: s.dogs },
        ]}
        activeTab={tab}
        onTabChange={(k) => {
          setTab(k as 'cats' | 'dogs');
          setOpenName(null);
        }}
      />
      <FlatList
        data={sortedItems}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <View style={styles.infoRow}>
              <InfoCard label={s.adoptionSlots} value={tab === 'cats' ? 'Lv.1 / 2 / 5 / 7 / 9' : 'Lv.1 / 4 / 8'} />
              <InfoCard label={s.care} value={s.careValue} />
            </View>
            {tab === 'dogs' && (
              <Text style={styles.disclaimer}>{DOGS_NOTE[language]}</Text>
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
                      {size && <InfoCard label={s.size} value={size} />}
                      {pet.ability && <InfoCard label={s.specialAbility} value={pet.ability} full />}
                    </View>
                  ) : (
                    <Text style={styles.mutedText}>{s.randomTraits}</Text>
                  )}

                  <View style={styles.bondBox}>
                    <Text style={styles.bondBoxLabel}>{s.friendshipLevel}</Text>
                    <LevelStepper value={bonds[pet.name] || 0} max={15} onSet={(n) => setBond(pet.name, n)} />
                  </View>

                  <Text style={styles.actionsLabel}>{s.trainedActions}</Text>
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

                  <Pressable
                    style={styles.foodToggleRow}
                    onPress={() => setFoodOpenName(foodOpenName === pet.name ? null : pet.name)}>
                    <Text style={styles.actionsLabel}>{s.feedingList}</Text>
                    <View style={styles.foodToggleRight}>
                      <Text style={styles.foodCountText}>
                        {s.feedingCount(petFoods.filter((food) => fed[`${pet.name}::${food.key}`]).length, petFoods.length)}
                      </Text>
                      <Text style={styles.chevron}>{foodOpenName === pet.name ? '⌄' : '›'}</Text>
                    </View>
                  </Pressable>

                  {foodOpenName === pet.name && (
                    <View style={styles.foodSection}>
                      <Text style={styles.mutedText}>{s.feedingHint}</Text>
                      <View style={styles.actionsList}>
                        {petFoods.map((food) => {
                          const isFed = fed[`${pet.name}::${food.key}`] || false;
                          const isFavorite = favoriteFood[pet.name] === food.key;
                          return (
                            <View key={food.key} style={styles.foodRow}>
                              <Pressable hitSlop={8} onPress={() => toggleFavoriteFood(pet.name, food.key)}>
                                <Text style={styles.heartIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
                              </Pressable>
                              <Pressable style={styles.foodPressableLabel} onPress={() => toggleFed(pet.name, food.key)}>
                                <View style={[styles.foodCheckbox, isFed && styles.foodCheckboxActive]}>
                                  {isFed && <Text style={styles.foodCheckmark}>✓</Text>}
                                </View>
                                <Text style={[styles.foodLabel, isFed && styles.foodLabelChecked]} numberOfLines={1}>
                                  {food.name}
                                </Text>
                              </Pressable>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  )}
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
    foodToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    foodToggleRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    foodCountText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    foodSection: { marginTop: 6, gap: 8 },
    foodRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    heartIcon: { fontSize: 15 },
    foodPressableLabel: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
    foodCheckbox: { width: 18, height: 18, borderRadius: 5, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    foodCheckboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    foodCheckmark: { fontSize: 10, color: '#FFFFFF', fontWeight: '700' },
    foodLabel: { flex: 1, fontSize: 12, color: c.forest },
    foodLabelChecked: { color: c.forestSoft, textDecorationLine: 'line-through' },
  });
}
