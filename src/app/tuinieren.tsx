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
      title={{ nl: 'Tuinieren', en: 'Gardening', es: 'Jardinería', pt: 'Jardinagem', fr: 'Jardinage', de: 'Gärtnern' }[language]}
      icon="🌱"
      gradient={[COLORS.forestSoft, COLORS.yellow]}
      storageKey="tuinieren"
      subTabs={[
        { key: 'gewassen', label: { nl: 'Gewassen', en: 'Crops', es: 'Cultivos', pt: 'Cultivos', fr: 'Cultures', de: 'Anbauprodukte' }[language], items: crops },
        { key: 'bloemen', label: { nl: 'Bloemen', en: 'Flowers', es: 'Flores', pt: 'Flores', fr: 'Fleurs', de: 'Blumen' }[language], items: flowers },
      ]}
    />
  );
}
