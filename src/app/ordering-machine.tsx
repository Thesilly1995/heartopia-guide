import { useMemo, useState } from 'react';
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

const STRINGS = {
  nl: {
    title: 'Ordering Machine',
    lockedText: 'Bestel meubels, kleding en fashion-items met tickets uit de Ordering Machine in het stadje.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Prijs nog niet bekend',
    disclaimer:
      'Tickets om te bestellen + de betaling bij aflevering (roze hartjes, Coins of paarse sterren), gebaseerd op eigen screenshots uit de Ordering Machine. Tik op een catalogus om die te openen of sluiten.',
  },
  en: {
    title: 'Ordering Machine',
    lockedText: 'Order furniture, clothing and fashion items with tickets from the town\'s Ordering Machine.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Price not known yet',
    disclaimer:
      'Tickets to order + the payment due on arrival (pink hearts, Coins or purple stars), based on own screenshots from the Ordering Machine. Tap a catalog to open or close it.',
  },
  es: {
    title: 'Ordering Machine',
    lockedText: 'Pide muebles, ropa y artículos de moda con tickets en la Ordering Machine del pueblo.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Precio aún desconocido',
    disclaimer:
      'Tickets para pedir + el pago al recibir (corazones rosas, Coins o estrellas moradas), basado en capturas propias de la Ordering Machine. Toca un catálogo para abrirlo o cerrarlo.',
  },
  pt: {
    title: 'Ordering Machine',
    lockedText: 'Peça móveis, roupas e itens de moda com tickets na Ordering Machine da cidade.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Preço ainda desconhecido',
    disclaimer:
      'Tickets para pedir + o pagamento na entrega (corações rosa, Coins ou estrelas roxas), com base em capturas de tela próprias da Ordering Machine. Toque em um catálogo para abri-lo ou fechá-lo.',
  },
  fr: {
    title: 'Ordering Machine',
    lockedText: "Commande des meubles, des vêtements et des articles de mode avec des tickets depuis l'Ordering Machine de la ville.",
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'tickets',
    priceUnknown: 'Prix pas encore connu',
    disclaimer:
      "Tickets pour commander + le paiement à la livraison (cœurs roses, Coins ou étoiles violettes), basé sur des captures d'écran personnelles de l'Ordering Machine. Appuie sur un catalogue pour l'ouvrir ou le fermer.",
  },
  de: {
    title: 'Ordering Machine',
    lockedText: 'Bestelle Möbel, Kleidung und Fashion-Items mit Tickets aus der Ordering Machine der Stadt.',
    furniture: 'Furniture',
    clothing: 'Clothing',
    fashion: 'Fashion',
    ticketLabel: 'Tickets',
    priceUnknown: 'Preis noch nicht bekannt',
    disclaimer:
      'Tickets zum Bestellen + die Bezahlung bei Lieferung (rosa Herzen, Coins oder lila Sterne), basierend auf eigenen Screenshots aus der Ordering Machine. Tippe auf einen Katalog, um ihn zu öffnen oder zu schließen.',
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
  const [category, setCategory] = useState<OrderingMachineCategory>('furniture');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const catalogs = useOrderingMachineCatalogs(category);
  const items = useOrderingMachineItems(category);

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
          {catalogs.map((catalog) => {
            const catalogItems = items.filter((item) => item.catalog === catalog);
            const isOpen = expanded[catalog] ?? true;
            return (
              <View key={catalog} style={styles.catalogSection}>
                <Pressable
                  style={styles.catalogHeader}
                  onPress={() => setExpanded((prev) => ({ ...prev, [catalog]: !isOpen }))}>
                  <Text style={styles.catalogTitle}>{catalog}</Text>
                  <Text style={styles.chevron}>{isOpen ? '▾' : '▸'}</Text>
                </Pressable>
                {isOpen && (
                  <View style={styles.grid}>
                    {catalogItems.map((item) => {
                      const image = ORDERING_MACHINE_IMAGE_MAP[item.slug];
                      return (
                        <View key={item.slug} style={styles.card}>
                          {image ? (
                            <Image source={image} style={styles.cardImage} resizeMode="contain" />
                          ) : (
                            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                              <Text style={styles.cardImagePlaceholderText}>🎁</Text>
                            </View>
                          )}
                          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
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
                        </View>
                      );
                    })}
                  </View>
                )}
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
    chevron: { fontSize: 14, color: c.forestSoft },
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
    cardImage: { width: '100%', aspectRatio: 1, borderRadius: 10 },
    cardImagePlaceholder: { backgroundColor: c.surfaceSoft, alignItems: 'center', justifyContent: 'center' },
    cardImagePlaceholderText: { fontSize: 28 },
    cardName: { fontSize: 11, fontWeight: '700', color: c.forest, textAlign: 'center', minHeight: 28 },
    costRow: { flexDirection: 'row', alignItems: 'center' },
    costText: { fontSize: 11, fontWeight: '700', color: c.forestSoft },
    costUnknown: { fontSize: 9, fontStyle: 'italic', color: c.forestSoft, textAlign: 'center' },
  });
}
