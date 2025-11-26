
// "use client";

// import { useEffect, useState } from "react";
// import HomeButton from "@/components/homeButton";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import ProtectedLink from "@/components/ProtectedLink";

// export default function PostDetailPage({ params }: { params: { id: string } }) {
//   const router = useRouter();
//   const id = params.id;

//   const [post, setPost] = useState<any>(null);
//   const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
//   const [loading, setLoading] = useState(false);

//   const [comments, setComments] = useState<any[]>([]);
//   const [commentPrompt, setCommentPrompt] = useState("");

//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editingPrompt, setEditingPrompt] = useState("");

//   const userId =
//     typeof window !== "undefined" ? localStorage.getItem("userId") : null;

//   useEffect(() => {
//     loadPost();
//     increaseView();
//     loadUserReaction();
//     loadComments();
//   }, []);

//   /* 게시글 불러오기 */
//   async function loadPost() {
//     const res = await fetch("/api/posts/get", {
//       method: "POST",
//       body: JSON.stringify({ postId: id }),
//     });
//     const json = await res.json();

//     if (json.post) {
//       const p = json.post;
//       setPost({
//         ...p,
//         likeCount: p.likeCount ?? p.like_count,
//         dislikeCount: p.dislikeCount ?? p.dislike_count,
//         viewCount: p.viewCount ?? p.view_count,
//       });
//     }
//   }

//   /* 조회수 증가 */
//   async function increaseView() {
//     const res = await fetch("/api/posts/view", {
//       method: "POST",
//       body: JSON.stringify({ postId: id }),
//     });

//     const json = await res.json();
//     if (json.viewCount !== undefined) {
//       setPost((prev: any) => ({
//         ...prev,
//         viewCount: json.viewCount,
//       }));
//     }
//   }

//   /* 좋아요/싫어요 */
//   async function loadUserReaction() {
//     if (!userId) return;
//     const res = await fetch(`/api/reactions/get?postId=${id}&userId=${userId}`);
//     const json = await res.json();
//     if (json.reaction) setReaction(json.reaction);
//   }

//   async function handleReaction(type: "like" | "dislike") {
//     const finalUserId =
//       userId ?? "00000000-0000-0000-0000-000000000000";

//     const res = await fetch("/api/reactions/toggle", {
//       method: "POST",
//       body: JSON.stringify({ postId: id, userId: finalUserId, type }),
//     });

//     const json = await res.json();
//     if (json.error) {
//       alert(json.error);
//       return;
//     }

//     setPost((prev: any) => ({
//       ...prev,
//       likeCount: json.likeCount ?? json.like_count ?? prev?.likeCount ?? 0,
//       dislikeCount: json.dislikeCount ?? json.dislike_count ?? prev?.dislikeCount ?? 0,
//     }));

//     setReaction(
//       json.userReaction ??
//         (reaction === type ? null : type)
//     );
//   }

//   /* 댓글 불러오기 */
//   async function loadComments() {
//     const res = await fetch("/api/comments/list", {
//       method: "POST",
//       body: JSON.stringify({ postId: id }),
//     });

//     const json = await res.json();
//     if (json.comments) setComments(json.comments);
//   }

//   /* 댓글 생성 (비로그인 불가 처리) */
//   async function handleCreateComment() {
//     if (!userId) {
//       alert("로그인이 필요합니다.");
//       return;
//     }

//     if (!commentPrompt.trim()) {
//       alert("프롬프트를 입력하세요.");
//       return;
//     }

//     const res = await fetch("/api/comments/create", {
//       method: "POST",
//       body: JSON.stringify({
//         postId: id,
//         authorId: userId,
//         prompt: commentPrompt,
//       }),
//     });

//     const json = await res.json();
//     if (json.error) return alert(json.error);

//     setComments((prev) => [...prev, json.comment]);
//     setCommentPrompt("");
//   }

//   /* 댓글 수정 */
//   async function handleUpdateComment(commentId: string) {
//     if (!editingPrompt.trim()) {
//       alert("프롬프트를 입력하세요.");
//       return;
//     }

//     const res = await fetch("/api/comments/update", {
//       method: "POST",
//       body: JSON.stringify({
//         commentId,
//         authorId: userId,
//         updatedPrompt: editingPrompt,
//       }),
//     });

//     const json = await res.json();
//     if (json.error) return alert(json.error);

//     setComments((prev) =>
//       prev.map((c) => (c.id === commentId ? json.comment : c))
//     );

//     setEditingCommentId(null);
//     setEditingPrompt("");
//   }

//   /* 댓글 삭제 */
//   async function handleDeleteComment(commentId: string) {
//     const ok = confirm("정말로 삭제할까요?");
//     if (!ok) return;

//     const res = await fetch("/api/comments/delete", {
//       method: "POST",
//       body: JSON.stringify({ commentId, authorId: userId }),
//     });

//     const json = await res.json();
//     if (json.error) return alert(json.error);

//     setComments((prev) => prev.filter((c) => c.id !== commentId));
//   }

//   /* 게시글 삭제 */
//   async function handleDeletePost() {
//     const ok = confirm("게시글을 삭제할까요?");
//     if (!ok) return;

//     const res = await fetch("/api/posts/delete", {
//       method: "POST",
//       body: JSON.stringify({ postId: id, authorId: userId }),
//     });

//     const json = await res.json();
//     if (json.error) return alert(json.error);

//     router.push("/board/all");
//   }

