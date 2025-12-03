// app/layout.tsx
import type { Metadata } from "next";
import "../globals.css";

/**
 * ======================================================
 * RootLayout (Global App Layout)
 * ======================================================
 * Next.js App Router 환경에서 전체 애플리케이션에
 * 공통 UI 레이아웃(헤더/푸터/전역 스타일)을 적용하는 최상위 레이아웃 컴포넌트.
 *
 * 전역 적용 요소
 * ------------------------------------------------------
 * - HTML 문서 언어(locale): ko (한국어)
 * - 전역 CSS(import "../globals.css")
 * - TailwindCSS 기반 레이아웃 스타일 지정
 *
 * UI 구성 구조
 * ------------------------------------------------------
 * <header>
 *   · 사이트 이름 표시 ("게시판 데모")
 *   · 상단 네비게이션 역할 (필요 시 확장 가능)
 *
 * <main>
 *   · 실제 페이지 컴포넌트(children)가 렌더링되는 영역
 *   · 가로 Max-Width 고정 → 중앙 정렬
 *
 * <footer>
 *   · 저작권 및 푸터 표시
 *   · 연도 자동 갱신
 *
 * 메타데이터 설정
 * ------------------------------------------------------
 * - title: 페이지 기본 제목
 * - description: 웹사이트 설명
 *
 * 목적
 * ------------------------------------------------------
 * - 페이지 간 일관된 레이아웃 유지
 * - 모든 페이지를 감싸는 UI 틀 제공
 * - 확장 가능한 전역 Navigation 및 Footer의 기반 구성
 * ======================================================
 */


export const metadata: Metadata = {
  title: "게시판 데모",
  description: "Next.js App Router 기본 레이아웃",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4">
            <h1 className="text-xl font-semibold">게시판 데모</h1>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>

        <footer className="mt-12 border-t bg-white">
          <div className="mx-auto max-w-4xl px-4 py-4 text-sm text-gray-500">
            © {new Date().getFullYear()} MyBoard
          </div>
        </footer>
      </body>
    </html>
  );
}
