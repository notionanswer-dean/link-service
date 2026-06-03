"use client";

// 폴더 이름 수정 모달: 화면 중앙 오버레이 + 폴더 이름 인풋 + 취소/저장 버튼
// 저장 시 폴더 이름을 변경하고 닫는다.

import { useEffect, useRef, useState } from "react";
import { renameFolder } from "./store";

interface EditFolderModalProps {
  /** 수정 대상 폴더 */
  folder: { id: string; name: string };
  onClose: () => void;
}

export default function EditFolderModal({
  folder,
  onClose,
}: EditFolderModalProps) {
  const [name, setName] = useState(folder.name);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달이 열리면 인풋에 포커스(전체 선택)하고, ESC로 닫는다.
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    const ok = await renameFolder(folder.id, trimmed);
    if (ok) {
      onClose();
    } else {
      // 저장 실패 시 모달을 유지해 다시 시도할 수 있게 한다.
      inputRef.current?.focus();
    }
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
        aria-labelledby="edit-folder-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="edit-folder-title"
          className="text-[20px] font-bold text-[var(--text)]"
        >
          폴더 이름 수정
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-folder-name"
              className="text-sm font-bold text-[var(--text)]"
            >
              폴더 이름
            </label>
            <input
              id="edit-folder-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 읽을거리"
              maxLength={30}
              className="toss-input px-4 py-3.5 text-[17px]"
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary px-5 py-3 text-[15px]"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary px-5 py-3 text-[15px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
