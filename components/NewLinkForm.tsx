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
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      {/* 링크 주소 인풋 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="url"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          링크 주소
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300"
        />
      </div>

      {/* 폴더 선택 셀렉트 */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="folder"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          폴더
        </label>
        <select
          id="folder"
          value={folderId}
          onChange={(e) => setFolderId(e.target.value)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300"
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
          className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          저장
        </button>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
