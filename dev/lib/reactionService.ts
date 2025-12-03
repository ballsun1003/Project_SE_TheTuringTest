// lib/reactionService.ts
import { supabase } from "./supabaseClient";
import { createNotification } from "./notificationService"; // 🔥 추가됨
/**
 * ======================================================
 * Reaction Service (reactionService.ts)
 * ======================================================
 * 게시글에 대한 좋아요 / 싫어요 반응 처리 기능을 제공한다.
 * Supabase RPC를 이용하여 자동으로 반응 상태 변경 및
 * 게시글의 좋아요/싫어요 카운트를 관리한다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. toggleReaction(postId, userId, type)
 *    - 유저의 좋아요/싫어요 요청 처리
 *    - Supabase RPC("toggle_post_reaction") 호출
 *      → 기존 상태에 따라 자동으로 다음 중 하나 적용
 *        ✔ 좋아요 추가
 *        ✔ 싫어요 추가
 *        ✔ 반응 변경 (좋아요 ↔ 싫어요)
 *        ✔ 반응 취소 (이미 누른 버튼을 다시 누른 경우)
 *    - 게시글 작성자가 아닌 경우 알림(notification) 생성
 *    - 처리 후 최신 like_count / dislike_count /
 *      사용자 반응 상태(userReaction) 반환
 *    - 오류 발생 시 에러 메시지 반환
 *
 * 2. getUserReaction(postId, userId)
 *    - post_reactions 테이블에서
 *      해당 유저가 남긴 반응 조회
 *    - UI가 사용자 반응 표시(하이라이트 등)에 활용
 *
 *
 * 연관 DB 요소
 * ------------------------------------------------------
 * - posts 테이블 (author 조회 및 count 반영)
 * - post_reactions 테이블 (사용자 반응 기록)
 * - notifications 테이블 (타인의 게시글에 반응 시 알림 생성)
 *
 *
 * 오류 처리 정책
 * ------------------------------------------------------
 * - 게시글 미존재 → "Post not found"
 * - RPC 실패 → "Failed to toggle reaction"
 * - 일반 예외 → "Server error"
 *
 *
 * 목적:
 * ------------------------------------------------------
 * 좋아요/싫어요 기능을 단일 함수에서 처리하도록 하여
 * UI 상의 즉각적 반영 및 알림 시스템과 연동한다.
 * ======================================================
 */


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
