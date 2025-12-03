import { NextResponse } from "next/server";
import { loginUser } from "@/lib/userService";

/**
 * ======================================================
 * LOGIN API
 * ======================================================
 * Route: POST /api/auth/login
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 사용자 로그인 처리
 * 🔸 Turnstile Captcha 인증 필요
 * 🔸 로그인 성공 시 Access Token + 사용자 정보 반환
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   id: string,         // 로그인 ID
 *   password: string,   // 비밀번호 (일반 텍스트)
 *   captcha: string     // Turnstile Captcha Token
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: {
 *   userId: string,
 *   username: string,
 *   accessToken: string,
 *   user: { ...UserEntity }
 * }
 *
 * 400: { error: "Missing required fields" | "Invalid credentials" ... }
 * 500: { error: "Internal server error" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 입력 필드 검증
 * 2️⃣ Captcha 인증 포함하여 로그인 처리 (loginUser)
 * 3️⃣ 로그인 성공 → 토큰과 사용자 데이터 반환
 *
 * 사용되는 서비스/연관 로직
 * ------------------------------------------------------
 * - userService.loginUser()
 * - Turnstile Captcha 검사 (백엔드 로직 내부 수행)
 *
 * 연관 Frontend
 * ------------------------------------------------------
 * - /login 페이지 (LoginPage)
 * - 로그인 성공 시 localStorage 저장 및 홈 이동
 *
 * 보안 및 인증
 * ------------------------------------------------------
 * - 비밀번호는 userService 내부에서 검증
 * - Access Token은 Supabase Auth 또는 커스텀 Token 사용
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { id, password, captcha } = await req.json();

    if (!id || !password || !captcha) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await loginUser(id, password, captcha);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const user = result.user;

    // 🔥 username, userId, accessToken을 확실하게 반환
    return NextResponse.json(
      {
        userId: user?.getId(),
        username: user?.getUsername(),
        accessToken: result.accessToken,
        user: result.user, // 원래 구조도 유지
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
