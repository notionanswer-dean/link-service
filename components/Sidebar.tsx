"use client";

// 좌측 사이드바: 전체(ALL) + 폴더 리스트
// 각 항목은 라우팅 링크이며, 현재 경로(usePathname)로 활성 항목을 표시한다.
// 모든 페이지가 공유하므로 루트 레이아웃에서 렌더링된다.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { folders, links } from "@/app/lib/mock-data";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 p-4 sm:w-60">
      <nav className="flex flex-col gap-1">
        {/* 전체(ALL) */}
        <SidebarItem
          href="/"
          label="전체"
          count={links.length}
          active={pathname === "/"}
        />

        {/* 폴더 라벨 */}
        <p className="mt-5 mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
          폴더
        </p>

        {/* 폴더 리스트 */}
        {folders.map((folder) => (
          <SidebarItem
            key={folder.id}
            href={`/folder/${folder.id}`}
            label={folder.name}
            count={folder.count}
            active={pathname === `/folder/${folder.id}`}
          />
        ))}
      </nav>
    </aside>
  );
}

// 사이드바 항목 (전체 / 폴더 공통) — 라우팅 링크
interface SidebarItemProps {
  href: string;
  label: string;
  count: number;
  active: boolean;
}

function SidebarItem({ href, label, count, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`nav-item flex items-center justify-between px-3 py-2.5 text-[15px] font-medium ${
        active ? "nav-item-active" : ""
      }`}
    >
      <span className="truncate">{label}</span>
      <span
        className={`ml-2 shrink-0 text-xs ${
          active ? "opacity-80" : "text-[var(--text-sub)]"
        }`}
      >
        {count}
      </span>
    </Link>
  );
}
