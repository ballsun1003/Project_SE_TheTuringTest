"use client";

import { use, useEffect, useState } from "react";
import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * PostDetailPage (게시글 상세 조회 페이지)
 * ======================================================
 * 선택된 게시글의 상세 내용을 표시하고,
 * 좋아요/싫어요 반응, 댓글 생성/수정/삭제,
 * 게시글 삭제, 조회수 증가를 처리하는
 * 클라이언트 기반 상세 화면 컴포넌트.
 *
 * 데이터 로딩 및 초기 동작
 * ------------------------------------------------------
 * - loadPost(): 게시글 상세 데이터 fetch
 * - increaseView(): 게시글 조회수 +1
 * - loadUserReaction(): 로그인 유저의 reaction 상태 확인
 * - loadComments(): 게시글에 작성된 댓글 목록 가져오기
 *
 * 권한 정책
 * ------------------------------------------------------
 * - 좋아요/싫어요: 로그인 사용자만 가능
 * - 댓글 생성: 로그인 사용자만 가능
 * - 댓글 수정: 본인만 가능
 * - 댓글 삭제: 본인 또는 ROOT 사용자
 * - 게시글 수정: 본인만
 * - 게시글 삭제: 본인 또는 ROOT 사용자
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1️⃣ 좋아요/싫어요(toggle)
 * - handleReaction()
 * - 현재 상태 기반으로 자동 취소/변경 처리
 *
 * 2️⃣ 댓글 CRUD
 * - handleCreateComment(): AI 프롬프트 기반 댓글 생성
 * - handleUpdateComment(): AI로 댓글 재작성
 * - handleDeleteComment(): 댓글 삭제 (권한 검증 포함)
 *
 * 3️⃣ 게시글 삭제
 * - handleDeletePost(): 삭제 후 게시판 목록 이동
 *
 * UI / UX 구성
 * ------------------------------------------------------
 * - HomeButton: 홈 이동
 * - 목록으로 돌아가기 링크
 * - 조회수/좋아요/싫어요 표시 및 즉시 UI 반영
 * - 댓글 수정 시 textarea 토글 UI 제공
 * - TailwindCSS 기반 스타일링
 *
 * State 요약
 * ------------------------------------------------------
 * post: 게시글 데이터
 * reaction: 유저 반응 상태 ("like" | "dislike" | null)
 * comments: 댓글 리스트
 * commentPrompt: 새 댓글 생성 프롬프트 입력값
 * editingCommentId: 수정 중인 댓글 ID
 * editingPrompt: 댓글 수정 프롬프트
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자가 게시글과 상호작용할 수 있는 상세 화면 제공
 * - AI 댓글 및 반응 기능을 통해 사용자 경험 강화
 * ======================================================
 */


