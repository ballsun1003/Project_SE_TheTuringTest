// lib/postService.ts

import { supabase } from "./supabaseClient";
import { Post, mapDBPost, BoardCategory } from "./entities/Post";
import { ROOT_USER_ID } from "./userService";

export type PostWithAuthor = Post & { authorName: string | null };

// 공통 매핑 함수
function mapPostWithAuthor(row: any): PostWithAuthor {
  const base = mapDBPost(row);
  return Object.assign(base, {
    authorName: row.author?.username ?? null,
  });
}

/* =========================
   1. 게시글 생성
   ========================= */
export async function createPost(
  authorId: string,
  title: string,
  prompt: string,
  category: BoardCategory
) {
  const { data, error } = await supabase
    .from("posts")
    .insert([
      {
        author_id: authorId,
        title,
        content: "",   // 🔥 빈 문자열 대신 null (이게 핵심 수정!!)
        prompt,
        updated_prompt: null,
        like_count: 0,
        dislike_count: 0,
        view_count: 0,
        category,
        is_deleted: false,
      },
    ])
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to create post" };
  return { post: mapPostWithAuthor(data) };
}


/* =========================
   2. 본문 수정(AI 반영)
   ========================= */
export async function updatePostContent(postId: string, newContent: string, updatedPrompt?: string) {
  const { data, error } = await supabase
    .from("posts")
    .update({
      content: newContent,
      updated_prompt: updatedPrompt || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("is_deleted", false)
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to update post content" };
  return { post: mapPostWithAuthor(data) };
}

/* =========================
   3. 메타데이터 수정 (제목/카테고리)
   ========================= */
export async function updatePostMeta(postId: string, title: string, category: BoardCategory) {
  const { data, error } = await supabase
    .from("posts")
    .update({
      title,
      category,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("is_deleted", false)
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to update post metadata" };
  return { post: mapPostWithAuthor(data) };
}

/* =========================
   4. 단일 조회
   ========================= */
export async function getPostById(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id(username)")
    .eq("id", postId)
    .eq("is_deleted", false)
    .single();

  if (error || !data) return { error: "Post not found" };
  return { post: mapPostWithAuthor(data) };
}

/* =========================
   5. 목록 조회
   ========================= */
export async function listPostsByCategory(category: BoardCategory | "all") {
  let query = supabase.from("posts").select("*, author:author_id(username)").eq("is_deleted", false);

  if (category !== "all") query = query.eq("category", category);
  const { data, error } = await query.order("created_at", { ascending: false });

  if (error || !data) return { error: "Failed to load posts" };
  return { posts: data.map(mapPostWithAuthor) };
}

/* =========================
   6. 유저별 조회
   ========================= */
export async function listPostsByUser(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id(username)")
    .eq("author_id", userId)
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error || !data) return { error: "Failed to load user posts" };
  return { posts: data.map(mapPostWithAuthor) };
}

/* =========================
   7. 조회수 증가
   ========================= */
export async function increaseViewCount(postId: string) {
  const { data, error } = await supabase.rpc("increment_post_view", {
    post_id: postId,
  });

  if (error || !data) return { error: "Failed to increase view count" };
  return { post: mapDBPost(data) };
}

/* =========================
   8. 게시글 삭제 (Soft Delete)
   ========================= */
// export async function deletePost(postId: string, authorId: string) {
//   // 본인 글인지 체크
//   const { data: post, error: e1 } = await supabase
//     .from("posts")
//     .select("author_id")
//     .eq("id", postId)
//     .single();

//   if (e1 || !post) return { error: "Post not found" };
//   if (post.author_id !== authorId) return { error: "Not authorized" };

//   // 삭제 처리
//   const { error } = await supabase
//     .from("posts")
//     .update({
//       is_deleted: true,
//       updated_at: new Date().toISOString(),
//     })
//     .eq("id", postId);

//   if (error) return { error: "Failed to delete post" };
//   return { success: true };
// }


export async function deletePost(postId: string, authorId: string) {
  const { data: post, error: e1 } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (e1 || !post) return { error: "Post not found" };

  // 🔥 루트 권한: 다른 사람 글도 삭제 가능
  if (authorId !== ROOT_USER_ID && post.author_id !== authorId) {
    return { error: "Not authorized" };
  }

  const { error } = await supabase
    .from("posts")
    .update({
      is_deleted: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);

  if (error) return { error: "Failed to delete post" };
  return { success: true };
}


/* =========================
   9. 전체 수정 API (제목 + 본문)
   ========================= */
export async function updatePost(postId: string, authorId: string, newTitle: string, newContent: string, updatedPrompt?: string) {
  // 작성자 검증
  const { data: post, error: e1 } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (e1 || !post) return { error: "Post not found" };
  if (post.author_id !== authorId) return { error: "Not authorized" };

  // 업데이트
  const { data, error } = await supabase
    .from("posts")
    .update({
      title: newTitle,
      content: newContent,
      updated_prompt: updatedPrompt || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId)
    .eq("is_deleted", false)
    .select("*, author:author_id(username)")
    .single();

  if (error || !data) return { error: "Failed to update post" };
  return { post: mapPostWithAuthor(data) };
}
