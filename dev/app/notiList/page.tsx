// app/notifications/page.tsx
import HomeButton from "@/components/homeButton";

type Notification = {
  id: string;
  title: string;
  icon: string;        // 이모지나 아이콘 이름 등
  description: string;
  date: string;        // ISO 문자열 또는 일반 문자열
  isRead: boolean;
};

// TODO: 실제로는 서버/DB에서 가져올 데이터
const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "새 게시글이 작성되었습니다.",
    icon: "📝",
    description: "당신의 프롬프트를 기반으로 새 게시글이 생성되었습니다.",
    date: "2025-11-18T10:30:00.000Z",
    isRead: false,
  },
  {
    id: "2",
    title: "댓글이 달렸습니다.",
    icon: "💬",
    description: "작성한 게시글에 새로운 댓글이 있습니다.",
    date: "2025-11-17T18:10:00.000Z",
    isRead: true,
  },
  {
    id: "3",
    title: "시스템 알림",
    icon: "⚙️",
    description: "서비스 점검이 내일 새벽 2시에 예정되어 있습니다.",
    date: "2025-11-16T09:00:00.000Z",
    isRead: true,
  },
];

export default function NotiListPage() {
  const notifications = dummyNotifications;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 바: 홈 버튼 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        <span className="text-xs text-gray-500">
          읽지 않은 알림: {unreadCount}개
        </span>
      </div>

      {/* 알림 목록 카드 */}
      <div className="mx-auto mb-12 w-full max-w-2xl rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">알림</h1>
          <span className="text-xs text-gray-500">
            총 {notifications.length}개
          </span>
        </div>

        {notifications.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500">
            아직 받은 알림이 없습니다.
          </p>
        ) : (
          <ul className="divide-y">
            {notifications.map((noti) => {
              const formattedDate = new Date(noti.date).toLocaleString("ko-KR");

              return (
                <li
                  key={noti.id}
                  className={`flex gap-3 px-3 py-4 text-sm transition ${
                    noti.isRead ? "bg-white" : "bg-blue-50"
                  } hover:bg-gray-50`}
                >
                  {/* 아이콘 */}
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-lg">
                    {noti.icon}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-semibold text-gray-900">
                        {noti.title}
                      </h2>

                      {/* 읽음 표시 점 */}
                      {!noti.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-600">
                      {noti.description}
                    </p>

                    <p className="mt-2 text-[11px] text-gray-400">
                      {formattedDate}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
