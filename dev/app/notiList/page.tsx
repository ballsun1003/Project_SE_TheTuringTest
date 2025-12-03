"use client";

import HomeButton from "@/components/homeButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * NotificationsPage (알림 목록 페이지)
 * ======================================================
 * 현재 로그인한 사용자가 받은 알림들을 조회하고,
 * 클릭 시 해당 게시글 상세 페이지로 이동하는 UI 제공.
 *
 * 알림 종류 (NotificationType)
 * ------------------------------------------------------
 * - "like"    : 사용자가 작성한 게시글에 좋아요가 눌린 경우
 * - "dislike" : 사용자가 작성한 게시글에 싫어요가 눌린 경우
 * - "comment" : 게시글에 댓글이 등록된 경우
 *
 * 주요 기능
 * ------------------------------------------------------
 * - loadNotifications(): 사용자 알림 목록 로드
 *   → /api/notifications/list 호출
 * - 알림 클릭 시 router.push(`/post/{postId}`)
 * - 알림 개수 표시 및 빈 목록 안내 메시지 출력
 *
 * UI / UX 구성
 * ------------------------------------------------------
 * - 아이콘으로 알림 타입 직관적 표시 (👍👎💬)
 * - 항목 hover 시 강조 효과
 * - 가장 최근 알림이 위에 표시 (서버에서 정렬 처리)
 * - 날짜/시간 한국어 형식으로 표시
 *
 * 상태 관리
 * ------------------------------------------------------
 * notifications: 알림 배열 상태 저장
 * userId: localStorage에서 사용자 식별값 읽음
 * (로그인하지 않은 경우 요청/표시 중단)
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자에게 소셜 반응(상호작용) 정보를 시각적으로 제공
 * - 알림을 통해 게시글 활동으로 빠르게 이동하도록 지원
 * ======================================================
 */


interface Noti {
  id: string;
  postId: string;
  type: "comment" | "like" | "dislike";
  fromUserName: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const [notifications, setNotifications] = useState<Noti[]>([]);

  useEffect(() => {
    if (!userId) return;

    loadNotifications();
  }, [userId]);

  async function loadNotifications() {
    const res = await fetch("/api/notifications/list", {
      method: "POST",
      body: JSON.stringify({ userId }),
    });

    const json = await res.json();
    if (json.notifications) {
      setNotifications(json.notifications);
    }
  }

  function getMessage(n: Noti) {
    if (n.type === "like")
      return `${n.fromUserName ?? "익명"}님이 당신의 게시글에 좋아요를 눌렀습니다.`;
    if (n.type === "dislike")
      return `${n.fromUserName ?? "익명"}님이 당신의 게시글에 싫어요를 눌렀습니다.`;
    if (n.type === "comment")
      return `${n.fromUserName ?? "익명"}님이 당신의 게시글에 댓글을 남겼습니다.`;

    return "새로운 알림이 있습니다.";
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 */}
      <div className="flex items-center justify-between px-4 py-4 text-gray-900">
        <HomeButton />
        <span className="text-xs text-gray-500">
          총 {notifications.length}개의 알림
        </span>
      </div>

      {/* 본문 */}
      <div className="mx-auto mb-12 w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-4 text-gray-900">알림</h1>

        {notifications.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">
            아직 받은 알림이 없습니다.
          </p>
        )}

        <ul className="divide-y">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => router.push(`/post/${n.postId}`)}
              className="cursor-pointer px-4 py-4 hover:bg-gray-100 transition"
            >
              <div className="flex items-start gap-3">
                {/* 아이콘 */}
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
                  {n.type === "like" && "👍"}
                  {n.type === "dislike" && "👎"}
                  {n.type === "comment" && "💬"}
                </div>

                {/* 내용 */}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{getMessage(n)}</p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