const ROOT_ID = "00000000-0000-0000-0000-000000000001";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Next.js 15: params는 Promise이므로 React.use()로 언랩(unwrap)해야 합니다.
  const { id } = use(params);

  const [post, setPost] = useState<any>(null);
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);

  const [comments, setComments] = useState<any[]>([]);
  const [commentPrompt, setCommentPrompt] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const isRoot = userId === ROOT_ID;

  useEffect(() => {
    // id가 로드된 후에 실행되어야 하므로 useEffect 내부 로직은 그대로 유지해도 되지만,
    // id 값 자체가 use(params)를 통해 확보된 상태에서 실행됩니다.
    loadPost();
    increaseView();
    loadUserReaction();
    loadComments();
  }, [id]); // id가 변경될 때마다 재실행되도록 의존성 배열에 id 추가 권장

  async function loadPost() {
    const res = await fetch("/api/posts/get", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });

    const json = await res.json();
    if (json.post) {
      const p = json.post;
      setPost({
        ...p,
        likeCount: p.likeCount ?? p.like_count,
        dislikeCount: p.dislikeCount ?? p.dislike_count,
        viewCount: p.viewCount ?? p.view_count,
      });
    }
  }

  async function increaseView() {
    await fetch("/api/posts/view", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });
  }

  async function loadUserReaction() {
    if (!userId) return;
    const res = await fetch(`/api/reactions/get?postId=${id}&userId=${userId}`);
    const json = await res.json();
    if (json.reaction) setReaction(json.reaction);
  }
  
  async function handleReaction(type: "like" | "dislike") {
    if (!userId) return alert("로그인이 필요합니다.");

    const res = await fetch("/api/reactions/toggle", {
      method: "POST",
      body: JSON.stringify({ postId: id, userId, type }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setPost((prev: any) => ({
      ...prev,
      likeCount:
        json.likeCount ??
        json.like_count ??
        (prev?.likeCount ?? prev?.like_count ?? 0),
      dislikeCount:
        json.dislikeCount ??
        json.dislike_count ??
        (prev?.dislikeCount ?? prev?.dislike_count ?? 0),
    }));

    // 서버가 userReaction 안 보내면, 이전 상태 기준으로 토글
    setReaction(
      json.userReaction !== undefined
        ? json.userReaction
        : reaction === type
        ? null
        : type
    );
  }


  async function loadComments() {
    const res = await fetch("/api/comments/list", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });
    const json = await res.json();
    if (json.comments) setComments(json.comments);
  }

  async function handleCreateComment() {
    if (!userId) return alert("로그인이 필요합니다.");
    if (!commentPrompt.trim()) return alert("AI 프롬프트를 입력하세요.");

    const res = await fetch("/api/comments/create", {
      method: "POST",
      body: JSON.stringify({
        postId: id,
        authorId: userId,
        prompt: commentPrompt,
      }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setComments((prev) => [...prev, json.comment]);
    setCommentPrompt("");
  }

  async function handleUpdateComment(commentId: string) {
    if (!editingPrompt.trim()) return alert("프롬프트를 입력하세요.");

    const res = await fetch("/api/comments/update", {
      method: "POST",
      body: JSON.stringify({
        commentId,
        authorId: userId,
        updatedPrompt: editingPrompt,
      }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? json.comment : c))
    );
    setEditingCommentId(null);
    setEditingPrompt("");
  }

  async function handleDeleteComment(commentId: string) {
    const ok = confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;

    const res = await fetch("/api/comments/delete", {
      method: "POST",
      body: JSON.stringify({ commentId, authorId: userId }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  async function handleDeletePost() {
    const ok = confirm("게시글을 삭제하시겠습니까?");
    if (!ok) return;

    const res = await fetch("/api/posts/delete", {
      method: "POST",
      body: JSON.stringify({ postId: id, authorId: userId }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    router.push("/board/all");
  }

  if (!post) return <div>로딩중...</div>;

  return (
    <main className="min-h-screen text-gray-800">
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <Link href="/board/all" className="text-gray-700 hover:underline">
          목록으로
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-3xl border bg-white p-8 shadow-sm rounded-2xl">
        {/* 수정 버튼 - 본인만 */}
        {userId === post.authorId && (
          <button
            onClick={() => router.push(`/post/${id}/edit`)}
            className="absolute right-4 top-4 bg-blue-500 text-white text-sm rounded-full px-3 py-1"
          >
            수정
          </button>
        )}

        {/* 삭제 버튼 - 루트 or 본인 */}
        {(isRoot || userId === post.authorId) && (
          <button
            onClick={handleDeletePost}
            className="absolute right-4 top-12 bg-red-500 text-white text-sm rounded-full px-3 py-1"
          >
            삭제
          </button>
        )}

        <h1 className="text-2xl font-bold">{post.title}</h1>

        <p className="text-sm text-gray-600 mt-2">
          작성자: {post.authorName} / 조회 {post.viewCount}회
        </p>

        <hr className="my-4" />

        <article className="whitespace-pre-wrap leading-relaxed text-gray-900">
          {post.content}
        </article>

        <hr className="my-6" />

        {/* 좋아요 영역 */}
        <div className="flex gap-4 justify-end">
          <button
            disabled={!userId}
            onClick={() => handleReaction("like")}
            className={`px-3 py-1 rounded-full border ${
              userId
                ? reaction === "like"
                  ? "border-blue-600 bg-blue-100"
                  : "border-gray-400"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            👍 {post.likeCount}
          </button>

          <button
            disabled={!userId}
            onClick={() => handleReaction("dislike")}
            className={`px-3 py-1 rounded-full border ${
              userId
                ? reaction === "dislike"
                  ? "border-red-600 bg-red-100"
                  : "border-gray-400"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            👎 {post.dislikeCount}
          </button>
        </div>

        {/* 댓글 목록 */}
        <div className="mt-10">
          <h2 className="font-bold mb-4">댓글</h2>

          {comments.map((c) => {
            const canDel = isRoot || userId === c.authorId;

            return (
              <div key={c.id} className="border p-4 rounded-xl bg-gray-50 mb-4 relative">
                {userId === c.authorId && (
                  <button
                    onClick={() => {
                      setEditingCommentId(c.id);
                      setEditingPrompt("");
                    }}
                    className="absolute right-3 top-3 bg-blue-500 text-xs text-white py-1 px-2 rounded-full"
                  >
                    수정
                  </button>
                )}

                {canDel && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="absolute right-3 top-10 bg-red-500 text-xs text-white py-1 px-2 rounded-full"
                  >
                    삭제
                  </button>
                )}

                <p className="font-semibold">{c.authorName}</p>
                <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>

                {editingCommentId === c.id && (
                  <div className="mt-3">
                    <textarea
                      value={editingPrompt}
                      onChange={(e) => setEditingPrompt(e.target.value)}
                      className="w-full border p-2 rounded-md"
                    />
                    <button
                      onClick={() => handleUpdateComment(c.id)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                    >
                      AI로 수정
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 댓글 입력 */}
        <div className="mt-10">
          <h3 className="font-semibold mb-2">댓글 작성</h3>
          <textarea
            value={commentPrompt}
            onChange={(e) => setCommentPrompt(e.target.value)}
            className="w-full border rounded-md p-2 min-h-24"
            placeholder="AI에게 댓글 내용을 알려주세요..."
          />
          <button
            disabled={!userId}
            onClick={handleCreateComment}
            className={`mt-3 px-4 py-2 rounded-md ${
              userId ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {userId ? "AI 댓글 생성하기" : "로그인 후 작성 가능"}
          </button>
        </div>
      </div>
    </main>
  );
}