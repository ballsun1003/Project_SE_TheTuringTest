import BoardPreview from "@/components/boardPreview";
import HomeButton from "@/components/homeButton";
import ProtectedLink from "@/components/ProtectedLink";
import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";

/**
 * ======================================================
 * HomePage (메인 화면)
 * ======================================================
 * 사용자 로그인 여부에 따라 접근 가능한 메뉴가 달라지는
 * 서비스의 진입점 UI를 제공하는 컴포넌트.
 *
 * 구성 요소
 * ------------------------------------------------------
 * - HomeButton : 사이트 타이틀 버튼 ("/" 이동)
 * - AuthHeader : 로그인/로그아웃 UI 표시
 * - ProtectedLink : 로그인 필요 기능 보호 (글작성 / 프로필 / 알림)
 * - BoardPreview : 좋아요 상위 게시글 요약 목록
 *
 * 주요 역할
 * ------------------------------------------------------
 * 1. 게시판으로 이동할 수 있는 네비게이션 제공
 * 2. 로그인 사용자에게만 글 작성 / 프로필 / 알림 접근 허용
 * 3. 인기 게시글 미리보기로 최신 활동 제공
 *
 * UX 특징
 * ------------------------------------------------------
 * - 헤더 우측에서 인증 상태가 즉시 반영(AuthHeader)
 * - ProtectedLink를 통해 로그인 흐름 자연 유도
 * - 메인 기능을 바로 탐색할 수 있는 단순 인터페이스
 *
 * 관련 라우팅
 * ------------------------------------------------------
 * - /board/all : 전체 게시판 목록
 * - /postCreate : 게시글 생성 페이지 (로그인 필요)
 * - /userProfile/me : 내 프로필 (로그인 필요)
 * - /notiList : 알림 목록 (로그인 필요)
 *
 * 사용 대상 문서
 * ------------------------------------------------------
 * - UI 설계서
 * - SDS: 기능 흐름도 (ProtectedLink 인증 흐름)
 * ======================================================
 */


export default function HomePage() {

  return (
    <section className="space-y-6 m-10">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HomeButton />
          <p className="text-gray-600">The Turing Test</p>
        </div>

        <AuthHeader />
      </div>

      {/* 네비 버튼 */}
      <div className="flex gap-3">
        <Link href="/board/all"
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          게시판 보기
        </Link>

        <ProtectedLink
          href="/postCreate"
          className="inline-flex items-center rounded-lg border px-4 py-2 hover:bg-gray-100"
        >
          글 작성하기
        </ProtectedLink>
      </div>

      {/* 알림 + 프로필 */}
      <div className="flex gap-3">
        <ProtectedLink href="/userProfile/me"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          프로필
        </ProtectedLink>

        <ProtectedLink href="/notiList"
          className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
        >
          알림 목록
        </ProtectedLink>
      </div>

      <BoardPreview />
    </section>
  );
}
