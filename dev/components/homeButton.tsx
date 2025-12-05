// app/components/HomeButton.tsx
"use client";

import Link from "next/link";

/**
 * ======================================================
 * HomeButton Component (HomeButton.tsx)
 * ======================================================
 * 메인(Home) 페이지로 이동하는 버튼 UI 컴포넌트.
 * Next.js Link를 사용하여 빠른 클라이언트 라우팅을 제공한다.
 *
 * Props
 * ------------------------------------------------------
 * - label?: string
 *     버튼에 표시될 텍스트 (기본값: "TTT")
 *
 * - className?: string
 *     TailwindCSS 등 사용자 정의 스타일 적용 시 사용
 *
 * 기능
 * ------------------------------------------------------
 * - "/" 페이지로 이동하는 Link 컴포넌트 렌더링
 * - 텍스트만 가진 심플한 네비게이션 버튼 역할 수행
 *
 * 목적
 * ------------------------------------------------------
 * - 사이트 어디서든 쉽게 홈으로 이동할 수 있도록 지원
 * - 재사용 가능한 UI 컴포넌트로 설계됨
 *
 * 비고
 * ------------------------------------------------------
 * - "use client" 지시문 포함: 클라이언트 컴포넌트
 * - 스타일 구성: TailwindCSS 기반
 * ======================================================
 */


type HomeButtonProps = {
  label?: string;      // 버튼에 표시할 글자 (기본: "홈으로")
  className?: string;  // 필요하면 추가 스타일 넣을 때 사용
};

export default function HomeButton({
  label = "TTT",
  className = "",
}: HomeButtonProps) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center rounded-lg py-2 text-2xl font-bold ${className}`}
    >
      {label}
    </Link>
  );
}
