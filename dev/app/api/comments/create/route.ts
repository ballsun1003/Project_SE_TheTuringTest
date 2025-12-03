// app/api/comments/create/route.ts

import { NextResponse } from "next/server";
import { createComment } from "@/lib/commentService";
import { createAIContent } from "@/lib/aiService";
import { createNotification } from "@/lib/notificationService";
import { getPostById } from "@/lib/postService";

/**
 * ======================================================
 * CREATE COMMENT API
 * ======================================================
 * Route: POST /api/comments/create
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔸 AI 기반 댓글 생성
 * 🔸 댓글 생성 시 해당 게시글 작성자에게 알림 생성
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,   // 댓글이 달릴 게시글 ID(UUID)
 *   authorId: string, // 댓글 작성자 ID(UUID)
 *   prompt: string    // AI에게 전달할 프롬프트
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * 200: { comment }
 * 400: { error: "Missing required fields." }
 * 404: { error: "Post not found." }
 * 500: { error: "Failed to create comment." | "Server error." }
 *
 * 상세 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 게시글 존재 확인 (getPostById)
 * 2️⃣ AI 기반 본문 생성 (createAIContent)
 * 3️⃣ DB에 댓글 저장 (createComment)
 * 4️⃣ 게시글 작성자에게 알림 생성 (createNotification)
 *     - 단, 본인 댓글일 경우 알림 X
 *
 * 사용되는 서비스/연관 테이블
 * ------------------------------------------------------
 * - commentService: createComment()
 * - aiService: createAIContent()
 * - notificationService: createNotification()
 * - postService: getPostById()
 * - DB Table: comments, notifications
 *
 * 사용 UI
 * ------------------------------------------------------
 * - PostDetailPage (댓글 작성 영역 → AI 댓글 생성 버튼)
 *
 * 보안 여부
 * ------------------------------------------------------
 * - 로그인 필요
 * ======================================================
 */


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
