"use client";

// 북마크 스토어(폴더 + 링크)의 단일 소스.
// 헤더(새 폴더 모달)·사이드바·새 링크 폼·폴더/전체 뷰가 이 상태를 공유한다.
// 폴더는 Supabase `folders` 테이블이 소스이고, 링크는 아직 mock + localStorage다.
// useSyncExternalStore를 사용해 effect 없이 SSR-안전하게 구독한다.

import { useSyncExternalStore } from "react";
import type { Folder, LinkItem } from "@/app/lib/mock-data";
import { links as initialLinks } from "@/app/lib/mock-data";
import { createClient } from "@/utils/supabase/client";

const STORAGE_KEY = "hanip-store-v1";

// 폴더 데이터를 읽고 쓰는 Supabase 브라우저 클라이언트.
const supabase = createClient();

interface StoreState {
  folders: Folder[];
  links: LinkItem[];
}

// SSR/초기 스냅샷용 빈 폴더 배열 — 참조가 안정적이어야 무한 렌더를 피한다.
const EMPTY_FOLDERS: Folder[] = [];

// 모듈 레벨 스토어 — 클라이언트 세션 동안 유지된다.
// 폴더는 클라이언트에서 Supabase로부터 한 번 로드해 채운다.
let state: StoreState = { folders: EMPTY_FOLDERS, links: initialLinks };
let loaded = false;
let foldersLoaded = false;
const listeners = new Set<() => void>();

// 첫 구독 시(클라이언트) localStorage에서 링크를 한 번 복원한다.
// 폴더는 Supabase가 소스이므로 localStorage에서 복원하지 않는다.
function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      if (Array.isArray(parsed.links)) {
        state = { ...state, links: parsed.links };
      }
    }
  } catch {
    // 파싱/접근 실패 시 초기값 유지
  }
}

// 첫 구독 시(클라이언트) Supabase에서 폴더를 한 번 로드한다.
// folders 테이블에 보관된 순서(id 오름차순 = 추가된 순서)대로 가져온다.
async function loadFolders() {
  if (foldersLoaded) return;
  foldersLoaded = true;
  const { data, error } = await supabase
    .from("folders")
    .select("id, name")
    .order("id", { ascending: true });
  if (error) {
    foldersLoaded = false; // 실패 시 다음 구독에서 재시도 허용
    return;
  }
  const folders: Folder[] = (data ?? []).map((row) => ({
    id: String(row.id),
    name: row.name,
    count: 0,
  }));
  state = { ...state, folders };
  emit();
}

function persist() {
  try {
    // 폴더는 Supabase가 소스이므로 localStorage에는 링크만 보존한다.
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ links: state.links })
    );
  } catch {
    // 저장 실패는 무시 (시크릿 모드 등)
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: StoreState) {
  state = next;
  persist();
  emit();
}

function subscribe(listener: () => void) {
  ensureLoaded();
  // 폴더를 Supabase에서 로드한다(완료되면 emit으로 반영).
  loadFolders();
  // 첫 구독에서 localStorage 값을 불러왔다면 즉시 반영
  listener();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ── 액션 ─────────────────────────────────────────────

/**
 * 새 폴더를 Supabase folders 테이블에 추가하고 로컬 목록 끝에 반영한다.
 * 생성에 성공하면 폴더를, 실패하면 null을 반환한다.
 */
export async function addFolder(name: string): Promise<Folder | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from("folders")
    .insert({ name: trimmed })
    .select("id, name")
    .single();
  if (error || !data) return null;
  const folder: Folder = { id: String(data.id), name: data.name, count: 0 };
  setState({ ...state, folders: [...state.folders, folder] });
  return folder;
}

/**
 * 폴더 이름을 Supabase folders 테이블에서 변경하고 로컬 목록에 반영한다.
 * 성공하면 true, 실패하면 false를 반환한다.
 */
export async function renameFolder(
  folderId: string,
  name: string
): Promise<boolean> {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const { error } = await supabase
    .from("folders")
    .update({ name: trimmed })
    .eq("id", Number(folderId));
  if (error) return false;
  setState({
    ...state,
    folders: state.folders.map((folder) =>
      folder.id === folderId ? { ...folder, name: trimmed } : folder
    ),
  });
  return true;
}

/** 폴더와 그 폴더에 담긴 링크를 모두 삭제한다. */
export function deleteFolder(folderId: string) {
  setState({
    ...state,
    folders: state.folders.filter((folder) => folder.id !== folderId),
    links: state.links.filter((link) => link.folderId !== folderId),
  });
}

/** fromIndex 폴더를 toIndex 위치로 이동한다. */
export function reorderFolders(fromIndex: number, toIndex: number) {
  const { folders } = state;
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= folders.length ||
    toIndex >= folders.length
  ) {
    return;
  }
  const next = [...folders];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  setState({ ...state, folders: next });
}

/** 새 링크를 목록 맨 앞에 추가하고 생성된 링크를 반환한다. */
export function addLink(input: {
  url: string;
  folderId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}): LinkItem {
  // URL에서 호스트명을 뽑아 제목 기본값으로 사용
  let host = input.url;
  try {
    host = new URL(input.url).hostname.replace(/^www\./, "");
  } catch {
    // 잘못된 URL은 원본 사용
  }

  const now = new Date();
  const savedAt = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(now.getDate()).padStart(2, "0")}`;

  const link: LinkItem = {
    id: `l-${crypto.randomUUID()}`,
    title: input.title?.trim() || host,
    url: input.url,
    description: input.description?.trim() || "",
    thumbnail: input.thumbnail?.trim() || undefined,
    folderId: input.folderId,
    savedAt,
  };
  setState({ ...state, links: [link, ...state.links] });
  return link;
}

/** 링크의 폴더·제목·설명을 수정한다. */
export function updateLink(
  linkId: string,
  input: { folderId: string; title: string; description: string }
) {
  const title = input.title.trim();
  if (!title) return;
  setState({
    ...state,
    links: state.links.map((link) =>
      link.id === linkId
        ? {
            ...link,
            folderId: input.folderId,
            title,
            description: input.description.trim(),
          }
        : link
    ),
  });
}

/** 링크를 삭제한다. */
export function deleteLink(linkId: string) {
  setState({
    ...state,
    links: state.links.filter((link) => link.id !== linkId),
  });
}

// ── 훅 ───────────────────────────────────────────────

/** 현재 폴더 목록을 구독한다. */
export function useFolders(): Folder[] {
  return useSyncExternalStore(
    subscribe,
    () => state.folders,
    () => EMPTY_FOLDERS
  );
}

/** 현재 링크 목록을 구독한다. */
export function useLinks(): LinkItem[] {
  return useSyncExternalStore(
    subscribe,
    () => state.links,
    () => initialLinks
  );
}
