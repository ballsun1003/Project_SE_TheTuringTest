// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">홈</h2>
        <p className="mt-2 text-gray-600">
          Next.js(App Router) 임시 홈입니다. 아래 버튼으로 게시판으로 이동해보세요.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/posts"
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          게시판 보기
        </Link>
        <Link
          href="/posts/new"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h3 className="mb-2 text-lg font-semibold">빠른 안내</h3>
        <ul className="list-disc space-y-1 pl-6 text-gray-700">
          <li>UI 컴포넌트는 <code>components/</code> 폴더에 추가</li>
          <li>서버 액션은 <code>app/actions/</code>에 작성</li>
          <li>API 라우트는 <code>app/api/</code> 아래에 생성</li>
        </ul>
      </div>
    </section>
  );
}
