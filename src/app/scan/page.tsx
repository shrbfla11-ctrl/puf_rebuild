import type { Metadata } from "next";
import { ImagePlus, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { TabBar } from "@/components/app/TabBar";
import { ScanView } from "@/components/scan/ScanView";
import { getUser } from "@/lib/auth/user";
import { scanTips } from "@/content/scan";

export const metadata: Metadata = { title: "정품 확인 - PUF" };

// 정품 확인(스캔) 페이지 (주소: /scan)
// 모바일: 전체 화면 카메라 + 하단 탭바 / 데스크톱: 카드형 카메라 + 오른쪽 촬영 팁
// TODO: 데이터베이스 연결 후 로그인한 사람만 들어올 수 있게 하고, 결과를 내 기록에 저장해요.
export default async function ScanPage() {
  const user = await getUser();
  return (
    <>
      <div className="hidden lg:block">
        <Nav user={user} />
      </div>

      <main className="lg:bg-soft lg:px-8 lg:py-12">
        <div className="lg:mx-auto lg:grid lg:max-w-[1100px] lg:grid-cols-[1fr_380px] lg:gap-10">
          <div className="h-[calc(100dvh-84px)] lg:h-[720px] lg:overflow-hidden lg:rounded-[32px] lg:shadow-float">
            <ScanView frameClass="w-[min(240px,30dvh)] lg:w-[300px]" />
          </div>

          <aside className="hidden flex-col gap-4 lg:flex">
            <div className="rounded-3xl bg-white p-6 shadow-card">
              <div className="text-sm font-bold text-sky">촬영 팁</div>
              <ol className="mt-4 flex flex-col gap-4">
                {scanTips.map((tip, i) => (
                  <li key={tip.title} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-sky-light text-sm font-bold text-sky">{i + 1}</span>
                    <div>
                      <div className="font-bold">{tip.title}</div>
                      <div className="mt-1 text-sm leading-relaxed text-sub">{tip.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-start gap-3 rounded-3xl bg-white p-6 shadow-card">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-ok-light text-ok"><ShieldCheck size={20} /></span>
              <div>
                <div className="font-bold">이미지는 저장되지 않아요</div>
                <div className="mt-1 text-sm leading-relaxed text-sub">촬영 이미지는 패턴 대조 직후 삭제되며 서버에 남지 않아요.</div>
              </div>
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-2xl bg-sky-light px-4 py-3 text-sm font-semibold text-sky-dark">
              <ImagePlus size={18} />
              갤러리 업로드는 카메라 화면의 오른쪽 버튼을 이용하세요
            </div>
          </aside>
        </div>
      </main>

      <TabBar active="scan" dark />
    </>
  );
}
