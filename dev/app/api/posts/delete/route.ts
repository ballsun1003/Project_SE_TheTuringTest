import { NextResponse } from "next/server";
import { deletePost } from "@/lib/postService";

export async function POST(req: Request) {
  try {
    const { postId, authorId } = await req.json();

    if (!postId || !authorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { error, success } = await deletePost(postId, authorId);

    if (error) {
      return NextResponse.json({ error }, { status: 403 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
