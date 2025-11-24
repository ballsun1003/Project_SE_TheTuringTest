import { NextResponse } from "next/server";
import { toggleReaction } from "@/lib/reactionService";

export async function POST(req: Request) {
  try {
    const { postId, userId, type } = await req.json();

    if (!postId || !userId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await toggleReaction(postId, userId, type);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      likeCount: result.likeCount,
      dislikeCount: result.dislikeCount,
      userReaction: result.userReaction,
    });
  } catch (e) {
    console.error("toggle error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
