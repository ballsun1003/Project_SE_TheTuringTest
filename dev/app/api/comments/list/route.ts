import { NextRequest, NextResponse } from "next/server";
import { listCommentsByPostId } from "@/lib/commentService";

/**
 * ======================================================
 * LIST COMMENTS BY POST API
 * ======================================================
 * Route: POST /api/comments/list
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 특정 게시글에 작성된 댓글 목록을 가져오는 기능
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string  // 게시글 ID(UUID)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { comments: Comment[] }
 * 400: { error: "Missing postId" or DB 오류 메시지 }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 요청값 검사(postId)
 * 2️⃣ listCommentsByPostId() 호출 → DB에서 댓글 목록 조회
 * 3️⃣ 조회된 댓글 배열을 JSON으로 반환
 *
 * 사용되는 서비스/연관 테이블
 * ------------------------------------------------------
 * - commentService: listCommentsByPostId()
 * - DB: comments 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - 게시글 상세 페이지(PostDetailPage) → 댓글 목록 렌더링
 *
 * 보안 여부
 * ------------------------------------------------------
 * - 비로그인 유저도 댓글 조회 가능
 * (권한 없이 보여줘도 되는 공개 데이터)
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json(
      { error: "Missing postId" },
      { status: 400 }
    );
  }

  const { comments, error } = await listCommentsByPostId(postId);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ comments });
}
