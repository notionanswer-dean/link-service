// 폴더별 링크 페이지 (/folder/[folderId])
// 폴더 이름·링크는 store(Supabase)에서 읽으므로 클라이언트 뷰로 렌더링하며,
// 폴더는 동적으로 로드되므로 각 폴더 페이지는 요청 시 온디맨드로 렌더링된다.

import FolderView from "@/components/FolderView";

// Next.js 16: params는 Promise로 전달되므로 await 후 사용
export default async function FolderPage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const { folderId } = await params;
  return <FolderView folderId={folderId} />;
}
