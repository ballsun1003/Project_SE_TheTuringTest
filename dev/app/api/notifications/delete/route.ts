import { NextRequest, NextResponse } from "next/server";
import { deleteNotification } from "@/lib/notificationService";

export async function POST(req: NextRequest) {
  const { notificationId } = await req.json();

  if (!notificationId) {
    return NextResponse.json({ error: "Missing notificationId" }, { status: 400 });
  }

  const { success, error } = await deleteNotification(notificationId);

  if (!success) return NextResponse.json({ error }, { status: 400 });

  return NextResponse.json({ success: true });
}
