"use client";

import HomeButton from "@/components/homeButton";
import Captcha from "@/components/captcha";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const id = String(formData.get("id"));
    const password = String(formData.get("password"));
    const rawCaptcha = formData.get("captcha");
    const captcha = typeof rawCaptcha === "string" ? rawCaptcha : "";
    
    if (!captcha) {
      alert("캡챠 인증을 완료해주세요!");
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, captcha }),
    });

    const json = await res.json();

    if (!res.ok) {
      alert("로그인 실패: " + json.error);
      return;
    }

    // 🔥 로그인 성공 → localStorage 저장
    localStorage.setItem("accessToken", json.accessToken);
    localStorage.setItem("userId", json.user.id);
    localStorage.setItem("username", json.user.username);

    alert("로그인 성공!");

    // 메인 페이지로 이동
    router.push("/");
  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <HomeButton className="mr-2 text-gray-900" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID
              </label>
              <input
                name="id"
                type="text"
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black text-gray-900"
                placeholder="아이디를 입력하세요"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black text-gray-900"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* Turnstile Captcha */}
            <Captcha />

            {/* Login 버튼 */}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
