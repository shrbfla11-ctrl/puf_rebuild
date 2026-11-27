import { Camera, Check, ScanLine, Zap } from "lucide-react";
import { resultPreview } from "@/content/landing";

// 스티커 속 형광 비즈: 위치, 크기, 잔광 속도(빠름·보통·느림), 색(초록~노랑).
// 스티커와 폰 화면에서 같이 써요.
const beads: { x: number; y: number; s: number; speed: "fast" | "mid" | "slow"; c: number }[] = [
  { x: 14, y: 18, s: 9, speed: "slow", c: 0 }, { x: 38, y: 12, s: 6, speed: "fast", c: 2 }, { x: 66, y: 20, s: 8, speed: "mid", c: 1 },
  { x: 84, y: 34, s: 6, speed: "fast", c: 3 }, { x: 24, y: 42, s: 7, speed: "mid", c: 2 }, { x: 52, y: 40, s: 10, speed: "slow", c: 1 },
  { x: 76, y: 58, s: 7, speed: "slow", c: 0 }, { x: 12, y: 66, s: 6, speed: "fast", c: 1 }, { x: 40, y: 64, s: 8, speed: "fast", c: 3 },
  { x: 60, y: 78, s: 6, speed: "mid", c: 0 }, { x: 30, y: 86, s: 7, speed: "slow", c: 2 }, { x: 86, y: 84, s: 8, speed: "mid", c: 1 },
  { x: 48, y: 22, s: 5, speed: "mid", c: 3 }, { x: 70, y: 40, s: 5, speed: "fast", c: 0 }, { x: 22, y: 26, s: 5, speed: "fast", c: 1 },
];
const beadClass = { fast: "hero-bead-fast", mid: "hero-bead-mid", slow: "hero-bead-slow" };
// 형광 입자 색: 연두 · 라임 · 노랑빛 초록 · 초록
const phosphor = [
  { core: "#d9f99d", glow: "rgba(190,242,100,0.85)" },
  { core: "#bef264", glow: "rgba(163,230,53,0.85)" },
  { core: "#ecfccb", glow: "rgba(234,250,120,0.85)" },
  { core: "#a3e635", glow: "rgba(132,204,22,0.85)" },
];

/** 투명 필름에 형광 비즈가 박힌 PUF 스티커 */
function Sticker({ size, label = false }: { size: number; label?: boolean }) {
  const k = size / 120;
  return (
    <div className="relative rounded-2xl" style={{ width: size, height: size }}>
      {/* 투명 필름: 칠 없이 얇은 테두리 + 가장자리 반사광만 (뒤 배경이 그대로 비쳐요) */}
      <div className="absolute inset-0 rounded-2xl shadow-[0_8px_18px_-6px_rgba(15,42,61,0.18),inset_0_0_0_1px_rgba(15,42,61,0.16),inset_0_0_0_2px_rgba(255,255,255,0.55)]" />
      <div className="absolute inset-[3px] rounded-[13px] bg-[linear-gradient(135deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0)_22%,rgba(255,255,255,0)_78%,rgba(255,255,255,0.25)_100%)]" />
      <div className="absolute inset-[10%]">
        {beads.map((b, i) => {
          const p = phosphor[b.c];
          const pos = { left: `${b.x}%`, top: `${b.y}%`, width: b.s * k, height: b.s * k };
          return (
            <span key={i}>
              {/* 빛을 안 받았을 때도 희미하게 보이는 입자 */}
              <span className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45" style={{ ...pos, background: p.core }} />
              {/* 플래시를 받으면 빛났다가 서서히 사라지는 잔광 */}
              <span
                className={`${beadClass[b.speed]} absolute -translate-x-1/2 -translate-y-1/2 rounded-full`}
                style={{ ...pos, background: p.core, boxShadow: `0 0 ${10 * k}px ${3 * k}px ${p.glow}` }}
              />
            </span>
          );
        })}
      </div>
      {label && <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-sub">PUF 스티커</span>}
    </div>
  );
}

// 감쇠 그래프 곡선: 밝기가 시간이 지나며 줄어드는 모양 (τ 가 클수록 천천히 줄어요)
const curve = (tau: number) =>
  Array.from({ length: 21 }, (_, i) => {
    const x = i * 10;
    const y = 62 - 54 * Math.exp(-x / tau);
    return `${i ? "L" : "M"}${x} ${Math.round(y * 10) / 10}`;
  }).join(" ");

/** 폰 앞면: 연속 촬영 + 감쇠 그래프 + 판정 결과 */
function FrontScreen() {
  const corner = "absolute h-6 w-6 border-sky [border-width:3px]";
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[40px] bg-gradient-to-b from-[#12324a] to-[#0b1f2e]">
      <div className="absolute left-1/2 top-3 z-10 h-[28px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
      <div className="absolute inset-x-7 top-[17px] flex justify-between text-[12px] font-semibold text-white">
        <span>9:41</span>
        <span>5G</span>
      </div>
      <div className="absolute inset-x-0 top-[62px] text-center text-[16px] font-bold text-white">정품 확인</div>

      {/* 뷰파인더 속 스티커 */}
      <div className="absolute left-1/2 top-[100px] h-[176px] w-[176px] -translate-x-1/2">
        <span className={`${corner} left-0 top-0 rounded-tl-lg border-b-0 border-r-0`} />
        <span className={`${corner} right-0 top-0 rounded-tr-lg border-b-0 border-l-0`} />
        <span className={`${corner} bottom-0 left-0 rounded-bl-lg border-r-0 border-t-0`} />
        <span className={`${corner} bottom-0 right-0 rounded-br-lg border-l-0 border-t-0`} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Sticker size={120} />
        </div>
        <div className="hero-check absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ok text-white shadow-lg">
          <Check size={20} strokeWidth={3} />
        </div>
      </div>

      {/* 연속 촬영 진행 */}
      <div className="absolute inset-x-6 top-[296px]">
        <div className="flex justify-between text-[11px] font-medium text-white/70">
          <span>연속 촬영</span>
          <span>15장 · 0.2초 간격</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="hero-bar h-full rounded-full bg-sky-mid" />
        </div>
      </div>

      {/* 감쇠 그래프 */}
      <div className="absolute inset-x-5 top-[334px] rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
        <div className="text-[11px] font-medium text-white/70">비즈별 잔광 감쇠</div>
        <svg viewBox="0 0 200 66" className="mt-1.5 h-[66px] w-full overflow-visible">
          <line x1="0" y1="64" x2="200" y2="64" stroke="rgba(255,255,255,0.15)" />
          {[25, 60, 140].map((tau, i) => (
            <path key={tau} d={curve(tau)} pathLength={1} fill="none" strokeWidth="2.2" strokeLinecap="round"
              className="hero-curve" stroke={["#bef264", "#a3e635", "#ecfccb"][i]} />
          ))}
        </svg>
      </div>

      {/* 판정 결과 카드 */}
      <div className="hero-card absolute inset-x-3 bottom-4 rounded-3xl bg-white p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-ok-light px-2.5 py-1 text-[11px] font-bold text-ok">{resultPreview.badge}</span>
          <span className="text-[11px] text-muted">{resultPreview.tags[0]}</span>
        </div>
        <div className="mt-2 text-[15px] font-bold text-ink">{resultPreview.product}</div>
        <div className="mt-0.5 text-xs text-muted">{resultPreview.maker}</div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0)_40%)]" />
    </div>
  );
}

