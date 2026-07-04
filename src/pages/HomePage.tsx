import { Coffee, Heart } from 'lucide-react';
import { useMemo } from 'react';
import DrinkCard from '../components/DrinkCard';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import { DRINKS } from '../data/drinks';
import type { Drink } from '../data/types';

interface Props {
  query: string;
  onQueryChange: (q: string) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (v: boolean) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDrink: (id: string) => void;
}

/** ひらがな→カタカナ変換＋小文字化して検索を寛容にする */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ぁ-ん]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60))
    .replace(/\s+/g, '');

const matches = (drink: Drink, rawQuery: string): boolean => {
  const q = normalize(rawQuery);
  if (!q) return true;
  const targets = [drink.name, drink.iceName ?? '', drink.code ?? '', drink.iceCode ?? ''];
  return targets.some((t) => normalize(t).includes(q));
};

export default function HomePage({
  query,
  onQueryChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  favorites,
  onToggleFavorite,
  onSelectDrink,
}: Props) {
  const results = useMemo(
    () =>
      DRINKS.filter((d) => matches(d, query)).filter((d) => !favoritesOnly || favorites.includes(d.id)),
    [query, favoritesOnly, favorites]
  );

  return (
    <div
      className="mx-auto max-w-md px-4 pb-24"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 20px)' }}
    >
      <header className="mb-4 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sbux text-white">
          <Coffee size={20} />
        </span>
        <div>
          <h1 className="text-lg font-black text-sbux-dark">レシピ図鑑</h1>
          <p className="text-[11px] text-stone-500">ドリンクコードと数値を最速で暗記しよう</p>
        </div>
      </header>

      <SearchBar value={query} onChange={onQueryChange} />

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors ${
            favoritesOnly ? 'bg-rose-100 text-rose-600' : 'bg-white text-stone-500 border border-stone-200'
          }`}
        >
          <Heart size={16} className={favoritesOnly ? 'fill-rose-500 text-rose-500' : ''} />
          お気に入り
        </button>
        <span className="text-xs text-stone-400">{results.length} 件</span>
      </div>

      <div className="mt-3 space-y-2">
        {results.length === 0 ? (
          favoritesOnly && favorites.length === 0 ? (
            <EmptyState
              title="お気に入りはまだありません"
              message="ドリンクのハートをタップして登録できます"
              icon={<Heart size={48} />}
            />
          ) : (
            <EmptyState
              title="見つかりませんでした"
              message="ドリンク名またはコード（例: CT, 3EL）で検索してください"
            />
          )
        ) : (
          results.map((drink) => (
            <DrinkCard
              key={drink.id}
              drink={drink}
              isFavorite={favorites.includes(drink.id)}
              onToggleFavorite={() => onToggleFavorite(drink.id)}
              onSelect={() => onSelectDrink(drink.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
