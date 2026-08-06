import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useInsects } from '@/data/insects';
import { useLanguage } from '@/hooks/use-language';

export default function InsectenScreen() {
  const insects = useInsects();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={language === 'en' ? 'Insects' : 'Insecten'}
      icon="🦋"
      items={insects}
      gradient={[COLORS.forestSoft, COLORS.sky]}
      storageKey="insecten"
    />
  );
}
