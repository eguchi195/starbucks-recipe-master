/**
 * 詳細ページ最上部のバナー。
 * `src/assets/banner.png`（jpg/webpも可）を置くと自動でそちらに差し替わる。
 * 無い場合はスタバロゴ風のSVGプレースホルダーを表示する。
 */
const bannerModules = import.meta.glob('../assets/banner.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const bannerUrl: string | undefined = Object.values(bannerModules)[0];

export default function BannerImage() {
  if (bannerUrl) {
    return <img src={bannerUrl} alt="ドリンクバナー" className="h-40 w-full object-cover" />;
  }

  return (
    <div className="h-40 w-full overflow-hidden bg-sbux">
      <svg viewBox="0 0 400 160" className="h-full w-full" role="img" aria-label="バナープレースホルダー">
        <rect width="400" height="160" fill="#00704A" />
        <circle cx="200" cy="80" r="52" fill="none" stroke="#ffffff" strokeWidth="4" />
        <circle cx="200" cy="80" r="44" fill="#ffffff" opacity="0.12" />
        {/* カップ */}
        <path d="M178 66h44v18c0 13-10 24-22 24s-22-11-22-24V66z" fill="#ffffff" />
        <path d="M222 70h7a8 8 0 0 1 0 16h-8" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        {/* 湯気 */}
        <path
          d="M190 48c0 5 5 6 5 11M200 46c0 5 5 6 5 11M210 48c0 5 5 6 5 11"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* 星 */}
        <path d="M118 80l4 8 9 1-6.5 6 1.5 9-8-4.5L110 104l1.5-9-6.5-6 9-1z" fill="#ffffff" opacity="0.85" />
        <path d="M282 80l4 8 9 1-6.5 6 1.5 9-8-4.5-8 4.5 1.5-9-6.5-6 9-1z" fill="#ffffff" opacity="0.85" />
        <text
          x="200"
          y="150"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="12"
          letterSpacing="4"
          fontFamily="sans-serif"
        >
          RECIPE MASTER
        </text>
      </svg>
    </div>
  );
}
