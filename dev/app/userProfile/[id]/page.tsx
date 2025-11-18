// app/users/[id]/page.tsx
import HomeButton from "@/components/homeButton";

type User = {
  id: string;
  email: string;
  nickname: string;
  permission: "admin" | "manager" | "user" | string;
  isActive: boolean;
  lastLoginAt: string; // ISO 문자열이라고 가정
  createAt: string;    // createdAt 역할
};

export default function UserProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // TODO: 실제로는 여기서 DB/API 호출해서 유저 정보를 가져오면 됨
  const user: User = {
    id,
    email: "user@example.com",
    nickname: "튜링유저",
    permission: "admin",
    isActive: true,
    lastLoginAt: "2025-11-18T09:30:00.000Z",
    createAt: "2025-01-10T12:00:00.000Z",
  };

  const createdAt = new Date(user.createAt).toLocaleString("ko-KR");
  const lastLoginAt = new Date(user.lastLoginAt).toLocaleString("ko-KR");

  const permissionLabelMap: Record<string, string> = {
    admin: "관리자",
    manager: "매니저",
    user: "일반 사용자",
  };

  const permissionLabel =
    permissionLabelMap[user.permission] ?? user.permission;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 상단 바: 홈 버튼 */}
      <div className="flex items-center justify-between px-4 py-4">
        <HomeButton />
        {/* 필요하면 여기에 '유저 목록' 링크 같은 것도 추가 가능 */}
      </div>

      {/* 프로필 카드 */}
      <div className="mx-auto mb-12 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
        {/* 상단: 아바타 + 닉네임 + 권한/상태 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* 왼쪽: 아바타 + 닉네임, 이메일 */}
          <div className="flex items-center gap-4">
            {/* 아바타: 닉네임 첫 글자 */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
              {user.nickname.charAt(0)}
            </div>

            <div>
              <h1 className="text-xl font-bold">{user.nickname}</h1>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="mt-1 text-xs text-gray-400">ID: {user.id}</p>
            </div>
          </div>

          {/* 오른쪽: 권한 + 활성 상태 */}
          <div className="flex flex-col items-start gap-2 sm:items-end">
            {/* 권한 배지 */}
            <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">
              권한: {permissionLabel}
            </span>

            {/* 활성/비활성 상태 배지 */}
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              ● {user.isActive ? "활성 계정" : "비활성 계정"}
            </span>
          </div>
        </div>

        <hr className="my-6" />

        {/* 활동 정보 섹션 */}
        <section className="space-y-3 text-sm text-gray-700">
          <h2 className="text-base font-semibold">계정 정보</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">가입일</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {createdAt}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">마지막 로그인</p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {lastLoginAt}
              </p>
            </div>
          </div>
        </section>

        {/* 필요하면 추가 정보 섹션 */}
        <section className="mt-6 space-y-2 text-sm text-gray-600">
          <h2 className="text-base font-semibold">추가 메모</h2>
          <p className="text-xs text-gray-500">
            이 영역에는 유저의 활동 기록, 작성한 글 수, 좋아요 받은 수, 신고
            내역 등 추가 정보를 넣을 수 있습니다.
          </p>
        </section>
      </div>
    </main>
  );
}
