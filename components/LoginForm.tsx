"use client";

// 로그인 폼(클라이언트): 이메일·비밀번호 입력 + Supabase Auth 로그인.
// - 두 인풋을 모두 채워야 버튼이 활성화된다.
// - 실패하면 한국어 오류를 화면 상단 토스트로 띄우고, 성공하면 인덱스(/)로 이동한다.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";

// Supabase Auth 오류를 사용자에게 보여줄 한국어 메시지로 변환한다.
function toKoreanError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (m.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.";
  }
  return "로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // 상단 토스트에 띄울 오류 메시지(빈 문자열이면 숨김)
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 언마운트 시 토스트 타이머를 정리한다.
  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  // 오류 토스트를 띄우고 일정 시간 뒤 자동으로 닫는다.
  function showToast(message: string) {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }

  // 두 인풋을 모두 입력해야 제출할 수 있다.
  const canSubmit = email.trim() !== "" && password !== "" && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      showToast(toKoreanError(error.message));
      setSubmitting(false);
      return;
    }

    // 로그인 성공 → 인덱스 페이지로 이동
    router.push("/");
  }

  // 카카오 소셜 로그인: 카카오 인증 페이지로 이동한 뒤 /auth/callback으로 돌아온다.
  async function handleKakaoLogin() {
    if (submitting) return;
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    // 성공 시 브라우저가 카카오로 리다이렉트되므로 이후 처리는 불필요하다.
    if (error) {
      showToast("카카오 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* 화면 상단 오류 토스트 */}
      <Toast message={toast} />

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
      >
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary mt-2 w-full px-5 py-3.5 text-[17px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>

        {/* 카카오 소셜 로그인 — 카카오 공식 버튼 이미지 사용 */}
        <button
          type="button"
          onClick={handleKakaoLogin}
          disabled={submitting}
          aria-label="카카오로 로그인"
          className="w-full overflow-hidden rounded-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Image
            src="/kakao_login_large_wide.png"
            alt="카카오 로그인"
            width={600}
            height={90}
            className="h-auto w-full"
            priority
          />
        </button>
      </form>

      {/* 비밀번호 찾기 페이지로 이동 */}
      <p className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-[15px] text-[var(--text-sub)] hover:text-[var(--text)] hover:underline"
        >
          비밀번호를 잊으셨나요?
        </Link>
      </p>

      {/* 회원가입 페이지로 이동 */}
      <p className="mt-2 text-center text-[15px] text-[var(--text-sub)]">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-bold text-[var(--accent)] hover:underline"
        >
          회원가입
        </Link>
      </p>
    </>
  );
}
