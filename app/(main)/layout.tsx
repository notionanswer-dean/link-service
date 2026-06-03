// 메인 앱 셸: 헤더 + 사이드바를 한 번 렌더링하고 모든 메인 페이지를 감싼다.
// (auth) 그룹(로그인·회원가입)에는 적용되지 않아 그 페이지에선 셸이 보이지 않는다.

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* 헤더 아래로 사이드바 + 페이지 본문을 나란히 배치 (모든 메인 페이지 공유) */}
      <div className="flex flex-1 flex-col sm:flex-row">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
