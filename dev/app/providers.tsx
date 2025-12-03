'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ReactNode, useMemo, useState } from 'react';

/**
 * ======================================================
 * Providers Component (Providers.tsx)
 * ======================================================
 * Supabase 클라이언트 및 인증 세션 관리를
 * 앱 전역에서 사용할 수 있도록 감싸주는 Provider 컴포넌트.
 * (클라이언트 환경에서만 동작)
 *
 * 구현 요소
 * ------------------------------------------------------
 * - createBrowserClient():
 *     브라우저 환경에서 Supabase 클라이언트 생성
 * - SessionContextProvider:
 *     Supabase 인증 세션을 React Context로 관리하여
 *     하위 컴포넌트에서 접근 가능하도록 설정
 *
 * 환경 변수
 * ------------------------------------------------------
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY
 * → 설정되지 않은 경우 오류 발생
 *
 * 성능 최적화
 * ------------------------------------------------------
 * - children을 useMemo로 메모이징하여
 *   리렌더링 시 불필요한 자식 컴포넌트 재생성 방지
 *
 * 사용 목적
 * ------------------------------------------------------
 * - Supabase 기반 인증 및 DB 접근 기능을
 *   전역적으로 사용할 수 있도록 설정
 * - Next.js 전역 Provider로 사용
 *
 * 주의 사항
 * ------------------------------------------------------
 * - "use client" 지시문 포함 → 클라이언트 전용 컴포넌트
 * - 서버 컴포넌트에서는 사용 불가
 * ======================================================
 */


export function Providers({ children }: { children: ReactNode }) {
  const [supabase] = useState(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase environment variables are not set.');
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  });

  const memoizedChildren = useMemo(() => children, [children]);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      {memoizedChildren}
    </SessionContextProvider>
  );
}
