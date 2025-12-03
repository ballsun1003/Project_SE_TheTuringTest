// app/api/posts/reaction/route.ts
import { NextRequest, NextResponse } from "next/server";
import { toggleReaction } from "@/lib/reactionService";

/**
 * ======================================================
 * TOGGLE POST REACTION API
 * ======================================================
 * Route: POST /api/posts/reaction
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 사용자가 게시글에 "좋아요" 또는 "싫어요"를 표시하거나 취소
 * 🔹 좋아요 ↔ 싫어요 자동 전환
 * 🔹 중복 클릭 시 취소 처리 (reaction null)
 * 🔹 게시글 작성자에게 알림 생성 (reactionService 내부 처리)
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,           // 게시글 ID (필수)
 *   userId: string,           // 반응한 사용자 ID (필수)
 *   type: "like" | "dislike"  // 반응 타입 (필수)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   success: boolean,
 *   likeCount: number,        // 업데이트된 좋아요 수
 *   dislikeCount: number,     // 업데이트된 싫어요 수
 *   userReaction: "like" | "dislike" | null
 * }
 *
 * Error
 * ------------------------------------------------------
 * 400: { error: "Missing fields" }
 * 400: { error: "Invalid reaction type" }
 * 500: { error: "Server error" }
 *
 * 내부 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ postId / userId / type 유효성 검사
 * 2️⃣ reactionService.toggleReaction 호출
 * 3️⃣ DB에 반영된 최신 카운트/반응 상태 반환
 * 4️⃣ 작성자 != 사용자 → 알림 생성 (좋아요/싫어요 이벤트)
 *
 * 연관된 DB Table
 * ------------------------------------------------------
 * - posts
 * - post_reactions
 * - notifications (좋아요/싫어요 알림)
 *
 * 사용 컴포넌트
 * ------------------------------------------------------
 * - PostDetailPage → 좋아요/싫어요 버튼
 *
 * 주의 사항
 * ------------------------------------------------------
 * - 비로그인 시 호출 불가(프론트에서 자체 차단)
 * - Soft-deleted 게시글 반응 불가 (toggleReaction 내부 처리)
 * ======================================================
 */


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
