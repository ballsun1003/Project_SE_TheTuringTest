import BoardPreview from "@/components/boardPreview";
import HomeButton from "@/components/homeButton";
import Link from "next/link";

export default function HomePage() {
  return (
    <section className="space-y-6 m-10">
      <div>
        <HomeButton className="mr-2" />

        <header className="flex items-center justify-between">
          <div>
            <p className="mt-2 text-gray-600">The Turing Test</p>
          </div>
          <div className="flex justify-end gap-2">
            <Link href="/login">
              <button className="px-4 py-2 rounded border text-black hover:bg-gray-100">
                Login
              </button>
            </Link>

            <Link href="/signup">
              <button className="px-4 py-2 rounded bg-black text-white">
                Sign up
              </button>
            </Link>
          </div>
        </header>
      </div>

      {/* 기존 메인 버튼들 */}
      <div className="flex gap-3">
        <Link
          href="/board/all"
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          게시판 보기
        </Link>
        <Link
          href="/postCreate"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </Link>
      </div>

      {/* 🔽 임시 테스트용 바로가기 버튼들 */}
      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href="/board/all"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          /board/all 이동
        </Link>
        <Link
          href="/userProfile/1"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          /userProfile/1 이동
        </Link>
        <Link
          href="/notiList"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          /notiList 이동
        </Link>
      </div>

      <BoardPreview />
    </section>
  );
}
