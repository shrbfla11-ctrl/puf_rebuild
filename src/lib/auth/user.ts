import { createClient } from "@/lib/supabase/server";

export type UserSummary = { id: string; email: string | null; name: string | null };

/** 지금 로그인한 사람의 정보를 가져와요. 로그인 안 했으면 null. */
export async function getUser(): Promise<UserSummary | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const name = (user.user_metadata as { name?: string } | null)?.name?.trim() || null;
  return { id: user.id, email: user.email ?? null, name };
}
