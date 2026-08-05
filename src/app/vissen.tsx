import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { FISH } from '@/data/fish';

export default function VissenScreen() {
  return (
    <HobbyListScreen
      title="Vissen"
      icon="🎣"
      items={FISH}
      gradient={[COLORS.sky, COLORS.coral]}
      storageKey="vissen"
      hasWeather
    />
  );
}
