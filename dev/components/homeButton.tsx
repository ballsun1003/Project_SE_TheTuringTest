// app/components/HomeButton.tsx
"use client";

import Link from "next/link";

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
