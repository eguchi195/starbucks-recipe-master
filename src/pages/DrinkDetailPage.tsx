import { ChevronLeft, CupSoda, Eye, EyeOff, Heart, Info } from 'lucide-react';
import { useState } from 'react';
import BannerImage from '../components/BannerImage';
import EmptyState from '../components/EmptyState';
import StepList, { allCellKeys } from '../components/StepList';
import TempToggle from '../components/TempToggle';
import { findDrink } from '../data/drinks';
import type { Temp } from '../data/types';

interface Props {
  drinkId: string;
  onBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  revealedMap: Record<string, string[]>;
  onRevealedChange: (drinkId: string, keys: string[]) => void;
}

export default function DrinkDetailPage({
  drinkId,
  onBack,
  favorites,
  onToggleFavorite,
  revealedMap,
  onRevealedChange,
}: Props) {
  const drink = findDrink(drinkId);
  // デフォルトはホット。ホット非対応（フラペ等）のみアイス
  const [temp, setTemp] = useState<Temp>(drink?.temps.includes('hot') ? 'hot' : 'ice');

  if (!drink) {
    return (
      <div className="mx-auto max-w-md px-4 pb-24 pt-4">
        <BackButton onBack={onBack} />
        <div className="mt-4">
          <EmptyState title="ドリンクデータが見つかりません" message="図鑑に戻ってやり直してください" />
        </div>
      </div>
    );
  }

  const revealed = new Set(revealedMap[drink.id] ?? []);
  const isFavorite = favorites.includes(drink.id);
  const showClearCup = drink.clearCup === 'always' || (drink.clearCup === 'ice' && temp === 'ice');
  const displayCode = temp === 'ice' && drink.iceCode ? drink.iceCode : (drink.code ?? '—');

  const toggleCell = (key: string) => {
    const next = new Set(revealed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    onRevealedChange(drink.id, [...next]);
  };

  const openAll = () => {
    const all = new Set([...revealed, ...allCellKeys(drink, temp)]);
    onRevealedChange(drink.id, [...all]);
  };

  const hideAll = () => onRevealedChange(drink.id, []);

  return (
    <div className="mx-auto max-w-md pb-24">
      {/* ヘッダー */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-stone-100/90 px-2 py-1 backdrop-blur">
        <BackButton onBack={onBack} />
        <button
          type="button"
          onClick={() => onToggleFavorite(drink.id)}
          aria-label={isFavorite ? 'お気に入り解除' : 'お気に入り登録'}
          className="flex h-11 w-11 items-center justify-center"
        >
          <Heart size={22} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'} />
        </button>
      </div>

      {/* バナー（差し替え可能） */}
      <BannerImage />

      <div className="px-4">
        {/* ドリンク名＋コード */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-black leading-snug text-sbux-dark">
              {temp === 'ice' && drink.iceName ? drink.iceName : drink.name}
            </h1>
            <span className="shrink-0 rounded-2xl bg-sbux px-4 py-2 text-3xl font-black tracking-wide text-white">
              {displayCode}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {drink.sizeNote && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                {drink.sizeNote}
              </span>
            )}
            {showClearCup && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                <CupSoda size={12} />
                透明カップ
              </span>
            )}
            {temp === 'hot' && drink.iceName && drink.temps.includes('ice') && (
              <span className="rounded-full bg-stone-200 px-2.5 py-1 text-[11px] text-stone-600">
                アイス時: {drink.iceName}
                {drink.iceCode ? `（${drink.iceCode}）` : ''}
              </span>
            )}
          </div>

          {drink.baseNote && (
            <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-sbux-light/50 px-3 py-2 text-xs leading-relaxed text-sbux-dark">
              <Info size={14} className="mt-0.5 shrink-0" />
              {drink.baseNote}
            </p>
          )}
        </div>

        {/* 温度切り替え＋付箋一括操作 */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <TempToggle temps={drink.temps} value={temp} onChange={setTemp} />
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={openAll}
              className="flex min-h-[44px] items-center gap-1 rounded-full border border-stone-300 bg-white px-3 text-xs font-bold text-stone-600"
            >
              <Eye size={14} />
              すべて開く
            </button>
            <button
              type="button"
              onClick={hideAll}
              className="flex min-h-[44px] items-center gap-1 rounded-full border border-stone-300 bg-white px-3 text-xs font-bold text-stone-600"
            >
              <EyeOff size={14} />
              すべて隠す
            </button>
          </div>
        </div>

        {/* 手順1〜8 */}
        <div className="mt-4">
          <StepList drink={drink} temp={temp} revealed={revealed} onToggleCell={toggleCell} />
        </div>
      </div>
    </div>
  );
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="flex min-h-[44px] items-center gap-0.5 pr-3 text-sm font-bold text-sbux-dark"
    >
      <ChevronLeft size={20} />
      図鑑へ戻る
    </button>
  );
}
