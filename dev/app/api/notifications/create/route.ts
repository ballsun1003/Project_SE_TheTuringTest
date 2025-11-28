import { NextRequest, NextResponse } from "next/server";
import { createNotification } from "@/lib/notificationService";
import { NotificationType } from "@/lib/entities/Notification";

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
