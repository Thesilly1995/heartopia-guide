import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useCrops } from '@/data/crops';
import { useFlowers } from '@/data/flowers';
import { useLanguage } from '@/hooks/use-language';

export default function TuinierenScreen() {
  const crops = useCrops();
  const flowers = useFlowers();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={language === 'en' ? 'Gardening' : 'Tuinieren'}
      icon="🌱"
      gradient={[COLORS.forestSoft, COLORS.yellow]}
      storageKey="tuinieren"
      subTabs={[
        { key: 'gewassen', label: language === 'en' ? 'Crops' : 'Gewassen', items: crops },
        { key: 'bloemen', label: language === 'en' ? 'Flowers' : 'Bloemen', items: flowers },
      ]}
    />
  );
}
