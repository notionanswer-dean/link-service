import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "한입 링크",
  description: "북마크를 폴더로 정리하는 한입 링크 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* 헤더/사이드바 셸은 (main) 그룹 레이아웃에서만 렌더링한다.
          (auth) 그룹(로그인·회원가입)은 셸 없이 본문만 표시된다. */}
      <body className="min-h-full">{children}</body>
    </html>
  );
}
