import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** 서버(서버 컴포넌트, API)에서 쓰는 Supabase 연결. 로그인 정보는 쿠키로 주고받아요. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없어요. proxy.ts 가 대신 갱신하니 무시해도 돼요.
          }
        },
      },
    },
  );
}
