export default function SystemNoti() {
  return (
    <div className="border-b bg-yellow-50 text-xs text-yellow-900">
      <div className="mx-auto max-w-5xl overflow-hidden">
        <div className="marquee whitespace-nowrap py-2">
          <span className="mx-6">
            [공지] 서비스 베타 테스트 중입니다. 피드백은 언제나 환영합니다!
          </span>
          <span className="mx-6">
            [점검] 매주 일요일 새벽 3시 ~ 4시에는 정기 점검이 진행됩니다.
          </span>
          <span className="mx-6">
            [이벤트] 지금 회원 가입하면 특별 뱃지를 드립니다 🎉
          </span>
        </div>
      </div>
      {/* 🚚 시스템 공지용 마퀴 애니메이션 스타일 */}
      <style jsx>{`
        .marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
