// lib/notificationService.ts

import { supabase } from "./supabaseClient";
import {
  Notification,
  mapDBNotification,
  NotificationType,
} from "./entities/Notification";
/**
 * ======================================================
 * Notification Service (notificationService.ts)
 * ======================================================
 * 게시글에 대한 상호작용(좋아요/싫어요 등)으로 발생하는
 * 알림(Notification) 데이터를 관리하는 서비스 모듈이다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. createNotification(toUserId, fromUserId, postId, type)
 *    - 알림 레코드 생성
 *    - fromUser / toUser의 username을 JOIN하여 함께 반환
 *    - 알림 발생 예시:
 *      · 누군가 내 게시글에 좋아요/싫어요 눌렀을 때
 *
 * 2. listNotificationsByUser(userId)
 *    - 특정 유저에게 도착한 알림 목록 조회
 *    - 최신순(created_at 기준 내림차순)
 *    - 작성자 / 수신자의 username 포함하여 반환
 *
 * 3. deleteNotification(notificationId)
 *    - 단일 알림 삭제
 *    - 사용자 UI에서 개별 삭제 버튼 등에 사용
 *
 * 4. deleteAllNotificationsByUser(userId)
 *    - 특정 사용자에게 도착한 알림 전체 삭제
 *    - "모든 알림 지우기" 기능에 활용
 *
 *
 * 공통 처리 요소
 * ------------------------------------------------------
 * - Notifications 테이블과 Users 테이블 JOIN
 *   (from_user_id, to_user_id → username)
 * - 오류 발생 시 명확한 에러 로그 출력 및 메시지 반환
 * - 프론트 표시를 위해 fromUserName / toUserName 확장 구조 사용
 *
 *
 * 목적
 * ------------------------------------------------------
 * 사용자 간 상호작용 활동을 알림 기반으로
 * 실시간 피드백 Experience를 제공하기 위해 설계됨.
 * ======================================================
 */


// 🔥 UI에서 사용 가능한 타입 확장
export type NotificationWithNames = Notification & {
  fromUserName: string | null;
  toUserName: string | null;
};

// 🔧 공통 변환
function mapNotificationWithNames(row: any): NotificationWithNames {
  const base = mapDBNotification(row);

  return Object.assign(base, {
    fromUserName: row.fromUser?.username ?? null,
    toUserName: row.toUser?.username ?? null,
  });
}

/* ===================================
   1. 알림 생성 (username JOIN 포함)
=================================== */
export async function createNotification(
  toUserId: string,
  fromUserId: string,
  postId: string,
  type: NotificationType
): Promise<{ notification?: NotificationWithNames; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert([
        {
          to_user_id: toUserId,
          from_user_id: fromUserId,
          post_id: postId,
          type,
        },
      ])
      .select(
        "*, fromUser:from_user_id(username), toUser:to_user_id(username)"
      )
      .single();

    if (error || !data) {
      console.error("Notification insert error:", error);
      return { error: "Failed to create notification" };
    }

    return { notification: mapNotificationWithNames(data) };
  } catch (err) {
    console.error("createNotification() error:", err);
    return { error: "Server error while creating notification" };
  }
}

/* ===================================
   2. 특정 유저의 알림 목록 불러오기
=================================== */
export async function listNotificationsByUser(
  userId: string
): Promise<{ notifications?: NotificationWithNames[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        "*, fromUser:from_user_id(username), toUser:to_user_id(username)"
      )
      .eq("to_user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      console.error("Notification fetch error:", error);
      return { error: "Failed to load notifications" };
    }

    return { notifications: data.map(mapNotificationWithNames) };
  } catch (err) {
    console.error("listNotificationsByUser() error:", err);
    return { error: "Server error while loading notifications" };
  }
}

/* ===================================
   3. 알림 삭제
=================================== */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Delete notification error:", error);
      return { success: false, error: "Failed to delete notification" };
    }

    return { success: true };
  } catch (err) {
    console.error("deleteNotification() error:", err);
    return { success: false, error: "Server error" };
  }
}

/* ===================================
   4. 특정 유저 알림 전체 삭제
=================================== */
export async function deleteAllNotificationsByUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("to_user_id", userId);

    if (error) {
      console.error("Delete all notifications error:", error);
      return { success: false, error: "Failed to clear notifications" };
    }

    return { success: true };
  } catch (err) {
    console.error("deleteAllNotificationsByUser() error:", err);
    return { success: false, error: "Server error" };
  }
}
