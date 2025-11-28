"use client";

import { useRouter } from "next/navigation";

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
