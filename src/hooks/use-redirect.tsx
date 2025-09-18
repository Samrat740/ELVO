
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useRedirect(path: string) {
  const router = useRouter();

  useEffect(() => {
    router.replace(path);
  }, [router, path]);
}
