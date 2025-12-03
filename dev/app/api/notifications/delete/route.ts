import { NextRequest, NextResponse } from "next/server";
import { deleteNotification } from "@/lib/notificationService";

/**
 * ======================================================
 * DELETE SINGLE NOTIFICATION API
 * ======================================================
 * Route: POST /api/notifications/delete
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 개별 알림 삭제 처리
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   notificationId: string   // 삭제할 알림 ID(UUID)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { success: true }
 * 400: { error: "Missing notificationId" }
 * 400: { error: "Failed to delete notification" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 전달된 notificationId 값 유효성 검사
 * 2️⃣ deleteNotification() 호출 → DB 삭제
 * 3️⃣ 삭제 성공 여부 반환
 *
 * 보안/권한 관련
 * ------------------------------------------------------
 * - 현재는 본인 알림만 삭제하도록 검증하지 않음
 * - 추후 userId 검증 로직 추가 가능
 *
 * 연관 서비스/DB
 * ------------------------------------------------------
 * - deleteNotification(notificationId)
 * - DB: notifications 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - NotificationsPage (/notiList)
 *   → 알림 삭제 버튼 클릭 시 호출
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { notificationId } = await req.json();

  if (!notificationId) {
    return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
  }

  const { success, error } = await deleteNotification(notificationId);

  if (!success) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
