import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useSandSculptures } from '@/data/sand-sculptures';
import { useSnowSculptures } from '@/data/snow-sculptures';
import { useLanguage } from '@/hooks/use-language';

const SAND_DISCLAIMER = {
  nl: 'Je hoeft niets te kopen om te beeldhouwen — materialen (Steen, Kwaliteitshout) verzamel je gratis. Alleen om in level te stijgen koop je Hobby Upgrade Tickets bij Azure, met Wensterren (50 per ticket).',
  en: "You don't need to buy anything to sculpt — materials (Stone, Quality Wood) are gathered for free. Only leveling up requires Hobby Upgrade Tickets from Azure, bought with Wishing Stars (50 per ticket).",
};

const SNOW_DISCLAIMER = {
  nl: 'Sneeuwsculpturen waren onderdeel van de Winter Frost Season (event). De hobby kan nog steeds gedaan worden, maar er zijn maar 4 bevestigde ontwerpen bekend en geen vaste verkoopprijzen — sterrating bepaalt de waarde. Ook hier: materialen zijn gratis, alleen level omhoog kost Wensterren via Hobby Upgrade Tickets.',
  en: 'Snow sculptures were part of the Winter Frost Season (event). The hobby can still be done, but only 4 confirmed designs are known and there are no fixed sell prices — star rating determines the value. Materials are free here too, only leveling up costs Wishing Stars via Hobby Upgrade Tickets.',
};

export default function BeeldhouwenScreen() {
  const sandSculptures = useSandSculptures();
  const snowSculptures = useSnowSculptures();
  const { language } = useLanguage();
  return (
    <HobbyListScreen
      title={language === 'en' ? 'Sculpting' : 'Beeldhouwen'}
      icon="🏖️"
      gradient={[COLORS.yellow, COLORS.sky]}
      storageKey="beeldhouwen"
      subTabs={[
        { key: 'zand', label: language === 'en' ? 'Sand' : 'Zand', items: sandSculptures, disclaimer: SAND_DISCLAIMER[language] },
        { key: 'sneeuw', label: language === 'en' ? 'Snow' : 'Sneeuw', items: snowSculptures, disclaimer: SNOW_DISCLAIMER[language] },
      ]}
    />
  );
}
