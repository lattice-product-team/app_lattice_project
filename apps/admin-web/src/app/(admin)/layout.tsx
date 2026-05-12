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
    <div className="relative h-screen w-full overflow-hidden bg-eggshell flex flex-col">
      {/* Floating Logout - Fixed Left */}
      <div className="fixed top-8 left-12 z-[110]">
        <FloatingLogout />
      </div>

      {/* Floating Nav - Mathematically Centered */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
        <FloatingNav />
      </div>

      {/* Main Content Canvas - Full screen to allow maps/backgrounds to show behind nav */}
      <main className="flex-1 w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
