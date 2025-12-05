import { PostProps } from "@/lib/entities/Post";
import Link from "next/link";

// UI에서 받을 수 있는 타입 확장
type PostListItem = PostProps & {
  authorName?: string | null;
  created_at?: string; // DB 필드명 대응
};

type PostListProps = {
  posts: PostListItem[];
};

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        게시글이 없습니다.
      </p>
    );
  }

  return (
    <div className="divide-y">
      {posts.map((post) => {
        const author =
          post.authorName && post.authorName !== ""
            ? post.authorName
            : post.authorId;

        // 작성일을 한국어 포맷으로 변환
        const createdAtRaw = post.created_at || post.createdAt;
        const createdAt = createdAtRaw
          ? new Date(createdAtRaw).toLocaleString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "작성일 정보 없음";

        return (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="block py-4 hover:bg-gray-50"
          >
            <div className="flex items-start justify-between gap-4">
              {/* 왼쪽: 제목 + 미리보기 */}
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-gray-900">
                  {post.title}
                </h2>

                <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                  {post.content}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                  <span className="font-medium">작성자: {author}</span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>작성일: {createdAt}</span>
                </div>
              </div>

              {/* 오른쪽: 좋아요/싫어요/조회수 */}
              <div className="flex flex-col items-end gap-1 text-xs text-gray-500">
                <span>👍 {post.likeCount}</span>
                <span>👎 {post.dislikeCount}</span>
                <span>조회 {post.viewCount}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
