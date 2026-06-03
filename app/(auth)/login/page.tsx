// 로그인 페이지 (/login) — 로고는 서버에서 렌더하고, 폼·동작은 LoginForm(클라이언트)이 담당한다.
// 로고 텍스트 + 이메일/비밀번호 인풋 + 로그인 버튼 + 회원가입 링크로 구성된다.

import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "로그인 · 한입 링크",
};

export default function LoginPage() {
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
          로그인하고 북마크를 정리해 보세요
        </p>
      </div>

      {/* 로그인 폼 + 동작 + 회원가입 링크 (클라이언트) */}
      <LoginForm />
    </div>
  );
}
