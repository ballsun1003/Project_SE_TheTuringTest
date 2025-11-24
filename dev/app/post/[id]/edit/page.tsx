"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [prompt, setPrompt] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    const res = await fetch("/api/posts/get", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });

    const json = await res.json();
    if (json.post) {
      setPost(json.post);
      setTitle(json.post.title);
      setCategory(json.post.category);
    }
  }

  /* -------------------------
        1) 제목/카테고리 수정
  -------------------------- */
  async function handleUpdateMeta() {
    const res = await fetch("/api/posts/updateMeta", {
      method: "POST",
      body: JSON.stringify({ postId: id, title, category, userId }),
    });

    const json = await res.json();

    if (json.error) return alert(json.error);

    alert("메타데이터 수정 완료!");
  }

  /* -------------------------
        2) 본문(AI) 수정
  -------------------------- */
  async function handleUpdateContent() {
    if (!prompt.trim()) return alert("AI에게 요청할 프롬프트를 입력하세요.");

    const res = await fetch("/api/posts/update", {
      method: "POST",
      body: JSON.stringify({
        postId: id,
        authorId: userId,
        updatedPrompt: prompt,
      }),
    });

    const json = await res.json();

    if (json.error) {
      alert(json.error);
      return;
    }

    alert("AI 본문 수정 완료!");
    router.push(`/post/${id}`);
  }

  if (!post) return <div className="p-10">로딩중...</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>

      <div className="space-y-6">

        {/* 제목 */}
        <div>
          <label className="block mb-2 font-semibold">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* 카테고리 */}
        <div>
          <label className="block mb-2 font-semibold">카테고리</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-md p-2"
          />
        </div>

        {/* 제목/카테고리 수정 버튼 */}
        <button
          onClick={handleUpdateMeta}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          메타데이터 수정
        </button>

        <hr className="my-6" />

        {/* 본문 AI 수정 */}
        <div>
          <label className="block mb-2 font-semibold">
            본문 AI 수정 요청 프롬프트
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full border rounded-md p-2 h-32"
            placeholder="AI에게 어떻게 수정할지 알려주세요..."
          />
        </div>

        <button
          onClick={handleUpdateContent}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          AI로 본문 수정하기
        </button>

        <button
          onClick={() => router.push(`/post/${id}`)}
          className="px-4 py-2 bg-gray-300 rounded-md ml-4"
        >
          뒤로가기
        </button>
      </div>
    </main>
  );
}
