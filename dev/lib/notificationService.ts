// lib/notificationService.ts

import { supabase } from "./supabaseClient";
import {
  Notification,
  mapDBNotification,
  NotificationType,
} from "./entities/Notification";

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

// ===================================
// 1. 알림 생성 (username JOIN 포함)
// ===================================
export async function createNotification(
  toUserId: string,
  fromUserId: string,
  postId: string,
  type: NotificationType
): Promise<{ notification?: NotificationWithNames; error?: string }> {
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
    return { error: "Failed to create notification" };
  }

  return { notification: mapNotificationWithNames(data) };
}

// ===================================
// 2. 특정 유저의 알림 목록 불러오기 (username 포함)
// ===================================
export async function listNotificationsByUser(
  userId: string
): Promise<{ notifications?: NotificationWithNames[]; error?: string }> {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      "*, fromUser:from_user_id(username), toUser:to_user_id(username)"
    )
    .eq("to_user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return { error: "Failed to load notifications" };
  }

  return { notifications: data.map(mapNotificationWithNames) };
}

// ===================================
// 3. 알림 삭제
// ===================================
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) return { success: false, error: "Failed to delete notification" };

  return { success: true };
}

// ===================================
// 4. 유저 알림 전체 삭제
// ===================================
export async function deleteAllNotificationsByUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("to_user_id", userId);

  if (error)
    return { success: false, error: "Failed to clear notifications" };

  return { success: true };
}
