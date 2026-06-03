// 브라우저(클라이언트 컴포넌트)용 Supabase 클라이언트
// "use client" 컴포넌트나 모듈 레벨 스토어(store.ts)에서 사용한다.
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl!, supabaseKey!);
