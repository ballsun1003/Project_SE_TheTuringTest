import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/lib/postService";
import { getUserReaction } from "@/lib/reactionService";

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
