import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { hero } from "@/content/landing";
import { PhoneMockup } from "./PhoneMockup";

/** 첫 화면: 가운데 큰 제목 + 알약 버튼 + 정면 아이폰 (애플 제품 페이지 느낌) */
export function Hero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-white via-soft to-white">
      <div className="mx-auto w-full max-w-[1100px] px-5 pt-16 text-center lg:pt-24">
        <Reveal>
          <p className="text-[15px] font-semibold text-sky lg:text-lg">{hero.badge}</p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 text-[36px] font-bold leading-[1.15] tracking-[-0.035em] sm:text-[64px] lg:text-[84px]">
            {hero.title[0]}
            <br />
            <span className="bg-gradient-to-r from-sky-dark via-sky to-sky-mid bg-clip-text text-transparent">{hero.title[1]}</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-[600px] text-[17px] leading-relaxed text-sub lg:text-xl">{hero.description}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Button href="/scan">{hero.primaryButton}</Button>
            <Button href="#how" variant="link" icon={null}>
              {hero.secondaryButton}
              <ChevronRight size={18} />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={320} className="mt-14 lg:mt-20">
          <PhoneMockup />
        </Reveal>
      </div>
    </section>
  );
}
