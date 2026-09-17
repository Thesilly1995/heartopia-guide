import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useRecipes } from '@/data/recipes';
import { useLanguage } from '@/hooks/use-language';

export default function KokenScreen() {
  const recipes = useRecipes();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Koken', en: 'Cooking', es: 'Cocinar', pt: 'Cozinhar' }[language]}
      icon="🍳"
      items={recipes}
      gradient={[COLORS.coral, COLORS.yellow]}
      storageKey="koken"
    />
  );
}
