"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Notice, PasswordField, TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthHeading } from "./AuthShell";
import { SentView } from "./SentView";
import { checkConfirm, checkEmail, checkName, checkNewPassword, hasError } from "./validate";
import { signupText as t } from "@/content/auth";

type Errors = { name?: string; email?: string; password?: string; password2?: string };

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", password2: "" });
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const set = (key: keyof Errors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = {
      name: checkName(form.name),
      email: checkEmail(form.email),
      password: checkNewPassword(form.password),
      password2: checkConfirm(form.password, form.password2),
    };
    setErrors(v);
    if (hasError(v)) return;
    if (!agree) return setFormError("필수 약관에 동의해 주세요.");
    if (!supabaseConfigured) return setFormError("아직 로그인 서버가 연결되지 않았어요.");

    setLoading(true);
    const email = form.email.trim();
    const { data, error } = await createClient().auth.signUp({
      email,
      password: form.password,
      options: { data: { name: form.name.trim() }, emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setLoading(false);

    // 이미 가입된 이메일이면 Supabase 가 빈 identities 를 돌려줘요.
    if (error && /already|registered|exists/i.test(error.message)) return setErrors({ email: "이미 가입된 이메일이에요." });
    if (data.user?.identities?.length === 0) return setErrors({ email: "이미 가입된 이메일이에요." });
    if (error) return setFormError("가입 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.");

    // 이메일 인증을 꺼 두었다면 바로 로그인 상태가 돼요.
    if (data.session) {
      router.replace("/");
      router.refresh();
      return;
    }
    setSentTo(email);
  }

  if (sentTo) return <SentView title={t.sentTitle} description={t.sentDescription} email={sentTo} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <AuthHeading title={t.title} description={t.description} />
      <div className="flex flex-col gap-4">
        <TextField label="이름" autoComplete="name" placeholder="홍길동" value={form.name} onChange={set("name")} error={errors.name} />
        <TextField label="이메일" type="email" autoComplete="email" placeholder="name@example.com" value={form.email} onChange={set("email")} error={errors.email} />
        <PasswordField label="비밀번호" autoComplete="new-password" placeholder="영문·숫자 포함 8자 이상" value={form.password} onChange={set("password")} error={errors.password} />
        <PasswordField label="비밀번호 확인" autoComplete="new-password" placeholder="한 번 더 입력" value={form.password2} onChange={set("password2")} error={errors.password2} />
        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-soft p-3.5 text-sm text-sub">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 flex-none accent-sky" />
          <span>
            {t.agree}{" "}
            <Link href="/terms" className="underline hover:text-ink">약관 보기</Link>
          </span>
        </label>
        {formError && <Notice>{formError}</Notice>}
        <Button type="submit" full loading={loading}>{t.submit}</Button>
      </div>
      <p className="mt-6 text-center text-sm text-sub">
        {t.hasAccount} <Link href="/login" className="font-semibold text-sky hover:text-sky-dark">{t.loginLink}</Link>
      </p>
    </form>
  );
}
