/** PUF 글자형 로고: 패턴 스티커를 닮은 아이콘 + PUF 글자 */
export function Logo({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" className="h-[1.4em] w-[1.4em]" aria-hidden="true">
        <rect x="1" y="1" width="30" height="30" rx="8" fill={light ? "#ffffff" : "#0284c7"} />
        <g fill={light ? "#0284c7" : "#ffffff"}>
          <circle cx="9" cy="9" r="2" />
          <circle cx="16" cy="11" r="1.4" />
          <circle cx="23" cy="8" r="1.8" />
          <circle cx="11" cy="17" r="1.4" />
          <circle cx="19" cy="18" r="2.2" />
          <circle cx="24" cy="15" r="1.2" />
          <circle cx="8" cy="24" r="1.6" />
          <circle cx="15" cy="24" r="1.2" />
          <circle cx="23" cy="24" r="1.8" />
        </g>
      </svg>
      <span className={`font-bold tracking-[0.04em] ${light ? "text-white" : "text-ink"}`}>PUF</span>
    </span>
  );
}
