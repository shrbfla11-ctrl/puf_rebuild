// 로고 속 형광 입자: 위치, 크기, 색 (초록~노랑). 흰 배경에서도 보이게 조금 진한 톤을 섞었어요.
const dots = [
  { cx: 9, cy: 9, r: 2.1, c: "#84cc16" },
  { cx: 16, cy: 11, r: 1.4, c: "#a3e635" },
  { cx: 23, cy: 8, r: 1.8, c: "#65a30d" },
  { cx: 11, cy: 17, r: 1.4, c: "#bef264" },
  { cx: 19, cy: 18, r: 2.3, c: "#84cc16" },
  { cx: 24, cy: 15, r: 1.2, c: "#a3e635" },
  { cx: 8, cy: 24, r: 1.6, c: "#65a30d" },
  { cx: 15, cy: 24, r: 1.2, c: "#a3e635" },
  { cx: 23, cy: 24, r: 1.9, c: "#84cc16" },
];

/** PUF 로고: 투명 필름(테두리만) 속 형광 입자 아이콘 + PUF 글자 */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[1.4em] w-[1.4em] overflow-visible" aria-hidden="true">
        <defs>
          <filter id="puf-logo-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* 투명 필름: 안은 비우고 테두리만 */}
        <rect x="1.25" y="1.25" width="29.5" height="29.5" rx="8" fill="none" stroke={light ? "rgba(255,255,255,0.7)" : "rgba(15,42,61,0.28)"} strokeWidth="1.5" />
        <path d="M6 3.5 Q 3.5 3.5 3.5 6 V 11" fill="none" stroke={light ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.9)"} strokeWidth="1" strokeLinecap="round" />
        <g filter="url(#puf-logo-glow)">
          {dots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill={d.c} />
          ))}
        </g>
      </svg>
      <span className={`font-bold tracking-[0.04em] ${light ? "text-white" : "text-ink"}`}>PUF</span>
    </span>
  );
}
