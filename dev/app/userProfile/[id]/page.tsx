

// "use client";

// import HomeButton from "@/components/homeButton";
// import { getCurrentUser, getUserStats, ROOT_USER_ID } from "@/lib/userService";
// import { listPostsByUser } from "@/lib/postService";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function UserProfilePage() {
//   const router = useRouter();

//   const [user, setUser] = useState<any>(null);
//   const [stats, setStats] = useState<any>(null);
//   const [posts, setPosts] = useState<any[]>([]);

//   // 정보 변경 폼 상태
//   const [isEditing, setIsEditing] = useState(false);
//   const [usernameInput, setUsernameInput] = useState("");
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const userId =
//     typeof window !== "undefined"
//       ? localStorage.getItem("userId")
//       : null;

//   useEffect(() => {
//     if (!userId) return;

//     // 유저 정보
//     getCurrentUser(userId).then(({ user }) => {
//       if (user) {
//         setUser(user);
//         setUsernameInput(user.getUsername());
//       } else {
//         setUser(null);
//       }
//     });

//     // 좋아요/싫어요 통계
//     getUserStats(userId).then((res) => {
//       if (!res.error) setStats(res);
//     });

//     // 작성한 게시글 목록
//     listPostsByUser(userId).then(({ posts }) => {
//       setPosts(posts || []);
//     });
//   }, [userId]);

//   if (!user) {
//     return (
//       <main className="min-h-screen flex items-center justify-center text-gray-500">
//         유저 정보를 찾을 수 없습니다.
//       </main>
//     );
//   }

//   const isRoot = user.getId() === ROOT_USER_ID;

//   const createdAt = new Date(user.getCreatedAt()).toLocaleString("ko-KR");
//   const lastLoginAt = user.getLastLogin()
//     ? new Date(user.getLastLogin()!).toLocaleString("ko-KR")
//     : "기록 없음";

//   /* ==============================
//         정보 변경 처리
//      ============================== */
//   const handleUpdateInfo = async () => {
//     if (isRoot) {
//       alert("루트 계정은 정보 변경이 불가능합니다.");
//       return;
//     }

//     if (!usernameInput.trim()) {
//       alert("아이디(유저네임)를 입력하세요.");
//       return;
//     }

//     if (newPassword || confirmPassword || currentPassword) {
//       // 비밀번호 변경을 시도하는 경우
//       if (!currentPassword) {
//         alert("현재 비밀번호를 입력해야 합니다.");
//         return;
//       }
//       if (!newPassword) {
//         alert("새 비밀번호를 입력하세요.");
//         return;
//       }
//       if (newPassword !== confirmPassword) {
//         alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
//         return;
//       }
//     }

//     try {
//       setSaving(true);

//       const res = await fetch("/api/users/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userId,
//           newUsername: usernameInput,
//           currentPassword: currentPassword || null,
//           newPassword: newPassword || null,
//         }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         alert("정보 수정 실패: " + (json.error || "Unknown error"));
//         return;
//       }

//       alert("정보가 성공적으로 수정되었습니다.");

//       // 화면에 반영 위해 유저 정보 다시 로드
//       const { user: refreshedUser } = await getCurrentUser(userId!);
//       if (refreshedUser) {
//         setUser(refreshedUser);
//         setUsernameInput(refreshedUser.getUsername());
//       }

//       // 비밀번호 입력창 초기화
//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");
//       setIsEditing(false);
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* ==============================
//         회원 탈퇴 처리
//      ============================== */
//   const handleDeleteAccount = async () => {
//     if (isRoot) {
//       alert("루트 계정은 탈퇴할 수 없습니다.");
//       return;
//     }

//     const ok = confirm(
//       "정말 떠나시겠어요? 😢\n모든 게시글과 댓글이 삭제됩니다."
//     );
//     if (!ok) return;

//     try {
//       setDeleting(true);

//       const res = await fetch("/api/users/delete", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       });

//       const json = await res.json();

//       if (!res.ok) {
//         alert("회원 탈퇴 실패: " + (json.error || "Unknown error"));
//         return;
//       }

//       // 로컬 스토리지 정리
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("userId");
//         localStorage.removeItem("username");
//       }

//       alert("회원 탈퇴가 완료되었습니다.");

//       // 메인으로 이동
//       router.push("/");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50">
//       {/* 상단바 */}
//       <div className="flex items-center justify-between px-4 py-4">
//         <HomeButton />
//       </div>

//       {/* 프로필 카드 */}
//       <div className="mx-auto mb-10 w-full max-w-3xl rounded-2xl border bg-white p-8 shadow-sm">
//         <div className="flex items-center gap-4">
//           {/* 아바타 */}
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl font-bold text-white">
//             {user.getUsername().charAt(0).toUpperCase()}
//           </div>