/** 폰 뒷면: 옆모습 위주라 거의 안 보여요. 단정한 유리판만 */
function BackSide() {
  return <div className="h-full w-full rounded-[49px] bg-gradient-to-br from-[#eef4f8] via-[#d9e4ec] to-[#b8c8d5]" />;
}

/** 폰 옆면: 얇은 티타늄 테두리 + 뒤로 튀어나온 카메라 부분과 플래시 */
function SideEdge() {
  return (
    <div className="relative h-full w-full rounded-[8px] bg-gradient-to-r from-[#8e9ead] via-[#e8eef3] to-[#a9b8c5] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]">
      {/* 옆 버튼 */}
      <span className="absolute left-1/2 top-[120px] h-9 w-[3px] -translate-x-1/2 rounded bg-[#7f909f]" />
      <span className="absolute left-1/2 top-[172px] h-14 w-[3px] -translate-x-1/2 rounded bg-[#7f909f]" />
      <span className="absolute left-1/2 top-[240px] h-14 w-[3px] -translate-x-1/2 rounded bg-[#7f909f]" />
      {/* 뒤로 튀어나온 카메라 부분 (왼쪽 = 뒷면 방향) */}
      <span className="absolute -left-[7px] top-[22px] h-[118px] w-[9px] rounded-l-[6px] bg-gradient-to-r from-[#7d8e9d] to-[#c5d2dc]" />
      <span className="absolute -left-[11px] top-[34px] h-[40px] w-[6px] rounded-l-[4px] bg-[#2a3a48]" />
      <span className="absolute -left-[11px] top-[86px] h-[40px] w-[6px] rounded-l-[4px] bg-[#2a3a48]" />
      {/* 플래시 */}
      <span className="absolute -left-[9px] top-[76px] h-[8px] w-[5px] rounded-l-[3px] bg-[#fff8e1]">
        <span className="hero-flash absolute -inset-1 rounded-full bg-white shadow-[0_0_18px_8px_rgba(255,255,255,1)]" />
      </span>
    </div>
  );
}

