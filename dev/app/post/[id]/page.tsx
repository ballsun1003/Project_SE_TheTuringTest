// app/posts/[id]/page.tsx
import HomeButton from "@/components/homeButton";
import { PostProps } from "@/lib/entities/Post";
import Link from "next/link";


export default function PostDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // TODO: 실제로는 여기서 id를 이용해서 DB/API에서 게시글을 가져오면 됨.
  // 지금은 UI 예시를 위해 더미 데이터 사용
  const post: PostProps = {
    id,
    title: "예시 게시글 제목입니다.",
    content:
      "여기에 게시글 내용이 들어갑니다.\n줄바꿈도 이렇게 여러 줄로 들어갈 수 있어요.\nAI가 생성한 글이라면, 어떤 모델을 사용했는지 아래에 표시됩니다.",
    authorId: "user123",
    modelName: "gpt-5.1-thinking",
    likeCount: 12,
    dislikeCount: 1,
    viewCount: 345,
    createdAt: "2025-11-18T10:30:00.000Z",
    updatedAt: "2025-11-18T12:00:00.000Z",
    isDeleted: false,
  };


  if (post.isDeleted) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-between px-4 py-4">
          <HomeButton />
          <Link
            href="/posts"
            className="text-sm text-gray-600 hover:underline"
          >
            목록으로
          </Link>
        </div>

        <div className="mx-auto mt-8 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm text-center text-gray-500">
          <p className="text-lg font-semibold mb-2">삭제된 게시글입니다.</p>
          <p className="text-sm">
            작성자 또는 관리자에 의해 삭제된 게시글입니다.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <Link
          href="/board/all"
          className="text-sm text-gray-600 hover:underline"
        >
          목록으로
        </Link>
      </div>

      {/* 게시글 카드 */}
      <div className="mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-2xl font-bold">{post.title}</h1>

        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>작성자: {post.authorId}</span>
          <span className="h-4 w-px bg-gray-300" />
          <span>모델: {post.modelName}</span>
          <span className="h-4 w-px bg-gray-300" />
          <span>조회수: {post.viewCount.toLocaleString()}회</span>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-400">
          <span>작성일: {post.createdAt}</span>
          <span className="h-3 w-px bg-gray-300" />
          <span>수정일: {post.updatedAt}</span>
        </div>

        <hr className="my-4" />

        {/* 내용 */}
        <article className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </article>

        <hr className="my-6" />

        {/* 좋아요/싫어요/조회수 영역 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm">
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              <span>👍</span>
              <span>{post.likeCount}</span>
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
            >
              <span>👎</span>
              <span>{post.dislikeCount}</span>
            </button>
          </div>

          <div className="text-xs text-gray-500">
            조회수 {post.viewCount.toLocaleString()}회
          </div>
        </div>
      </div>
    </main>
  );
}
