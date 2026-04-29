'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Não verificar na página de login
    if (pathname === '/admin/login') {
      return;
    }

    // Verificar autenticação
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
