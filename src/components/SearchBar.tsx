import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ドリンク名・コードで検索（例: CT / モカ）"
        aria-label="ドリンク検索"
        className="min-h-[44px] w-full rounded-full border border-stone-300 bg-white py-2 pl-10 pr-11 text-sm outline-none focus:border-sbux focus:ring-2 focus:ring-sbux/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="検索をクリア"
          className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-stone-400"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
