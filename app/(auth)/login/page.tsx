// 로그인 페이지 (/login) — UI만 구현하며 실제 로그인 동작은 아직 없다.
// 로고 텍스트 + 이메일/비밀번호 인풋 + 로그인 버튼 + 회원가입 링크로 구성된다.

import type { Metadata } from "next";
import Link from "next/link";

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

      {/* 로그인 폼 (동작 미구현) */}
      <form className="flex flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="text-sm font-bold text-[var(--text)]"
          >
            이메일
          </label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-sm font-bold text-[var(--text)]"
          >
            비밀번호
          </label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <button
          type="submit"
          className="btn-primary mt-2 w-full px-5 py-3.5 text-[17px]"
        >
          로그인
        </button>
      </form>

      {/* 회원가입 페이지로 이동 */}
      <p className="mt-6 text-center text-[15px] text-[var(--text-sub)]">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-bold text-[var(--accent)] hover:underline"
        >
          회원가입
        </Link>
      </p>
    </div>
  );
}
