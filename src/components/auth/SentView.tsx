import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** "메일을 보냈어요" 안내 화면 */
export function SentView({ title, description, email }: { title: string; description: string; email: string }) {
  return (
    <div className="text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-light text-sky">
        <MailCheck size={32} />
      </span>
      <h1 className="mt-5 text-2xl font-bold">{title}</h1>
      <p className="mt-2 font-semibold text-sky-dark">{email}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-sub">{description}</p>
      <Button href="/login" variant="outline" full className="mt-8">로그인 화면으로</Button>
    </div>
  );
}
