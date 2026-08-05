import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { RECIPES } from '@/data/recipes';

export default function KokenScreen() {
  return (
    <HobbyListScreen
      title="Koken"
      icon="🍳"
      items={RECIPES}
      gradient={[COLORS.coral, COLORS.yellow]}
      storageKey="koken"
    />
  );
}
