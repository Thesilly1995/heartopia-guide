import { HobbyListScreen } from '@/components/heartopia/hobby-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { SAND_SCULPTURES } from '@/data/sand-sculptures';
import { SNOW_SCULPTURES } from '@/data/snow-sculptures';

const SAND_DISCLAIMER =
  'Je hoeft niets te kopen om te beeldhouwen — materialen (Steen, Kwaliteitshout) verzamel je gratis. Alleen om in level te stijgen koop je Hobby Upgrade Tickets bij Azure, met Wensterren (50 per ticket).';

const SNOW_DISCLAIMER =
  'Sneeuwsculpturen waren onderdeel van de Winter Frost Season (event). De hobby kan nog steeds gedaan worden, maar er zijn maar 4 bevestigde ontwerpen bekend en geen vaste verkoopprijzen — sterrating bepaalt de waarde. Ook hier: materialen zijn gratis, alleen level omhoog kost Wensterren via Hobby Upgrade Tickets.';

export default function BeeldhouwenScreen() {
  return (
    <HobbyListScreen
      title="Beeldhouwen"
      icon="🏖️"
      gradient={[COLORS.yellow, COLORS.sky]}
      storageKey="beeldhouwen"
      subTabs={[
        { key: 'zand', label: 'Zand', items: SAND_SCULPTURES, disclaimer: SAND_DISCLAIMER },
        { key: 'sneeuw', label: 'Sneeuw', items: SNOW_SCULPTURES, disclaimer: SNOW_DISCLAIMER },
      ]}
    />
  );
}
