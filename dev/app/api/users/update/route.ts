import { NextResponse } from "next/server";
import { updateUserInfo } from "@/lib/userService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, newUsername, currentPassword, newPassword } = body;

    if (!userId || !newUsername) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }

    const { error } = await updateUserInfo(
      userId,
      newUsername,
      currentPassword,
      newPassword
    );

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Update User Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
