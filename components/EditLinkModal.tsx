"use client";

// 링크 수정 모달: 화면 중앙 오버레이 + 폴더 선택 + 제목 인풋 + 설명 textarea
// 저장 시 링크의 폴더·제목·설명을 변경한다. (URL·썸네일은 수정 대상이 아니다)

import { useEffect, useRef, useState } from "react";
import type { LinkItem } from "@/app/lib/mock-data";
import { useFolders, updateLink } from "./store";

interface EditLinkModalProps {
  /** 수정 대상 링크 */
  link: LinkItem;
  onClose: () => void;
}

export default function EditLinkModal({ link, onClose }: EditLinkModalProps) {
  const folders = useFolders();
  const [folderId, setFolderId] = useState(link.folderId);
  const [title, setTitle] = useState(link.title);
  const [description, setDescription] = useState(link.description);
  const titleRef = useRef<HTMLInputElement>(null);

  // 모달이 열리면 제목 인풋에 포커스(전체 선택)하고, ESC로 닫는다.
  useEffect(() => {
    titleRef.current?.focus();
    titleRef.current?.select();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      titleRef.current?.focus();
      return;
    }
    updateLink(link.id, { folderId, title: trimmed, description });
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
        aria-labelledby="edit-link-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
      >
        <h2
          id="edit-link-title"
          className="text-[20px] font-bold text-[var(--text)]"
        >
          링크 수정
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
          {/* 폴더 선택 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-link-folder"
              className="text-sm font-bold text-[var(--text)]"
            >
              폴더
            </label>
            <select
              id="edit-link-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="toss-input px-4 py-3.5 text-[17px]"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-link-title-input"
              className="text-sm font-bold text-[var(--text)]"
            >
              제목
            </label>
            <input
              id="edit-link-title-input"
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="링크 제목"
              maxLength={120}
              className="toss-input px-4 py-3.5 text-[17px]"
            />
          </div>

          {/* 설명 */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="edit-link-description"
              className="text-sm font-bold text-[var(--text)]"
            >
              설명
            </label>
            <textarea
              id="edit-link-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="링크에 대한 메모를 남겨 보세요."
              rows={3}
              maxLength={300}
              className="toss-input resize-none px-4 py-3.5 text-[17px]"
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
              disabled={!title.trim()}
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
