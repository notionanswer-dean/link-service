// 북마크 서비스에서 사용하는 도메인 타입과 화면 구성을 위한 목 데이터

/** 사이드바에 표시되는 폴더 */
export interface Folder {
  id: string;
  name: string;
  /** 폴더에 담긴 링크 개수 */
  count: number;
}

/** 메인 그리드에 표시되는 북마크 링크 */
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  /** 오픈 그래프 썸네일 이미지 URL (없을 수 있음) */
  thumbnail?: string;
  /** 소속 폴더 id */
  folderId: string;
  /** 저장 일자 (YYYY.MM.DD) */
  savedAt: string;
}

export const folders: Folder[] = [
  { id: "dev", name: "개발", count: 3 },
  { id: "design", name: "디자인", count: 2 },
  { id: "news", name: "뉴스", count: 1 },
  { id: "recipe", name: "요리 레시피", count: 1 },
];

export const links: LinkItem[] = [
  {
    id: "1",
    title: "Next.js 공식 문서",
    url: "https://nextjs.org/docs",
    description: "App Router, 서버 컴포넌트 등 Next.js의 모든 기능을 다루는 공식 문서입니다.",
    folderId: "dev",
    savedAt: "2026.05.28",
  },
  {
    id: "2",
    title: "React 공식 문서",
    url: "https://react.dev",
    description: "훅과 컴포넌트 설계를 처음부터 다시 배울 수 있는 새 React 문서.",
    folderId: "dev",
    savedAt: "2026.05.27",
  },
  {
    id: "3",
    title: "Tailwind CSS 치트시트",
    url: "https://tailwindcss.com/docs",
    description: "유틸리티 클래스를 빠르게 찾아볼 수 있는 레퍼런스.",
    folderId: "dev",
    savedAt: "2026.05.25",
  },
  {
    id: "4",
    title: "Dribbble - UI 영감",
    url: "https://dribbble.com",
    description: "전 세계 디자이너들의 인터페이스 디자인 모음.",
    folderId: "design",
    savedAt: "2026.05.24",
  },
  {
    id: "5",
    title: "Figma 커뮤니티",
    url: "https://www.figma.com/community",
    description: "무료 디자인 템플릿과 플러그인을 받을 수 있는 공간.",
    folderId: "design",
    savedAt: "2026.05.20",
  },
  {
    id: "6",
    title: "오늘의 IT 뉴스",
    url: "https://news.hada.io",
    description: "개발자들이 직접 큐레이션하는 기술 뉴스 모음.",
    folderId: "news",
    savedAt: "2026.05.30",
  },
  {
    id: "7",
    title: "초간단 파스타 레시피",
    url: "https://example.com/pasta",
    description: "15분 안에 완성하는 알리오 올리오 만드는 법.",
    folderId: "recipe",
    savedAt: "2026.05.18",
  },
];
