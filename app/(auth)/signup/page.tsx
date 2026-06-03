// 회원가입 페이지 (/signup) — 로고는 서버에서 렌더하고, 폼·동작은 SignupForm(클라이언트)이 담당한다.
// 로고 텍스트 + 이메일/비밀번호/비밀번호 확인 인풋 + 회원가입 버튼 + 로그인 링크로 구성된다.

import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";

export const metadata: Metadata = {
  title: "회원가입",
};

export default function SignupPage() {
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
          계정을 만들고 북마크를 시작하세요
        </p>
      </div>

      {/* 회원가입 폼 + 동작 + 로그인 링크 (클라이언트) */}
      <SignupForm />
    </div>
  );
}
