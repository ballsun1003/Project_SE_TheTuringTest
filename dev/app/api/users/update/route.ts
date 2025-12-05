import { NextResponse } from "next/server";
import { updateUserInfo } from "@/lib/userService";

/**
 * ======================================================
 * UPDATE USER INFO API
 * ======================================================
 * Route: POST /api/users/update
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 사용자 정보 수정 처리
 * 🔹 수정 가능한 항목:
 *    - username 변경
 *    - 비밀번호 변경
 * 🔹 루트 계정은 수정 불가 (userService에서 제한)
 *
 * 요청 JSON Body
 * ------------------------------------------------------
 * {
 *   userId: string,          // 수정 대상 유저 ID
 *   newUsername: string,     // 새 사용자명 (필수)
 *   currentPassword?: string, // 비밀번호 변경 시 필수
 *   newPassword?: string      // 새 비밀번호
 * }
 *
 * 응답 예시
 * ------------------------------------------------------
 * 🔸 성공: { success: true }
 * 🔸 실패:
 *    { error: "Invalid data." } (400)
 *    { error: "비밀번호 오류 또는 권한 없음" } (400)
 *    { error: "Server error" } (500)
 *
 * 내부 동작
 * ------------------------------------------------------
 * 1️⃣ 입력 유효성 검사 (userId, newUsername 필수)
 * 2️⃣ updateUserInfo() 호출 (userService)
 * 3️⃣ 비밀번호 변경 요청 시:
 *     - 현재 비밀번호 검증 필수
 * 4️⃣ DB에서 업데이트 성공 시 success 반환
 *
 * 보안 주의사항
 * ------------------------------------------------------
 * 🚨 현재 인증 상태 검증 없음
 *    → userId를 요청 Body에 포함하여 신뢰 (취약)
 *    → 추후 JWT 기반 사용자 검증 예정
 *
 * 관련 UI
 * ------------------------------------------------------
 * - UserProfilePage (내 정보 수정)
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, newUsername, currentPassword, newPassword } = body;

    if (!userId || !newUsername) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }

    const { error } = await updateUserInfo(
      userId,
      newUsername,
      currentPassword,
      newPassword
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Update User Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
