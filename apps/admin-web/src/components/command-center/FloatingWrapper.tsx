'use client';

import { usePathname } from 'next/navigation';
import { FloatingNav, FloatingLogout } from '@/components/floating-nav';

export function FloatingWrapper() {
  const pathname = usePathname();
  
  // Keep floating elements visible across all admin pages

  return (
    <>
      {/* Floating Logout - Responsive Position */}
      <div className="fixed bottom-8 left-8 sm:top-8 sm:left-12 sm:bottom-auto z-[110] pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingLogout />
        </div>
      </div>

      {/* Floating Nav - Mathematically Centered */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 sm:top-8 sm:bottom-auto z-[100] pointer-events-none">
        <div className="pointer-events-auto">
          <FloatingNav />
        </div>
      </div>
    </>
  );
}
