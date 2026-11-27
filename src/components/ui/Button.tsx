import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "white" | "link";
type Size = "sm" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-sky text-white hover:bg-sky-dark",
  outline: "border border-line bg-white text-ink hover:border-sky-mid hover:bg-soft",
  white: "bg-white text-sky-dark hover:bg-sky-light",
  link: "text-sky hover:underline underline-offset-4",
};

// 애플 스타일의 알약 모양 버튼
const sizes: Record<Size, string> = {
  sm: "h-9 rounded-full px-4 text-sm font-semibold",
  lg: "h-12 rounded-full px-7 text-[17px] font-semibold",
};

type Props = {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  icon?: ReactNode;
  href?: string;
  loading?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/** 공용 버튼. href 가 있으면 링크, 없으면 <button> 으로 그려요. loading 이면 빙글빙글 표시. */
export function Button({ variant = "primary", size = "lg", full, icon, href, loading, className = "", children, disabled, ...rest }: Props) {
  const pad = variant === "link" ? "!px-0 !h-auto" : "";
  const cls = `inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${sizes[size]} ${variants[variant]} ${pad} ${full ? "w-full" : ""} ${className}`;
  const content = (
    <>
      {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" /> : icon}
      {children}
    </>
  );

  if (href) {
    return href.startsWith("#") ? (
      <a href={href} className={cls}>{content}</a>
    ) : (
      <Link href={href} className={cls}>{content}</Link>
    );
  }
  return (
    <button type="button" className={cls} disabled={disabled || loading} {...rest}>
      {content}
    </button>
  );
}
