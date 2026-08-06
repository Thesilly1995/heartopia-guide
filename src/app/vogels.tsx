import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useBirds } from '@/data/birds';
import { useLanguage } from '@/hooks/use-language';

export default function VogelsScreen() {
  const birds = useBirds();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={language === 'en' ? 'Birds' : 'Vogels'}
      icon="🐦"
      items={birds}
      gradient={[COLORS.sky, COLORS.forestSoft]}
      storageKey="vogels"
    />
  );
}
