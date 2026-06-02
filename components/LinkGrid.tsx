// 메인 섹션: 링크들을 반응형 그리드로 배치

import type { LinkItem } from "@/app/lib/mock-data";
import LinkCard from "./LinkCard";

interface LinkGridProps {
  links: LinkItem[];
}

export default function LinkGrid({ links }: LinkGridProps) {
  // 링크가 없는 경우 빈 상태 표시
  if (links.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-4xl" aria-hidden>
          🔖
        </p>
        <p className="font-medium text-zinc-600 dark:text-zinc-300">
          저장된 링크가 없습니다
        </p>
        <p className="text-sm text-zinc-400">
          상단의 &quot;새 링크&quot; 버튼으로 북마크를 추가해 보세요.
        </p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </section>
  );
}
