'use client';

import { RouterProvider } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { SidebarProvider } from '@/hooks/use-sidebar';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <RouterProvider navigate={router.push}>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </RouterProvider>
  );
}
