"use client";

import { useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

type FieldProps = { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>;

const inputCls = (error?: string) =>
  `h-12 w-full rounded-xl border bg-white px-4 text-base outline-none placeholder:text-muted/70 focus:ring-4 ${
    error ? "border-danger focus:ring-danger/15" : "border-line focus:border-sky focus:ring-sky/15"
  }`;

/** 이름표 + 입력칸 + 오류 문구 */
export function TextField({ label, error, ...rest }: FieldProps) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <input id={id} aria-invalid={!!error} className={inputCls(error)} {...rest} />
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}

/** 눈 모양 버튼으로 보이기/숨기기가 되는 비밀번호 칸 */
export function PasswordField({ label, error, ...rest }: FieldProps) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink">{label}</label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} aria-invalid={!!error} className={`${inputCls(error)} pr-12`} {...rest} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
          className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center text-muted hover:text-ink"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-[13px] text-danger">{error}</p>}
    </div>
  );
}

/** 폼 전체에 대한 알림 (빨간색: 오류, 초록색: 성공) */
export function Notice({ tone = "error", children }: { tone?: "error" | "success"; children: ReactNode }) {
  const ok = tone === "success";
  return (
    <div role="alert" className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${ok ? "bg-ok-light text-ok" : "bg-danger-light text-danger"}`}>
      {ok ? <CheckCircle2 size={18} className="mt-px flex-none" /> : <AlertCircle size={18} className="mt-px flex-none" />}
      <span>{children}</span>
    </div>
  );
}
