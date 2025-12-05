import { NextRequest, NextResponse } from "next/server";
import { listNotificationsByUser } from "@/lib/notificationService";

/**
 * ======================================================
 * LIST USER NOTIFICATIONS API
 * ======================================================
 * Route: POST /api/notifications/list
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 특정 유저가 받은 알림 목록 조회
 * 🔸 최신순 정렬된 알림 데이터 반환
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   userId: string   // 알림을 받을 유저 ID(UUID)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { notifications: NotificationWithNames[] }
 * 400: { error: "Missing userId" }
 * 400: { error: "Failed to load notifications" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ userId 전달받음
 * 2️⃣ notificationService.listNotificationsByUser() 호출
 * 3️⃣ DB에서 JOIN된 알림 목록 가져오기
 *     (보낸 유저명/받는 유저명 포함)
 * 4️⃣ JSON 응답 반환
 *
 * 특징
 * ------------------------------------------------------
 * - 읽음 처리 기능은 아직 없음 (단순 조회 API)
 * - 알림 삭제는 별도 API에서 처리
 *
 * 연관 서비스/DB
 * ------------------------------------------------------
 * - notificationService.listNotificationsByUser()
 * - DB: notifications 테이블 (+ users JOIN)
 *
 * 사용 UI
 * ------------------------------------------------------
 * - NotificationsPage (/notiList)
 *   → "알림 목록" 화면 로드 시 자동 호출
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { notifications, error } = await listNotificationsByUser(userId);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ notifications });
}
