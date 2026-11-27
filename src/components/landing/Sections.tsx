import { AlertTriangle, BadgeCheck, Bookmark, Camera, ChevronRight, Info, LayoutDashboard, ScanLine, ShieldCheck, Zap } from "lucide-react";
import { cta, features, howItWorks, resultPreview, trust } from "@/content/landing";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const container = "mx-auto w-full max-w-[1100px] px-5";

/** 섹션 제목: 애플처럼 크고 굵게, 가운데 */
function SectionTitle({ label, title, dark = false }: { label?: string; title: string; dark?: boolean }) {
  return (
    <Reveal className="text-center">
      {label && <p className={`text-[15px] font-semibold lg:text-lg ${dark ? "text-sky-mid" : "text-sky"}`}>{label}</p>}
      <h2 className={`mt-3 text-[36px] font-bold leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-[64px] ${dark ? "text-white" : ""}`}>{title}</h2>
    </Reveal>
  );
}

/** 인증 원리 3단계 */
export function HowItWorks() {
  const icons = [Zap, Camera, ScanLine];
  return (
    <section id="how" className={`${container} scroll-mt-16 py-24 lg:py-36`}>
      <SectionTitle label={howItWorks.label} title={howItWorks.title} />
      <ol className="mt-14 grid gap-5 lg:mt-20 lg:grid-cols-3">
        {howItWorks.steps.map((s, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={s.title} delay={i * 120}>
              <li className="flex h-full flex-col rounded-[28px] bg-soft p-8 lg:p-10">
                <span className="text-sm font-semibold text-sky">STEP {i + 1}</span>
                <Icon size={40} strokeWidth={1.6} className="mt-8 text-sky" />
                <div className="mt-8 text-2xl font-bold tracking-[-0.02em]">{s.title}</div>
                <p className="mt-3 text-[17px] leading-relaxed text-sub">{s.desc}</p>
              </li>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}

// 비즈 위치·감쇠 시간. 매번 같은 모양이 나오도록 고정된 규칙으로 만들어요.
const beads = Array.from({ length: 46 }, (_, i) => {
  // 브라우저마다 소수점 끝자리가 달라지지 않게 반올림해요.
  const r = (n: number) => Math.round((((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) + 1) % 1 * 1000) / 1000;
  return { x: 4 + r(1) * 92, y: 6 + r(2) * 88, size: 6 + r(3) * 12, duration: 2.2 + r(4) * 4.5, delay: r(5) * 3 };
});

/** 남색 섹션: 비즈마다 다른 속도로 잔광이 사라지는 장면 + 숫자 */
export function Trust() {
  return (
    <section className="bg-ink py-24 text-white lg:py-36">
      <div className={container}>
        <SectionTitle dark label="복제 불가능" title={`${trust.title[0]} ${trust.title[1]}`} />
        <Reveal>
          <p className="mx-auto mt-6 max-w-[640px] text-center text-[17px] leading-relaxed text-white/70 lg:text-xl">{trust.description}</p>
        </Reveal>

        <Reveal className="mt-14 lg:mt-20">
          <div aria-hidden="true" className="relative mx-auto aspect-[16/9] w-full max-w-[880px] overflow-hidden rounded-[32px] bg-[radial-gradient(ellipse_at_center,#123a57_0%,#0b1f2e_75%)] ring-1 ring-white/10">
            {beads.map((b, i) => (
              <span
                key={i}
                className="motion-safe-anim absolute animate-glow rounded-full bg-sky-mid shadow-[0_0_18px_6px_rgba(125,211,252,0.55)]"
                style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size, animationDuration: `${b.duration}s`, animationDelay: `${b.delay}s` }}
              />
            ))}
            <span className="absolute bottom-4 left-5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              비즈마다 다른 속도로 빛이 사라져요
            </span>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-[880px] grid-cols-3 gap-4 lg:mt-20">
          {trust.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120} className="text-center">
              <div className="bg-gradient-to-b from-white to-sky-mid bg-clip-text text-[40px] font-bold tracking-[-0.03em] text-transparent sm:text-6xl">{s.value}</div>
              <div className="mt-2 text-sm text-white/60 sm:text-base">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 결과 화면 미리보기 */
export function ResultPreview() {
  const r = resultPreview;
  return (
    <section className={`${container} py-24 lg:py-36`}>
      <SectionTitle label={r.label} title={r.title} />
      <Reveal className="mt-14 lg:mt-20">
        <div className="mx-auto grid max-w-[960px] overflow-hidden rounded-[32px] bg-soft lg:grid-cols-[1fr_1.1fr]">
          <div className="relative flex min-h-[260px] items-center justify-center bg-gradient-to-br from-sky-light to-soft">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-3xl bg-white shadow-float">
              <span className="absolute inset-3.5 rounded-2xl bg-[radial-gradient(circle,#7dd3fc_1.4px,transparent_1.7px)] [background-size:10px_10px]" />
              <span className="relative rounded bg-white px-2.5 py-1 text-lg font-bold tracking-[0.14em] text-sky-dark">PUF</span>
            </div>
            <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-ok px-3 py-1.5 text-sm font-bold text-white">
              <BadgeCheck size={16} />
              {r.badge}
            </span>
          </div>
          <div className="p-8 lg:p-12">
            <div className="text-sm text-muted">{r.category}</div>
            <div className="mt-1 text-3xl font-bold tracking-[-0.02em]">{r.product}</div>
            <div className="mt-1 text-sub">{r.maker}</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <span key={t} className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-sky-dark">{t}</span>
              ))}
            </div>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {r.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className={`mt-1 text-lg font-bold ${f.ok ? "text-ok" : ""}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-2xl bg-warn-light p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-warn">
                <AlertTriangle size={16} />
                {r.warningTitle}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-warn/90">{r.warning}</p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** 주요 기능: 크기가 다른 타일을 맞붙인 바둑판(벤토) 배치 */
export function Features() {
  const icons = [ShieldCheck, Info, Bookmark, AlertTriangle, LayoutDashboard];
  // 타일마다 차지하는 칸과 색
  const tile = [
    "md:col-span-2 md:row-span-2 bg-gradient-to-br from-sky to-sky-dark text-white",
    "bg-white",
    "bg-white",
    "bg-white",
    "md:col-span-2 bg-sky-light",
  ];
  return (
    <section className="bg-soft/60 py-24 lg:py-36">
      <div className={container}>
        <SectionTitle label={features.label} title={features.title} />
        <div className="mt-14 grid auto-rows-[minmax(220px,auto)] gap-4 md:grid-cols-3 lg:mt-20">
          {features.items.map((f, i) => {
            const Icon = icons[i];
            const big = i === 0;
            return (
              <Reveal key={f.title} delay={(i % 3) * 100} className={`${tile[i]} flex flex-col justify-between rounded-[28px] p-8`}>
                <Icon size={big ? 48 : 32} strokeWidth={1.6} className={big ? "text-white" : "text-sky"} />
                <div className="mt-10">
                  <div className={`font-bold tracking-[-0.02em] ${big ? "text-[32px] lg:text-[44px]" : "text-[22px]"}`}>{f.title}</div>
                  <p className={`mt-2 leading-relaxed ${big ? "max-w-[420px] text-lg text-white/85" : "text-[15px] text-sub"}`}>{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** 마지막 행동 유도 */
export function Cta() {
  return (
    <section className={`${container} py-24 text-center lg:py-36`}>
      <Reveal>
        <h2 className="text-[36px] font-bold leading-[1.15] tracking-[-0.03em] sm:text-5xl lg:text-[64px]">{cta.title}</h2>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] text-sub lg:text-xl">{cta.description}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Button href="/scan">{cta.button}</Button>
          <Button href="/signup" variant="link">
            회원가입
            <ChevronRight size={18} />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