/** 플래시에서 스티커까지 퍼지는 빛줄기 + 플래시 지점의 번쩍임 */
function FlashBeam({ className, w, h, from, to }: { className: string; w: number; h: number; from: [number, number]; to: [number, number] }) {
  const [fx, fy] = from;
  const [tx, ty] = to;
  const spread = 78; // 스티커 쪽에서 빛이 퍼지는 폭
  return (
    <svg className={`hero-flash pointer-events-none absolute inset-0 z-20 ${className}`} width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`beam-${w}`} x1={fx} y1={fy} x2={tx} y2={ty} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#bae6fd" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`burst-${w}`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft-${w}`}><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <polygon points={`${fx - 4},${fy} ${fx + 4},${fy} ${tx + spread},${ty} ${tx - spread},${ty}`} fill={`url(#beam-${w})`} filter={`url(#soft-${w})`} />
      <circle cx={fx} cy={fy} r="70" fill={`url(#burst-${w})`} />
    </svg>
  );
}

/** 첫 화면 애니메이션: 옆모습 플래시로 스티커 충전 → 부드럽게 돌아 앞면에서 판독 */
export function PhoneMockup() {
  const steps = [
    { Icon: Zap, label: "플래시로 빛 충전", short: "빛 충전", cls: "hero-step1" },
    { Icon: Camera, label: "꺼진 뒤 연속 촬영", short: "연속 촬영", cls: "hero-step2" },
    { Icon: ScanLine, label: "감쇠 패턴 판별", short: "패턴 판별", cls: "hero-step3" },
  ];
  const W = 270;
  const H = 560;
  const T = 18; // 폰 두께

  return (
    <div className="hero-anim mx-auto w-full max-w-[600px]">
      <div aria-hidden="true" className="relative mx-auto h-[560px] w-[360px] origin-top scale-[0.8] sm:h-[660px] sm:w-[560px] sm:scale-100">
        {/* 뒤쪽 후광 */}
        <div className="motion-safe-anim absolute left-1/2 top-[46%] h-[520px] w-[520px] animate-halo rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.55)_0%,rgba(186,230,253,0.3)_35%,rgba(255,255,255,0)_70%)] blur-2xl" />

        {/* 바닥에 누운 스티커 (비스듬히 내려다본 모습) */}
        <div className="absolute bottom-[34px] left-[2px] [perspective:700px] sm:bottom-[44px] sm:left-[40px]">
          <div className="relative [transform:rotateX(58deg)_rotateZ(-18deg)]">
            <Sticker size={128} />
            <span className="hero-flash pointer-events-none absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(186,230,253,0.6),rgba(186,230,253,0.25)_55%,rgba(186,230,253,0))]" />
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-semibold text-sub">PUF 스티커</span>
        </div>

        {/* 플래시 빛줄기 */}
        <FlashBeam className="sm:hidden" w={360} h={560} from={[155, 98]} to={[70, 466]} />
        <FlashBeam className="hidden sm:block" w={560} h={660} from={[315, 98]} to={[108, 556]} />

        {/* 바닥 그림자 */}
        <div className="hero-shadow absolute bottom-[16px] left-[62%] h-6 w-[260px] rounded-[50%] bg-[#0f2a3d]/30 blur-xl sm:left-[60%]" />

        {/* 휴대폰: 앞면·뒷면·옆면으로 만든 입체 */}
        <div className="absolute right-0 top-0 [perspective:2000px] sm:right-[40px]" style={{ width: W, height: H }}>
          <div className="hero-float h-full w-full">
            <div className="hero-phone relative h-full w-full">
              <div className="hero-face absolute inset-0 rounded-[52px] bg-gradient-to-br from-[#f4f7fa] via-[#cfd8e1] to-[#9fadba] p-[3px] shadow-[0_40px_80px_-24px_rgba(15,42,61,0.45)]" style={{ transform: `translateZ(${T / 2}px)` }}>
                <div className="h-full w-full rounded-[49px] bg-[#0b1620] p-[9px]">
                  <FrontScreen />
                </div>
              </div>
              <div className="hero-face absolute inset-0 rounded-[52px] bg-gradient-to-br from-[#f4f7fa] via-[#cfd8e1] to-[#9fadba] p-[3px]" style={{ transform: `rotateY(180deg) translateZ(${T / 2}px)` }}>
                <BackSide />
              </div>
              <div className="hero-face absolute top-[26px]" style={{ left: (W - T) / 2, width: T, height: H - 52, transform: `rotateY(-90deg) translateZ(${W / 2}px)` }}>
                <SideEdge />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 단계 표시 */}
      <ol className="mx-auto mt-2 flex max-w-[520px] justify-center gap-2 sm:mt-8 sm:gap-3">
        {steps.map(({ Icon, label, short, cls }, i) => (
          <li key={label} className={`${cls} flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-3 py-2 text-[13px] font-semibold text-ink shadow-card ring-1 ring-line sm:px-4 sm:text-sm`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky text-[11px] text-white">{i + 1}</span>
            <Icon size={15} className="hidden text-sky sm:block" />
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
