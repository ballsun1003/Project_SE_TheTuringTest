// app/api/posts/updateMeta/route.ts
import { NextResponse } from "next/server";
import { getPostById, updatePostMeta } from "@/lib/postService";

export async function POST(req: Request) {
  const { postId, title, category, userId } = await req.json();

  if (!postId || !title || !category || !userId) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const { post, error } = await getPostById(postId);
  if (error || !post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  if (post.getAuthorId() !== userId) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const result = await updatePostMeta(postId, title, category);

  if (result.error || !result.post) {
    return NextResponse.json({ error: "Failed to update metadata" }, { status: 500 });
  }

  return NextResponse.json({ post: result.post });
}
