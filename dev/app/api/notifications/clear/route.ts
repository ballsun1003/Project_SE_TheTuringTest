import { NextRequest, NextResponse } from "next/server";
import { deleteAllNotificationsByUser } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { success, error } = await deleteAllNotificationsByUser(userId);

  if (!success) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
