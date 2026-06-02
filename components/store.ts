"use client";

// 북마크 스토어(폴더 + 링크)의 단일 소스.
// 헤더(새 폴더 모달)·사이드바·새 링크 폼·폴더/전체 뷰가 이 상태를 공유한다.
// mock 데이터를 초기값으로 사용하고, 변경분은 localStorage에 보존한다.
// useSyncExternalStore를 사용해 effect 없이 SSR-안전하게 구독한다.

import { useSyncExternalStore } from "react";
import type { Folder, LinkItem } from "@/app/lib/mock-data";
import {
  folders as initialFolders,
  links as initialLinks,
} from "@/app/lib/mock-data";

const STORAGE_KEY = "hanip-store-v1";

interface StoreState {
  folders: Folder[];
  links: LinkItem[];
}

// 모듈 레벨 스토어 — 클라이언트 세션 동안 유지된다.
let state: StoreState = { folders: initialFolders, links: initialLinks };
let loaded = false;
const listeners = new Set<() => void>();

// 첫 구독 시(클라이언트) localStorage에서 한 번 복원한다.
function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreState>;
      state = {
        folders: Array.isArray(parsed.folders)
          ? parsed.folders
          : initialFolders,
        links: Array.isArray(parsed.links) ? parsed.links : initialLinks,
      };
    }
  } catch {
    // 파싱/접근 실패 시 초기값 유지
  }
}

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  // 첫 구독에서 localStorage 값을 불러왔다면 즉시 반영
  listener();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ── 액션 ─────────────────────────────────────────────

/** 새 폴더를 목록 끝에 추가하고 생성된 폴더를 반환한다. */
export function addFolder(name: string): Folder {
  const folder: Folder = {
    id: `f-${crypto.randomUUID()}`,
    name: name.trim(),
    count: 0,
  };
  setState({ ...state, folders: [...state.folders, folder] });
  return folder;
}

/** 폴더 이름을 변경한다. */
export function renameFolder(folderId: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  setState({
    ...state,
    folders: state.folders.map((folder) =>
      folder.id === folderId ? { ...folder, name: trimmed } : folder
    ),
  });
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
    () => initialFolders
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
