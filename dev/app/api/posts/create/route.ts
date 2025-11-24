// app/api/posts/create/route.ts

import { NextResponse } from "next/server";
import { createPost, updatePostContent } from "@/lib/postService";
import { createAIContent } from "@/lib/aiService";

export async function POST(req: Request) {
  try {
    const { authorId, title, prompt, category } = await req.json();

    if (!authorId || !title || !prompt || !category) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // 1) 우선 게시물 생성 (내용 없음)
    const { post, error } = await createPost(authorId, title, prompt, category);
    if (error || !post) {
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    // 2) AI로 본문 생성
    const aiContent = await createAIContent(prompt);

    // 3) 생성된 본문 업데이트
    const updated = await updatePostContent(post.getId(), aiContent, prompt);

    if (updated.error || !updated.post) {
      return NextResponse.json(
        { error: "Failed to update post content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: updated.post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
