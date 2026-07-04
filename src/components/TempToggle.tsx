import { Flame, Snowflake } from 'lucide-react';
import type { Temp } from '../data/types';

interface Props {
  temps: Temp[];
  value: Temp;
  onChange: (temp: Temp) => void;
}

/** ホット/アイス切り替えトグル。片方のみのドリンクは固定バッジ表示 */
export default function TempToggle({ temps, value, onChange }: Props) {
  if (temps.length < 2) {
    const only = temps[0];
    return (
      <span
        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-bold ${
          only === 'hot' ? 'bg-orange-100 text-orange-700' : 'bg-sky-100 text-sky-700'
        }`}
      >
        {only === 'hot' ? <Flame size={16} /> : <Snowflake size={16} />}
        {only === 'hot' ? 'ホットのみ' : 'アイスのみ'}
      </span>
    );
  }

  return (
    <div className="inline-flex rounded-full bg-stone-200 p-1" role="tablist" aria-label="温度切り替え">
      <button
        type="button"
        role="tab"
        aria-selected={value === 'hot'}
        onClick={() => onChange('hot')}
        className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors ${
          value === 'hot' ? 'bg-white text-orange-600 shadow' : 'text-stone-500'
        }`}
      >
        <Flame size={16} />
        ホット
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={value === 'ice'}
        onClick={() => onChange('ice')}
        className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors ${
          value === 'ice' ? 'bg-white text-sky-600 shadow' : 'text-stone-500'
        }`}
      >
        <Snowflake size={16} />
        アイス
      </button>
    </div>
  );
}
