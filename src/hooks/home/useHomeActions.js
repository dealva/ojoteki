'use client';

import { useRouter } from 'next/navigation';

export default function useHomeActions() {
  const router = useRouter();

  const goToCatalog = () => router.push('/catalog');
  const goToLogin = () => router.push('/login');

  return {
    goToCatalog,
    goToLogin,
  };
}
