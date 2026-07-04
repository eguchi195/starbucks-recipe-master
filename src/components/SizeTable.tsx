import { SIZES } from '../data/types';
import type { Size, ValueItem } from '../data/types';
import ScratchCell from './ScratchCell';

interface Props {
  items: ValueItem[];
  availableSizes: Size[];
  /** 行単位の付箋キー（1タップでS/T/G/Vが一気にめくれる） */
  keyFor: (label: string) => string;
  revealed: Set<string>;
  onToggle: (key: string) => void;
}

/** 工程内のサイズ別数値表（S/T/G/V）。数値セルのみ付箋スクラッチ対象 */
export default function SizeTable({ items, availableSizes, keyFor, revealed, onToggle }: Props) {
  return (
    <div className="mt-2 overflow-hidden rounded-lg border border-stone-200 bg-white">
      {/* ヘッダー行 */}
      <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(44px,1fr))] border-b border-stone-200 bg-sbux-light/60">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-sbux-dark">工程</div>
        {SIZES.map((size) => (
          <div
            key={size}
            className={`py-1.5 text-center text-[11px] font-bold ${
              availableSizes.includes(size) ? 'text-sbux-dark' : 'text-stone-400'
            }`}
          >
            {size}
          </div>
        ))}
      </div>

      {items.map((item) => {
        const key = keyFor(item.label);
        const isRevealed = revealed.has(key);
        return (
          <div
            key={item.label}
            className="grid grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(44px,1fr))] items-center border-b border-stone-100 last:border-b-0"
          >
            <div className="px-2 py-1 text-xs leading-tight text-stone-700">
              {item.label}
              {item.isCustom && (
                <span className="ml-1 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
                  ※カスタム
                </span>
              )}
            </div>
            {SIZES.map((size, index) => {
              const value = availableSizes.includes(size) ? item.values[size] : undefined;
              if (value == null) {
                return (
                  <div key={size} className="flex min-h-[44px] items-center justify-center text-sm text-stone-300">
                    -
                  </div>
                );
              }
              return (
                <ScratchCell
                  key={size}
                  value={value}
                  revealed={isRevealed}
                  delay={index * 0.06}
                  onToggle={() => onToggle(key)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
