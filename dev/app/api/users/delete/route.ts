import { NextResponse } from "next/server";
import { deleteUserAndData } from "@/lib/userService";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { error } = await deleteUserAndData(userId);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Delete User Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
