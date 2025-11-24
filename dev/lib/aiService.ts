// lib/aiService.ts

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ===============================
// 1. 게시글/댓글 생성용 AI
// ===============================
export async function createAIContent(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",   // 원하는 모델로 변경 가능
    messages: [
      {
        role: "system",
        content: "너는 글을 잘 쓰는 AI야. 사용자의 프롬프트를 기반으로 자연스럽고 매끄러운 문장을 생성해."
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
