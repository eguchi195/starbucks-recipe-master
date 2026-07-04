import type { Drink, Size, Step, Temp } from '../data/types';
import SizeTable from './SizeTable';

const MAX_STEP = 8;

/** 付箋セルの一意キー */
export const cellKey = (step: Step, label: string, size: Size) => `${step.no}:${step.temp}:${label}:${size}`;

/** 現在の温度で表示中の全付箋セルキー（「すべて開く」用） */
export function allCellKeys(drink: Drink, temp: Temp): string[] {
  const keys: string[] = [];
  for (const step of drink.steps) {
    if (step.temp !== 'both' && step.temp !== temp) continue;
    for (const item of step.items ?? []) {
      for (const size of drink.availableSizes) {
        if (item.values[size] != null) keys.push(cellKey(step, item.label, size));
      }
    }
  }
  return keys;
}

interface Props {
  drink: Drink;
  temp: Temp;
  revealed: Set<string>;
  onToggleCell: (key: string) => void;
}

/** 手順1〜8を縦に並べる。欠番は「（このステップなし）」、ホット専用工程はアイス時SKIP表示 */
export default function StepList({ drink, temp, revealed, onToggleCell }: Props) {
  return (
    <ol className="space-y-2">
      {Array.from({ length: MAX_STEP }, (_, i) => i + 1).map((no) => {
        const active = drink.steps.filter((s) => s.no === no && (s.temp === 'both' || s.temp === temp));
        const hotOnly = drink.steps.filter((s) => s.no === no && s.temp === 'hot');

        // アイス表示中、アイス側に置き換えのないホット専用工程 → SKIP
        if (active.length === 0 && temp === 'ice' && hotOnly.length > 0) {
          return (
            <li key={no} className="flex gap-3 rounded-xl border border-stone-200 bg-stone-100 p-3 opacity-60">
              <StepNumber no={no} muted />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-stone-500 line-through">
                    {hotOnly.map((s) => s.title).join(' / ')}
                  </span>
                  <span className="rounded-full bg-stone-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white">
                    SKIP
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-stone-400">ホット専用工程（アイスでは不要）</p>
              </div>
            </li>
          );
        }

        // 欠番（どの温度にも存在しない or ホット表示中のアイス専用工程）
        if (active.length === 0) {
          return (
            <li
              key={no}
              className="flex items-center gap-3 rounded-xl border border-dashed border-stone-300 p-3"
            >
              <StepNumber no={no} muted />
              <span className="text-sm text-stone-400">（このステップなし）</span>
            </li>
          );
        }

        return (
          <li key={no} className="flex gap-3 rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
            <StepNumber no={no} />
            <div className="min-w-0 flex-1">
              {active.map((step, idx) => (
                <div key={idx} className={idx > 0 ? 'mt-3 border-t border-stone-100 pt-3' : ''}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-sbux-dark">{step.title}</span>
                    {step.temp === 'ice' && (
                      <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                        ICED
                      </span>
                    )}
                  </div>
                  {step.detail && <p className="mt-1 text-xs leading-relaxed text-stone-600">{step.detail}</p>}
                  {step.items && step.items.length > 0 && drink.availableSizes.length > 0 && (
                    <SizeTable
                      items={step.items}
                      availableSizes={drink.availableSizes}
                      keyFor={(label, size) => cellKey(step, label, size)}
                      revealed={revealed}
                      onToggle={onToggleCell}
                    />
                  )}
                </div>
              ))}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StepNumber({ no, muted = false }: { no: number; muted?: boolean }) {
  return (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        muted ? 'bg-stone-200 text-stone-400' : 'bg-sbux text-white'
      }`}
    >
      {no}
    </span>
  );
}
