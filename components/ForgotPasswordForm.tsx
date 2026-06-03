"use client";

// 비밀번호 찾기 폼(클라이언트): 이메일 입력 + Supabase 비밀번호 재설정 메일 발송.
// - 이메일을 입력해야 버튼이 활성화된다.
// - 발송에 성공하면 안내 화면으로 전환하고, 실패하면 한국어 오류를 상단 토스트로 띄운다.
// - 메일의 재설정 링크는 /auth/callback을 거쳐 /reset-password로 연결된다.

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import Toast from "@/components/Toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  // 발송 성공 여부(성공 시 안내 화면으로 전환)
  const [sent, setSent] = useState(false);
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

  const canSubmit = email.trim() !== "" && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    const supabase = createClient();
    // 재설정 링크는 /auth/callback에서 세션 교환 후 /reset-password로 이동한다.
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      showToast("재설정 메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setSubmitting(false);
      return;
    }

    setSent(true);
  }

  // 발송 성공 안내 화면
  if (sent) {
    return (
      <div className="flex flex-col gap-4 rounded-2xl bg-[var(--card)] p-6 text-center shadow-[0_8px_28px_rgba(0,0,0,0.06)]">
        <p className="text-[17px] font-bold text-[var(--text)]">
          메일을 확인해 주세요
        </p>
        <p className="text-[15px] leading-relaxed text-[var(--text-sub)]">
          <span className="font-bold text-[var(--text)]">{email.trim()}</span>{" "}
          주소로 비밀번호 재설정 링크를 보냈어요. 메일함에서 링크를 눌러 비밀번호를
          다시 설정해 주세요.
        </p>
        <Link
          href="/login"
          className="btn-secondary mt-2 w-full px-5 py-3.5 text-[17px]"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    );
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
            htmlFor="forgot-email"
            className="text-sm font-bold text-[var(--text)]"
          >
            이메일
          </label>
          <input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="toss-input px-4 py-3.5 text-[17px]"
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-primary mt-2 w-full px-5 py-3.5 text-[17px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
        >
          {submitting ? "발송 중…" : "비밀번호 재설정 링크 발송"}
        </button>
      </form>

      {/* 로그인 페이지로 이동 */}
      <p className="mt-6 text-center text-[15px] text-[var(--text-sub)]">
        비밀번호가 기억나셨나요?{" "}
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
