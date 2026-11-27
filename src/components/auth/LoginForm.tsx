"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Notice, PasswordField, TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthHeading } from "./AuthShell";
import { checkEmail, checkPassword, hasError } from "./validate";
import { loginText as t } from "@/content/auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(
    params.get("error") === "link" ? "링크가 만료됐거나 올바르지 않아요. 다시 시도해 주세요." : null,
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = { email: checkEmail(email), password: checkPassword(password) };
    setErrors(v);
    if (hasError(v)) return;
    if (!supabaseConfigured) return setFormError("아직 로그인 서버가 연결되지 않았어요.");

    setLoading(true);
    const { error } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      if (/not confirmed/i.test(error.message)) return setFormError("이메일 인증이 아직 안 됐어요. 메일함의 인증 링크를 눌러 주세요.");
      if (/invalid/i.test(error.message)) return setFormError("이메일 또는 비밀번호가 올바르지 않아요.");
      return setFormError("로그인 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");
    }
    const next = params.get("next");
    router.replace(next?.startsWith("/") && !next.startsWith("//") ? next : "/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <AuthHeading title={t.title} description={t.description} />
      <div className="flex flex-col gap-4">
        <TextField label="이메일" type="email" autoComplete="email" placeholder="name@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }} error={errors.email} />
        <PasswordField label="비밀번호" autoComplete="current-password" placeholder="비밀번호" value={password}
          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }} error={errors.password} />
        <Link href="/reset-password" className="self-end text-sm font-medium text-sub hover:text-sky">{t.forgot}</Link>
        {formError && <Notice>{formError}</Notice>}
        <Button type="submit" full loading={loading}>{t.submit}</Button>
      </div>
      <p className="mt-6 text-center text-sm text-sub">
        {t.noAccount} <Link href="/signup" className="font-semibold text-sky hover:text-sky-dark">{t.signupLink}</Link>
      </p>
    </form>
  );
}
