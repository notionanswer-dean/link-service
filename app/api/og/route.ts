// 오픈 그래프 추출 API
// GET /api/og?url=<링크> → 해당 페이지의 og:title/description/image 등을 파싱해 JSON으로 반환한다.
// 외부 페이지의 HTML을 직접 받아 메타 태그를 정규식으로 추출한다(별도 의존성 없음).

import { NextResponse } from "next/server";

export interface OgData {
  title: string;
  description: string;
  image: string;
  url: string;
}

// HTML에서 <meta> 태그의 content를 뽑는다.
// property/name 속성이 content보다 앞/뒤 어느 쪽에 와도 매칭되도록 두 패턴을 시도한다.
function readMeta(html: string, key: string): string {
  // 키 안의 특수문자(:) 이스케이프
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    // <meta property="og:title" content="...">
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${k}["'][^>]+content=["']([^"']*)["']`,
      "i"
    ),
    // <meta content="..." property="og:title">
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${k}["']`,
      "i"
    ),
  ];
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return decodeEntities(match[1].trim());
  }
  return "";
}

// <title>...</title> 추출 (og:title fallback)
function readTitleTag(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return match?.[1] ? decodeEntities(match[1].trim()) : "";
}

// 자주 쓰이는 HTML 엔티티를 디코드한다.
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

// 상대 경로 이미지(/og.png)를 절대 URL로 보정한다.
function absolutize(image: string, base: string): string {
  if (!image) return "";
  try {
    return new URL(image, base).toString();
  } catch {
    return image;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");

  if (!target) {
    return NextResponse.json(
      { error: "url 쿼리 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  // http/https 링크만 허용한다.
  let parsed: URL;
  try {
    parsed = new URL(target);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
  } catch {
    return NextResponse.json(
      { error: "올바른 http(s) 링크가 아닙니다." },
      { status: 400 }
    );
  }

  try {
    // 일부 사이트가 봇 요청을 막으므로 일반 브라우저 UA를 보낸다. 5초 타임아웃.
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; HanipLinkBot/1.0; +https://example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `페이지를 불러오지 못했습니다 (${res.status}).` },
        { status: 502 }
      );
    }

    const html = await res.text();

    const title =
      readMeta(html, "og:title") ||
      readMeta(html, "twitter:title") ||
      readTitleTag(html);
    const description =
      readMeta(html, "og:description") ||
      readMeta(html, "twitter:description") ||
      readMeta(html, "description");
    const image = absolutize(
      readMeta(html, "og:image") || readMeta(html, "twitter:image"),
      parsed.toString()
    );

    const data: OgData = {
      title,
      description,
      image,
      // og:url이 있으면 정규화된 주소를, 없으면 원본 링크를 사용
      url: readMeta(html, "og:url") || parsed.toString(),
    };

    return NextResponse.json(data);
  } catch {
    // 네트워크 오류·타임아웃 등 — 폼에서 폴백 처리할 수 있도록 502로 응답
    return NextResponse.json(
      { error: "링크 정보를 가져오지 못했습니다." },
      { status: 502 }
    );
  }
}
