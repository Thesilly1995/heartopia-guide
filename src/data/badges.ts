import { useMemo } from 'react';

export interface BadgeItem {
  name: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
}

interface BadgeRaw {
  nameNl: string;
  nameEn: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
}

const BADGES_RAW: BadgeRaw[] = [
  { nameNl: "Nooit met Lege Handen", nameEn: "Never Empty-Handed", emoji: "🎣", hidden: false, iconKey: "never-empty-handed" },
  { nameNl: "Mystieke Visser", nameEn: "Mystic Fisher", emoji: "🎣", hidden: false, iconKey: "mystic-fisher" },
  { nameNl: "Zegen van de School", nameEn: "Shoal's Blessing", emoji: "🎣", hidden: false, iconKey: "shoal-s-blessing" },
  { nameNl: "Sterke Zeeman", nameEn: "Strong Sailor", emoji: "🎣", hidden: false, iconKey: "strong-sailor" },
  { nameNl: "Tweelingvis Fortuin", nameEn: "Twin Fish Fortune", emoji: "🎣", hidden: false, iconKey: "twin-fish-fortune" },
  { nameNl: "Vismachine", nameEn: "Fishing Machine", emoji: "🎣", hidden: false, iconKey: "fishing-machine" },
  { nameNl: "Haaienwaanzin", nameEn: "Shark Frenzy", emoji: "🎣", hidden: false, iconKey: "shark-frenzy" },
  { nameNl: "Scholenroeper", nameEn: "Shoal Caller", emoji: "🎣", hidden: false, iconKey: "shoal-caller" },
  { nameNl: "Sterrenlicht Visser", nameEn: "Starlight Fisher", emoji: "🎣", hidden: false, iconKey: "starlight-fisher" },
  { nameNl: "Legende van het Dorpskoken", nameEn: "Town Cooking Legend", emoji: "🍳", hidden: false, iconKey: "town-cooking-legend" },
  { nameNl: "Snel & Foutloos", nameEn: "Fast & Flawless", emoji: "🍳", hidden: false, iconKey: "fast-flawless" },
  { nameNl: "Groene Vingers", nameEn: "Green Touch", emoji: "🌱", hidden: false, iconKey: "green-touch" },
  { nameNl: "Overvloedige Oogst", nameEn: "Plentiful Harvest", emoji: "🌱", hidden: false, iconKey: "plentiful-harvest" },
  { nameNl: "Regenbooggeluk", nameEn: "Rainbow Luck", emoji: "🌱", hidden: false, iconKey: "rainbow-luck" },
  { nameNl: "Ster-Kattenverzorger", nameEn: "Ace Cat Servant", emoji: "🐱", hidden: false, iconKey: "ace-cat-servant" },
  { nameNl: "Miauw-Miauw Kantine", nameEn: "Meow-Meow Canteen", emoji: "🐱", hidden: false, iconKey: "meow-meow-canteen" },
  { nameNl: "Ster-Hondentrainer", nameEn: "Ace Dog Trainer", emoji: "🐶", hidden: false, iconKey: "ace-dog-trainer" },
  { nameNl: "Hondjes Kantine", nameEn: "Doggie Canteen", emoji: "🐶", hidden: false, iconKey: "doggie-canteen" },
  { nameNl: "Insectencommandant", nameEn: "Insect Commander", emoji: "🦋", hidden: false, iconKey: "insect-commander" },
  { nameNl: "Zwermcommandant", nameEn: "Swarm Commander", emoji: "🦋", hidden: false, iconKey: "swarm-commander" },
  { nameNl: "Insectenoogster", nameEn: "Insect Harvester", emoji: "🦋", hidden: false, iconKey: "insect-harvester" },
  { nameNl: "Zegen van Vijf Insecten", nameEn: "Five Insects Blessing", emoji: "🦋", hidden: false, iconKey: "five-insects-blessing" },
  { nameNl: "Menselijke Insectenlokker", nameEn: "Human Insect Attractor", emoji: "🦋", hidden: false, iconKey: "human-insect-attractor" },
  { nameNl: "Vogelfluisteraar", nameEn: "Bird Whisperer", emoji: "🐦", hidden: false, iconKey: "bird-whisperer" },
  { nameNl: "Wolkenloper", nameEn: "Cloud Walker", emoji: "🐦", hidden: false, iconKey: "cloud-walker" },
  { nameNl: "Harmonie met de Bries", nameEn: "Harmony with Breeze", emoji: "🐦", hidden: false, iconKey: "harmony-with-breeze" },
  { nameNl: "Vrolijk Koor", nameEn: "Joyful Chorus", emoji: "🐦", hidden: false, iconKey: "joyful-chorus" },
  { nameNl: "Beslissend Moment", nameEn: "Decisive Moment", emoji: "🏖️", hidden: false, iconKey: "decisive-moment" },
  { nameNl: "Zandsculptuur Artiest", nameEn: "Sand Sculpture Artist", emoji: "🏖️", hidden: false, iconKey: "sand-sculpture-artist" },
  { nameNl: "Pompoenmonarchie", nameEn: "Pumpkinarchy", emoji: "🎃", hidden: false, iconKey: "pumpkinarchy" },
  { nameNl: "Sneeuwkoning", nameEn: "Snow King", emoji: "❄️", hidden: false, iconKey: "snow-king" },
  { nameNl: "Ocean Cleanup Expert", nameEn: "Ocean Cleanup Expert", emoji: "🌊", hidden: false, iconKey: "ocean-cleanup-expert" },
  { nameNl: "Geen Hoekje Overgeslagen", nameEn: "No Corner Left Behind", emoji: "🌊", hidden: false, iconKey: "no-corner-left-behind" },
  { nameNl: "Gediplomeerd & Klaar", nameEn: "Licensed & Ready", emoji: "🌊", hidden: false, iconKey: "licensed-ready" },
  { nameNl: "Getijden van het Leven", nameEn: "Tides of Life", emoji: "🌊", hidden: false, iconKey: "tides-of-life" },
  { nameNl: "Verzamelaar", nameEn: "Collector", emoji: "🌟", hidden: false, iconKey: "collector" },
  { nameNl: "Raketsponsor", nameEn: "Rocket Sponsor", emoji: "🌟", hidden: false, iconKey: "rocket-sponsor" },
  { nameNl: "D.G. Lid", nameEn: "D.G. Member", emoji: "🌟", hidden: false, iconKey: "d-g-member" },
  { nameNl: "Puzzelartiest", nameEn: "Puzzle Artist", emoji: "🧩", hidden: false, iconKey: "puzzle-artist" },
  { nameNl: "Volhardende Veer", nameEn: "Persistent Quill", emoji: "🌟", hidden: false, iconKey: "persistent-quill" },
  { nameNl: "Gouden Muziek-CD", nameEn: "Golden Music CD", emoji: "🌟", hidden: false, iconKey: "golden-music-cd" },
  { nameNl: "Dierenbuur", nameEn: "Animal Neighbor", emoji: "🦊", hidden: false, iconKey: "animal-neighbor" },
  { nameNl: "Sterrenstof Verzamelaar", nameEn: "Stardust Collector", emoji: "☄️", hidden: false, iconKey: "stardust-collector" },
  { nameNl: "Dierenverzorger", nameEn: "Animal Keeper", emoji: "🦊", hidden: false, iconKey: "animal-keeper" },
  { nameNl: "IJself", nameEn: "Ice Elf", emoji: "🦊", hidden: false, iconKey: "ice-elf" },
  { nameNl: "Voorman Bever", nameEn: "Foreman Beaver", emoji: "🦫", hidden: false, iconKey: "foreman-beaver" },
  { nameNl: "Logistiek Bever", nameEn: "Logistics Beaver", emoji: "🦫", hidden: false, iconKey: "logistics-beaver" },
  { nameNl: "Ideeën Hamster", nameEn: "Idea Hamster", emoji: "🐹", hidden: false, iconKey: "idea-hamster" },
  { nameNl: "Feestbeest", nameEn: "Party Animal", emoji: "🎉", hidden: false, iconKey: "party-animal" },
  { nameNl: "Snelle Start", nameEn: "Quick Start", emoji: "🚀", hidden: false, iconKey: "quick-start" },
  { nameNl: "Scherpschutter Basis", nameEn: "Sharpshooter Basics", emoji: "🎯", hidden: false, iconKey: "sharpshooter-basics" },
  { nameNl: "Samensmelten tot Eén", nameEn: "Merge into One", emoji: "👻", hidden: false, iconKey: "merge-into-one" },
  { nameNl: "Gedurfde Mysterieuze Grimkin", nameEn: "Bold Mysterious Grimkin", emoji: "👻", hidden: false, iconKey: "bold-mysterious-grimkin" },
  { nameNl: "Stroming van het Leven", nameEn: "Current of Life", emoji: "🐋", hidden: false, iconKey: "current-of-life" },
  { nameNl: "Leider Bever", nameEn: "Leader Beaver", emoji: "🦫", hidden: true, iconKey: "leader-beaver" },
  { nameNl: "Mystic Tracker", nameEn: "Mystic Tracker", emoji: "🗺️", hidden: false, iconKey: "mystic-tracker" },
  { nameNl: "Gourmet Diplomaat", nameEn: "Gourmet Diplomat", emoji: "🔒", hidden: true, iconKey: "gourmet-diplomat" },
  { nameNl: "Reparatie-expert", nameEn: "Repair Expert", emoji: "🔒", hidden: true, iconKey: "repair-expert" },
  { nameNl: "Popster", nameEn: "Pop Star", emoji: "🔒", hidden: true, iconKey: "pop-star" },
  { nameNl: "Onsen Maatje", nameEn: "Onsen Buddy", emoji: "🔒", hidden: true, iconKey: "onsen-buddy" },
  { nameNl: "Onder de Meteorenregen", nameEn: "Beneath the Meteor Shower", emoji: "🔒", hidden: true, iconKey: "beneath-the-meteor-shower" },
  { nameNl: "Romantische Schaatser", nameEn: "Romantic Skater", emoji: "🔒", hidden: true, iconKey: "romantic-skater" },
  { nameNl: "Struik Groothandelaar", nameEn: "Bush Wholesaler", emoji: "🌳", hidden: true, iconKey: "bush-wholesaler" },
  { nameNl: "Bestsellende Auteur", nameEn: "Bestselling Author", emoji: "📖", hidden: true, iconKey: "bestselling-author" },
  { nameNl: "Literaire Grootmeester", nameEn: "Great Literary Tycoon", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Zeevis Meester", nameEn: "Sea Fishing Master", emoji: "🎣", hidden: true, iconKey: "sea-fishing-master" },
  { nameNl: "Insectenvangfeest", nameEn: "Insect Catching Party", emoji: "🦋", hidden: true, iconKey: "insect-catching-party" },
  { nameNl: "Regenboogbode", nameEn: "Rainbow Messenger", emoji: "🌈", hidden: true, iconKey: "rainbow-messenger" },
  { nameNl: "Onsen Berg Insectenkoning", nameEn: "Onsen Mountain Insect King", emoji: "🦋", hidden: true, iconKey: "onsen-mountain-insect-king" },
  { nameNl: "Boekenverzamelaar", nameEn: "Book Collector", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Boekenlezer (Astralis)", nameEn: "Book Reader (Astralis)", emoji: "🔒", hidden: true, iconKey: null },
];

export function useBadges(): BadgeItem[] {
  return useMemo(
    () =>
      BADGES_RAW.map((r) => ({
    name: r.nameEn,
    emoji: r.emoji,
    hidden: r.hidden,
    iconKey: r.iconKey,
      })),
    []
  );
}
