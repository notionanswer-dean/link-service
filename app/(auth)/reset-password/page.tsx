// 비밀번호 재설정 페이지 (/reset-password)
// 이메일의 재설정 링크가 /auth/callback에서 세션을 교환한 뒤 이 페이지로 도착한다.
// 로고는 서버에서 렌더하고, 폼·동작은 ResetPasswordForm(클라이언트)이 담당한다.

import type { Metadata } from "next";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const metadata: Metadata = {
  title: "비밀번호 재설정",
};

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-sm">
      {/* 로고 텍스트 */}
      <div className="mb-8 flex flex-col items-center gap-1.5">
        <span aria-hidden className="text-4xl">
          🥪
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">
          한입 링크
        </h1>
        <p className="text-sm text-[var(--text-sub)]">
          새 비밀번호를 입력해 주세요
        </p>
      </div>

      {/* 비밀번호 재설정 폼 + 동작 (클라이언트) */}
      <ResetPasswordForm />
    </div>
  );
}
