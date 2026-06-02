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
      className="toss-card group flex flex-col gap-3 p-5"
    >
      {/* 썸네일 자리: 도메인 첫 글자를 보여주는 플레이스홀더 */}
      <div className="flex h-28 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-3xl font-bold text-[var(--accent)]">
        {host.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="line-clamp-1 font-bold text-[var(--text)]">
          {link.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--text-sub)]">
          {link.description}
        </p>
      </div>

      {/* 푸터: 도메인 + 저장일 */}
      <div className="mt-auto flex items-center justify-between text-xs text-[var(--text-sub)]">
        <span className="truncate">{host}</span>
        <span className="shrink-0">{link.savedAt}</span>
      </div>
    </a>
  );
}
