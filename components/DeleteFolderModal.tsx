"use client";

// 폴더 삭제 확인 모달: 화면 중앙 오버레이 + 경고 문구 + 취소/삭제 버튼
// 삭제 시 폴더와 폴더에 담긴 링크를 함께 제거한다.

import { useEffect, useRef } from "react";
import { deleteFolder } from "./store";

interface DeleteFolderModalProps {
  /** 삭제 대상 폴더 */
  folder: { id: string; name: string };
  /** 폴더에 담긴 링크 개수 (안내 문구용) */
  linkCount: number;
  onClose: () => void;
  /** 삭제 완료 후 호출 (예: 현재 보던 폴더면 다른 곳으로 이동) */
  onDeleted: (folderId: string) => void;
}

export default function DeleteFolderModal({
  folder,
  linkCount,
  onClose,
  onDeleted,
}: DeleteFolderModalProps) {
  // 닫을 때 위험 동작인 취소에 기본 포커스를 둔다.
  const cancelRef = useRef<HTMLButtonElement>(null);

  // 모달이 열리면 취소 버튼에 포커스하고, ESC로 닫는다.
  useEffect(() => {
    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleDelete() {
    deleteFolder(folder.id);
    onDeleted(folder.id);
    onClose();
  }

  return (
    // 오버레이 클릭 시 닫힘
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5"
      onClick={onClose}
      role="presentation"
    >
      {/* 카드 내부 클릭은 전파를 막아 닫히지 않도록 한다 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-folder-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="delete-folder-title"
          className="text-[20px] font-bold text-[var(--text)]"
        >
          폴더 삭제
        </h2>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--text-sub)]">
          <span className="font-bold text-[var(--text)]">{folder.name}</span>{" "}
          폴더를 삭제할까요?
          {linkCount > 0 && (
            <>
              {" "}
              폴더에 담긴 링크 {linkCount}개도 함께 삭제되며, 이 작업은 되돌릴 수
              없습니다.
            </>
          )}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="btn-secondary px-5 py-3 text-[15px]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-xl bg-[var(--error)] px-5 py-3 text-[15px] font-bold text-white transition-colors hover:bg-[var(--error-hover)]"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}
