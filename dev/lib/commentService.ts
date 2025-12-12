// lib/commentService.ts

import { supabase } from "./supabaseClient";
import { Comment, mapDBComment } from "./entities/Comment";
import { ROOT_USER_ID } from "./userService";

/**
 * ======================================================
 * Comment Service (commentService.ts)
 * ======================================================
 * 게시글에 대한 댓글(Comment) CRUD 기능을 제공한다.
 * Supabase comments 테이블 기반으로 동작하며
 * 작성자 username 정보를 JOIN하여 함께 반환한다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. createComment(postId, authorId, content, prompt)
 *    - 댓글 생성
 *    - 초기 prompt 저장 (AI 기반 생성/수정 활용 가능)
 *    - 작성자 username join 포함 반환
 *
 * 2. updateCommentContent(commentId, newContent, updatedPrompt?, userId?)
 *    - 댓글 본문 및 AI 프롬프트 수정
 *    - 작성자 본인 또는 ROOT 계정만 수정 가능
 *    - updated_at 갱신
 *
 * 3. getCommentById(commentId)
 *    - 단일 댓글 조회
 *    - 작성자 username 포함
 *
 * 4. listCommentsByPostId(postId)
 *    - 특정 게시글의 모든 댓글 조회
 *    - 작성자 username 포함
 *    - 작성 시점(created_at) 오름차순 정렬
 *
 * 5. deleteComment(commentId, userId)
 *    - 댓글 삭제
 *    - 작성자 본인 또는 ROOT 계정만 삭제 허용
 *
 * 6. listCommentsByUser(userId)
 *    - 특정 사용자가 작성한 모든 댓글 조회
 *    - 최신순 정렬
 *    - 관련 게시글의 title join 포함
 *
 *
 * 공통 처리 요소
 * ------------------------------------------------------
 * - 댓글 데이터 + 작성자 username 매핑
 * - 권한 검증(작성자 or ROOT_USER_ID)
 * - 오류 발생 시 명확한 메시지 반환
 *
 *
 * 목적
 * ------------------------------------------------------
 * 댓글 작성 → 조회 → 수정 → 삭제 까지의 전체 사이클을
 * 서비스 계층에서 통합 관리하여 UI/비즈니스 로직을 단순화한다.
 * ======================================================
 */


// username 포함된 타입
export type CommentWithAuthor = Comment & {
  authorName: string | null;
};

// 공통 매핑 함수
function mapCommentWithAuthor(row: any): CommentWithAuthor {
  const base = mapDBComment(row);
  return Object.assign(base, {
    authorName: row.author?.username ?? null,
  });
}

/* ============================================================
   1. 댓글 생성 (AI 본문 + username 포함)
   ============================================================ */
export async function createComment(
  postId: string,
  authorId: string,
  content: string,
  prompt: string
): Promise<{ comment?: CommentWithAuthor; error?: string }> {

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: postId,
        author_id: authorId,
        content,
        prompt,
        updated_prompt: null,
      },
    ])
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to create comment." };

  return { comment: mapCommentWithAuthor(data) };
}


/* ============================================================
   2. 댓글 수정 (작성자 검증 + AI 재작성)
   ============================================================ */
export async function updateCommentContent(
  commentId: string,
  newContent: string,
  updatedPrompt?: string,
  userId?: string // 🔥 작성자 검증을 위해 추가
): Promise<{ comment?: CommentWithAuthor; error?: string }> {

  // 1) 기존 댓글 불러오기
  const { data: oldComment, error: findErr } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();

  if (findErr || !oldComment) return { error: "Comment not found." };

  // 2) 작성자 검증
  if (userId && oldComment.author_id !== userId) {
    return { error: "Not authorized to update comment." };
  }

  // 3) 최종 업데이트
  const { data, error } = await supabase
    .from("comments")
    .update({
      content: newContent,
      updated_prompt: updatedPrompt || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to update comment." };

  return { comment: mapCommentWithAuthor(data) };
}


/* ============================================================
   3. 댓글 단일 조회
   ============================================================ */
export async function getCommentById(commentId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:author_id(username)")
    .eq("id", commentId)
    .single();

  if (error || !data) return { error: "Comment not found." };
  return { comment: mapCommentWithAuthor(data) };
}


/* ============================================================
   4. 게시글별 댓글 목록 조회
   ============================================================ */
export async function listCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:author_id(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) return { error: "Failed to load comments." };
  return { comments: data.map(mapCommentWithAuthor) };
}


export async function deleteComment(commentId: string, userId: string) {
  const { data: oldComment, error: findErr } = await supabase
    .from("comments")
    .select("author_id")
    .eq("id", commentId)
    .single();

  if (findErr || !oldComment) return { error: "Comment not found." };

  // 🔥 루트 권한: 다른 사람 댓글도 삭제 허용
  if (userId !== ROOT_USER_ID && oldComment.author_id !== userId) {
    return { error: "Not authorized to delete comment." };
  }

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) return { error: "Failed to delete comment." };
  return { success: true };
}
// // 유저따라 댓글 리스트 불러오기
// export async function listCommentsByUser(userId: string) {
//   const { data, error } = await supabase
//     .from("comments")
//     .select("*, post:post_id(title)")
//     .eq("author_id", userId)
//     .order("created_at", { ascending: false });

//   if (error || !data) return { error: "Failed to load comments by user" };

//   return { comments: data };
// }
// 유저따라 댓글 리스트 불러오기 (삭제된 게시글 제외 버전)
export async function listCommentsByUser(userId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
        *,
        post:post_id (
          id,
          title,
          is_deleted
        )
      `
    )
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("listCommentsByUser error:", error);
    return { comments: [], error: "Failed to load comments by user" };
  }

  // 🔥 1차 필터: post가 아예 없는 경우 제거 (하드 삭제된 게시글)
  // 🔥 2차 필터: is_deleted = true 인 게시글의 댓글 제거 (소프트 삭제된 게시글)
  const filtered = data.filter(
    (c: any) => c.post && c.post.is_deleted !== true
  );

  return { comments: filtered };
}

