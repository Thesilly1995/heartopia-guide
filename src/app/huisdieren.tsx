import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { useCatSafeFish } from '@/data/fish';
import { useDogSafeRecipes } from '@/data/recipes';
import { useDogSafeWildFruit } from '@/data/wild-fruit';
import { useDogSafeWildMushrooms } from '@/data/wild-mushrooms';
import { Language, useLanguage } from '@/hooks/use-language';

const BONDS_KEY = 'heartopia:huisdieren:vriendschap';
const ACTIONS_KEY = 'heartopia:huisdieren:acties';
const FEEDING_KEY = 'heartopia:huisdieren:voeding-items';
const NAMES_KEY = 'heartopia:huisdieren:namen';
const TRIED_DISHES_KEY = 'heartopia:huisdieren:geprobeerde-gerechten';

interface FeedingEntry {
  text: string;
  favorite: boolean;
}

const DOGS_NOTE = {
  nl: 'Er zijn 37 hondenrassen in het spel — hier staan de bevestigde rassen. We vullen de lijst aan zodra er meer data bekend is. Let op: het favoriete eten verschilt per individuele hond, niet per ras.',
  en: "There are 37 dog breeds in the game — these are the confirmed breeds. We'll add more as data becomes known. Note: favorite food differs per individual dog, not per breed.",
  es: 'Hay 37 razas de perros en el juego — estas son las razas confirmadas. Añadiremos más a medida que haya nuevos datos disponibles. Ten en cuenta: la comida favorita varía según cada perro individual, no según la raza.',
  pt: 'Existem 37 raças de cachorro no jogo — estas são as raças confirmadas. Vamos adicionar mais conforme novos dados forem conhecidos. Atenção: a comida favorita varia por cachorro individual, não por raça.',
  fr: "Il y a 37 races de chiens dans le jeu — voici les races confirmées. On complètera la liste dès que plus de données seront connues. Note : la nourriture préférée varie selon chaque chien individuel, pas selon la race.",
  de: 'Es gibt 37 Hunderassen im Spiel — hier stehen die bestätigten Rassen. Wir ergänzen die Liste, sobald mehr Daten bekannt sind. Achtung: Das Lieblingsessen unterscheidet sich pro einzelnem Hund, nicht pro Rasse.',
} as const;

