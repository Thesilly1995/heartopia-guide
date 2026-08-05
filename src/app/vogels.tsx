import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { BIRDS } from '@/data/birds';

export default function VogelsScreen() {
  return (
    <HobbyListScreen
      title="Vogels"
      icon="🐦"
      items={BIRDS}
      gradient={[COLORS.sky, COLORS.forestSoft]}
      storageKey="vogels"
    />
  );
}
