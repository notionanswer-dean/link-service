// 메인 섹션: 제목 + 링크 개수 + 그리드
// 인덱스 페이지와 폴더별 페이지가 공통으로 사용한다.

import type { LinkItem } from "@/app/lib/mock-data";
import LinkGrid from "./LinkGrid";

interface LinkSectionProps {
  title: string;
  links: LinkItem[];
}

export default function LinkSection({ title, links }: LinkSectionProps) {
  return (
    <main className="flex flex-1 flex-col gap-5 px-5 pt-9 pb-6 sm:px-8">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[20px] font-bold text-[var(--text)]">{title}</h2>
        <span className="text-sm text-[var(--text-sub)]">{links.length}개</span>
      </div>

      <LinkGrid links={links} />
    </main>
  );
}
