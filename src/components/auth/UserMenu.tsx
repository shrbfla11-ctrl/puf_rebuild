"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserSummary } from "@/lib/auth/user";

/** 로그인했을 때 상단에 보이는 동그란 프로필 버튼 + 펼침 메뉴 */
export function UserMenu({ user }: { user: UserSummary }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const label = user.name || user.email || "사용자";

  // 메뉴 바깥을 누르면 닫혀요.
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  async function logout() {
    await createClient().auth.signOut();
    setOpen(false);
    router.replace("/");
    router.refresh();
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        aria-label="내 계정 메뉴"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-light text-[15px] font-bold text-sky-dark hover:bg-sky-mid/40"
      >
        {label.slice(0, 1).toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-30 w-60 rounded-xl border border-line bg-white p-2 shadow-card">
          <div className="px-3 py-2">
            <div className="truncate font-semibold">{user.name ?? "이름 없음"}</div>
            <div className="truncate text-sm text-muted">{user.email}</div>
          </div>
          <div className="my-1 h-px bg-line" />
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sub hover:bg-soft hover:text-ink">
            <LogOut size={16} />
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}
