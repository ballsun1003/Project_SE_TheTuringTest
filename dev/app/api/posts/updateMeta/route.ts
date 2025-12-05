// app/api/posts/updateMeta/route.ts
import { NextResponse } from "next/server";
import { getPostById, updatePostMeta } from "@/lib/postService";

/**
 * ======================================================
 * UPDATE POST METADATA API
 * ======================================================
 * Route: POST /api/posts/updateMeta
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 게시글의 제목 및 카테고리 수정
 * 🔹 본인 여부 검증 필수
 *
 * 요구 조건
 * ------------------------------------------------------
 * - 로그인 상태(작성자 본인)여야 수정 가능
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,              // 대상 게시글 ID     (필수)
 *   title: string,               // 변경할 제목        (필수)
 *   category: BoardCategory,     // 변경할 카테고리    (필수)
 *   userId: string               // 요청한 사용자 ID   (필수 / 인증용)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   post: PostWithAuthor         // 수정된 게시글
 * }
 *
 * Error 반환 예시
 * ------------------------------------------------------
 * 400: { error: "Missing fields." }
 * 403: { error: "Not authorized" }       // 작성자가 아님
 * 404: { error: "Post not found" }       // 해당 게시글 없음
 * 500: { error: "Failed to update metadata" }
 *
 * 내부 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필드 검증
 * 2️⃣ 게시글 존재 여부 확인
 * 3️⃣ 작성자(userId) 권한 검증
 * 4️⃣ DB 업데이트
 * 5️⃣ 변경된 데이터 반환
 *
 * 관련 기능
 * ------------------------------------------------------
 * - PostDetailPage → "수정" 버튼 클릭
 * - EditPostPage → 제목/카테고리 변경 시 호출
 *
 * 주의 사항
 * ------------------------------------------------------
 * - Soft-Delete 된 글은 수정 불가 (postService 내부 처리)
 * - 카테고리는 enum(BoardCategory) 값만 허용
 * ======================================================
 */


export async function POST(req: Request) {
  const { postId, title, category, userId } = await req.json();

  if (!postId || !title || !category || !userId) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const { post, error } = await getPostById(postId);
  if (error || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.getAuthorId() !== userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const result = await updatePostMeta(postId, title, category);

  if (result.error || !result.post) {
    return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
  }

  return NextResponse.json({ post: result.post });
}
