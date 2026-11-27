import Link from "next/link";
import { Check } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { authPanel } from "@/content/auth";

/** 로그인·회원가입 화면 공통 틀: 왼쪽 소개(데스크톱만) + 오른쪽 입력 카드 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-soft">
      {/* 왼쪽 소개 영역 (데스크톱) */}
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-light via-soft to-white p-12 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle,#bae6fd_1px,transparent_1.5px)] [background-size:20px_20px] opacity-70" />
        <Link href="/" className="relative text-xl" aria-label="PUF 홈">
          <Logo />
        </Link>
        <div className="relative">
          <h2 className="text-[34px] font-bold leading-[1.3] tracking-[-0.02em]">
            {authPanel.title[0]}
            <br />
            <span className="text-sky">{authPanel.title[1]}</span>
          </h2>
          <p className="mt-4 max-w-[400px] leading-relaxed text-sub">{authPanel.description}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {authPanel.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky text-white">
                  <Check size={14} strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-[13px] text-muted">© 2026 PUF</p>
      </aside>

      {/* 오른쪽 입력 영역 */}
      <main className="flex flex-1 flex-col">
        <div className="flex h-16 items-center px-5 lg:hidden">
          <Link href="/" className="text-xl" aria-label="PUF 홈">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 items-start justify-center px-5 pb-12 pt-4 lg:items-center lg:pt-0">
          <div className="w-full max-w-[420px] rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">{children}</div>
        </div>
      </main>
    </div>
  );
}

/** 카드 맨 위 제목 + 설명 */
export function AuthHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-[-0.02em]">{title}</h1>
      <p className="mt-1.5 text-[15px] leading-relaxed text-sub">{description}</p>
    </div>
  );
}
