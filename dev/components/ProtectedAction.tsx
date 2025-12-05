"use client";

import { useRouter } from "next/navigation";
/**
 * ======================================================
 * ProtectedAction Component (ProtectedAction.tsx)
 * ======================================================
 * 인증된 사용자만 특정 동작(onAction)을 수행할 수 있도록
 * 보호하는 버튼 기반 액션 컴포넌트.
 *
 * 동작 방식
 * ------------------------------------------------------
 * - localStorage에서 access_token 유무 확인
 * - 로그인되어 있지 않으면 /login 페이지로 이동
 * - 로그인되어 있으면 전달받은 onAction() 실행
 *
 * Props
 * ------------------------------------------------------
 * - onAction: 인증된 상태에서 실행될 콜백 함수
 * - children: 버튼 내부 표시 요소
 * - className: 스타일 지정용 (선택)
 *
 * 목적
 * ------------------------------------------------------
 * - 버튼 클릭 시 실행되는 특정 동작을 인증 기반으로 제어
 * - "좋아요", "댓글 삭제", "게시글 수정" 등의
 *   사용자 권한이 필요한 액션에서 활용
 *
 * 주의 사항
 * ------------------------------------------------------
 * - 클라이언트 컴포넌트이므로 "use client" 지시문 포함
 * - LocalStorage 인증 방식 기반 → SSR 환경에서는 동작하지 않음
 * ======================================================
 */


export default function ProtectedAction({
  onAction,
  children,
  className,
}: {
  onAction: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    onAction();
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
