// 화면 상단 중앙에 떠오르는 오류 토스트(표시 전용).
// message가 비어 있으면 아무것도 렌더하지 않는다. 표시/숨김 타이밍은 호출하는 쪽에서 관리한다.

export default function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl bg-[var(--error)] px-5 py-3 text-[15px] font-bold text-white shadow-[0_8px_28px_rgba(0,0,0,0.18)]"
    >
      {message}
    </div>
  );
}
