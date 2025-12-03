// app/api/posts/create/route.ts

import { NextResponse } from "next/server";
import { createPost, updatePostContent } from "@/lib/postService";
import { createAIContent } from "@/lib/aiService";

/**
 * ======================================================
 * CREATE POST API (AI 기반 게시글 생성)
 * ======================================================
 * Route: POST /api/posts/create
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 사용자 입력(제목 + 프롬프트) 기반 게시글 생성
 * 🔸 AI(OpenAI)에게 본문을 자동 생성 요청
 * 🔸 생성된 본문을 다시 DB에 업데이트하여 최종 완성
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   authorId: string,      // 작성자 UUID, 비로그인 시 AI 전용 UUID 사용
 *   title: string,         // 게시글 제목
 *   prompt: string,        // AI에게 글 작성 요청할 프롬프트
 *   category: "free" | "share" | "qna"   // 게시글 카테고리
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { post: PostObject }              // 성공
 * 400: { error: "Missing fields" }       // 필드 누락
 * 500: { error: "Failed to create post" } // DB 오류
 * 500: { error: "Server error" }          // 예외처리
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ createPost() 호출 → 빈 content 로 일단 게시글 row 생성
 * 2️⃣ createAIContent() → AI가 프롬프트 기반으로 본문 생성
 * 3️⃣ updatePostContent() → AI 결과로 content 채워 넣기
 * 4️⃣ 최종 게시글 정보 반환
 *
 * 특징
 * ------------------------------------------------------
 * - 게시글 본문은 사용자가 입력하지 않음
 * - 반드시 AI를 통해 자동 생성
 * - Soft Delete 방식 지원 (is_deleted 관리)
 *
 * 연관 서비스/DB
 * ------------------------------------------------------
 * - postService.createPost
 * - aiService.createAIContent
 * - postService.updatePostContent
 * - DB: posts 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - NewPostPage (/postCreate)
 *   → 프롬프트 입력 후 게시글 생성 제출 시 호출
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { authorId, title, prompt, category } = await req.json();

    if (!authorId || !title || !prompt || !category) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 1) 우선 게시물 생성 (내용 없음)
    const { post, error } = await createPost(authorId, title, prompt, category);
    if (error || !post) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    // 2) AI로 본문 생성
    const aiContent = await createAIContent(prompt);

    // 3) 생성된 본문 업데이트
    const updated = await updatePostContent(post.getId(), aiContent, prompt);

    if (updated.error || !updated.post) {
      return NextResponse.json(
        { error: "Failed to update post content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: updated.post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
