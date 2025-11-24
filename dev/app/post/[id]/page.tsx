"use client";

import { useEffect, useState } from "react";
import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

  const [post, setPost] = useState<any>(null);
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const [loading, setLoading] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState<any[]>([]);
  const [commentPrompt, setCommentPrompt] = useState("");

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingPrompt, setEditingPrompt] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    loadPost();
    increaseView();
    loadUserReaction();
    loadComments();
  }, []);

  /* --------------------------------
        게시글 불러오기
  -------------------------------- */
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

  /* --------------------------------
        조회수 증가
  -------------------------------- */
  async function increaseView() {
    const res = await fetch("/api/posts/view", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });

    const json = await res.json();
    if (json.viewCount !== undefined) {
      setPost((prev: any) => ({
        ...prev,
        viewCount: json.viewCount,
      }));
    }
  }

  /* --------------------------------
        좋아요 / 싫어요 상태
  -------------------------------- */
  async function loadUserReaction() {
    if (!userId) return;
    const res = await fetch(`/api/reactions/get?postId=${id}&userId=${userId}`);
    const json = await res.json();
    if (json.reaction) setReaction(json.reaction);
  }

  async function handleReaction(type: "like" | "dislike") {
  const finalUserId =
    userId ?? "00000000-0000-0000-0000-000000000000";

  const res = await fetch("/api/reactions/toggle", {
    method: "POST",
    body: JSON.stringify({ postId: id, userId: finalUserId, type }),
  });

  const json = await res.json();
  if (json.error) {
    alert(json.error);
    return;
  }

  // 1) 서버에서 count를 보내주면 그대로 반영
  if (
    json.likeCount !== undefined ||
    json.like_count !== undefined ||
    json.dislikeCount !== undefined ||
    json.dislike_count !== undefined
  ) {
    setPost((prev: any) => ({
      ...prev,
      likeCount:
        json.likeCount ?? json.like_count ?? prev?.likeCount ?? 0,
      dislikeCount:
        json.dislikeCount ?? json.dislike_count ?? prev?.dislikeCount ?? 0,
    }));
  } else {
    // 2) 혹시 count 안 보내면, DB에서 다시 읽어오기
    await loadPost();
  }

  // 3) 내 반응 상태도 서버 값 기준으로 맞추기
  setReaction(
    json.userReaction ??
      (reaction === type ? null : type)
  );
}




  /* --------------------------------
        댓글 불러오기
  -------------------------------- */
  async function loadComments() {
    const res = await fetch("/api/comments/list", {
      method: "POST",
      body: JSON.stringify({ postId: id }),
    });

    const json = await res.json();
    if (json.comments) setComments(json.comments);
  }

  /* --------------------------------
        댓글 생성 (비로그인 OK)
  -------------------------------- */
  async function handleCreateComment() {
    const finalAuthorId =
      userId ?? "00000000-0000-0000-0000-000000000000";

    if (!commentPrompt.trim()) {
      alert("프롬프트를 입력하세요.");
      return;
    }

    const res = await fetch("/api/comments/create", {
      method: "POST",
      body: JSON.stringify({
        postId: id,
        authorId: finalAuthorId,
        prompt: commentPrompt,
      }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setComments((prev) => [...prev, json.comment]);
    setCommentPrompt("");
  }

  /* --------------------------------
        댓글 수정 (AI)
  -------------------------------- */
  async function handleUpdateComment(commentId: string) {
    if (!editingPrompt.trim()) {
      alert("프롬프트를 입력하세요.");
      return;
    }

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

  /* --------------------------------
        댓글 삭제
  -------------------------------- */
  async function handleDeleteComment(commentId: string) {
    const ok = confirm("정말로 삭제할까요?");
    if (!ok) return;

    const res = await fetch("/api/comments/delete", {
      method: "POST",
      body: JSON.stringify({ commentId, authorId: userId }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  }

  /* --------------------------------
        게시글 삭제
  -------------------------------- */
  async function handleDeletePost() {
    const ok = confirm("게시글을 삭제할까요?");
    if (!ok) return;

    const res = await fetch("/api/posts/delete", {
      method: "POST",
      body: JSON.stringify({ postId: id, authorId: userId }),
    });

    const json = await res.json();
    if (json.error) return alert(json.error);

    router.push("/board/all");
  }

  /* --------------------------------
        로딩
  -------------------------------- */
  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700">
        로딩 중...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-800">
      {/* 상단 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <Link href="/board/all" className="text-gray-700 hover:underline">
          목록으로
        </Link>
      </div>

      {/* 게시글 카드 */}
      <div className="relative mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">

        {/* 게시글 수정/삭제 버튼 - 게시글 카드 내부 오른쪽 위 */}
        {userId === post.authorId && (
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={() => router.push(`/post/${id}/edit`)}
              className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-3 py-1 bg-red-500 text-white rounded-full text-sm"
            >
              삭제
            </button>
          </div>
        )}

        {/* 제목 */}
        <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>

        {/* 메타 정보 */}
        <div className="mb-4 flex items-center gap-3 text-sm text-gray-700">
          <span>작성자: {post.authorName}</span>
          <span className="h-4 w-px bg-gray-300" />
          <span>조회수: {post.viewCount?.toLocaleString()}회</span>
        </div>

        <div className="mb-3 text-xs text-gray-600">
          작성일: {post.createdAt} / 수정일: {post.updatedAt}
        </div>

        <hr className="my-4" />

        {/* 본문 */}
        <article className="whitespace-pre-wrap leading-relaxed">
          {post.content}
        </article>

        <hr className="my-6" />

        {/* 좋아요/싫어요 + 조회수 */}
        <div className="flex items-center justify-end gap-6 relative z-0">
          <div className="text-sm text-gray-700">
            조회수 {post.viewCount?.toLocaleString()}회
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleReaction("like")}
              className={`px-3 py-1 border rounded-full ${
                reaction === "like"
                  ? "bg-blue-100 border-blue-500"
                  : "border-gray-400"
              }`}
            >
              👍 {post.likeCount}
            </button>

            <button
              onClick={() => handleReaction("dislike")}
              className={`px-3 py-1 border rounded-full ${
                reaction === "dislike"
                  ? "bg-red-100 border-red-500"
                  : "border-gray-400"
              }`}
            >
              👎 {post.dislikeCount}
            </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-4">댓글</h2>

          {comments.map((c) => (
            <div key={c.id} className="relative border rounded-xl p-4 mb-4 bg-gray-50 z-10">

              {/* 댓글 수정/삭제 버튼 - 댓글 카드 기반 오른쪽 위 */}
              {userId === c.authorId && (
                <div className="absolute right-3 top-3 flex gap-2 z-20">
                  <button
                    onClick={() => {
                      setEditingCommentId(c.id);
                      setEditingPrompt("");
                    }}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="px-3 py-1 bg-red-500 text-white text-xs rounded-full"
                  >
                    삭제
                  </button>
                </div>
              )}

              {/* 메타 */}
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
                <span className="font-semibold">{c.authorName}</span>
                <span className="text-gray-500 text-xs">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
                {c.updatedAt && (
                  <span className="text-gray-400 text-xs ml-2">(수정됨)</span>
                )}
              </div>

              {/* 내용 */}
              <p className="whitespace-pre-wrap mb-2 text-gray-800">
                {c.content}
              </p>

              {/* 수정 모드 */}
              {editingCommentId === c.id && (
                <div className="mt-3">
                  <textarea
                    value={editingPrompt}
                    onChange={(e) => setEditingPrompt(e.target.value)}
                    className="w-full border p-2 rounded-md h-20 text-gray-800"
                    placeholder="AI에게 수정 내용을 알려주세요..."
                  />

                  <button
                    onClick={() => handleUpdateComment(c.id)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
                  >
                    AI로 수정
                  </button>

                  <button
                    onClick={() => setEditingCommentId(null)}
                    className="mt-2 ml-2 px-3 py-1 bg-gray-300 rounded-md"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 댓글 작성 */}
        <div className="mt-10 border rounded-xl p-4 bg-white shadow-sm">
          <h3 className="font-semibold mb-2 text-gray-800">댓글 작성</h3>

          <textarea
            value={commentPrompt}
            onChange={(e) => setCommentPrompt(e.target.value)}
            className="w-full border rounded-md p-2 h-24 text-gray-800"
            placeholder="AI에게 댓글 내용을 알려주세요..."
          />

          <button
            onClick={handleCreateComment}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            AI 댓글 생성하기
          </button>
        </div>
      </div>
    </main>
  );
}
