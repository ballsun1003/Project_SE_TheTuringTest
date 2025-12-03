// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { signUpUser } from "@/lib/userService";

/**
 * ======================================================
 * SIGNUP API
 * ======================================================
 * 📌 Route: POST /api/auth/signup
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 Turnstile Captcha 인증 기반 회원가입 처리
 * 🔹 중복 ID 방지 및 비밀번호 암호화(userService 내부)
 *
 * 요청 Body (JSON)
 * ------------------------------------------------------
 * {
 *   id: string,         // 생성할 사용자 ID
 *   password: string,   // 사용자 비밀번호
 *   captcha: string     // Turnstile Captcha Token
 * }
 *
 * 응답 (JSON)
 * ------------------------------------------------------
 * 200 OK:
 * {
 *   user: { ...UserEntity }  // 생성된 유저 정보 반환
 * }
 *
 * 400 Bad Request:
 * {
 *   error: "Missing required fields" |
 *          "ID already exists" |
 *          "Invalid captcha" ...
 * }
 *
 * 500 Server Error:
 * {
 *   error: "Internal server error"
 * }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 입력 값 검증
 * 2️⃣ 캡챠 인증 포함한 회원가입 처리
 * 3️⃣ 성공 시 사용자 정보 반환
 *
 * 연관 서비스/로직
 * ------------------------------------------------------
 * - signUpUser() in userService.ts
 *   · Captcha 검증
 *   · ID 중복 확인
 *   · 비밀번호 해싱 저장
 *
 * 연관 Frontend
 * ------------------------------------------------------
 * - /signup 페이지(SignPage)
 *   · 회원가입 성공 → /login 이동
 * ======================================================
 */

export async function POST(req: Request) {
  try {
    const { id, password, captcha } = await req.json();

    // 기본 필드 검증
    if (!id || !password || !captcha) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // userService를 이용해 실제 회원가입 처리
    const result = await signUpUser(id, password, captcha);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // 성공: 유저 정보 반환
    return NextResponse.json({ user: result.user }, { status: 200 });
  } catch (err) {
    console.error("Signup API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
