import { useCallback, useEffect, useState } from 'react';
import { DRINKS } from '../data/drinks';
import { SIZES, SIZE_LABEL } from '../data/types';
import type { Size } from '../data/types';

export type QuizMode = 'code' | 'value';

export interface Question {
  prompt: string;
  sub: string;
  choices: string[];
  correctIndex: number;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const unique = (arr: string[]): string[] => [...new Set(arr)];

// ── コードプール（ドリンクコード + アイス別名コード） ──
interface CodeEntry {
  name: string;
  code: string;
}

const CODE_POOL: CodeEntry[] = DRINKS.flatMap((d) => {
  const entries: CodeEntry[] = [];
  if (d.code) entries.push({ name: d.name, code: d.code });
  if (d.iceCode && d.iceName) entries.push({ name: d.iceName, code: d.iceCode });
  return entries;
});

// ── 数値プール（サイズ別数値を持つ全セル） ──
interface ValueEntry {
  drinkName: string;
  tempLabel: 'ホット' | 'アイス';
  size: Size;
  label: string;
  value: string;
}

const VALUE_POOL: ValueEntry[] = DRINKS.flatMap((d) =>
  d.steps.flatMap((step) =>
    (step.items ?? []).flatMap((item) =>
      SIZES.filter((s) => d.availableSizes.includes(s)).flatMap((size) => {
        const value = item.values[size];
        if (value == null || !/^\d+$/.test(value)) return [];
        const tempLabel: 'ホット' | 'アイス' =
          step.temp === 'ice' ? 'アイス' : step.temp === 'hot' ? 'ホット' : d.temps.includes('hot') ? 'ホット' : 'アイス';
        return [{ drinkName: d.name, tempLabel, size, label: item.label, value }];
      })
    )
  )
);

// ── 問題生成 ──
const genCodeQuestion = (): Question => {
  const entry = pick(CODE_POOL);
  const nameToCode = Math.random() < 0.5;

  if (nameToCode) {
    const distractors = shuffle(unique(CODE_POOL.map((e) => e.code).filter((c) => c !== entry.code))).slice(0, 3);
    const choices = shuffle([entry.code, ...distractors]);
    return {
      prompt: entry.name,
      sub: 'このドリンクのコードは？',
      choices,
      correctIndex: choices.indexOf(entry.code),
    };
  }

  // コード→名前。同一コードのドリンク（CO等）は誤答候補から除外する
  const distractors = shuffle(
    unique(CODE_POOL.filter((e) => e.code !== entry.code).map((e) => e.name)).filter((n) => n !== entry.name)
  ).slice(0, 3);
  const choices = shuffle([entry.name, ...distractors]);
  return {
    prompt: entry.code,
    sub: 'このコードのドリンクは？',
    choices,
    correctIndex: choices.indexOf(entry.name),
  };
};

const genValueQuestion = (): Question => {
  const entry = pick(VALUE_POOL);

  // 同じ工程名の他の数値を優先して誤答候補に
  let distractors = shuffle(
    unique(VALUE_POOL.filter((e) => e.label === entry.label && e.value !== entry.value).map((e) => e.value))
  ).slice(0, 3);

  // 足りなければ正解の近傍数値で補完
  const base = parseInt(entry.value, 10);
  let offset = 1;
  while (distractors.length < 3 && offset < 30) {
    for (const cand of [base + offset, base - offset]) {
      if (distractors.length >= 3) break;
      const s = String(cand);
      if (cand > 0 && s !== entry.value && !distractors.includes(s)) distractors.push(s);
    }
    offset++;
  }

  const choices = shuffle([entry.value, ...distractors]);
  return {
    prompt: `${entry.drinkName}（${SIZE_LABEL[entry.size]}・${entry.tempLabel}）`,
    sub: `「${entry.label}」の数値は？`,
    choices,
    correctIndex: choices.indexOf(entry.value),
  };
};

const generate = (mode: QuizMode): Question => (mode === 'code' ? genCodeQuestion() : genValueQuestion());

/** 出題・採点・セッション内スコア管理。進捗の永続化はしない（仕様） */
export function useQuiz(mode: QuizMode) {
  const [question, setQuestion] = useState<Question>(() => generate(mode));
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // モード切替時はスコアと問題をリセット
  useEffect(() => {
    setQuestion(generate(mode));
    setPicked(null);
    setScore({ correct: 0, total: 0 });
  }, [mode]);

  const answer = useCallback(
    (index: number) => {
      if (picked != null) return;
      setPicked(index);
      setScore((s) => ({
        correct: s.correct + (index === question.correctIndex ? 1 : 0),
        total: s.total + 1,
      }));
    },
    [picked, question]
  );

  const next = useCallback(() => {
    setQuestion(generate(mode));
    setPicked(null);
  }, [mode]);

  return {
    question,
    picked,
    score,
    answer,
    next,
    hasData: mode === 'code' ? CODE_POOL.length > 0 : VALUE_POOL.length > 0,
  };
}
