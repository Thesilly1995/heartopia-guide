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
  nameFr: string;
  nameDe: string;
  emoji: string;
  hidden: boolean;
  iconKey: string | null;
}

const BADGES_RAW: BadgeRaw[] = [
  { nameNl: "Nooit met Lege Handen", nameEn: "Never Empty-Handed", nameEs: "Nunca con las Manos Vacías", namePt: "Nunca de Mãos Vazias", nameFr: "Jamais les mains vides", nameDe: "Nie mit leeren Händen", emoji: "🎣", hidden: false, iconKey: "never-empty-handed" },
  { nameNl: "Mystieke Visser", nameEn: "Mystic Fisher", nameEs: "Pescador Místico", namePt: "Pescador Místico", nameFr: "Le pêcheur mystique", nameDe: "Mystischer Fischer", emoji: "🎣", hidden: false, iconKey: "mystic-fisher" },
  { nameNl: "Zegen van de School", nameEn: "Shoal's Blessing", nameEs: "Bendición del Banco de Peces", namePt: "Bênção do Cardume", nameFr: "La bénédiction du banc de poissons", nameDe: "Segen des Schwarms", emoji: "🎣", hidden: false, iconKey: "shoal-s-blessing" },
  { nameNl: "Sterke Zeeman", nameEn: "Strong Sailor", nameEs: "Marinero Fuerte", namePt: "Marinheiro Forte", nameFr: "Le marin courageux", nameDe: "Starker Seemann", emoji: "🎣", hidden: false, iconKey: "strong-sailor" },
  { nameNl: "Tweelingvis Fortuin", nameEn: "Twin Fish Fortune", nameEs: "Fortuna de Peces Gemelos", namePt: "Fortuna dos Peixes Gêmeos", nameFr: "La chance des poissons jumeaux", nameDe: "Glück der Zwillingsfische", emoji: "🎣", hidden: false, iconKey: "twin-fish-fortune" },
  { nameNl: "Vismachine", nameEn: "Fishing Machine", nameEs: "Máquina de Pescar", namePt: "Máquina de Pescar", nameFr: "La machine à pêcher", nameDe: "Fischmaschine", emoji: "🎣", hidden: false, iconKey: "fishing-machine" },
  { nameNl: "Haaienwaanzin", nameEn: "Shark Frenzy", nameEs: "Frenesí de Tiburones", namePt: "Frenesi de Tubarões", nameFr: "La folie des requins", nameDe: "Haienwahnsinn", emoji: "🎣", hidden: false, iconKey: "shark-frenzy" },
  { nameNl: "Scholenroeper", nameEn: "Shoal Caller", nameEs: "Llamador de Bancos", namePt: "Convocador de Cardumes", nameFr: "L'appelant des bancs de poissons", nameDe: "Schwarmrufer", emoji: "🎣", hidden: false, iconKey: "shoal-caller" },
  { nameNl: "Sterrenlicht Visser", nameEn: "Starlight Fisher", nameEs: "Pescador de Luz Estelar", namePt: "Pescador da Luz das Estrelas", nameFr: "Pêcheur à la Lueur des Étoiles", nameDe: "Sternenlicht-Fischer", emoji: "🎣", hidden: false, iconKey: "starlight-fisher" },
  { nameNl: "Legende van het Dorpskoken", nameEn: "Town Cooking Legend", nameEs: "Leyenda Culinaria del Pueblo", namePt: "Lenda da Culinária da Cidade", nameFr: "Légende de la Cuisine du Village", nameDe: "Legende des Dorfkochens", emoji: "🍳", hidden: false, iconKey: "town-cooking-legend" },
  { nameNl: "Snel & Foutloos", nameEn: "Fast & Flawless", nameEs: "Rápido y Perfecto", namePt: "Rápido e Impecável", nameFr: "Rapide et Sans Faute", nameDe: "Schnell & Fehlerfrei", emoji: "🍳", hidden: false, iconKey: "fast-flawless" },
  { nameNl: "Groene Vingers", nameEn: "Green Touch", nameEs: "Toque Verde", namePt: "Toque Verde", nameFr: "Pouce Vert", nameDe: "Grüner Daumen", emoji: "🌱", hidden: false, iconKey: "green-touch" },
  { nameNl: "Overvloedige Oogst", nameEn: "Plentiful Harvest", nameEs: "Cosecha Abundante", namePt: "Colheita Farta", nameFr: "Récolte Abondante", nameDe: "Reichhaltige Ernte", emoji: "🌱", hidden: false, iconKey: "plentiful-harvest" },
  { nameNl: "Regenbooggeluk", nameEn: "Rainbow Luck", nameEs: "Suerte de Arcoíris", namePt: "Sorte do Arco-Íris", nameFr: "Bonheur Arc-en-ciel", nameDe: "Regenbogen-Glück", emoji: "🌱", hidden: false, iconKey: "rainbow-luck" },
  { nameNl: "Ster-Kattenverzorger", nameEn: "Ace Cat Servant", nameEs: "Sirviente Estrella de Gatos", namePt: "Servo Nota Dez dos Gatos", nameFr: "Soigneur de Chats Étoilés", nameDe: "Stern-Katzenpfleger", emoji: "🐱", hidden: false, iconKey: "ace-cat-servant" },
  { nameNl: "Miauw-Miauw Kantine", nameEn: "Meow-Meow Canteen", nameEs: "Cantina Miau-Miau", namePt: "Cantina Miau-Miau", nameFr: "Cantine Miaou-Miaou", nameDe: "Miau-Miau-Kantine", emoji: "🐱", hidden: false, iconKey: "meow-meow-canteen" },
  { nameNl: "Ster-Hondentrainer", nameEn: "Ace Dog Trainer", nameEs: "Entrenador Estrella de Perros", namePt: "Treinador Nota Dez de Cães", nameFr: "Dresseur de chiens étoilé", nameDe: "Stern-Hundetrainer", emoji: "🐶", hidden: false, iconKey: "ace-dog-trainer" },
  { nameNl: "Hondjes Kantine", nameEn: "Doggie Canteen", nameEs: "Cantina de Perritos", namePt: "Cantina dos Cachorrinhos", nameFr: "Cantine des toutous", nameDe: "Hündchen-Kantine", emoji: "🐶", hidden: false, iconKey: "doggie-canteen" },
  { nameNl: "Insectencommandant", nameEn: "Insect Commander", nameEs: "Comandante de Insectos", namePt: "Comandante de Insetos", nameFr: "Commandant des insectes", nameDe: "Insektenkommandant", emoji: "🦋", hidden: false, iconKey: "insect-commander" },
  { nameNl: "Zwermcommandant", nameEn: "Swarm Commander", nameEs: "Comandante del Enjambre", namePt: "Comandante do Enxame", nameFr: "Commandant de l'essaim", nameDe: "Schwarmkommandant", emoji: "🦋", hidden: false, iconKey: "swarm-commander" },
  { nameNl: "Insectenoogster", nameEn: "Insect Harvester", nameEs: "Recolector de Insectos", namePt: "Coletor de Insetos", nameFr: "Récolteur d'insectes", nameDe: "Insektenernter", emoji: "🦋", hidden: false, iconKey: "insect-harvester" },
  { nameNl: "Zegen van Vijf Insecten", nameEn: "Five Insects Blessing", nameEs: "Bendición de Cinco Insectos", namePt: "Bênção dos Cinco Insetos", nameFr: "Bénédiction des cinq insectes", nameDe: "Segen der fünf Insekten", emoji: "🦋", hidden: false, iconKey: "five-insects-blessing" },
  { nameNl: "Menselijke Insectenlokker", nameEn: "Human Insect Attractor", nameEs: "Atractor Humano de Insectos", namePt: "Atrator Humano de Insetos", nameFr: "Appât à insectes humain", nameDe: "Menschlicher Insektenlocker", emoji: "🦋", hidden: false, iconKey: "human-insect-attractor" },
  { nameNl: "Vogelfluisteraar", nameEn: "Bird Whisperer", nameEs: "Susurrador de Aves", namePt: "Sussurrador de Pássaros", nameFr: "Chuchoteur d'oiseaux", nameDe: "Vogelelfe", emoji: "🐦", hidden: false, iconKey: "bird-whisperer" },
  { nameNl: "Wolkenloper", nameEn: "Cloud Walker", nameEs: "Caminante de Nubes", namePt: "Andarilho das Nuvens", nameFr: "Marcheur sur les nuages", nameDe: "Wolkenläufer", emoji: "🐦", hidden: false, iconKey: "cloud-walker" },
  { nameNl: "Harmonie met de Bries", nameEn: "Harmony with Breeze", nameEs: "Armonía con la Brisa", namePt: "Harmonia com a Brisa", nameFr: "Harmonie avec la brise", nameDe: "Harmonie mit der Brise", emoji: "🐦", hidden: false, iconKey: "harmony-with-breeze" },
  { nameNl: "Vrolijk Koor", nameEn: "Joyful Chorus", nameEs: "Coro Alegre", namePt: "Coro Alegre", nameFr: "Chœur joyeux", nameDe: "Fröhlicher Chor", emoji: "🐦", hidden: false, iconKey: "joyful-chorus" },
  { nameNl: "Beslissend Moment", nameEn: "Decisive Moment", nameEs: "Momento Decisivo", namePt: "Momento Decisivo", nameFr: "Moment décisif", nameDe: "Entscheidender Moment", emoji: "🏖️", hidden: false, iconKey: "decisive-moment" },
  { nameNl: "Zandsculptuur Artiest", nameEn: "Sand Sculpture Artist", nameEs: "Artista de Esculturas de Arena", namePt: "Artista de Esculturas de Areia", nameFr: "Artiste de sculptures de sable", nameDe: "Sandskulpturenkünstler", emoji: "🏖️", hidden: false, iconKey: "sand-sculpture-artist" },
  { nameNl: "Pompoenmonarchie", nameEn: "Pumpkinarchy", nameEs: "Calabazarquía", namePt: "Aboborarquia", nameFr: "Monarchie des citrouilles", nameDe: "Kürbismonarchie", emoji: "🎃", hidden: false, iconKey: "pumpkinarchy" },
  { nameNl: "Sneeuwkoning", nameEn: "Snow King", nameEs: "Rey de la Nieve", namePt: "Rei da Neve", nameFr: "Roi des neiges", nameDe: "Schneekönig", emoji: "❄️", hidden: false, iconKey: "snow-king" },
  { nameNl: "Ocean Cleanup Expert", nameEn: "Ocean Cleanup Expert", nameEs: "Experto en Limpieza Oceánica", namePt: "Especialista em Limpeza Oceânica", nameFr: "Expert en nettoyage des océans", nameDe: "Experte für Meeresreinigung", emoji: "🌊", hidden: false, iconKey: "ocean-cleanup-expert" },
  { nameNl: "Geen Hoekje Overgeslagen", nameEn: "No Corner Left Behind", nameEs: "Ningún Rincón Sin Limpiar", namePt: "Nenhum Cantinho Esquecido", nameFr: "Pas un recoin négligé", nameDe: "Keine Ecke ausgelassen", emoji: "🌊", hidden: false, iconKey: "no-corner-left-behind" },
  { nameNl: "Gediplomeerd & Klaar", nameEn: "Licensed & Ready", nameEs: "Licenciado y Listo", namePt: "Licenciado e Pronto", nameFr: "Diplômé et prêt", nameDe: "Diplomiert & bereit", emoji: "🌊", hidden: false, iconKey: "licensed-ready" },
  { nameNl: "Getijden van het Leven", nameEn: "Tides of Life", nameEs: "Mareas de la Vida", namePt: "Marés da Vida", nameFr: "Les marées de la vie", nameDe: "Gezeiten des Lebens", emoji: "🌊", hidden: false, iconKey: "tides-of-life" },
  { nameNl: "Verzamelaar", nameEn: "Collector", nameEs: "Coleccionista", namePt: "Colecionador", nameFr: "Collectionneur", nameDe: "Sammler", emoji: "🌟", hidden: false, iconKey: "collector" },
  { nameNl: "Raketsponsor", nameEn: "Rocket Sponsor", nameEs: "Patrocinador de Cohetes", namePt: "Patrocinador de Foguetes", nameFr: "Sponsor de fusées", nameDe: "Raketen-Sponsor", emoji: "🌟", hidden: false, iconKey: "rocket-sponsor" },
  { nameNl: "D.G. Lid", nameEn: "D.G. Member", nameEs: "Miembro D.G.", namePt: "Membro D.G.", nameFr: "Membre de la D.G.", nameDe: "D.G.-Mitglied", emoji: "🌟", hidden: false, iconKey: "d-g-member" },
  { nameNl: "Puzzelartiest", nameEn: "Puzzle Artist", nameEs: "Artista de Rompecabezas", namePt: "Artista dos Quebra-Cabeças", nameFr: "Artiste des puzzles", nameDe: "Puzzle-Künstler", emoji: "🧩", hidden: false, iconKey: "puzzle-artist" },
  { nameNl: "Volhardende Veer", nameEn: "Persistent Quill", nameEs: "Pluma Persistente", namePt: "Pena Persistente", nameFr: "Plume tenace", nameDe: "Beharrliche Feder", emoji: "🌟", hidden: false, iconKey: "persistent-quill" },
  { nameNl: "Gouden Muziek-CD", nameEn: "Golden Music CD", nameEs: "CD Musical Dorado", namePt: "CD Musical Dourado", nameFr: "CD de musique en or", nameDe: "Goldene Musik-CD", emoji: "🌟", hidden: false, iconKey: "golden-music-cd" },
  { nameNl: "Dierenbuur", nameEn: "Animal Neighbor", nameEs: "Vecino Animal", namePt: "Vizinho Animal", nameFr: "Voisin des animaux", nameDe: "Tiernachbar", emoji: "🦊", hidden: false, iconKey: "animal-neighbor" },
  { nameNl: "Sterrenstof Verzamelaar", nameEn: "Stardust Collector", nameEs: "Coleccionista de Polvo Estelar", namePt: "Colecionador de Poeira Estelar", nameFr: "Collectionneur de poussière d'étoiles", nameDe: "Sternenstaub-Sammler", emoji: "☄️", hidden: false, iconKey: "stardust-collector" },
  { nameNl: "Dierenverzorger", nameEn: "Animal Keeper", nameEs: "Cuidador de Animales", namePt: "Cuidador de Animais", nameFr: "Soigneur d'animaux", nameDe: "Tierpfleger", emoji: "🦊", hidden: false, iconKey: "animal-keeper" },
  { nameNl: "IJself", nameEn: "Ice Elf", nameEs: "Elfo de Hielo", namePt: "Elfo do Gelo", nameFr: "Glace", nameDe: "Eisvogel", emoji: "🦊", hidden: false, iconKey: "ice-elf" },
  { nameNl: "Voorman Bever", nameEn: "Foreman Beaver", nameEs: "Castor Capataz", namePt: "Castor Capataz", nameFr: "Chef castor", nameDe: "Biber-Vorarbeiter", emoji: "🦫", hidden: false, iconKey: "foreman-beaver" },
  { nameNl: "Logistiek Bever", nameEn: "Logistics Beaver", nameEs: "Castor de Logística", namePt: "Castor da Logística", nameFr: "Castor logistique", nameDe: "Logistik-Biber", emoji: "🦫", hidden: false, iconKey: "logistics-beaver" },
  { nameNl: "Ideeën Hamster", nameEn: "Idea Hamster", nameEs: "Hámster de Ideas", namePt: "Hamster de Ideias", nameFr: "Hamster créatif", nameDe: "Ideen-Hamster", emoji: "🐹", hidden: false, iconKey: "idea-hamster" },
  { nameNl: "Feestbeest", nameEn: "Party Animal", nameEs: "Animal de Fiesta", namePt: "Animal Festeiro", nameFr: "Fêtard", nameDe: "Partylöwe", emoji: "🎉", hidden: false, iconKey: "party-animal" },
  { nameNl: "Snelle Start", nameEn: "Quick Start", nameEs: "Comienzo Rápido", namePt: "Início Rápido", nameFr: "Départ fulgurant", nameDe: "Schneller Start", emoji: "🚀", hidden: false, iconKey: "quick-start" },
  { nameNl: "Scherpschutter Basis", nameEn: "Sharpshooter Basics", nameEs: "Fundamentos de Tirador", namePt: "Fundamentos de Atirador", nameFr: "Tireur d'élite de base", nameDe: "Scharfschütze der Basis", emoji: "🎯", hidden: false, iconKey: "sharpshooter-basics" },
  { nameNl: "Samensmelten tot Eén", nameEn: "Merge into One", nameEs: "Fusión en Uno", namePt: "Fusão em Um", nameFr: "Fusion en un tout", nameDe: "Verschmelzung zu einem Ganzen", emoji: "👻", hidden: false, iconKey: "merge-into-one" },
  { nameNl: "Gedurfde Mysterieuze Grimkin", nameEn: "Bold Mysterious Grimkin", nameEs: "Grimkin Misterioso y Audaz", namePt: "Grimkin Misterioso e Ousado", nameFr: "Grimkin audacieux et mystérieux", nameDe: "Wagemutiger, geheimnisvoller Grimkin", emoji: "👻", hidden: false, iconKey: "bold-mysterious-grimkin" },
  { nameNl: "Stroming van het Leven", nameEn: "Current of Life", nameEs: "Corriente de Vida", namePt: "Corrente da Vida", nameFr: "Courant de la vie", nameDe: "Strömung des Lebens", emoji: "🐋", hidden: false, iconKey: "current-of-life" },
  { nameNl: "Leider Bever", nameEn: "Leader Beaver", nameEs: "Castor Líder", namePt: "Castor Líder", nameFr: "Castor leader", nameDe: "Biber-Anführer", emoji: "🦫", hidden: true, iconKey: "leader-beaver" },
  { nameNl: "Mystic Tracker", nameEn: "Mystic Tracker", nameEs: "Rastreador Místico", namePt: "Rastreador Místico", nameFr: "Traqueur mystique", nameDe: "Mystischer Fährtenleser", emoji: "🗺️", hidden: false, iconKey: "mystic-tracker" },
  { nameNl: "Gourmet Diplomaat", nameEn: "Gourmet Diplomat", nameEs: "Diplomático Gourmet", namePt: "Diplomata Gourmet", nameFr: "Diplomate gourmet", nameDe: "Gourmet-Diplomat", emoji: "🔒", hidden: true, iconKey: "gourmet-diplomat" },
  { nameNl: "Reparatie-expert", nameEn: "Repair Expert", nameEs: "Experto en Reparaciones", namePt: "Especialista em Reparos", nameFr: "Expert en réparations", nameDe: "Reparatur-Experte", emoji: "🔒", hidden: true, iconKey: "repair-expert" },
  { nameNl: "Popster", nameEn: "Pop Star", nameEs: "Estrella del Pop", namePt: "Estrela Pop", nameFr: "Star de la pop", nameDe: "Popstar", emoji: "🔒", hidden: true, iconKey: "pop-star" },
  { nameNl: "Onsen Maatje", nameEn: "Onsen Buddy", nameEs: "Compañero de Onsen", namePt: "Amigo do Onsen", nameFr: "Copain des sources thermales", nameDe: "Onsen-Kumpel", emoji: "🔒", hidden: true, iconKey: "onsen-buddy" },
  { nameNl: "Onder de Meteorenregen", nameEn: "Beneath the Meteor Shower", nameEs: "Bajo la Lluvia de Meteoros", namePt: "Sob a Chuva de Meteoros", nameFr: "Sous la pluie de météores", nameDe: "Unter dem Meteoritenschauer", emoji: "🔒", hidden: true, iconKey: "beneath-the-meteor-shower" },
  { nameNl: "Romantische Schaatser", nameEn: "Romantic Skater", nameEs: "Patinador Romántico", namePt: "Patinador Romântico", nameFr: "Patinateur romantique", nameDe: "Romantischer Eisläufer", emoji: "🔒", hidden: true, iconKey: "romantic-skater" },
  { nameNl: "Struik Groothandelaar", nameEn: "Bush Wholesaler", nameEs: "Mayorista de Arbustos", namePt: "Atacadista de Arbustos", nameFr: "Grossiste en buissons", nameDe: "Strauch-Großhändler", emoji: "🌳", hidden: true, iconKey: "bush-wholesaler" },
  { nameNl: "Bestsellende Auteur", nameEn: "Bestselling Author", nameEs: "Autor Más Vendido", namePt: "Autor Mais Vendido", nameFr: "Auteur à succès", nameDe: "Bestsellerautor", emoji: "📖", hidden: true, iconKey: "bestselling-author" },
  { nameNl: "Literaire Grootmeester", nameEn: "Great Literary Tycoon", nameEs: "Gran Magnate Literario", namePt: "Grande Magnata Literário", nameFr: "Grand maître littéraire", nameDe: "Literarischer Großmeister", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Zeevis Meester", nameEn: "Sea Fishing Master", nameEs: "Maestro de la Pesca Marina", namePt: "Mestre da Pesca no Mar", nameFr: "Maître des poissons de mer", nameDe: "Meister der Meeresfische", emoji: "🎣", hidden: true, iconKey: "sea-fishing-master" },
  { nameNl: "Insectenvangfeest", nameEn: "Insect Catching Party", nameEs: "Fiesta de Caza de Insectos", namePt: "Festa de Captura de Insetos", nameFr: "Fête de la chasse aux insectes", nameDe: "Insektenfangfest", emoji: "🦋", hidden: true, iconKey: "insect-catching-party" },
  { nameNl: "Regenboogbode", nameEn: "Rainbow Messenger", nameEs: "Mensajero del Arcoíris", namePt: "Mensageiro do Arco-Íris", nameFr: "Messager de l'arc-en-ciel", nameDe: "Regenbogenbote", emoji: "🌈", hidden: true, iconKey: "rainbow-messenger" },
  { nameNl: "Onsen Berg Insectenkoning", nameEn: "Onsen Mountain Insect King", nameEs: "Rey de los Insectos de la Montaña Onsen", namePt: "Rei dos Insetos da Montanha Onsen", nameFr: "Roi des insectes de la montagne Onsen", nameDe: "Onsen-Berg-Insektenkönig", emoji: "🦋", hidden: true, iconKey: "onsen-mountain-insect-king" },
  { nameNl: "Boekenverzamelaar", nameEn: "Book Collector", nameEs: "Coleccionista de Libros", namePt: "Colecionador de Livros", nameFr: "Collectionneur de livres", nameDe: "Büchersammler", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Boekenlezer (Astralis)", nameEn: "Book Reader (Astralis)", nameEs: "Lector de Libros (Astralis)", namePt: "Leitor de Livros (Astralis)", nameFr: "Lecteur de livres (Astralis)", nameDe: "Leser (Astralis)", emoji: "🔒", hidden: true, iconKey: null },
  { nameNl: "Hart Gezet op de Lucht", nameEn: "Heart Set on the Sky", nameEs: "Corazón Puesto en el Cielo", namePt: "Coração Voltado para o Céu", nameFr: "Le cœur tourné vers le ciel", nameDe: "Mit dem Herzen in der Luft", emoji: "🎈", hidden: true, iconKey: "heart-set-on-the-sky" },
  { nameNl: "Opruimmeester", nameEn: "Cleanup Master", nameEs: "Maestro de la Limpieza", namePt: "Mestre da Limpeza", nameFr: "Maître du rangement", nameDe: "Aufräummeister", emoji: "🌊", hidden: true, iconKey: "cleanup-master" },
];

export function useBadges(): BadgeItem[] {
  const { language } = useLanguage();
  return useMemo(
    () =>
      BADGES_RAW.map((r) => ({
    name: language === 'es' ? r.nameEs : language === 'pt' ? r.namePt : language === 'fr' ? r.nameFr : language === 'de' ? r.nameDe : r.nameEn,
    emoji: r.emoji,
    hidden: r.hidden,
    iconKey: r.iconKey,
      })),
    [language]
  );
}
