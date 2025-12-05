"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * AuthHeader Component (AuthHeader.tsx)
 * ======================================================
 * 헤더 영역에서 로그인 여부에 따라
 * 다른 UI(로그인/회원가입 또는 사용자 정보/로그아웃)를 보여주는
 * 인증 상태 기반 표시 컴포넌트.
 *
 * 동작 방식
 * ------------------------------------------------------
 * - localStorage에서 accessToken 및 username을 확인하여
 *   로그인 여부를 판별
 * - 로그인 상태:
 *    · "{username} 님 환영합니다!" 문구 표시
 *    · Logout 버튼 제공
 * - 비로그인 상태:
 *    · Login / Sign up 버튼 표시
 *
 * 주요 기능
 * ------------------------------------------------------
 * - 클라이언트 컴포넌트("use client")
 * - Logout 시 localStorage 인증 정보 제거
 *   (accessToken, userId, username)
 * - 로그아웃 이후 메인 페이지("/")로 이동
 *
 * UI 구성
 * ------------------------------------------------------
 * - TailwindCSS 스타일 적용
 * - 버튼/텍스트 정렬을 위한 Flexbox 기반 레이아웃
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자 인증 여부를 헤더에서 직관적으로 확인 가능하게 함
 * - 로그인/로그아웃 흐름을 자연스럽게 지원
 * ======================================================
 */


export default function AuthHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const name = localStorage.getItem("username");

    if (token) {
      setIsLoggedIn(true);
      setUsername(name);
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    router.push("/");
  }

  return (
    <div>
      {isLoggedIn ? (
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="font-medium">{username}</span> 님 환영합니다!
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded border"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/login" className="px-4 py-2 rounded border">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded border">
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}
