import { Heart } from 'lucide-react';
import { CATEGORY_LABEL } from '../data/types';
import type { Drink } from '../data/types';

interface Props {
  drink: Drink;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}

export default function DrinkCard({ drink, isFavorite, onToggleFavorite, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white p-2 shadow-sm">
      <button
        type="button"
        onClick={onSelect}
        className="flex min-h-[44px] min-w-0 flex-1 items-center gap-3 text-left"
      >
        {/* ドリンクコード */}
        <span className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg bg-sbux-light text-sm font-black text-sbux-dark">
          {drink.code ?? '—'}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-stone-800">{drink.name}</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-stone-500">
            {CATEGORY_LABEL[drink.category]}
            {drink.iceCode && <span className="text-sky-600">アイス: {drink.iceCode}</span>}
            {drink.sizeNote && <span className="text-amber-600">{drink.sizeNote}</span>}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
        className="flex h-11 w-11 shrink-0 items-center justify-center"
      >
        <Heart
          size={20}
          className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-300'}
        />
      </button>
    </div>
  );
}
