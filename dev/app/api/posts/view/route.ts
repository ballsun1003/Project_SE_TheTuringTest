
import { NextResponse } from "next/server";
import { increaseViewCount } from "@/lib/postService";

/**
 * ======================================================
 * INCREASE POST VIEW COUNT API
 * ======================================================
 * Route: POST /api/posts/view
 *
 * 기능 요약
 * ------------------------------------------------------
 * 🔹 게시글 조회수 +1 증가
 * 🔹 페이지 방문 시 항상 호출됨
 *
 * 요청 Body(JSON)
 * ------------------------------------------------------
 * {
 *   postId: string   // 조회 증가할 게시글 ID (필수)
 * }
 *
 * 응답(JSON)
 * ------------------------------------------------------
 * {
 *   id: string,       // 게시글 ID
 *   viewCount: number // 최신 조회수
 * }
 *
 * Error 반환 예시
 * ------------------------------------------------------
 * { error: "Missing postId" }  ← 필수값 누락 (400)
 * { error: "DB Update Fail" }  ← DB 오류 등 (500)
 *
 * 내부 동작 흐름
 * ------------------------------------------------------
 * 1️⃣ 요청에서 postId 추출
 * 2️⃣ increaseViewCount(postId) 실행
 * 3️⃣ Post 엔티티를 JSON으로 변환 및 반환
 *
 * 보안 관련 참고
 * ------------------------------------------------------
 * 🚫 인증 필요 없음 → 공개 게시판이므로 문제 없음
 * 📈 비정상적인 증가 방지 필요 → 추후 개선(중복 방문 체크)
 *
 * 관련 UI 컴포넌트
 * ------------------------------------------------------
 * - PostDetailPage: 게시글 열람 시 즉시 호출
 * ======================================================
 */


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


