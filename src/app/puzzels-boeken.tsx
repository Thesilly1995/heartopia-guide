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
