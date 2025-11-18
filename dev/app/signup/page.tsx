"use client";

import Captcha from "@/components/captcha";
import HomeButton from "@/components/homeButton";
import { FormEvent } from "react";

export default function SignPage() {

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id");
    const password = formData.get("password");
    const captcha = formData.get("captcha");

    console.log({ id, password, captcha });
    // TODO: 여기에서 실제 회원가입 로직(서버 요청 등) 추가
  };



  

  return (
    <main className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4">
        <HomeButton className="mr-2" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

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

            {/* Captcha */}
            

            {/* Sign Up 버튼 */}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign Up
            </button>
            <Captcha/>
          </form>
        </div>
      </div>
    </main>
  );
}
