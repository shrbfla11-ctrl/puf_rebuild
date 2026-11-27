import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { footer } from "@/content/landing";

/** 맨 아래 정보 영역 */
export function Footer() {
  return (
    <footer className="border-t border-line bg-soft">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-5 py-10 lg:flex-row lg:items-start lg:justify-between lg:px-8">
        <div>
          <Logo className="text-lg" />
          <p className="mt-3 max-w-[520px] text-[13px] leading-relaxed text-muted">
            {footer.notice}
            <br />
            {footer.copyright}
          </p>
        </div>
        <div className="flex gap-5 text-sm font-medium text-sub">
          <Link href="/terms" className="hover:text-ink">이용약관</Link>
          <Link href="/privacy" className="hover:text-ink">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}
