"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
