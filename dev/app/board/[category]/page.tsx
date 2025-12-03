import HomeButton from "@/components/homeButton";
import PostList from "@/components/postList";
import Link from "next/link";
import { listPostsByCategory } from "@/lib/postService";
import ProtectedLink from "@/components/ProtectedLink";

/**
 * ======================================================
 * BoardCategoryPage (게시판 카테고리 / 검색 페이지)
 * ======================================================
 * /board/[category] 라우트에서 게시글 목록을 렌더링한다.
 * 카테고리 필터링 + 제목/작성자/내용 검색을 제공.
 *
 * 기능 요약
 * ------------------------------------------------------
 * 1️⃣ 카테고리 탭 필터링
 *    - all, free, share, qna (CATEGORY_TABS)
 *    - URL param: /board/free, /board/share ...
 *
 * 2️⃣ 검색 기능 (GET /board/[category]?q=검색어)
 *    - 제목 + 작성자 + 본문 내용 포함 검색
 *
 * 3️⃣ 게시글 목록 렌더링 (PostList 컴포넌트)
 *
 * 4️⃣ 글 작성 버튼 (ProtectedLink)
 *    - 로그인 사용자만 접근 가능 → 로그인 페이지로 이동 유도
 *
 * 데이터 흐름 (SSR)
 * ------------------------------------------------------
 * - listPostsByCategory(category) 호출
 * - 검색어 존재 시 클라이언트에서 필터링 처리
 *
 * 렌더링 UI
 * ------------------------------------------------------
 * - HomeButton: 홈으로 이동
 * - 카테고리 탭 버튼: active 상태 표시
 * - 검색창: querystring 유지하면서 네비게이션
 *
 * 보안
 * ------------------------------------------------------
 * - 글 작성 링크 보호 (ProtectedLink): 토큰 없으면 로그인 페이지로
 *
 * 사용처 문서
 * ------------------------------------------------------
 * - SDS: 게시글 조회 시퀀스 다이어그램
 * - UI 흐름 문서: 카테고리 이동 UX 포함
 * ======================================================
 */


const CATEGORY_TABS = [
  { id: "all", label: "전체" },
  { id: "free", label: "자유" },
  { id: "share", label: "공유" },
  { id: "qna", label: "Q&A" },
];

type PageProps = {
  params: { category: string };
  searchParams?: { q?: string };
};

export default async function BoardCategoryPage({ params, searchParams }: PageProps) {
  const validCategory =
    CATEGORY_TABS.find((c) => c.id === params.category)?.id ?? "all";

  const keyword = searchParams?.q?.trim() ?? "";

  // DB에서 게시글 조회
  const { posts = [] } = await listPostsByCategory(validCategory as any);

  // 🔍 제목 + 작성자 + 내용 검색 필터
  const filteredPosts = keyword
    ? posts.filter((post: any) =>
        [
          post.title,
          post.authorName,
          post.content
        ].some((text) => text?.toLowerCase().includes(keyword.toLowerCase()))
      )
    : posts;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-4 py-4 text-gray-900">
        <HomeButton />
        <ProtectedLink
          href="/postCreate"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </ProtectedLink>
      </div>

      {/* 🔍 검색폼 */}
      <div className="mx-auto w-full max-w-4xl px-4 flex justify-end mb-3 text-gray-900">
        <form method="GET" className="flex gap-2 ">
          <input
            type="text"
            name="q"
            defaultValue={keyword}
            placeholder="검색(제목/작성자/내용)"
            className="border rounded-lg px-3 py-1 text-sm w-52 text-gray-900"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-lg bg-black text-white text-sm hover:opacity-90 "
          >
            검색
          </button>
        </form>
      </div>

      {/* 카테고리 탭 */}
      <div className="mx-auto w-full max-w-4xl px-4">
        <nav className="mb-4 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((cat) => (
            <Link
              key={cat.id}
              href={`/board/${cat.id}${keyword ? `?q=${keyword}` : ""}`}
              className={`rounded-full px-4 py-1 text-sm ${
                cat.id === validCategory
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 게시글 목록 */}
      <div className="mx-auto mb-12 w-full max-w-4xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            {keyword
              ? `검색 결과 (${filteredPosts.length}개)`
              : `${CATEGORY_TABS.find((c) => c.id === validCategory)?.label} 게시판`}
          </h1>

          {!keyword && (
            <span className="text-sm text-gray-500">
              총 {posts?.length ?? 0}개의 글
            </span>
          )}
        </div>

        <div className="divide-y">
          {filteredPosts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              검색 결과가 없습니다.
            </p>
          ) : (
            <PostList posts={filteredPosts} />
          )}
        </div>
      </div>
    </main>
  );
}

