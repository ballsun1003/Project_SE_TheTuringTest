import { NextResponse } from "next/server";
import { updatePostContent } from "@/lib/postService";
import { updateAIContent } from "@/lib/aiService";
import { getPostById } from "@/lib/postService";

export async function POST(req: Request) {
  try {
    const { postId, authorId, updatedPrompt } = await req.json();

    if (!postId || !authorId || !updatedPrompt) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 원본 게시글 가져오기
    const { post, error } = await getPostById(postId);
    if (error || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // 작성자 본인만 수정 가능
    if (post.getAuthorId() !== authorId) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // 기존 content 가져오기
    const oldContent = post.getContent();

    // AI로 새로운 content 생성
    const newContent = await updateAIContent(oldContent, updatedPrompt);

    // DB 업데이트
    const updated = await updatePostContent(postId, newContent, updatedPrompt);

    if (updated.error || !updated.post) {
      return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }

    return NextResponse.json({ post: updated.post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
