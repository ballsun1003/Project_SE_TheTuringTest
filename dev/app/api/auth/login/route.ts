import { NextResponse } from "next/server";
import { loginUser } from "@/lib/userService";

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
