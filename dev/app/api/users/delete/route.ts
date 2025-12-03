import { NextResponse } from "next/server";
import { deleteUserAndData } from "@/lib/userService";

/**
 * ======================================================
 * DELETE USER ACCOUNT API
 * ======================================================
 * Route: POST /api/users/delete
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 회원 탈퇴 처리
 * 🔹 사용자가 작성한 모든 데이터 삭제 (게시글, 댓글, 리액션 등)
 *
 * 요청 JSON Body
 * ------------------------------------------------------
 * {
 *   userId: string   // 삭제 대상 사용자 ID
 * }
 *
 * 응답 예시
 * ------------------------------------------------------
 * 성공: { success: true }
 * 실패:
 *  - { error: "Missing userId" } (400)
 *  - { error: "...DB error..." } (400)
 *  - { error: "Server error" } (500)
 *
 * 내부 동작
 * ------------------------------------------------------
 * 1️⃣ deleteUserAndData(userId) 실행 (userService)
 * 2️⃣ 관련 데이터(게시글, 댓글, 리액션, 알림 등) 삭제 트랜잭션 수행
 * 3️⃣ localStorage에서 토큰 삭제는 클라이언트에서 처리
 *
 * 보안 고려사항
 * ------------------------------------------------------
 * - 인증/인가 체크는 프론트에서 수행
 * - 서버에서도 추후 JWT 인증 검증 필요 (TODO)
 *
 * 사용 문서 위치
 * ------------------------------------------------------
 * - SDS: 회원 탈퇴 유스케이스
 * - 시퀀스 다이어그램: "사용자 삭제 Flow"
 * - DB 스키마: ON DELETE CASCADE 구조 참고
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { error } = await deleteUserAndData(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Delete User Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
