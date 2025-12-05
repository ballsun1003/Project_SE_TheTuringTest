// lib/aiService.ts

import OpenAI from "openai";

/**
 * ======================================================
 * AI Service (aiService.ts)
 * ======================================================
 * OpenAI Chat Completions API를 활용하여
 * 게시글 및 댓글 본문 자동 생성 / 재작성 기능을 제공한다.
 *
 * 주요 기능
 * ------------------------------------------------------
 * 1. createAIContent(prompt)
 *    - 새로운 게시글/댓글 본문을 AI가 자동 생성
 *    - 사용자의 입력(prompt)을 기반으로
 *      자연스럽고 매끄러운 문장을 생성하도록 유도
 *    - 모델: gpt-4o-mini
 *    - max_tokens: 600
 *
 * 2. updateAIContent(originalContent, prompt)
 *    - 기존 글을 참고하여 AI가 새로운 버전으로 재작성
 *    - 수정 요청(prompt)을 함께 전달하여 변경 방향 반영
 *    - 모델: gpt-4o-mini
 *    - max_tokens: 700
 *
 *
 * 보안 및 환경 설정
 * ------------------------------------------------------
 * - API Key는 서버 환경변수 process.env.OPENAI_API_KEY 사용
 * - 데이터는 OpenAI 서버에서 처리되며
 *   사용자 입력을 기반으로 생성된 콘텐츠 반환
 *
 *
 * 역할/목적
 * ------------------------------------------------------
 * - 사용자 편의성을 위해 글쓰기 부담 감소
 * - AI 기반 자동화된 콘텐츠 생성 및 수정 기능 제공
 * - 게시글 CRUD 흐름에서 핵심 AI 로직 수행
 * ======================================================
 */


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ===============================
// 1. 게시글/댓글 생성용 AI
// ===============================
export async function createAIContent(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o",   // 원하는 모델로 변경 가능
    messages: [
      {
        role: "system",
        content: "너는 글을 잘 쓰는 AI야. 사용자의 프롬프트를 기반으로 자연스럽고 매끄러운 게시글을 생성해."
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 600,
  });

  return response.choices[0].message.content || "";
}

// ===============================
// 2. 수정용 AI (기존 내용 → 새 버전으로 재작성)
// ===============================
export async function updateAIContent(
  originalContent: string,
  prompt: string
): Promise<string> {

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "너는 글을 자연스럽게 재작성하는 AI야. 기존 내용을 참고하고, 사용자의 요청에 맞게 글을 다시 작성해."
      },
      {
        role: "user",
        content:
          `원본 글:\n${originalContent}\n\n수정 요청:\n${prompt}`
      },
    ],
    max_tokens: 700,
  });

  return response.choices[0].message.content || "";
}
