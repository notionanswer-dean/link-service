"use client";

// 개별 북마크 링크를 표시하는 카드
// 카드에 마우스를 올리면 우측 상단에 삭제(휴지통) 버튼이 나타나고,
// 클릭하면 삭제 확인 모달을 연다.

import { useState } from "react";
import type { LinkItem } from "@/app/lib/mock-data";
import DeleteLinkModal from "./DeleteLinkModal";

interface LinkCardProps {
  link: LinkItem;
}

export default function LinkCard({ link }: LinkCardProps) {
  // 삭제 확인 모달 표시 여부
  const [confirming, setConfirming] = useState(false);

  // 도메인만 추출해 부가 정보로 표시 (예: nextjs.org)
  let host = link.url;
  try {
    host = new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    // 잘못된 URL은 원본을 그대로 사용
  }

  // 삭제 버튼 클릭: 카드(링크) 이동을 막고 모달만 연다
  function handleDeleteClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setConfirming(true);
  }

  return (
    <>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="toss-card group relative flex flex-col gap-3 p-5"
      >
      {/* 삭제 버튼 — 카드에 마우스를 올리면 우측 상단에 나타난다 */}
      <button
        type="button"
        aria-label={`${link.title} 링크 삭제`}
        title="링크 삭제"
        onClick={handleDeleteClick}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--card)]/90 text-[var(--text-sub)] opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.12)] backdrop-blur transition-opacity hover:text-[var(--error)] group-hover:opacity-100"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2.5 4h11" />
          <path d="M6 4V2.8a.8.8 0 0 1 .8-.8h2.4a.8.8 0 0 1 .8.8V4" />
          <path d="M12.5 4l-.6 8.3a1.2 1.2 0 0 1-1.2 1.1H5.3a1.2 1.2 0 0 1-1.2-1.1L3.5 4" />
          <path d="M6.5 7v3.8" />
          <path d="M9.5 7v3.8" />
        </svg>
      </button>

      {/* 썸네일: 오픈 그래프 이미지가 있으면 표시, 없으면 도메인 첫 글자 플레이스홀더 */}
      {link.thumbnail ? (
        // 외부 도메인 이미지라 최적화 없이 일반 img로 표시한다
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={link.thumbnail}
          alt={`${link.title} 썸네일`}
          loading="lazy"
          className="h-28 w-full rounded-xl bg-[var(--accent-soft)] object-cover"
        />
      ) : (
        <div className="flex h-28 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-3xl font-bold text-[var(--accent)]">
          {host.charAt(0).toUpperCase()}
        </div>
      )}

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

      {/* 삭제 확인 모달 — 카드 링크 밖에 두어 클릭이 링크로 전파되지 않게 한다 */}
      {confirming && (
        <DeleteLinkModal link={link} onClose={() => setConfirming(false)} />
      )}
    </>
  );
}
