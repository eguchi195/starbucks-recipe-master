export const SIZES = ['S', 'T', 'G', 'V'] as const;
export type Size = (typeof SIZES)[number];

export const SIZE_LABEL: Record<Size, string> = {
  S: 'Short',
  T: 'Tall',
  G: 'Grande',
  V: 'Venti',
};

export type Temp = 'hot' | 'ice';

/** 工程の温度区分。'both' はホット/アイス共通工程 */
export type StepTemp = Temp | 'both';

export type Category = 'tea' | 'espresso' | 'coffee' | 'chocolate' | 'frappuccino';

export const CATEGORY_LABEL: Record<Category, string> = {
  tea: 'ティー',
  espresso: 'エスプレッソ',
  coffee: 'コーヒー',
  chocolate: 'ココア・チョコ',
  frappuccino: 'フラペチーノ',
};

/** サイズ別数値。未定義のサイズはUI上「-」表示（付箋対象外） */
export interface SizeValues {
  S?: string;
  T?: string;
  G?: string;
  V?: string;
}

/** サイズ別数値を持つ1行（シロップ・パウダー等） */
export interface ValueItem {
  label: string;
  values: SizeValues;
  /** シロップ（希）＝カスタマイズ希望時のみ追加 →「※カスタム」バッジ */
  isCustom?: boolean;
}

export interface Step {
  /** 手順番号（1〜8）。存在しない番号はUIが「（このステップなし）」で補完する */
  no: number;
  temp: StepTemp;
  title: string;
  detail?: string;
  items?: ValueItem[];
}

export interface Drink {
  id: string;
  name: string;
  /** ドリンクコード（例: "CT"）。未記載のドリンクは null →「—」表示 */
  code: string | null;
  /** アイス時に名前が変わる場合（例: ホットココア → アイスココア） */
  iceName?: string;
  /** アイス時にコードが変わる場合（例: HC → CO） */
  iceCode?: string;
  category: Category;
  /** 対応温度。フラペチーノ等は ['ice'] のみ */
  temps: Temp[];
  /** 提供サイズ。3ELは ['T'] のみ、キッズは [] */
  availableSizes: Size[];
  /** サイズに関する注記（例: "Tallサイズのみ"） */
  sizeNote?: string;
  /** 派生レシピの出典メモ（例: "EBと同じ。ティーバッグのみ変更"） */
  baseNote?: string;
  /** 透明カップ使用: 'always'＝常に / 'ice'＝アイス時のみ */
  clearCup?: 'always' | 'ice';
  steps: Step[];
}
