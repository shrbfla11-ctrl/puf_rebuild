import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-kr/400.css";
import "@fontsource/ibm-plex-sans-kr/500.css";
import "@fontsource/ibm-plex-sans-kr/600.css";
import "@fontsource/ibm-plex-sans-kr/700.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PUF",
  description: "스마트폰 플래시와 카메라만으로 발광 PUF 스티커의 잔광 패턴을 읽어 정품을 확인하세요.",
};

// 모든 페이지를 감싸는 가장 바깥 틀
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
