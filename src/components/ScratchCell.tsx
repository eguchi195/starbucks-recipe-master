import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  value: string;
  revealed: boolean;
  /** 行内で左から順にペリペリめくれるようにするための遅延（秒） */
  delay?: number;
  onToggle: () => void;
}

/**
 * サイズ別数値テーブルのセル用「付箋（デジタルスクラッチ）」。
 * タップすると行内のS/T/G/Vが左から順にペリッと剥がれる。再タップで貼り直し。
 */
export default function ScratchCell({ value, revealed, delay = 0, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={revealed ? `数値 ${value}（タップで隠す）` : '付箋をめくる'}
      className="relative flex min-h-[44px] min-w-[44px] items-center justify-center overflow-hidden text-base font-bold text-sbux-dark"
    >
      <motion.span
        initial={false}
        animate={{ opacity: revealed ? 1 : 0, scale: revealed ? 1 : 0.8 }}
        transition={{ duration: 0.2, delay: revealed ? delay + 0.12 : 0 }}
      >
        {value}
      </motion.span>

      <AnimatePresence>
        {!revealed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 0, x: 0, y: 0, transition: { duration: 0.2 } }}
            exit={{
              opacity: 0,
              rotate: -18,
              x: 16,
              y: -34,
              scale: 1.06,
              transition: { duration: 0.32, ease: 'easeOut', delay },
            }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute inset-0.5 flex items-center justify-center rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 text-sm font-bold text-amber-800 shadow-sm"
          >
            ?
            {/* めくれ角 */}
            <span className="absolute right-0 top-0 h-0 w-0 border-l-[10px] border-t-[10px] border-l-transparent border-t-white/60" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
