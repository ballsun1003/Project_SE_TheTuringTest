import Link from "next/link";
import { listPostsByCategory, listTopLikedPosts } from "@/lib/postService";
import { useEffect, useState } from "react";
import { Post, PostProps } from "@/lib/entities/Post";
import { CATEGORY_TABS } from "@/lib/entities/Category";

// 카테고리 게시글 타입 (백엔드 응답에 맞춰서 필요시 수정)
type CategoryPost = {
  id: number | string;
  title: string;
  createdAt?: string;
};
type PopularPost = {
  id: number | string;
  title: string;
  content: string;
  authorName: string;
  likeCount: number;
  category: string | null;
  createdAt: string;
};
// 카테고리별 최신 글 컴포넌트
function CategoryPostList({
  category,
  title,
}: {
  category: string;
  title: string;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const validCategory =
    CATEGORY_TABS.find((c) => c.id === category)?.id ?? "all";
  useEffect(() => {
    // 🔽 백엔드에서 category/createdAt 기준으로 최신순 정렬해서 반환한다고 가정
    // 필요하면 /api 경로, 쿼리 파라미터 이름을 프로젝트에 맞게 수정하면 돼.
    const fetchPosts = async () => {
      try {
        const postsData = await listPostsByCategory(validCategory as any);
        const { posts = [] } = await listPostsByCategory(validCategory as any);

        // 응답 형태에 따라 data.posts 또는 data로 수정
        setPosts(posts);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPosts();
  }, [category]);
  return (
    <section className="w-full flex-1 rounded-lg border p-4">
      <h2 className="mb-2 text-sm font-semibold text-gray-800">{title}</h2>

      {posts.length === 0 ? (
        <p className="text-xs text-gray-500">아직 게시글이 없습니다.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {posts.map((post) => (
            <li key={post.getId()} className="truncate">
              <Link
                href={`/post/${post.getId()}`}
                className="hover:underline"
              >
                {post.getTitle()}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function BoardPreview() {
  const [posts, setPosts] = useState<PopularPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        // 🔽 인기 게시글 API 경로에 맞게 수정
        const postsData = await listTopLikedPosts(3);

        // 응답 형태에 맞게 data.posts 또는 data 그대로 사용
        setPosts(postsData.posts);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  if (loading) {
    return (
      <section className="rounded-lg border p-4">
        <h2 className="mb-2 text-lg font-semibold">인기 게시글</h2>
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </section>
    );
  }
  return (
    <div className="rounded-xl border p-6">
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
              <Link
                href={`/post/${post.id}`}
                className="block hover:text-blue-600"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-500">
                    {post.title}
                  </span>
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
      {/* 📚 카테고리별 최신 게시글 (세 칸 수직 배치) */}

      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          카테고리별 최신 글
        </h2>

        {/* 수평 배치 */}
        <div className="flex gap-5">
          <CategoryPostList category="free" title="자유 게시판" />
          <CategoryPostList category="share" title="공유 게시판" />
          <CategoryPostList category="qna" title="Q&A 게시판" />
        </div>
      </div>
    </div>
  );
}
