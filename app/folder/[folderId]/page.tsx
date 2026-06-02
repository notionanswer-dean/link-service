// 폴더별 링크 페이지 (/folder/[folderId])
// 해당 폴더에 저장된 링크들을 인덱스 페이지와 동일한 그리드로 표시

import { notFound } from "next/navigation";
import LinkSection from "@/components/LinkSection";
import { folders, links } from "@/app/lib/mock-data";

// 폴더 목록을 기반으로 정적 경로를 미리 생성
export function generateStaticParams() {
  return folders.map((folder) => ({ folderId: folder.id }));
}

// Next.js 16: params는 Promise로 전달되므로 await 후 사용
export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;

  const folder = folders.find((f) => f.id === folderId);
  // 존재하지 않는 폴더는 404 처리
  if (!folder) {
    notFound();
  }

  const folderLinks = links.filter((link) => link.folderId === folderId);

  return <LinkSection title={folder.name} links={folderLinks} />;
}
