// lib/reactionService.ts
import { supabase } from "./supabaseClient";

/**
 * toggleReaction
 * 좋아요/싫어요/취소 자동 처리
 *
 * @param postId 게시글 ID
 * @param userId 유저 ID
 * @param type "like" | "dislike"
 */
export async function toggleReaction(
  postId: string,
  userId: string,
  type: "like" | "dislike"
): Promise<{
  likeCount?: number;
  dislikeCount?: number;
  userReaction?: "like" | "dislike" | null;
  error?: string;
}> {
  try {
    // 1) Supabase RPC 호출
    const { data, error } = await supabase.rpc("toggle_post_reaction", {
      p_post_id: postId,
      p_user_id: userId,
      p_reaction: type,
    });

    if (error || !data) {
      console.error("toggleReaction RPC error:", error);
      return { error: "Failed to toggle reaction" };
    }

    // data = { like_count: ..., dislike_count: ..., user_reaction: ... }
    return {
      likeCount: data.like_count,
      dislikeCount: data.dislike_count,
      userReaction: data.user_reaction,
    };
  } catch (err) {
    console.error("toggleReaction error:", err);
    return { error: "Server error" };
  }
}

/**
 * getUserReaction
 * 특정 게시글에서 유저가 좋아요/싫어요 했는지 확인
 */
export async function getUserReaction(
  postId: string,
  userId: string
): Promise<{
  reaction: "like" | "dislike" | null;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("post_reactions")
      .select("reaction")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return { error: "Failed to load user reaction", reaction: null };

    return { reaction: data?.reaction ?? null };
  } catch (err) {
    return { error: "Server error", reaction: null };
  }
}
