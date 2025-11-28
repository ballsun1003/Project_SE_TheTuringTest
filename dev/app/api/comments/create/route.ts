// app/api/comments/create/route.ts

import { NextResponse } from "next/server";
import { createComment } from "@/lib/commentService";
import { createAIContent } from "@/lib/aiService";
import { createNotification } from "@/lib/notificationService";
import { getPostById } from "@/lib/postService";

export async function POST(req: Request) {
  try {
    const { postId, authorId, prompt } = await req.json();

    if (!postId || !authorId || !prompt) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 🧩 1) 게시글 존재 확인 + 작성자(알림 받을 사람) 가져오기
    const { post, error: postError } = await getPostById(postId);

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post not found." },
        { status: 404 }
      );
    }

    const postAuthorId = post.getAuthorId();

    // 🧠 2) AI로 댓글 본문 생성
    const content = await createAIContent(prompt);

    // 💾 3) 댓글 DB에 저장
    const { comment, error: commentError } = await createComment(
      postId,
      authorId,
      content,
      prompt
    );

    if (commentError || !comment) {
      return NextResponse.json(
        { error: "Failed to create comment." },
        { status: 500 }
      );
    }

    // 🔔 4) 알림 생성 (댓글 → 게시글 작성자에게)
    if (postAuthorId !== authorId) {
      await createNotification(
        postAuthorId,   // toUserId
        authorId,       // fromUserId
        postId,         // post
        "comment"       // type
      );
    }

    return NextResponse.json({ comment });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}
