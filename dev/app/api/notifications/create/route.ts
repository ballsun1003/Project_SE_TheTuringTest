import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notificationService";
import { NotificationType } from "@/lib/entities/Notification";

/**
 * ======================================================
 * CREATE NOTIFICATION API
 * ======================================================
 * Route: POST /api/notifications/create
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 특정 이벤트에 대한 알림 생성
 *    - 좋아요 / 싫어요 / 댓글 알림 지원
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   toUserId: string,      // 알림을 받을 유저 ID(UUID)
 *   fromUserId: string,    // 알림을 발생시킨 유저 ID(UUID)
 *   postId: string,        // 알림이 발생한 게시글 ID(UUID)
 *   type: "comment" | "like" | "dislike"
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { notification: NotificationWithNames }
 * 400: { error: "Missing fields" }
 * 400: { error: "Invalid notification type" }
 * 400: { error: "Failed to create notification" }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 필수 값 유효성 검사
 * 2️⃣ 알림 타입이 정상인지 확인 (enum validation)
 * 3️⃣ createNotification() 호출 → DB 저장
 * 4️⃣ 성공 시 생성된 알림 객체 반환
 *
 * 특징
 * ------------------------------------------------------
 * - username JOIN 포함 (보낸/받는 유저명 제공)
 * - 실시간 표시는 구현 대상 아님 (페이지 조회할 때만 표시)
 *
 * 보안/권한 관련
 * ------------------------------------------------------
 * - 자기 자신의 게시글에 반응했을 때 알림 생성 금지 로직은
 *   reactionService/commentService 단계에서 처리됨
 *
 * 연관 서비스/DB
 * ------------------------------------------------------
 * - createNotification()
 * - DB: notifications 테이블
 *
 * 사용 UI
 * ------------------------------------------------------
 * - PostDetailPage (좋아요/싫어요/댓글 시 자동 호출)
 * ======================================================
 */


export async function POST(req: NextRequest) {
  const { toUserId, fromUserId, postId, type } = await req.json();

  if (!toUserId || !fromUserId || !postId || !type) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (!["comment", "like", "dislike"].includes(type)) {
    return NextResponse.json({ error: "Invalid notification type" }, { status: 400 });
  }

  const { notification, error } = await createNotification(
    toUserId,
    fromUserId,
    postId,
    type as NotificationType
  );

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ notification });
}
