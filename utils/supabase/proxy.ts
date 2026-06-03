// 요청마다 Supabase 세션 쿠키를 갱신하는 헬퍼.
// Next.js 16에서 middleware는 proxy로 이름이 바뀌었다 → 루트 proxy.ts에서 호출한다.
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function updateSession(request: NextRequest) {
  // 기본 응답 — 이후 setAll에서 갱신된 쿠키를 실어 다시 만든다.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 토큰 만료 시 세션을 갱신한다. getClaims/getUser 호출이 갱신을 트리거한다.
  // 주의: createServerClient와 이 호출 사이에 다른 로직을 넣지 말 것.
  await supabase.auth.getUser();

  return supabaseResponse;
}
