import { NextRequest, NextResponse } from "next/server";
import { listNotificationsByUser } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const { notifications, error } = await listNotificationsByUser(userId);

  if (error) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ notifications });
}
