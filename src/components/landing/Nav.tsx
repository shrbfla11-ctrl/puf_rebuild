"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const links = [
  { href: "/scan", label: "정품 확인" },
  { href: "/history", label: "인증 기록" },
  { href: "/guide", label: "이용 가이드" },
  { href: "/support", label: "고객센터" },
];

/** 상단 메뉴. 모바일에서는 햄버거 버튼으로 펼쳐요. */
export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 lg:px-8">
        <Link href="/" aria-label="PUF 홈" className="text-xl">
          <Logo />
        </Link>

        <nav className="hidden gap-9 text-[15px] font-medium lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sub hover:text-sky">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button href="/login" size="sm">시작하기</Button>
          <button
            type="button"
            aria-label="메뉴"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-line px-5 py-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-3 text-base font-medium text-ink">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
