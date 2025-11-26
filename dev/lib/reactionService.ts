// lib/reactionService.ts
import { supabase } from "./supabaseClient";
import { createNotification } from "./notificationService"; // 🔥 추가됨

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
    // ===========================================
    // 1) 게시글 작성자 ID 가져오기 (알림 보내기 위함)
    // ===========================================
    const { data: postData, error: postErr } = await supabase
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (postErr || !postData) {
      return { error: "Post not found" };
    }

    const postAuthorId = postData.author_id;

    // 자기 글이면 알림 보내지 않음
    const shouldSendNotification = userId !== postAuthorId;

    // ===========================================
    // 2) Supabase RPC 호출 (기존 코드 그대로 유지)
    // ===========================================
    const { data, error } = await supabase.rpc("toggle_post_reaction", {
      p_post_id: postId,
      p_user_id: userId,
      p_reaction: type,
    });

    if (error || !data) {
      console.error("toggleReaction RPC error:", error);
      return { error: "Failed to toggle reaction" };
    }

    const newReaction = data.user_reaction; 
    // 값: "like" | "dislike" | null

    // ===========================================
    // 3) 알림 생성 (좋아요/싫어요 눌렀을 때만)
    // ===========================================
    // if (shouldSendNotification && newReaction) {
    //   await createNotification(
    //     postAuthorId, // toUser
    //     userId,       // fromUser
    //     postId,
    //     newReaction   // "like" 또는 "dislike"
    //   );
    // }
    // ===========================================
// 3) 알림 생성 (좋아요/싫어요 눌렀을 때 무조건)
// ===========================================
if (shouldSendNotification) {
  await createNotification(
    postAuthorId,   // toUser
    userId,         // fromUser
    postId,
    type            // "like" 또는 "dislike"
  );
}


    // ===========================================
    // 4) 프론트로 반환
    // ===========================================
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

    if (error)
      return { error: "Failed to load user reaction", reaction: null };

    return { reaction: data?.reaction ?? null };
  } catch (err) {
    return { error: "Server error", reaction: null };
  }
}
