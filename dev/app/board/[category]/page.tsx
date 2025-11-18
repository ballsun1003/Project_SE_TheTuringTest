// app/board/[category]/page.tsx
import HomeButton from "@/components/homeButton";
import PostList from "@/components/postList";
import Link from "next/link";

type BoardCategory = "all" | "notice" | "free" | "qna";

const CATEGORY_TABS: { id: BoardCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "notice", label: "공지" },
  { id: "free", label: "자유" },
  { id: "qna", label: "Q&A" },
];

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  modelName: string;
  likeCount: number;
  dislikeCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  category: BoardCategory;
};

// TODO: 실제로는 서버/DB에서 가져올 데이터
const ALL_POSTS: Post[] = [
  {
    id: "1",
    title: "공지사항 예시입니다.",
    content: "서비스 이용 관련 안내 공지입니다...",
    authorId: "admin",
    modelName: "gpt-5.1-thinking",
    likeCount: 5,
    dislikeCount: 0,
    viewCount: 120,
    createdAt: "2025-11-18T09:00:00.000Z",
    updatedAt: "2025-11-18T09:00:00.000Z",
    isDeleted: false,
    category: "notice",
  },
  {
    id: "2",
    title: "자유 게시글 예시",
    content: "이곳은 자유롭게 이야기를 나누는 공간입니다...",
    authorId: "user001",
    modelName: "gpt-4.1-mini",
    likeCount: 3,
    dislikeCount: 1,
    viewCount: 45,
    createdAt: "2025-11-17T15:30:00.000Z",
    updatedAt: "2025-11-17T15:30:00.000Z",
    isDeleted: false,
    category: "free",
  },
  {
    id: "3",
    title: "Q&A 예시",
    content: "로그인 오류가 발생하는데 어떻게 해결하나요?",
    authorId: "user002",
    modelName: "gpt-4.1-mini",
    likeCount: 1,
    dislikeCount: 0,
    viewCount: 20,
    createdAt: "2025-11-16T11:00:00.000Z",
    updatedAt: "2025-11-16T11:00:00.000Z",
    isDeleted: false,
    category: "qna",
  },
];

export default function BoardCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categoryParam = params.category as BoardCategory;

  // 잘못된 카테고리 들어온 경우 대비
  const validCategory =
    CATEGORY_TABS.find((c) => c.id === categoryParam)?.id ?? "all";

  const filteredPosts =
    validCategory === "all"
      ? ALL_POSTS.filter((p) => !p.isDeleted)
      : ALL_POSTS.filter((p) => p.category === validCategory && !p.isDeleted);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <Link
          href="/postCreate"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </Link>
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
            총 {filteredPosts.length}개의 글
          </span>
        </div>

        <div className="divide-y">
          {filteredPosts.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              이 카테고리에 해당하는 게시글이 없습니다.
            </p>
          )}

            <PostList posts={filteredPosts} />

        </div>
      </div>
    </main>
  );
}
