import { NextRequest, NextResponse } from "next/server";
import { listCommentsByPostId } from "@/lib/commentService";

export async function POST(req: NextRequest) {
  const { postId } = await req.json();

  if (!postId) {
    return NextResponse.json(
      { error: "Missing postId" },
      { status: 400 }
    );
  }

  const { comments, error } = await listCommentsByPostId(postId);

  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  return NextResponse.json({ comments });
}
