import { NextResponse } from "next/server";
import { getCommentById } from "@/lib/commentService";
import { supabase } from "@/lib/supabaseClient";

/**
 * ======================================================
 * DELETE COMMENT API
 * ======================================================
 * Route: POST /api/comments/delete
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 사용자가 작성한 댓글을 삭제하는 기능
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   commentId: string, // 댓글 ID(UUID)
 *   authorId: string   // 요청하는 사용자(댓글 작성자) ID
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { success: true }
 * 400: { error: "Missing fields" }
 * 403: { error: "Not authorized" } // 권한 없음
 * 404: { error: "Comment not found" }
 * 500: { error: "Failed to delete comment" | "Server error" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 요청값 검사(commentId, authorId)
 * 2️⃣ DB에서 댓글 조회(getCommentById)
 * 3️⃣ 작성자 검증(본인만 삭제 가능)
 * 4️⃣ Supabase `comments` 테이블에서 데이터 삭제
 * 5️⃣ 성공 응답 반환
 *
 * 사용되는 서비스/연관 테이블
 * ------------------------------------------------------
 * - commentService: getCommentById()
 * - DB: comments
 *
 * 사용 UI
 * ------------------------------------------------------
 * - PostDetailPage (댓글 삭제 버튼 클릭 시 호출)
 *
 * 보안 여부
 * ------------------------------------------------------
 * - 로그인 필요
 * - 작성자 본인만 삭제 가능
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { commentId, authorId } = await req.json();

    if (!commentId || !authorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { comment, error } = await getCommentById(commentId);

    if (error || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 작성자 본인만 삭제 가능
    if (comment.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error: delErr } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (delErr) {
      return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
