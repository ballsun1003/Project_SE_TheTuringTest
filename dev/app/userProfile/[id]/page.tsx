"use client";

import HomeButton from "@/components/homeButton";
import { getCurrentUser, getUserStats, ROOT_USER_ID } from "@/lib/userService";
import { listPostsByUser } from "@/lib/postService";
import { listCommentsByUser } from "@/lib/commentService";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * UserProfilePage (User Profile 화면)
 * ======================================================
 * 현재 로그인한 사용자의 프로필, 활동 정보(게시글/댓글),
 * 계정 설정(수정/탈퇴)을 제공하는 클라이언트 페이지 컴포넌트.
 *
 * 핵심 데이터 로딩
 * ------------------------------------------------------
 * - getCurrentUser(userId): 사용자 기본 정보 로드
 * - getUserStats(userId): 총 좋아요/싫어요 수 로드
 * - listPostsByUser(userId): 사용자가 작성한 게시글 목록 로드
 * - listCommentsByUser(userId): 사용자가 작성한 댓글 목록 로드
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. 사용자 정보 표시
 *    - Username, 가입일, 마지막 로그인 시간
 *    - 총 좋아요, 총 싫어요 수
 *    - ROOT_USER_ID 여부에 따라 UI 구분 (관리자 표시)
 *
 * 2. 사용자 정보 수정
 *    - username 변경
 *    - 비밀번호 변경 (현재 PW 검증 + 새 PW 확인 포함)
 *    - 로컬 및 서버 데이터 갱신
 *    - ROOT 계정은 수정 불가
 *
 * 3. 회원 탈퇴
 *    - 본인 확인 + 경고 메시지
 *    - 게시글/댓글 포함 전체 데이터 삭제
 *    - 탈퇴 후 localStorage 초기화 + 메인으로 이동
 *    - ROOT 계정은 탈퇴 불가
 *
 * 4. 작성글 및 댓글 목록 제공
 *    - 게시글: 제목 / 좋아요 / 싫어요 수 표시
 *    - 댓글: 내용 표시 + 연결된 게시글로 이동 가능
 *
 * UX / UI 요소
 * ------------------------------------------------------
 * - use client: 클라이언트 컴포넌트
 * - useEffect 로 데이터 로드
 * - TailwindCSS UI 적용
 * - 로딩 상태 및 에러 메시지 처리
 *
 * 권한 처리
 * ------------------------------------------------------
 * - 로그인 정보는 localStorage(userId) 기준
 * - ROOT 사용자(admin) 권한 분기
 *   · 정보 수정 / 삭제 기능 제한
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자가 자신의 활동을 관리하고
 *   계정 정보를 직접 수정/삭제할 수 있는 관리 화면 제공
 * ======================================================
 */


