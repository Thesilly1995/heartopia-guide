import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DisclaimerBox } from '@/components/heartopia/disclaimer-box';
import { PremiumLockedView } from '@/components/heartopia/premium-locked';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { ORDERING_MACHINE_IMAGE_MAP } from '@/constants/ordering-machine-images';
import {
  OrderingMachineCategory,
  OrderingMachineCurrency,
  OrderingMachineItem,
  useOrderingMachineCatalogs,
  useOrderingMachineItems,
} from '@/data/ordering-machine';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const CURRENCY_ICON: Record<OrderingMachineCurrency, string> = {
  hearts: '💗',
  coins: '🪙',
  stars: '⭐',
};

const STORAGE_KEY = 'heartopia:ordering-machine:besteld';
const FAVORITES_STORAGE_KEY = 'heartopia:ordering-machine:favorieten';

const STRINGS = {
  nl: {
    title: 'Ordering Machine',
    lockedText: 'Bestel meubels, kleding en fashion-items met tickets uit de Ordering Machine in het stadje.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Prijs nog niet bekend',
    emptyCategory: 'Hier komen binnenkort de algemene spullen uit het spel.',
    disclaimer:
      'Tickets om te bestellen + de betaling bij aflevering (roze hartjes, Coins of paarse sterren), gebaseerd op eigen screenshots uit de Ordering Machine. Tik op een catalogus om die te openen of sluiten. Tik op een item om het af te vinken zodra je het besteld hebt, of op het hartje om het als favoriet te markeren.',
    progressLabel: (done: number, total: number) => `${done}/${total} besteld`,
    favoritesTitle: 'Favorieten',
    favoritesCount: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
    favoritesEmpty: 'Nog geen favorieten — tik op het hartje bij een item om het hier te laten verschijnen.',
  },
  en: {
    title: 'Ordering Machine',
    lockedText: 'Order furniture, clothing and fashion items with tickets from the town\'s Ordering Machine.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Price not known yet',
    emptyCategory: 'General in-game items are coming here soon.',
    disclaimer:
      'Tickets to order + the payment due on arrival (pink hearts, Coins or purple stars), based on own screenshots from the Ordering Machine. Tap a catalog to open or close it. Tap an item to check it off once you\'ve ordered it, or tap the heart to mark it as a favorite.',
    progressLabel: (done: number, total: number) => `${done}/${total} ordered`,
    favoritesTitle: 'Favorites',
    favoritesCount: (n: number) => `${n} item${n === 1 ? '' : 's'}`,
    favoritesEmpty: 'No favorites yet — tap the heart on an item to make it show up here.',
  },
  es: {
    title: 'Ordering Machine',
    lockedText: 'Pide muebles, ropa y artículos de moda con tickets en la Ordering Machine del pueblo.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Precio aún desconocido',
    emptyCategory: 'Aquí llegarán pronto los artículos generales del juego.',
    disclaimer:
      'Tickets para pedir + el pago al recibir (corazones rosas, Coins o estrellas moradas), basado en capturas propias de la Ordering Machine. Toca un catálogo para abrirlo o cerrarlo. Toca un artículo para marcarlo una vez que lo hayas pedido, o toca el corazón para marcarlo como favorito.',
    progressLabel: (done: number, total: number) => `${done}/${total} pedidos`,
    favoritesTitle: 'Favoritos',
    favoritesCount: (n: number) => `${n} artículo${n === 1 ? '' : 's'}`,
    favoritesEmpty: 'Aún no hay favoritos — toca el corazón de un artículo para que aparezca aquí.',
  },
  pt: {
    title: 'Ordering Machine',
    lockedText: 'Peça móveis, roupas e itens de moda com tickets na Ordering Machine da cidade.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Preço ainda desconhecido',
    emptyCategory: 'Os itens gerais do jogo chegarão aqui em breve.',
    disclaimer:
      'Tickets para pedir + o pagamento na entrega (corações rosa, Coins ou estrelas roxas), com base em capturas de tela próprias da Ordering Machine. Toque em um catálogo para abri-lo ou fechá-lo. Toque em um item para marcá-lo assim que você o tiver pedido, ou toque no coração para marcá-lo como favorito.',
    progressLabel: (done: number, total: number) => `${done}/${total} pedidos`,
    favoritesTitle: 'Favoritos',
    favoritesCount: (n: number) => `${n} ${n === 1 ? 'item' : 'itens'}`,
    favoritesEmpty: 'Ainda não há favoritos — toque no coração de um item para ele aparecer aqui.',
  },
  fr: {
    title: 'Ordering Machine',
    lockedText: "Commande des meubles, des vêtements et des articles de mode avec des tickets depuis l'Ordering Machine de la ville.",
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Prix pas encore connu',
    emptyCategory: "Les objets généraux du jeu arriveront bientôt ici.",
    disclaimer:
      "Tickets pour commander + le paiement à la livraison (cœurs roses, Coins ou étoiles violettes), basé sur des captures d'écran personnelles de l'Ordering Machine. Appuie sur un catalogue pour l'ouvrir ou le fermer. Appuie sur un article pour le cocher une fois commandé, ou sur le cœur pour le marquer comme favori.",
    progressLabel: (done: number, total: number) => `${done}/${total} commandés`,
    favoritesTitle: 'Favoris',
    favoritesCount: (n: number) => `${n} article${n === 1 ? '' : 's'}`,
    favoritesEmpty: "Pas encore de favoris — appuie sur le cœur d'un article pour le voir apparaître ici.",
  },
  de: {
    title: 'Ordering Machine',
    lockedText: 'Bestelle Möbel, Kleidung und Fashion-Items mit Tickets aus der Ordering Machine der Stadt.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'Tickets',
    priceUnknown: 'Preis noch nicht bekannt',
    emptyCategory: 'Die allgemeinen Items aus dem Spiel kommen hier bald dazu.',
    disclaimer:
      'Tickets zum Bestellen + die Bezahlung bei Lieferung (rosa Herzen, Coins oder lila Sterne), basierend auf eigenen Screenshots aus der Ordering Machine. Tippe auf einen Katalog, um ihn zu öffnen oder zu schließen. Tippe auf ein Item, um es abzuhaken, sobald du es bestellt hast, oder auf das Herz, um es als Favorit zu markieren.',
    progressLabel: (done: number, total: number) => `${done}/${total} bestellt`,
    favoritesTitle: 'Favoriten',
    favoritesCount: (n: number) => `${n} Artikel`,
    favoritesEmpty: 'Noch keine Favoriten — tippe auf das Herz bei einem Item, damit es hier erscheint.',
  },
} as const;

