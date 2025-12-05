"use client";

import { useState } from "react";
import Turnstile from "react-turnstile";

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
