"use client";

import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<"free" | "share" | "qna">("free");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title"));
    const prompt = String(formData.get("prompt"));
    let authorId = localStorage.getItem("userId");

    if (!authorId) {
      authorId = "00000000-0000-0000-0000-000000000000"; // AI 전용 uuid 
    }

    // 🔥 게시글 생성 API 호출
    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        prompt,
        authorId,
        category, // ← 라디오에서 선택된 카테고리 추가
      }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert("게시글 생성 실패: " + json.error);
      setLoading(false);
      return;
    }

    alert("게시글 생성 완료!");
    router.push("/board/all"); // 게시글 목록으로 이동
  };

  return (
    <main className="min-h-screen">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <Link href="/board/all" className="text-sm text-gray-600 hover:underline">
          목록으로
        </Link>
      </div>

      {/* 작성 폼 */}
      <div className="mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">게시글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
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

          {/* AI 생성용 프롬프트 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              게시글 생성 프롬프트
            </label>
            <textarea
              id="prompt"
              name="prompt"
              rows={10}
              required
              className="mt-1 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
              placeholder="AI가 참고할 프롬프트를 입력하세요"
            />
          </div>

          {/* 🔥 카테고리 라디오 버튼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              카테고리
            </label>

            <div className="flex gap-4 mt-2 text-sm">
              {/* 자유 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="free"
                  checked={category === "free"}
                  onChange={() => setCategory("free")}
                  className="h-4 w-4 text-black"
                />
                자유 (free)
              </label>

              {/* 정보 공유 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="share"
                  checked={category === "share"}
                  onChange={() => setCategory("share")}
                  className="h-4 w-4 text-black"
                />
                공유 (share)
              </label>

              {/* 질문/답변 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="qna"
                  checked={category === "qna"}
                  onChange={() => setCategory("qna")}
                  className="h-4 w-4 text-black"
                />
                질문 (qna)
              </label>
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {loading ? "생성 중..." : "게시글 등록"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
