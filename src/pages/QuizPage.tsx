import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import { useQuiz } from '../hooks/useQuiz';
import type { QuizMode } from '../hooks/useQuiz';

const MODES: { key: QuizMode; label: string; description: string }[] = [
  { key: 'code', label: 'コードマスター', description: 'ドリンク名⇄コードの4択' },
  { key: 'value', label: '数値ドリル', description: 'サイズ別数値の4択' },
];

export default function QuizPage() {
  const [mode, setMode] = useState<QuizMode>('code');
  const { question, picked, score, answer, next, hasData } = useQuiz(mode);

  const answered = picked != null;
  const isCorrect = answered && picked === question.correctIndex;
  const rate = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-4">
      <header className="mb-4 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sbux text-white">
          <Brain size={20} />
        </span>
        <div>
          <h1 className="text-lg font-black text-sbux-dark">暗記ドリル</h1>
          <p className="text-[11px] text-stone-500">ランダム出題・進捗保存なし</p>
        </div>
      </header>

      {/* モード切り替え */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`min-h-[44px] rounded-xl border px-3 py-2 text-left transition-colors ${
              mode === m.key ? 'border-sbux bg-sbux text-white' : 'border-stone-200 bg-white text-stone-600'
            }`}
          >
            <span className="block text-sm font-bold">{m.label}</span>
            <span className={`block text-[10px] ${mode === m.key ? 'text-sbux-light' : 'text-stone-400'}`}>
              {m.description}
            </span>
          </button>
        ))}
      </div>

      {/* セッション正解率 */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-sbux-dark px-4 py-2.5 text-white">
        <span className="text-sm font-bold">
          正解 {score.correct} / {score.total} 問
        </span>
        <span className="text-sm font-black">{rate != null ? `${rate}%` : '—'}</span>
      </div>

      {!hasData ? (
        <div className="mt-4">
          <EmptyState title="出題できる問題がありません" message="レシピデータを確認してください" />
        </div>
      ) : (
        <>
          {/* 問題カード */}
          <div className="relative mt-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-center text-lg font-black leading-snug text-sbux-dark">{question.prompt}</p>
            <p className="mt-1 text-center text-xs text-stone-500">{question.sub}</p>

            {/* ✅/❌ フィードバック */}
            <AnimatePresence>
              {answered && (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="pointer-events-none absolute -top-3 right-3"
                >
                  {isCorrect ? (
                    <CheckCircle2 size={40} className="fill-white text-green-500" />
                  ) : (
                    <XCircle size={40} className="fill-white text-rose-500" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 space-y-2">
              {question.choices.map((choice, i) => {
                const isAnswer = i === question.correctIndex;
                const isPicked = i === picked;
                let style = 'border-stone-200 bg-white text-stone-700 active:bg-stone-50';
                if (answered && isAnswer) style = 'border-green-500 bg-green-50 text-green-700';
                else if (answered && isPicked) style = 'border-rose-400 bg-rose-50 text-rose-600';
                else if (answered) style = 'border-stone-200 bg-white text-stone-400';

                return (
                  <button
                    key={`${choice}-${i}`}
                    type="button"
                    disabled={answered}
                    onClick={() => answer(i)}
                    className={`flex min-h-[48px] w-full items-center justify-between rounded-xl border-2 px-4 py-2 text-left text-sm font-bold transition-colors ${style}`}
                  >
                    <span className="min-w-0 break-words">{choice}</span>
                    {answered && isAnswer && <CheckCircle2 size={18} className="shrink-0 text-green-500" />}
                    {answered && isPicked && !isAnswer && <XCircle size={18} className="shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>

            {/* 不正解時は正解を即表示 */}
            {answered && !isCorrect && (
              <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-bold text-green-700">
                正解：{question.choices[question.correctIndex]}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={next}
            disabled={!answered}
            className={`mt-4 flex min-h-[52px] w-full items-center justify-center gap-1.5 rounded-full text-sm font-black transition-colors ${
              answered ? 'bg-sbux text-white active:bg-sbux-dark' : 'bg-stone-200 text-stone-400'
            }`}
          >
            次の問題へ
            <ArrowRight size={18} />
          </button>
        </>
      )}
    </div>
  );
}
