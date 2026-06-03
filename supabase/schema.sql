-- 한입 링크: 폴더 + 링크 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣어 실행한다.
-- (인증 미도입 단계이므로 publishable/anon 키로 읽고 쓸 수 있도록 RLS 정책을 공개로 둔다.
--  추후 Supabase Auth 도입 시 user_id 컬럼 + 소유자 기준 정책으로 교체할 것.)

-- ── 폴더 ──────────────────────────────────────────────
create table if not exists public.folders (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  -- 사이드바 드래그 순서. 작을수록 위에 표시된다.
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- ── 링크 ──────────────────────────────────────────────
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text not null,
  description text not null default '',
  thumbnail   text,
  -- 폴더 삭제 시 소속 링크도 함께 삭제 (현재 deleteFolder 동작과 일치)
  folder_id   uuid not null references public.folders(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists links_folder_id_idx on public.links (folder_id);

-- ── RLS (데모: 공개 읽기/쓰기) ────────────────────────
alter table public.folders enable row level security;
alter table public.links   enable row level security;

drop policy if exists "folders public access" on public.folders;
create policy "folders public access" on public.folders
  for all using (true) with check (true);

drop policy if exists "links public access" on public.links;
create policy "links public access" on public.links
  for all using (true) with check (true);

-- ── 시드 데이터 (기존 mock-data 와 동일) ──────────────
insert into public.folders (name, position) values
  ('개발', 0),
  ('디자인', 1),
  ('뉴스', 2),
  ('요리 레시피', 3);

insert into public.links (title, url, description, folder_id)
select v.title, v.url, v.description, f.id
from (values
  ('Next.js 공식 문서', 'https://nextjs.org/docs', 'App Router, 서버 컴포넌트 등 Next.js의 모든 기능을 다루는 공식 문서입니다.', '개발'),
  ('React 공식 문서', 'https://react.dev', '훅과 컴포넌트 설계를 처음부터 다시 배울 수 있는 새 React 문서.', '개발'),
  ('Tailwind CSS 치트시트', 'https://tailwindcss.com/docs', '유틸리티 클래스를 빠르게 찾아볼 수 있는 레퍼런스.', '개발'),
  ('Dribbble - UI 영감', 'https://dribbble.com', '전 세계 디자이너들의 인터페이스 디자인 모음.', '디자인'),
  ('Figma 커뮤니티', 'https://www.figma.com/community', '무료 디자인 템플릿과 플러그인을 받을 수 있는 공간.', '디자인'),
  ('오늘의 IT 뉴스', 'https://news.hada.io', '개발자들이 직접 큐레이션하는 기술 뉴스 모음.', '뉴스'),
  ('초간단 파스타 레시피', 'https://example.com/pasta', '15분 안에 완성하는 알리오 올리오 만드는 법.', '요리 레시피')
) as v(title, url, description, folder_name)
join public.folders f on f.name = v.folder_name;
