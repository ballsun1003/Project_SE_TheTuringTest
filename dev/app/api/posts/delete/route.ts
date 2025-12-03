import { NextResponse } from "next/server";
import { deletePost } from "@/lib/postService";

/**
 * ======================================================
 * DELETE POST API
 * ======================================================
 * Route: POST /api/posts/delete
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 게시글 삭제 (Soft Delete 방식)
 * 🔸 본인 게시글 또는 ROOT 관리자만 삭제 가능
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,   // 삭제할 게시글 ID (필수)
 *   authorId: string  // 요청자(현재 로그인 사용자) ID (필수)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { success: true }
 * 400: { error: "Missing fields" }
 * 403: { error: "Not authorized" }
 * 404: { error: "Post not found" } ※ 내부적으로 처리될 수 있음
 * 500: { error: "Server error" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 필드(postId, authorId) 검증
 * 2️⃣ postService.deletePost(postId, authorId) 호출
 *     - 작성자 동일 여부 체크
 *     - ROOT_USER_ID 라면 권한 상관없이 삭제 허용
 *     - posts 테이블의 is_deleted 플래그 true 로 변경
 * 3️⃣ 성공 여부를 JSON 으로 반환
 *
 * 사용 UI
 * ------------------------------------------------------
 * - PostDetailPage (게시글 상세 페이지)
 *   → 삭제 버튼 눌렀을 때 호출
 *
 * 연관 DB Table
 * ------------------------------------------------------
 * - posts (is_deleted만 업데이트)
 *
 * 비고
 * ------------------------------------------------------
 * - 완전 삭제가 아니라 Soft Delete (복구 가능)
 * - 삭제된 게시글은 목록/조회에서 제외됨
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { postId, authorId } = await req.json();

    if (!postId || !authorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error, success } = await deletePost(postId, authorId);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
