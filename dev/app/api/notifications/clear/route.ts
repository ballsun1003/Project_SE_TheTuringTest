import { NextRequest, NextResponse } from "next/server";
import { deleteAllNotificationsByUser } from "@/lib/notificationService";
/**
 * ======================================================
 * DELETE ALL NOTIFICATIONS API
 * ======================================================
 * Route: POST /api/notifications/clear
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 특정 사용자가 받은 알림을 모두 삭제
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   userId: string   // 알림을 삭제할 대상 유저 ID(UUID)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { success: true }
 * 400: { error: "Missing userId" }
 * 400: { error: "Failed to clear notifications" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ userId 값 검사
 * 2️⃣ deleteAllNotificationsByUser() 호출
 * 3️⃣ DB에서 해당 유저의 전체 알림 제거
 * 4️⃣ 성공 여부 반환
 *
 * 특징
 * ------------------------------------------------------
 * - 개별 삭제가 아닌 전체 삭제를 진행
 * - 사용자는 자신의 알림만 삭제 가능하다는 가정
 *
 * 보안/권한 관련
 * ------------------------------------------------------
 * - 사용자 인증/인가(권한) 검증 로직은 프론트+상위 API에서 처리
 * - 서버에서는 단순 userId 기반 삭제만 수행
 *
 * 연관 서비스/DB
 * ------------------------------------------------------
 * - deleteAllNotificationsByUser()
 * - DB: notifications 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - 알림 페이지에서 “전체 삭제” 버튼 클릭 시 사용될 수 있음
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { success, error } = await deleteAllNotificationsByUser(userId);

  if (!success) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
