import ReCAPTCHA from "react-google-recaptcha";

export default function Captcha() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function handleCaptchaChange(token: string | null): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="captcha"
        className="block text-sm font-medium text-gray-700"
      >
        Captcha
      </label>

      <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm text-gray-600 bg-gray-50">
        {siteKey ? (
          <ReCAPTCHA sitekey={siteKey} onChange={handleCaptchaChange} />
        ) : (
          <p className="text-xs text-red-500">
            reCAPTCHA sitekey가 설정되지 않았습니다(.env.local 확인).
          </p>
        )}
      </div>
    </div>
  );
}
