"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 💡 localStorage의 accessToken 기준으로 로그인 여부 체크
  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    setIsLoggedIn(!!token);
  }, []);

  // 🎨 로그인 전/후 배경색 결정
  // - 비로그인: 차가운 쿨 그레이
  // - 로그인: 따뜻한 아이보리/노랑 톤
  const bgClass = isLoggedIn ? "bg-amber-50" : "bg-slate-100";

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className={`${bgClass} min-h-screen`}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}
