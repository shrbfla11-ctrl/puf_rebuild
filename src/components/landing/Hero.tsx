import { ArrowRight, Camera, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/landing";
import { PhoneMockup } from "./PhoneMockup";

/** 첫 화면: 큰 제목 + 버튼 + 휴대폰 그림 */
export function Hero() {
  return (
    <section className="bg-gradient-to-b from-soft to-white">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-5 pb-16 pt-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-mid/60 bg-white px-3 py-1.5 text-[13px] font-medium text-sky-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-sky" />
            {hero.badge}
          </span>
          <h1 className="mt-5 text-[34px] font-bold leading-[1.25] tracking-[-0.02em] lg:text-[48px]">
            {hero.title[0]}
            <br />
            <span className="text-sky">{hero.title[1]}</span>
          </h1>
          <p className="mt-5 max-w-[460px] text-base leading-relaxed text-sub lg:text-lg">{hero.description}</p>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row">
            <Button href="/scan" icon={<Camera size={20} />}>{hero.primaryButton}</Button>
            <Button href="#how" variant="outline" icon={<ArrowRight size={18} />}>{hero.secondaryButton}</Button>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-sub">
            {hero.points.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check size={16} className="text-sky" strokeWidth={2.5} />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
