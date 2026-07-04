import { useEffect, useState } from 'react';

/** localStorage と同期する useState。読み書き失敗時（プライベートモード等）はメモリ上のみで動作 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 保存不可環境では無視 */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
