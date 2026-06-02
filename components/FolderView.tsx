"use client";

// 폴더 상세 뷰: store에서 폴더와 링크를 읽어 렌더링한다.
// 정적 mock 폴더와 클라이언트에서 추가된 폴더를 모두 처리하며,
// 추가된 링크도 즉시 반영된다.

import LinkSection from "@/components/LinkSection";
import { useFolders, useLinks } from "./store";

export default function FolderView({ folderId }: { folderId: string }) {
  const folders = useFolders();
  const links = useLinks();
  const folder = folders.find((f) => f.id === folderId);

  // store에도 없는 폴더 = 존재하지 않는 경로
  if (!folder) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 px-5 py-24 text-center">
        <p className="text-4xl" aria-hidden>
          🗂️
        </p>
        <p className="font-bold text-[var(--text)]">폴더를 찾을 수 없습니다</p>
        <p className="text-sm text-[var(--text-sub)]">
          삭제되었거나 존재하지 않는 폴더입니다.
        </p>
      </main>
    );
  }

  const folderLinks = links.filter((link) => link.folderId === folderId);
  return <LinkSection title={folder.name} links={folderLinks} />;
}
