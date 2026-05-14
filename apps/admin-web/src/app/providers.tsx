'use client';

import { RouterProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider navigate={router.push}>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </RouterProvider>
    </NextThemesProvider>
  );
}
