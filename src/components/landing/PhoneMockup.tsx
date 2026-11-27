import { Check } from "lucide-react";
import { resultPreview } from "@/content/landing";

/** 카메라가 스티커를 인식하는 과정을 보여주는 휴대폰 그림 (6초마다 반복) */
export function PhoneMockup() {
  const corner = "absolute h-7 w-7 border-sky [border-width:3px]";

  return (
    <div className="relative mx-auto h-[460px] w-full max-w-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-light to-soft lg:h-[560px]">
      {/* 배경 점 패턴 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#bae6fd_1px,transparent_1.5px)] [background-size:18px_18px] opacity-60" />

      {/* 휴대폰 본체 */}
      <div className="absolute left-1/2 top-8 h-[560px] w-[270px] -translate-x-1/2 rounded-[40px] border-[10px] border-white bg-white shadow-float lg:top-12">
        <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#0f2a3d]">
          <div className="absolute left-1/2 top-2.5 h-6 w-20 -translate-x-1/2 rounded-full bg-black/60" />
          <div className="absolute inset-x-0 top-12 text-center text-xs font-medium text-white/70">
            스티커를 사각형 안에 맞춰 주세요
          </div>

          {/* 촬영 프레임 + 스티커 */}
          <div className="absolute left-1/2 top-[84px] h-[176px] w-[176px] -translate-x-1/2">
            <span className={`${corner} left-0 top-0 rounded-tl-lg border-b-0 border-r-0`} />
            <span className={`${corner} right-0 top-0 rounded-tr-lg border-b-0 border-l-0`} />
            <span className={`${corner} bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0`} />
            <span className={`${corner} bottom-0 right-0 rounded-br-lg border-l-0 border-t-0`} />

            <div className="absolute left-1/2 top-1/2 flex h-[104px] w-[104px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white">
              <span className="absolute inset-2.5 rounded-lg bg-[radial-gradient(circle,#7dd3fc_1.3px,transparent_1.6px)] [background-size:9px_9px]" />
              <span className="relative rounded bg-white px-2 py-0.5 text-sm font-bold tracking-[0.14em] text-sky-dark">PUF</span>
              <span className="motion-safe-anim absolute inset-3 animate-hl rounded-md border-2 border-sky bg-sky/10" />
            </div>

            <div className="motion-safe-anim absolute inset-x-0 h-0.5 animate-scan bg-gradient-to-r from-sky-mid/0 via-sky-mid to-sky-mid/0 shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]" />
          </div>

          {/* 인식 완료 체크 */}
          <div className="motion-safe-anim absolute right-7 top-[226px] flex h-11 w-11 animate-check items-center justify-center rounded-full bg-ok text-white">
            <Check size={22} strokeWidth={2.5} />
          </div>

          {/* 결과 카드 */}
          <div className="motion-safe-anim absolute inset-x-3 top-[290px] animate-card rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="rounded-md bg-ok-light px-2 py-1 text-[11px] font-bold text-ok">{resultPreview.badge}</span>
              <span className="text-[11px] text-muted">패턴 일치</span>
            </div>
            <div className="mt-2 text-base font-bold">{resultPreview.product}</div>
            <div className="mt-0.5 text-xs text-muted">{resultPreview.maker}</div>
            <div className="mt-2 flex gap-1">
              {resultPreview.tags.slice(0, 2).map((t) => (
                <span key={t} className="rounded-md bg-sky-light px-2 py-1 text-[11px] font-semibold text-sky-dark">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
