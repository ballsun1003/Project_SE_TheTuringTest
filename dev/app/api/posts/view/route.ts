
import { NextResponse } from "next/server";
import { increaseViewCount } from "@/lib/postService";

export async function POST(req: Request) {
  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: "Missing postId" }, { status: 400 });

  const { post, error } = await increaseViewCount(postId);
  if (error || !post) return NextResponse.json({ error }, { status: 500 });

  // ❗ Post 클래스 → JSON 변환
  const json = {
    id: post.getId(),
    viewCount: post.getViewCount(),
  };

  return NextResponse.json(json);
}


