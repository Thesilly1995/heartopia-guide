import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useFish } from '@/data/fish';
import { useLanguage } from '@/hooks/use-language';

export default function VissenScreen() {
  const fish = useFish();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={{ nl: 'Vissen', en: 'Fishing', es: 'Pesca', pt: 'Pesca', fr: 'Pêche', de: 'Angeln' }[language]}
      icon="🎣"
      items={fish}
      gradient={[COLORS.sky, COLORS.coral]}
      storageKey="vissen"
    />
  );
}
