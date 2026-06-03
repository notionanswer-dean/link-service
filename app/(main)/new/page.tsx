// 새 링크 추가 페이지 (/new)
// 헤더/사이드바는 루트 레이아웃에서 공유, 본문(입력 폼)만 렌더링

import type { Metadata } from "next";
import NewLinkForm from "@/components/NewLinkForm";

export const metadata: Metadata = {
  title: "새 링크 추가",
};

export default function NewLinkPage() {
  return (
    <main className="flex flex-1 flex-col gap-5 px-5 pt-9 pb-6 sm:px-8">
      <h2 className="text-[20px] font-bold text-[var(--text)]">새 링크</h2>
      <NewLinkForm />
    </main>
  );
}
