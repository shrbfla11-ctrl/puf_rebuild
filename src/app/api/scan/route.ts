import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { match, type Candidate, type Signature } from "@/lib/puf";
import { parseFrames } from "@/lib/puf/frames";

export const runtime = "nodejs";

/**
 * 정품 판별 API (POST /api/scan)
 * 연속 촬영한 사진 묶음을 받아 등록된 스티커 패턴과 대조해요.
 * 사진은 여기서 판별에만 쓰고 어디에도 저장하지 않아요.
 */
export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null);
  const parsed = await parseFrames(form);
  if ("error" in parsed) return NextResponse.json({ error: parsed.error }, { status: parsed.status });

  // 등록된 스티커 패턴 목록. Supabase 가 연결되기 전에는 비어 있어요(→ 어떤 스티커도 정품으로 나오지 않아요).
  let candidates: Candidate[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    const supabase = await createClient();
    const { data } = await supabase.rpc("list_signatures");
    candidates = ((data as { serial: string; signature: unknown }[] | null) ?? []).map((r) => ({
      serial: r.serial,
      signature: r.signature as Signature,
    }));
  }

  const verdict = await match(parsed.frames, parsed.timestamps, candidates);
  return NextResponse.json({ ...verdict, enrolledCount: candidates.length });
}
