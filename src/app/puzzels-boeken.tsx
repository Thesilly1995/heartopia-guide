import { CollectionListScreen } from '@/components/heartopia/collection-list-screen';
import { COLORS } from '@/constants/heartopia-colors';
import { useBooks, usePuzzles } from '@/data/collections';
import { useLanguage } from '@/hooks/use-language';

const STRINGS = {
  nl: {
    title: 'Puzzels & Boeken',
    puzzlesLabel: 'Puzzels',
    booksLabel: 'Boeken',
    disclaimer:
      '110 puzzels en 40 boeken uit de "Other Collections"-tab van het Collection Book, gebaseerd op eigen screenshots. Tik op een item om het als verzameld te markeren.',
  },
  en: {
    title: 'Puzzles & Books',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Books',
    disclaimer:
      '110 puzzles and 40 books from the "Other Collections" tab of the Collection Book, based on own screenshots. Tap an item to mark it as collected.',
  },
  es: {
    title: 'Puzzles y Libros',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Libros',
    disclaimer:
      '110 puzzles y 40 libros de la pestaña "Other Collections" del Collection Book, basados en capturas propias. Toca un elemento para marcarlo como conseguido.',
  },
  pt: {
    title: 'Quebra-cabeças e Livros',
    puzzlesLabel: 'Quebra-cabeças',
    booksLabel: 'Livros',
    disclaimer:
      '110 quebra-cabeças e 40 livros da aba "Other Collections" do Collection Book, baseados em capturas de tela próprias. Toque em um item para marcá-lo como coletado.',
  },
  fr: {
    title: 'Puzzles et Livres',
    puzzlesLabel: 'Puzzles',
    booksLabel: 'Livres',
    disclaimer:
      '110 puzzles et 40 livres de l\'onglet "Other Collections" du Collection Book, basés sur des captures d\'écran personnelles. Appuie sur un élément pour le marquer comme collecté.',
  },
} as const;

export default function PuzzelsBoekenScreen() {
  const { language } = useLanguage();
  const s = STRINGS[language];
  const puzzles = usePuzzles();
  const books = useBooks();

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
      ]}
    />
  );
}
