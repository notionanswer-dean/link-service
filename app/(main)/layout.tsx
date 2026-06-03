// 메인 앱 셸: 헤더 + 사이드바를 한 번 렌더링하고 모든 메인 페이지를 감싼다.
// (auth) 그룹(로그인·회원가입)에는 적용되지 않아 그 페이지에선 셸이 보이지 않는다.
//
// 접근 제한: 이 그룹(인덱스·폴더별·새 링크 페이지)은 로그인한 사용자만 볼 수 있다.
// 렌더 전에 서버에서 세션을 검증하고, 미로그인 사용자는 /login으로 보낸다.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Next.js 16: cookies()는 Promise이므로 await 후 전달한다.
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  // getUser()는 Supabase Auth 서버에 토큰을 검증하므로 위조할 수 없다.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

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
