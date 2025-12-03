"use client";

import HomeButton from "@/components/homeButton";
import Captcha from "@/components/captcha";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * ======================================================
 * LoginPage (로그인 페이지)
 * ======================================================
 * 사용자 ID 및 비밀번호를 입력받고,
 * Cloudflare Turnstile CAPTCHA 를 통해 자동화 공격을 방지하며
 * 인증 요청을 처리하는 UI 화면.
 *
 * 핵심 기능
 * ------------------------------------------------------
 * - ID / 비밀번호 입력
 * - Captcha 를 활용한 봇 로그인 방지
 * - /api/auth/login API 호출
 * - 성공 시 사용자 정보를 localStorage에 저장
 *    · accessToken   : 인증 토큰(간이 세션 역할)
 *    · userId        : 사용자 식별용 UUID
 *    · username      : UI 표시용 사용자명
 * - 로그인 이후 메인 페이지("/")로 이동
 *
 * 유효성 검증
 * ------------------------------------------------------
 * - 입력 필수: ID, Password, Captcha
 * - Captcha 미인증 시 알림 및 요청 차단
 *
 * UI / UX 구성
 * ------------------------------------------------------
 * - HomeButton: 홈으로 이동하는 네비게이션 제공
 * - TailwindCSS 기반 미니멀한 로그인 폼
 * - 오류 발생 시 경고(alert)로 사용자 안내
 *
 * 보안 요소
 * ------------------------------------------------------
 * - CAPTCHA 기반 자동화 공격 방지
 * - 비밀번호는 서버에서 bcrypt 로 검증 후 인증 처리
 * - 토큰 기반 인증 방식(localStorage 저장)
 *
 * 목적
 * ------------------------------------------------------
 * - 인증을 요구하는 모든 기능에 접근하기 위한
 *   사용자 로그인 엔트리 포인트 제공
 * ======================================================
 */


export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const id = String(formData.get("id"));
    const password = String(formData.get("password"));
    const captcha = String(formData.get("captcha"));

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
    <main className="min-h-screen flex flex-col bg-gray-50">
      <div className="p-4">
        <HomeButton className="mr-2 text-gray-900" />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Login</h1>

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
