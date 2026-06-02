// 상단 헤더: 좌측 텍스트 로고(홈 링크) + 우측 "새 링크" 버튼(/new 이동)
// 모든 페이지가 공유하므로 루트 레이아웃에서 렌더링된다.

import Link from "next/link";
import NewFolderButton from "@/components/NewFolderButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-[var(--card)] px-5 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      {/* 좌측: 텍스트 로고 (클릭 시 홈으로) */}
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[var(--text)]"
      >
        <span aria-hidden className="text-2xl">
          🥪
        </span>
        한입 링크
      </Link>

      {/* 우측: 새 폴더(모달) + 새 링크(페이지 이동) */}
      <div className="flex items-center gap-2">
        <NewFolderButton />
        <Link
          href="/new"
          className="btn-primary inline-flex items-center gap-1.5 px-4 py-2.5 text-sm"
        >
          <span aria-hidden className="text-base leading-none">
            +
          </span>
          새 링크
        </Link>
      </div>
    </header>
  );
}
