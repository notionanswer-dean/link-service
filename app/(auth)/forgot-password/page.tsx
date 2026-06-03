// 비밀번호 찾기 페이지 (/forgot-password)
// 로고는 서버에서 렌더하고, 폼·동작은 ForgotPasswordForm(클라이언트)이 담당한다.
// 이메일 인풋 + 재설정 링크 발송 버튼으로 구성된다.

import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "비밀번호 찾기",
};

export default function ForgotPasswordPage() {
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
          가입한 이메일로 비밀번호 재설정 링크를 보내드려요
        </p>
      </div>

      {/* 비밀번호 찾기 폼 + 동작 + 로그인 링크 (클라이언트) */}
      <ForgotPasswordForm />
    </div>
  );
}
