import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { getUser } from "@/lib/auth/user";

export const metadata: Metadata = { title: "새 비밀번호 설정 - PUF" };

// 새 비밀번호 설정 페이지 (주소: /update-password). 메일 링크로 로그인된 상태에서만 열려요.
export default async function UpdatePasswordPage() {
  if (!(await getUser())) redirect("/reset-password");
  return (
    <AuthShell>
      <UpdatePasswordForm />
    </AuthShell>
  );
}
