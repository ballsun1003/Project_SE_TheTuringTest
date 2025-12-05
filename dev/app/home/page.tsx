"use client";

import { useEffect, useState } from "react";
import BoardPreview from "@/components/boardPreview";
import HomeButton from "@/components/homeButton";
import ProtectedLink from "@/components/ProtectedLink";
import AuthHeader from "@/components/AuthHeader";
import Link from "next/link";
import SystemNoti from "@/components/SystemNoti";

export default function HomePage() {
  return (
    <main className={`min-h-screen`}>
      {/* 시스템 공지 */}
      <SystemNoti></SystemNoti>

      <section className="mx-auto max-w-5xl space-y-6 p-10">
        {/* 헤더 + 홈 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HomeButton />
            <p className="text-gray-600">The Turing Test</p>
          </div>

          {/* 로그인 / 회원 정보 헤더 */}
          <AuthHeader />
        </div>

        {/* 네비 버튼 */}
        <div className="flex gap-3">
          <Link
            href="/board/all"
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
          <ProtectedLink
            href="/userProfile/me"
            className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
          >
            프로필
          </ProtectedLink>

          <ProtectedLink
            href="/notiList"
            className="inline-flex items-center rounded-lg border px-3 py-2 hover:bg-gray-100"
          >
            알림 목록
          </ProtectedLink>
        </div>

        {/* ⭐ 인기 게시글 + 카테고리별 최신글 */}
        <BoardPreview />
      </section>
    </main>
  );
}
