"use client";

// 새 링크 입력 폼: 링크 주소 인풋 + 폴더 선택 셀렉트 + 저장/취소 버튼
// UI 데모이므로 실제 저장 대신 알림 후 목록으로 이동한다.

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { folders } from "@/app/lib/mock-data";

export default function NewLinkForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState(folders[0]?.id ?? "");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!url.trim()) {
      alert("링크 주소를 입력해 주세요.");
      return;
    }

    const folderName = folders.find((f) => f.id === folderId)?.name ?? "";
    // 실제 저장 로직 대신 데모용 알림
    alert(`저장되었습니다 (UI 데모)\n링크: ${url}\n폴더: ${folderName}`);
    router.push("/");
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
          value={folderId}
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
        <button type="submit" className="btn-primary px-5 py-3.5 text-[17px]">
          저장
        </button>
        <Link href="/" className="btn-secondary px-5 py-3.5 text-[17px]">
          취소
        </Link>
      </div>
    </form>
  );
}
