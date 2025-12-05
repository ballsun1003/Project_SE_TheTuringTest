import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/userService";

/**
 * ======================================================
 * GET CURRENT USER INFO API
 * ======================================================
 * Route: POST /api/users/get
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 userId를 기준으로 사용자의 상세 정보 조회
 * 🔹 프로필 화면 및 인증 상태 확인에 사용
 *
 * 요청 JSON Body
 * ------------------------------------------------------
 * {
 *   userId: string   // 조회할 사용자 ID
 * }
 *
 * 응답 예시
 * ------------------------------------------------------
 * 🔸 성공: { user: {...사용자 정보...} }
 * 🔸 실패:
 *    { error: "Missing userId" } (400)
 *    { error: "User not found" } (404)
 *    { error: "Server error" } (500)
 *
 * 내부 동작
 * ------------------------------------------------------
 * 1️⃣ getCurrentUser(userId) 실행 (userService)
 * 2️⃣ 존재하지 않으면 404 반환
 * 3️⃣ 해당 유저 객체 반환
 *
 * 보안 참고사항
 * ------------------------------------------------------
 * - JWT 기반 인증 인증 절차는 아직 미적용 (TODO)
 * - 🔥 현재는 요청에서 받은 userId를 그대로 신뢰함 → 추후 개선 필요
 *
 * 사용 문서 참고
 * ------------------------------------------------------
 * - UserProfilePage UI 데이터 로딩
 * - Auth Header 사용자 이름 표시
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { user, error } = await getCurrentUser(userId);
    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
