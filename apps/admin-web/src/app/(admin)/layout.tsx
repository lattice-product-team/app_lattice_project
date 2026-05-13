import { FloatingNav, FloatingLogout } from '@/components/floating-nav';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const email = session?.email || 'admin@lattice.studio';
  const displayName = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-eggshell flex flex-col font-sans antialiased">
      {/* Floating Logout - Responsive Position */}
      <div className="fixed bottom-8 left-8 sm:top-8 sm:left-12 sm:bottom-auto z-[110]">
        <FloatingLogout />
      </div>

      {/* Floating Nav - Mathematically Centered */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 sm:top-8 z-[100]">
        <FloatingNav />
      </div>

      {/* Main Content Canvas - Full screen to allow maps/backgrounds to show behind nav */}
      <main 
        className="flex-1 w-full overflow-y-auto"
        style={{ paddingTop: 'var(--admin-safe-area)' }}
      >
        {children}
      </main>
    </div>
  );
}
