// 북마크 서비스 인덱스 페이지 — 전체 링크를 그리드로 표시
// 헤더/사이드바는 루트 레이아웃에서 공유, 본문 섹션만 렌더링
// 추가된 링크를 즉시 반영하기 위해 클라이언트 뷰(store 구독)로 렌더링한다.

import AllLinksView from "@/components/AllLinksView";

export default function Home() {
  return <AllLinksView />;
}