//   if (!post) {
//     return (
//       <main className="min-h-screen flex items-center justify-center text-gray-700">
//         로딩 중...
//       </main>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 text-gray-800">
//       {/* 상단 */}
//       <div className="flex items-center justify-between px-4 py-4">
//         <HomeButton />
//         <Link href="/board/all" className="text-gray-700 hover:underline">
//           목록으로
//         </Link>
//       </div>

//       {/* 게시글 카드 */}
//       <div className="relative mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">

//         {userId === post.authorId && (
//           <div className="absolute right-4 top-4 flex gap-2">
//             <button
//               onClick={() => router.push(`/post/${id}/edit`)}
//               className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm"
//             >
//               수정
//             </button>
//             <button
//               onClick={handleDeletePost}
//               className="px-3 py-1 bg-red-500 text-white rounded-full text-sm"
//             >
//               삭제
//             </button>
//           </div>
//         )}

//         <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>

//         <div className="mb-4 flex items-center gap-3 text-sm text-gray-700">
//           <span>작성자: {post.authorName}</span>
//           <span className="h-4 w-px bg-gray-300" />
//           <span>조회수: {post.viewCount?.toLocaleString()}회</span>
//         </div>

//         <div className="mb-3 text-xs text-gray-600">
//           작성일: {post.createdAt} / 수정일: {post.updatedAt}
//         </div>

//         <hr className="my-4" />

//         <article className="whitespace-pre-wrap leading-relaxed">
//           {post.content}
//         </article>

//         <hr className="my-6" />

//         <div className="flex items-center justify-end gap-6 relative z-0">
//           <div className="text-sm text-gray-700">
//             조회수 {post.viewCount?.toLocaleString()}회
//           </div>

//           <div className="flex gap-3">
            
//             <button
            
//               onClick={() => handleReaction("like")}
//               className={`px-3 py-1 border rounded-full ${
//                 reaction === "like"
//                   ? "bg-blue-100 border-blue-500"
//                   : "border-gray-400"
//               }`}
//             >
//               👍 {post.likeCount}
//             </button>
            

//             <button
//               onClick={() => handleReaction("dislike")}
//               className={`px-3 py-1 border rounded-full ${
//                 reaction === "dislike"
//                   ? "bg-red-100 border-red-500"
//                   : "border-gray-400"
//               }`}
//             >
//               👎 {post.dislikeCount}
//             </button>
//           </div>
//         </div>

//         {/* 댓글 목록 */}
//         <div className="mt-10">
//           <h2 className="text-lg font-bold mb-4">댓글</h2>

//           {comments.map((c) => (
//             <div key={c.id} className="relative border rounded-xl p-4 mb-4 bg-gray-50 z-10">
//               {userId === c.authorId && (
//                 <div className="absolute right-3 top-3 flex gap-2 z-20">
//                   <button
//                     onClick={() => {
//                       setEditingCommentId(c.id);
//                       setEditingPrompt("");
//                     }}
//                     className="px-3 py-1 bg-blue-500 text-white text-xs rounded-full"
//                   >
//                     수정
//                   </button>

//                   <button
//                     onClick={() => handleDeleteComment(c.id)}
//                     className="px-3 py-1 bg-red-500 text-white text-xs rounded-full"
//                   >
//                     삭제
//                   </button>
//                 </div>
//               )}

//               <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
//                 <span className="font-semibold">{c.authorName}</span>
//                 <span className="text-gray-500 text-xs">
//                   {new Date(c.createdAt).toLocaleString()}
//                 </span>
//                 {c.updatedAt && (
//                   <span className="text-gray-400 text-xs ml-2">(수정됨)</span>
//                 )}
//               </div>

//               <p className="whitespace-pre-wrap mb-2 text-gray-800">
//                 {c.content}
//               </p>

//               {editingCommentId === c.id && (
//                 <div className="mt-3">
//                   <textarea
//                     value={editingPrompt}
//                     onChange={(e) => setEditingPrompt(e.target.value)}
//                     className="w-full border p-2 rounded-md h-20 text-gray-800"
//                     placeholder="AI에게 수정 내용을 알려주세요..."
//                   />
//                   <button
//                     onClick={() => handleUpdateComment(c.id)}
//                     className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
//                   >
//                     AI로 수정
//                   </button>
//                   <button
//                     onClick={() => setEditingCommentId(null)}
//                     className="mt-2 ml-2 px-3 py-1 bg-gray-300 rounded-md"
//                   >
//                     취소
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* 댓글 작성 (비로그인 시 비활성화) */}
//         <div className="mt-10 border rounded-xl p-4 bg-white shadow-sm">
//           <h3 className="font-semibold mb-2 text-gray-800">댓글 작성</h3>

//           <textarea
//             value={commentPrompt}
//             onChange={(e) => setCommentPrompt(e.target.value)}
//             className="w-full border rounded-md p-2 h-24 text-gray-800"
//             placeholder="AI에게 댓글 내용을 알려주세요..."
//           />

//           <button
//             onClick={handleCreateComment}
//             disabled={!userId}
//             className={`mt-3 px-4 py-2 rounded-md ${
//               userId
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//           >
//             {userId ? "AI 댓글 생성하기" : "로그인 후 작성 가능"}
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import HomeButton from "@/components/homeButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ROOT_ID = "00000000-0000-0000-0000-000000000001";

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;

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
    loadPost();
    increaseView();
    loadUserReaction();
    loadComments();
  }, []);

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
      likeCount: json.likeCount ?? json.like_count,
      dislikeCount: json.dislikeCount ?? json.dislike_count,
    }));
    setReaction(json.userReaction);
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
    <main className="min-h-screen bg-gray-50 text-gray-800">
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

