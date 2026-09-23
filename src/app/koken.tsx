import { eventsTabLabel, HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useRecipeEventGroups, useRecipes } from '@/data/recipes';
import { useLanguage } from '@/hooks/use-language';

const ALL_TAB_LABEL = { nl: 'Alle Recepten', en: 'All Recipes', es: 'Todos', pt: 'Todos', fr: 'Tous', de: 'Alle' } as const;

export default function KokenScreen() {
  const recipes = useRecipes();
  const eventGroups = useRecipeEventGroups();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Koken', en: 'Cooking', es: 'Cocinar', pt: 'Cozinhar', fr: 'Cuisine', de: 'Kochen' }[language]}
      icon="🍳"
      gradient={[COLORS.coral, COLORS.yellow]}
      storageKey="koken"
      subTabs={[
        { key: 'all', label: ALL_TAB_LABEL[language], items: recipes },
        { key: 'events', label: eventsTabLabel(language), eventGroups },
      ]}
    />
  );
}
