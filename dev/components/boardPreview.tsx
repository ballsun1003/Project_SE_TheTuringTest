
import Link from "next/link";
import { listTopLikedPosts } from "@/lib/postService";
/**
 * ======================================================
 * BoardPreview Component (BoardPreview.tsx)
 * ======================================================
 * 인기 게시글(좋아요 상위 게시글)을 미리보기 형태로 표시하는
 * 서버 컴포넌트(Server Component).
 *
 * 주요 기능
 * ------------------------------------------------------
 * - listTopLikedPosts(limit=3) 호출 → 좋아요 높은 게시글 최대 3개 조회
 * - 게시글 미리보기 UI로 표시: 제목 / 내용 요약 / 작성자 / 생성일 / 좋아요 수
 * - 각 게시글을 클릭 시 상세 페이지(/post/[id])로 이동
 * - "게시판 전체 보기" 링크를 통해 전체 게시글 목록 페이지 이동
 *
 * 데이터 처리
 * ------------------------------------------------------
 * - createdAt을 한국어 날짜 포맷(YYYY.MM.DD)으로 변환
 * - 작성자 이름 표시 (없으면 “익명”으로 대체)
 * - 좋아요 수(❤️ likeCount) UI 표시
 *
 * 조건 처리
 * ------------------------------------------------------
 * - 인기 게시글이 없을 경우 “아직 게시글이 없습니다.” 메시지 출력
 *
 * UI/구현 요소
 * ------------------------------------------------------
 * - Server Component: 데이터 fetch 및 렌더링 서버에서 수행
 * - TailwindCSS 기반 카드형 UI 구성
 * - 제목, 날짜, 내용 요약을 line-clamp로 깔끔하게 출력
 *
 * 목적
 * ------------------------------------------------------
 * - 홈(메인) 화면에서 인기 게시글을 빠르게 접근 가능하도록 제공
 * - 사용자 Engagement 향상 (조회수 및 상호작용 증가)
 * ======================================================
 */


export default async function BoardPreview() {
  const { posts = [] } = await listTopLikedPosts(3);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">🔥 인기 게시글</h3>
        <Link
          href="/board/all"
          className="text-xs text-gray-500 hover:underline"
        >
          게시판 전체 보기
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">아직 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {posts.map((post) => (
            <li key={post.id} className="border-b pb-2 last:border-b-0">
              <Link href={`/post/${post.id}`} className="block hover:text-blue-600">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-500">{post.title}</span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                  {post.content}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                  <span>{post.authorName ?? "익명"}</span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span>❤️ {post.likeCount}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
