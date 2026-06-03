// Auth 콜백 라우트 핸들러 (/auth/callback)
// 이메일 링크(비밀번호 재설정 등)의 PKCE code를 세션으로 교환한 뒤,
// next 파라미터가 가리키는 페이지로 리다이렉트한다.

import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // 교환 성공 시 이동할 경로(기본값: 인덱스)
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // code가 없거나 교환에 실패하면 로그인 페이지로 보낸다.
  return NextResponse.redirect(`${origin}/login`);
}
