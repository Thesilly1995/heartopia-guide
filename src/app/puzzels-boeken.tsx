import { CollectionListScreen } from '@/components/heartopia/collection-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useBooks, usePuzzles, useRecords } from '@/data/collections';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: 'Puzzels & Boeken',
    puzzlesLabel: 'Puzzels',
    booksLabel: 'Boeken',
    recordsLabel: "CD's",
    disclaimer:
      '134 puzzels, 40 boeken en 20 CD\'s uit de "Other Collections"-tab van het Collection Book, gebaseerd op eigen screenshots. Tik op een item om het als verzameld te markeren.',
  },
  en: {
    title: 'Puzzles & Books',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Books',
    recordsLabel: 'Records',
    disclaimer:
      '134 puzzles, 40 books and 20 records from the "Other Collections" tab of the Collection Book, based on own screenshots. Tap an item to mark it as collected.',
  },
  es: {
    title: 'Puzzles y Libros',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Libros',
    recordsLabel: 'Discos',
    disclaimer:
      '134 puzzles, 40 libros y 20 discos de la pestaña "Other Collections" del Collection Book, basados en capturas propias. Toca un elemento para marcarlo como conseguido.',
  },
  pt: {
    title: 'Quebra-cabeças e Livros',
    puzzlesLabel: 'Quebra-cabeças',
    booksLabel: 'Livros',
    recordsLabel: 'Discos',
    disclaimer:
      '134 quebra-cabeças, 40 livros e 20 discos da aba "Other Collections" do Collection Book, baseados em capturas de tela próprias. Toque em um item para marcá-lo como coletado.',
  },
  fr: {
    title: 'Puzzles et Livres',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Livres',
    recordsLabel: 'Disques',
    disclaimer:
      '134 puzzles, 40 livres et 20 disques de l\'onglet "Other Collections" du Collection Book, basés sur des captures d\'écran personnelles. Appuie sur un élément pour le marquer comme collecté.',
  },
  de: {
    title: 'Puzzles & Bücher',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Bücher',
    recordsLabel: 'Schallplatten',
    disclaimer:
      '134 Puzzles, 40 Bücher und 20 Schallplatten aus dem Tab "Other Collections" des Collection Book, basierend auf eigenen Screenshots. Tippe auf ein Element, um es als gesammelt zu markieren.',
  },
} as const;

export default function PuzzelsBoekenScreen() {
  const { language } = useLanguage();
  const s = STRINGS[language];
  const puzzles = usePuzzles();
  const books = useBooks();
  const records = useRecords();

  return (
    <CollectionListScreen
      title={s.title}
      icon="🧩"
      gradient={[COLORS.sky, COLORS.coral]}
      storageKey="puzzels-boeken"
      disclaimer={s.disclaimer}
      subTabs={[
        { key: 'puzzels', label: s.puzzlesLabel, items: puzzles },
        { key: 'boeken', label: s.booksLabel, items: books },
        { key: 'cds', label: s.recordsLabel, items: records },
      ]}
    />
  );
}
