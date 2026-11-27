import { AlertTriangle, BadgeCheck, Bookmark, Camera, Check, Info, LayoutDashboard, ScanLine, ShieldCheck } from "lucide-react";
import { cta, features, howItWorks, resultPreview, trust } from "@/content/landing";
import { Button } from "@/components/ui/Button";

/** 섹션 제목 (작은 라벨 + 큰 제목) */
function SectionTitle({ label, title, center = false }: { label?: string; title: string; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      {label && <div className="text-sm font-semibold text-sky">{label}</div>}
      <h2 className="mt-2 text-[28px] font-bold leading-[1.3] tracking-[-0.02em] lg:text-4xl">{title}</h2>
    </div>
  );
}

const container = "mx-auto w-full max-w-[1200px] px-5 lg:px-8";

/** 사용 방법 3단계 */
export function HowItWorks() {
  const icons = [Camera, ScanLine, Info];
  return (
    <section id="how" className={`${container} scroll-mt-20 py-16 lg:py-24`}>
      <SectionTitle label={howItWorks.label} title={howItWorks.title} center />
      <ol className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3 lg:gap-6">
        {howItWorks.steps.map((s, i) => {
          const Icon = icons[i];
          return (
            <li key={s.title} className="relative rounded-2xl border border-line bg-white p-6 lg:p-8">
              <span className="absolute right-6 top-6 text-4xl font-bold text-sky-light">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-light text-sky">
                <Icon size={24} />
              </span>
              <div className="mt-5 text-lg font-bold">{s.title}</div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-sub">{s.desc}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** 결과 화면 미리보기 */
export function ResultPreview() {
  const r = resultPreview;
  return (
    <section className="bg-soft py-16 lg:py-24">
      <div className={container}>
        <SectionTitle label={r.label} title={r.title} center />
        <div className="mx-auto mt-10 grid max-w-[960px] overflow-hidden rounded-2xl border border-line bg-white shadow-card lg:mt-14 lg:grid-cols-[360px_1fr]">
          <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-sky-light to-soft lg:h-auto">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl bg-white shadow-float lg:h-40 lg:w-40">
              <span className="absolute inset-3 rounded-xl bg-[radial-gradient(circle,#7dd3fc_1.4px,transparent_1.7px)] [background-size:10px_10px]" />
              <span className="relative rounded bg-white px-2.5 py-1 text-lg font-bold tracking-[0.14em] text-sky-dark">PUF</span>
            </div>
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-md bg-ok px-2.5 py-1 text-xs font-bold text-white">
              <BadgeCheck size={14} />
              {r.badge}
            </span>
          </div>

          <div className="p-6 lg:p-10">
            <div className="text-sm text-muted">{r.category}</div>
            <div className="mt-1 text-2xl font-bold lg:text-3xl">{r.product}</div>
            <div className="mt-1 text-[15px] text-sub">{r.maker}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {r.tags.map((t) => (
                <span key={t} className="rounded-md bg-sky-light px-2.5 py-1.5 text-[13px] font-semibold text-sky-dark">{t}</span>
              ))}
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {r.facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-xs text-muted">{f.label}</dt>
                  <dd className={`mt-1 font-semibold ${f.ok ? "text-ok" : ""}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 rounded-xl bg-warn-light p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-warn">
                <AlertTriangle size={16} />
                {r.warningTitle}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-warn/90">{r.warning}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 주요 기능 */
export function Features() {
  const icons = [ShieldCheck, Info, Bookmark, AlertTriangle, LayoutDashboard];
  return (
    <section className={`${container} py-16 lg:py-24`}>
      <SectionTitle label={features.label} title={features.title} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-6">
        {features.items.map((f, i) => {
          const Icon = icons[i];
          const first = i === 0;
          return (
            <div
              key={f.title}
              className={`flex flex-col justify-between gap-8 rounded-2xl p-6 lg:p-8 ${
                first ? "bg-sky text-white sm:col-span-2 lg:col-span-3 lg:row-span-2" : "border border-line bg-white lg:col-span-3 xl:col-span-3"
              } ${i >= 3 ? "lg:col-span-3" : ""}`}
            >
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${first ? "bg-white/20" : "bg-sky-light text-sky"}`}>
                <Icon size={24} />
              </span>
              <div>
                <div className={`font-bold ${first ? "text-2xl" : "text-lg"}`}>{f.title}</div>
                <p className={`mt-1.5 leading-relaxed ${first ? "text-white/85" : "text-[15px] text-sub"}`}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** 신뢰 섹션 (숫자 강조) */
export function Trust() {
  return (
    <section className={`${container} pb-16 lg:pb-24`}>
      <div className="grid gap-10 rounded-3xl border border-line bg-gradient-to-br from-white to-sky-light/60 p-8 lg:grid-cols-2 lg:items-center lg:p-14">
        <div>
          <ShieldCheck size={36} className="text-sky" />
          <h2 className="mt-4 text-[26px] font-bold leading-[1.3] tracking-[-0.02em] lg:text-[34px]">
            {trust.title[0]}
            <br />
            {trust.title[1]}
          </h2>
          <p className="mt-3 max-w-[460px] leading-relaxed text-sub">{trust.description}</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {trust.stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white p-5 text-center shadow-card">
              <div className="text-2xl font-bold text-sky lg:text-3xl">{s.value}</div>
              <div className="mt-1.5 text-xs leading-snug text-sub lg:text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** 마지막 행동 유도 배너 */
export function Cta() {
  return (
    <section className={`${container} pb-16 lg:pb-24`}>
      <div className="flex flex-col items-start gap-6 rounded-3xl bg-gradient-to-br from-sky to-sky-dark p-8 text-white lg:flex-row lg:items-center lg:justify-between lg:p-14">
        <div>
          <h2 className="text-[26px] font-bold leading-[1.3] lg:text-[34px]">{cta.title}</h2>
          <p className="mt-2 text-white/85">{cta.description}</p>
        </div>
        <Button href="/scan" variant="white" icon={<Check size={18} />}>{cta.button}</Button>
      </div>
    </section>
  );
}
