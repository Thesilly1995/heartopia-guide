import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { CROPS } from '@/data/crops';
import { FLOWERS } from '@/data/flowers';

export default function TuinierenScreen() {
  return (
    <HobbyListScreen
      title="Tuinieren"
      icon="🌱"
      gradient={[COLORS.forestSoft, COLORS.yellow]}
      storageKey="tuinieren"
      subTabs={[
        { key: 'gewassen', label: 'Gewassen', items: CROPS },
        { key: 'bloemen', label: 'Bloemen', items: FLOWERS },
      ]}
    />
  );
}
