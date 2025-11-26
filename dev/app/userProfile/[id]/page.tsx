
"use client";

import HomeButton from "@/components/homeButton";
import { getCurrentUser, getUserStats, ROOT_USER_ID } from "@/lib/userService";
import { listPostsByUser } from "@/lib/postService";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("userId")
      : null;

  useEffect(() => {
    if (!userId) return;

    // 유저 정보
    getCurrentUser(userId).then(({ user }) => setUser(user || null));

    // 좋아요/싫어요 통계
    getUserStats(userId).then((res) => {
      if (!res.error) setStats(res);
    });

    // 작성한 게시글 목록
    listPostsByUser(userId).then(({ posts }) => {
      setPosts(posts || []);
    });
  }, [userId]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        유저 정보를 찾을 수 없습니다.
      </main>
    );
  }

  const createdAt = new Date(user.getCreatedAt()).toLocaleString("ko-KR");
  const lastLoginAt = user.getLastLogin()
    ? new Date(user.getLastLogin()!).toLocaleString("ko-KR")
    : "기록 없음";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
      </div>

      {/* 프로필 카드 */}
      <div className="mx-auto mb-10 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          {/* 아바타 */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
            {user.getUsername().charAt(0).toUpperCase()}
          </div>

          {/* 닉네임 + 통계 */}
          <div>
            <h1 className="text-xl font-bold">{user.getUsername()}</h1>

            <p className="text-sm text-gray-700 mt-1">
              ❤️ 좋아요: {stats?.totalLikes ?? 0} &nbsp; | &nbsp;
              👎 싫어요: {stats?.totalDislikes ?? 0}
            </p>
          </div>

          {/* 권한 */}
          <span className="ml-auto inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">
            {user.getId() === ROOT_USER_ID ? "루트 관리자" : "일반 사용자"}
          </span>
        </div>

        <hr className="my-6" />

        {/* 계정 정보 */}
        <section className="space-y-3 text-sm text-gray-700">
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">가입일</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{createdAt}</p>
          </div>
          <div className="rounded-lg bg-gray-50 px-4 py-3">
            <p className="text-xs text-gray-500">마지막 로그인</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{lastLoginAt}</p>
          </div>
        </section>
      </div>

      {/* 작성 게시글 목록 */}
      <div className="mx-auto mb-20 w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-4">내가 작성한 게시글</h2>

        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            작성한 게시글이 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Link
                  href={`/post/${post.id}`}
                  className="font-medium text-gray-800 hover:underline"
                >
                  {post.title}
                </Link>
                <span className="text-sm text-gray-500">
                  ❤️ {post.likeCount ?? 0} | 👎 {post.dislikeCount ?? 0}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}


