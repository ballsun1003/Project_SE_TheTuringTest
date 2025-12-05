"use client";

import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * NewPostPage (게시글 생성 화면)
 * ======================================================
 * 사용자가 AI에게 프롬프트를 입력하고,
 * 게시글을 자동 생성하도록 요청하는 클라이언트 페이지.
 *
 * 핵심 기능
 * ------------------------------------------------------
 * - 게시글 제목 입력
 * - AI 생성용 프롬프트 입력
 * - 카테고리 선택 (free/share/qna)
 * - 로그인 여부에 따라 게시글 작성자 구분
 *   · 로그인 사용자 → 실제 userId 저장
 *   · 비로그인 → AI 고유 UUID를 authorId 로 사용
 *
 * 데이터 처리 흐름
 * ------------------------------------------------------
 * 1. form submit → title & prompt 추출
 * 2. fetch("/api/posts/create") 호출
 * 3. 서버에서 AIService.createAIContent 실행하여 본문 생성
 * 4. Supabase에 게시글 DB 저장
 * 5. /board/all 로 이동하여 결과 확인
 *
 * UI 요소
 * ------------------------------------------------------
 * - HomeButton: 홈으로 이동 가능
 * - category: Radio 버튼으로 선택
 * - TailwindCSS로 작성된 반응형 UI 제공
 *
 * 예외 및 보안 처리
 * ------------------------------------------------------
 * - 입력값 검증 (required)
 * - fetch error 발생 시 alert 출력
 * - 생성 중 버튼 비활성화(중복 방지)
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자 입력 기반의 AI 자동 게시글 생성 기능 제공
 * - 게시판 서비스 핵심 Create 기능 담당
 * ======================================================
 */


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
        <h1 className="mb-6 text-2xl font-bold text-gray-700">게시글 작성</h1>

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
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black text-gray-700"
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
              className="mt-1 w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black text-gray-700"
              placeholder="AI가 참고할 프롬프트를 입력하세요"
            />
          </div>

          {/* 🔥 카테고리 라디오 버튼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              카테고리
            </label>

            <div className="flex gap-4 mt-2 text-sm text-gray-700">
              {/* 자유 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  value="free"
                  checked={category === "free"}
                  onChange={() => setCategory("free")}
                  className="h-4 w-4 text-black "
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
