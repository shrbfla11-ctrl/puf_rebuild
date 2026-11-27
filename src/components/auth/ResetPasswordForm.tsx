"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { Notice, TextField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthHeading } from "./AuthShell";
import { SentView } from "./SentView";
import { checkEmail } from "./validate";
import { resetText as t } from "@/content/auth";

export function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = checkEmail(email);
    setError(v);
    if (v) return;
    if (!supabaseConfigured) return setFormError("아직 로그인 서버가 연결되지 않았어요.");

    setLoading(true);
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/auth/callback?next=/update-password`,
    });
    setLoading(false);
    if (error) return setFormError("메일을 보내지 못했어요. 잠시 후 다시 시도해 주세요.");
    setSentTo(email.trim());
  }

  if (sentTo) return <SentView title={t.sentTitle} description={t.sentDescription} email={sentTo} />;

  return (
    <form onSubmit={onSubmit} noValidate>
      <AuthHeading title={t.title} description={t.description} />
      <div className="flex flex-col gap-4">
        <TextField label="이메일" type="email" autoComplete="email" placeholder="name@example.com" value={email}
          onChange={(e) => { setEmail(e.target.value); setError(undefined); }} error={error} />
        {formError && <Notice>{formError}</Notice>}
        <Button type="submit" full loading={loading}>{t.submit}</Button>
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-sky hover:text-sky-dark">{t.back}</Link>
      </p>
    </form>
  );
}
