// app/posts/new/page.tsx
"use client";

import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { FormEvent } from "react";

export default function NewPostPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const content = formData.get("content");
    const authorId = formData.get("authorId");
    const modelName = formData.get("modelName");

    const newPost = {
      title,
      content,
      authorId,
      modelName,
      // likeCount, dislikeCount, viewCount, createdAt, updatedAt, isDeleted 등은
      // 보통 서버에서 기본값으로 세팅
    };

    console.log("새 게시글:", newPost);
    // TODO: 여기에서 실제 게시글 생성 API 호출 후, /posts 또는 /posts/{id}로 이동
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />

        <Link
          href="/posts"
          className="text-sm text-gray-600 hover:underline"
        >
          목록으로
        </Link>
      </div>

      {/* 작성 폼 카드 */}
      <div className="mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">게시글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 작성자 ID */}
          <div>
            <label
              htmlFor="authorId"
              className="block text-sm font-medium text-gray-700"
            >
              작성자 ID
            </label>
            <input
              id="authorId"
              name="authorId"
              type="text"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="작성자 ID를 입력하세요"
            />
          </div>

          {/* 모델 이름 */}
          <div>
            <label
              htmlFor="modelName"
              className="block text-sm font-medium text-gray-700"
            >
              사용한 모델 이름
            </label>
            <input
              id="modelName"
              name="modelName"
              type="text"
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="예: gpt-5.1-thinking"
            />
          </div>

          {/* 제목 */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              제목
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="제목을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              내용
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              required
              className="mt-1 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="게시글 내용을 입력하세요"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              게시글 등록
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
