import HomeButton from "@/components/homeButton";
import PostList from "@/components/postList";
import Link from "next/link";
import { listPostsByCategory } from "@/lib/postService";
import ProtectedLink from "@/components/ProtectedLink";
import { CATEGORY_TABS } from "@/lib/entities/Category";



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
    <main className="min-h-screen">
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

      {/* 🔍 검 색폼 */}
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

