import { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumLockedView } from '@/components/heartopia/premium-locked';
import { ScreenHeader } from '@/components/heartopia/screen-header';
import { COLORS, ThemeColors, useHeartopiaColors } from '@/constants/heartopia-colors';
import { useNextEventRecipes } from '@/data/next-event-recipes';
import { useLanguage } from '@/hooks/use-language';
import { usePremium } from '@/hooks/use-premium';

const STRINGS = {
  nl: {
    title: 'Volgend Event',
    subtitle: 'Alvast verzamelen voor het volgende event',
    lockedText:
      'Zodra bekend is welke gerechten in het volgende event komen, zie je hier vast welke crops en ingrediënten je kunt gaan verzamelen.',
    disclaimer: 'Dit zijn gerechten van een event dat nog niet gestart is — je kunt ze nog niet koken, maar de ingrediënten alvast verzamelen helpt om er klaar voor te zijn.',
    empty: 'Niks bekend — zodra we weten welke gerechten eraan komen, zie je ze hier.',
  },
  en: {
    title: 'Next Event',
    subtitle: 'Get a head start collecting for the next event',
    lockedText: 'Once we know which recipes are coming in the next event, you will see here which crops and ingredients to start collecting.',
    disclaimer: 'These are recipes from an event that has not started yet — you cannot cook them yet, but collecting the ingredients in advance helps you be ready.',
    empty: 'Nothing known yet — once we know which recipes are coming, they will show up here.',
  },
  es: {
    title: 'Próximo Evento',
    subtitle: 'Adelántate recolectando para el próximo evento',
    lockedText: 'En cuanto sepamos qué recetas llegarán en el próximo evento, verás aquí qué cultivos e ingredientes puedes ir recolectando.',
    disclaimer: 'Estas son recetas de un evento que aún no ha comenzado — todavía no puedes cocinarlas, pero recolectar los ingredientes de antemano te ayuda a estar preparado.',
    empty: 'Nada conocido todavía — en cuanto sepamos qué recetas llegarán, aparecerán aquí.',
  },
  pt: {
    title: 'Próximo Evento',
    subtitle: 'Adiante-se coletando para o próximo evento',
    lockedText: 'Assim que soubermos quais receitas vêm no próximo evento, você verá aqui quais plantações e ingredientes pode começar a coletar.',
    disclaimer: 'Estas são receitas de um evento que ainda não começou — você ainda não pode cozinhá-las, mas coletar os ingredientes com antecedência ajuda a ficar preparado.',
    empty: 'Nada conhecido ainda — assim que soubermos quais receitas vêm, elas aparecerão aqui.',
  },
  fr: {
    title: 'Prochain Événement',
    subtitle: "Prends de l'avance en collectant pour le prochain événement",
    lockedText: "Dès que l'on saura quelles recettes arrivent dans le prochain événement, tu verras ici quelles cultures et quels ingrédients commencer à collecter.",
    disclaimer: "Ce sont des recettes d'un événement qui n'a pas encore commencé — tu ne peux pas encore les cuisiner, mais collecter les ingrédients à l'avance t'aide à être prêt.",
    empty: "Rien de connu pour l'instant — dès que l'on saura quelles recettes arrivent, elles apparaîtront ici.",
  },
  de: {
    title: 'Nächstes Event',
    subtitle: 'Schon mal sammeln für das nächste Event',
    lockedText: 'Sobald bekannt ist, welche Rezepte im nächsten Event kommen, siehst du hier, welche Feldfrüchte und Zutaten du schon sammeln kannst.',
    disclaimer: 'Das sind Rezepte aus einem Event, das noch nicht begonnen hat — du kannst sie noch nicht kochen, aber die Zutaten vorab zu sammeln hilft dir, bereit zu sein.',
    empty: 'Noch nichts bekannt — sobald wir wissen, welche Rezepte kommen, erscheinen sie hier.',
  },
} as const;

export default function NextEventScreen() {
  const colors = useHeartopiaColors();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { language } = useLanguage();
  const { premium } = usePremium();
  const s = STRINGS[language];
  const recipes = useNextEventRecipes();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScreenHeader gradient={[COLORS.coral, COLORS.yellow]} icon="📅" title={s.title} subtitle={s.subtitle} />
      {premium ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={recipes.length > 0 ? <Text style={styles.disclaimerText}>{s.disclaimer}</Text> : null}
          ListEmptyComponent={<Text style={styles.emptyText}>{s.empty}</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.topRow}>
                <View style={styles.emojiBadge}>
                  <Text style={styles.emoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.ingredientRow}>
                {item.ingredients.map((ing) => (
                  <Text key={ing} style={styles.ingredientPill}>
                    {ing}
                  </Text>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <PremiumLockedView text={s.lockedText} />
      )}
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: c.bg },
    listContent: { padding: 16, gap: 10, flexGrow: 1 },
    disclaimerText: { fontSize: 12, color: c.forestSoft, lineHeight: 18, marginBottom: 4 },
    emptyText: { fontSize: 13, color: c.forestSoft, textAlign: 'center', padding: 24, lineHeight: 19 },
    card: { backgroundColor: c.card, borderRadius: 16, borderWidth: 1, borderColor: c.line, padding: 14, gap: 10 },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    emojiBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: c.iconBg, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 18 },
    cardTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: c.forest },
    ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    ingredientPill: { fontSize: 11, color: c.forestSoft, backgroundColor: c.disclaimerBg, borderWidth: 1, borderColor: c.disclaimerBorder, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  });
}
