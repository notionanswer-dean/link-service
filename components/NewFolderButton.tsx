"use client";

// 헤더의 "새 폴더" 버튼 — 클릭 시 폴더 생성 모달을 연다.
// 서버 컴포넌트인 Header 안에 끼워 넣는 클라이언트 아일랜드.

import { useState } from "react";
import NewFolderModal from "./NewFolderModal";

export default function NewFolderButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2.5 text-sm"
      >
        <span aria-hidden className="text-base leading-none">
          +
        </span>
        새 폴더
      </button>

      {open && <NewFolderModal onClose={() => setOpen(false)} />}
    </>
  );
}
