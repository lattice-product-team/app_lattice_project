'use client';

import { usePathname } from 'next/navigation';
import { FloatingNav, FloatingLogout } from '@/components/floating-nav';

export function FloatingWrapper() {
  const pathname = usePathname();
  
  // Hide old floating elements on the redesigned map page
  if (pathname === '/') return null;

  return (
    <>
      {/* Floating Logout - Responsive Position */}
      <div className="fixed bottom-8 left-8 sm:top-8 sm:left-12 sm:bottom-auto z-[110]">
        <FloatingLogout />
      </div>

      {/* Floating Nav - Mathematically Centered */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 sm:top-8 z-[100]">
        <FloatingNav />
      </div>
    </>
  );
}
