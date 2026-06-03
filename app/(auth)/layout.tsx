// 인증(로그인·회원가입) 그룹 레이아웃: 헤더·사이드바 없이 본문을 화면 중앙에 배치한다.
// 루트 레이아웃이 html/body를 제공하므로 여기서는 중앙 정렬 컨테이너만 둔다.

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      {children}
    </main>
  );
}
