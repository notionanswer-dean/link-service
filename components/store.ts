"use client";

// 북마크 스토어(폴더 + 링크)의 단일 소스.
// 헤더(새 폴더 모달)·사이드바·새 링크 폼·폴더/전체 뷰가 이 상태를 공유한다.
// 폴더와 링크 모두 Supabase(`folders`/`links` 테이블)가 소스다.
// useSyncExternalStore를 사용해 effect 없이 SSR-안전하게 구독한다.

import { useSyncExternalStore } from "react";
import type { Folder, LinkItem } from "@/app/lib/mock-data";
import { createClient } from "@/utils/supabase/client";

// 폴더·링크 데이터를 읽고 쓰는 Supabase 브라우저 클라이언트.
const supabase = createClient();

interface StoreState {
  folders: Folder[];
  links: LinkItem[];
}

// SSR/초기 스냅샷용 빈 배열 — 참조가 안정적이어야 무한 렌더를 피한다.
const EMPTY_FOLDERS: Folder[] = [];
const EMPTY_LINKS: LinkItem[] = [];

// 모듈 레벨 스토어 — 클라이언트 세션 동안 유지된다.
// 폴더·링크는 클라이언트에서 Supabase로부터 한 번 로드해 채운다.
let state: StoreState = { folders: EMPTY_FOLDERS, links: EMPTY_LINKS };
let foldersLoaded = false;
let linksLoaded = false;
const listeners = new Set<() => void>();

// timestamptz(ISO) → 저장 일자 표시 형식(YYYY.MM.DD)으로 변환한다.
function formatSavedAt(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}`;
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

// 첫 구독 시(클라이언트) Supabase에서 링크를 한 번 로드한다.
// 최근에 추가한 링크가 위로 오도록 created_at 내림차순으로 가져온다.
async function loadLinks() {
  if (linksLoaded) return;
  linksLoaded = true;
  const { data, error } = await supabase
    .from("links")
    .select("id, url, title, description, thumbnail_url, folder_id, created_at")
    .order("created_at", { ascending: false });
  if (error) {
    linksLoaded = false; // 실패 시 다음 구독에서 재시도 허용
    return;
  }
  const links: LinkItem[] = (data ?? []).map((row) => ({
    id: String(row.id),
    title: row.title ?? "",
    url: row.url,
    description: row.description ?? "",
    thumbnail: row.thumbnail_url ?? undefined,
    folderId: row.folder_id != null ? String(row.folder_id) : "",
    savedAt: formatSavedAt(row.created_at),
  }));
  state = { ...state, links };
  emit();
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: StoreState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  // 폴더·링크를 Supabase에서 로드한다(완료되면 emit으로 반영).
  loadFolders();
  loadLinks();
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

/**
 * 폴더를 Supabase folders 테이블에서 삭제하고 로컬 목록에 반영한다.
 * (로컬 상태에선 폴더에 담긴 링크도 함께 비운다.)
 * 성공하면 true, 실패하면 false를 반환한다.
 */
export async function deleteFolder(folderId: string): Promise<boolean> {
  const { error } = await supabase
    .from("folders")
    .delete()
    .eq("id", Number(folderId));
  if (error) return false;
  setState({
    ...state,
    folders: state.folders.filter((folder) => folder.id !== folderId),
    links: state.links.filter((link) => link.folderId !== folderId),
  });
  return true;
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

/**
 * 새 링크를 Supabase links 테이블에 추가하고 목록 맨 앞에 반영한다.
 * 생성에 성공하면 링크를, 실패하면 null을 반환한다.
 */
export async function addLink(input: {
  url: string;
  folderId: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}): Promise<LinkItem | null> {
  // URL에서 호스트명을 뽑아 제목 기본값으로 사용
  let host = input.url;
  try {
    host = new URL(input.url).hostname.replace(/^www\./, "");
  } catch {
    // 잘못된 URL은 원본 사용
  }

  const { data, error } = await supabase
    .from("links")
    .insert({
      url: input.url,
      title: input.title?.trim() || host,
      description: input.description?.trim() || null,
      thumbnail_url: input.thumbnail?.trim() || null,
      folder_id: input.folderId ? Number(input.folderId) : null,
    })
    .select("id, url, title, description, thumbnail_url, folder_id, created_at")
    .single();
  if (error || !data) return null;

  const link: LinkItem = {
    id: String(data.id),
    title: data.title ?? "",
    url: data.url,
    description: data.description ?? "",
    thumbnail: data.thumbnail_url ?? undefined,
    folderId: data.folder_id != null ? String(data.folder_id) : "",
    savedAt: formatSavedAt(data.created_at),
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
    () => EMPTY_LINKS
  );
}
