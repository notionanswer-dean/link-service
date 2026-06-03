"use client";

// 새 폴더 생성 모달: 화면 중앙 오버레이 + 폴더 이름 인풋 + 취소/저장 버튼
// 저장 시 폴더 컨텍스트에 추가하고 닫는다.

import { useEffect, useRef, useState } from "react";
import { addFolder } from "./store";

interface NewFolderModalProps {
  onClose: () => void;
}

export default function NewFolderModal({ onClose }: NewFolderModalProps) {
  const [name, setName] = useState("");
  // 저장 중 플래그 — 버튼 중복 클릭으로 폴더가 여러 번 추가되는 것을 막는다.
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달이 열리면 인풋에 포커스하고, ESC로 닫는다.
  useEffect(() => {
    inputRef.current?.focus();

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
    // 이미 저장 중이면(중복 클릭) 무시한다.
    if (submitting) return;
    const trimmed = name.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }
    setSubmitting(true);
    const created = await addFolder(trimmed);
    if (created) {
      onClose();
    } else {
      // 저장 실패 시 모달을 유지하고 다시 시도할 수 있게 한다.
      setSubmitting(false);
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
        aria-labelledby="new-folder-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="new-folder-title"
          className="text-[20px] font-bold text-[var(--text)]"
        >
          새 폴더
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="folder-name"
              className="text-sm font-bold text-[var(--text)]"
            >
              폴더 이름
            </label>
            <input
              id="folder-name"
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
              disabled={submitting}
              className="btn-secondary px-5 py-3 text-[15px] disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim() || submitting}
              className="btn-primary px-5 py-3 text-[15px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
            >
              {submitting ? "저장 중…" : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
