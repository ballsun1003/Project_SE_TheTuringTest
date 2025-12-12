"use client";

import Captcha from "@/components/captcha";
import HomeButton from "@/components/homeButton";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * SignPage (회원가입 페이지)
 * ======================================================
 * 사용자가 ID/비밀번호를 입력하고
 * Cloudflare Turnstile CAPTCHA 검증을 거쳐
 * 계정을 생성하도록 하는 클라이언트 페이지 컴포넌트.
 *
 * 핵심 기능
 * ------------------------------------------------------
 * - ID, Password 입력 폼 제공
 * - Captcha 컴포넌트를 통해 자동화 공격 방지
 * - /api/auth/signup API 호출하여 회원가입 처리
 * - 회원가입 성공 시 로그인 페이지로 이동
 *
 * 동작 방식
 * ------------------------------------------------------
 * - onSubmit 시 FormData로 id/password/captcha 추출
 * - fetch()로 서버에 JSON Body 전달
 * - 서버에서 verifyTurnstile() 검증 후 DB에 유저 생성
 * - 결과에 따라 alert 메시지 출력 및 라우팅
 *
 * UI 구성 요소
 * ------------------------------------------------------
 * - HomeButton: 홈 화면으로 이동 가능
 * - Captcha: Turnstile token 발급 및 hidden input 자동 처리
 * - TailwindCSS 기반 폼 UI 스타일 적용
 *
 * 보안 요소
 * ------------------------------------------------------
 * - 비밀번호는 서버에서 bcrypt로 해싱 처리 (API 내부)
 * - 봇 방지를 위한 CAPTCHA 필수
 *
 * 목적
 * ------------------------------------------------------
 * - 사용자가 직접 계정을 생성하고 서비스를 이용할 수 있도록 지원
 * - 사용자 인증 시스템의 초기 가입 단계 구현
 * ======================================================
 */


export default function SignPage() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    console.log("FormData captcha:", formData.get("captcha")); // 확인용

    const id = String(formData.get("id"));
    const password = String(formData.get("password"));
    const captcha = String(formData.get("captcha"));

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, captcha }),
    });

    const json = await res.json();

    if (res.ok) {
      alert("회원가입 성공!");
      router.push("/login");
    } else {
      alert("회원가입 실패: " + json.error);
    }
    console.log("FormData Captcha:", formData.get("captcha"));


  };

  return (
    <main className="min-h-screen flex flex-col">
      <div className="p-4">
        <HomeButton className="mr-2 text-gray-900" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Sign Up</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID
              </label>
              <input
                id="id"
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
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black text-gray-900"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {/* 🔥 Captcha 반드시 form 내부 */}
            <Captcha />

            {/* Sign Up 버튼 */}
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
