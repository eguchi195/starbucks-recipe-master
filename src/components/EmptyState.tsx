import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  message?: string;
  icon?: ReactNode;
}

/** 検索結果ゼロ・データ未定義時の空状態UI */
export default function EmptyState({ title, message, icon }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <span className="text-stone-300">{icon ?? <SearchX size={48} />}</span>
      <p className="mt-4 text-sm font-bold text-stone-600">{title}</p>
      {message && <p className="mt-1 text-xs text-stone-400">{message}</p>}
    </div>
  );
}
