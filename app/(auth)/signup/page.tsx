// 회원가입 페이지 (/signup) — UI만 구현하며 실제 회원가입 동작은 아직 없다.
// 로고 텍스트 + 이메일/비밀번호/비밀번호 확인 인풋 + 회원가입 버튼 + 로그인 링크로 구성된다.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회원가입 · 한입 링크",
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

      {/* 회원가입 폼 (동작 미구현) */}
      <form className="flex flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-email"
            className="text-sm font-bold text-[var(--text)]"
          >
            이메일
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password"
            className="text-sm font-bold text-[var(--text)]"
          >
            비밀번호
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="signup-password-confirm"
            className="text-sm font-bold text-[var(--text)]"
          >
            비밀번호 확인
          </label>
          <input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <button
          type="submit"
          className="btn-primary mt-2 w-full px-5 py-3.5 text-[17px]"
        >
          회원가입
        </button>
      </form>

      {/* 로그인 페이지로 이동 */}
      <p className="mt-6 text-center text-[15px] text-[var(--text-sub)]">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-bold text-[var(--accent)] hover:underline"
        >
          로그인
        </Link>
      </p>
    </div>
  );
}
