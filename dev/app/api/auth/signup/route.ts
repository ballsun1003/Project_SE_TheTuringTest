// app/api/auth/signup/route.ts

import { NextResponse } from "next/server";
import { signUpUser } from "@/lib/userService";

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