export default function UserProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) return;

    getCurrentUser(userId).then(({ user }) => {
      if (user) {
        setUser(user);
        setUsernameInput(user.getUsername());
      }
    });

    getUserStats(userId).then((res) => {
      if (!res.error) setStats(res);
    });

    listPostsByUser(userId).then(({ posts }) => {
      setPosts(posts || []);
    });

    listCommentsByUser(userId).then(({ comments }) => {
      setComments(comments || []);
    });

  }, [userId]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-500">
        유저 정보를 찾을 수 없습니다.
      </main>
    );
  }

  const isRoot = user.getId() === ROOT_USER_ID;
  const createdAt = new Date(user.getCreatedAt()).toLocaleString("ko-KR");
  const lastLoginAt = user.getLastLogin()
    ? new Date(user.getLastLogin()!).toLocaleString("ko-KR")
    : "기록 없음";


  /* ==============================
        정보 변경 처리
     ============================== */
  const handleUpdateInfo = async () => {
    if (isRoot) {
      alert("루트 계정은 정보 변경이 불가능합니다.");
      return;
    }

    if (!usernameInput.trim()) {
      alert("아이디(유저네임)를 입력하세요.");
      return;
    }

    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) return alert("현재 비밀번호를 입력하세요.");
      if (!newPassword) return alert("새 비밀번호를 입력하세요.");
      if (newPassword !== confirmPassword)
        return alert("비밀번호 확인이 일치하지 않습니다.");
    }

    try {
      setSaving(true);

      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newUsername: usernameInput,
          currentPassword: currentPassword || null,
          newPassword: newPassword || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) return alert("정보 수정 실패: " + json.error);

      alert("정보가 성공적으로 수정되었습니다.");

      const { user: refreshedUser } = await getCurrentUser(userId!);
      if (refreshedUser) {
        setUser(refreshedUser);
        setUsernameInput(refreshedUser.getUsername());
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };


  /* ==============================
        회원 탈퇴 처리
     ============================== */
  const handleDeleteAccount = async () => {
    if (isRoot) return alert("루트 계정은 탈퇴할 수 없습니다.");

    if (!confirm("정말 탈퇴하시겠습니까?\n게시글/댓글 모두 삭제됩니다.")) return;

    try {
      setDeleting(true);
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const json = await res.json();
      if (!res.ok) return alert("탈퇴 실패: " + json.error);

      localStorage.clear();
      alert("회원 탈퇴가 완료되었습니다.");
      router.push("/");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <main className="min-h-screen">
      {/* 상단바 */}
      <div className="flex items-center justify-between px-4 py-4 text-gray-900">
        <HomeButton />
      </div>

      {/* 프로필 카드 */}
      <div className="mx-auto mb-10 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
            {user.getUsername().charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.getUsername()}</h1>
            <p className="text-sm text-gray-700 mt-1">
              ❤️ {stats?.totalLikes ?? 0} &nbsp; | &nbsp;
              👎 {stats?.totalDislikes ?? 0}
            </p>
          </div>

          <span className="ml-auto inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">
            {isRoot ? "루트 관리자" : "일반 사용자"}
          </span>
        </div>

        {/* 정보 변경 버튼 */}
        {!isRoot && (
          <div className="mt-4 flex gap-2 justify-end">
            <button onClick={() => setIsEditing(!isEditing)}
              className="rounded-md border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
              정보 변경
            </button>

            <button onClick={handleDeleteAccount}
              disabled={deleting}
              className="rounded-md border border-red-400 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60">
              {deleting ? "탈퇴중..." : "회원 탈퇴"}
            </button>
          </div>
        )}

        {/* 정보 변경 폼 */}
        {isEditing && !isRoot && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg text-sm space-y-4">

            <div>
              <label className="block text-xs text-gray-500 mb-1">아이디</label>
              <input
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-gray-500">현재 PW</label>
                <input
                  type="password"
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">새 PW</label>
                <input
                  type="password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">PW 확인</label>
                <input
                  type="password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs border rounded">
                취소
              </button>

              <button onClick={handleUpdateInfo}
                disabled={saving}
                className="px-4 py-1 text-xs bg-black text-white rounded disabled:opacity-60">
                {saving ? "저장중..." : "저장"}
              </button>
            </div>

          </div>
        )}

        <hr className="my-6" />

        {/* 가입 정보 */}
        <p className="text-xs text-gray-900">가입일</p>
        <p className="mb-2 text-gray-500">{createdAt}</p>

        <p className="text-xs text-gray-900">마지막 로그인</p>
        <p className="mb-2 text-gray-500">{lastLoginAt}</p>

      </div>

      {/* 내가 작성한 게시글 */}
      <div className="mx-auto mb-10 w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">내 게시글</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-gray-900 text-center py-6">
            게시글이 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="p-4 border rounded-md flex justify-between">
                <Link href={`/post/${p.id}`} className="hover:underline font-medium text-gray-500">
                  {p.title}
                </Link>
                <span className="text-sm text-gray-600">
                  ❤️ {p.likeCount} | 👎 {p.dislikeCount}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 내가 작성한 댓글 */}
      <div className="mx-auto mb-20 w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">내 댓글</h2>
        {comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-6">
            댓글이 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => (
              <li key={c.id} className="p-4 border rounded-lg">
                <p className="text-gray-700 text-sm break-all">
                  {c.content}
                </p>

                <Link
                  href={`/post/${c.post_id}`}
                  className="text-xs text-blue-600 hover:underline mt-1 block"
                >
                  게시글 보기: {c.post?.title ?? "제목 없음"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </main>
  );
}

