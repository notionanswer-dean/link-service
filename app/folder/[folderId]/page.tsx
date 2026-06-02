// 폴더별 링크 페이지 (/folder/[folderId])
// 폴더 이름·링크는 store에서 읽어야 하므로(추가/순서 변경 반영) 클라이언트 뷰로 렌더링한다.
// 알려진 폴더는 미리 정적 경로로 생성하고, 추가된 폴더는 온디맨드로 렌더링된다.

import FolderView from "@/components/FolderView";
import { folders } from "@/app/lib/mock-data";

// 알려진 폴더 목록을 기반으로 정적 경로를 미리 생성 (셸 prerender)
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
  return <FolderView folderId={folderId} />;
}
