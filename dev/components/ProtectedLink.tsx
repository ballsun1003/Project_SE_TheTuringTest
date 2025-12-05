"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * ======================================================
 * ProtectedLink Component (ProtectedLink.tsx)
 * ======================================================
 * 인증된 사용자만 특정 링크로 이동할 수 있도록 보호하는
 * 버튼 기반 라우팅 컴포넌트.
 *
 * 동작 방식
 * ------------------------------------------------------
 * - 클라이언트 측에서 localStorage의 accessToken 유무를 확인
 * - 로그인 여부에 따라 이동 가능한 페이지를 제한
 * - 비로그인 상태에서는 /login 페이지로 강제 리다이렉트
 * - 렌더링 초기에는 깜빡임을 방지하기 위해 isReady 상태 활용
 *
 * Props
 * ------------------------------------------------------
 * - href: 이동하려는 URL 경로
 * - children: 버튼 내부 UI 요소
 * - className: Tailwind 등 UI 스타일 지정 (선택)
 *
 * 주요 로직
 * ------------------------------------------------------
 * - useEffect 실행 시 accessToken 확인
 * - 버튼 클릭 이벤트에서 로그인 상태 검사
 * - router.push()를 사용하여 페이지 이동 처리
 *
 * 목적
 * ------------------------------------------------------
 * - 클라이언트 렌더링 환경에서 인증 보호 기능을 제공
 * - UI 요소를 버튼 형태로 유지하면서 접근 제어 수행
 * ======================================================
 */


interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ProtectedLink({ href, children, className }: Props) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);  // 렌더링 준비 완료
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(Boolean(token));
    setIsReady(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    router.push(href);
  };

  if (!isReady) return null; // 로딩 전에 깜빡임 방지

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
