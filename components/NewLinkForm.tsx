"use client";

// 새 링크 입력 폼: 링크 주소 인풋 + 폴더 선택 셀렉트 + 저장/취소 버튼
// 저장 시 공유 스토어에 링크를 추가하고 선택한 폴더로 이동한다.

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useFolders, addLink } from "./store";

export default function NewLinkForm() {
  const router = useRouter();
  const folders = useFolders();
  const [url, setUrl] = useState("");
  // 사용자가 명시적으로 고른 폴더 id(아직 안 골랐으면 빈 문자열)
  const [folderId, setFolderId] = useState("");
  // 오픈 그래프 정보를 수집하는 동안 버튼을 잠근다
  const [saving, setSaving] = useState(false);

  // 폴더는 Supabase에서 비동기로 로드된다. 아직 선택값이 없으면 첫 폴더를
  // 기본 선택으로 파생해 셀렉트가 항상 유효한 값을 가리키게 한다.
  const selectedFolderId = folderId || folders[0]?.id || "";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) {
      alert("링크 주소를 입력해 주세요.");
      return;
    }
    if (saving) return;

    setSaving(true);
    // 오픈 그래프 API로 제목·설명·썸네일을 수집한다.
    // 실패하더라도 입력한 URL만으로 저장은 진행한다(스토어에서 호스트명으로 폴백).
    let og: { title?: string; description?: string; image?: string; url?: string } =
      {};
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        og = await res.json();
      }
    } catch {
      // 네트워크 오류는 무시하고 기본 정보로 저장한다
    }

    const created = await addLink({
      url: og.url || trimmed,
      folderId: selectedFolderId,
      title: og.title,
      description: og.description,
      thumbnail: og.image,
    });

    if (!created) {
      // 저장 실패 시 폼을 유지해 다시 시도할 수 있게 한다.
      setSaving(false);
      alert("링크 저장에 실패했습니다. 다시 시도해 주세요.");
      return;
    }
    // 해당 폴더로 이동해 결과를 보여준다
    router.push(selectedFolderId ? `/folder/${selectedFolderId}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      {/* 링크 주소 인풋 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="url" className="text-sm font-bold text-[var(--text)]">
          링크 주소
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="toss-input px-4 py-3.5 text-[17px]"
        />
      </div>

      {/* 폴더 선택 셀렉트 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="folder" className="text-sm font-bold text-[var(--text)]">
          폴더
        </label>
        <select
          id="folder"
          value={selectedFolderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="toss-input px-4 py-3.5 text-[17px]"
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
      </div>

      {/* 저장 / 취소 */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="submit"
          disabled={saving}
          className="btn-primary px-5 py-3.5 text-[17px] disabled:cursor-not-allowed disabled:bg-[var(--disabled)] disabled:text-[var(--text-sub)]"
        >
          {saving ? "정보 수집 중…" : "저장"}
        </button>
        <Link href="/" className="btn-secondary px-5 py-3.5 text-[17px]">
          취소
        </Link>
      </div>
    </form>
  );
}
