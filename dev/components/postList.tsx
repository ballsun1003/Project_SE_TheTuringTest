import { PostProps } from "@/lib/entities/Post";
import Link from "next/link";

/**
 * ======================================================
 * PostList Component (PostList.tsx)
 * ======================================================
 * 게시글 목록을 리스트 UI 형태로 표시하는 컴포넌트.
 * 각 게시글 아이템을 클릭하면 상세 페이지로 이동한다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * - 전달받은 posts 배열을 순회하며 게시글 정보 렌더링
 * - 제목/미리보기/작성자/작성일 표시
 * - 좋아요/싫어요/조회수 표시
 * - 게시글이 없을 경우 “게시글이 없습니다.” 메시지 출력
 *
 * Props
 * ------------------------------------------------------
 * posts: PostListItem[]
 * - id: 게시글 ID
 * - title: 게시글 제목
 * - content: 게시글 본문(미리보기로 사용)
 * - authorName?: 작성자 이름 (없으면 authorId 사용)
 * - created_at?: DB에서 불러온 원본 날짜 필드
 * - createdAt?: UI에 전달된 날짜 필드
 * - likeCount, dislikeCount, viewCount: 통계 정보
 *
 * 세부 동작
 * ------------------------------------------------------
 * - created_at 또는 createdAt을 한국어 날짜 포맷으로 변환(YYYY년 M월 D일 HH:mm)
 * - 작성자 정보가 없으면 authorId로 대체
 * - TailwindCSS 기반 시각 구성
 * - Next.js Link 컴포넌트 사용으로 CSR 이동 처리
 *
 * 조건 처리
 * ------------------------------------------------------
 * - posts.length === 0 → 빈 목록 메시지 표시
 *
 * 목적
 * ------------------------------------------------------
 * - 게시판 목록 UI를 재사용 가능한 컴포넌트 형태로 제공
 * - 상세 페이지 연결을 통해 전체 게시글 브라우징을 지원
 * ======================================================
 */


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
