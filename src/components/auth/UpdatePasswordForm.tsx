"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Notice, PasswordField } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthHeading } from "./AuthShell";
import { checkConfirm, checkNewPassword, hasError } from "./validate";
import { updatePasswordText as t } from "@/content/auth";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [pw, setPw] = useState({ password: "", password2: "" });
  const [errors, setErrors] = useState<{ password?: string; password2?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const v = { password: checkNewPassword(pw.password), password2: checkConfirm(pw.password, pw.password2) };
    setErrors(v);
    if (hasError(v)) return;

    setLoading(true);
    const { error } = await createClient().auth.updateUser({ password: pw.password });
    setLoading(false);
    if (error) {
      if (/different from the old/i.test(error.message)) return setErrors({ password: "이전과 다른 비밀번호를 입력해 주세요." });
      return setFormError("비밀번호를 바꾸지 못했어요. 링크가 만료됐다면 비밀번호 찾기를 다시 해 주세요.");
    }
    router.replace("/");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <AuthHeading title={t.title} description={t.description} />
      <div className="flex flex-col gap-4">
        <PasswordField label="새 비밀번호" autoComplete="new-password" placeholder="영문·숫자 포함 8자 이상" value={pw.password}
          onChange={(e) => { setPw((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: undefined })); }} error={errors.password} />
        <PasswordField label="새 비밀번호 확인" autoComplete="new-password" placeholder="한 번 더 입력" value={pw.password2}
          onChange={(e) => { setPw((p) => ({ ...p, password2: e.target.value })); setErrors((p) => ({ ...p, password2: undefined })); }} error={errors.password2} />
        {formError && <Notice>{formError}</Notice>}
        <Button type="submit" full loading={loading}>{t.submit}</Button>
      </div>
    </form>
  );
}
