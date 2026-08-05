import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { INSECTS } from '@/data/insects';

export default function InsectenScreen() {
  return (
    <HobbyListScreen
      title="Insecten"
      icon="🦋"
      items={INSECTS}
      gradient={[COLORS.forestSoft, COLORS.sky]}
      storageKey="insecten"
    />
  );
}
