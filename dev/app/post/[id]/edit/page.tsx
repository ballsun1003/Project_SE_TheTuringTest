"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { BoardCategory } from "@/lib/entities/Post"; // 타입 불러오기!

/**
 * ======================================================
 * EditPostPage (게시글 수정 페이지)
 * ======================================================
 * 기존 게시글의 제목, 카테고리, 본문을 수정할 수 있는 UI 제공.
 * 본문 수정은 AI에게 프롬프트를 전달하여 재작성된 결과를 적용함.
 *
 * 초기 데이터 로드(loadPost)
 * ------------------------------------------------------
 * - /api/posts/get 로 게시글 데이터 불러오기
 * - title / category 초기 설정
 *
 * 게시글 수정 기능
 * ------------------------------------------------------
 * 1️⃣ 메타데이터 수정(handleUpdateMeta)
 *    - 제목(title) 변경
 *    - 카테고리(BoardCategory) 변경
 *    - 서버 권한 검증 수행 (작성자만)
 *    - 성공 시 알림 출력 유지
 *
 * 2️⃣ 본문 AI 수정(handleUpdateContent)
 *    - 프롬프트 입력 기반 AI 재작성 요청
 *    - 서버에서 AI 콘텐츠 생성
 *    - 성공 후 게시글 상세 페이지로 이동
 *
 * UI / 상태 관리
 * ------------------------------------------------------
 * post: 로드된 게시글 데이터
 * title: 수정 입력값
 * category: 카테고리 선택 상태
 * prompt: AI 수정 요청 문장
 *
 * 권한 처리
 * ------------------------------------------------------
 * - 로컬 저장된 userId 사용하여 서버에서 작성자 검증
 * - 작성자가 아닌 경우 수정 불가 (서버에서 차단)
 *
 * UX / 사용성
 * ------------------------------------------------------
 * - 카테고리 버튼 UI로 쉬운 선택
 * - 제목/카테고리 즉시 수정 가능
 * - AI 수정 시, 기존 내용 기반 재작성
 * - 뒤로가기 버튼을 통해 상세 화면으로 복귀
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자 게시글 관리 기능 완성
 * - AI 기반 편집 기능 제공으로 사용자의 편의성 강화
 * ======================================================
 */


export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  const [post, setPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<BoardCategory>("free");
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
      setCategory(json.post.category as BoardCategory);
    }
  }

  /* 제목/카테고리 수정 */
  async function handleUpdateMeta() {
    const res = await fetch("/api/posts/updateMeta", {
      method: "POST",
      body: JSON.stringify({ postId: id, title, category, userId }),
    });

    const json = await res.json();

    if (json.error) return alert(json.error);

    alert("수정 완료!");
  }

  /* 본문(AI) 수정 */
  async function handleUpdateContent() {
    if (!prompt.trim())
      return alert("AI에게 요청할 프롬프트를 입력하세요.");

    const res = await fetch("/api/posts/update", {
      method: "POST",
      body: JSON.stringify({
        postId: id,
        authorId: userId,
        updatedPrompt: prompt,
      }),
    });

    const json = await res.json();

    if (json.error) return alert(json.error);

    alert("AI 수정 완료!");
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

        {/* 카테고리 버튼 */}
        <div>
          <label className="block mb-2 font-semibold">카테고리</label>
          <div className="flex gap-3">
            <button
              onClick={() => setCategory("free")}
              className={`px-4 py-2 rounded-md border ${
                category === "free"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 border-gray-400 text-gray-700"
              }`}
            >
              자유
            </button>

            <button
              onClick={() => setCategory("share")}
              className={`px-4 py-2 rounded-md border ${
                category === "share"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 border-gray-400 text-gray-700"
              }`}
            >
              공유
            </button>

            <button
              onClick={() => setCategory("qna")}
              className={`px-4 py-2 rounded-md border ${
                category === "qna"
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-100 border-gray-400 text-gray-700"
              }`}
            >
              Q&A
            </button>
          </div>
        </div>

        {/* 제목/카테고리 수정 버튼 */}
        <button
          onClick={handleUpdateMeta}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          제목 및 카테고리 수정하기
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
