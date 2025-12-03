import { NextResponse } from "next/server";
import { toggleReaction } from "@/lib/reactionService";

/**
 * ======================================================
 * TOGGLE POST REACTION API
 * ======================================================
 * Route: POST /api/reactions/toggle
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 게시글 좋아요/싫어요 상태 토글
 * 🔹 같은 버튼 두 번 클릭 = 취소
 * 🔹 알림 기능 포함 (작성자에게 좋아요/싫어요 전달)
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string,              // 대상 게시글 ID (필수)
 *   userId?: string,             // 누른 사용자 (없으면 AI 기본 ID 사용)
 *   type: "like" | "dislike"     // 좋아요/싫어요
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   likeCount: number,           // 최신 좋아요 수
 *   dislikeCount: number,        // 최신 싫어요 수
 *   userReaction: "like" | "dislike" | null // 현재 사용자 상태
 * }
 *
 * Error 반환 예시
 * ------------------------------------------------------
 * { error: "Missing fields" }        ← 유효성 검증 실패 (400)
 * { error: "Failed to toggle..." }   ← RPC/DB 실패 (500)
 * { error: "Server error" }          ← 예외 상황 (500)
 *
 * 내부 동작 및 처리 흐름
 * ------------------------------------------------------
 * 1️⃣ userId 없으면 익명(AI) UUID 사용
 * 2️⃣ toggleReaction() 호출 (Supabase RPC 연동)
 * 3️⃣ 이전 상태 확인 후 좋아요 ↔ 취소 처리
 * 4️⃣ 작성자와 다를 경우 → 알림 생성 처리
 * 5️⃣ 최신 reaction 상태 및 카운트 반환
 *
 * 보안 관련 주의사항
 * ------------------------------------------------------
 * 🚨 인증(JWT) 검증 없음 → userId 위조 가능
 *    추후 Authorization Header 기반 검증 필요
 *
 * 관련 UI 컴포넌트
 * ------------------------------------------------------
 * - PostDetailPage: 좋아요/싫어요 버튼
 * ======================================================
 */


export async function POST(req: Request) {
  try {
    const { postId, userId, type } = await req.json();
    const finalUserId = userId ?? "00000000-0000-0000-0000-000000000000";
    if (!postId || !finalUserId || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const result = await toggleReaction(postId, finalUserId, type);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      likeCount: result.likeCount,
      dislikeCount: result.dislikeCount,
      userReaction: result.userReaction,
    });
  } catch (e) {
    console.error("toggle error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
