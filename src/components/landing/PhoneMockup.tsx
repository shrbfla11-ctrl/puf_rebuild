import { Check } from "lucide-react";
import { resultPreview } from "@/content/landing";

/** 정면으로 선 아이폰. 뒤에서 하늘색 잔광이 퍼지고, 화면에서는 스티커 인식이 6초마다 반복돼요. */
export function PhoneMockup() {
  const corner = "absolute h-7 w-7 border-sky [border-width:3px]";

  return (
    <div aria-hidden="true" className="relative mx-auto h-[560px] w-full max-w-[520px] sm:h-[680px]">
      {/* 뒤쪽 후광 (잔광 느낌) */}
      <div className="motion-safe-anim absolute left-1/2 top-1/2 h-[520px] w-[520px] animate-halo rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.75)_0%,rgba(186,230,253,0.45)_35%,rgba(255,255,255,0)_70%)] blur-2xl" />

      {/* 아이폰 */}
      <div className="absolute left-1/2 top-0 h-[560px] w-[272px] origin-top -translate-x-1/2 scale-[0.92] sm:h-[620px] sm:w-[300px] sm:scale-100">
        {/* 옆 버튼들 */}
        <span className="absolute -left-[3px] top-[110px] h-8 w-[3px] rounded-l bg-[#b9c4ce]" />
        <span className="absolute -left-[3px] top-[160px] h-14 w-[3px] rounded-l bg-[#b9c4ce]" />
        <span className="absolute -left-[3px] top-[228px] h-14 w-[3px] rounded-l bg-[#b9c4ce]" />
        <span className="absolute -right-[3px] top-[180px] h-20 w-[3px] rounded-r bg-[#b9c4ce]" />

        {/* 티타늄 테두리 */}
        <div className="h-full w-full rounded-[52px] bg-gradient-to-br from-[#f4f7fa] via-[#cfd8e1] to-[#9fadba] p-[3px] shadow-[0_40px_80px_-20px_rgba(15,42,61,0.45)]">
          <div className="h-full w-full rounded-[49px] bg-[#0b1620] p-[10px]">
            {/* 화면 */}
            <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-[#12324a] to-[#0b1f2e]">
              <div className="absolute left-1/2 top-3 z-10 h-[30px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
              <div className="absolute inset-x-7 top-[18px] flex justify-between text-[12px] font-semibold text-white">
                <span>9:41</span>
                <span>5G</span>
              </div>

              <div className="absolute inset-x-0 top-[78px] text-center">
                <div className="text-[17px] font-bold text-white">정품 확인</div>
                <div className="mt-1 text-[12px] text-white/60">스티커를 사각형 안에 맞춰 주세요</div>
              </div>

              {/* 촬영 프레임 + 스티커 */}
              <div className="absolute left-1/2 top-[148px] h-[200px] w-[200px] -translate-x-1/2">
                <span className={`${corner} left-0 top-0 rounded-tl-lg border-b-0 border-r-0`} />
                <span className={`${corner} right-0 top-0 rounded-tr-lg border-b-0 border-l-0`} />
                <span className={`${corner} bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0`} />
                <span className={`${corner} bottom-0 right-0 rounded-br-lg border-l-0 border-t-0`} />

                <div className="absolute left-1/2 top-1/2 flex h-[118px] w-[118px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white">
                  <span className="absolute inset-2.5 rounded-lg bg-[radial-gradient(circle,#7dd3fc_1.3px,transparent_1.6px)] [background-size:9px_9px]" />
                  <span className="relative rounded bg-white px-2 py-0.5 text-sm font-bold tracking-[0.14em] text-sky-dark">PUF</span>
                  <span className="motion-safe-anim absolute inset-3 animate-hl rounded-md border-2 border-sky bg-sky/10" />
                </div>
                <div className="motion-safe-anim absolute inset-x-0 h-0.5 animate-scan bg-gradient-to-r from-sky-mid/0 via-sky-mid to-sky-mid/0 shadow-[0_0_12px_2px_rgba(125,211,252,0.6)]" />
              </div>

              <div className="motion-safe-anim absolute right-6 top-[318px] flex h-11 w-11 animate-check items-center justify-center rounded-full bg-ok text-white">
                <Check size={22} strokeWidth={2.5} />
              </div>

              {/* 결과 카드 */}
              <div className="motion-safe-anim absolute inset-x-3 bottom-8 animate-card rounded-3xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-ok-light px-2.5 py-1 text-[11px] font-bold text-ok">{resultPreview.badge}</span>
                  <span className="text-[11px] text-muted">패턴 일치</span>
                </div>
                <div className="mt-2 text-base font-bold text-ink">{resultPreview.product}</div>
                <div className="mt-0.5 text-xs text-muted">{resultPreview.maker}</div>
                <div className="mt-2 flex gap-1">
                  {resultPreview.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded-full bg-sky-light px-2.5 py-1 text-[11px] font-semibold text-sky-dark">{t}</span>
                  ))}
                </div>
              </div>

              {/* 화면 반사광 */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_40%)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
