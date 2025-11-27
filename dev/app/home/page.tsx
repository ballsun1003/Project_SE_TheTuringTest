// "use client";

// import { useEffect, useState } from "react";
// import BoardPreview from "@/components/boardPreview";
// import HomeButton from "@/components/homeButton";
// import ProtectedLink from "@/components/ProtectedLink";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState<string | null>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     const name = localStorage.getItem("username");

//     if (token) {
//       setIsLoggedIn(true);
//       setUsername(name);
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("username");

//     setIsLoggedIn(false);
//     setUsername(null);

//     alert("로그아웃 되었습니다.");
//     router.push("/");
//   };

//   return (
//     <section className="space-y-6 m-10">
//       <div>
//         <HomeButton className="mr-2" />

//         <header className="flex items-center justify-between">
//           <div>
//             <p className="mt-2 text-gray-600">The Turing Test</p>
//           </div>

//           {/* 🔽 로그인 여부에 따라 UI 변경 */}
//           {isLoggedIn ? (
//             <div className="flex items-center gap-3 text-sm text-gray-600">
//               <span className="font-medium">{username}</span> 님 환영합니다!

//               {/* 🔥 로그아웃 버튼 */}
//               <button
//                 onClick={handleLogout}
//                 className="px-3 py-1 rounded border text-black hover:bg-gray-100"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <div className="flex justify-end gap-2">
//               <Link href="/login">
//                 <button className="px-4 py-2 rounded border text-black hover:bg-gray-100">
//                   Login
//                 </button>
//               </Link>

//               <Link href="/signup">
//                 <button className="px-4 py-2 rounded bg-black text-white">
//                   Sign up
//                 </button>
//               </Link>
//             </div>
//           )}
//         </header>
//       </div>

//       {/* 메인 기능 버튼 */}
//       <div className="flex gap-3">
//         <Link
//           href="/board/all"
//           className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
//         >
//           게시판 보기
//         </Link>

//         <ProtectedLink
//           href="/postCreate"
//           className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
//         >
//           글 작성하기
//         </ProtectedLink>
//       </div>

//       {/* 테스트 링크 */}
//       <div className="flex flex-wrap gap-3 text-sm">
//         <ProtectedLink
//           href="/userProfile/1"
//           className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
//         >
//           프로필
//         </ProtectedLink>

//         <ProtectedLink
//           href="/notiList"
//           className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
//         >
//           알림 목록
//         </ProtectedLink>
//       </div>

//       <BoardPreview />
//     </section>
//   );
// }
import BoardPreview from "@/components/boardPreview";
import HomeButton from "@/components/homeButton";
import ProtectedLink from "@/components/ProtectedLink";
import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";

export default function HomePage() {

  return (
    <section className="space-y-6 m-10">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HomeButton />
          <p className="text-gray-600">The Turing Test</p>
        </div>

        <AuthHeader />
      </div>

      {/* 네비 버튼 */}
      <div className="flex gap-3">
        <Link href="/board/all"
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          게시판 보기
        </Link>

        <ProtectedLink
          href="/postCreate"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 font-medium text-white hover:opacity-90"
        >
          글 작성하기
        </ProtectedLink>
      </div>

      {/* 알림 + 프로필 */}
      <div className="flex gap-3">
        <ProtectedLink href="/userProfile/me"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          프로필
        </ProtectedLink>

        <ProtectedLink href="/notiList"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          알림 목록
        </ProtectedLink>
      </div>

      <BoardPreview />
    </section>
  );
}