const CATEGORIES: { key: OrderingMachineCategory; labelKey: 'furniture' | 'clothing' | 'fashion' }[] = [
  { key: 'furniture', labelKey: 'furniture' },
  { key: 'clothing', labelKey: 'clothing' },
  { key: 'fashion', labelKey: 'fashion' },
];

export default function OrderingMachineScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const s = STRINGS[language];
  const { premium } = usePremium();
  const [category, setCategory] = useState<OrderingMachineCategory>('fashion');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [ordered, setOrdered] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [favoritesOpen, setFavoritesOpen] = useState<Record<string, boolean>>({});

  const catalogs = useOrderingMachineCatalogs(category);
  const items = useOrderingMachineItems(category);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        setOrdered(raw ? JSON.parse(raw) : {});
      } catch {
        setOrdered({});
      }
    })();
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        setFavorites(raw ? JSON.parse(raw) : {});
      } catch {
        setFavorites({});
      }
    })();
  }, []);

  const toggleOrdered = async (slug: string) => {
    const updated = { ...ordered, [slug]: !ordered[slug] };
    setOrdered(updated);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const toggleFavorite = async (slug: string) => {
    const updated = { ...favorites, [slug]: !favorites[slug] };
    setFavorites(updated);
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // opslaan mislukt
    }
  };

  const isFavoritesOpen = favoritesOpen[category] ?? false;
  const favoritedItems = items.filter((item) => favorites[item.slug]);

  const renderItemCard = (item: OrderingMachineItem) => {
    const image = ORDERING_MACHINE_IMAGE_MAP[item.slug];
    const isOrdered = !!ordered[item.slug];
    const isFavorite = !!favorites[item.slug];
    return (
      <Pressable key={item.slug} style={styles.card} onPress={() => toggleOrdered(item.slug)}>
        <View style={styles.cardImageWrap}>
          {image ? (
            <Image
              source={image}
              style={[styles.cardImage, isOrdered && styles.cardImageDimmed]}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardImagePlaceholderText}>🎁</Text>
            </View>
          )}
          {isOrdered && (
            <View style={styles.earnedOverlay}>
              <Text style={styles.earnedCheck}>✓</Text>
            </View>
          )}
          <Pressable
            style={styles.favoriteButton}
            hitSlop={6}
            onPress={() => toggleFavorite(item.slug)}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costText}>🎫 {item.ticketCost}</Text>
        </View>
        <View style={styles.costRow}>
          {item.currency && item.currencyCost != null ? (
            <Text style={styles.costText}>
              {CURRENCY_ICON[item.currency]} {item.currencyCost}
            </Text>
          ) : (
            <Text style={styles.costUnknown}>{s.priceUnknown}</Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader
        gradient={[colors.sky, colors.coral]}
        icon="🎫"
        title={s.title}
        tabs={CATEGORIES.map((c) => ({ key: c.key, label: s[c.labelKey] }))}
        activeTab={category}
        onTabChange={(key) => setCategory(key as OrderingMachineCategory)}
      />
      {premium ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DisclaimerBox text={s.disclaimer} />
          <View style={styles.favoritesSection}>
            <Pressable
              style={styles.catalogHeader}
              onPress={() => setFavoritesOpen((prev) => ({ ...prev, [category]: !isFavoritesOpen }))}>
              <Text style={styles.catalogTitle}>❤️ {s.favoritesTitle}</Text>
              <View style={styles.catalogHeaderRight}>
                <Text style={styles.progressText}>{s.favoritesCount(favoritedItems.length)}</Text>
                <Text style={styles.chevron}>{isFavoritesOpen ? '▾' : '▸'}</Text>
              </View>
            </Pressable>
            {isFavoritesOpen && (
              <View style={styles.favoritesBody}>
                {favoritedItems.length === 0 ? (
                  <Text style={styles.emptyText}>{s.favoritesEmpty}</Text>
                ) : (
                  <View style={styles.grid}>{favoritedItems.map((item) => renderItemCard(item))}</View>
                )}
              </View>
            )}
          </View>
          {catalogs.length === 0 && <Text style={styles.emptyText}>{s.emptyCategory}</Text>}
          {catalogs.map((catalog) => {
            const catalogItems = items.filter((item) => item.catalog === catalog);
            const isOpen = expanded[catalog] ?? false;
            return (
              <View key={catalog} style={styles.catalogSection}>
                <Pressable
                  style={styles.catalogHeader}
                  onPress={() => setExpanded((prev) => ({ ...prev, [catalog]: !isOpen }))}>
                  <Text style={styles.catalogTitle}>{catalog}</Text>
                  <View style={styles.catalogHeaderRight}>
                    <Text style={styles.progressText}>
                      {s.progressLabel(
                        catalogItems.filter((item) => ordered[item.slug]).length,
                        catalogItems.length,
                      )}
                    </Text>
                    <Text style={styles.chevron}>{isOpen ? '▾' : '▸'}</Text>
                  </View>
                </Pressable>
                {isOpen && <View style={styles.grid}>{catalogItems.map((item) => renderItemCard(item))}</View>}
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <PremiumLockedView text={s.lockedText} />
      )}
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 12 },
    catalogSection: { gap: 8 },
    catalogHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surfaceSoft,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    catalogTitle: { fontSize: 15, fontWeight: '800', color: c.forest },
    catalogHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    progressText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    chevron: { fontSize: 14, color: c.forestSoft },
    favoritesSection: { gap: 8 },
    favoritesBody: { gap: 8, paddingTop: 2 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    card: {
      width: '31%',
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.line,
      borderRadius: 14,
      padding: 8,
      alignItems: 'center',
      gap: 4,
    },
    cardImageWrap: { width: '100%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden' },
    cardImage: { width: '100%', height: '100%' },
    cardImageDimmed: { opacity: 0.35 },
    cardImagePlaceholder: { backgroundColor: c.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
    cardImagePlaceholderText: { fontSize: 28 },
    earnedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.25)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    earnedCheck: {
      fontSize: 32,
      fontWeight: '900',
      color: '#ffffff',
    },
    favoriteButton: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(255,255,255,0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2,
    },
    favoriteIcon: { fontSize: 12 },
    costRow: { flexDirection: 'row', alignItems: 'center' },
    costText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    costUnknown: { fontSize: 9, fontStyle: 'italic', color: c.forestSoft, textAlign: 'center' },
    emptyText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', marginTop: 24 },
  });
}
