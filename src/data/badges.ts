import { useMemo } from 'react';

import { useLanguage } from '@/hooks/use-language';

export interface BadgeItem {
  name: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
}

interface BadgeRaw {
  nameNl: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
}

const BADGES_RAW: BadgeRaw[] = [
  { nameNl: "Nooit met Lege Handen", nameEn: "Never Empty-Handed", nameEs: "Nunca con las Manos Vacías", namePt: "Nunca de Mãos Vazias", emoji: "🎣", hidden: false, iconKey: "never-empty-handed" },
  { nameNl: "Mystieke Visser", nameEn: "Mystic Fisher", nameEs: "Pescador Místico", namePt: "Pescador Místico", emoji: "🎣", hidden: false, iconKey: "mystic-fisher" },
  { nameNl: "Zegen van de School", nameEn: "Shoal's Blessing", nameEs: "Bendición del Banco de Peces", namePt: "Bênção do Cardume", emoji: "🎣", hidden: false, iconKey: "shoal-s-blessing" },
  { nameNl: "Sterke Zeeman", nameEn: "Strong Sailor", nameEs: "Marinero Fuerte", namePt: "Marinheiro Forte", emoji: "🎣", hidden: false, iconKey: "strong-sailor" },
  { nameNl: "Tweelingvis Fortuin", nameEn: "Twin Fish Fortune", nameEs: "Fortuna de Peces Gemelos", namePt: "Fortuna dos Peixes Gêmeos", emoji: "🎣", hidden: false, iconKey: "twin-fish-fortune" },
  { nameNl: "Vismachine", nameEn: "Fishing Machine", nameEs: "Máquina de Pescar", namePt: "Máquina de Pescar", emoji: "🎣", hidden: false, iconKey: "fishing-machine" },
  { nameNl: "Haaienwaanzin", nameEn: "Shark Frenzy", nameEs: "Frenesí de Tiburones", namePt: "Frenesi de Tubarões", emoji: "🎣", hidden: false, iconKey: "shark-frenzy" },
  { nameNl: "Scholenroeper", nameEn: "Shoal Caller", nameEs: "Llamador de Bancos", namePt: "Convocador de Cardumes", emoji: "🎣", hidden: false, iconKey: "shoal-caller" },
  { nameNl: "Sterrenlicht Visser", nameEn: "Starlight Fisher", nameEs: "Pescador de Luz Estelar", namePt: "Pescador da Luz das Estrelas", emoji: "🎣", hidden: false, iconKey: "starlight-fisher" },
  { nameNl: "Legende van het Dorpskoken", nameEn: "Town Cooking Legend", nameEs: "Leyenda Culinaria del Pueblo", namePt: "Lenda da Culinária da Cidade", emoji: "🍳", hidden: false, iconKey: "town-cooking-legend" },
  { nameNl: "Snel & Foutloos", nameEn: "Fast & Flawless", nameEs: "Rápido y Perfecto", namePt: "Rápido e Impecável", emoji: "🍳", hidden: false, iconKey: "fast-flawless" },
  { nameNl: "Groene Vingers", nameEn: "Green Touch", nameEs: "Toque Verde", namePt: "Toque Verde", emoji: "🌱", hidden: false, iconKey: "green-touch" },
  { nameNl: "Overvloedige Oogst", nameEn: "Plentiful Harvest", nameEs: "Cosecha Abundante", namePt: "Colheita Farta", emoji: "🌱", hidden: false, iconKey: "plentiful-harvest" },
  { nameNl: "Regenbooggeluk", nameEn: "Rainbow Luck", nameEs: "Suerte de Arcoíris", namePt: "Sorte do Arco-Íris", emoji: "🌱", hidden: false, iconKey: "rainbow-luck" },
  { nameNl: "Ster-Kattenverzorger", nameEn: "Ace Cat Servant", nameEs: "Sirviente Estrella de Gatos", namePt: "Servo Nota Dez dos Gatos", emoji: "🐱", hidden: false, iconKey: "ace-cat-servant" },
  { nameNl: "Miauw-Miauw Kantine", nameEn: "Meow-Meow Canteen", nameEs: "Cantina Miau-Miau", namePt: "Cantina Miau-Miau", emoji: "🐱", hidden: false, iconKey: "meow-meow-canteen" },
  { nameNl: "Ster-Hondentrainer", nameEn: "Ace Dog Trainer", nameEs: "Entrenador Estrella de Perros", namePt: "Treinador Nota Dez de Cães", emoji: "🐶", hidden: false, iconKey: "ace-dog-trainer" },
  { nameNl: "Hondjes Kantine", nameEn: "Doggie Canteen", nameEs: "Cantina de Perritos", namePt: "Cantina dos Cachorrinhos", emoji: "🐶", hidden: false, iconKey: "doggie-canteen" },
  { nameNl: "Insectencommandant", nameEn: "Insect Commander", nameEs: "Comandante de Insectos", namePt: "Comandante de Insetos", emoji: "🦋", hidden: false, iconKey: "insect-commander" },
  { nameNl: "Zwermcommandant", nameEn: "Swarm Commander", nameEs: "Comandante del Enjambre", namePt: "Comandante do Enxame", emoji: "🦋", hidden: false, iconKey: "swarm-commander" },
  { nameNl: "Insectenoogster", nameEn: "Insect Harvester", nameEs: "Recolector de Insectos", namePt: "Coletor de Insetos", emoji: "🦋", hidden: false, iconKey: "insect-harvester" },
  { nameNl: "Zegen van Vijf Insecten", nameEn: "Five Insects Blessing", nameEs: "Bendición de Cinco Insectos", namePt: "Bênção dos Cinco Insetos", emoji: "🦋", hidden: false, iconKey: "five-insects-blessing" },
  { nameNl: "Menselijke Insectenlokker", nameEn: "Human Insect Attractor", nameEs: "Atractor Humano de Insectos", namePt: "Atrator Humano de Insetos", emoji: "🦋", hidden: false, iconKey: "human-insect-attractor" },
  { nameNl: "Vogelfluisteraar", nameEn: "Bird Whisperer", nameEs: "Susurrador de Aves", namePt: "Sussurrador de Pássaros", emoji: "🐦", hidden: false, iconKey: "bird-whisperer" },
  { nameNl: "Wolkenloper", nameEn: "Cloud Walker", nameEs: "Caminante de Nubes", namePt: "Andarilho das Nuvens", emoji: "🐦", hidden: false, iconKey: "cloud-walker" },
  { nameNl: "Harmonie met de Bries", nameEn: "Harmony with Breeze", nameEs: "Armonía con la Brisa", namePt: "Harmonia com a Brisa", emoji: "🐦", hidden: false, iconKey: "harmony-with-breeze" },
  { nameNl: "Vrolijk Koor", nameEn: "Joyful Chorus", nameEs: "Coro Alegre", namePt: "Coro Alegre", emoji: "🐦", hidden: false, iconKey: "joyful-chorus" },
  { nameNl: "Beslissend Moment", nameEn: "Decisive Moment", nameEs: "Momento Decisivo", namePt: "Momento Decisivo", emoji: "🏖️", hidden: false, iconKey: "decisive-moment" },
  { nameNl: "Zandsculptuur Artiest", nameEn: "Sand Sculpture Artist", nameEs: "Artista de Esculturas de Arena", namePt: "Artista de Esculturas de Areia", emoji: "🏖️", hidden: false, iconKey: "sand-sculpture-artist" },
  { nameNl: "Pompoenmonarchie", nameEn: "Pumpkinarchy", nameEs: "Calabazarquía", namePt: "Aboborarquia", emoji: "🎃", hidden: false, iconKey: "pumpkinarchy" },
  { nameNl: "Sneeuwkoning", nameEn: "Snow King", nameEs: "Rey de la Nieve", namePt: "Rei da Neve", emoji: "❄️", hidden: false, iconKey: "snow-king" },
  { nameNl: "Ocean Cleanup Expert", nameEn: "Ocean Cleanup Expert", nameEs: "Experto en Limpieza Oceánica", namePt: "Especialista em Limpeza Oceânica", emoji: "🌊", hidden: false, iconKey: "ocean-cleanup-expert" },
  { nameNl: "Geen Hoekje Overgeslagen", nameEn: "No Corner Left Behind", nameEs: "Ningún Rincón Sin Limpiar", namePt: "Nenhum Cantinho Esquecido", emoji: "🌊", hidden: false, iconKey: "no-corner-left-behind" },
  { nameNl: "Gediplomeerd & Klaar", nameEn: "Licensed & Ready", nameEs: "Licenciado y Listo", namePt: "Licenciado e Pronto", emoji: "🌊", hidden: false, iconKey: "licensed-ready" },
  { nameNl: "Getijden van het Leven", nameEn: "Tides of Life", nameEs: "Mareas de la Vida", namePt: "Marés da Vida", emoji: "🌊", hidden: false, iconKey: "tides-of-life" },
  { nameNl: "Verzamelaar", nameEn: "Collector", nameEs: "Coleccionista", namePt: "Colecionador", emoji: "🌟", hidden: false, iconKey: "collector" },
  { nameNl: "Raketsponsor", nameEn: "Rocket Sponsor", nameEs: "Patrocinador de Cohetes", namePt: "Patrocinador de Foguetes", emoji: "🌟", hidden: false, iconKey: "rocket-sponsor" },
  { nameNl: "D.G. Lid", nameEn: "D.G. Member", nameEs: "Miembro D.G.", namePt: "Membro D.G.", emoji: "🌟", hidden: false, iconKey: "d-g-member" },
  { nameNl: "Puzzelartiest", nameEn: "Puzzle Artist", nameEs: "Artista de Rompecabezas", namePt: "Artista dos Quebra-Cabeças", emoji: "🧩", hidden: false, iconKey: "puzzle-artist" },
  { nameNl: "Volhardende Veer", nameEn: "Persistent Quill", nameEs: "Pluma Persistente", namePt: "Pena Persistente", emoji: "🌟", hidden: false, iconKey: "persistent-quill" },
  { nameNl: "Gouden Muziek-CD", nameEn: "Golden Music CD", nameEs: "CD Musical Dorado", namePt: "CD Musical Dourado", emoji: "🌟", hidden: false, iconKey: "golden-music-cd" },
  { nameNl: "Dierenbuur", nameEn: "Animal Neighbor", nameEs: "Vecino Animal", namePt: "Vizinho Animal", emoji: "🦊", hidden: false, iconKey: "animal-neighbor" },
  { nameNl: "Sterrenstof Verzamelaar", nameEn: "Stardust Collector", nameEs: "Coleccionista de Polvo Estelar", namePt: "Colecionador de Poeira Estelar", emoji: "☄️", hidden: false, iconKey: "stardust-collector" },
  { nameNl: "Dierenverzorger", nameEn: "Animal Keeper", nameEs: "Cuidador de Animales", namePt: "Cuidador de Animais", emoji: "🦊", hidden: false, iconKey: "animal-keeper" },
  { nameNl: "IJself", nameEn: "Ice Elf", nameEs: "Elfo de Hielo", namePt: "Elfo do Gelo", emoji: "🦊", hidden: false, iconKey: "ice-elf" },
  { nameNl: "Voorman Bever", nameEn: "Foreman Beaver", nameEs: "Castor Capataz", namePt: "Castor Capataz", emoji: "🦫", hidden: false, iconKey: "foreman-beaver" },
  { nameNl: "Logistiek Bever", nameEn: "Logistics Beaver", nameEs: "Castor de Logística", namePt: "Castor da Logística", emoji: "🦫", hidden: false, iconKey: "logistics-beaver" },
  { nameNl: "Ideeën Hamster", nameEn: "Idea Hamster", nameEs: "Hámster de Ideas", namePt: "Hamster de Ideias", emoji: "🐹", hidden: false, iconKey: "idea-hamster" },
  { nameNl: "Feestbeest", nameEn: "Party Animal", nameEs: "Animal de Fiesta", namePt: "Animal Festeiro", emoji: "🎉", hidden: false, iconKey: "party-animal" },
  { nameNl: "Snelle Start", nameEn: "Quick Start", nameEs: "Comienzo Rápido", namePt: "Início Rápido", emoji: "🚀", hidden: false, iconKey: "quick-start" },
  { nameNl: "Scherpschutter Basis", nameEn: "Sharpshooter Basics", nameEs: "Fundamentos de Tirador", namePt: "Fundamentos de Atirador", emoji: "🎯", hidden: false, iconKey: "sharpshooter-basics" },
  { nameNl: "Samensmelten tot Eén", nameEn: "Merge into One", nameEs: "Fusión en Uno", namePt: "Fusão em Um", emoji: "👻", hidden: false, iconKey: "merge-into-one" },
  { nameNl: "Gedurfde Mysterieuze Grimkin", nameEn: "Bold Mysterious Grimkin", nameEs: "Grimkin Misterioso y Audaz", namePt: "Grimkin Misterioso e Ousado", emoji: "👻", hidden: false, iconKey: "bold-mysterious-grimkin" },
  { nameNl: "Stroming van het Leven", nameEn: "Current of Life", nameEs: "Corriente de Vida", namePt: "Corrente da Vida", emoji: "🐋", hidden: false, iconKey: "current-of-life" },
  { nameNl: "Leider Bever", nameEn: "Leader Beaver", nameEs: "Castor Líder", namePt: "Castor Líder", emoji: "🦫", hidden: true, iconKey: "leader-beaver" },
  { nameNl: "Mystic Tracker", nameEn: "Mystic Tracker", nameEs: "Rastreador Místico", namePt: "Rastreador Místico", emoji: "🗺️", hidden: false, iconKey: "mystic-tracker" },
  { nameNl: "Gourmet Diplomaat", nameEn: "Gourmet Diplomat", nameEs: "Diplomático Gourmet", namePt: "Diplomata Gourmet", emoji: "🔒", hidden: true, iconKey: "gourmet-diplomat" },
  { nameNl: "Reparatie-expert", nameEn: "Repair Expert", nameEs: "Experto en Reparaciones", namePt: "Especialista em Reparos", emoji: "🔒", hidden: true, iconKey: "repair-expert" },
  { nameNl: "Popster", nameEn: "Pop Star", nameEs: "Estrella del Pop", namePt: "Estrela Pop", emoji: "🔒", hidden: true, iconKey: "pop-star" },
  { nameNl: "Onsen Maatje", nameEn: "Onsen Buddy", nameEs: "Compañero de Onsen", namePt: "Amigo do Onsen", emoji: "🔒", hidden: true, iconKey: "onsen-buddy" },
  { nameNl: "Onder de Meteorenregen", nameEn: "Beneath the Meteor Shower", nameEs: "Bajo la Lluvia de Meteoros", namePt: "Sob a Chuva de Meteoros", emoji: "🔒", hidden: true, iconKey: "beneath-the-meteor-shower" },
  { nameNl: "Romantische Schaatser", nameEn: "Romantic Skater", nameEs: "Patinador Romántico", namePt: "Patinador Romântico", emoji: "🔒", hidden: true, iconKey: "romantic-skater" },
  { nameNl: "Struik Groothandelaar", nameEn: "Bush Wholesaler", nameEs: "Mayorista de Arbustos", namePt: "Atacadista de Arbustos", emoji: "🌳", hidden: true, iconKey: "bush-wholesaler" },
  { nameNl: "Bestsellende Auteur", nameEn: "Bestselling Author", nameEs: "Autor Más Vendido", namePt: "Autor Mais Vendido", emoji: "📖", hidden: true, iconKey: "bestselling-author" },
  { nameNl: "Literaire Grootmeester", nameEn: "Great Literary Tycoon", nameEs: "Gran Magnate Literario", namePt: "Grande Magnata Literário", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Zeevis Meester", nameEn: "Sea Fishing Master", nameEs: "Maestro de la Pesca Marina", namePt: "Mestre da Pesca no Mar", emoji: "🎣", hidden: true, iconKey: "sea-fishing-master" },
  { nameNl: "Insectenvangfeest", nameEn: "Insect Catching Party", nameEs: "Fiesta de Caza de Insectos", namePt: "Festa de Captura de Insetos", emoji: "🦋", hidden: true, iconKey: "insect-catching-party" },
  { nameNl: "Regenboogbode", nameEn: "Rainbow Messenger", nameEs: "Mensajero del Arcoíris", namePt: "Mensageiro do Arco-Íris", emoji: "🌈", hidden: true, iconKey: "rainbow-messenger" },
  { nameNl: "Onsen Berg Insectenkoning", nameEn: "Onsen Mountain Insect King", nameEs: "Rey de los Insectos de la Montaña Onsen", namePt: "Rei dos Insetos da Montanha Onsen", emoji: "🦋", hidden: true, iconKey: "onsen-mountain-insect-king" },
  { nameNl: "Boekenverzamelaar", nameEn: "Book Collector", nameEs: "Coleccionista de Libros", namePt: "Colecionador de Livros", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Boekenlezer (Astralis)", nameEn: "Book Reader (Astralis)", nameEs: "Lector de Libros (Astralis)", namePt: "Leitor de Livros (Astralis)", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Hart Gezet op de Lucht", nameEn: "Heart Set on the Sky", nameEs: "Corazón Puesto en el Cielo", namePt: "Coração Voltado para o Céu", emoji: "🎈", hidden: true, iconKey: "heart-set-on-the-sky" },
  { nameNl: "Opruimmeester", nameEn: "Cleanup Master", nameEs: "Maestro de la Limpieza", namePt: "Mestre da Limpeza", emoji: "🌊", hidden: true, iconKey: "cleanup-master" },
];

export function useBadges(): BadgeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      BADGES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : r.nameEn,
    emoji: r.emoji,
    hidden: r.hidden,
    iconKey: r.iconKey,
      })),
    [language]
  );
}
