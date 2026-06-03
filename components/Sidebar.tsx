"use client";

// 좌측 사이드바: 전체(ALL) + 폴더 리스트
// 폴더 목록/순서·링크는 store에서 읽는다. 폴더 카운트는 링크에서 계산한다.
// 각 폴더는 라우팅 링크이며, 현재 경로(usePathname)로 활성 항목을 표시한다.
// 폴더 항목은 드래그 핸들(pointer 이벤트)을 잡아 순서를 바꿀 수 있다.
// 모든 페이지가 공유하므로 루트 레이아웃에서 렌더링된다.

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useFolders, useLinks, reorderFolders } from "./store";
import DeleteFolderModal from "./DeleteFolderModal";
import EditFolderModal from "./EditFolderModal";
import { createClient } from "@/utils/supabase/client";
import type { Folder } from "@/app/lib/mock-data";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const folders = useFolders();
  const links = useLinks();

  // 삭제 확인 모달 대상 폴더 (null이면 닫힘)
  const [pendingDelete, setPendingDelete] = useState<Folder | null>(null);
  // 이름 수정 모달 대상 폴더 (null이면 닫힘)
  const [pendingEdit, setPendingEdit] = useState<Folder | null>(null);

  // 로그아웃 진행 중 플래그 — 버튼 중복 클릭 방지
  const [loggingOut, setLoggingOut] = useState(false);

  // 폴더별 링크 개수
  const countOf = (folderId: string) =>
    links.filter((link) => link.folderId === folderId).length;

  // 로그아웃: 세션을 종료하고 로그인 페이지로 이동한다.
  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    // 서버 컴포넌트(접근 제한 레이아웃)가 갱신된 세션을 다시 평가하도록 한다.
    router.replace("/login");
    router.refresh();
  }

  // 각 폴더 행의 DOM 참조 (드래그 중 위치 판정용)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  // 드래그 상태는 핸들러에서 즉시 읽도록 ref로, 화면 표시는 state로 관리
  const dragFrom = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handlePointerDown(e: React.PointerEvent, index: number) {
    e.preventDefault();
    // 포인터를 핸들에 고정해 영역을 벗어나도 move/up 이벤트를 계속 받는다
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // 일부 환경에서 실패할 수 있으나 드래그 로직에는 영향 없음
    }
    dragFrom.current = index;
    dragOver.current = index;
    setDraggingIndex(index);
    setOverIndex(index);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (dragFrom.current === null) return;
    const y = e.clientY;
    let target = dragFrom.current;
    // 각 행의 세로 중점을 기준으로 삽입 위치를 정한다
    for (let i = 0; i < folders.length; i++) {
      const el = rowRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      target = i;
      if (y < rect.top + rect.height / 2) break;
    }
    dragOver.current = target;
    setOverIndex(target);
  }

  function handlePointerUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    const from = dragFrom.current;
    const to = dragOver.current;
    if (from !== null && to !== null && from !== to) {
      reorderFolders(from, to);
    }
    dragFrom.current = null;
    dragOver.current = null;
    setDraggingIndex(null);
    setOverIndex(null);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col p-4 sm:w-60">
      <nav className="flex flex-col gap-1">
        {/* 전체(ALL) — 폴더가 아니므로 순서 변경 대상이 아니다 */}
        <SidebarLink
          href="/"
          label="전체"
          count={links.length}
          active={pathname === "/"}
        />

        {/* 폴더 라벨 */}
        <p className="mt-5 mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
          폴더
        </p>

        {/* 폴더 리스트 (핸들 드래그로 순서 변경) */}
        {folders.map((folder, index) => {
          const isDragging = draggingIndex === index;
          const isOver =
            overIndex === index &&
            draggingIndex !== null &&
            draggingIndex !== index;
          return (
            <div
              key={folder.id}
              ref={(el) => {
                rowRefs.current[index] = el;
              }}
              className={`rounded-xl transition-colors ${
                isOver ? "bg-[var(--accent-soft)]" : ""
              } ${isDragging ? "opacity-40" : ""}`}
            >
              <FolderRow
                href={`/folder/${folder.id}`}
                label={folder.name}
                count={countOf(folder.id)}
                active={pathname === `/folder/${folder.id}`}
                dragging={draggingIndex !== null}
                onHandlePointerDown={(e) => handlePointerDown(e, index)}
                onHandlePointerMove={handlePointerMove}
                onHandlePointerUp={handlePointerUp}
                onEdit={() => setPendingEdit(folder)}
                onDelete={() => setPendingDelete(folder)}
              />
            </div>
          );
        })}
      </nav>

      {/* 로그아웃 버튼 — 사이드바 최하단에 고정 */}
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="nav-item mt-auto flex items-center gap-2 px-3 py-2.5 text-[15px] font-medium text-[var(--text-sub)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 14H3.5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1H6" />
          <path d="M10.5 11l3-3-3-3" />
          <path d="M13.5 8H6" />
        </svg>
        {loggingOut ? "로그아웃 중…" : "로그아웃"}
      </button>

      {/* 개인정보 처리방침 — 로그아웃 버튼 아래 회색 링크 */}
      <Link
        href="/privacy"
        className="px-3 py-2 text-xs text-[var(--text-sub)] hover:underline"
      >
        개인정보 처리방침
      </Link>

      {/* 이름 수정 모달 */}
      {pendingEdit && (
        <EditFolderModal
          folder={pendingEdit}
          onClose={() => setPendingEdit(null)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {pendingDelete && (
        <DeleteFolderModal
          folder={pendingDelete}
          linkCount={countOf(pendingDelete.id)}
          onClose={() => setPendingDelete(null)}
          onDeleted={(deletedId) => {
            // 삭제한 폴더 페이지를 보고 있었다면 전체 화면으로 이동
            if (pathname === `/folder/${deletedId}`) {
              router.push("/");
            }
          }}
        />
      )}
    </aside>
  );
}

// 전체(ALL) 등 단순 네비게이션 링크
interface SidebarLinkProps {
  href: string;
  label: string;
  count: number;
  active: boolean;
}

function SidebarLink({ href, label, count, active }: SidebarLinkProps) {
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

// 드래그 핸들이 달린 폴더 항목
interface FolderRowProps extends SidebarLinkProps {
  dragging: boolean;
  onHandlePointerDown: (e: React.PointerEvent) => void;
  onHandlePointerMove: (e: React.PointerEvent) => void;
  onHandlePointerUp: (e: React.PointerEvent) => void;
  onEdit: () => void;
  onDelete: () => void;
}

function FolderRow({
  href,
  label,
  count,
  active,
  dragging,
  onHandlePointerDown,
  onHandlePointerMove,
  onHandlePointerUp,
  onEdit,
  onDelete,
}: FolderRowProps) {
  return (
    <div className="group flex items-center gap-1">
      {/* 드래그 핸들 — 이 영역을 잡고 끌면 순서가 바뀐다 */}
      <button
        type="button"
        aria-label={`${label} 폴더 순서 변경 핸들`}
        title="드래그하여 순서 변경"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        className={`flex shrink-0 touch-none items-center justify-center rounded-md p-1 text-[var(--placeholder)] transition-opacity hover:text-[var(--text-sub)] ${
          dragging
            ? "cursor-grabbing opacity-100"
            : "cursor-grab opacity-0 group-hover:opacity-100"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="6" cy="4" r="1.3" />
          <circle cx="10" cy="4" r="1.3" />
          <circle cx="6" cy="8" r="1.3" />
          <circle cx="10" cy="8" r="1.3" />
          <circle cx="6" cy="12" r="1.3" />
          <circle cx="10" cy="12" r="1.3" />
        </svg>
      </button>

      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        // 드래그 중에는 링크 클릭(이동)을 막아 정렬과 충돌하지 않게 한다
        className={`nav-item flex flex-1 items-center justify-between px-3 py-2.5 text-[15px] font-medium ${
          active ? "nav-item-active" : ""
        } ${dragging ? "pointer-events-none" : ""}`}
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

      {/* 수정 버튼 — 행에 마우스를 올리면 폴더 이름 우측에 나타난다 */}
      <button
        type="button"
        aria-label={`${label} 폴더 이름 수정`}
        title="폴더 이름 수정"
        onClick={onEdit}
        className={`flex shrink-0 items-center justify-center rounded-md p-1 text-[var(--placeholder)] transition-opacity hover:text-[var(--accent)] ${
          dragging
            ? "pointer-events-none opacity-0"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M11.5 2.5a1.4 1.4 0 0 1 2 2L5.4 12.6l-2.7.7.7-2.7 8.1-8.1z" />
          <path d="M10.3 3.7l2 2" />
        </svg>
      </button>

      {/* 삭제 버튼 — 행에 마우스를 올리면 폴더 이름 우측에 나타난다 */}
      <button
        type="button"
        aria-label={`${label} 폴더 삭제`}
        title="폴더 삭제"
        onClick={onDelete}
        className={`flex shrink-0 items-center justify-center rounded-md p-1 text-[var(--placeholder)] transition-opacity hover:text-[var(--error)] ${
          dragging
            ? "pointer-events-none opacity-0"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2.5 4h11" />
          <path d="M6 4V2.8a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8V4" />
          <path d="M12.5 4l-.6 8.3a1.2 1.2 0 0 1-1.2 1.1H5.3a1.2 1.2 0 0 1-1.2-1.1L3.5 4" />
          <path d="M6.5 7v3.8" />
          <path d="M9.5 7v3.8" />
        </svg>
      </button>
    </div>
  );
}
