// lib/postService.ts

import { supabase } from "./supabaseClient";
import { Post, mapDBPost, BoardCategory } from "./entities/Post";
import { ROOT_USER_ID } from "./userService";
/**
 * ======================================================
 * Post Service (postService.ts)
 * ======================================================
 * 게시글에 대한 CRUD 기능과 조회 및 정렬 기능을 제공한다.
 * Supabase posts 테이블을 기반으로 동작하며
 * 작성자(username) 정보를 join하여 함께 반환한다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. createPost(authorId, title, prompt, category)
 *    - 신규 게시글 생성 (AI 생성할 내용을 위한 prompt 저장)
 *    - content는 초기값 비어있는 문자열("")로 저장
 *    - like_count, dislike_count, view_count 기본 0 설정
 *    - is_deleted = false 로 생성
 *
 * 2. updatePostContent(postId, newContent, updatedPrompt?)
 *    - AI 생성 본문(content) 갱신
 *    - updated_prompt 저장 가능
 *    - updated_at 자동 갱신
 *
 * 3. updatePostMeta(postId, title, category)
 *    - 제목 및 카테고리 변경
 *    - updated_at 갱신
 *
 * 4. getPostById(postId)
 *    - 단일 게시글 조회
 *    - is_deleted = false 조건 적용
 *
 * 5. listPostsByCategory(category)
 *    - 카테고리별 최신 게시글 목록 조회
 *    - "all"이면 전체 조회
 *    - 삭제되지 않은 게시글만
 *
 * 6. listPostsByUser(userId)
 *    - 특정 사용자가 작성한 게시글 목록 조회
 *    - 최신순 정렬
 *
 * 7. increaseViewCount(postId)
 *    - 조회수 증가를 위한 Supabase RPC 호출
 *    - 오류 발생 시 실패 반환
 *
 * 8. deletePost(postId, authorId)
 *    - Soft Delete 방식: is_deleted = true 업데이트
 *    - 작성자 본인 또는 ROOT 계정만 삭제 가능
 *    - updated_at 갱신
 *
 * 9. updatePost(postId, authorId, newTitle, newContent, updatedPrompt?)
 *    - 제목 + 본문 + AI 프롬프트 통합 수정
 *    - 본인 글인 경우에만 수정 허용
 *    - updated_at 갱신
 *
 * 10. listTopLikedPosts(limit)
 *    - 좋아요 수(like_count) 기준 내림차순 정렬
 *    - 기본 3개 반환
 *    - is_deleted = false 조건 적용
 *
 *
 * 공통 처리 요소
 * ------------------------------------------------------
 * - Author 이름을 author:author_id(username) join하여 함께 반환
 * - Soft Delete 정책: 실제 삭제 대신 is_deleted 로 필터링
 * - 오류 발생 시 명확한 에러 메시지 반환
 *
 *
 * 목적
 * ------------------------------------------------------
 * 게시글 등록 → AI 생성 본문 반영 → 목록/조회 → 수정/삭제 흐름을
 * 하나의 서비스 레이어로 관리하도록 설계되었다.
 * ======================================================
 */


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

export async function listTopLikedPosts(limit: number = 3) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, author:author_id(username)")
    .eq("is_deleted", false)
    .order("like_count", { ascending: false })
    .limit(limit);

  if (error || !data) return { posts: [] };

  return {
    posts: data.map((row) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      authorName: row.author?.username ?? "익명",
      likeCount: row.like_count ?? 0,
      category: row.category,
      createdAt: row.created_at,
    })),
  };
}

