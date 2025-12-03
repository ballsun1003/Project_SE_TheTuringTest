import { NextResponse } from "next/server";
import { getCommentById, updateCommentContent } from "@/lib/commentService";
import { updateAIContent } from "@/lib/aiService";

/**
 * ======================================================
 * UPDATE COMMENT (AI REWRITE) API
 * ======================================================
 * Route: POST /api/comments/update
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 기존 댓글을 AI를 이용해 재작성하여 업데이트
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   commentId: string,      // 수정할 댓글 ID(UUID)
 *   authorId: string,       // 수정 요청한 사용자 ID(UUID)
 *   updatedPrompt: string   // AI 재작성에 사용될 프롬프트
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { comment: Comment }
 * 400: { error: "Missing fields" }
 * 403: { error: "Not authorized" }       // 작성자 검증 실패
 * 404: { error: "Comment not found" }
 * 500: { error: "Failed to update comment" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 요청값 검사(commentId, authorId, updatedPrompt)
 * 2️⃣ getCommentById()로 기존 댓글 조회
 * 3️⃣ 댓글 작성자(authorId)와 요청자 비교 → 권한 검증
 * 4️⃣ updateAIContent()로 새로운 내용 생성
 * 5️⃣ updateCommentContent() 호출하여 DB 업데이트
 * 6️⃣ 성공 시 최신 댓글 데이터를 JSON으로 반환
 *
 * AI 기반 처리 주요 목적
 * ------------------------------------------------------
 * - 유저 편의성 향상: 기존 내용을 기반으로 자동 재작성
 * - 글 품질 보정 목적 (가독성/명확성 개선)
 *
 * 보안 관련
 * ------------------------------------------------------
 * - 댓글 작성자 본인만 수정 가능
 *
 * 사용되는 서비스/연관 테이블
 * ------------------------------------------------------
 * - commentService: getCommentById(), updateCommentContent()
 * - aiService: updateAIContent()
 * - DB: comments 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - 게시글 상세 페이지 > 댓글 수정 시 AI 수정 버튼
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { commentId, authorId, updatedPrompt } = await req.json();

    if (!commentId || !authorId || !updatedPrompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { comment, error } = await getCommentById(commentId);
    if (error || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 작성자 본인만 수정 가능
    if (comment.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const oldContent = comment.getContent();
    const newContent = await updateAIContent(oldContent, updatedPrompt);

    const updated = await updateCommentContent(
      commentId,
      newContent,
      updatedPrompt
    );

    if (updated.error || !updated.comment) {
      return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
    }

    return NextResponse.json({ comment: updated.comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
