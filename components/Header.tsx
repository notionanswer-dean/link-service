// 상단 헤더: 좌측 텍스트 로고(홈 링크) + 우측 "새 링크" 버튼(/new 이동)
// 모든 페이지가 공유하므로 루트 레이아웃에서 렌더링된다.

import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-4 backdrop-blur sm:px-6 dark:border-zinc-800 dark:bg-black/80">
      {/* 좌측: 텍스트 로고 (클릭 시 홈으로) */}
      <Link
        href="/"
        className="flex items-center gap-1 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
      >
        <span aria-hidden className="text-xl">
          🥪
        </span>
        한입 링크
      </Link>

      {/* 우측: 새 링크 추가 페이지로 이동 */}
      <Link
        href="/new"
        className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <span aria-hidden className="text-base leading-none">
          +
        </span>
        새 링크
      </Link>
    </header>
  );
}
