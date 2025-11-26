// lib/commentService.ts

import { supabase } from "./supabaseClient";
import { Comment, mapDBComment } from "./entities/Comment";


import { ROOT_USER_ID } from "./userService";
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


/* ============================================================
   5. 댓글 삭제 (작성자 본인만 가능)
   ============================================================ */
// export async function deleteComment(
//   commentId: string,
//   userId: string
// ): Promise<{ success?: boolean; error?: string }> {

//   // 1) 기존 댓글 체크
//   const { data: oldComment, error: findErr } = await supabase
//     .from("comments")
//     .select("author_id")
//     .eq("id", commentId)
//     .single();

//   if (findErr || !oldComment) return { error: "Comment not found." };

//   // 2) 작성자 검증
//   if (oldComment.author_id !== userId) {
//     return { error: "Not authorized to delete comment." };
//   }

//   // 3) 삭제 처리
//   const { error } = await supabase
//     .from("comments")
//     .delete()
//     .eq("id", commentId);

//   if (error) return { error: "Failed to delete comment." };

//   return { success: true };
// }


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
