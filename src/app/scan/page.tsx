import type { Metadata } from "next";
import { ScanView } from "@/components/scan/ScanView";

export const metadata: Metadata = { title: "정품 확인 - PUF" };

// 정품 확인(스캔) 페이지 (주소: /scan)
// TODO: Supabase 연결 후에는 로그인한 사람만 들어올 수 있게 하고, 결과를 내 기록에 저장해요.
export default function ScanPage() {
  return <ScanView />;
}
