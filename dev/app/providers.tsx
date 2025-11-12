'use client';

import { createBrowserClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ReactNode, useMemo, useState } from 'react';

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
