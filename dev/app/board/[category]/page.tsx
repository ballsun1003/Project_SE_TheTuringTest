
import HomeButton from "@/components/homeButton";
import PostList from "@/components/postList";
import Link from "next/link";
import { listPostsByCategory } from "@/lib/postService";
import ProtectedLink from "@/components/ProtectedLink";

const CATEGORY_TABS = [
  { id: "all", label: "전체" },
  { id: "free", label: "자유" },
  { id: "share", label: "공유" },
  { id: "qna", label: "Q&A" },
];

type PageProps = {
  params: { category: string };
};

export default async function BoardCategoryPage({ params }: PageProps) {
  const categoryParam = params.category;
  const validCategory =
    CATEGORY_TABS.find((c) => c.id === categoryParam)?.id ?? "all";

  // 🔥 실제 DB에서 게시글 불러오기
  const { posts, error } = await listPostsByCategory(validCategory as any);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <ProtectedLink
          href="/postCreate"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </ProtectedLink>
      </div>

      {/* 카테고리 탭 */}
      <div className="mx-auto mt-2 w-full max-w-4xl px-4">
        <nav className="mb-4 flex flex-wrap gap-2">
          {CATEGORY_TABS.map((cat) => (
            <Link
              key={cat.id}
              href={`/board/${cat.id}`}
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
          <h1 className="text-xl font-bold">
            {CATEGORY_TABS.find((c) => c.id === validCategory)?.label} 게시판
          </h1>
          <span className="text-sm text-gray-500">
            총 {posts?.length ?? 0}개의 글
          </span>
        </div>

        <div className="divide-y">
          {!posts || posts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              이 카테고리에 해당하는 게시글이 없습니다.
            </p>
          ) : (
            <PostList posts={posts} />
          )}
        </div>
      </div>
    </main>
  );
}
