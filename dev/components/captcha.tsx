"use client";

import { useState } from "react";
import Turnstile from "react-turnstile";

/**
 * ======================================================
 * Captcha Component (Captcha.tsx)
 * ======================================================
 * Cloudflare Turnstile 기반의 CAPTCHA UI 제공 컴포넌트.
 * 사용자 인증 과정에서 봇(자동화 공격)을 방지하기 위해 사용한다.
 *
 * 기능 요약
 * ------------------------------------------------------
 * - Turnstile 위젯을 렌더링하고 토큰 발급을 처리
 * - 발급된 토큰을 hidden input으로 form에 포함시켜 전달
 * - 클라이언트 컴포넌트("use client")로 실행
 *
 * 주요 동작
 * ------------------------------------------------------
 * - Turnstile 컴포넌트 onVerify 이벤트 발생 시
 *   → token 상태에 저장
 * - 제출 시 서버 측 verifyTurnstile() 함수에서
 *   토큰 유효성 검사 수행
 *
 * Props / 상태
 * ------------------------------------------------------
 * - siteKey: 환경변수 NEXT_PUBLIC_TURNSTILE_SITE_KEY 활용
 *   (공개 가능한 클라이언트용 키)
 * - token: Turnstile이 발급한 CAPTCHA 인증 토큰
 *
 * UI 구성 요소
 * ------------------------------------------------------
 * - 레이블: Captcha 표시
 * - Turnstile 위젯 렌더링 영역
 * - hidden input(name="captcha"): FormData 전달용
 *
 * 목적
 * ------------------------------------------------------
 * - 회원가입/로그인 보호
 * - 자동화 봇 공격 및 스팸 요청 방어
 * ======================================================
 */


export default function Captcha() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
  const [token, setToken] = useState("");
  return (
     <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Captcha
      </label>

      {/* Turnstile 위젯 */}
      <div className="rounded-md border bg-gray-50 px-3 py-2">
        <Turnstile
          sitekey={siteKey}
          theme="light"      
          size="normal"
          appearance="always"
          fixedSize
          onVerify={(value) => setToken(value || "")}
          onExpire={() => setToken("")}
          onError={() => setToken("")}
        />
      </div>

      {/* ✅ 이 hidden input이 FormData에서 읽히는 실제 값 */}
      <input type="hidden" name={"captcha"} value={token} />
    </div>
  );
}
