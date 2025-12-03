import { NextResponse } from "next/server";
import { updatePostContent } from "@/lib/postService";
import { updateAIContent } from "@/lib/aiService";
import { getPostById } from "@/lib/postService";

/**
 * ======================================================
 * UPDATE POST CONTENT BY AI API
 * ======================================================
 * Route: POST /api/posts/update
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 게시글 본문을 AI 기반으로 자동 재작성
 * 🔹 작성자 본인 인증 필수
 * 🔹 기존 글 내용 + 수정 요청 프롬프트를 AI에 전달하여 새 본문 생성
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,        // 수정 대상 게시글 ID (필수)
 *   authorId: string,      // 요청자 ID (작성자 여부 검증용)
 *   updatedPrompt: string  // AI에게 전달될 수정 프롬프트 (필수)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   post: PostWithAuthor   // AI로 수정된 게시글 정보 반환
 * }
 *
 * Error 반환 예시
 * ------------------------------------------------------
 * 400: { error: "Missing fields" }        // 필드 누락
 * 403: { error: "Not authorized" }        // 본인 아님
 * 404: { error: "Post not found" }        // 게시글 없음
 * 500: { error: "Failed to update post" } // DB 업데이트 실패
 *
 * 내부 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 요청 필드 유효성 체크
 * 2️⃣ DB에서 게시글 존재 여부 확인
 * 3️⃣ 작성자(authorId) 일치 여부 검증
 * 4️⃣ 기존 글 내용(oldContent) 확보
 * 5️⃣ updateAIContent() 호출 → AI 재작성
 * 6️⃣ DB에 새 content 저장 (updatePostContent)
 * 7️⃣ 최종 수정된 게시글 정보 반환
 *
 * 관련 함수
 * ------------------------------------------------------
 * - updateAIContent(): OpenAI 기반 글쓰기
 * - updatePostContent(): DB에 수정 내용 반영
 * - getPostById(): 게시글 검증
 *
 * 사용 UI
 * ------------------------------------------------------
 * - EditPostPage → "AI로 본문 수정하기" 버튼
 *
 * 주의 사항
 * ------------------------------------------------------
 * - Soft-delete 게시글은 수정 불가 (postService 내부 처리)
 * - AI의 결과물은 사용자 의도와 일치하도록 프롬프트 작성 필요
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { postId, authorId, updatedPrompt } = await req.json();

    if (!postId || !authorId || !updatedPrompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 원본 게시글 가져오기
    const { post, error } = await getPostById(postId);
    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 작성자 본인만 수정 가능
    if (post.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 기존 content 가져오기
    const oldContent = post.getContent();

    // AI로 새로운 content 생성
    const newContent = await updateAIContent(oldContent, updatedPrompt);

    // DB 업데이트
    const updated = await updatePostContent(postId, newContent, updatedPrompt);

    if (updated.error || !updated.post) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }

    return NextResponse.json({ post: updated.post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