/** Voer uit de winkel (Joan), bevestigd door de gebruiker in-game (sep 2026) — geen recept, dus los van RECIPES_RAW gehouden. */
const PET_FOOD_ITEMS: Record<Language, { cat: { name: string; emoji: string }[]; dog: { name: string; emoji: string }[] }> = {
  nl: { cat: [{ name: 'Kattenvoer', emoji: '🥫' }, { name: 'Universeel Huisdiervoer', emoji: '🥫' }], dog: [{ name: 'Hondenvoer', emoji: '🥫' }, { name: 'Universeel Huisdiervoer', emoji: '🥫' }] },
  en: { cat: [{ name: 'Cat Food', emoji: '🥫' }, { name: 'Universal Pet Food', emoji: '🥫' }], dog: [{ name: 'Dog Food', emoji: '🥫' }, { name: 'Universal Pet Food', emoji: '🥫' }] },
  es: { cat: [{ name: 'Comida para Gatos', emoji: '🥫' }, { name: 'Comida Universal para Mascotas', emoji: '🥫' }], dog: [{ name: 'Comida para Perros', emoji: '🥫' }, { name: 'Comida Universal para Mascotas', emoji: '🥫' }] },
  pt: { cat: [{ name: 'Ração para Gato', emoji: '🥫' }, { name: 'Ração Universal para Animais', emoji: '🥫' }], dog: [{ name: 'Ração para Cachorro', emoji: '🥫' }, { name: 'Ração Universal para Animais', emoji: '🥫' }] },
  fr: { cat: [{ name: 'Nourriture pour chat', emoji: '🥫' }, { name: 'Nourriture universelle pour animaux', emoji: '🥫' }], dog: [{ name: 'Nourriture pour chien', emoji: '🥫' }, { name: 'Nourriture universelle pour animaux', emoji: '🥫' }] },
  de: { cat: [{ name: 'Katzenfutter', emoji: '🥫' }, { name: 'Universelles Tierfutter', emoji: '🥫' }], dog: [{ name: 'Hundefutter', emoji: '🥫' }, { name: 'Universelles Tierfutter', emoji: '🥫' }] },
};

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
    feedingCount: (n: number) => (n === 1 ? '1 item' : `${n} items`),
    feedingHint: 'Schrijf hier op wat je dit dier al hebt gevoerd, en tik op het hartje als het een favoriet blijkt te zijn.',
    feedingPlaceholder: 'Bijv. appel, gegrilde champignon...',
    feedingAdd: 'Toevoegen',
    feedingEmpty: 'Nog niks ingevuld — voeg toe wat je al gevoerd hebt.',
    petNameLabel: 'Naam',
    petNamePlaceholder: 'Naam van je huisdier',
    triedHint: 'Dit zijn de items die katten/honden daadwerkelijk kunnen eten (bevestigd in-game) — favoriete eten verschilt per dier, gebruik dit als aftekenlijst van wat je al geprobeerd hebt. Rauwe gewassen eten ze niet.',
    triedRecipes: 'Gerechten',
    triedPetFood: 'Voer uit de winkel',
    triedFish: 'Vissen',
    triedWildMushrooms: 'Wilde paddenstoelen',
    triedWildFruit: 'Wilde vruchten',
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
    feedingCount: (n: number) => (n === 1 ? '1 item' : `${n} items`),
    feedingHint: "Write down what you've fed this animal, and tap the heart if it turns out to be a favorite.",
    feedingPlaceholder: 'E.g. apple, grilled mushroom...',
    feedingAdd: 'Add',
    feedingEmpty: "Nothing added yet — add what you've already fed.",
    petNameLabel: 'Name',
    petNamePlaceholder: "Your pet's name",
    triedHint: "These are the items cats/dogs can actually eat (confirmed in-game) — favorite food differs per pet, use this as a checklist of what you've already tried. They won't eat raw crops.",
    triedRecipes: 'Dishes',
    triedPetFood: 'Shop food',
    triedFish: 'Fish',
    triedWildMushrooms: 'Wild mushrooms',
    triedWildFruit: 'Wild fruit',
  },
  es: {
    title: 'Dog & Cat Moments',
    cats: 'Gatos',
    dogs: 'Perros',
    adoptionSlots: 'Espacios de adopción por nivel',
    care: 'Cuidado',
    careValue: 'Acariciar, alimentar, lavar, pasar tiempo juntos, trucos, pasear',
    size: 'Tamaño',
    specialAbility: 'Habilidad especial',
    randomTraits: 'La comida favorita y la personalidad varían según cada animal individual — ¡descúbrelo tú mismo!',
    friendshipLevel: 'Nivel de amistad',
    trainedActions: 'Acciones entrenadas',
    feedingList: 'Lista de alimentación',
    feedingCount: (n: number) => (n === 1 ? '1 elemento' : `${n} elementos`),
    feedingHint: 'Anota aquí lo que ya le has dado de comer a este animal, y toca el corazón si resulta ser un favorito.',
    feedingPlaceholder: 'Ej. manzana, champiñón a la parrilla...',
    feedingAdd: 'Añadir',
    feedingEmpty: 'Todavía no has añadido nada — añade lo que ya le has dado de comer.',
    petNameLabel: 'Nombre',
    petNamePlaceholder: 'Nombre de tu mascota',
    triedHint: 'Estos son los alimentos que gatos/perros realmente pueden comer (confirmado en el juego) — la comida favorita varía según cada mascota, úsalo como lista de lo que ya has probado. No comen cultivos crudos.',
    triedRecipes: 'Platos',
    triedPetFood: 'Comida de la tienda',
    triedFish: 'Peces',
    triedWildMushrooms: 'Setas silvestres',
    triedWildFruit: 'Frutas silvestres',
  },
  pt: {
    title: 'Dog & Cat Moments',
    cats: 'Gatos',
    dogs: 'Cachorros',
    adoptionSlots: 'Vagas de adoção por nível',
    care: 'Cuidados',
    careValue: 'Fazer carinho, alimentar, dar banho, passar tempo junto, truques, passear',
    size: 'Tamanho',
    specialAbility: 'Habilidade especial',
    randomTraits: 'Comida favorita e personalidade variam por animal individual — descubra você mesmo!',
    friendshipLevel: 'Nível de amizade',
    trainedActions: 'Ações treinadas',
    feedingList: 'Lista de alimentação',
    feedingCount: (n: number) => (n === 1 ? '1 item' : `${n} itens`),
    feedingHint: 'Anote aqui o que você já deu de comer a este bichinho, e toque no coração se for um favorito.',
    feedingPlaceholder: 'Ex.: maçã, cogumelo grelhado...',
    feedingAdd: 'Adicionar',
    feedingEmpty: 'Nada adicionado ainda — adicione o que você já deu de comer.',
    petNameLabel: 'Nome',
    petNamePlaceholder: 'Nome do seu bichinho',
    triedHint: 'Estes são os itens que gatos/cachorros realmente podem comer (confirmado no jogo) — a comida favorita varia por bichinho, use isso como lista do que você já experimentou. Eles não comem plantações cruas.',
    triedRecipes: 'Pratos',
    triedPetFood: 'Comida da loja',
    triedFish: 'Peixes',
    triedWildMushrooms: 'Cogumelos silvestres',
    triedWildFruit: 'Frutas silvestres',
  },
  fr: {
    title: 'Dog & Cat Moments',
    cats: 'Chats',
    dogs: 'Chiens',
    adoptionSlots: "Places d'adoption par niveau",
    care: 'Soins',
    careValue: 'Caresser, nourrir, laver, passer du temps ensemble, tours, promener',
    size: 'Taille',
    specialAbility: 'Capacité spéciale',
    randomTraits: "La nourriture préférée et la personnalité varient selon chaque animal individuel — découvre-le toi-même !",
    friendshipLevel: "Niveau d'amitié",
    trainedActions: 'Actions entraînées',
    feedingList: "Liste d'alimentation",
    feedingCount: (n: number) => (n === 1 ? '1 élément' : `${n} éléments`),
    feedingHint: "Note ici ce que tu as déjà donné à manger à cet animal, et touche le cœur si ça s'avère être un favori.",
    feedingPlaceholder: 'Ex. pomme, champignon grillé...',
    feedingAdd: 'Ajouter',
    feedingEmpty: "Rien d'ajouté pour l'instant — ajoute ce que tu lui as déjà donné à manger.",
    petNameLabel: 'Nom',
    petNamePlaceholder: 'Nom de ton animal',
    triedHint: "Voici les aliments que les chats/chiens peuvent vraiment manger (confirmé en jeu) — la nourriture préférée varie selon chaque animal, utilise ceci comme une liste de ce que tu as déjà essayé. Ils ne mangent pas de cultures crues.",
    triedRecipes: 'Plats',
    triedPetFood: 'Nourriture du magasin',
    triedFish: 'Poissons',
    triedWildMushrooms: 'Champignons sauvages',
    triedWildFruit: 'Fruits sauvages',
  },
  de: {
    title: 'Dog & Cat Moments',
    cats: 'Katzen',
    dogs: 'Hunde',
    adoptionSlots: 'Adoptionsplätze pro Level',
    care: 'Pflege',
    careValue: 'Streicheln, füttern, waschen, zusammen sein, Tricks, spazieren gehen',
    size: 'Größe',
    specialAbility: 'Besondere Fähigkeit',
    randomTraits: 'Lieblingsessen und Persönlichkeit unterscheiden sich pro einzelnem Tier — finde es selbst heraus!',
    friendshipLevel: 'Freundschaftslevel',
    trainedActions: 'Trainierte Aktionen',
    feedingList: 'Fütterungsliste',
    feedingCount: (n: number) => (n === 1 ? '1 Eintrag' : `${n} Einträge`),
    feedingHint: 'Schreib hier auf, was du diesem Tier schon gefüttert hast, und tippe aufs Herz, wenn es sich als Favorit herausstellt.',
    feedingPlaceholder: 'Z. B. Apfel, gegrillter Pilz...',
    feedingAdd: 'Hinzufügen',
    feedingEmpty: 'Noch nichts eingetragen — füge hinzu, was du ihm schon gefüttert hast.',
    petNameLabel: 'Name',
    petNamePlaceholder: 'Name deines Haustiers',
    triedHint: 'Das sind die Dinge, die Katzen/Hunde wirklich essen können (im Spiel bestätigt) — das Lieblingsessen ist bei jedem Tier anders, nutze dies als Checkliste für das, was du schon ausprobiert hast. Rohe Feldfrüchte fressen sie nicht.',
    triedRecipes: 'Gerichte',
    triedPetFood: 'Futter aus dem Laden',
    triedFish: 'Fische',
    triedWildMushrooms: 'Wildpilze',
    triedWildFruit: 'Wildfrüchte',
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
  const CAT_SAFE_FISH = useCatSafeFish();
  const DOG_SAFE_RECIPES = useDogSafeRecipes();
  const DOG_SAFE_WILD_MUSHROOMS = useDogSafeWildMushrooms();
  const DOG_SAFE_WILD_FRUIT = useDogSafeWildFruit();
  const [tab, setTab] = useState<'cats' | 'dogs'>('cats');
  const petFood = PET_FOOD_ITEMS[language];
  const TRIED_ITEMS = useMemo(
    () =>
      tab === 'cats'
        ? [
            { label: s.triedPetFood, items: petFood.cat },
            { label: s.triedFish, items: CAT_SAFE_FISH },
          ]
        : [
            { label: s.triedPetFood, items: petFood.dog },
            { label: s.triedRecipes, items: DOG_SAFE_RECIPES },
            { label: s.triedWildMushrooms, items: DOG_SAFE_WILD_MUSHROOMS },
            { label: s.triedWildFruit, items: DOG_SAFE_WILD_FRUIT },
          ],
    [tab, s, petFood, CAT_SAFE_FISH, DOG_SAFE_RECIPES, DOG_SAFE_WILD_MUSHROOMS, DOG_SAFE_WILD_FRUIT]
  );
  const [openName, setOpenName] = useState<string | null>(null);
  const [foodOpenName, setFoodOpenName] = useState<string | null>(null);
  const [actionsOpenName, setActionsOpenName] = useState<string | null>(null);
  const [foodInput, setFoodInput] = useState('');
  const [bonds, setBonds] = useState<Record<string, number>>({});
  const [actions, setActions] = useState<Record<string, number>>({});
  const [feeding, setFeeding] = useState<Record<string, FeedingEntry[]>>({});
  const [petNames, setPetNames] = useState<Record<string, string>>({});
  const [triedDishes, setTriedDishes] = useState<Record<string, string[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [bondsRaw, actionsRaw, feedingRaw, namesRaw, triedRaw] = await Promise.all([
          AsyncStorage.getItem(BONDS_KEY),
          AsyncStorage.getItem(ACTIONS_KEY),
          AsyncStorage.getItem(FEEDING_KEY),
          AsyncStorage.getItem(NAMES_KEY),
          AsyncStorage.getItem(TRIED_DISHES_KEY),
        ]);
        setBonds(bondsRaw ? JSON.parse(bondsRaw) : {});
        setActions(actionsRaw ? JSON.parse(actionsRaw) : {});
        setFeeding(feedingRaw ? JSON.parse(feedingRaw) : {});
        setPetNames(namesRaw ? JSON.parse(namesRaw) : {});
        setTriedDishes(triedRaw ? JSON.parse(triedRaw) : {});
      } catch {
        setBonds({});
        setActions({});
        setFeeding({});
        setPetNames({});
        setTriedDishes({});
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

  const saveFeeding = async (updated: Record<string, FeedingEntry[]>) => {
    setFeeding(updated);
    try {
      await AsyncStorage.setItem(FEEDING_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const addFeedingEntry = (name: string) => {
    if (!foodInput.trim()) return;
    const current = feeding[name] || [];
    saveFeeding({ ...feeding, [name]: [...current, { text: foodInput.trim(), favorite: false }] });
    setFoodInput('');
  };

  const toggleFeedingFavorite = (name: string, index: number) => {
    const current = feeding[name] || [];
    const updatedEntries = current.map((entry, i) => (i === index ? { ...entry, favorite: !entry.favorite } : entry));
    saveFeeding({ ...feeding, [name]: updatedEntries });
  };

  const removeFeedingEntry = (name: string, index: number) => {
    const current = feeding[name] || [];
    saveFeeding({ ...feeding, [name]: current.filter((_, i) => i !== index) });
  };

  const setPetName = async (name: string, value: string) => {
    const updated = { ...petNames, [name]: value };
    setPetNames(updated);
    try {
      await AsyncStorage.setItem(NAMES_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const toggleTriedDish = async (name: string, dish: string) => {
    const current = triedDishes[name] || [];
    const updated = {
      ...triedDishes,
      [name]: current.includes(dish) ? current.filter((d) => d !== dish) : [...current, dish],
    };
    setTriedDishes(updated);
    try {
      await AsyncStorage.setItem(TRIED_DISHES_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const items: (CatItem | DogItem)[] = tab === 'cats' ? CATS : DOGS;
  const petActions = tab === 'cats' ? CAT_ACTIONS : DOG_ACTIONS;
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
          setFoodOpenName(null);
          setFoodInput('');
          setExpandedCategory(null);
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
                  <View style={styles.nameRow}>
                    <Text style={styles.nameLabel}>{s.petNameLabel}</Text>
                    <TextInput
                      value={petNames[pet.name] || ''}
                      onChangeText={(text) => setPetName(pet.name, text)}
                      placeholder={s.petNamePlaceholder}
                      placeholderTextColor={colors.forestSoft}
                      style={styles.nameInput}
                    />
                  </View>

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

                  <Pressable
                    style={styles.foodToggleRow}
                    onPress={() => setActionsOpenName(actionsOpenName === pet.name ? null : pet.name)}>
                    <Text style={styles.actionsLabel}>{s.trainedActions}</Text>
                    <View style={styles.foodToggleRight}>
                      <Text style={styles.foodCountText}>{s.feedingCount(petActions.length)}</Text>
                      <Text style={styles.chevron}>{actionsOpenName === pet.name ? '⌄' : '›'}</Text>
                    </View>
                  </Pressable>

                  {actionsOpenName === pet.name && (
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
                  )}

                  <Pressable
                    style={styles.foodToggleRow}
                    onPress={() => {
                      setFoodOpenName(foodOpenName === pet.name ? null : pet.name);
                      setFoodInput('');
                      setExpandedCategory(null);
                    }}>
                    <Text style={styles.actionsLabel}>{s.feedingList}</Text>
                    <View style={styles.foodToggleRight}>
                      <Text style={styles.foodCountText}>{s.feedingCount((feeding[pet.name] || []).length)}</Text>
                      <Text style={styles.chevron}>{foodOpenName === pet.name ? '⌄' : '›'}</Text>
                    </View>
                  </Pressable>

                  {foodOpenName === pet.name && (
                    <View style={styles.foodSection}>
                      <Text style={styles.mutedText}>{s.feedingHint}</Text>

                      <View style={styles.foodAddRow}>
                        <TextInput
                          value={foodInput}
                          onChangeText={setFoodInput}
                          onSubmitEditing={() => addFeedingEntry(pet.name)}
                          placeholder={s.feedingPlaceholder}
                          placeholderTextColor={colors.forestSoft}
                          style={styles.foodInput}
                        />
                        <Pressable style={styles.foodAddButton} onPress={() => addFeedingEntry(pet.name)}>
                          <Text style={styles.foodAddButtonText}>{s.feedingAdd}</Text>
                        </Pressable>
                      </View>

                      {(feeding[pet.name] || []).length === 0 ? (
                        <Text style={styles.mutedText}>{s.feedingEmpty}</Text>
                      ) : (
                        <View style={styles.actionsList}>
                          {(feeding[pet.name] || []).map((entry, index) => (
                            <View key={`${entry.text}-${index}`} style={styles.foodRow}>
                              <Pressable hitSlop={8} onPress={() => toggleFeedingFavorite(pet.name, index)}>
                                <Text style={styles.heartIcon}>{entry.favorite ? '❤️' : '🤍'}</Text>
                              </Pressable>
                              <Text style={styles.foodLabel} numberOfLines={1}>
                                {entry.text}
                              </Text>
                              <Pressable hitSlop={8} onPress={() => removeFeedingEntry(pet.name, index)}>
                                <Text style={styles.foodRemoveText}>✕</Text>
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      )}

                      <Text style={[styles.mutedText, styles.triedIntro]}>{s.triedHint}</Text>

                      {TRIED_ITEMS.map((category) => {
                        const isCategoryOpen = expandedCategory === category.label;
                        return (
                          <View key={category.label}>
                            <Pressable
                              style={styles.foodToggleRow}
                              onPress={() => setExpandedCategory(isCategoryOpen ? null : category.label)}>
                              <Text style={styles.triedToggleText}>{category.label}</Text>
                              <View style={styles.foodToggleRight}>
                                <Text style={styles.foodCountText}>{s.feedingCount(category.items.length)}</Text>
                                <Text style={styles.chevron}>{isCategoryOpen ? '⌄' : '›'}</Text>
                              </View>
                            </Pressable>

                            {isCategoryOpen && (
                              <View style={styles.triedSection}>
                                {category.items.map((food) => {
                                  const tried = (triedDishes[pet.name] || []).includes(food.name);
                                  return (
                                    <Pressable
                                      key={food.name}
                                      style={styles.triedRow}
                                      onPress={() => toggleTriedDish(pet.name, food.name)}>
                                      <View style={[styles.checkbox, tried && styles.checkboxActive]}>
                                        {tried && <Text style={styles.checkmark}>✓</Text>}
                                      </View>
                                      <Text style={styles.triedLabel} numberOfLines={1}>
                                        {food.emoji} {food.name}
                                      </Text>
                                    </Pressable>
                                  );
                                })}
                              </View>
                            )}
                          </View>
                        );
                      })}
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
    foodAddRow: { flexDirection: 'row', gap: 6 },
    foodInput: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, fontSize: 12, color: c.forest, backgroundColor: c.card },
    foodAddButton: { paddingHorizontal: 12, borderRadius: 10, backgroundColor: c.coral, alignItems: 'center', justifyContent: 'center' },
    foodAddButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
    foodRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    heartIcon: { fontSize: 15 },
    foodLabel: { flex: 1, fontSize: 12, color: c.forest },
    foodRemoveText: { fontSize: 13, color: c.forestSoft },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    nameLabel: { fontSize: 12, fontWeight: '700', color: c.forest },
    nameInput: { flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 7, fontSize: 13, color: c.forest, backgroundColor: c.card },
    triedToggleText: { fontSize: 12, fontWeight: '700', color: c.forest },
    triedIntro: { marginTop: 10 },
    triedSection: { marginTop: 6, gap: 8, marginBottom: 4 },
    triedRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, borderRadius: 8, backgroundColor: c.surfaceSoft },
    triedLabel: { flex: 1, fontSize: 12, color: c.forest },
    checkbox: { width: 20, height: 20, borderRadius: 6, backgroundColor: c.card, borderWidth: 1, borderColor: c.line, alignItems: 'center', justifyContent: 'center' },
    checkboxActive: { backgroundColor: c.yellow, borderColor: c.yellow },
    checkmark: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  });
}
