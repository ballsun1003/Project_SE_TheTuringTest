// components/BoardPreview.tsx
import Link from "next/link";

type BoardPost = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  category: string;
  createdAt: string;
};

// TODO: 나중에는 실제 DB/API에서 가져오면 됨
const dummyBoardPosts: BoardPost[] = [
  {
    id: "1",
    title: "공지사항 예시입니다.",
    content: "서비스 이용 관련 안내 공지입니다...",
    authorId: "admin",
    category: "notice",
    createdAt: "2025-11-18T09:00:00.000Z",
  },
  {
    id: "2",
    title: "자유게시판 첫 글",
    content: "자유롭게 대화해보세요!",
    authorId: "user001",
    category: "free",
    createdAt: "2025-11-17T15:30:00.000Z",
  },
  {
    id: "3",
    title: "Q&A 예시",
    content: "로그인 오류가 발생하는데 어떻게 해결하나요?",
    authorId: "user002",
    category: "qna",
    createdAt: "2025-11-16T11:00:00.000Z",
  },
];

export default function BoardPreview() {
  // 최신 3개만 보여준다 가정
  const latestPosts = dummyBoardPosts.slice(0, 3);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">인기 게시글</h3>
        <Link
          href="/board/all"
          className="text-xs text-gray-500 hover:underline"
        >
          게시판 전체 보기
        </Link>
      </div>

      {latestPosts.length === 0 ? (
        <p className="py-4 text-sm text-gray-500">
          아직 게시글이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3 text-sm">
          {latestPosts.map((post) => {
            const date = new Date(post.createdAt).toLocaleDateString("ko-KR");
            return (
              <li key={post.id} className="border-b pb-2 last:border-b-0">
                <Link
                  href={`/posts/${post.id}`}
                  className="block hover:text-blue-600"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{post.title}</span>
                    <span className="text-[11px] text-gray-400">{date}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                    {post.content}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-400">
                    <span>작성자: {post.authorId}</span>
                    <span className="h-3 w-px bg-gray-300" />
                    <span>카테고리: {post.category}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
