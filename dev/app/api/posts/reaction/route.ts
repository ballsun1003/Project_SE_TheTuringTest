// app/api/posts/reaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { toggleReaction } from "@/lib/reactionService";

export async function POST(req: NextRequest) {
  try {
    const { postId, userId, type } = await req.json();

    if (!postId || !userId || !type) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { error: "Invalid reaction type" },
        { status: 400 }
      );
    }

    const result = await toggleReaction(postId, userId, type);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      likeCount: result.likeCount,
      dislikeCount: result.dislikeCount,
      userReaction: result.userReaction,
    });
  } catch (err) {
    console.error("Reaction API Error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