//           {/* 닉네임 + 통계 */}
//           <div>
//             <h1 className="text-xl font-bold">{user.getUsername()}</h1>

//             <p className="text-sm text-gray-700 mt-1">
//               ❤️ 좋아요: {stats?.totalLikes ?? 0} &nbsp; | &nbsp;
//               👎 싫어요: {stats?.totalDislikes ?? 0}
//             </p>
//           </div>

//           {/* 권한 */}
//           <span className="ml-auto inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium text-gray-700">
//             {isRoot ? "루트 관리자" : "일반 사용자"}
//           </span>
//         </div>

//         {/* 🔥 정보 변경 / 회원 탈퇴 버튼 영역 */}
//         <div className="mt-4 flex gap-2 justify-end">
//           {!isRoot && (
//             <>
//               <button
//                 type="button"
//                 onClick={() => setIsEditing((prev) => !prev)}
//                 className="rounded-md border px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
//               >
//                 정보 변경
//               </button>
//               <button
//                 type="button"
//                 onClick={handleDeleteAccount}
//                 disabled={deleting}
//                 className="rounded-md border border-red-400 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
//               >
//                 {deleting ? "탈퇴 처리 중..." : "회원 탈퇴"}
//               </button>
//             </>
//           )}
//         </div>

//         {/* 🔧 정보 변경 폼 */}
//         {isEditing && !isRoot && (
//           <div className="mt-6 space-y-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
//             <div>
//               <label className="block text-xs text-gray-500 mb-1">
//                 아이디(유저네임)
//               </label>
//               <input
//                 type="text"
//                 value={usernameInput}
//                 onChange={(e) => setUsernameInput(e.target.value)}
//                 className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
//               />
//             </div>

//             <div className="grid gap-3 md:grid-cols-3">
//               <div className="md:col-span-1">
//                 <label className="block text-xs text-gray-500 mb-1">
//                   현재 비밀번호
//                 </label>
//                 <input
//                   type="password"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
//                   placeholder="비밀번호 변경 시 필수"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">
//                   새 비밀번호
//                 </label>
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs text-gray-500 mb-1">
//                   새 비밀번호 확인
//                 </label>
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setIsEditing(false);
//                   setCurrentPassword("");
//                   setNewPassword("");
//                   setConfirmPassword("");
//                   setUsernameInput(user.getUsername());
//                 }}
//                 className="rounded-md border px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
//               >
//                 취소
//               </button>
//               <button
//                 type="button"
//                 onClick={handleUpdateInfo}
//                 disabled={saving}
//                 className="rounded-md bg-black px-4 py-1 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
//               >
//                 {saving ? "저장 중..." : "변경 사항 저장"}
//               </button>
//             </div>
//           </div>
//         )}

//         <hr className="my-6" />

//         {/* 계정 정보 */}
//         <section className="space-y-3 text-sm text-gray-700">
//           <div className="rounded-lg bg-gray-50 px-4 py-3">
//             <p className="text-xs text-gray-500">가입일</p>
//             <p className="mt-1 text-sm font-medium text-gray-800">{createdAt}</p>
//           </div>
//           <div className="rounded-lg bg-gray-50 px-4 py-3">
//             <p className="text-xs text-gray-500">마지막 로그인</p>
//             <p className="mt-1 text-sm font-medium text-gray-800">{lastLoginAt}</p>
//           </div>
//         </section>
//       </div>

//       {/* 작성 게시글 목록 */}
//       <div className="mx-auto mb-20 w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
//         <h2 className="text-lg font-bold mb-4">내가 작성한 게시글</h2>

//         {posts.length === 0 ? (
//           <p className="py-8 text-center text-sm text-gray-500">
//             작성한 게시글이 없습니다.
//           </p>
//         ) : (
//           <ul className="space-y-3">
//             {posts.map((post) => (
//               <li
//                 key={post.id}
//                 className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50"
//               >
//                 <Link
//                   href={`/post/${post.id}`}
//                   className="font-medium text-gray-800 hover:underline"
//                 >
//                   {post.title}
//                 </Link>
//                 <span className="text-sm text-gray-500">
//                   ❤️ {post.likeCount ?? 0} | 👎 {post.dislikeCount ?? 0}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//     </main>
//   );
// }
"use client";

import HomeButton from "@/components/homeButton";
import { getCurrentUser, getUserStats, ROOT_USER_ID } from "@/lib/userService";
import { listPostsByUser } from "@/lib/postService";
import { listCommentsByUser } from "@/lib/commentService";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen bg-gray-50">
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

