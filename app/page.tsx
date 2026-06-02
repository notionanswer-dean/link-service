// 북마크 서비스 인덱스 페이지 — 전체 링크를 그리드로 표시
// 헤더/사이드바는 루트 레이아웃에서 공유, 본문 섹션만 렌더링

import LinkSection from "@/components/LinkSection";
import { links } from "@/app/lib/mock-data";

export default function Home() {
  return <LinkSection title="전체" links={links} />;
}
