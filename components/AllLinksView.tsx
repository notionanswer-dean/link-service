"use client";

// 전체 링크 뷰: store에서 모든 링크를 읽어 그리드로 표시한다.
// 새로 추가된 링크가 즉시 반영되도록 클라이언트에서 렌더링한다.

import LinkSection from "@/components/LinkSection";
import { useLinks } from "./store";

export default function AllLinksView() {
  const links = useLinks();
  return <LinkSection title="전체" links={links} />;
}
