"use client";

// 회원가입 폼(클라이언트): 이메일·비밀번호·비밀번호 확인 입력 + Supabase Auth 회원가입.
// - 세 인풋을 모두 채워야 버튼이 활성화된다.
// - 제출 시 비밀번호 일치 여부를 먼저 확인한다.
// - 실패하면 한국어 오류를 화면 상단 토스트로 띄우고, 성공하면 인덱스(/)로 이동한다.

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

// Supabase Auth 오류를 사용자에게 보여줄 한국어 메시지로 변환한다.
function toKoreanError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "이미 가입된 이메일입니다.";
  }
  if (m.includes("password should be at least")) {
    return "비밀번호는 6자 이상이어야 합니다.";
  }
  if (m.includes("unable to validate email") || m.includes("invalid email")) {
    return "이메일 형식이 올바르지 않습니다.";
  }
  return "회원가입에 실패했습니다. 잠시 후 다시 시도해 주세요.";
}

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
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

  // 세 인풋을 모두 입력해야 제출할 수 있다.
  const canSubmit =
    email.trim() !== "" &&
    password !== "" &&
    passwordConfirm !== "" &&
    !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    // 비밀번호 일치 여부 확인
    if (password !== passwordConfirm) {
      showToast("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      showToast(toKoreanError(error.message));
      setSubmitting(false);
      return;
    }

    // 회원가입 성공 → 인덱스 페이지로 이동
    router.push("/");
  }

  return (
    <>
      {/* 화면 상단 오류 토스트 */}
      {toast && (
        <div
          role="alert"
          className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-3 text-[15px] font-bold text-white shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
        >
          {toast}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 shadow-[0_8px_28px_rgba(0,0,0,0.06)]"
      >
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="비밀번호를 다시 입력하세요"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary mt-2 w-full px-5 py-3.5 text-[17px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
        >
          {submitting ? "가입 중…" : "회원가입"}
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
    </>
  );
}
