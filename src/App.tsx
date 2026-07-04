import { BookOpen, Brain } from 'lucide-react';
import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import DrinkDetailPage from './pages/DrinkDetailPage';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';

type View = { page: 'home' } | { page: 'detail'; drinkId: string } | { page: 'quiz' };

export default function App() {
  const [view, setView] = useState<View>({ page: 'home' });

  // 検索状態はApp側に持ち、詳細から戻っても維持する
  const [query, setQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // localStorage 永続化：お気に入り＆付箋の開閉状態
  const [favorites, setFavorites] = useLocalStorage<string[]>('srm:favorites', []);
  const [revealedMap, setRevealedMap] = useLocalStorage<Record<string, string[]>>('srm:revealed', {});

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const setRevealed = (drinkId: string, keys: string[]) =>
    setRevealedMap((prev) => ({ ...prev, [drinkId]: keys }));

  return (
    <div className="min-h-screen">
      {view.page === 'home' && (
        <HomePage
          query={query}
          onQueryChange={setQuery}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyChange={setFavoritesOnly}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onSelectDrink={(drinkId) => setView({ page: 'detail', drinkId })}
        />
      )}

      {view.page === 'detail' && (
        <DrinkDetailPage
          key={view.drinkId}
          drinkId={view.drinkId}
          onBack={() => setView({ page: 'home' })}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          revealedMap={revealedMap}
          onRevealedChange={setRevealed}
        />
      )}

      {view.page === 'quiz' && <QuizPage />}

      {/* ボトムナビ（片手操作向け） */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-stone-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto grid max-w-md grid-cols-2">
          <NavButton
            label="レシピ図鑑"
            icon={<BookOpen size={20} />}
            active={view.page !== 'quiz'}
            onClick={() => setView({ page: 'home' })}
          />
          <NavButton
            label="暗記ドリル"
            icon={<Brain size={20} />}
            active={view.page === 'quiz'}
            onClick={() => setView({ page: 'quiz' })}
          />
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[56px] flex-col items-center justify-center gap-0.5 text-[11px] font-bold ${
        active ? 'text-sbux' : 'text-stone-400'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
