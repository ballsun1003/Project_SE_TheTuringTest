"use client";

import HomeButton from "@/components/homeButton";
// import Link from "next/link"; // 현재 이 파일에서 안 쓰면 지워도 됨
import { FormEvent } from "react";

export default function LoginPage() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id");
    const password = formData.get("password");
    const captcha = formData.get("captcha");

    console.log({ id, password, captcha });
    // 여기에서 로그인 API 호출 로직을 추가
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      {/* 좌상단 홈 버튼 */}
      <div className="p-4">
        <HomeButton className="mr-2" />
      </div>

      {/* 가운데 정렬된 로그인 박스 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-medium text-gray-700"
              >
                ID
              </label>
              <input
                id="id"
                name="id"
                type="text"
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="아이디를 입력하세요"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

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
