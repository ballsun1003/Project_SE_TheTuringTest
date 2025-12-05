import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/postService";
import { getUserReaction } from "@/lib/reactionService";

/**
 * ======================================================
 * GET POST DETAILS API
 * ======================================================
 * Route: POST /api/posts/get
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 게시글 단일 조회
 * 🔸 로그인한 사용자의 좋아요/싫어요 상태 함께 포함
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,         // 조회할 게시글 ID (필수)
 *   userId?: string | null  // 로그인 사용자 ID (선택)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   post: PostWithAuthor,        // 게시글 + 작성자명 포함
 *   userReaction: "like" | "dislike" | null
 * }
 *
 * 에러 응답
 * ------------------------------------------------------
 * 400: { error: "Missing postId" }
 * 404: { error: "Post not found" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ postService.getPostById → 게시글 정보 조회
 * 2️⃣ 로그인 유저 존재 시
 *     reactionService.getUserReaction → 좋아요/싫어요 여부 확인
 * 3️⃣ 결과 JSON 반환
 *
 * 사용 UI
 * ------------------------------------------------------
 * - PostDetailPage (게시글 상세 화면)
 *
 * 연관 DB Table
 * ------------------------------------------------------
 * - posts
 * - post_reactions (유저 반응 조회 시 사용)
 *
 * 비고
 * ------------------------------------------------------
 * - 게시글이 Soft Deleted 된 경우 postService에서 이미 제외 처리
 * - userReaction 결과값: 좋아요/싫어요/미반응(null)
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { postId, userId } = await req.json();

  if (!postId) {
    return NextResponse.json({ error: "Missing postId" }, { status: 400 });
  }

  // 1) 게시글 가져오기
  const { post, error } = await getPostById(postId);
  if (error || !post) {
    return NextResponse.json({ error: error || "Post not found" }, { status: 404 });
  }

  // 2) 로그인 유저의 리액션 가져오기 (비로그인 시 null)
  let userReaction: "like" | "dislike" | null = null;

  if (userId) {
    const reactionResult = await getUserReaction(postId, userId);
    if (reactionResult?.reaction) {
      userReaction = reactionResult.reaction;
    }
  }

  return NextResponse.json({
    post,
    userReaction,
  });
}
