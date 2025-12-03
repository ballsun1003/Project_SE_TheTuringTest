/**
 * ============================================
 * verifyTurnstile(token: string)
 * ============================================
 * Cloudflare Turnstile CAPTCHA 검증을 수행한다.
 *
 * 동작 방식:
 * - 클라이언트에서 전달한 Turnstile 응답 토큰(response)을
 *   Cloudflare 검증 API로 전송하여 유효성을 확인한다.
 *
 * 요청 정보:
 * - URL: https://challenges.cloudflare.com/turnstile/v0/siteverify
 * - Method: POST
 * - Body:
 *    {
 *      secret: TURNSTILE_SECRET_KEY (서버 환경변수),
 *      response: token (클라이언트 제공)
 *    }
 *
 * 반환값:
 * - true  → CAPTCHA 검증 성공
 * - false → 실패 또는 예외 발생
 *
 * 보안 요소:
 * - Turnstile Secret Key는 서버 환경변수(process.env)에서 읽어옴
 * - 검증 실패 시 API는 토큰이 위조/만료/잘못된 경우를 차단
 *
 * 목적:
 * - 자동 가입 방지, 봇 공격 방어 등 사용자 인증 절차 보호
 * ============================================
 */



export async function verifyTurnstile(token: string) {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY!;
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch (err) {
    console.error("Turnstile error:", err);
    return false;
  }
}
