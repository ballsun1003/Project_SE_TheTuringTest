// models/Notification.ts

export type NotificationType = "comment" | "like" | "dislike";

export interface NotificationProps {
  id: string;
  toUserId: string;        // 알림 받는 사람
  fromUserId: string;      // 행동한 사람
  postId: string;          // 대상 게시물
  type: NotificationType;  // comment | like | dislike
  createdAt: string;
}

export class Notification {
  private id: string;
  private toUserId: string;
  private fromUserId: string;
  private postId: string;
  private type: NotificationType;
  private createdAt: string;

  constructor(props: NotificationProps) {
    this.id = props.id;
    this.toUserId = props.toUserId;
    this.fromUserId = props.fromUserId;
    this.postId = props.postId;
    this.type = props.type;
    this.createdAt = props.createdAt;
  }

  // GETTERS
  getId() { return this.id; }
  getToUserId() { return this.toUserId; }
  getFromUserId() { return this.fromUserId; }
  getPostId() { return this.postId; }
  getType() { return this.type; }
  getCreatedAt() { return this.createdAt; }
}

// Supabase row → Notification 객체
export function mapDBNotification(row: any): Notification {
  return new Notification({
    id: row.id,
    toUserId: row.to_user_id,
    fromUserId: row.from_user_id,
    postId: row.post_id,
    type: row.type as NotificationType,
    createdAt: row.created_at,
  });
}
