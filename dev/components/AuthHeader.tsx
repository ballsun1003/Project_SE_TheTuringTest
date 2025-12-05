"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
