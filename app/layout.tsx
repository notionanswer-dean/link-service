import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// OG 이미지 등 상대경로 메타 자산의 절대 URL 기준.
// 우선순위: 명시적 환경변수 → Vercel 프로덕션 도메인 → 로컬 개발 주소.
// (이 값이 잘못되면 og:image가 외부에서 접근 불가능한 URL이 되어 썸네일이 안 뜬다.)
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const description = "북마크를 폴더로 정리하는 한입 링크 서비스";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // 각 페이지는 title만 지정하면 "%s · 한입 링크" 형태로 합쳐진다.
  title: {
    default: "한입 링크",
    template: "%s · 한입 링크",
  },
  description,
  // 파비콘은 app/favicon.ico를 Next.js가 자동으로 인식한다.
  openGraph: {
    type: "website",
    siteName: "한입 링크",
    title: "한입 링크",
    description,
    locale: "ko_KR",
    images: [
      {
        url: "/thumbnail.png", // public/thumbnail.png
        width: 2400,
        height: 1260,
        alt: "한입 링크",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "한입 링크",
    description,
    images: ["/thumbnail.png"],
  },
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
      <body className="min-h-full">
        {children}

        {/* Microsoft Clarity 추적 스크립트 — 모든 페이지에 적용된다.
            이 로더 스니펫이 실행되며 clarity.ms 태그를 <head>에 삽입한다. */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "x154vdswis");`}
        </Script>
      </body>
    </html>
  );
}
