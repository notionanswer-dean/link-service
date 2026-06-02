// 개별 북마크 링크를 표시하는 카드

import type { LinkItem } from "@/app/lib/mock-data";

interface LinkCardProps {
  link: LinkItem;
}

export default function LinkCard({ link }: LinkCardProps) {
  // 도메인만 추출해 부가 정보로 표시 (예: nextjs.org)
  let host = link.url;
  try {
    host = new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    // 잘못된 URL은 원본을 그대로 사용
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700"
    >
      {/* 썸네일 자리: 도메인 첫 글자를 보여주는 플레이스홀더 */}
      <div className="flex h-28 items-center justify-center rounded-lg bg-zinc-100 text-3xl font-bold text-zinc-400 dark:bg-zinc-900">
        {host.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 font-semibold text-zinc-900 group-hover:underline dark:text-zinc-50">
          {link.title}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
          {link.description}
        </p>
      </div>

      {/* 푸터: 도메인 + 저장일 */}
      <div className="mt-auto flex items-center justify-between text-xs text-zinc-400">
        <span className="truncate">{host}</span>
        <span className="shrink-0">{link.savedAt}</span>
      </div>
    </a>
  );
}
